-- API keys for MCP server and RapidAPI access
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  user_id uuid references public.profiles(id) on delete set null,
  tier text not null default 'free' check (tier in ('free', 'developer', 'premium')),
  label text,
  calls_today integer not null default 0,
  calls_month integer not null default 0,
  last_reset_at timestamptz not null default now(),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Index for fast key lookup on every request
create index if not exists api_keys_key_idx on public.api_keys (key);
create index if not exists api_keys_user_idx on public.api_keys (user_id);

-- RLS: users can only see their own keys
alter table public.api_keys enable row level security;

create policy "Users can view own api keys"
  on public.api_keys for select
  using (auth.uid() = user_id);

create policy "Users can insert own api keys"
  on public.api_keys for insert
  with check (auth.uid() = user_id);

create policy "Users can update own api keys"
  on public.api_keys for update
  using (auth.uid() = user_id);

-- Service role can do everything (for server-side validation)
create policy "Service role full access"
  on public.api_keys for all
  using (auth.role() = 'service_role');

-- Daily reset function for call counts
create or replace function reset_api_key_daily_counts()
returns void language plpgsql security definer as $$
begin
  update public.api_keys
  set calls_today = 0, last_reset_at = now()
  where last_reset_at < now() - interval '1 day';
end;
$$;

-- Monthly reset function
create or replace function reset_api_key_monthly_counts()
returns void language plpgsql security definer as $$
begin
  update public.api_keys
  set calls_month = 0
  where date_trunc('month', last_reset_at) < date_trunc('month', now());
end;
$$;
