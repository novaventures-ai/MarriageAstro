-- SUPABASE SCHEMA FOR ASTRO MARRIAGE APP
-- Run these in your Supabase SQL Editor to create the necessary tables.
-- NOTE: birth_charts table has been dropped (0 rows, never used in code).

-- 1. Profiles Table (Self Data)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  user_id UUID,
  self_birth_data JSONB,
  self_chart JSONB,
  self_report JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Premium / Monetization
  plan_tier TEXT DEFAULT 'free',
  plan_expires_at TIMESTAMPTZ,
  unlocked_sections JSONB DEFAULT '[]',
  ai_credits_remaining INTEGER DEFAULT 3,
  ai_credits_reset_at TIMESTAMPTZ,
  razorpay_customer_id TEXT,
  razorpay_subscription_id TEXT
);

-- 2. Partners Table
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  time_of_birth TEXT NOT NULL,
  location TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  timezone TEXT,
  chart JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Compatibility Reports Table
CREATE TABLE IF NOT EXISTS compatibility_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chart_a_name TEXT NOT NULL,
  chart_b_name TEXT NOT NULL,
  overall_score INTEGER NOT NULL,
  overall_verdict TEXT NOT NULL,
  report_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Partner Comparisons Table
CREATE TABLE IF NOT EXISTS partner_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_name TEXT NOT NULL,
  profile_birth_data JSONB NOT NULL,
  partners JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Premium / Monetization Columns (idempotent — safe to re-run)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS unlocked_sections JSONB DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_credits_remaining INTEGER DEFAULT 3;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_credits_reset_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS razorpay_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT;

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_reports_user_id ON compatibility_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_reports_created_at ON compatibility_reports(user_id, created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_comparisons ENABLE ROW LEVEL SECURITY;

-- RLS Policies (subselect form for performance — auth.uid() evaluated once per query)
CREATE POLICY "Users can manage their own profile" ON profiles
  FOR ALL USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can manage their own partners" ON partners
  FOR ALL USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can manage their own reports" ON compatibility_reports
  FOR ALL USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can manage their own comparisons" ON partner_comparisons
  FOR ALL USING ((select auth.uid()) = user_id);

-- To drop legacy objects (already done in production):
-- DROP TABLE IF EXISTS birth_charts;
-- DROP INDEX IF EXISTS idx_birth_charts_user_id;
-- DROP INDEX IF EXISTS idx_partner_comparisons_user_id;
-- DROP INDEX IF EXISTS idx_partner_comparisons_updated_at;
