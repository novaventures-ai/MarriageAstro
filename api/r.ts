/**
 * /r — Shared result page (Edge Function)
 *
 * WHY THIS EXISTS
 * The app is a client-rendered SPA, so every route returns the same index.html.
 * WhatsApp, Twitter/X, Facebook and Telegram crawlers do NOT execute JavaScript,
 * which means the per-report <meta og:image> written by SEOHead is invisible to
 * them — every shared link unfurled with the generic site card instead of the
 * personalised one that api/og-image.tsx already generates.
 *
 * This route serves real HTML, so the crawler reads the right tags and the
 * recipient sees a fast, self-contained teaser (no SPA boot) on a cold mobile
 * connection, with a CTA into the app.
 *
 * PRIVACY
 * The payload carries DISPLAY DATA ONLY — names, score, compatibility %, risk
 * band, verdict. It deliberately does NOT carry birth date, time or coordinates.
 * A forwarded WhatsApp card must never hand a group chat two people's exact
 * birth details, and base64 is encoding, not encryption. Recipients are invited
 * to run their own match rather than read someone else's private report — which
 * is also the behaviour that converts.
 *
 * The page is noindex: these are personal results and must not reach search.
 */

export const config = { runtime: 'edge' };

const SITE_URL = 'https://marriage-astro.vercel.app';

interface SharePayload {
  a?: string; // name A
  b?: string; // name B
  s?: number; // Ashtakoot score 0–36
  c?: number; // overall compatibility %
  k?: string; // risk band
  v?: string; // verdict label
}

