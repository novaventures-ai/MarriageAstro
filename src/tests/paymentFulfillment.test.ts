import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'crypto';

/**
 * A verified payment must ALWAYS grant something.
 *
 * The unlock branches in verify-payment and payment-webhook both required a
 * `reportKey`. SelfReportPage never passed one, so a ₹49 module purchase made
 * from the self-report verified the signature, wrote payment_history, and then
 * fell through every branch — no row in report_unlocks, no profile update. The
 * customer was charged and received nothing, and because the webhook carried
 * the identical guard there was no recovery path.
 *
 * These lock the invariant: for any section/full unlock with a valid signature,
 * SOME entitlement is written — scoped to the report when a key is supplied,
 * global otherwise.
 */

const SECRET = 'test_secret_key';
const ORDER = 'order_TEST123';
const PAYMENT = 'pay_TEST123';

function validSignature(): string {
  return crypto.createHmac('sha256', SECRET).update(`${ORDER}|${PAYMENT}`).digest('hex');
}

/** Records every write so a test can assert an entitlement was actually granted. */
function makeDbMock(profileRow: { unlocked_sections: string[] } | null = { unlocked_sections: [] }) {
  const calls: { table: string; op: string; payload: any }[] = [];
  const client = {
    from(table: string) {
      const chain: any = {
        upsert(payload: any) { calls.push({ table, op: 'upsert', payload }); return Promise.resolve({ data: null, error: null }); },
        update(payload: any) {
          calls.push({ table, op: 'update', payload });
          return { eq: () => Promise.resolve({ data: null, error: null }) };
        },
        select() {
          return { eq: () => ({ single: () => Promise.resolve({ data: profileRow, error: null }) }) };
        },
      };
      return chain;
    },
  };
  return { client, calls };
}

let dbMock = makeDbMock();
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => dbMock.client,
}));

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

describe('payment fulfillment never drops a paid unlock', () => {
  beforeEach(() => {
    vi.resetModules();
    dbMock = makeDbMock();
    process.env.RAZORPAY_KEY_SECRET = SECRET;
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_role_test';
  });

  const base = {
    razorpay_order_id: ORDER,
    razorpay_payment_id: PAYMENT,
    userId: 'user-123',
  };

  it('grants a GLOBAL unlock when no reportKey is supplied (the self-report case)', async () => {
    const out = await callVerify({
      ...base,
      razorpay_signature: validSignature(),
      planType: 'section_unlock',
      sectionToUnlock: 'sexual_detail',
      // reportKey deliberately absent — this is exactly what SelfReportPage sent.
    });

    expect(out.statusCode).toBe(200);
    expect(out.body).toEqual({ valid: true });

    const profileWrite = dbMock.calls.find(c => c.table === 'profiles' && c.op === 'update');
    expect(profileWrite, 'no entitlement written — the customer paid for nothing').toBeTruthy();
    expect(profileWrite!.payload.unlocked_sections).toContain('sexual_detail');
  });

  it('grants a scoped unlock when a reportKey IS supplied', async () => {
    const out = await callVerify({
      ...base,
      razorpay_signature: validSignature(),
      planType: 'section_unlock',
      sectionToUnlock: 'sexual_detail',
      reportKey: 'rahul_1995__priya_1997',
    });

    expect(out.body).toEqual({ valid: true });
    const scoped = dbMock.calls.find(c => c.table === 'report_unlocks');
    expect(scoped, 'scoped unlock missing').toBeTruthy();
    expect(scoped!.payload.report_key).toBe('rahul_1995__priya_1997');
    expect(scoped!.payload.section_id).toBe('sexual_detail');
  });

  it('grants full_report globally when no reportKey is supplied', async () => {
    await callVerify({
      ...base,
      razorpay_signature: validSignature(),
      planType: 'full_report_unlock',
      sectionToUnlock: 'full_report',
    });
    const profileWrite = dbMock.calls.find(c => c.table === 'profiles' && c.op === 'update');
    expect(profileWrite).toBeTruthy();
    expect(profileWrite!.payload.unlocked_sections).toContain('full_report');
  });

  it('preserves sections the user already owns', async () => {
    dbMock = makeDbMock({ unlocked_sections: ['remedies'] });
    await callVerify({
      ...base,
      razorpay_signature: validSignature(),
      planType: 'section_unlock',
      sectionToUnlock: 'sexual_detail',
    });
    const profileWrite = dbMock.calls.find(c => c.table === 'profiles' && c.op === 'update');
    expect(profileWrite!.payload.unlocked_sections).toEqual(
      expect.arrayContaining(['remedies', 'sexual_detail'])
    );
  });

  it('always records the payment in history', async () => {
    await callVerify({
      ...base,
      razorpay_signature: validSignature(),
      planType: 'section_unlock',
      sectionToUnlock: 'sexual_detail',
    });
    const hist = dbMock.calls.find(c => c.table === 'payment_history');
    expect(hist).toBeTruthy();
    expect(hist!.payload.payment_id).toBe(PAYMENT);
    expect(hist!.payload.status).toBe('success');
  });

  it('rejects a forged signature and writes nothing', async () => {
    const out = await callVerify({
      ...base,
      razorpay_signature: 'deadbeef',
      planType: 'section_unlock',
      sectionToUnlock: 'sexual_detail',
    });
    expect(out.statusCode).toBe(401);
    expect(out.body.valid).toBe(false);
    expect(dbMock.calls).toHaveLength(0);
  });
});

describe('verify-payment never clobbers the webhook payload', () => {
  /**
   * verify-payment stamped {"verified_at": ...} into raw_payload. Both it and
   * the webhook upsert the SAME payment_history row, so whichever landed second
   * overwrote the other — and the webhook's full Razorpay entity (method, card,
   * fees, international flag, notes) was routinely discarded.
   *
   * It cost real information: the first international customer's acquisition
   * source was unrecoverable because the only record of it had been overwritten.
   * It also made raw_payload useless as a diagnostic — "only verified_at is
   * present" reads as "the webhook never ran", which was wrong.
   *
   * verified_at now has its own column. PostgREST's upsert only updates columns
   * present in the payload, so omitting raw_payload leaves the webhook's write
   * intact.
   */
  beforeEach(() => {
    vi.resetModules();
    dbMock = makeDbMock();
    process.env.RAZORPAY_KEY_SECRET = SECRET;
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_role_test';
  });

  const base = {
    razorpay_order_id: ORDER,
    razorpay_payment_id: PAYMENT,
    userId: 'user-123',
  };

  it('does not send raw_payload at all', async () => {
    await callVerify({
      ...base,
      razorpay_signature: validSignature(),
      planType: 'section_unlock',
      sectionToUnlock: 'sexual_detail',
    });
    const hist = dbMock.calls.find(c => c.table === 'payment_history');
    expect(hist, 'no payment_history write').toBeTruthy();
    expect(Object.keys(hist!.payload),
      'raw_payload here overwrites the webhook\'s full Razorpay entity')
      .not.toContain('raw_payload');
  });

  it('records the verification time in its own column', async () => {
    await callVerify({
      ...base,
      razorpay_signature: validSignature(),
      planType: 'section_unlock',
      sectionToUnlock: 'sexual_detail',
    });
    const hist = dbMock.calls.find(c => c.table === 'payment_history');
    expect(Date.parse(hist!.payload.verified_at as string)).not.toBeNaN();
  });
});
