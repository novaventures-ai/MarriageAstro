import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'crypto';
import { Readable } from 'stream';

/**
 * The webhook was enabled and reachable in production from 7 Apr 2026 and never
 * once processed a delivery. It verified the signature against
 * `JSON.stringify(req.body)` — Vercel's PARSED body, re-serialized. Razorpay
 * signs the exact bytes it sent, and a re-serialized object is not those bytes
 * whenever escaping, whitespace or key order differ, so every delivery was
 * rejected as forged and the endpoint answered 401 to a genuine payment.
 *
 * Nothing surfaced it: fulfilment happened synchronously in the browser via
 * verify-payment, so the only visible symptom was raw_payload never containing
 * a webhook event. It becomes critical with recurring billing, where a renewal
 * has NO browser session and the webhook is the only path that can extend a
 * subscription.
 *
 * These feed the handler a raw byte stream, exactly as Vercel does with the
 * body parser disabled.
 */

const SECRET = 'whsec_test';

const dbCalls: { table: string; op: string; payload: any }[] = [];
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from(table: string) {
      return {
        upsert(payload: any) { dbCalls.push({ table, op: 'upsert', payload }); return Promise.resolve({ error: null }); },
        update(payload: any) {
          dbCalls.push({ table, op: 'update', payload });
          return { eq: () => Promise.resolve({ error: null }) };
        },
        select() { return { eq: () => ({ single: () => Promise.resolve({ data: { plan_expires_at: null }, error: null }) }) }; },
      };
    },
  }),
}));

function sign(raw: string) {
  return crypto.createHmac('sha256', SECRET).update(raw).digest('hex');
}

/** A request whose body is only available as a stream, as Vercel delivers it. */
function makeReq(raw: string, signature: string) {
  const req: any = Readable.from([Buffer.from(raw, 'utf8')]);
  req.method = 'POST';
  req.headers = { 'x-razorpay-signature': signature };
  // Deliberately absent: with bodyParser disabled there is no req.body.
  return req;
}

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

async function post(raw: string, signature: string) {
  const mod = await import('../../api/payment-webhook');
  const { res, out } = makeRes();
  await (mod.default as any)(makeReq(raw, signature), res);
  return out;
}

describe('webhook signature is verified against the RAW body', () => {
  beforeEach(() => {
    vi.resetModules();
    dbCalls.length = 0;
    process.env.RAZORPAY_WEBHOOK_SECRET = SECRET;
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_role_test';
  });

  /** Pretty-printed, exactly as a real Razorpay delivery may arrive. */
  const prettyRaw = JSON.stringify({
    event: 'subscription.charged',
    payload: {
      subscription: { entity: { id: 'sub_X', notes: { userId: 'u-1', planType: 'premium_monthly' } } },
      payment: { entity: { id: 'pay_X', amount: 39900, currency: 'INR', order_id: null } },
    },
  }, null, 2);

  it('accepts a delivery whose raw bytes are not what JSON.stringify would produce', async () => {
    // The regression in one line: JSON.stringify(JSON.parse(prettyRaw)) is a
    // DIFFERENT string, so the old code hashed the wrong bytes.
    expect(JSON.stringify(JSON.parse(prettyRaw))).not.toBe(prettyRaw);

    const out = await post(prettyRaw, sign(prettyRaw));
    expect(out.statusCode).toBe(200);
    expect(out.body.processed).toBe(true);
  });

  it('accepts non-ASCII payloads, which re-serializing mangles', async () => {
    const raw = JSON.stringify({
      event: 'subscription.charged',
      payload: {
        subscription: { entity: { id: 'sub_Y', notes: { userId: 'u-2', planType: 'premium_monthly', name: 'Güneş Ünal' } } },
        payment: { entity: { id: 'pay_Y', amount: 1499, currency: 'USD' } },
      },
    });
    const out = await post(raw, sign(raw));
    expect(out.statusCode).toBe(200);
  });

  it('still rejects a forged signature', async () => {
    const out = await post(prettyRaw, 'deadbeef');
    expect(out.statusCode).toBe(401);
    expect(dbCalls).toHaveLength(0);
  });

  it('rejects a body altered after signing', async () => {
    const tampered = prettyRaw.replace('39900', '1');
    const out = await post(tampered, sign(prettyRaw));
    expect(out.statusCode).toBe(401);
  });

  it('refuses to process when the secret is not configured', async () => {
    delete process.env.RAZORPAY_WEBHOOK_SECRET;
    const out = await post(prettyRaw, sign(prettyRaw));
    // 500, never a silent 200 — a dropped payment must be visible.
    expect(out.statusCode).toBe(500);
  });

  it('a renewal extends the plan and records the charge', async () => {
    await post(prettyRaw, sign(prettyRaw));
    const profile = dbCalls.find(c => c.table === 'profiles' && c.op === 'update');
    expect(profile!.payload.plan_tier).toBe('premium');
    expect(Date.parse(profile!.payload.plan_expires_at as string)).toBeGreaterThan(Date.now());
    expect(profile!.payload.subscription_status).toBe('active');

    const hist = dbCalls.find(c => c.table === 'payment_history');
    expect(hist!.payload.subscription_id).toBe('sub_X');
    expect(hist!.payload.currency).toBe('INR');
  });
});

