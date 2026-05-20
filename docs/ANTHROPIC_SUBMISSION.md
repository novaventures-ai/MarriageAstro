# Anthropic MCP Connector Submission Package

## MarriageAstro Vedic Astrology MCP Server

### 📋 Submission Checklist

- [x] **Connector Manifest** - `anthropic-connector-manifest.json`
- [x] **Server Card** - `server-card.json` (MCP v0.3 compliant)
- [x] **Icon** - `icon.png` (512x512 recommended)
- [x] **OAuth 2.0 Implementation** - PKCE-enabled token endpoint
- [x] **MCP Endpoint** - `/api/mcp` with Streamable HTTP transport

---

## 🔐 OAuth Client Registration for Anthropic

### Required Environment Variables (Vercel Dashboard)

Add these to your Vercel project settings at:
`https://vercel.com/dashboard/project/YOUR_PROJECT/settings/environment-variables`

```bash
# Anthropic-specific OAuth credentials
# Generate these after receiving approval from Anthropic
CLAUDE_CLIENT_ID="claude-connector-marriageastro"
CLAUDE_CLIENT_SECRET="<generate-secure-random-secret>"

# Existing required variables (verify they're set)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
MARRIAGE_ASTRO_API_KEY="your-api-key"
```

### Generate Client Secret

```bash
# Run this locally to generate a secure client secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📤 Submission Instructions

### Step 1: Register OAuth Client with Anthropic

Before submission, you need to register your OAuth client:

1. Contact Anthropic at **mcp-review@anthropic.com**
2. Request OAuth client credentials for the connector marketplace
3. Provide your production URL: `https://marriage-astro.vercel.app`
4. Specify redirect URIs:
   - `https://marriage-astro.vercel.app/oauth/callback`
   - `https://claude.ai/oauth/callback` (if applicable)

### Step 2: Update server-card.json with OAuth URLs

The server card already includes OAuth configuration. Ensure these match your actual endpoints:

```json
{
  "authentication": {
    "required": true,
    "schemes": ["oauth2"],
    "authorization_url": "https://marriage-astro.vercel.app/oauth/authorize",
    "token_url": "https://marriage-astro.vercel.app/api/oauth",
    "pkce_required": true
  }
}
```

### Step 3: Deploy to Production

Ensure your Vercel deployment is live and accessible:

- ✅ Main site: https://marriage-astro.vercel.app
- ✅ MCP endpoint: https://marriage-astro.vercel.app/api/mcp
- ✅ OAuth endpoint: https://marriage-astro.vercel.app/api/oauth
- ✅ Well-known files: https://marriage-astro.vercel.app/.well-known/mcp/server-card.json
- ✅ Icon: https://marriage-astro.vercel.app/.well-known/mcp/icon.png

### Step 4: Submit to Anthropic

Email your submission to **mcp-review@anthropic.com** with:

**Subject:** MCP Connector Submission — Vedic Astrology MCP by MarriageAstro

**Body Template:**

```
Dear Anthropic MCP Review Team,

I am submitting the "Vedic Astrology MCP — MarriageAstro" connector for inclusion in the 
Anthropic Connector Marketplace.

## Connector Details

- **Name:** Vedic Astrology MCP — MarriageAstro
- **Version:** 1.0.0
- **Author:** MarriageAstro
- **Homepage:** https://marriage-astro.vercel.app
- **Repository:** https://github.com/novaventures-ai/marriageastro
- **Manifest:** https://marriage-astro.vercel.app/.well-known/mcp/anthropic-connector-manifest.json
- **Server Card:** https://marriage-astro.vercel.app/.well-known/mcp/server-card.json

## Features

This MCP server provides 22 Vedic astrology tools including:
- Birth chart generation (planets, houses, nakshatras, ascendant, yogas, dashas)
- Ashtakoot Milan 36-point compatibility scoring
- Mangal/Nadi/Kaal Sarpa dosha analysis
- Divorce risk assessment (unique feature)
- Infidelity risk analysis (unique feature)
- Sexual compatibility matching
- Mental health markers from birth chart
- Spouse prediction and marriage timing
- KP stellar astrology and Jaimini dasha systems

Built on Swiss Ephemeris (Lahiri ayanamsa) for maximum accuracy.

## Authentication

- OAuth 2.0 with PKCE support
- Stateless JWT tokens (no database storage)
- User-controlled token lifecycle
- Three pricing tiers: Free, Developer ($9.99/mo), Premium ($19.99/mo)

## Security & Compliance

- TLS 1.3 encryption
- No PII stored on server
- GDPR-ready data handling
- Data minimization principle

## Testing

All 22 tools have been tested and validated against traditional Vedic astrology texts.
The server implements full MCP protocol compliance with proper error handling.

## Support

- Documentation: https://marriage-astro.vercel.app/docs/mcp
- Email: support@marriageastro.com
- Issues: https://github.com/novaventures-ai/marriageastro/issues

Please let me know if you require any additional information or modifications.

Best regards,
[Your Name]
MarriageAstro Team
```

