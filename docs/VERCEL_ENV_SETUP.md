# Vercel Environment Variables for Anthropic Connector

## Required Variables

Add these to your Vercel project at:
https://vercel.com/dashboard/project/YOUR_PROJECT/settings/environment-variables

### Production Environment (Required)

```bash
# =============================================================================
# OAuth 2.0 Configuration for Anthropic
# =============================================================================

# Client ID provided by Anthropic after registration
# If not yet provided, use a placeholder value
CLAUDE_CLIENT_ID="claude-connector-marriageastro"

# Generate a secure random secret for client authentication
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
CLAUDE_CLIENT_SECRET="<GENERATE_SECURE_RANDOM_64_CHAR_STRING>"

# =============================================================================
# Supabase Configuration (Existing - Verify These Are Set)
# =============================================================================

SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."

# =============================================================================
# MarriageAstro API Configuration
# =============================================================================

MARRIAGE_ASTRO_API_KEY="your-api-key-here"
# Optional: Custom API endpoint if not using default
# MARRIAGE_ASTRO_BASE_URL="https://api.marriageastro.com"

# =============================================================================
# Additional Recommended Variables
# =============================================================================

# For production error tracking
SENTRY_DSN="https://xxx@oxxx.ingest.sentry.io/xxx"
SENTRY_ORG="your-org"
SENTRY_PROJECT="marriage-astro"

# For email notifications
RESEND_API_KEY="re_xxx"
EMAIL_FROM="MarriageAstro <noreply@yourdomain.com>"
```

## How to Add Environment Variables in Vercel

1. Go to your Vercel Dashboard
2. Select your project: `marriage-astro`
3. Navigate to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter the variable name and value
6. Select environments: ✅ Production ✅ Preview ✅ Development
7. Click **Save**
8. **Redeploy** your application for changes to take effect

## Security Notes

- **Never commit** `.env` files with real secrets to Git
- The `.env.example` file should contain placeholder values only
- Rotate `CLAUDE_CLIENT_SECRET` periodically (every 90 days recommended)
- Use Vercel's **Environment Variables** UI, not manual configuration
- Enable **Preview** environment variables for testing before production

## Testing After Configuration

After adding environment variables:

1. Redeploy to Vercel:
   ```bash
   git commit --allow-empty -m "Trigger redeploy for env vars"
   git push
   ```

2. Verify OAuth endpoint:
   ```bash
   curl https://marriage-astro.vercel.app/api/oauth
   ```

3. Check Vercel logs for any errors:
   - Go to **Deployments** → Latest deployment → **Logs**
   - Filter for "OAuth" or "error"

## Troubleshooting

### OAuth returns 500 error
- Check that `SUPABASE_SERVICE_ROLE_KEY` is correctly set
- Verify `CLAUDE_CLIENT_SECRET` is at least 32 characters

### Token generation fails
- Ensure all Supabase credentials are valid
- Check Vercel function logs for detailed error messages

### CORS errors from Claude
- Verify OAuth endpoint allows POST requests
- Check CORS headers in `/api/oauth` response

---

**Last Updated:** May 20, 2025  
**Status:** Ready for Production Deployment
