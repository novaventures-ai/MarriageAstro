import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Three failures this file guards, all of them copy that no type or test could
 * catch while it was wrong:
 *
 * 1. The Astrologer tier advertised "Client Management Tools" and "Bulk
 *    Analysis". Neither string appeared anywhere else in the repository — no
 *    route, no component, no handler. They were features sold at ₹1,499/month
 *    with nothing behind them.
 *
 * 2. The FAQ told international customers their monthly plan "does not renew
 *    automatically" and promised a reminder email before access ended. Once a
 *    USD Plan was configured, the first half became false — the subscription
 *    renews — and the reminder job was never built, so the second half was
 *    never true. This is a billing representation, shipped to Google as
 *    schema.org FAQPage structured data.
 *
 * 3. The Per-Module Unlock card was hard-disabled. A visitor who arrived at
 *    /pricing wanting the cheapest product on the page met a greyed-out button
 *    and no path onward.
 */

const read = (rel: string) =>
  fs.readFileSync(path.resolve(__dirname, rel), 'utf8');

/** Comments here quote the very strings under ban; only rendered code counts. */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

const SURFACES: Record<string, string> = {
  'PricingPage.tsx': stripComments(read('../pages/PricingPage.tsx')),
  'LandingPage.tsx': stripComments(read('../pages/LandingPage.tsx')),
  'PricingModal.tsx': stripComments(read('../components/premium/PricingModal.tsx')),
};

describe('the page only sells what exists', () => {
  /**
   * Guard by searching the WHOLE repo, not just the pricing surfaces: the point
   * is not "this string is absent from the price table", it is "this feature is
   * advertised but unimplemented". If someone builds client management, this
   * test stops failing on its own and the bullet may return.
   */
  const IMPLEMENTATION_DIRS = ['../../src', '../../api', '../../lib'];

  function repoMentions(needle: string): string[] {
    const hits: string[] = [];
    const walk = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) { walk(full); continue; }
        if (!/\.(ts|tsx)$/.test(entry.name)) continue;
        if (full.includes(`${path.sep}tests${path.sep}`)) continue;
        if (Object.keys(SURFACES).includes(entry.name)) continue;
        if (stripComments(fs.readFileSync(full, 'utf8')).toLowerCase().includes(needle)) {
          hits.push(full);
        }
      }
    };
    for (const d of IMPLEMENTATION_DIRS) walk(path.resolve(__dirname, d));
    return hits;
  }

  it.each([
    ['client management', 'Client Management'],
    ['bulk analysis', 'Bulk Analysis'],
  ])('does not advertise %s while nothing implements it', (needle, label) => {
    const implemented = repoMentions(needle);
    if (implemented.length > 0) return; // built — the claim is allowed back

    for (const [file, src] of Object.entries(SURFACES)) {
      expect(
        src.toLowerCase().includes(needle),
        `${file} advertises "${label}" but no implementation exists`,
      ).toBe(false);
    }
  });
});

describe('renewal claims match what billing does', () => {
  /**
   * "never renews" is CORRECT about a one-time unlock and wrong about a
   * subscription, so the phrase alone proves nothing — the subject does. Each
   * sentence is judged on whether it denies renewal for a recurring plan.
   */
  const DENIES_RENEWAL = /do(es)? not renew|never renews?|does not auto-?renew|single charge for 30 days/i;
  const ABOUT_A_SUBSCRIPTION = /international|monthly|subscription|\/mo\b/i;
  const ABOUT_A_ONE_TIME = /one-?time|module unlock|full-?report unlock|permanent/i;

  it.each(Object.keys(SURFACES))('%s makes no false renewal promise', (file) => {
    const sentences = SURFACES[file].split(/(?<=[.!?])\s+/);
    for (const s of sentences) {
      if (!DENIES_RENEWAL.test(s)) continue;
      if (ABOUT_A_ONE_TIME.test(s)) continue; // true of a one-time purchase
      expect(
        ABOUT_A_SUBSCRIPTION.test(s),
        `${file} denies renewal for a recurring plan: "${s.trim()}"`,
      ).toBe(false);
    }
  });

  it('promises no reminder email, because no such job exists', () => {
    for (const [file, src] of Object.entries(SURFACES)) {
      expect(src, file).not.toMatch(/remind you before (your )?access ends/i);
    }
  });

  it('does not tie recurring billing to Indian cards anywhere', () => {
    for (const [file, src] of Object.entries(SURFACES)) {
      expect(src, file).not.toMatch(/India-issued card/i);
    }
  });
});

describe('every tier on the pricing page is reachable', () => {
  const src = read('../pages/PricingPage.tsx');

  /** Slice one TIERS entry by name, from its `name:` key to the next one. */
  function tierBlock(name: string): string {
    const start = src.indexOf(`name: '${name}'`);
    expect(start, `tier "${name}" not found`).toBeGreaterThan(-1);
    const rest = src.slice(start + 1);
    const next = rest.search(/\n {4}name: '/);
    return next === -1 ? rest.slice(0, rest.indexOf('\n];')) : rest.slice(0, next);
  }

  it('sells Astrologer rather than deferring it', () => {
    const block = tierBlock('Astrologer');
    expect(block).toMatch(/planType: 'astrologer_monthly'/);
    expect(block, 'Astrologer is disabled').toMatch(/disabled: false/);
    expect(block).not.toMatch(/Coming Soon/);
  });

  it('gives the one-time unlock somewhere to go', () => {
    const block = tierBlock('Per-Module Unlock');
    expect(block, 'the cheapest product is a dead button').toMatch(/disabled: false/);
    expect(block, 'no destination wired').toMatch(/navigateToReport: true/);
  });

  it('routes the unlock into a report, where a reportKey exists', () => {
    // Buying without a reportKey falls through to the webhook's global-unlock
    // safety net, which records no scope for what was purchased.
    expect(src).toMatch(/currentReport \? '\/report' : '\/calculator'/);
  });

  it('labels the button by where it actually leads', () => {
    expect(src).toMatch(/Start Your Free Report/);
  });
});
