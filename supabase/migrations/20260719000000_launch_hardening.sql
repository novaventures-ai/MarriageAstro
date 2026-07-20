-- Launch hardening — applied to the remote project on 2026-07-19.
-- Recorded here for version control; already live in production.

-- ── Rate limiting: atomic quota (fixes read-then-write race) + OAuth counting ──
create table if not exists public.usage_counters (
  id text primary key,
  calls_today integer not null default 0,
  calls_month integer not null default 0,
  last_reset_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.usage_counters enable row level security;
-- No policies: only the SECURITY DEFINER functions (service_role) touch it.

create or replace function public.consume_quota(p_id text, p_daily_limit integer)
returns table(is_allowed boolean, used_today integer)
language plpgsql security definer set search_path = public
as $$
declare v_calls_today integer; v_last_reset timestamptz; v_needs_reset boolean;
begin
  insert into public.usage_counters(id) values (p_id) on conflict (id) do nothing;
  select uc.calls_today, uc.last_reset_at into v_calls_today, v_last_reset
    from public.usage_counters uc where uc.id = p_id for update;
  v_needs_reset := (now() - v_last_reset) > interval '24 hours';
  if v_needs_reset then v_calls_today := 0; end if;
  if v_calls_today >= p_daily_limit then
    return query select false, v_calls_today; return;
  end if;
  if v_needs_reset then
    update public.usage_counters set calls_today = 1, calls_month = usage_counters.calls_month + 1,
      last_reset_at = now(), updated_at = now() where id = p_id;
    return query select true, 1;
  else
    update public.usage_counters set calls_today = usage_counters.calls_today + 1,
      calls_month = usage_counters.calls_month + 1, updated_at = now() where id = p_id;
    return query select true, v_calls_today + 1;
  end if;
end; $$;
revoke all on function public.consume_quota(text, integer) from public, anon, authenticated;

create or replace function public.consume_api_key_quota(p_key_id uuid, p_daily_limit integer)
returns table(is_allowed boolean, used_today integer)
language plpgsql security definer set search_path = public
as $$
declare v_calls_today integer; v_last_reset timestamptz; v_needs_reset boolean;
begin
  select ak.calls_today, ak.last_reset_at into v_calls_today, v_last_reset
    from public.api_keys ak where ak.id = p_key_id for update;
  if not found then return query select false, 0; return; end if;
  v_needs_reset := (now() - v_last_reset) > interval '24 hours';
  if v_needs_reset then v_calls_today := 0; end if;
  if v_calls_today >= p_daily_limit then return query select false, v_calls_today; return; end if;
  if v_needs_reset then
    update public.api_keys set calls_today = 1, calls_month = api_keys.calls_month + 1,
      last_reset_at = now() where id = p_key_id;
    return query select true, 1;
  else
    update public.api_keys set calls_today = api_keys.calls_today + 1,
      calls_month = api_keys.calls_month + 1 where id = p_key_id;
    return query select true, v_calls_today + 1;
  end if;
end; $$;
revoke all on function public.consume_api_key_quota(uuid, integer) from public, anon, authenticated;

-- ── API key hashing (dual-path: legacy plaintext keys still validate) ──
alter table public.api_keys add column if not exists key_hash text;
alter table public.api_keys add column if not exists key_prefix text;
alter table public.api_keys alter column key drop not null;
create index if not exists api_keys_key_hash_idx on public.api_keys (key_hash);

-- ── payment_history: remove the public USING(true) ALL policy (data-exposure hole) ──
drop policy if exists "Service role can manage all payments" on public.payment_history;
-- service_role bypasses RLS; "Users can view their own payment history" stays.

-- ── Tighten open INSERT policies ──
drop policy if exists "Anon insert push subs" on public.push_subscriptions;
create policy "Anon insert push subs" on public.push_subscriptions
  for insert to anon with check (user_id is null);
drop policy if exists "Anyone can join waitlist" on public.waitlist;
drop policy if exists "Users can view own waitlist entry" on public.waitlist;

-- ── Covering indexes for unindexed foreign keys ──
create index if not exists affiliates_user_id_idx on public.affiliates (user_id);
create index if not exists partner_comparisons_user_id_idx on public.partner_comparisons (user_id);
create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions (user_id);
create index if not exists api_keys_user_id_idx on public.api_keys (user_id);
create index if not exists report_unlocks_user_id_idx on public.report_unlocks (user_id);

-- ── Lock down SECURITY DEFINER functions from anon RPC access ──
revoke execute on function public.handle_new_user() from anon, authenticated;
do $$ begin
  if exists (select 1 from pg_proc where proname = 'rls_auto_enable' and pronamespace = 'public'::regnamespace) then
    execute 'revoke execute on function public.rls_auto_enable() from anon, authenticated';
  end if;
end $$;
alter function public.handle_new_user() set search_path = public;