describe('every event the dashboard lets you subscribe to is safe to enable', () => {
  /**
   * Razorpay's webhook editor offers ten subscription events and it is natural
   * to tick them all. Two of them — `resumed` and `updated` — were not in the
   * handler's state map, and the "do we care about this event" check ran AFTER
   * the check demanding notes.userId. So an ignored event arriving without
   * notes (Razorpay's own test pings, or a subscription created outside our
   * checkout) answered 400, and Razorpay retries 4xx — a retry loop over an
   * event we were always going to discard.
   */
  beforeEach(() => {
    vi.resetModules();
    dbCalls.length = 0;
    process.env.RAZORPAY_WEBHOOK_SECRET = SECRET;
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_role_test';
  });

  const ALL_DASHBOARD_EVENTS = [
    'subscription.authenticated', 'subscription.paused', 'subscription.resumed',
    'subscription.activated', 'subscription.pending', 'subscription.halted',
    'subscription.charged', 'subscription.cancelled', 'subscription.completed',
    'subscription.updated',
  ];

  it.each(ALL_DASHBOARD_EVENTS)('%s never answers an error', async (event) => {
    const raw = JSON.stringify({
      event,
      payload: {
        subscription: { entity: { id: 'sub_Z', notes: { userId: 'u-9', planType: 'premium_monthly' } } },
        payment: { entity: { id: `pay_${event}`, amount: 39900, currency: 'INR' } },
      },
    });
    const out = await post(raw, sign(raw));
    expect(out.statusCode, `${event} would make Razorpay retry`).toBe(200);
  });

  /** The only event we deliberately discard. */
  const IGNORED = ['subscription.updated'];

  it.each(ALL_DASHBOARD_EVENTS)('%s does not retry-loop when notes are absent', async (event) => {
    // Razorpay's test ping carries no notes. An event we DISCARD must still be
    // accepted, or Razorpay retries something we were never going to act on.
    // An event we act on may legitimately answer 400 — it cannot know which
    // profile to update, and a retry will not supply one.
    const raw = JSON.stringify({ event, payload: { subscription: { entity: { id: 'sub_NONOTES' } } } });
    const out = await post(raw, sign(raw));
    if (IGNORED.includes(event)) {
      expect(out.statusCode, `${event} is ignored but would make Razorpay retry`).toBe(200);
    } else {
      expect(out.statusCode, `${event} is acted on, so it must report missing notes`).toBe(400);
    }
  });

  it('a resumed subscription reads as active, not still-paused', async () => {
    const raw = JSON.stringify({
      event: 'subscription.resumed',
      payload: { subscription: { entity: { id: 'sub_R', notes: { userId: 'u-9', planType: 'premium_monthly' } } } },
    });
    await post(raw, sign(raw));
    const profile = dbCalls.find(c => c.table === 'profiles' && c.op === 'update');
    expect(profile!.payload.subscription_status).toBe('active');
  });

  it('an ignored event writes nothing', async () => {
    const raw = JSON.stringify({
      event: 'subscription.updated',
      payload: { subscription: { entity: { id: 'sub_U', notes: { userId: 'u-9' } } } },
    });
    const out = await post(raw, sign(raw));
    expect(out.body.processed).toBe(false);
    expect(dbCalls).toHaveLength(0);
  });
});
