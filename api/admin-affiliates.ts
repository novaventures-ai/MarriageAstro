/**
 * admin-affiliates.ts — Vercel Serverless Function
 *
 * Admin-only access to the affiliate network.
 * Same JWT + admin email verification pattern as admin-users.ts.
 *
 * GET  /api/admin-affiliates          → list all affiliates with stats
 * POST /api/admin-affiliates { action: 'markPaid',  affiliateId } → mark payout paid
 * POST /api/admin-affiliates { action: 'disable',   affiliateId } → disable affiliate
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAILS = [
  'novaventures.contact@gmail.com',
  'rahul.govalkar.1807@gmail.com',
];

function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

function getServiceClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase service role not configured');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function verifyAdmin(req: VercelRequest): Promise<boolean> {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return false;

  const anonUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!anonUrl || !anonKey) return false;

  const anonClient = createClient(anonUrl, anonKey);
  const { data: { user }, error } = await anonClient.auth.getUser(token);
  if (error || !user?.email) return false;
  return isAdminEmail(user.email);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return res.status(403).json({ error: 'Forbidden: admin access required' });
  }

  const db = getServiceClient();

  // ── GET: list all affiliates (or conversions for a specific code) ──────────
  if (req.method === 'GET') {
    const affiliateCode = req.query.code as string | undefined;

    // ?code=XXX → return itemized conversion log for that affiliate
    if (affiliateCode) {
      const { data, error } = await db
        .from('affiliate_conversions')
        .select('id, affiliate_code, payment_id, plan_type, commission_inr, created_at')
        .eq('affiliate_code', affiliateCode)
        .order('created_at', { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ conversions: data ?? [] });
    }

    // No code → return all affiliates
    const { data, error } = await db
      .from('affiliates')
      .select(
        'id, affiliate_code, affiliate_name, bureau_name, affiliate_email, ' +
        'affiliate_whatsapp, total_clicks, total_referrals, total_conversions, ' +
        'pending_payout_inr, payout_status, created_at'
      )
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ affiliates: data ?? [] });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, affiliateId } = req.body as { action: string; affiliateId: string };

  if (!affiliateId) {
    return res.status(400).json({ error: 'affiliateId required' });
  }

  // ── markPaid: clear pending payout ───────────────────────────────────────
  if (action === 'markPaid') {
    const { error } = await db
      .from('affiliates')
      .update({ payout_status: 'paid', pending_payout_inr: 0 })
      .eq('id', affiliateId);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  // ── disable: blacklist affiliate code ────────────────────────────────────
  if (action === 'disable') {
    const { error } = await db
      .from('affiliates')
      .update({ payout_status: 'disabled' })
      .eq('id', affiliateId);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: 'Unknown action' });
}