---

## 🧪 Pre-Submission Verification

Run these checks before submitting:

### 1. Verify Well-Known Files

```bash
curl -I https://marriage-astro.vercel.app/.well-known/mcp/server-card.json
curl -I https://marriage-astro.vercel.app/.well-known/mcp/icon.png
curl -I https://marriage-astro.vercel.app/.well-known/mcp/anthropic-connector-manifest.json
```

Expected: HTTP 200 OK with `Content-Type: application/json`

### 2. Test OAuth Metadata Endpoint

```bash
curl https://marriage-astro.vercel.app/api/oauth
```

Expected: JSON response with server info and client_id

### 3. Validate JSON Schemas

```bash
# Check manifest validity
cat anthropic-connector-manifest.json | python -m json.tool > /dev/null && echo "✓ Valid JSON"

# Check server-card validity  
cat server-card.json | python -m json.tool > /dev/null && echo "✓ Valid JSON"
```

### 4. Test MCP Endpoint Health

```bash
curl -X POST https://marriage-astro.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}'
```

Expected: JSON-RPC response with server capabilities

---

## 📊 Marketing Materials

### Short Description (for marketplace listing)

> "Vedic Astrology MCP — Get birth charts, compatibility scores, divorce risk analysis, and spouse predictions using ancient Jyotish wisdom powered by Swiss Ephemeris."

### Long Description

> The world's most complete Vedic astrology MCP server with 22 specialized tools for relationship analysis. Built on Swiss Ephemeris (Lahiri ayanamsa) for maximum accuracy.
>
> **Unique Features:**
> - Only Vedic API providing divorce risk + infidelity analysis + sexual compatibility
> - Complete psychological profiling from birth charts
> - Traditional Ashtakoot Milan with all 8 parameters
> - Advanced divisional chart analysis (Navamsa, KP, Jaimini)
>
> **Three Tiers:**
> - **Free:** Birth charts, basic compatibility, dosha analysis
> - **Developer ($9.99/mo):** Full reports, synastry, dasha systems
> - **Premium ($19.99/mo):** Divorce/infidelity risk, sexual compatibility, remedies

### Icon Requirements

- Current icon: `public/.well-known/mcp/icon.png` (79KB)
- Recommended size: 512x512 pixels
- Format: PNG with transparency
- Theme: Professional, astrology-related

---

## 🔧 Post-Approval Steps

After Anthropic approves your connector:

1. **Update OAuth credentials** in Vercel with provided CLIENT_ID/SECRET
2. **Monitor usage** via Vercel Analytics and Supabase logs
3. **Set up alerts** for error rates and token failures
4. **Prepare marketing** for launch announcement
5. **Update documentation** with Anthropic-specific setup instructions

---

## 📞 Contact

For questions about this submission package:
- Email: support@marriageastro.com
- GitHub: https://github.com/novaventures-ai/marriageastro

---

**Generated:** May 20, 2025  
**Package Version:** 1.0.0  
**Status:** Ready for Submission
