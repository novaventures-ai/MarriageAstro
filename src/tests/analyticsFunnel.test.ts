import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * analytics.ts declared 16 events. Three were ever fired: two sign-in events
 * and user identification. Everything describing the funnel — report_viewed,
 * section_unlock_attempted, payment_initiated, payment_completed — was defined
 * and never called.
 *
 * Pageviews were worse. PostHog is initialised with `capture_pageview: false`
 * and a comment saying they are captured manually, but trackPageView was never
 * called from anywhere, so enabling PostHog would have recorded zero pageviews
 * in a client-routed SPA.
 *
 * These assert the funnel is actually wired end to end. A declared-but-unfired
 * event is invisible: nothing errors, the dashboard is simply empty, and the
 * question you enabled analytics to answer stays unanswerable.
 */

const src = (rel: string) => fs.readFileSync(path.resolve(__dirname, rel), 'utf8');

const FILES: Record<string, string> = {
  analytics: src('../lib/analytics.ts'),
  pageTracker: src('../components/PageTracker.tsx'),
  app: src('../App.tsx'),
  payment: src('../lib/paymentService.ts'),
  gate: src('../components/premium/PremiumGate.tsx'),
  report: src('../pages/ReportPage.tsx'),
  selfReport: src('../pages/SelfReportPage.tsx'),
};

/**
 * Every call site in src/, excluding analytics.ts itself and the tests.
 *
 * An earlier version of this searched a hand-picked list that INCLUDED
 * analytics.ts — where the events are declared as string literals in a type
 * union — so every event matched its own declaration and the "is it fired?"
 * check could never fail. It also missed call sites elsewhere (AuthContext
 * fires the sign-in events).
 */
function collectCallSites(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'tests' && entry.name !== 'node_modules') collectCallSites(full, acc);
    } else if (/\.(ts|tsx)$/.test(entry.name) && full !== path.resolve(__dirname, '../lib/analytics.ts')) {
      acc.push(fs.readFileSync(full, 'utf8'));
    }
  }
  return acc;
}
const CALL_SITES = collectCallSites(path.resolve(__dirname, '..')).join('\n');

function stripComments(s: string): string {
  return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

describe('pageviews are captured', () => {
  it('PostHog still does not auto-capture them', () => {
    // If this ever flips to true, PageTracker would double-count.
    expect(FILES.analytics).toContain('capture_pageview: false');
  });

  it('something actually CALLS trackPageView, not merely imports it', () => {
    // Asserting the bare identifier was not enough: deleting the call left the
    // import line behind and the test stayed green.
    const body = stripComments(FILES.pageTracker);
    const calls = body.match(/trackPageView\s*\(/g) || [];
    expect(calls.length, 'trackPageView is imported but never invoked')
      .toBeGreaterThan(0);
  });

  it('it fires on route change, not just once per session', () => {
    const body = stripComments(FILES.pageTracker);
    expect(body).toContain('useLocation');
    // The pathname must be the ARGUMENT, not only a dependency-array entry.
    expect(body, 'pageview does not carry the path it is reporting')
      .toMatch(/trackPageView\s*\(\s*location\.pathname/);
  });

  it('PageTracker is actually mounted inside the router', () => {
    const app = stripComments(FILES.app);
    expect(app).toContain('<PageTracker />');
    // Must sit inside <Router>, or useLocation throws.
    const router = app.indexOf('<Router>');
    expect(router).toBeGreaterThan(-1);
    expect(app.indexOf('<PageTracker />')).toBeGreaterThan(router);
  });

  it('does not put the query string into analytics', () => {
    // Birth details and report keys ride in query params.
    expect(stripComments(FILES.pageTracker)).not.toMatch(/location\.search/);
  });
});

describe('the purchase funnel is wired end to end', () => {
  const STEPS: [string, keyof typeof FILES][] = [
    ['report_viewed', 'report'],
    ['report_viewed', 'selfReport'],
    ['section_unlock_attempted', 'gate'],
    ['pricing_modal_opened', 'gate'],
    ['payment_initiated', 'payment'],
    ['payment_completed', 'payment'],
    ['payment_cancelled', 'payment'],
  ];

  it.each(STEPS)('%s fires from %s', (event, file) => {
    expect(stripComments(FILES[file]), `${event} is declared but never fired`)
      .toContain(`'${event}'`);
  });

  it('a dismissal is distinguishable from a failure', () => {
    // Price resistance and a declined card both end the funnel, for opposite
    // reasons. Collapsing them makes the data useless for pricing decisions.
    const pay = stripComments(FILES.payment);
    expect(pay).toContain('cancelled: true');
    expect(pay).toMatch(/outcome:/);
    expect(pay).toContain("'dismissed'");
    expect(pay).toContain("'failed'");
  });

  it('payment events carry what was being bought', () => {
    const pay = stripComments(FILES.payment);
    for (const prop of ['planType', 'amount', 'currency']) {
      expect(pay, `payment events omit ${prop}, so the funnel cannot be split`)
        .toMatch(new RegExp(`${prop}[,:]`));
    }
  });
});

describe('every declared event is either fired or removed', () => {
  it('flags events that exist only as a type', () => {
    const declared = (FILES.analytics.match(/^\s*\|\s*'([a-z_]+)'/gm) || [])
      .map(s => s.replace(/^\s*\|\s*'|'$/g, ''));
    expect(declared.length).toBeGreaterThan(0);

    const fired = stripComments(CALL_SITES);
    const unfired = declared.filter(e => !fired.includes(`'${e}'`));

    // These remain deliberately unwired for now — listed so the gap is explicit
    // rather than silently forgotten, and so wiring one is a visible change.
    const KNOWN_UNWIRED = [
      'chart_generated', 'ai_query_sent', 'ai_response_received',
      'premium_upgraded', 'partner_added', 'demo_started',
      'section_unlock_completed',
    ];
    expect(unfired.sort()).toEqual(KNOWN_UNWIRED.sort());
  });
});
