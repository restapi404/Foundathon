-- ============================================
-- VERDANT — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text check (role in ('founder', 'investor', 'researcher', 'talent')) default 'founder',
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Profiles viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'founder')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Startups table
create table public.startups (
  id uuid default gen_random_uuid() primary key,
  founder_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  tagline text,
  description text,
  sector text check (sector in (
    'Solar', 'Wind', 'Carbon Capture', 'EV',
    'Climate Data', 'Sustainable Agriculture', 'Geothermal', 'Ocean Energy'
  )),
  stage text check (stage in ('Idea', 'Prototype', 'Early Startup', 'Scaling')),
  location text,
  funding_needed text,
  website text,
  team_size integer,
  created_at timestamp with time zone default now()
);

alter table public.startups enable row level security;

create policy "Startups viewable by everyone"
  on public.startups for select using (true);

create policy "Founders can insert own startups"
  on public.startups for insert with check (auth.uid() = founder_id);

create policy "Founders can update own startups"
  on public.startups for update using (auth.uid() = founder_id);

create policy "Founders can delete own startups"
  on public.startups for delete using (auth.uid() = founder_id);


-- ============================================
-- OPTIONAL: Seed some demo data
-- (Replace founder_id with a real user id after signing up)
-- ============================================
/*
insert into public.startups (founder_id, name, tagline, description, sector, stage, location, funding_needed) values
(
  'YOUR-USER-ID-HERE',
  'SolarGrid Africa',
  'Affordable distributed solar for rural communities',
  'We deploy modular solar microgrids to underserved rural communities across East Africa, providing reliable electricity access while generating verified carbon credits.',
  'Solar', 'Early Startup', 'Nairobi, Kenya', '$500k–$2M'
),
(
  'YOUR-USER-ID-HERE',
  'CarbonVault',
  'Direct air capture at 10x lower cost',
  'Our proprietary sorbent material reduces the energy cost of direct air carbon capture by 10x, making gigaton-scale removal economically viable.',
  'Carbon Capture', 'Prototype', 'Bangalore, India', '$50k–$500k'
);
*/
