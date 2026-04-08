-- CREATE TABLE FOR REPORT-SPECIFIC UNLOCKS
CREATE TABLE IF NOT EXISTS report_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  report_key TEXT NOT NULL, -- Format: nameA_dobA_nameB_dobB (normalized)
  section_id TEXT NOT NULL, -- Category ID (cat_...) or 'full_report'
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE report_unlocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own report unlocks" ON report_unlocks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all unlocks" ON report_unlocks
  FOR ALL USING (true)
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_report_unlocks_user_id ON report_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_report_unlocks_key ON report_unlocks(report_key);
