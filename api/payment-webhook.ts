/**
 * Payment Webhook - Vercel Serverless Function
 *
 * Handles Razorpay `payment.captured` webhook events.
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

  const { data: existingLog } = await db.from('payment_history').select('status').eq('payment_id', payment.id).single();
  if (existingLog?.status === 'success') {
    return res.status(200).json({ received: true, processed: true, note: 'already fulfilled' });
  }

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
    const { data: profile } = await db.from('profiles').select('unlocked_sections').eq('id', userId).single();
    const existing: string[] = Array.isArray(profile?.unlocked_sections) ? profile.unlocked_sections : [];

    if (planType === 'section_unlock' && sectionToUnlock) {
      if (!existing.includes(sectionToUnlock)) {
        existing.push(sectionToUnlock);
        await db.from('profiles').update({ unlocked_sections: existing }).eq('id', userId);
      }
    } else if (planType === 'full_report_unlock') {
      const BUNDLE = ['cat_personality', 'cat_risks', 'cat_chemistry', 'cat_timing'];
      const updated = Array.from(new Set([...existing, ...BUNDLE]));
      await db.from('profiles').update({ unlocked_sections: updated }).eq('id', userId);
    } else if (planType === 'premium_monthly') {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await db.from('profiles').update({ plan_tier: 'premium', plan_expires_at: expiresAt }).eq('id', userId);
    } else if (planType === 'astrologer_monthly') {
      await db.from('profiles').update({ plan_tier: 'astrologer', plan_expires_at: null }).eq('id', userId);
    }

    await db.from('payment_history').update({ status: 'success' }).eq('payment_id', payment.id);
    console.log(`payment-webhook: successfully fulfilled ${planType} for user ${userId}`);

  } catch (err: any) {
    console.error('payment-webhook: fulfillment failed', err);
    await db.from('payment_history').update({ status: 'failed', error_log: err.message }).eq('payment_id', payment.id);
    return res.status(500).json({ error: 'Fulfillment failed' });
  }

  return res.status(200).json({ received: true, processed: true });
}
