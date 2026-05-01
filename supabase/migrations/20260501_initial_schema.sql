-- Dim Hour — full schema bootstrap for the new Supabase project.
--
-- Reconstructed from how the codebase uses each table. Apply once on a fresh
-- project. Idempotent (CREATE IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).
--
-- Apply via Supabase SQL editor (paste this whole file) or `supabase db push`.

-- ============================================================================
-- 1. trips
-- ============================================================================
-- Shared/joinable trips, identified by a 6-char share code. All trip state
-- (members, restaurants, bills, itinerary, budget, checklist) lives in jsonb
-- columns on this single row — no child tables. Realtime UPDATE events feed
-- the active-trip subscription in index.html (TRIPS.subscribe).
create table if not exists public.trips (
  id              uuid        primary key default gen_random_uuid(),
  code            text        unique not null,
  name            text,
  city            text,                                  -- comma-joined cities (legacy schema)
  created_by      text        not null,                  -- device_id
  members         jsonb       not null default '[]'::jsonb,
  restaurants     jsonb       not null default '[]'::jsonb,
  bills           jsonb       not null default '[]'::jsonb,
  reservations    jsonb       not null default '[]'::jsonb,
  trip_data       jsonb,                                 -- {itinerary, budget, checklist}
  concierge_brief jsonb,                                 -- vibe-builder output
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists trips_code_idx       on public.trips (code);
create index if not exists trips_created_by_idx on public.trips (created_by);

-- Anon key has full access — there's no Supabase auth on trips, the trust
-- model is "anyone with the 6-char code can join". Same as the prior project.
alter table public.trips enable row level security;

drop policy if exists trips_anon_all on public.trips;
create policy trips_anon_all on public.trips
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- ============================================================================
-- 2. gmail_connections
-- ============================================================================
-- One row per device that has connected Gmail. Stores the long-lived
-- refresh_token plus the most recent access_token. Touched ONLY by the
-- gmail-* edge functions using the service_role key.
create table if not exists public.gmail_connections (
  device_id               text        primary key,
  refresh_token           text        not null,
  access_token            text,
  access_token_expires_at timestamptz,
  email_hint              text,
  last_sync_at            timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- RLS on, no policies = service_role only (anon and authenticated cannot read
-- refresh tokens). service_role bypasses RLS by default.
alter table public.gmail_connections enable row level security;

-- ============================================================================
-- 3. rate_limits
-- ============================================================================
-- Generic per-device rate-limit ledger. Edge functions insert a row on each
-- successful generation and count rows in the trailing window to throttle.
-- Currently used by vibe-builder (feature='vibe', 5/hour per device).
create table if not exists public.rate_limits (
  id           bigserial   primary key,
  device_id    text        not null,
  feature      text        not null,
  generated_at timestamptz not null default now()
);

create index if not exists rate_limits_lookup_idx
  on public.rate_limits (device_id, feature, generated_at desc);

alter table public.rate_limits enable row level security;

-- ============================================================================
-- 4. briefing_subscribers
-- ============================================================================
-- Newsletter signups (Dim Hour briefing email list). Anon key writes
-- directly — this is opt-in public, no sensitive data beyond email.
create table if not exists public.briefing_subscribers (
  id         bigserial   primary key,
  email      text        unique not null,
  name       text,
  active     boolean     not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists briefing_subscribers_email_idx
  on public.briefing_subscribers (email);

alter table public.briefing_subscribers enable row level security;

drop policy if exists briefing_subscribers_anon_all on public.briefing_subscribers;
create policy briefing_subscribers_anon_all on public.briefing_subscribers
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- ============================================================================
-- 5. updated_at triggers
-- ============================================================================
-- Cheap maintenance: keep updated_at fresh on every UPDATE.
create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at := now(); return new; end;
$$ language plpgsql;

drop trigger if exists trips_set_updated_at on public.trips;
create trigger trips_set_updated_at before update on public.trips
  for each row execute function public.set_updated_at();

drop trigger if exists gmail_connections_set_updated_at on public.gmail_connections;
create trigger gmail_connections_set_updated_at before update on public.gmail_connections
  for each row execute function public.set_updated_at();

drop trigger if exists briefing_subscribers_set_updated_at on public.briefing_subscribers;
create trigger briefing_subscribers_set_updated_at before update on public.briefing_subscribers
  for each row execute function public.set_updated_at();

-- ============================================================================
-- 6. Realtime
-- ============================================================================
-- index.html subscribes to UPDATE events on trips so joined members see
-- live changes (added restaurants, bills, members). Add trips to the
-- supabase_realtime publication.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'trips'
  ) then
    alter publication supabase_realtime add table public.trips;
  end if;
end $$;
