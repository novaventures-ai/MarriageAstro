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
        'pending_payout_inr, payout_status, upi_id, created_at'
      )
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ affiliates: data ?? [] });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, affiliateId } = req.body as { action: string; affiliateId?: string };

  // ── addAffiliate: admin manually registers an affiliate ───────────────────
  if (action === 'addAffiliate') {
    const { name, email, whatsapp, bureauName, upiId } = req.body as {
      action: string; name: string; email: string; whatsapp?: string; bureauName?: string; upiId?: string;
    };
    if (!name || !email) return res.status(400).json({ error: 'name and email required' });

    // Generate a readable affiliate code
    const slug = name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    const code = `AFF-${slug}-${rand}`;

    // Check if email already registered
    const { data: existing } = await db
      .from('affiliates')
      .select('affiliate_code')
      .eq('affiliate_email', email.toLowerCase().trim())
      .single();
    if (existing) return res.status(409).json({ error: 'An affiliate with this email already exists', code: existing.affiliate_code });

    const { data, error } = await db
      .from('affiliates')
      .insert({
        affiliate_code: code,
        affiliate_name: name.trim(),
        affiliate_email: email.toLowerCase().trim(),
        affiliate_whatsapp: whatsapp?.trim() || null,
        bureau_name: bureauName?.trim() || null,
        upi_id: upiId?.trim() || null,
        status: 'active',
        payout_status: 'pending',
      })
      .select('id, affiliate_code')
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ success: true, affiliateCode: data.affiliate_code });
  }

  if (!affiliateId) {
    return res.status(400).json({ error: 'affiliateId required' });
  }

  // ── updateUpiId: set or change affiliate's UPI ID ────────────────────────
  if (action === 'updateUpiId') {
    if (!affiliateId) return res.status(400).json({ error: 'affiliateId required' });
    const { upiId } = req.body as { action: string; affiliateId: string; upiId?: string };
    // Clear cached fund account when UPI changes (it's tied to the old address)
    const { error } = await db
      .from('affiliates')
      .update({ upi_id: upiId?.trim() || null, razorpay_fund_account_id: null })
      .eq('id', affiliateId);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  // ── payout: send money via RazorpayX Payouts API ─────────────────────────
  if (action === 'payout') {
    if (!affiliateId) return res.status(400).json({ error: 'affiliateId required' });

    const { data: aff } = await db
      .from('affiliates')
      .select('id, affiliate_name, affiliate_email, upi_id, pending_payout_inr, razorpay_contact_id, razorpay_fund_account_id')
      .eq('id', affiliateId)
      .single();

    if (!aff) return res.status(404).json({ error: 'Affiliate not found' });
    if (!aff.upi_id) return res.status(400).json({ error: 'No UPI ID on file for this affiliate. Add their UPI first.' });
    if (!aff.pending_payout_inr || aff.pending_payout_inr <= 0) return res.status(400).json({ error: 'No pending payout amount' });

    const KEY_ID = process.env.RAZORPAY_KEY_ID;
    const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    const ACCOUNT_NUMBER = process.env.RAZORPAY_ACCOUNT_NUMBER;

    if (!KEY_ID || !KEY_SECRET || !ACCOUNT_NUMBER) {
      return res.status(500).json({ error: 'Razorpay payout not configured. Set RAZORPAY_ACCOUNT_NUMBER in environment variables.' });
    }

    const authHeader = 'Basic ' + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');

    // Step 1: Create Contact (cache in DB to avoid duplication)
    let contactId = aff.razorpay_contact_id;
    if (!contactId) {
      const cRes = await fetch('https://api.razorpay.com/v1/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: authHeader },
        body: JSON.stringify({
          name: aff.affiliate_name,
          email: aff.affiliate_email || undefined,
          type: 'vendor',
          reference_id: affiliateId,
        }),
      });
      if (!cRes.ok) {
        const err = await cRes.json();
        return res.status(502).json({ error: `Razorpay contact error: ${err.error?.description || cRes.status}` });
      }
      const contact = await cRes.json();
      contactId = contact.id;
      await db.from('affiliates').update({ razorpay_contact_id: contactId }).eq('id', affiliateId);
    }

    // Step 2: Create Fund Account with VPA/UPI (cache; reset when UPI changes)
    let fundAccountId = aff.razorpay_fund_account_id;
    if (!fundAccountId) {
      const faRes = await fetch('https://api.razorpay.com/v1/fund_accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: authHeader },
        body: JSON.stringify({
          contact_id: contactId,
          account_type: 'vpa',
          vpa: { address: aff.upi_id },
        }),
      });
      if (!faRes.ok) {
        const err = await faRes.json();
        return res.status(502).json({ error: `Razorpay fund account error: ${err.error?.description || faRes.status}` });
      }
      const fa = await faRes.json();
      fundAccountId = fa.id;
      await db.from('affiliates').update({ razorpay_fund_account_id: fundAccountId }).eq('id', affiliateId);
    }

    // Step 3: Create Payout
    const amountPaisa = Math.round(Number(aff.pending_payout_inr) * 100);
    const payoutRes = await fetch('https://api.razorpay.com/v1/payouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
      body: JSON.stringify({
        account_number: ACCOUNT_NUMBER,
        fund_account_id: fundAccountId,
        amount: amountPaisa,
        currency: 'INR',
        mode: 'UPI',
        purpose: 'payout',
        queue_if_low_balance: true,
        reference_id: `aff_${affiliateId}_${Date.now()}`,
        narration: 'AstroMarriage affiliate commission',
      }),
    });

    if (!payoutRes.ok) {
      const err = await payoutRes.json();
      return res.status(502).json({ error: `Razorpay payout failed: ${err.error?.description || payoutRes.status}` });
    }
    const payout = await payoutRes.json();

    // Mark paid
    await db.from('affiliates').update({ payout_status: 'paid', pending_payout_inr: 0 }).eq('id', affiliateId);

    return res.status(200).json({ success: true, payoutId: payout.id, status: payout.status });
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

  // ── creditMissed: manually credit a past payment to an affiliate ──────────
  if (action === 'creditMissed') {    const { paymentId, commissionInr } = req.body as { action: string; affiliateId: string; paymentId: string; commissionInr: number };
    if (!paymentId || !commissionInr) return res.status(400).json({ error: 'paymentId and commissionInr required' });

    // Get affiliate details
    const { data: aff } = await db
      .from('affiliates')
      .select('affiliate_code, total_conversions, pending_payout_inr')
      .eq('id', affiliateId)
      .single();
    if (!aff) return res.status(404).json({ error: 'Affiliate not found' });

    // Check payment exists and is successful
    const { data: payment } = await db
      .from('payment_history')
      .select('plan_type, status')
      .eq('payment_id', paymentId)
      .single();
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    if (payment.status !== 'success') return res.status(400).json({ error: 'Payment is not successful' });

    // Prevent double-credit
    const { data: existing } = await db
      .from('affiliate_conversions')
      .select('id')
      .eq('payment_id', paymentId)
      .single();
    if (existing) return res.status(409).json({ error: 'This payment is already credited to an affiliate' });

    // Insert conversion record
    await db.from('affiliate_conversions').insert({
      affiliate_code: aff.affiliate_code,
      payment_id: paymentId,
      plan_type: payment.plan_type,
      commission_inr: Number(commissionInr),
    });

    // Update affiliate totals
    await db.from('affiliates').update({
      total_conversions: (aff.total_conversions || 0) + 1,
      pending_payout_inr: (aff.pending_payout_inr || 0) + Number(commissionInr),
    }).eq('id', affiliateId);

    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: 'Unknown action' });
}
