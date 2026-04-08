import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase service role or URL not configured');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    razorpay_payment_id, 
    razorpay_order_id, 
    razorpay_signature,
    // Metadata passed from client for synchronous fulfillment
    userId,
    planType,
    sectionToUnlock,
    reportKey,
    amount
  } = req.body || {};

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment fields', valid: false });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return res.status(200).json({ valid: true, mock: true });
  }

  // 1. Verify Signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  const valid = expected === razorpay_signature;

  if (!valid) {
    console.warn('verify-payment: signature mismatch', { razorpay_order_id, razorpay_payment_id });
    return res.status(401).json({ error: 'Invalid signature', valid: false });
  }

  // 2. Synchronous Fulfillment (Immediate UI satisfaction)
  // This provides a first-pass unlock while the webhook serves as the background source of truth.
  if (userId && planType) {
    try {
      const db = getServiceClient();
      
      // Record in history
      await db.from('payment_history').upsert({
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        user_id: userId,
        plan_type: planType,
        section_id: sectionToUnlock || null,
        report_key: reportKey || null,
        amount: amount || 0,
        status: 'success',
        raw_payload: { verified_at: new Date().toISOString() }
      }, { onConflict: 'payment_id' });

      // Apply unlock
      if ((planType === 'section_unlock' || planType === 'full_report_unlock') && reportKey) {
        await db.from('report_unlocks').upsert({
          user_id: userId,
          report_key: reportKey,
          section_id: planType === 'full_report_unlock' ? 'full_report' : sectionToUnlock,
          payment_id: razorpay_payment_id
        });
      } else if (planType === 'premium_monthly') {
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        await db.from('profiles').update({ plan_tier: 'premium', plan_expires_at: expiresAt }).eq('id', userId);
      } else if (planType === 'astrologer_monthly') {
        await db.from('profiles').update({ plan_tier: 'astrologer' }).eq('id', userId);
      }

      console.log(`verify-payment: synchronous fulfillment success for ${userId} (${planType})`);
    } catch (dbErr) {
      console.error('verify-payment: database fulfillment error', dbErr);
      // We don't fail the response because signature is valid — webhook will retry fulfillment
    }
  }

  return res.status(200).json({ valid: true });
}
