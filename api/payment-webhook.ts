/**
 * Payment Webhook - Vercel Serverless Function
 *
 * Handles Razorpay `payment.captured` webhook events.
 * 1. Verifies HMAC-SHA256 signature using RAZORPAY_WEBHOOK_SECRET
 * 2. Parses userId, planType, sectionToUnlock from payment notes
 * 3. Updates profiles table via service role client (bypasses RLS)
 *
 * Register this URL in Razorpay Dashboard → Webhooks:
 *   https://marriage-astro.vercel.app/api/payment-webhook
 *   Events: payment.captured
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase service role not configured');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('payment-webhook: RAZORPAY_WEBHOOK_SECRET not set');
    return res.status(200).json({ received: true, processed: false });
  }

  // 1. Robust Signature Verification
  // Note: On Vercel, if body parsing is active, we use reconstruct strategy.
  // Using the official Razorpay SDK validation method.
  const signature = (req.headers['x-razorpay-signature'] as string) || '';
  const rawBody = JSON.stringify(req.body); 

  try {
    const isValid = Razorpay.validateWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.error('payment-webhook: signature mismatch');
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }
  } catch (err) {
    console.error('payment-webhook: signature verification error', err);
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  const event = req.body;
  const eventType: string = event?.event || '';

  if (eventType !== 'payment.captured') {
    return res.status(200).json({ received: true, processed: false, note: 'ignoring non-captured event' });
  }

  const payment = event?.payload?.payment?.entity;
  if (!payment) {
    return res.status(400).json({ error: 'Missing payment entity' });
  }

  const { userId, planType, sectionToUnlock } = payment.notes || {};

  if (!userId || !planType) {
    console.error('payment-webhook: missing metadata in notes', payment.id);
    return res.status(400).json({ error: 'Missing userId or planType in payment notes' });
  }

  const db = getServiceClient();

  // 2. Logging and Idempotency
  // First, check if we've already processed this payment
  const { data: existingLog } = await db
    .from('payment_history')
    .select('status')
    .eq('payment_id', payment.id)
    .single();

  if (existingLog?.status === 'success') {
    return res.status(200).json({ received: true, processed: true, note: 'already fulfilled' });
  }

  // Create/Update Log Entry
  await db.from('payment_history').upsert({
    payment_id: payment.id,
    order_id: payment.order_id,
    user_id: userId,
    plan_type: planType,
    section_id: sectionToUnlock || null,
    amount: payment.amount,
    status: 'processing',
    raw_payload: event
  }, { onConflict: 'payment_id' });

  try {
    // 3. Fulfillment Logic
    if (planType === 'section_unlock' && sectionToUnlock) {
      const { data: profile } = await db
        .from('profiles')
        .select('unlocked_sections')
        .eq('id', userId)
        .single();

      const existing: string[] = Array.isArray(profile?.unlocked_sections) ? profile.unlocked_sections : [];
      if (!existing.includes(sectionToUnlock)) {
        existing.push(sectionToUnlock);
        await db.from('profiles').update({ unlocked_sections: existing }).eq('id', userId);
      }
    } else if (planType === 'full_report_unlock') {
      const ALL_SECTIONS = ['divorce_risk', 'infidelity_risk', 'sexual_detail', 'mental_health', 'addiction_risk', 'vulnerability_timeline', 'remedies', 'kp_detail', 'divisional_advanced', 'full_self_report', 'full_compat_report'];
      await db.from('profiles').update({ unlocked_sections: ALL_SECTIONS }).eq('id', userId);
    } else if (planType === 'premium_monthly') {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await db.from('profiles').update({ plan_tier: 'premium', plan_expires_at: expiresAt }).eq('id', userId);
    } else if (planType === 'astrologer_monthly') {
      await db.from('profiles').update({ plan_tier: 'astrologer', plan_expires_at: null }).eq('id', userId);
    }

    // Mark as Success
    await db.from('payment_history').update({ status: 'success' }).eq('payment_id', payment.id);
    console.log(`payment-webhook: successfully fulfilled ${planType} for user ${userId}`);

  } catch (err: any) {
    console.error('payment-webhook: fulfillment failed', err);
    await db.from('payment_history').update({ status: 'failed', error_log: err.message }).eq('payment_id', payment.id);
    return res.status(500).json({ error: 'Fulfillment failed' });
  }

  return res.status(200).json({ received: true, processed: true });
}

