/**
 * Create Checkout - Vercel Serverless Function
 *
 * Creates a Razorpay order for the requested plan/section.
 * Falls back to mock mode if RAZORPAY_KEY_SECRET is not set (local dev / staging).
 *
 * To go live: add RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET to Vercel env vars.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';

  sectionToUnlock?: string;
  reportKey?: string;
}

const PRICING: Record<string, number> = {
  section_unlock: 4900,        // ₹49 in paise
  full_report_unlock: 16900,   // ₹169 in paise
  premium_monthly: 39900,      // ₹399 in paise
  astrologer_monthly: 149900,  // ₹1,499 in paise
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, planType, sectionToUnlock, reportKey } = req.body as CheckoutRequest;

    if (!userId || !planType) {
      return res.status(400).json({ error: 'Missing userId or planType' });
    }

    const amount = PRICING[planType];
    if (!amount) {
      return res.status(400).json({ error: 'Invalid plan type' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Mock fallback: Razorpay not yet configured
    if (!keyId || !keySecret) {
      const mockOrderId = `mock_order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      return res.status(200).json({
        success: true,
        orderId: mockOrderId,
        amount,
        currency: 'INR',
        planType,
        sectionToUnlock: sectionToUnlock || null,
        reportKey: reportKey || null,
        mock: true,
        message: 'Payment gateway coming soon.',
      });
    }

    // Real Razorpay order
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `rcpt_${userId.slice(0, 8)}_${Date.now()}`,
        userId,
        planType,
        sectionToUnlock: sectionToUnlock || '',
        reportKey: reportKey || '',
      },
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planType,
      sectionToUnlock: sectionToUnlock || null,
      reportKey: reportKey || null,
      mock: false,
      keyId,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
