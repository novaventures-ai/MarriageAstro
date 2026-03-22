/**
 * Create Checkout - Vercel Serverless Function
 *
 * Currently returns a mock checkout session.
 * When Razorpay is ready, swap the mock with real order creation:
 *
 * TODO (Razorpay swap ~2-3 hours):
 * 1. npm install razorpay
 * 2. Add RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET to Vercel env
 * 3. Replace mock below with:
 *    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! });
 *    const order = await razorpay.orders.create({ amount: amountInPaise, currency: 'INR', receipt: `receipt_${userId}_${Date.now()}` });
 * 4. Return order.id to client
 * 5. Add Razorpay checkout.js script to index.html
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CheckoutRequest {
  userId: string;
  planType: 'section_unlock' | 'premium_monthly' | 'astrologer_monthly';
  sectionToUnlock?: string;
}

const PRICING = {
  section_unlock: 4900,       // ₹49 in paise
  full_report_unlock: 16900,  // ₹169 in paise
  premium_monthly: 39900,     // ₹399 in paise
  astrologer_monthly: 149900, // ₹1,499 in paise
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, planType, sectionToUnlock } = req.body as CheckoutRequest;

    if (!userId || !planType) {
      return res.status(400).json({ error: 'Missing userId or planType' });
    }

    const amount = PRICING[planType];
    if (!amount) {
      return res.status(400).json({ error: 'Invalid plan type' });
    }

    // TODO: Replace with real Razorpay order creation
    // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! });
    // const order = await razorpay.orders.create({
    //   amount,
    //   currency: 'INR',
    //   receipt: `receipt_${userId}_${Date.now()}`,
    //   notes: { userId, planType, sectionToUnlock: sectionToUnlock || '' },
    // });

    // Mock response
    const mockOrderId = `mock_order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    return res.status(200).json({
      success: true,
      orderId: mockOrderId,
      amount,
      currency: 'INR',
      planType,
      sectionToUnlock: sectionToUnlock || null,
      mock: true, // Remove when Razorpay is live
      message: 'Payment gateway coming soon. This is a mock checkout session.',
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
