import { describe, it, expect } from 'vitest';
import { buildResultShareUrl, buildShareText, buildWhatsAppText } from '../lib/shareUtils';
import handler from '../../api/r';

/**
 * The share loop only works if three things line up:
 *   1. the share text carries a /r link (not the bare homepage),
 *   2. /r decodes that link back into the same display values, and
 *   3. /r emits an og:image pointing at the personalised card.
 * These assert the whole round trip, plus the two things that would be
 * genuinely harmful to get wrong: birth data leaking into the URL, and
 * unescaped names reaching the HTML.
 */

const REPORT = {
  nameA: 'Rahul',
  nameB: 'Priya',
  ashtakootScore: 28,
  compatPercent: 78,
  riskLevel: 'Low',
  matchVerdict: 'Excellent Match',
};

async function renderShareUrl(url: string): Promise<Response> {
  return handler(new Request(url));
}

describe('share link round trip', () => {
  it('share text links to /r, not the homepage', () => {
    const text = buildWhatsAppText(REPORT);
    expect(text).toContain('/r?d=');
    // The old behaviour appended the bare site root, which unfurled the generic card.
    expect(text.trim().endsWith('marriage-astro.vercel.app')).toBe(false);
  });

  it('does not repeat the link now that buildShareText carries it', () => {
    const occurrences = buildShareText(REPORT).match(/\/r\?d=/g) || [];
    expect(occurrences).toHaveLength(1);
  });

  it('carries NO birth data in the payload', () => {
    const url = buildResultShareUrl(REPORT);
    const encoded = new URL(url).searchParams.get('d')!;
    const json = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json);
    // Display fields only — never date, time, location or coordinates.
    expect(Object.keys(payload).sort()).toEqual(['a', 'b', 'c', 'k', 's', 'v']);
    for (const banned of ['d', 't', 'l', 'lat', 'lng', 'tz']) {
      expect(payload).not.toHaveProperty(banned);
    }
  });

  it('/r renders the shared values and the personalised og:image', async () => {
    const res = await renderShareUrl(buildResultShareUrl(REPORT));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');

    const html = await res.text();
    expect(html).toContain('Rahul');
    expect(html).toContain('Priya');
    expect(html).toContain('>28<');
    expect(html).toContain('Excellent Match');
    expect(html).toContain('78%');

    // The whole point: a crawler-visible card built from these values.
    const og = html.match(/property="og:image" content="([^"]+)"/)?.[1] ?? '';
    expect(og).toContain('/api/og-image');
    expect(og).toContain('nameA=Rahul');
    expect(og).toContain('score=28');
    expect(og).toContain('compat=78');
  });

  it('/r is noindex — shared results must not reach search', async () => {
    const res = await renderShareUrl(buildResultShareUrl(REPORT));
    expect(res.headers.get('x-robots-tag')).toContain('noindex');
    expect(await res.text()).toContain('name="robots" content="noindex');
  });

  it('escapes names instead of injecting them as markup', async () => {
    const res = await renderShareUrl(
      buildResultShareUrl({ ...REPORT, nameA: '<script>x</script>', nameB: 'A"B' })
    );
    const html = await res.text();
    expect(html).not.toContain('<script>x</script>');
    expect(html).toContain('&lt;script&gt;');
    // The stray quote must not be able to close an attribute.
    expect(html).toContain('A&quot;B');
  });

  it('survives non-ASCII names (btoa is latin1-only)', async () => {
    const res = await renderShareUrl(buildResultShareUrl({ ...REPORT, nameA: 'प्रिया' }));
    expect(await res.text()).toContain('प्रिया');
  });

  it('redirects to the calculator when the payload is missing or corrupt', async () => {
    for (const url of ['https://x.test/r', 'https://x.test/r?d=not-base64!!']) {
      const res = await renderShareUrl(url);
      expect(res.status).toBe(302);
      expect(res.headers.get('location')).toContain('/calculator');
    }
  });
});
