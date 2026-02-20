-- Allow public read access to published menus, their categories, and items
create policy "Public can read published menus"
  on public.menus for select
  using (is_published = true);

create policy "Public can read categories of published menus"
  on public.categories for select
  using (exists (
    select 1 from public.menus where menus.id = categories.menu_id and menus.is_published = true
  ));

create policy "Public can read items of published menus"
  on public.items for select
  using (exists (
    select 1 from public.categories
    join public.menus on menus.id = categories.menu_id
    where categories.id = items.category_id and menus.is_published = true
  ));

-- Function to increment menu views
create or replace function public.increment_menu_views(menu_id_input uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update menus set views = views + 1 where id = menu_id_input;
end;
$$;
