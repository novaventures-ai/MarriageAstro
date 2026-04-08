-- FIX: Add missing report_key column to payment_history
ALTER TABLE public.payment_history ADD COLUMN IF NOT EXISTS report_key text;

-- Verify RLS policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'payment_history' AND policyname = 'Users can view their own payment history'
    ) THEN
        CREATE POLICY "Users can view their own payment history" 
        ON public.payment_history FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Ensure report_unlocks has RLS too
ALTER TABLE public.report_unlocks ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'report_unlocks' AND policyname = 'Users can view their own unlocks'
    ) THEN
        CREATE POLICY "Users can view their own unlocks" 
        ON public.report_unlocks FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
END
$$;
