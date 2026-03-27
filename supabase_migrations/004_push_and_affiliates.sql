-- Migration 004: Push Subscriptions + Affiliate Network
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ─── Push Subscriptions ──────────────────────────────────────────────────────
-- Stores Web Push subscription objects per user (one per user/device)

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription jsonb      NOT NULL,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own push subscription"
  ON push_subscriptions FOR ALL
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ─── Affiliates ───────────────────────────────────────────────────────────────
-- One row per affiliate (marriage bureau operator / astrologer / planner)

CREATE TABLE IF NOT EXISTS affiliates (
  id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  affiliate_code      text        UNIQUE NOT NULL,
  affiliate_name      text        NOT NULL,
  affiliate_email     text,
  affiliate_whatsapp  text,
  bureau_name         text,
  total_referrals     int         DEFAULT 0,
  total_conversions   int         DEFAULT 0,
  pending_payout_inr  int         DEFAULT 0,   -- in paise (1 INR = 1)
  payout_upi          text,
  created_at          timestamptz DEFAULT now()
);

ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

-- Affiliates can read their own row
CREATE POLICY "Affiliates can read own row"
  ON affiliates FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

-- Only service role can insert/update (done via API)
-- (No additional policy needed — service role bypasses RLS)

-- ─── Referrals ────────────────────────────────────────────────────────────────
-- One row per referred signup (links affiliate → referred user)

CREATE TABLE IF NOT EXISTS referrals (
  id                uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id      uuid        REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
  referred_user_id  uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  converted_at      timestamptz,            -- NULL = signed up, not yet paid
  conversion_plan   text,                   -- 'premium_monthly' | 'annual'
  payout_amount_inr int         DEFAULT 0,  -- 100 for monthly, 200 for annual
  payout_status     text        DEFAULT 'pending',  -- 'pending' | 'paid'
  created_at        timestamptz DEFAULT now(),
  UNIQUE (affiliate_id, referred_user_id)
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Affiliates can read referrals they generated
CREATE POLICY "Affiliates can read own referrals"
  ON referrals FOR SELECT
  USING (
    affiliate_id IN (
      SELECT id FROM affiliates WHERE user_id = (SELECT auth.uid())
    )
  );

-- ─── Helper RPC ───────────────────────────────────────────────────────────────
-- Safely increments the referral counter (called from affiliate-track.ts)

CREATE OR REPLACE FUNCTION increment_affiliate_referrals(aff_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE affiliates
  SET total_referrals = total_referrals + 1
  WHERE id = aff_id;
$$;

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_affiliates_code    ON affiliates (affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates (user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_aff_id   ON referrals  (affiliate_id);
