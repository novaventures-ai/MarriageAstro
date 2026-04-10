/**
 * Create Checkout - Vercel Serverless Function
 *
 * Creates a Razorpay order for the requested plan/section.
 * Automatically switches to USD pricing for non-Indian visitors using
 * Vercel's x-vercel-ip-country header.
 *
 * Falls back to mock mode if RAZORPAY_KEY_SECRET is not set (local dev / staging).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';

interface CheckoutRequest {
  userId: string;
  planType: 'premium_monthly' | 'astrologer_monthly' | 'section_unlock' | 'full_report_unlock' | 'test_order';
  sectionToUnlock?: string;
  reportKey?: string;
  affiliateCode?: string;
}

// Amounts in smallest currency unit (paise for INR, cents for USD)
const PRICING_INR: Record<string, number> = {
  section_unlock:     4900,    // ₹49
  full_report_unlock: 16900,   // ₹169
  premium_monthly:    39900,   // ₹399
  astrologer_monthly: 149900,  // ₹1,499
};

const PRICING_USD: Record<string, number> = {
  section_unlock:     499,     // $4.99
  full_report_unlock: 1299,    // $12.99
  premium_monthly:    1499,    // $14.99
  astrologer_monthly: 3999,    // $39.99
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, planType, sectionToUnlock, reportKey, affiliateCode } = req.body as CheckoutRequest;

    if (!userId || !planType) {
      return res.status(400).json({ error: 'Missing userId or planType' });
    }

    // Detect country from Vercel's automatic header
    const country = ((req.headers['x-vercel-ip-country'] as string) || 'IN').toUpperCase();
    const isInternational = country !== 'IN';
    const currency = isInternational ? 'USD' : 'INR';
    const pricingTable = isInternational ? PRICING_USD : PRICING_INR;

    const amount = pricingTable[planType];
    if (!amount) {
      return res.status(400).json({ error: `Invalid plan type: ${planType}` });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Mock fallback: Razorpay not yet configured
    if (!keyId || !keySecret) {
      console.log('create-checkout: Razorpay keys missing, falling back to mock mode');
      const mockOrderId = `mock_order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      return res.status(200).json({
        success: true,
        orderId: mockOrderId,
        amount,
        currency,
        country,
        planType,
        sectionToUnlock: sectionToUnlock || null,
        reportKey: reportKey || null,
        mock: true,
        message: 'Payment gateway configuration missing. Mock mode enabled.',
      });
    }

    // Real Razorpay order
    // NOTE: To accept USD payments, enable "International Payments" in your
    // Razorpay Dashboard → Settings → International Payments.
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const orderParams = {
      amount,
      currency,
      receipt: `rcpt_${userId.slice(0, 8)}_${Date.now()}`,
      notes: {
        userId,
        planType,
        sectionToUnlock: sectionToUnlock || '',
        reportKey: reportKey || '',
        affiliateCode: affiliateCode || '',
        country,
      },
    };

    const order = await razorpay.orders.create(orderParams);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      country,
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
