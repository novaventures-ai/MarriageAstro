# vedic-astro-mcp

> **The world's most complete Vedic astrology MCP server** — 22 tools covering birth charts, compatibility, divorce risk, infidelity analysis, sexual compatibility, mental health markers, spouse prediction, and more.

Built on [MarriageAstro](https://marriageastro.com)'s Swiss Ephemeris engine with accurate Lahiri ayanamsa calculations.

[![npm](https://img.shields.io/npm/v/vedic-astro-mcp)](https://www.npmjs.com/package/vedic-astro-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Quick Start

### 1. Get your API key

Sign up at [marriageastro.com/api-keys](https://marriageastro.com/api-keys) — free tier available, no credit card required.

### 2. Add to Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "vedic-astro": {
      "command": "npx",
      "args": ["vedic-astro-mcp"],
      "env": {
        "VEDIC_ASTRO_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Restart Claude Desktop. You're done.

### 3. Add to Cursor / Windsurf

```json
{
  "vedic-astro": {
    "command": "npx vedic-astro-mcp",
    "env": { "VEDIC_ASTRO_API_KEY": "your-key" }
  }
}
```

---

## 22 Available Tools

### Free Tier

| Tool | Description |
|------|-------------|
| `get_birth_chart` | Planets, houses, nakshatras, ascendant, yogas for one person |
| `calculate_compatibility` | 36-point Ashtakoot Milan score with all 8 parameters |
| `analyze_dosha` | Mangal, Nadi, Kaal Sarpa and other yoga/dosha patterns |

### Developer Tier ($9/mo)

| Tool | Description |
|------|-------------|
| `get_full_compatibility_report` | Complete compatibility report — synastry, navamsa, all divisional charts |
| `get_marriage_timing` | Auspicious marriage windows from dasha + transit analysis |
| `get_synastry` | Cross-chart planetary aspects and house overlays |
| `get_navamsa_matching` | D9 Navamsa chart deep compatibility |
| `get_kp_analysis` | Krishnamurti Paddhati with 249 sub-lords |
| `get_jaimini_dasha` | Jaimini Chara Dasha, Darakaraka, Upapada Lagna |
| `get_self_analysis` | Single person — marriage readiness, personality, timing forecast |

### Solo Tier ($49/mo) — All 22 Tools

Everything above plus all Premium tools below. Best for individual developers and MCP users.

### Premium Tier ($99/mo) — Unique Features

| Tool | Description |
|------|-------------|
| `get_divorce_risk` | **UNIQUE** — Divorce probability from 7th/2nd house afflictions |
| `get_infidelity_risk` | **UNIQUE** — Infidelity indicators + protective factors |
| `get_sexual_compatibility` | Venus/Mars synastry + mutual satisfaction |
| `get_sexual_health` | PME/ED/Frigidity risk indicators per person |
| `get_mental_health_analysis` | **UNIQUE** — Anxiety, depression, narcissism markers |
| `get_psychological_profile` | Attachment style, emotional patterns |
| `get_conflict_zones` | **UNIQUE** — Conflict triggers and hot-button topics |
| `get_vulnerability_windows` | **UNIQUE** — When relationship is at highest risk |
| `get_inlaw_analysis` | Compatibility with partner's family |
| `get_spouse_prediction` | Future spouse appearance, nature, meeting timing |
| `get_modern_challenges` | Digital age patterns, Uranus/Neptune/Pluto influence |
| `get_remedies` | Lal Kitab + gemstone recommendations |

---

## Try Before You Upgrade

All 22 tools work on a **free API key**. Premium tools return a real chart-based preview:

```json
{
  "success": true,
  "preview": true,
  "tier_required": "premium",
  "data": {
    "divorce_risk_level": "HIGH",
    "summary": "3 afflictions detected in 7th house. Upgrade to see full probability score and timeline."
  },
  "upgrade_url": "https://marriageastro.com/api-keys"
}
```

You see real results. Not just an error.

---

## Example Usage

Once installed, just ask Claude naturally:

> "Check compatibility between Person A born 1990-01-15 at 10:30 in Mumbai and Person B born 1992-05-20 at 08:00 in Delhi"

> "What is the divorce risk for this couple?"

> "Generate a birth chart for 1995-07-22, 06:15, latitude 22.57, longitude 88.36"

> "Predict what my future spouse will be like"

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VEDIC_ASTRO_API_KEY` | Yes | Your API key from marriageastro.com |
| `VEDIC_ASTRO_BASE_URL` | No | Override API base URL (for self-hosted) |

---

## Pricing

| Plan | Price | Daily Calls | Access |
|------|-------|-------------|--------|
| Free | $0 | 50 | 3 tools + **previews of all 22** |
| Developer | $9/mo | 500 | 10 tools |
| Solo | $49/mo | 5,000 | All 22 tools — for individuals & MCP users |
| Premium | $99/mo | Unlimited | All 22 tools — for businesses & high-volume |

[Get API key →](https://marriageastro.com/api-keys)

---

## Why This Is Different

Every other Vedic astrology API gives you basic birth charts and maybe a compatibility score. This is the **only** API that provides:

- Divorce probability assessment
- Infidelity risk + protective factors  
- Sexual compatibility (Venus/Mars synastry)
- Mental health markers from planetary positions
- Vulnerability windows — WHEN relationships are at risk
- Conflict zone mapping — WHAT the couple will fight about

Built on Swiss Ephemeris with Lahiri ayanamsa. Same engine used by professional Vedic astrologers.

---

## License

MIT — [marriageastro.com](https://marriageastro.com)
