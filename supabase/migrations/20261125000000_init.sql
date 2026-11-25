-- Corsia Sicura – initial schema
-- Run in Supabase: SQL Editor > New query > paste > Run. Then run supabase/seed.sql.

-- Catalogue ---------------------------------------------------------------

create table if not exists public.seasons (
  id smallint primary key,
  title text not null,
  subtitle text not null
);

create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  num smallint not null unique check (num between 1 and 99),
  season_id smallint not null references public.seasons (id),
  release_month smallint not null check (release_month between 1 and 36),
  title text not null,
  topic text not null,
  area text not null,
  duration_min smallint not null check (duration_min between 1 and 15),
  extra_code text,
  mandatory_profiles text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  version text not null default '1.0',
  review_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Organisation and people -------------------------------------------------

create table if not exists public.structures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null check (kind in ('direzione_generale', 'struttura_territoriale', 'societa_controllata')),
  parent_id uuid references public.structures (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  structure_id uuid references public.structures (id) on delete set null,
  profile text check (profile in ('operativo', 'amministrativo', 'management')),
  role text not null default 'learner' check (role in ('learner', 'manager', 'admin', 'editor')),
  created_at timestamptz not null default now()
);

-- Learning records --------------------------------------------------------

create table if not exists public.episode_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  episode_id uuid not null references public.episodes (id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  current_node text,
  score smallint check (score between 0 and 100),
  passed boolean,
  attempts smallint not null default 0,
  time_spent_s integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, episode_id)
);

create table if not exists public.decision_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  episode_id uuid not null references public.episodes (id) on delete cascade,
  node_id text not null,
  option_id text not null,
  correct boolean not null,
  points smallint not null default 0,
  risk_tag text,
  created_at timestamptz not null default now()
);

create index if not exists decision_events_episode_idx on public.decision_events (episode_id, node_id);

-- Helpers -----------------------------------------------------------------

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor', 'manager')
  );
$$;

-- Create a profile row for every new auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security ------------------------------------------------------

alter table public.seasons enable row level security;
alter table public.episodes enable row level security;
alter table public.structures enable row level security;
alter table public.profiles enable row level security;
alter table public.episode_progress enable row level security;
alter table public.decision_events enable row level security;

-- Catalogue: anyone can read published content; staff can read everything.
drop policy if exists "seasons readable" on public.seasons;
create policy "seasons readable" on public.seasons
  for select to anon, authenticated using (true);

drop policy if exists "published episodes readable" on public.episodes;
create policy "published episodes readable" on public.episodes
  for select to anon, authenticated using (status = 'published' or public.is_staff());

-- Structures: signed-in users can read.
drop policy if exists "structures readable" on public.structures;
create policy "structures readable" on public.structures
  for select to authenticated using (true);

-- Profiles: own row; staff read all.
drop policy if exists "own profile readable" on public.profiles;
create policy "own profile readable" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_staff());

drop policy if exists "own profile name editable" on public.profiles;
create policy "own profile name editable" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Progress and decisions: learners write their own; staff read all.
drop policy if exists "own progress readable" on public.episode_progress;
create policy "own progress readable" on public.episode_progress
  for select to authenticated using (user_id = auth.uid() or public.is_staff());

drop policy if exists "own progress insert" on public.episode_progress;
create policy "own progress insert" on public.episode_progress
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "own progress update" on public.episode_progress;
create policy "own progress update" on public.episode_progress
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "own decisions readable" on public.decision_events;
create policy "own decisions readable" on public.decision_events
  for select to authenticated using (user_id = auth.uid() or public.is_staff());

drop policy if exists "own decisions insert" on public.decision_events;
create policy "own decisions insert" on public.decision_events
  for insert to authenticated with check (user_id = auth.uid());

-- Learners must not change their own role or profile type.
revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;
