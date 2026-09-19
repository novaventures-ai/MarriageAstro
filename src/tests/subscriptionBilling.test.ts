import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'crypto';
import { nextExpiry } from '../../api/payment-webhook';
import { resolveRecurringPlanId, recurringAvailability } from '../../api/create-checkout';

/**
 * premium_monthly was sold as "$14.99/mo" but created a one-time order, so it
 * never renewed and access lapsed silently after 30 days. These lock the three
 * things that make recurring billing actually work — and each has a failure
 * mode that is invisible until a renewal is due, weeks after the deploy.
 *
 *  1. Subscriptions sign a DIFFERENT string from orders, with the operands
 *     REVERSED. Get it wrong and every renewal fails verification.
 *  2. Renewals are debited slightly before the period ends, so extending from
 *     `now` silently shaves days off every single month.
 *  3. An e-mandate cannot be registered in USD, so a non-INR "subscription"
 *     must never be created — it would look fine and never debit.
 */

const SECRET = 'test_secret_key';
const PAYMENT = 'pay_TEST123';
const SUBSCRIPTION = 'sub_TEST123';
const ORDER = 'order_TEST123';

function makeDbMock(profileRow: Record<string, unknown> | null = { plan_expires_at: null }) {
  const calls: { table: string; op: string; payload: any }[] = [];
  const client = {
    from(table: string) {
      return {
        upsert(payload: any) { calls.push({ table, op: 'upsert', payload }); return Promise.resolve({ error: null }); },
        update(payload: any) {
          calls.push({ table, op: 'update', payload });
          return { eq: () => Promise.resolve({ error: null }) };
        },
        select() { return { eq: () => ({ single: () => Promise.resolve({ data: profileRow, error: null }) }) }; },
      };
    },
  };
  return { client, calls };
}

let dbMock = makeDbMock();
vi.mock('@supabase/supabase-js', () => ({ createClient: () => dbMock.client }));

function makeRes() {
  const out: any = { statusCode: 0, body: null };
  return {
    res: {
      status(c: number) { out.statusCode = c; return this; },
      json(b: any) { out.body = b; return this; },
    } as any,
    out,
  };
}

async function callVerify(body: Record<string, unknown>) {
  const mod = await import('../../api/verify-payment');
  const { res, out } = makeRes();
  await (mod.default as any)({ method: 'POST', body } as any, res);
  return out;
}

/** Razorpay signs subscriptions as payment|subscription — note the order. */
const subscriptionSignature = () =>
  crypto.createHmac('sha256', SECRET).update(`${PAYMENT}|${SUBSCRIPTION}`).digest('hex');
/** ...and orders as order|payment. */
const orderSignature = () =>
  crypto.createHmac('sha256', SECRET).update(`${ORDER}|${PAYMENT}`).digest('hex');

describe('subscription signature verification', () => {
  beforeEach(() => {
    vi.resetModules();
    dbMock = makeDbMock();
    process.env.RAZORPAY_KEY_SECRET = SECRET;
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_role_test';
  });

  it('accepts a subscription signed as payment|subscription', async () => {
    const out = await callVerify({
      razorpay_payment_id: PAYMENT,
      razorpay_subscription_id: SUBSCRIPTION,
      razorpay_signature: subscriptionSignature(),
      userId: 'user-123',
      planType: 'premium_monthly',
      currency: 'INR',
    });
    expect(out.statusCode).toBe(200);
    expect(out.body).toEqual({ valid: true });
  });

  it('rejects a subscription signed with the ORDER form', async () => {
    // The exact regression this guards: reusing `order_id|payment_id` for a
    // subscription. It would pass review and fail on every renewal.
    const wrong = crypto.createHmac('sha256', SECRET)
      .update(`${SUBSCRIPTION}|${PAYMENT}`).digest('hex');
    const out = await callVerify({
      razorpay_payment_id: PAYMENT,
      razorpay_subscription_id: SUBSCRIPTION,
      razorpay_signature: wrong,
      userId: 'user-123',
      planType: 'premium_monthly',
    });
    expect(out.statusCode).toBe(401);
  });

  it('still accepts a plain order signed as order|payment', async () => {
    const out = await callVerify({
      razorpay_payment_id: PAYMENT,
      razorpay_order_id: ORDER,
      razorpay_signature: orderSignature(),
      userId: 'user-123',
      planType: 'section_unlock',
      sectionToUnlock: 'sexual_detail',
    });
    expect(out.body).toEqual({ valid: true });
  });

  it('marks a subscription purchase active and a one-off purchase not', async () => {
    await callVerify({
      razorpay_payment_id: PAYMENT,
      razorpay_subscription_id: SUBSCRIPTION,
      razorpay_signature: subscriptionSignature(),
      userId: 'user-123',
      planType: 'premium_monthly',
      currency: 'INR',
    });
    const sub = dbMock.calls.find(c => c.table === 'profiles' && c.op === 'update');
    expect(sub!.payload.subscription_status).toBe('active');
    expect(sub!.payload.razorpay_subscription_id).toBe(SUBSCRIPTION);

    dbMock = makeDbMock();
    await callVerify({
      razorpay_payment_id: PAYMENT,
      razorpay_order_id: ORDER,
      razorpay_signature: orderSignature(),
      userId: 'user-123',
      planType: 'premium_monthly',
      currency: 'USD',
    });
    const once = dbMock.calls.find(c => c.table === 'profiles' && c.op === 'update');
    // NULL, not 'active' — nothing will ever debit this customer again.
    expect(once!.payload.subscription_status).toBeNull();
  });
});

