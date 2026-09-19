/**
 * Payment Webhook - Vercel Serverless Function
 *
 * Handles Razorpay `payment.captured` and the subscription lifecycle events
 * that keep a recurring plan alive: `subscription.charged` (a renewal was
 * debited), plus `cancelled` / `halted` / `completed` / `paused` (the mandate
 * stopped producing charges).
 *
 * A renewal arrives ONLY as a webhook — there is no browser session to verify
 * it — so this endpoint is the sole thing standing between a successful auto-
 * debit and a customer losing access they paid for.
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

/**
 * Razorpay signs the EXACT bytes it sent. Vercel's default body parser consumes
 * the stream and hands back a parsed object, and `JSON.stringify` of that object
 * is not the original payload — key order, whitespace and unicode escaping all
 * differ. Verifying against a re-serialized body therefore fails for every
 * delivery, which is why no webhook had ever written a row: the endpoint was
 * enabled and reachable, and rejected 100% of deliveries as forged.
 *
 * Disabling the parser gives us the raw bytes to verify, and we parse them
 * ourselves afterwards.
 */
export const config = { api: { bodyParser: false } };

async function readRawBody(req: VercelRequest): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req as unknown as AsyncIterable<Buffer | string>) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    // Fail loudly: without the secret we cannot verify the signature, so we must
    // NOT silently 200 (that would drop a real payment with no trace). Returning
    // 500 surfaces the misconfiguration in monitoring and makes Razorpay retry.
    console.error('payment-webhook: RAZORPAY_WEBHOOK_SECRET not set — cannot verify webhook, refusing to process');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const signature = (req.headers['x-razorpay-signature'] as string) || '';

  // `req.body` is undefined here by design — see the config export above.
  let rawBody: string;
  try {
    rawBody = await readRawBody(req);
  } catch (err) {
    console.error('payment-webhook: could not read request body', err);
    return res.status(400).json({ error: 'Unreadable body' });
  }

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

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    console.error('payment-webhook: body passed signature but is not JSON');
    return res.status(400).json({ error: 'Malformed JSON' });
  }
  const eventType: string = event?.event || '';

  if (eventType.startsWith('subscription.')) {
    return handleSubscriptionEvent(eventType, event, res);
  }

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
    currency: payment.currency === 'USD' ? 'USD' : 'INR',
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
    } else if (planType === 'section_unlock' || planType === 'full_report_unlock') {
      // SAFETY NET — mirrors api/verify-payment.ts. Both branches above require a
      // reportKey; a purchase made from a page that does not supply one (the
      // self-report) previously fell through here and was silently dropped, so the
      // customer paid and received nothing with no recovery path. Grant the unlock
      // globally instead: usePremium.isSectionUnlocked honours
      // profiles.unlocked_sections without a reportKey.
      const sid = planType === 'full_report_unlock' ? 'full_report' : sectionToUnlock;
      if (sid && !existing.includes(sid)) {
        await db.from('profiles')
          .update({ unlocked_sections: [...existing, sid] })
          .eq('id', userId);
        console.log(`payment-webhook: granted GLOBAL unlock "${sid}" to ${userId} (no reportKey)`);
      }
    } else if (planType === 'premium_monthly') {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await db.from('profiles').update({ plan_tier: 'premium', plan_expires_at: expiresAt }).eq('id', userId);
    } else if (planType === 'astrologer_monthly') {
      // Previously stored NULL, which loadPlanTier reads as "never expires" —
      // one payment bought the tier permanently. It is a monthly plan; it gets
      // a month, and a subscription renewal extends it.
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await db.from('profiles').update({ plan_tier: 'astrologer', plan_expires_at: expiresAt }).eq('id', userId);
    }

    await db.from('payment_history').update({ status: 'success' }).eq('payment_id', payment.id);
    console.log(`payment-webhook: successfully fulfilled ${planType} for user ${userId}`);

    // Credit affiliate commission if a referral code is present
    if (affiliateCode) {
      const isUsd = (payment.currency || '').toUpperCase() === 'USD';

      // INR commission: ₹10 / ₹20 / ₹100 / ₹200
      // USD purchases earn higher commission (prices are ~3-4x higher)
      const commissionInr = isUsd
        ? (planType === 'astrologer_monthly' ? 400
          : planType === 'premium_monthly' ? 200
          : planType === 'full_report_unlock' ? 80
          : 40) // section_unlock
        : (planType === 'astrologer_monthly' ? 200
          : planType === 'premium_monthly' ? 100
          : planType === 'full_report_unlock' ? 20
          : 10); // section_unlock

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


/** 30 days in milliseconds — one billing cycle. */
const CYCLE_MS = 30 * 24 * 60 * 60 * 1000;

/** Razorpay subscription state → the state we store on the profile. */
const SUBSCRIPTION_STATE: Record<string, string> = {
  'subscription.activated': 'active',
  'subscription.charged':   'active',
  'subscription.authenticated': 'authenticated',
  'subscription.pending':   'pending',
  // A paused subscription that resumes is active again. Without this it stayed
  // recorded as 'pending' forever — access was unaffected (gating reads
  // plan_expires_at) but the field you would check to answer "is this customer
  // active?" said no.
  'subscription.resumed':   'active',
  'subscription.halted':    'halted',
  'subscription.cancelled': 'cancelled',
  'subscription.completed': 'completed',
  'subscription.paused':    'pending',
};

/**
 * Extend a plan by one cycle from whichever is later: now, or the existing
 * expiry. Renewals are debited a little BEFORE the period ends, so extending
 * from `now` would silently shave days off every month.
 */
export function nextExpiry(currentExpiry: string | null | undefined, now = Date.now()): string {
  const base = currentExpiry ? Math.max(now, new Date(currentExpiry).getTime()) : now;
  return new Date(base + CYCLE_MS).toISOString();
}

async function handleSubscriptionEvent(eventType: string, event: any, res: VercelResponse) {
  const subscription = event?.payload?.subscription?.entity;
  if (!subscription) {
    return res.status(400).json({ error: 'Missing subscription entity' });
  }

  // Decide whether we care about this event BEFORE demanding the metadata it
  // would need. The dashboard lets you subscribe to every subscription event,
  // and the ones we ignore (subscription.updated) may arrive without notes —
  // as do Razorpay's own test pings. Answering 400 to those makes Razorpay
  // retry an event we were always going to discard.
  const status = SUBSCRIPTION_STATE[eventType];
  if (!status) {
    return res.status(200).json({ received: true, processed: false, note: `unhandled ${eventType}` });
  }

  const userId = subscription?.notes?.userId;
  const planType = subscription?.notes?.planType;
  if (!userId) {
    console.error(`payment-webhook: ${eventType} carried no userId in notes`, subscription.id);
    return res.status(400).json({ error: 'Missing userId in subscription notes' });
  }

  try {
    const db = getServiceClient();
    const update: Record<string, unknown> = {
      razorpay_subscription_id: subscription.id,
      subscription_status: status,
    };

    if (eventType === 'subscription.charged') {
      // Money arrived: extend access and record the charge.
      const { data: profile } = await db
        .from('profiles').select('plan_expires_at').eq('id', userId).single();

      update.plan_tier = planType === 'astrologer_monthly' ? 'astrologer' : 'premium';
      update.plan_expires_at = nextExpiry(profile?.plan_expires_at);

      const payment = event?.payload?.payment?.entity;
      if (payment?.id) {
        await db.from('payment_history').upsert({
          payment_id: payment.id,
          order_id: payment.order_id || null,
          subscription_id: subscription.id,
          user_id: userId,
          plan_type: planType || 'premium_monthly',
          amount: payment.amount ?? 0,
          currency: payment.currency === 'USD' ? 'USD' : 'INR',
          status: 'success',
          raw_payload: { event: eventType, renewed_at: new Date().toISOString() },
        }, { onConflict: 'payment_id' });
      }
    }

    // cancelled / halted / completed deliberately leave plan_expires_at alone:
    // the customer paid for the cycle they are in and keeps it to the end.
    // loadPlanTier drops them to free once that date passes.
    await db.from('profiles').update(update).eq('id', userId);

    console.log(`payment-webhook: ${eventType} → ${status} for ${userId} (${subscription.id})`);
    return res.status(200).json({ received: true, processed: true, status });
  } catch (err) {
    console.error(`payment-webhook: failed handling ${eventType}`, err);
    // 500 makes Razorpay retry rather than dropping a renewal.
    return res.status(500).json({ error: 'Subscription fulfillment failed' });
  }
}
