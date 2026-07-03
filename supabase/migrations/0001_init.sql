-- Reiseplanleggeren — Phase 1 schema
-- Run this in the Supabase SQL editor (or via the CLI) once.
-- Creates the `trips` and `trip_segments` tables plus row-level security so
-- every user can only ever read/write their own data.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- trips
-- ---------------------------------------------------------------------------
create table if not exists public.trips (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 200),
  description text,
  travel_date date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists trips_user_id_idx on public.trips (user_id);
create index if not exists trips_travel_date_idx on public.trips (travel_date);

drop trigger if exists trips_set_updated_at on public.trips;
create trigger trips_set_updated_at
  before update on public.trips
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- trip_segments
-- ---------------------------------------------------------------------------
create table if not exists public.trip_segments (
  id             uuid primary key default gen_random_uuid(),
  trip_id        uuid not null references public.trips (id) on delete cascade,
  position       integer not null default 0,
  transport_type text not null default 'other'
                 check (transport_type in
                   ('bus', 'train', 'ferry', 'car', 'walking', 'flight', 'other')),
  from_location  text not null default '',
  to_location    text not null default '',
  departure_time text, -- 'HH:MM' (24h). Stored as text so Phase 2 can widen it.
  arrival_time   text,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists trip_segments_trip_id_idx
  on public.trip_segments (trip_id);
create index if not exists trip_segments_trip_position_idx
  on public.trip_segments (trip_id, position);

drop trigger if exists trip_segments_set_updated_at on public.trip_segments;
create trigger trip_segments_set_updated_at
  before update on public.trip_segments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.trips enable row level security;
alter table public.trip_segments enable row level security;

-- trips: owner-only access
drop policy if exists "trips_select_own" on public.trips;
create policy "trips_select_own" on public.trips
  for select using (auth.uid() = user_id);

drop policy if exists "trips_insert_own" on public.trips;
create policy "trips_insert_own" on public.trips
  for insert with check (auth.uid() = user_id);

drop policy if exists "trips_update_own" on public.trips;
create policy "trips_update_own" on public.trips
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "trips_delete_own" on public.trips;
create policy "trips_delete_own" on public.trips
  for delete using (auth.uid() = user_id);

-- trip_segments: access allowed only when the parent trip belongs to the user
drop policy if exists "segments_select_own" on public.trip_segments;
create policy "segments_select_own" on public.trip_segments
  for select using (
    exists (
      select 1 from public.trips t
      where t.id = trip_segments.trip_id and t.user_id = auth.uid()
    )
  );

drop policy if exists "segments_insert_own" on public.trip_segments;
create policy "segments_insert_own" on public.trip_segments
  for insert with check (
    exists (
      select 1 from public.trips t
      where t.id = trip_segments.trip_id and t.user_id = auth.uid()
    )
  );

drop policy if exists "segments_update_own" on public.trip_segments;
create policy "segments_update_own" on public.trip_segments
  for update using (
    exists (
      select 1 from public.trips t
      where t.id = trip_segments.trip_id and t.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.trips t
      where t.id = trip_segments.trip_id and t.user_id = auth.uid()
    )
  );

drop policy if exists "segments_delete_own" on public.trip_segments;
create policy "segments_delete_own" on public.trip_segments
  for delete using (
    exists (
      select 1 from public.trips t
      where t.id = trip_segments.trip_id and t.user_id = auth.uid()
    )
  );
