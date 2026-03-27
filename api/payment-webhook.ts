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
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase service role not configured');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // If webhook secret is not configured, acknowledge but skip processing
  if (!webhookSecret) {
    console.warn('payment-webhook: RAZORPAY_WEBHOOK_SECRET not set — acknowledging without processing');
    return res.status(200).json({ received: true, processed: false });
  }

  // Verify signature
  const signature = (req.headers['x-razorpay-signature'] as string) || '';
  const rawBody = JSON.stringify(req.body);

  if (!signature || !verifySignature(rawBody, signature, webhookSecret)) {
    console.error('payment-webhook: invalid signature');
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  const event = req.body;
  const eventType: string = event?.event || '';

  console.log('payment-webhook: received event', eventType);

  try {
    if (eventType === 'payment.captured') {
      const payment = event?.payload?.payment?.entity;
      if (!payment) {
        return res.status(400).json({ error: 'Missing payment entity' });
      }

      const { userId, planType, sectionToUnlock } = payment.notes || {};

      if (!userId || !planType) {
        console.error('payment-webhook: missing notes on payment', payment.id);
        return res.status(400).json({ error: 'Missing userId or planType in payment notes' });
      }

      const db = getServiceClient();

      if (planType === 'section_unlock' && sectionToUnlock) {
        // Idempotently append section to unlocked_sections
        const { data: profile, error: fetchErr } = await db
          .from('profiles')
          .select('unlocked_sections')
          .eq('id', userId)
          .single();

        if (fetchErr) {
          console.error('payment-webhook: fetch profile failed', fetchErr.message);
          return res.status(500).json({ error: 'Failed to fetch profile' });
        }

        const existing: string[] = Array.isArray(profile?.unlocked_sections) ? profile.unlocked_sections : [];
        if (!existing.includes(sectionToUnlock)) {
          existing.push(sectionToUnlock);
        }

        const { error: updateErr } = await db
          .from('profiles')
          .update({ unlocked_sections: existing })
          .eq('id', userId);

        if (updateErr) {
          console.error('payment-webhook: section unlock failed', updateErr.message);
          return res.status(500).json({ error: 'Failed to unlock section' });
        }

        console.log(`payment-webhook: unlocked section '${sectionToUnlock}' for user ${userId}`);

      } else if (planType === 'full_report_unlock') {
        // Unlock all sections at once
        const ALL_SECTIONS = [
          'divorce_risk', 'infidelity_risk', 'sexual_detail',
          'mental_health', 'addiction_risk', 'vulnerability_timeline',
          'remedies', 'kp_detail', 'divisional_advanced',
          'full_self_report', 'full_compat_report',
        ];

        const { error } = await db
          .from('profiles')
          .update({ unlocked_sections: ALL_SECTIONS })
          .eq('id', userId);

        if (error) {
          console.error('payment-webhook: full report unlock failed', error.message);
          return res.status(500).json({ error: 'Failed to unlock full report' });
        }

        console.log(`payment-webhook: full report unlocked for user ${userId}`);

      } else if (planType === 'premium_monthly') {
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        const { error } = await db
          .from('profiles')
          .update({ plan_tier: 'premium', plan_expires_at: expiresAt })
          .eq('id', userId);

        if (error) {
          console.error('payment-webhook: premium upgrade failed', error.message);
          return res.status(500).json({ error: 'Failed to upgrade to premium' });
        }

        console.log(`payment-webhook: premium activated for user ${userId}, expires ${expiresAt}`);

      } else if (planType === 'astrologer_monthly') {
        const { error } = await db
          .from('profiles')
          .update({ plan_tier: 'astrologer', plan_expires_at: null })
          .eq('id', userId);

        if (error) {
          console.error('payment-webhook: astrologer upgrade failed', error.message);
          return res.status(500).json({ error: 'Failed to upgrade to astrologer' });
        }

        console.log(`payment-webhook: astrologer plan activated for user ${userId}`);

      } else {
        console.warn(`payment-webhook: unhandled planType '${planType}'`);
      }
    }

    return res.status(200).json({ received: true, processed: true });
  } catch (error: any) {
    console.error('payment-webhook: unhandled error', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
