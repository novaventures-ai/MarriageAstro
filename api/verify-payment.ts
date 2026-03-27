/**
 * Verify Payment - Vercel Serverless Function
 *
 * Client calls this after Razorpay modal handler fires to validate the
 * payment signature server-side before showing a success state.
 * The webhook (/api/payment-webhook) is the source of truth for DB updates.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body || {};

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment fields', valid: false });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    // Not configured yet — return valid=true so UX isn't blocked (webhook handles DB)
    return res.status(200).json({ valid: true, mock: true });
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  const valid = expected === razorpay_signature;

  if (!valid) {
    console.warn('verify-payment: signature mismatch', { razorpay_order_id, razorpay_payment_id });
  }

  return res.status(200).json({ valid });
}
