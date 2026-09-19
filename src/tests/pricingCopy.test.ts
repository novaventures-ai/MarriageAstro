import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { periodLabel, isRecurring, renewalNote, PRICING_INR, PRICING_USD } from '../lib/regionService';

/**
 * The pricing page told an international visitor "$14.99/mo" and "pay via card
 * or PayPal". Neither was true: a recurring mandate can only be registered on
 * an India-issued card in INR, so the plan was a single 30-day charge that
 * never renewed, and PayPal was named nowhere in the codebase — it was not an
 * accepted method at all.
 *
 * Both are copy, so nothing fails when they drift back. These assert the claims
 * the page is allowed to make.
 */

const PRICING_PAGE = fs.readFileSync(
  path.resolve(__dirname, '../pages/PricingPage.tsx'), 'utf8');
const LANDING_PAGE = fs.readFileSync(
  path.resolve(__dirname, '../pages/LandingPage.tsx'), 'utf8');

/** Comments explain the bugs these tests guard, and naturally quote the very
 *  strings being banned. Only rendered code should be scanned. */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/** Stand in for sessionStorage so the cached region can be controlled. */
function setCachedRegion(region: unknown) {
  const store = new Map<string, string>();
  if (region !== null) store.set('ma_region', JSON.stringify(region));
  (globalThis as any).sessionStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => { store.set(k, v); },
    removeItem: (k: string) => { store.delete(k); },
  };
}

describe('period label reflects what actually happens', () => {
  /**
   * These used to assert "INR renews, USD never does", on the reading that a
   * recurring mandate requires an India-issued card. That conflated e-mandate
   * (bank debits over NACH, India-only) with recurring CARD payments, which
   * Razorpay supports in many currencies — its plan form offers EUR, SGD and
   * USD. Currency was never the right question.
   *
   * What actually decides is whether a Razorpay Plan exists for that currency,
   * which only the server knows and now reports.
   */
  afterEach(() => { delete (globalThis as any).sessionStorage; });

  it('claims no renewal until the server says a plan exists', () => {
    // The fail-safe default. Understating is cheap; promising a renewal that
    // never happens is what sold a subscription that did not exist.
    setCachedRegion(null);
    for (const currency of ['INR', 'USD'] as const) {
      for (const plan of ['premium_monthly', 'astrologer_monthly']) {
        expect(isRecurring(plan, currency)).toBe(false);
        expect(periodLabel(plan, currency)).not.toMatch(/month/i);
      }
    }
  });

  it.each(['INR', 'USD'] as const)('says /month in %s once a plan is configured', (currency) => {
    setCachedRegion({
      country: currency === 'INR' ? 'IN' : 'US',
      currency,
      isInternational: currency !== 'INR',
      recurring: { premium_monthly: true, astrologer_monthly: true },
    });
    expect(isRecurring('premium_monthly', currency)).toBe(true);
    expect(periodLabel('premium_monthly', currency)).toBe('/month');
  });

  it('a currency switched on does not speak for the other', () => {
    // Plans are per-currency: INR live must not make USD claim renewal.
    setCachedRegion({
      country: 'IN', currency: 'INR', isInternational: false,
      recurring: { premium_monthly: true, astrologer_monthly: true },
    });
    expect(isRecurring('premium_monthly', 'INR')).toBe(true);
    expect(isRecurring('premium_monthly', 'USD')).toBe(false);
  });

  it('honours a per-plan difference within one currency', () => {
    // Premium can be live while Astrologer is not; the copy must track each.
    setCachedRegion({
      country: 'IN', currency: 'INR', isInternational: false,
      recurring: { premium_monthly: true, astrologer_monthly: false },
    });
    expect(periodLabel('premium_monthly', 'INR')).toBe('/month');
    expect(periodLabel('astrologer_monthly', 'INR')).toContain('30 days');
  });

  it('one-off products have no period of their own', () => {
    expect(periodLabel('section_unlock', 'INR')).toBeNull();
    expect(periodLabel('full_report_unlock', 'USD')).toBeNull();
  });

  it('the rendered price never doubles up a period', () => {
    // The page strips "/mo" from `display` then appends the label. If a display
    // string carries its own period, the two concatenate into nonsense like
    // "$14.99 / 30 days/month".
    for (const configured of [true, false]) {
      for (const [currency, table] of [['INR', PRICING_INR], ['USD', PRICING_USD]] as const) {
        setCachedRegion({
          country: 'IN', currency, isInternational: currency !== 'INR',
          recurring: { premium_monthly: configured, astrologer_monthly: configured },
        });
        for (const plan of ['premium_monthly', 'astrologer_monthly']) {
          const rendered = table[plan].display.replace('/mo', '') +
            (periodLabel(plan, currency) ?? '');
          expect(rendered.match(/month|30 days/gi)?.length ?? 0,
            `"${rendered}" states its period more than once`).toBeLessThanOrEqual(1);
        }
      }
    }
  });
});

describe('renewal is described honestly', () => {
  it('says plainly when a plan does not renew', () => {
    const note = renewalNote('premium_monthly', 'USD').toLowerCase();
    expect(note).toContain('does not renew');
  });

  it('says plainly when it does', () => {
    setCachedRegion({
      country: 'IN', currency: 'INR', isInternational: false,
      recurring: { premium_monthly: true, astrologer_monthly: true },
    });
    expect(renewalNote('premium_monthly', 'INR').toLowerCase()).toContain('automatically');
    delete (globalThis as any).sessionStorage;
  });
});

describe('the pricing page claims only what we support', () => {
  it('does not offer PayPal', () => {
    // Named nowhere else in the codebase — there is no PayPal integration.
    expect(PRICING_PAGE).not.toMatch(/paypal/i);
  });

  it.each([['PricingPage', PRICING_PAGE], ['LandingPage', LANDING_PAGE]])(
    '%s does not hardcode a currency amount outside the pricing tables', (_name, src) => {
      // A hardcoded price cannot follow the visitor's region, so it shows
      // rupees to someone who will be charged dollars. Match the amount
      // ANYWHERE — quoted, or as bare JSX text like `>₹399<`, which is how the
      // landing page carried it and how an earlier version of this test missed
      // it. Only the free tier's "₹0"/"$0" is permitted.
      const literals = (stripComments(src).match(/[₹$]\s?[\d,]+(?:\.\d+)?/g) || [])
        .filter(s => !/^[₹$]\s?0$/.test(s));
      expect(literals, `hardcoded prices drift from regionService: ${literals.join(', ')}`)
        .toHaveLength(0);
    });
});

describe('the app does not tell visitors Premium is unreleased', () => {
  /**
   * Both pages carried pre-launch copy long after launch: a "Beta Launch Offer
   * — 50% Off Lifetime" badge and a waitlist promising founding members "50%
   * off forever", sitting beside a working Get Premium button. Checkout never
   * applied any discount, so it advertised a price the product would not
   * honour, and told the handful of visitors the site gets to wait instead of
   * buy. Premium has paying customers; nothing may claim it is coming.
   */
  const FORBIDDEN = [
    /launching soon/i,
    /premium launches/i,
    /when premium/i,
    /founding[- ]member/i,
    /50%\s*off/i,
    /join the (premium )?waitlist/i,
    /early access list/i,
  ];

  for (const [name, src] of [['PricingPage', PRICING_PAGE], ['LandingPage', LANDING_PAGE]] as const) {
    it(`${name} makes no pre-launch or unapplied-discount claim`, () => {
      for (const re of FORBIDDEN) {
        expect(re.test(src), `${name} still contains ${re}`).toBe(false);
      }
    });
  }
});
