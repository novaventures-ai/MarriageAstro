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
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function generateCode(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${slug}-${rand}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const supabase = getAdminClient();

  // ── GET: look up affiliate by code ─────────────────────────────────────────
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
    const { name, email, whatsapp, bureauName, userId } = body;
    if (!name || !email || !userId) {
      return res.status(400).json({ error: 'name, email, userId required' });
    }

    // Check if already registered
    const { data: existing } = await supabase
      .from('affiliates')
      .select('affiliate_code')
      .eq('user_id', userId)
      .single();

    if (existing) {
      return res.status(200).json({ affiliate_code: existing.affiliate_code, alreadyExists: true });
    }

    const code = generateCode(name);
    const { data, error } = await supabase
      .from('affiliates')
      .insert({
        user_id: userId,
        affiliate_code: code,
        affiliate_name: name,
        affiliate_email: email,
        affiliate_whatsapp: whatsapp || null,
        bureau_name: bureauName || null,
      })
      .select('affiliate_code')
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ affiliate_code: data.affiliate_code });
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

    // Increment counter
    await supabase.rpc('increment_affiliate_referrals', { aff_id: affiliate.id });

    return res.status(201).json({ message: 'Referral tracked' });
  }

  return res.status(400).json({ error: 'Unknown action' });
}
