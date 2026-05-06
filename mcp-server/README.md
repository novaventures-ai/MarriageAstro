# vedic-astro-mcp

> **The world's most complete Vedic astrology MCP server** — 22 tools covering birth charts, compatibility, divorce risk, infidelity analysis, sexual compatibility, mental health markers, spouse prediction, and more.

Built on [MarriageAstro](https://marriageastro.com)'s Swiss Ephemeris engine with accurate Lahiri ayanamsa calculations.

---

## Quick Start

### 1. Get your API key

Sign up at [marriageastro.com/api-keys](https://marriageastro.com/api-keys) — free tier available.

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

In your MCP config file:

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

### Developer Tier ($9-29/mo)

| Tool | Description |
|------|-------------|
| `get_full_compatibility_report` | Complete compatibility report — synastry, navamsa, all divisional charts |
| `get_marriage_timing` | Auspicious marriage windows from dasha + transit analysis |
| `get_synastry` | Cross-chart planetary aspects and house overlays |
| `get_navamsa_matching` | D9 Navamsa chart deep compatibility |
| `get_kp_analysis` | Krishnamurti Paddhati with 249 sub-lords |
| `get_jaimini_dasha` | Jaimini Chara Dasha, Darakaraka, Upapada Lagna |
| `get_self_analysis` | Single person — marriage readiness, personality, timing forecast |

### Premium Tier ($99/mo) — Unique Features

| Tool | Description |
|------|-------------|
| `get_divorce_risk` | Divorce probability from 7th/2nd house afflictions |
| `get_infidelity_risk` | Infidelity indicators + protective factors |
| `get_sexual_compatibility` | Venus/Mars synastry + mutual satisfaction |
| `get_sexual_health` | PME/ED/Frigidity risk indicators per person |
| `get_mental_health_analysis` | Anxiety, depression, narcissism markers |
| `get_psychological_profile` | Attachment style, emotional patterns |
| `get_conflict_zones` | Conflict triggers and hot-button topics |
| `get_vulnerability_windows` | When relationship is at highest risk |
| `get_inlaw_analysis` | Compatibility with partner's family |
| `get_spouse_prediction` | Future spouse appearance, nature, meeting timing |
| `get_modern_challenges` | Digital age patterns, Uranus/Neptune/Pluto influence |
| `get_remedies` | Lal Kitab + gemstone recommendations |

---

## Example Usage

Once installed, just ask Claude naturally:

> "Check compatibility between Person A born 1990-01-15 at 10:30 in Mumbai (lat 19.076, lon 72.877) and Person B born 1992-05-20 at 08:00 in Delhi (lat 28.613, lon 77.209)"

> "What is the divorce risk for someone born 1985-03-10 at 14:00, lat 13.08, lon 80.27?"

> "Generate a birth chart for 1995-07-22, 06:15, latitude 22.57, longitude 88.36"

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
| Free | $0 | 50 | Tier 1 (3 tools) + **previews of all 22** |
| Developer | $9/mo | 500 | Tier 1+2 (10 tools) |
| Solo | $49/mo | 5,000 | All 22 tools — for individuals & MCP users |
| Premium | $99/mo | Unlimited | All 22 tools — for businesses & high-volume |

> **Try any tool for free** — premium tools return a real teaser preview (not just an error) when called on a free key, so you can see the value before upgrading.

[Get API key →](https://marriageastro.com/api-keys)

---

## Why This Is Different

Every other Vedic astrology API gives you basic birth charts and maybe a compatibility score. This is the **only** API that provides:

- Divorce probability assessment
- Infidelity risk + protective factors
- Sexual compatibility (Venus/Mars synastry)
- Mental health markers from planetary positions
- Vulnerability windows — WHEN relationships are at risk
- Conflict zone mapping

Built on Swiss Ephemeris with Lahiri ayanamsa for maximum accuracy.

---

## License

MIT — [marriageastro.com](https://marriageastro.com)