/** Escape for HTML text and quoted attributes — names come from a URL. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function decodePayload(raw: string | null): SharePayload | null {
  if (!raw) return null;
  try {
    const normalized = raw.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    // atob yields one char per BYTE, so a name in Devanagari, Tamil or any
    // non-ASCII script comes back mangled unless the UTF-8 is decoded back.
    // This must mirror the TextEncoder step in shareUtils.buildResultShareUrl.
    const bytes = Uint8Array.from(atob(padded), (ch) => ch.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    return parsed && typeof parsed === 'object' ? (parsed as SharePayload) : null;
  } catch {
    return null;
  }
}

function scoreLabel(score: number): string {
  if (score >= 28) return 'Excellent Match';
  if (score >= 21) return 'Good Match';
  if (score >= 18) return 'Acceptable';
  return 'Needs Caution';
}

function scoreColor(score: number): string {
  if (score >= 28) return '#10b981';
  if (score >= 21) return '#f59e0b';
  if (score >= 18) return '#f97316';
  return '#ef4444';
}

function riskColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case 'low': return '#10b981';
    case 'moderate': return '#f59e0b';
    case 'high': return '#f97316';
    case 'critical': return '#ef4444';
    default: return '#818cf8';
  }
}

export default async function handler(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const payload = decodePayload(searchParams.get('d'));

  // A missing or corrupt payload should never show a broken card — send the
  // visitor to the calculator, which is where we wanted them anyway.
  if (!payload || !payload.a || !payload.b) {
    return Response.redirect(`${SITE_URL}/calculator`, 302);
  }

  const nameA = String(payload.a).slice(0, 20);
  const nameB = String(payload.b).slice(0, 20);
  const score = Math.min(Math.max(Number(payload.s) || 0, 0), 36);
  const compat = Math.min(Math.max(Number(payload.c) || 0, 0), 100);
  const risk = payload.k ? String(payload.k).slice(0, 12) : '';
  const verdict = payload.v ? String(payload.v).slice(0, 40) : scoreLabel(score);

  const colour = scoreColor(score);
  const scorePct = Math.round((score / 36) * 100);

  // Crawler-facing card: the personalised image api/og-image.tsx already builds.
  const ogImage = new URL(`${SITE_URL}/api/og-image`);
  ogImage.searchParams.set('nameA', nameA);
  ogImage.searchParams.set('nameB', nameB);
  ogImage.searchParams.set('score', String(score));
  if (compat) ogImage.searchParams.set('compat', String(compat));
  if (risk) ogImage.searchParams.set('risk', risk);

  const title = `${nameA} & ${nameB} — ${score}/36 ${verdict}`;
  const description = compat
    ? `Ashtakoot Milan ${score}/36 · ${compat}% overall compatibility${risk ? ` · ${risk} risk` : ''}. Check your own Kundali match free.`
    : `Ashtakoot Milan ${score}/36 — ${verdict}. Check your own Kundali match free.`;

  const html = `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#0f0d1a">

<meta property="og:type" content="website">
<meta property="og:site_name" content="Astro Marriage">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(ogImage.toString())}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${esc(req.url)}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImage.toString())}">

<style>
  *{box-sizing:border-box;margin:0;padding:0}
  /* Base colour on <html> so no area is ever left unpainted, and the gradient
     is attachment:fixed so it still covers when the content scrolls past 100vh
     on a short handset. */
  html{background:#0f0d1a}
  body{
    min-height:100vh;
    background:linear-gradient(160deg,#0f0d1a 0%,#1a1535 48%,#0d1128 100%) fixed;
    color:#f1f5f9;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    display:flex;align-items:center;justify-content:center;
    padding:32px 20px;position:relative;
  }
  /* The glows live in a fixed, clipped layer. As body pseudo-elements they
     spilled past the viewport and widened the page. */
  .bg{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:-1}
  .bg i{position:absolute;border-radius:50%;display:block}
  .bg .g1{top:-140px;right:-120px;width:420px;height:420px;background:radial-gradient(circle,rgba(99,102,241,.18),transparent 70%)}
  .bg .g2{bottom:-120px;left:-120px;width:360px;height:360px;background:radial-gradient(circle,rgba(245,158,11,.12),transparent 70%)}
  .card{position:relative;width:100%;max-width:440px;text-align:center}
  .brand{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:32px}
  .mark{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#6366f1,#8b5cf6);
    display:flex;align-items:center;justify-content:center;font-size:18px}
  .brand span{font-size:13px;font-weight:700;color:#a5b4fc;letter-spacing:2.5px;text-transform:uppercase}
  .names{font-size:26px;font-weight:800;line-height:1.3;margin-bottom:28px}
  .names .amp{color:#f59e0b;margin:0 8px}
  .score-box{background:rgba(255,255,255,.06);border:2px solid ${colour}40;border-radius:24px;
    padding:28px 24px;margin-bottom:20px;backdrop-filter:blur(8px)}
  .label{font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#94a3b8;margin-bottom:10px}
  .score{font-size:68px;font-weight:900;line-height:1;color:${colour}}
  .outof{font-size:15px;color:#64748b;margin-bottom:14px}
  .bar{width:160px;height:7px;background:rgba(255,255,255,.1);border-radius:4px;margin:0 auto 14px}
  .bar i{display:block;height:7px;width:${scorePct}%;background:${colour};border-radius:4px}
  .verdict{font-size:16px;font-weight:800;color:${colour}}
  .stats{display:flex;gap:12px;margin-bottom:28px}
  .stat{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);
    border-radius:16px;padding:16px 10px}
  .stat b{display:block;font-size:26px;font-weight:900;line-height:1.2}
  .stat small{font-size:10px;letter-spacing:1.2px;text-transform:uppercase;color:#94a3b8}
  .cta{display:block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;
    font-size:16px;font-weight:800;padding:16px 24px;border-radius:16px;
    box-shadow:0 10px 30px rgba(99,102,241,.35);margin-bottom:14px}
  .cta:active{transform:translateY(1px)}
  .sub{font-size:12px;color:#64748b;line-height:1.6}
  .sub a{color:#a5b4fc;text-decoration:none}
  @media(max-width:380px){.names{font-size:22px}.score{font-size:58px}}
</style>
</head>
<body>
  <div class="bg" aria-hidden="true"><i class="g1"></i><i class="g2"></i></div>
  <main class="card">
    <div class="brand"><div class="mark">✨</div><span>Astro Marriage</span></div>

    <h1 class="names">${esc(nameA)}<span class="amp">&amp;</span>${esc(nameB)}</h1>

    <div class="score-box">
      <div class="label">Ashtakoot Milan</div>
      <div class="score">${score}</div>
      <div class="outof">out of 36</div>
      <div class="bar"><i></i></div>
      <div class="verdict">${esc(verdict)}</div>
    </div>

    ${(compat || risk) ? `<div class="stats">
      ${compat ? `<div class="stat"><b style="color:#818cf8">${compat}%</b><small>Compatibility</small></div>` : ''}
      ${risk ? `<div class="stat"><b style="color:${riskColor(risk)}">${esc(risk)}</b><small>Risk Level</small></div>` : ''}
    </div>` : ''}

    <a class="cta" href="${SITE_URL}/calculator">Check your own match — free</a>
    <p class="sub">
      Full Vedic analysis across all divisional charts.<br>
      The complete report stays private to its owner.
    </p>
  </main>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // Shared cards are immutable for a given payload — let the CDN serve them.
      'cache-control': 'public, max-age=600, s-maxage=86400',
      'x-robots-tag': 'noindex',
    },
  });
}