describe('currency is recorded, never inferred', () => {
  beforeEach(() => {
    vi.resetModules();
    dbMock = makeDbMock();
    process.env.RAZORPAY_KEY_SECRET = SECRET;
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_role_test';
  });

  it.each([
    ['USD', 'USD'],
    ['INR', 'INR'],
    [undefined, 'INR'],   // absent must not become a dollar sale
    ['GBP', 'INR'],       // unsupported falls back rather than storing junk
  ])('currency %s is stored as %s', async (sent, stored) => {
    await callVerify({
      razorpay_payment_id: PAYMENT,
      razorpay_order_id: ORDER,
      razorpay_signature: orderSignature(),
      userId: 'user-123',
      planType: 'premium_monthly',
      amount: 1499,
      currency: sent,
    });
    const hist = dbMock.calls.find(c => c.table === 'payment_history');
    expect(hist!.payload.currency).toBe(stored);
  });
});

describe('nextExpiry', () => {
  const now = Date.parse('2026-09-19T00:00:00Z');
  const CYCLE = 30 * 24 * 60 * 60 * 1000;

  it('extends from the existing expiry when the renewal lands early', () => {
    // Razorpay debits before the cycle ends. Extending from `now` would lose
    // those days every month — a customer would drift backwards through the year.
    const expiry = new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(Date.parse(nextExpiry(expiry, now))).toBe(Date.parse(expiry) + CYCLE);
  });

  it('extends from now when the plan already lapsed', () => {
    const lapsed = new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString();
    expect(Date.parse(nextExpiry(lapsed, now))).toBe(now + CYCLE);
  });

  it('handles a first charge with no prior expiry', () => {
    expect(Date.parse(nextExpiry(null, now))).toBe(now + CYCLE);
  });

  it('never returns a date in the past', () => {
    for (const prior of [null, new Date(now - 1e10).toISOString(), new Date(now + 1e9).toISOString()]) {
      expect(Date.parse(nextExpiry(prior, now))).toBeGreaterThan(now);
    }
  });
});

describe('a plan is live exactly when its Plan ID is configured', () => {
  /**
   * This block used to assert "INR only", on the reading that a recurring
   * mandate requires an India-issued card. That conflated e-mandate (bank
   * debits over NACH, genuinely India-only) with recurring CARD payments,
   * which Razorpay supports in roughly 100 currencies — its own plan form
   * offers EUR, SGD and USD alongside INR.
   *
   * Currency was never the right question. Razorpay fixes a plan's amount AND
   * currency at creation, so there is one Plan per currency, and a currency is
   * live exactly when its Plan ID is set — which also tracks what the account
   * is actually entitled to do.
   */
  const INR_ONLY = {
    RAZORPAY_PLAN_PREMIUM_MONTHLY_INR: 'plan_INR_PREM',
    RAZORPAY_PLAN_ASTROLOGER_MONTHLY_INR: 'plan_INR_ASTR',
  };
  const BOTH = {
    ...INR_ONLY,
    RAZORPAY_PLAN_PREMIUM_MONTHLY_USD: 'plan_USD_PREM',
    RAZORPAY_PLAN_ASTROLOGER_MONTHLY_USD: 'plan_USD_ASTR',
  };

  it('resolves the plan for the currency being charged', () => {
    expect(resolveRecurringPlanId('premium_monthly', 'INR', BOTH)).toBe('plan_INR_PREM');
    expect(resolveRecurringPlanId('premium_monthly', 'USD', BOTH)).toBe('plan_USD_PREM');
    expect(resolveRecurringPlanId('astrologer_monthly', 'USD', BOTH)).toBe('plan_USD_ASTR');
  });

  it('never bills one currency against another currency\'s plan', () => {
    // The costly failure: charging a USD customer against a Rs 399 plan.
    expect(resolveRecurringPlanId('premium_monthly', 'USD', INR_ONLY)).toBeNull();
  });

  it('lets a currency be switched on independently', () => {
    // Adding USD plans must not require touching INR, and vice versa.
    expect(resolveRecurringPlanId('premium_monthly', 'INR', INR_ONLY)).toBe('plan_INR_PREM');
    expect(resolveRecurringPlanId('premium_monthly', 'USD', INR_ONLY)).toBeNull();
  });

  it('refuses one-off products in every currency', () => {
    for (const currency of ['INR', 'USD']) {
      expect(resolveRecurringPlanId('section_unlock', currency, BOTH)).toBeNull();
      expect(resolveRecurringPlanId('full_report_unlock', currency, BOTH)).toBeNull();
    }
  });

  it('falls back to a one-time order when nothing is configured', () => {
    // This is the state until the dashboard side is done, so it must be inert
    // rather than an error.
    expect(resolveRecurringPlanId('premium_monthly', 'INR', {})).toBeNull();
    expect(resolveRecurringPlanId('premium_monthly', 'USD', {})).toBeNull();
  });

  it('reports availability per plan, for honest UI copy', () => {
    expect(recurringAvailability('USD', INR_ONLY))
      .toEqual({ premium_monthly: false, astrologer_monthly: false });
    expect(recurringAvailability('INR', INR_ONLY))
      .toEqual({ premium_monthly: true, astrologer_monthly: true });
    // A half-configured currency must not claim the unconfigured plan renews.
    expect(recurringAvailability('USD', { RAZORPAY_PLAN_PREMIUM_MONTHLY_USD: 'p' }))
      .toEqual({ premium_monthly: true, astrologer_monthly: false });
  });
});
