import { describe, it, expect } from 'vitest';
import handler from '../../api/og-image';

/**
 * /api/og-image was returning HTTP 200 with content-type image/png and ZERO
 * bytes in production, for a year-long cached response, because Satori threw:
 *
 *   Expected <div> to have explicit "display: flex", "display: contents",
 *   or "display: none" if it has more than one child node.
 *
 * Nothing caught it: the status and content-type were both correct, and no
 * test ever rendered the image. Every share card silently failed to unfurl.
 *
 * These assert the bytes, not the headers — the only signal that would have
 * caught it — across both formats and the optional-field branches, since a
 * newly added div that forgets `display` only breaks the branch it sits in.
 */

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

async function render(query: string): Promise<Buffer> {
  const res = await handler(new Request(`https://x.test/api/og-image?${query}`));
  expect(res.status).toBe(200);
  return Buffer.from(await res.arrayBuffer());
}

function expectRealPng(buf: Buffer) {
  // A Satori failure yields an empty body, so length is the assertion that matters.
  expect(buf.length).toBeGreaterThan(1000);
  expect(buf.subarray(0, 4)).toEqual(PNG_MAGIC);
}

describe('/api/og-image renders real PNG bytes', () => {
  it('renders the 1200×630 card with every field populated', async () => {
    expectRealPng(await render(
      'nameA=Rahul&nameB=Priya&score=28&compat=78&risk=Low&moonA=Rohini&moonB=Ashwini'
    ));
  });

  it('renders the 1080×1920 story card', async () => {
    expectRealPng(await render('nameA=Rahul&nameB=Priya&score=28&compat=78&risk=Low&format=story'));
  });

  it('renders with only the required fields', async () => {
    // compat, risk and the moon row are all conditional subtrees — each one is
    // a place a future div could omit `display` and break only this path.
    expectRealPng(await render('nameA=Rahul&nameB=Priya&score=28'));
  });

  it('renders every score band and risk band', async () => {
    for (const score of [8, 20, 24, 32]) {
      expectRealPng(await render(`nameA=A&nameB=B&score=${score}`));
    }
    for (const risk of ['Low', 'Moderate', 'High', 'Critical']) {
      expectRealPng(await render(`nameA=A&nameB=B&score=24&compat=60&risk=${risk}`));
    }
  });

  it('renders with no query parameters at all', async () => {
    expectRealPng(await render(''));
  });
});
