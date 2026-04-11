/**
 * affiliate-track.ts — Vercel Serverless Function
 *
 * GET  /api/affiliate-track?code=BUREAU123
 *       → validate affiliate code, return public affiliate info
 *
 * POST /api/affiliate-track
 *   body: { code: string, userId: string }
 *       → record a referred signup against this affiliate code
 *
 * POST /api/affiliate-track
 *   body: { action: 'register', name: string, email: string, whatsapp: string, bureauName: string, userId: string }
 *       → create a new affiliate account with a generated referral code
 *
 * Required env vars:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (bypasses RLS for trusted server writes)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function verifyToken(req: VercelRequest): Promise<string | null> {
  const token = ((req.headers['authorization'] as string) || '').replace('Bearer ', '').trim();
  if (!token) return null;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
  const anonClient = createClient(url, anonKey);
  const { data: { user } } = await anonClient.auth.getUser(token);
  return user?.id || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = getAdminClient();

  // ── GET: load current user's affiliate data (bypasses RLS) ────────────────
  if (req.method === 'GET' && req.query.me === '1') {
    const userId = await verifyToken(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { data: aff } = await supabase
      .from('affiliates')
      .select('affiliate_code, total_clicks, total_referrals, total_conversions, pending_payout_inr, upi_id')
      .eq('user_id', userId)
      .single();

    if (!aff) return res.status(200).json({ affiliate: null, conversions: [] });

    const { data: conversions } = await supabase
      .from('affiliate_conversions')
      .select('id, payment_id, plan_type, commission_inr, created_at')
      .eq('affiliate_code', aff.affiliate_code)
      .order('created_at', { ascending: false });

    return res.status(200).json({ affiliate: aff, conversions: conversions || [] });
  }

  // ── GET: look up affiliate by code (public) ────────────────────────────────
  if (req.method === 'GET') {
    const code = (req.query.code as string | undefined)?.trim();
    if (!code) return res.status(400).json({ error: 'code required' });

    const { data, error } = await supabase
      .from('affiliates')
      .select('id, affiliate_code, affiliate_name, bureau_name, total_referrals, total_conversions')
      .eq('affiliate_code', code)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Affiliate not found' });
    return res.status(200).json(data);
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as Record<string, string>;

  // ── POST action=register: sign up as affiliate ──────────────────────────────
  if (body.action === 'register') {
    const { name, email, whatsapp, bureauName, upiId, userId } = body;
    if (!name || !email || !userId) {
      return res.status(400).json({ error: 'name, email, userId required' });
    }
    const emailLower = email.toLowerCase().trim();

    // Case 1: Already registered by this user_id
    const { data: byUserId } = await supabase
      .from('affiliates')
      .select('affiliate_code, upi_id')
      .eq('user_id', userId)
      .single();

    if (byUserId) {
      // Update UPI if provided
      if (upiId?.trim()) {
        await supabase.from('affiliates').update({ upi_id: upiId.trim() }).eq('user_id', userId);
      }
      return res.status(200).json({ affiliate_code: byUserId.affiliate_code, alreadyExists: true });
    }

    // Case 2: Admin pre-registered by email (no user_id yet) — link account
    const { data: byEmail } = await supabase
      .from('affiliates')
      .select('affiliate_code, upi_id')
      .eq('affiliate_email', emailLower)
      .single();

    if (byEmail) {
      await supabase.from('affiliates').update({
        user_id: userId,
        affiliate_name: name.trim(),
        affiliate_whatsapp: whatsapp?.trim() || null,
        bureau_name: bureauName?.trim() || null,
        upi_id: upiId?.trim() || byEmail.upi_id || null,
        status: 'active',
      }).eq('affiliate_email', emailLower);
      return res.status(200).json({ affiliate_code: byEmail.affiliate_code, alreadyExists: false });
    }

    // Case 3: Brand new affiliate
    const slug = name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    const code = `AFF-${slug}-${rand}`;

    const { data, error } = await supabase
      .from('affiliates')
      .insert({
        user_id: userId,
        affiliate_code: code,
        affiliate_name: name.trim(),
        affiliate_email: emailLower,
        affiliate_whatsapp: whatsapp?.trim() || null,
        bureau_name: bureauName?.trim() || null,
        upi_id: upiId?.trim() || null,
        status: 'active',
        payout_status: 'pending',
      })
      .select('affiliate_code')
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ affiliate_code: data.affiliate_code });
  }

  // ── POST action=click: increment link click counter ───────────────────────
  if (body.action === 'click') {
    const { code } = body;
    if (!code) return res.status(400).json({ error: 'code required' });

    const { data: aff } = await supabase
      .from('affiliates')
      .select('id, total_clicks')
      .eq('affiliate_code', code)
      .single();

    if (!aff) return res.status(404).json({ error: 'Affiliate not found' });

    await supabase
      .from('affiliates')
      .update({ total_clicks: (aff.total_clicks || 0) + 1 })
      .eq('id', aff.id);

    return res.status(200).json({ tracked: true });
  }

  // ── POST action=track: record a referred signup ────────────────────────────
  if (body.action === 'track') {
    const { code, userId } = body;
    if (!code || !userId) {
      return res.status(400).json({ error: 'code and userId required' });
    }

    // Find affiliate
    const { data: affiliate, error: afErr } = await supabase
      .from('affiliates')
      .select('id')
      .eq('affiliate_code', code)
      .single();

    if (afErr || !affiliate) return res.status(404).json({ error: 'Affiliate not found' });

    // Idempotent: don't double-count same userId
    const { data: existing } = await supabase
      .from('referrals')
      .select('id')
      .eq('affiliate_id', affiliate.id)
      .eq('referred_user_id', userId)
      .single();

    if (existing) return res.status(200).json({ message: 'Already tracked' });

    const { error: insErr } = await supabase
      .from('referrals')
      .insert({ affiliate_id: affiliate.id, referred_user_id: userId });

    if (insErr) return res.status(500).json({ error: insErr.message });

    // Increment referral counter
    const { data: aff } = await supabase
      .from('affiliates')
      .select('total_referrals')
      .eq('id', affiliate.id)
      .single();
    await supabase
      .from('affiliates')
      .update({ total_referrals: ((aff?.total_referrals) || 0) + 1 })
      .eq('id', affiliate.id);

    return res.status(201).json({ message: 'Referral tracked' });
  }

  // ── POST action=updateUpi: save affiliate's UPI ID ────────────────────────
  if (body.action === 'updateUpi') {
    const userId = await verifyToken(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { upiId } = body;
    await supabase
      .from('affiliates')
      .update({ upi_id: upiId?.trim() || null })
      .eq('user_id', userId);
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: 'Unknown action' });
}
