-- Open House Companion — shared leads table
-- Run this once in your Supabase project: SQL Editor → New query → paste → Run.
--
-- Design: a few promoted columns for filtering/sorting (product, status,
-- created_at) plus the full form payload in a jsonb `data` column. This keeps
-- the schema resilient as the lead form evolves, and lets every product write
-- to the same table while staying easy to segment.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null    default now(),
  -- which front-end captured the lead: 'open-house' | 'social'
  product     text        not null    default 'open-house',
  -- pipeline status: 'new' | 'contacted' | 'active' | 'closed' | 'lost'
  status      text        not null    default 'new',
  -- full LeadFormData payload
  data        jsonb       not null    default '{}'::jsonb
);

-- Helpful indexes for the dashboard (filter by product/status, sort by date)
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_product_idx    on public.leads (product);
create index if not exists leads_status_idx     on public.leads (status);

-- Row Level Security: enabled, with NO public policies. The app talks to this
-- table only from the server using the service-role key, which bypasses RLS.
-- This means the anon/public key cannot read or write leads — leads stay private.
alter table public.leads enable row level security;
