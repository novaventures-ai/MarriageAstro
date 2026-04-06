-- Waitlist Table
-- Stores email signups from pricing page and PremiumGate modals.
-- Run this in your Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  plan TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Anyone can insert (signup), but only own rows are readable
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for non-logged-in users on pricing page)
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

-- Logged-in users can see their own entries
CREATE POLICY "Users can view own waitlist entries" ON waitlist
  FOR SELECT USING ((select auth.uid()) = user_id);

-- Allow upsert by matching email
CREATE POLICY "Users can update own waitlist entries" ON waitlist
  FOR UPDATE USING ((select auth.uid()) = user_id);

-- Performance index
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
