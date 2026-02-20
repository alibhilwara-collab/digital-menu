-- Add email column to profiles if missing
alter table public.profiles add column if not exists email text;

-- Update trigger to also save full_name and email
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, restaurant_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'restaurant_name', 'My Restaurant'),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
