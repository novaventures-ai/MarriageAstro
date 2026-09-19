import { describe, it, expect } from 'vitest';
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

describe('period label reflects what actually happens', () => {
  it('INR monthly renews, so it may say /month', () => {
    expect(periodLabel('premium_monthly', 'INR')).toBe('/month');
    expect(periodLabel('astrologer_monthly', 'INR')).toBe('/month');
    expect(isRecurring('premium_monthly', 'INR')).toBe(true);
  });

  it('USD monthly does NOT renew, so it must never say month', () => {
    for (const plan of ['premium_monthly', 'astrologer_monthly']) {
      const label = periodLabel(plan, 'USD')!;
      expect(label).not.toMatch(/month/i);
      expect(label).not.toMatch(/\/mo\b/);
      expect(label).toContain('30 days');
      expect(isRecurring(plan, 'USD')).toBe(false);
    }
  });

  it('one-off products have no period of their own', () => {
    expect(periodLabel('section_unlock', 'INR')).toBeNull();
    expect(periodLabel('full_report_unlock', 'USD')).toBeNull();
  });

  it('the rendered price never doubles up a period', () => {
    // The page strips "/mo" from `display` then appends the label. If a display
    // string carries its own period, the two concatenate into nonsense like
    // "$14.99 / 30 days/month".
    for (const [currency, table] of [['INR', PRICING_INR], ['USD', PRICING_USD]] as const) {
      for (const plan of ['premium_monthly', 'astrologer_monthly']) {
        const rendered = table[plan].display.replace('/mo', '') +
          (periodLabel(plan, currency) ?? '');
        expect(rendered.match(/month|30 days/gi)?.length ?? 0,
          `"${rendered}" states its period more than once`).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('renewal is described honestly', () => {
  it('tells an international customer it will not renew', () => {
    const note = renewalNote('premium_monthly', 'USD').toLowerCase();
    expect(note).toContain('does not renew');
  });

  it('tells an Indian customer it will', () => {
    expect(renewalNote('premium_monthly', 'INR').toLowerCase()).toContain('automatically');
  });
});

describe('the pricing page claims only what we support', () => {
  it('does not offer PayPal', () => {
    // Named nowhere else in the codebase — there is no PayPal integration.
    expect(PRICING_PAGE).not.toMatch(/paypal/i);
  });

  it('does not hardcode a currency amount outside the pricing tables', () => {
    // Free tier's "₹0"/"$0" is the only permitted literal.
    const literals = (PRICING_PAGE.match(/['"][₹$]\s?[\d,]+(\.\d+)?['"]/g) || [])
      .filter(s => !/[₹$]\s?0['"]$/.test(s));
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
