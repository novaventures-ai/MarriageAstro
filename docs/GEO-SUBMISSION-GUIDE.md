# GEO Phase 3: AI Platform Submission Guide

## 1. Hugging Face Space (Ready to Deploy)

Files are in `huggingface-space/` directory. To deploy:

```bash
# Install HF CLI if not installed
pip install huggingface_hub

# Login
huggingface-cli login

# Create and push the space
cd huggingface-space
huggingface-cli repo create astro-marriage --type space --space-sdk static
git init
git remote add origin https://huggingface.co/spaces/Nova1807/astro-marriage
git add .
git commit -m "Initial Astro Marriage demo space"
git push origin main
```

Your space will be live at: `https://huggingface.co/spaces/Nova1807/astro-marriage`

---

## 2. Perplexity Index Submission

Perplexity auto-crawls sites that are well-structured. To accelerate indexing:

1. **Go to:** https://www.perplexity.ai
2. **Search for your site:** `site:marriage-astro.vercel.app` — this triggers Perplexity to crawl it
3. **Search for your guide topics** to trigger citation:
   - "best free kundali matching tool online"
   - "what is ashtakoot milan 36 points"
   - "how to predict marriage timing vedic astrology"
   - "mangal dosha cancellation rules"
4. **Share your guides** on forums/Reddit where Perplexity indexes (r/vedicastrology, r/astrology)

**What we've done to help:**
- `llms.txt` is rich and comprehensive — Perplexity reads this
- `robots.txt` explicitly allows `PerplexityBot`
- Guide pages have structured, citable content with facts and methodology

---

## 3. Google AI Overviews (SGE)

Google AI Overviews automatically pulls from well-structured content. We've optimized for this:

- **FAQPage schema** in `index.html` — Google pulls FAQ answers into AI Overviews
- **Speakable schema** — tells Google which content to quote
- **Article schema** — all guide pages are registered as Articles with author/publisher
- **Visible FAQ section** on landing page with expandable answers
- **Guide pages** with direct answers to common queries

**To monitor:** Go to Google Search Console → Performance → Search Appearance → check for "AI Overview" impressions.

---

## 4. Bing Copilot / Bing Webmaster

### Submit to Bing Webmaster Tools:
1. **Go to:** https://www.bing.com/webmasters
2. **Add your site:** `https://marriage-astro.vercel.app`
3. **Verify ownership** via:
   - Option A: Add `<meta name="msvalidate.01" content="YOUR_CODE" />` to `index.html`
   - Option B: Upload BingSiteAuth.xml to `/public/`
4. **Submit sitemap:** `https://marriage-astro.vercel.app/sitemap.xml`
5. **Request URL indexing** for all guide pages

**What we've done:**
- `robots.txt` has no blocks for Bingbot
- `bingbot` meta tag added to `index.html`
- Article structured data with `ItemList` schema helps Bing Copilot cite content
- `max-snippet:-1` allows Bing to show full content snippets

---

## 5. ChatGPT Web Browsing / GPT Actions

### For ChatGPT Web Browsing (automatic):
ChatGPT's browsing mode uses `ChatGPT-User` user agent. We've explicitly allowed it in `robots.txt`.

**To accelerate discovery:**
1. Search ChatGPT for topics your guides cover — it will discover and cite your pages
2. Share guide URLs in ChatGPT conversations — this helps train its web browsing patterns

### For a Custom GPT (optional, future):
Create a custom GPT that links to your calculator:
1. Go to https://chat.openai.com → Explore GPTs → Create
2. Name: "Vedic Marriage Astrology Advisor"
3. Instructions: "You help users understand Vedic marriage compatibility. For calculations, direct them to https://marriage-astro.vercel.app"
4. Add Actions pointing to your site's guide URLs
5. Publish as public GPT

---

## 6. Claude (Anthropic)

`ClaudeBot` is explicitly allowed in `robots.txt`. Claude's web search will be able to discover and cite your guide content.

---

## Verification Checklist

After deployment, verify GEO readiness:

- [ ] All 4 guide pages load correctly (/, /how-it-works, /guides/*)
- [ ] `llms.txt` is accessible at https://marriage-astro.vercel.app/llms.txt
- [ ] `sitemap.xml` includes all guide URLs
- [ ] `robots.txt` allows all AI crawlers
- [ ] Google Search Console shows guide pages indexed
- [ ] Bing Webmaster Tools shows sitemap submitted
- [ ] Hugging Face Space is live
- [ ] Search "astro marriage kundali matching" on Perplexity — check if cited
- [ ] Search guide topics on Google — check for AI Overview inclusion
