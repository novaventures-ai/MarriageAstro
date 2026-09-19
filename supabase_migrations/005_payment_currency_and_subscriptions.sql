-- 005: record the currency of every payment, and support true recurring billing.
--
-- WHY CURRENCY
-- payment_history.amount was a bare integer in the smallest currency unit, with
-- nothing recording which currency. A domestic premium_monthly stored 39900
-- (Rs 399) and an international one stored 1499 ($14.99), and the admin revenue
-- tile summed amount/100 and prefixed a rupee sign — adding dollars to rupees.
-- Harmless while the product was domestic-only; wrong from the first
-- international sale on 2026-09-18.
--
-- WHY SUBSCRIPTION STATE
-- premium_monthly was sold as "/mo" but created a one-time order, so it never
-- renewed and access silently lapsed after 30 days. Recurring billing needs
-- somewhere to record the subscription's lifecycle, since a subscription can be
-- active, paused, halted after a failed charge, or cancelled but still paid up.

-- ---------------------------------------------------------------------------
-- payment_history.currency
-- ---------------------------------------------------------------------------

alter table public.payment_history
  add column if not exists currency text not null default 'INR';

alter table public.payment_history
  drop constraint if exists payment_history_currency_check;
alter table public.payment_history
  add constraint payment_history_currency_check check (currency in ('INR', 'USD'));

-- Backfill. The two pricing tables share no amount for the same plan_type, so
-- historical rows resolve without ambiguity:
--   INR  section 4900   full 16900   premium 39900   astrologer 149900
--   USD  section  499   full  1299   premium  1499   astrologer   3999
-- Anything unrecognised (including amount 0, written when the client omitted it)
-- stays INR: every such row predates international checkout going live.
update public.payment_history
set currency = 'USD'
where (plan_type, amount) in (
  ('section_unlock',      499),
  ('full_report_unlock', 1299),
  ('premium_monthly',    1499),
  ('astrologer_monthly', 3999)
);

comment on column public.payment_history.currency is
  'ISO-4217 code for the amount column. Amount is in the smallest unit: paise for INR, cents for USD.';

-- ---------------------------------------------------------------------------
-- Subscription lifecycle on profiles
-- ---------------------------------------------------------------------------

-- razorpay_subscription_id already exists; these record what state it is in.
alter table public.profiles
  add column if not exists subscription_status text;

alter table public.profiles
  drop constraint if exists profiles_subscription_status_check;
alter table public.profiles
  add constraint profiles_subscription_status_check check (
    subscription_status is null or subscription_status in (
      'created', 'authenticated', 'active', 'pending',
      'halted', 'cancelled', 'completed', 'expired'
    )
  );

comment on column public.profiles.subscription_status is
  'Razorpay subscription state. NULL means no recurring mandate — the plan was '
  'bought as a one-time 30-day order, which is the only option for non-INR '
  'cards because e-mandates require an India-issued card in INR.';

-- A charge belongs to a subscription cycle, not a one-off order.
alter table public.payment_history
  add column if not exists subscription_id text;

create index if not exists payment_history_subscription_id_idx
  on public.payment_history (subscription_id)
  where subscription_id is not null;

-- Finding subscriptions due to lapse (for renewal reminders) should not scan.
create index if not exists profiles_plan_expires_at_idx
  on public.profiles (plan_expires_at)
  where plan_expires_at is not null;
