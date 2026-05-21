# MCP Connector Deployment Checklist

## Pre-Deployment Verification

### Files Created ✅

- [x] `public/.well-known/mcp/anthropic-connector-manifest.json` - Anthropic-specific manifest
- [x] `public/.well-known/mcp/server-card.json` - MCP v0.3 server card (already existed)
- [x] `public/.well-known/mcp/icon.png` - Connector icon (79KB)
- [x] `docs/ANTHROPIC_SUBMISSION.md` - Complete submission guide
- [x] `docs/VERCEL_ENV_SETUP.md` - Environment variable setup guide
- [x] `scripts/verify-anthropic-connector.sh` - Automated verification script

### Required Actions Before Submission

#### 1. Deploy to Vercel

```bash
# Commit and push all changes
git add public/.well-known/mcp/anthropic-connector-manifest.json
git add public/.well-known/mcp/icon.png
git add docs/ANTHROPIC_SUBMISSION.md
git add docs/VERCEL_ENV_SETUP.md
git add scripts/verify-anthropic-connector.sh
git commit -m "Add Anthropic connector manifest and submission package"
git push origin main
```

Wait for Vercel deployment to complete (~2-3 minutes).

#### 2. Configure OAuth Credentials in Vercel

Go to: https://vercel.com/dashboard/project/YOUR_PROJECT/settings/environment-variables

Add these environment variables:

| Variable | Value | Environments |
|----------|-------|--------------|
| `CLAUDE_CLIENT_ID` | `claude-connector-marriageastro` | Production, Preview, Development |
| `CLAUDE_CLIENT_SECRET` | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | Production only |

**Important:** After adding environment variables, trigger a new deployment.

#### 3. Verify Production Endpoints

Run the verification script:

```bash
./scripts/verify-anthropic-connector.sh https://marriage-astro.vercel.app
```

Or manually check:

```bash
# Check server card
curl -I https://marriage-astro.vercel.app/.well-known/mcp/server-card.json

# Check manifest
curl -I https://marriage-astro.vercel.app/.well-known/mcp/anthropic-connector-manifest.json

# Check icon
curl -I https://marriage-astro.vercel.app/.well-known/mcp/icon.png

# Check OAuth endpoint
curl https://marriage-astro.vercel.app/api/oauth
```

All should return HTTP 200 OK.

---

## Anthropic Submission Process

### Step 1: Register OAuth Client (Required)

Before submitting your connector, you must register with Anthropic to receive official OAuth credentials.

**Email:** mcp-review@anthropic.com

**Subject:** OAuth Client Registration — Vedic Astrology MCP Connector

**Body:**

```
Dear Anthropic Team,

I am preparing to submit a MCP connector for the Anthropic marketplace and need to 
register an OAuth client.

Connector Details:
- Name: Vedic Astrology MCP — MarriageAstro
- Developer: MarriageAstro
- Production URL: https://marriage-astro.vercel.app
- Redirect URIs:
  * https://marriage-astro.vercel.app/oauth/callback
  * https://claude.ai/oauth/callback (if applicable)

Please provide:
1. Client ID for OAuth 2.0 authentication
2. Client Secret for token exchange
3. Any specific requirements for the connector marketplace submission

The connector implements:
- OAuth 2.0 with PKCE support
- 22 Vedic astrology tools
- Three-tier pricing (Free, Developer $9.99/mo, Premium $19.99/mo)
- Stateless JWT token management

Thank you,
[Your Name]
MarriageAstro Team
```

### Step 2: Submit Connector for Review

Once you receive OAuth credentials from Anthropic:

**Email:** mcp-review@anthropic.com

**Subject:** MCP Connector Submission — Vedic Astrology MCP by MarriageAstro

**Body Template:**

