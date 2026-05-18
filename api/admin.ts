/**
 * Admin API Gateway
 * Consolidates all user and affiliate administration operations into a single endpoint
 * to optimize Vercel Serverless Function slots on the Hobby Plan.
 *
 * Same JWT + admin email verification pattern.
 *
 * GET  /api/admin?type=users                      -> list all users
 * GET  /api/admin?type=affiliates                 -> list all affiliates
 * GET  /api/admin?type=conversions&code=CODE      -> list conversions for an affiliate code
 *
 * POST /api/admin { action: 'list_payments' }     -> list recent payments
 * POST /api/admin { action: 'grant', userId, ... } -> grant premium tier
 * POST /api/admin { action: 'revoke', userId }     -> revoke premium tier
 * POST /api/admin { action: 'push_stats' }        -> get push subscriber count
 * POST /api/admin { action: 'push_broadcast', .. } -> broadcast push notification
 * POST /api/admin { action: 'addAffiliate', ... }  -> add new affiliate
 * POST /api/admin { action: 'updateUpiId', ... }   -> update affiliate UPI ID
 * POST /api/admin { action: 'payout', ... }        -> Razorpay payout to affiliate
 * POST /api/admin { action: 'markPaid', ... }      -> manually mark affiliate paid
 * POST /api/admin { action: 'disable', ... }       -> disable/blacklist affiliate
 * POST /api/admin { action: 'creditMissed', ... }  -> credit missed payment to affiliate
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

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

  // ── GET REQUESTS ──────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const type = req.query.type as string;
    const affiliateCode = req.query.code as string;

    // 1. Affiliate Conversions
    if (type === 'conversions' || affiliateCode) {
      const targetCode = affiliateCode || req.query.code as string;
      if (!targetCode) {
        return res.status(400).json({ error: 'affiliate code required' });
      }
      const { data, error } = await db
        .from('affiliate_conversions')
        .select('id, affiliate_code, payment_id, plan_type, commission_inr, created_at')
        .eq('affiliate_code', targetCode)
        .order('created_at', { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ conversions: data ?? [] });
    }

    // 2. Affiliates list
    if (type === 'affiliates') {
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

    // 3. Users list (default)
    const { data, error } = await db
      .from('profiles')
      .select('id, email, full_name, plan_tier, plan_expires_at, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('admin: list users failed', error.message);
      return res.status(500).json({ error: 'Failed to list users' });
    }

    return res.status(200).json({ users: data || [] });
  }

  // ── POST REQUESTS ─────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    const { action, userId, affiliateId } = req.body || {};

    // 1. User/Payment admin actions
    if (action === 'list_payments') {
      const { data, error: pErr } = await db
        .from('payment_history')
        .select('payment_id, order_id, user_id, amount, plan_type, section_id, report_key, status, created_at')
        .order('created_at', { ascending: false })
        .limit(200);

      if (pErr) {
        console.error('admin: list_payments failed', pErr.message);
        return res.status(500).json({ error: 'Failed to list payments' });
      }

      // Enrich with user emails
      const userIds = [...new Set((data || []).map((p: any) => p.user_id))];
      const { data: profiles } = await db
        .from('profiles')
        .select('id, email')
        .in('id', userIds);
      const emailMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p.email || '']));

      const payments = (data || []).map((p: any) => ({
        ...p,
        user_email: emailMap[p.user_id] || '',
      }));

      return res.status(200).json({ payments });
    }

    if (action === 'grant') {
      const { tier, expiresAt } = req.body || {};
      if (!userId) return res.status(400).json({ error: 'Missing userId' });
      if (!tier || !['free', 'premium', 'astrologer'].includes(tier)) {
        return res.status(400).json({ error: 'Invalid tier' });
      }

      const { error } = await db
        .from('profiles')
        .update({
          plan_tier: tier,
          plan_expires_at: expiresAt ?? null,
        })
        .eq('id', userId);

      if (error) {
        console.error('admin: grant failed', error.message);
        return res.status(500).json({ error: 'Failed to grant plan' });
      }

      return res.status(200).json({ success: true });
    }

    if (action === 'revoke') {
      if (!userId) return res.status(400).json({ error: 'Missing userId' });
      const { error } = await db
        .from('profiles')
        .update({
          plan_tier: 'free',
          plan_expires_at: null,
          unlocked_sections: [],
        })
        .eq('id', userId);

      if (error) {
        console.error('admin: revoke failed', error.message);
        return res.status(500).json({ error: 'Failed to revoke plan' });
      }

      return res.status(200).json({ success: true });
    }

    if (action === 'push_stats') {
      const { count, error: cErr } = await db
        .from('push_subscriptions')
        .select('*', { count: 'exact', head: true });

      if (cErr) return res.status(500).json({ error: cErr.message });
      return res.status(200).json({ count: count ?? 0 });
    }

    if (action === 'push_broadcast') {
      const { title, body: msgBody, url, targetTier } = req.body as {
        title: string; body: string; url?: string; targetTier?: string;
      };

      if (!title || !msgBody) {
        return res.status(400).json({ error: 'title and body required' });
      }

      // Fetch subscriptions
      let query = db
        .from('push_subscriptions')
        .select(targetTier && targetTier !== 'all'
          ? 'subscription, profiles!inner(plan_tier)'
          : 'subscription');

      if (targetTier && targetTier !== 'all') {
        query = query.eq('profiles.plan_tier', targetTier);
      }

      const { data: rows, error: fetchErr } = await query;
      if (fetchErr) return res.status(500).json({ error: fetchErr.message });

      const vapidEmail = process.env.VAPID_EMAIL ?? 'mailto:admin@marriage-astro.vercel.app';
      const vapidPub   = process.env.VAPID_PUBLIC_KEY ?? '';
      const vapidPriv  = process.env.VAPID_PRIVATE_KEY ?? '';

      if (!vapidPub || !vapidPriv) {
        return res.status(503).json({ error: 'VAPID keys not configured' });
      }

      webpush.setVapidDetails(vapidEmail, vapidPub, vapidPriv);

      const payload = JSON.stringify({ title, body: msgBody, url: url ?? '/' });
      const results = await Promise.allSettled(
        (rows ?? []).map((row: any) =>
          webpush.sendNotification(row.subscription as webpush.PushSubscription, payload)
        )
      );

      const sent   = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;
      return res.status(200).json({ sent, failed });
    }

    // 2. Affiliate admin actions
    if (action === 'addAffiliate') {
      const { name, email, whatsapp, bureauName, upiId } = req.body || {};
      if (!name || !email) return res.status(400).json({ error: 'name and email required' });

      const slug = name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
      const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
      const code = `AFF-${slug}-${rand}`;

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

    // Actions that require affiliateId
    if (!affiliateId) {
      return res.status(400).json({ error: 'affiliateId required' });
    }

    if (action === 'updateUpiId') {
      const { upiId } = req.body || {};
      const { error } = await db
        .from('affiliates')
        .update({ upi_id: upiId?.trim() || null, razorpay_fund_account_id: null })
        .eq('id', affiliateId);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    if (action === 'payout') {
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

      await db.from('affiliates').update({ payout_status: 'paid', pending_payout_inr: 0 }).eq('id', affiliateId);
      return res.status(200).json({ success: true, payoutId: payout.id, status: payout.status });
    }

    if (action === 'markPaid') {
      const { error } = await db
        .from('affiliates')
        .update({ payout_status: 'paid', pending_payout_inr: 0 })
        .eq('id', affiliateId);

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    if (action === 'disable') {
      const { error } = await db
        .from('affiliates')
        .update({ payout_status: 'disabled' })
        .eq('id', affiliateId);

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    if (action === 'creditMissed') {
      const { paymentId, commissionInr } = req.body || {};
      if (!paymentId || !commissionInr) return res.status(400).json({ error: 'paymentId and commissionInr required' });

      const { data: aff } = await db
        .from('affiliates')
        .select('affiliate_code, total_conversions, pending_payout_inr')
        .eq('id', affiliateId)
        .single();
      if (!aff) return res.status(404).json({ error: 'Affiliate not found' });

      const { data: payment } = await db
        .from('payment_history')
        .select('plan_type, status')
        .eq('payment_id', paymentId)
        .single();
      if (!payment) return res.status(404).json({ error: 'Payment not found' });
      if (payment.status !== 'success') return res.status(400).json({ error: 'Payment is not successful' });

      const { data: existing } = await db
        .from('affiliate_conversions')
        .select('id')
        .eq('payment_id', paymentId)
        .single();
      if (existing) return res.status(409).json({ error: 'This payment is already credited to an affiliate' });

      await db.from('affiliate_conversions').insert({
        affiliate_code: aff.affiliate_code,
        payment_id: paymentId,
        plan_type: payment.plan_type,
        commission_inr: Number(commissionInr),
      });

      await db.from('affiliates').update({
        total_conversions: (aff.total_conversions || 0) + 1,
        pending_payout_inr: (aff.pending_payout_inr || 0) + Number(commissionInr),
      }).eq('id', affiliateId);

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Unknown action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
