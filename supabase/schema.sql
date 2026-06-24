-- ============================================================
-- LAVA Insurance CRM Simulator — Supabase schema
-- Run this once in your Supabase project: SQL Editor -> New query -> paste -> Run.
--
-- Model:
--   app_state   = ONE shared training dataset every signed-in trainee can read/write
--                 (leads, accounts, tasks, alerts, customers/policies, quotes, etc.)
--   user_state  = each trainee's own progress/preferences (training checklist,
--                 scenario scores, sticky note, dashboard layout)
-- Each row stores a JSON document keyed by a short name, mirroring how the app
-- already saves whole collections at once.
-- ============================================================

-- Shared, app-wide training data --------------------------------------------
create table if not exists public.app_state (
  key         text primary key,
  data        jsonb not null default '[]'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users (id) on delete set null
);

-- Per-trainee preferences and progress --------------------------------------
create table if not exists public.user_state (
  user_id     uuid not null references auth.users (id) on delete cascade,
  key         text not null,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (user_id, key)
);

-- Row Level Security ---------------------------------------------------------
alter table public.app_state  enable row level security;
alter table public.user_state enable row level security;

-- Shared data: any signed-in (authenticated) trainee may read and write it.
drop policy if exists "app_state select" on public.app_state;
drop policy if exists "app_state insert" on public.app_state;
drop policy if exists "app_state update" on public.app_state;
drop policy if exists "app_state delete" on public.app_state;

create policy "app_state select" on public.app_state
  for select to authenticated using (true);
create policy "app_state insert" on public.app_state
  for insert to authenticated with check (true);
create policy "app_state update" on public.app_state
  for update to authenticated using (true) with check (true);
create policy "app_state delete" on public.app_state
  for delete to authenticated using (true);

-- Per-user data: a trainee may only touch their own rows.
drop policy if exists "user_state select" on public.user_state;
drop policy if exists "user_state insert" on public.user_state;
drop policy if exists "user_state update" on public.user_state;
drop policy if exists "user_state delete" on public.user_state;

create policy "user_state select" on public.user_state
  for select to authenticated using (auth.uid() = user_id);
create policy "user_state insert" on public.user_state
  for insert to authenticated with check (auth.uid() = user_id);
create policy "user_state update" on public.user_state
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_state delete" on public.user_state
  for delete to authenticated using (auth.uid() = user_id);
