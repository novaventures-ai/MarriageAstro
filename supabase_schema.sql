-- SUPABASE SCHEMA FOR ASTRO MARRIAGE APP
-- Run these in your Supabase SQL Editor to create the necessary tables.

-- 1. Profiles Table (Self Data)
-- NOTE: Actual DB schema has id (PK, FK to auth.users), email, full_name, avatar_url, user_id (nullable/unused)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  user_id UUID,
  self_birth_data JSONB,
  self_chart JSONB,
  self_report JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- 4. Birth Charts Table (LEGACY — 0 rows, saveChart/loadCharts never called. Safe to drop.)
CREATE TABLE IF NOT EXISTS birth_charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name_label TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  birth_time TEXT NOT NULL,
  birth_place TEXT,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  chart_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Partner Comparisons Table
CREATE TABLE IF NOT EXISTS partner_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_name TEXT NOT NULL,
  profile_birth_data JSONB NOT NULL,
  partners JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_reports_user_id ON compatibility_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_reports_created_at ON compatibility_reports(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_birth_charts_user_id ON birth_charts(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_comparisons_user_id ON partner_comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_comparisons_updated_at ON partner_comparisons(user_id, updated_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE birth_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_comparisons ENABLE ROW LEVEL SECURITY;

-- Create Policies (User can only see their own data)
CREATE POLICY "Users can manage their own profile" ON profiles
  FOR ALL USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage their own partners" ON partners 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reports" ON compatibility_reports 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own charts" ON birth_charts 
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own comparisons" ON partner_comparisons 
  FOR ALL USING (auth.uid() = user_id);