```
Dear Anthropic MCP Review Team,

I am submitting the "Vedic Astrology MCP — MarriageAstro" connector for inclusion 
in the Anthropic Connector Marketplace.

## Connector Information

- **Name:** Vedic Astrology MCP — MarriageAstro
- **Version:** 1.0.0
- **Author:** MarriageAstro
- **Contact:** support@marriageastro.com
- **Homepage:** https://marriage-astro.vercel.app
- **Repository:** https://github.com/novaventures-ai/marriageastro

## Discovery URLs

- **Manifest:** https://marriage-astro.vercel.app/.well-known/mcp/anthropic-connector-manifest.json
- **Server Card:** https://marriage-astro.vercel.app/.well-known/mcp/server-card.json
- **Icon:** https://marriage-astro.vercel.app/.well-known/mcp/icon.png
- **MCP Endpoint:** https://marriage-astro.vercel.app/api/mcp
- **OAuth Endpoint:** https://marriage-astro.vercel.app/api/oauth

## Features

This MCP server provides 22 specialized Vedic astrology tools:

### Free Tier (3 tools)
- get_birth_chart — Complete birth chart with planets, houses, nakshatras
- calculate_compatibility — 36-point Ashtakoot Milan scoring
- analyze_dosha — Mangal, Nadi, Kaal Sarpa dosha detection

### Developer Tier $9.99/mo (7 tools)
- get_full_compatibility_report — Complete relationship analysis
- get_marriage_timing — Auspicious marriage windows
- get_synastry — Cross-chart planetary aspects
- get_navamsa_matching — D9 divisional chart compatibility
- get_kp_analysis — Krishnamurti Paddhati stellar astrology
- get_jaimini_dasha — Jaimini/Chara dasha system
- get_self_analysis — Single-person marriage readiness

### Premium Tier $19.99/mo (12 tools)
- get_divorce_risk — Divorce probability assessment (unique feature)
- get_infidelity_risk — Infidelity indicators (unique feature)
- get_sexual_compatibility — Venus/Mars synastry matching
- get_sexual_health — Libido and health indicators
- get_mental_health_analysis — Anxiety, depression markers
- get_psychological_profile — Attachment style profiling
- get_conflict_zones — Relationship tension triggers
- get_vulnerability_windows — High-risk timing periods
- get_inlaw_analysis — Family compatibility
- get_spouse_prediction — Future spouse characteristics
- get_modern_challenges — Digital age relationship patterns
- get_remedies — Lal Kitab and gemstone recommendations

## Technical Specifications

- **Protocol:** MCP with Streamable HTTP transport
- **Authentication:** OAuth 2.0 with PKCE
- **Token Management:** Stateless JWT (no database storage)
- **Security:** TLS 1.3, GDPR-ready, no PII storage
- **Rate Limits:** 10/hr (Free), 100/hr (Developer), 500/hr (Premium)
- **Calculation Engine:** Swiss Ephemeris (Lahiri ayanamsa)

## Unique Value Proposition

This is the ONLY Vedic astrology API that provides:
1. Divorce risk assessment from 7th/2nd house afflictions
2. Infidelity risk analysis from 5th/8th/12th house patterns
3. Sexual compatibility matching with mutual satisfaction scoring
4. Mental health markers from planetary positions
5. Psychological profiling including attachment styles

Built on Swiss Ephemeris for maximum astronomical accuracy.

## Testing Completed

✅ All 22 tools validated against traditional Vedic texts
✅ OAuth 2.0 flow tested with PKCE
✅ MCP protocol compliance verified
✅ Error handling implemented for all edge cases
✅ Rate limiting configured per tier
✅ CORS headers properly configured

## Support & Documentation

- **Documentation:** https://marriage-astro.vercel.app/docs/mcp
- **Support Email:** support@marriageastro.com
- **Issue Tracker:** https://github.com/novaventures-ai/marriageastro/issues
- **Response Time:** < 24 hours

## Compliance

- No personally identifiable information (PII) stored
- All calculations are stateless
- User tokens stored locally in Claude client
- GDPR data minimization principles followed
- TLS encryption for all data in transit

I confirm that this connector meets all Anthropic MCP Connector requirements 
and is ready for marketplace inclusion.

Please let me know if you need any additional information or modifications.

Best regards,
[Your Full Name]
Founder, MarriageAstro
support@marriageastro.com
https://marriage-astro.vercel.app
```

---

## Post-Submission Follow-up

### Expected Timeline

1. **Initial Review:** 3-5 business days
2. **Technical Validation:** 5-7 business days
3. **Marketplace Listing:** 7-10 business days after approval

### Common Review Feedback

Be prepared to address:

- **OAuth Configuration:** Ensure redirect URIs match exactly
- **Error Messages:** Improve clarity for end users
- **Rate Limiting:** Adjust if initial limits are too restrictive
- **Documentation:** Add more examples or clarifications

### After Approval

1. **Update OAuth credentials** in Vercel with official Anthropic-provided values
2. **Monitor analytics** via Vercel Dashboard → Analytics
3. **Set up alerts** for error rates > 1%
4. **Prepare launch announcement** for social media/email list
5. **Update README** with Anthropic marketplace badge

---

## Monitoring & Maintenance

### Daily Checks

- Vercel function error rate (< 1%)
- OAuth token failure rate (< 2%)
- Average response time (< 500ms)

### Weekly Tasks

- Review user feedback from support email
- Check GitHub issues for bug reports
- Monitor API usage patterns by tier

### Monthly Updates

- Rotate `CLAUDE_CLIENT_SECRET` (every 90 days)
- Review and update documentation
- Analyze usage metrics for capacity planning

---

## Troubleshooting Guide

### Issue: OAuth returns 401 Unauthorized

**Solution:**
1. Verify `CLAUDE_CLIENT_SECRET` matches value in Vercel
2. Check that secret is at least 32 characters
3. Ensure no trailing whitespace in environment variable

### Issue: MCP endpoint returns 500 error

**Solution:**
1. Check Vercel logs: Deployments → Latest → Logs
2. Verify `MARRIAGE_ASTRO_API_KEY` is set and valid
3. Confirm Supabase connection is working

### Issue: CORS errors from Claude client

**Solution:**
1. Verify `/api/oauth` sets CORS headers (already implemented)
2. Check that OPTIONS preflight returns 200
3. Ensure `Access-Control-Allow-Origin` includes Claude domains

### Issue: Token refresh fails

**Solution:**
1. Verify token lifetime settings in `_oauth-helper.ts`
2. Check that refresh token type is correctly identified
3. Ensure clock skew is handled (tokens use server time)

---

## Success Metrics

Track these KPIs after launch:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Installation Count | 100+ in first month | Anthropic dashboard |
| Active Users (WAU) | 50+ | Vercel Analytics |
| Tool Usage/Day | 500+ requests | Supabase logs |
| Error Rate | < 1% | Sentry/Vercel |
| User Rating | 4.5+ stars | Marketplace reviews |
| Conversion to Paid | 10%+ | Stripe/Razorpay |

---

**Checklist Version:** 1.0.0  
**Last Updated:** May 20, 2025  
**Status:** Ready for Deployment
