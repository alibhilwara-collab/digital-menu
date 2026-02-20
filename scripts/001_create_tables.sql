-- Profiles table (auto-created on signup via trigger)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  restaurant_name text,
  phone text,
  plan text default 'Basic',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Menus table
create table if not exists public.menus (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text default '',
  cover_image text default '',
  is_published boolean default false,
  views integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.menus enable row level security;

create policy "menus_select_own" on public.menus for select using (auth.uid() = user_id);
create policy "menus_insert_own" on public.menus for insert with check (auth.uid() = user_id);
create policy "menus_update_own" on public.menus for update using (auth.uid() = user_id);
create policy "menus_delete_own" on public.menus for delete using (auth.uid() = user_id);
-- Public can view published menus
create policy "menus_select_public" on public.menus for select using (is_published = true);

-- Categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.menus(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;

create policy "categories_select_own" on public.categories for select using (auth.uid() = user_id);
create policy "categories_insert_own" on public.categories for insert with check (auth.uid() = user_id);
create policy "categories_update_own" on public.categories for update using (auth.uid() = user_id);
create policy "categories_delete_own" on public.categories for delete using (auth.uid() = user_id);
-- Public can view categories of published menus
create policy "categories_select_public" on public.categories for select using (
  exists (select 1 from public.menus where menus.id = categories.menu_id and menus.is_published = true)
);

-- Items table
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null default 0,
  description text default '',
  image text default '',
  available boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.items enable row level security;

create policy "items_select_own" on public.items for select using (auth.uid() = user_id);
create policy "items_insert_own" on public.items for insert with check (auth.uid() = user_id);
create policy "items_update_own" on public.items for update using (auth.uid() = user_id);
create policy "items_delete_own" on public.items for delete using (auth.uid() = user_id);
-- Public can view items of published menus
create policy "items_select_public" on public.items for select using (
  exists (
    select 1 from public.categories c
    join public.menus m on m.id = c.menu_id
    where c.id = items.category_id and m.is_published = true
  )
);
