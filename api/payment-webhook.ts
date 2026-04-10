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

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET;
  const razorpay = (keyId && keySecret) ? new Razorpay({ key_id: keyId, key_secret: keySecret }) : null;

  // 1. Try to get metadata from payment notes
  let { userId, planType, sectionToUnlock, reportKey, affiliateCode } = payment.notes || {};

  // 2. Fallback: If missing, try to fetch from Order notes (more reliable)
  if ((!userId || !planType) && payment.order_id && razorpay) {
    try {
      console.log('payment-webhook: notes missing on payment, fetching order:', payment.order_id);
      const order = await razorpay.orders.fetch(payment.order_id);
      if (order?.notes) {
        userId = userId || order.notes.userId;
        planType = planType || order.notes.planType;
        sectionToUnlock = sectionToUnlock || order.notes.sectionToUnlock;
        reportKey = reportKey || order.notes.reportKey;
        affiliateCode = affiliateCode || order.notes.affiliateCode;
      }
    } catch (orderErr) {
      console.error('payment-webhook: failed to fetch order fallback:', orderErr);
    }
  }

  if (!userId || !planType) {
    console.error('payment-webhook: missing metadata in notes', payment.id);
    return res.status(400).json({ error: 'Missing userId or planType in payment/order notes' });
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
    report_key: reportKey || null,
    amount: payment.amount,
    status: 'processing',
    raw_payload: event
  }, { onConflict: 'payment_id' });

  try {
    const { data: profile } = await db.from('profiles').select('unlocked_sections').eq('id', userId).single();
    const existing: string[] = Array.isArray(profile?.unlocked_sections) ? profile.unlocked_sections : [];

    if (planType === 'section_unlock' && sectionToUnlock && reportKey) {
      // Record granular unlock for this specific report
      await db.from('report_unlocks').upsert({
        user_id: userId,
        report_key: reportKey,
        section_id: sectionToUnlock,
        payment_id: payment.id
      });
    } else if (planType === 'full_report_unlock' && reportKey) {
      // Record full report unlock for this specific pairing
      await db.from('report_unlocks').upsert({
        user_id: userId,
        report_key: reportKey,
        section_id: 'full_report',
        payment_id: payment.id
      });
    } else if (planType === 'premium_monthly') {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await db.from('profiles').update({ plan_tier: 'premium', plan_expires_at: expiresAt }).eq('id', userId);
    } else if (planType === 'astrologer_monthly') {
      await db.from('profiles').update({ plan_tier: 'astrologer', plan_expires_at: null }).eq('id', userId);
    }

    await db.from('payment_history').update({ status: 'success' }).eq('payment_id', payment.id);
    console.log(`payment-webhook: successfully fulfilled ${planType} for user ${userId}`);

    // Credit affiliate commission if a referral code is present
    if (affiliateCode) {
      const commissionInr =
        planType === 'astrologer_monthly' ? 200
        : planType === 'premium_monthly' ? 100
        : planType === 'full_report_unlock' ? 20
        : 10; // section_unlock

      try {
        const { data: affiliate } = await db
          .from('affiliates')
          .select('id, total_conversions, pending_payout_inr')
          .eq('affiliate_code', affiliateCode)
          .eq('status', 'active')
          .single();

        if (affiliate) {
          // Update aggregate totals on the affiliate row
          await db
            .from('affiliates')
            .update({
              total_conversions: (affiliate.total_conversions || 0) + 1,
              pending_payout_inr: (affiliate.pending_payout_inr || 0) + commissionInr,
            })
            .eq('id', affiliate.id);

          // Insert itemized record — single source of truth for both affiliate and admin audit
          await db.from('affiliate_conversions').insert({
            affiliate_code: affiliateCode,
            payment_id: payment.id,
            plan_type: planType,
            commission_inr: commissionInr,
          });

          console.log(`payment-webhook: credited ₹${commissionInr} commission to affiliate ${affiliateCode}`);
        } else {
          console.warn(`payment-webhook: affiliate code "${affiliateCode}" not found or inactive`);
        }
      } catch (affErr) {
        // Non-critical — don't fail the webhook if commission crediting fails
        console.error('payment-webhook: affiliate commission crediting failed', affErr);
      }
    }

  } catch (err: any) {
    console.error('payment-webhook: fulfillment failed', err);
    await db.from('payment_history').update({ status: 'failed', error_log: err.message }).eq('payment_id', payment.id);
    return res.status(500).json({ error: 'Fulfillment failed' });
  }

  return res.status(200).json({ received: true, processed: true });
}
