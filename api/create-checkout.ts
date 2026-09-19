/**
 * Create Checkout - Vercel Serverless Function
 *
 * GET  /api/create-checkout          → { country, currency, isInternational }
 * POST /api/create-checkout  { ... } → Razorpay subscription OR one-time order
 *
 * GET is used by the frontend to detect visitor region for currency display.
 * POST switches to USD for non-Indian visitors.
 *
 * RECURRING vs ONE-TIME
 * A monthly plan is sold as a real Razorpay Subscription so it auto-renews.
 * That is only possible in INR: e-mandate registration requires a card issued
 * in India and a mandate in INR — issuing banks do not support mandates in any
 * other currency. So an international monthly falls back to a one-time order
 * granting 30 days, and the UI must not call it a subscription. Section and
 * full-report unlocks are one-time purchases in every region.
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

/**
 * Subscription products, by plan type. Each resolves to a Razorpay Plan ID held
 * in an env var named RAZORPAY_PLAN_<PLAN>_<CURRENCY>, created once in the
 * dashboard (Subscriptions → Plans). A plan is created per currency because
 * Razorpay fixes a plan's amount AND currency at creation and neither can be
 * changed afterwards.
 *
 * When a plan ID is absent the endpoint degrades to a one-time order rather
 * than failing the sale, so a currency can be switched on independently just by
 * adding its env var.
 */
const RECURRING_PLANS = new Set(['premium_monthly', 'astrologer_monthly']);

const planEnvKey = (planType: string, currency: string) =>
  `RAZORPAY_PLAN_${planType.toUpperCase()}_${currency.toUpperCase()}`;

/** Billing cycles to schedule. 120 months is Razorpay's practical "until cancelled". */
const TOTAL_BILLING_CYCLES = 120;

/**
 * The Plan ID to subscribe this sale to, or null to fall back to a one-time
 * order.
 *
 * This used to refuse every non-INR currency outright, on the reading that a
 * recurring mandate requires an India-issued card. That conflated two distinct
 * rails: e-mandate (bank debits over NACH, genuinely India-only) with recurring
 * CARD payments, which Razorpay supports in roughly 100 currencies. Its own
 * plan form offers EUR, SGD and USD alongside INR.
 *
 * So the currency no longer decides — the presence of a configured Plan does.
 * A currency is live exactly when its Plan ID is set, which also tracks what
 * the account is actually entitled to do.
 */
export function resolveRecurringPlanId(
  planType: string,
  currency: string,
  env: Record<string, string | undefined>,
): string | null {
  if (!RECURRING_PLANS.has(planType)) return null;  // not a subscription product
  return env[planEnvKey(planType, currency)] || null;
}

/** Which of this currency's monthly plans are configured, for honest UI copy. */
export function recurringAvailability(
  currency: string,
  env: Record<string, string | undefined>,
): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const plan of RECURRING_PLANS) {
    out[plan] = Boolean(resolveRecurringPlanId(plan, currency, env));
  }
  return out;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET → region detection (used by frontend for currency display)
  if (req.method === 'GET') {
    const country = ((req.headers['x-vercel-ip-country'] as string) || 'IN').toUpperCase();
    const isInternational = country !== 'IN';
    const currency = isInternational ? 'USD' : 'INR';
    // Short cache: this now carries which plans recur, which changes the moment
    // a plan ID is configured. An hour of stale "does not renew" copy after
    // switching a currency on would be a lie the UI tells itself.
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).json({
      country,
      currency,
      isInternational,
      recurring: recurringAvailability(currency, process.env),
    });
  }

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
        recurring: false,
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

    // NOTE: To accept USD payments, enable "International Payments" in your
    // Razorpay Dashboard → Settings → International Payments.
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const notes = {
      userId,
      planType,
      sectionToUnlock: sectionToUnlock || '',
      reportKey: reportKey || '',
      affiliateCode: affiliateCode || '',
      country,
    };

    // Recurring path: a real subscription that auto-debits every month.
    const recurringPlanId = resolveRecurringPlanId(planType, currency, process.env);
    if (recurringPlanId) {
      const subscription = await razorpay.subscriptions.create({
        plan_id: recurringPlanId,
        total_count: TOTAL_BILLING_CYCLES,
        quantity: 1,
        customer_notify: 1,
        notes,
      } as any);

      return res.status(200).json({
        success: true,
        recurring: true,
        subscriptionId: subscription.id,
        amount,
        currency,
        country,
        planType,
        sectionToUnlock: null,
        reportKey: null,
        mock: false,
        keyId,
      });
    }

    // One-time path: unlocks everywhere, and monthly plans outside INR.
    const orderParams = {
      amount,
      currency,
      receipt: `rcpt_${userId.slice(0, 8)}_${Date.now()}`,
      notes,
    };

    const order = await razorpay.orders.create(orderParams);

    return res.status(200).json({
      success: true,
      recurring: false,
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
