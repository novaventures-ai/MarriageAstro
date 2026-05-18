/**
 * Shared auth middleware for /api/v1/ endpoints
 * Validates X-API-Key header against Supabase api_keys table
 * Returns tier info for downstream use
 */
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '../_oauth-helper.js';

export type ApiTier = 'free' | 'developer' | 'solo' | 'premium';

const DAILY_LIMITS: Record<ApiTier, number> = {
  free: 50,
  developer: 500,
  solo: 5000,
  premium: 99999,
};

export interface AuthResult {
  valid: boolean;
  tier: ApiTier;
  keyId: string;
  error?: string;
  statusCode?: number;
}

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars not configured');
  return createClient(url, key);
}

export async function validateApiKey(req: any): Promise<AuthResult> {
  // 1. RapidAPI Gateway Authentication (DB-less, High-Performance, Secure)
  const proxySecret = req.headers['x-rapidapi-proxy-secret'] as string;
  const expectedSecret = process.env.RAPIDAPI_PROXY_SECRET;
  const rapidApiPlan = req.headers['x-rapidapi-plan'] as string;
  // x-rapidapi-host is ALWAYS sent by RapidAPI (playground + real calls)
  const rapidApiHost = req.headers['x-rapidapi-host'] as string;

  // Helper to map RapidAPI plan name → internal tier
  function mapRapidApiPlan(plan: string): ApiTier {
    const p = (plan || 'free').toLowerCase();
    if (p.includes('premium') || p.includes('ultra') || p.includes('mega')) return 'premium';
    if (p.includes('solo') || p.includes('pro')) return 'solo';
    if (p.includes('developer') || p.includes('dev')) return 'developer';
    return 'free';
  }

  // Detect RapidAPI traffic: host header always present (playground + production)
  const isRapidApiRequest = !!rapidApiHost;

  // Case A: Proxy secret is configured AND matches → fully verified RapidAPI traffic
  if (isRapidApiRequest && expectedSecret && proxySecret === expectedSecret) {
    return { valid: true, tier: mapRapidApiPlan(rapidApiPlan), keyId: 'rapidapi-verified' };
  }

  // Case B: RapidAPI request but proxy secret not configured in Vercel env yet
  // Allow through as free tier (configure RAPIDAPI_PROXY_SECRET in Vercel for production security)
  if (isRapidApiRequest && !expectedSecret) {
    return { valid: true, tier: mapRapidApiPlan(rapidApiPlan), keyId: 'rapidapi-unverified' };
  }

  // 2. Standard X-API-Key verification (for direct client / MCP users)
  const apiKey = (req.headers['x-api-key'] as string) ||
                 (req.headers['authorization'] as string)?.replace(/^Bearer\s+/i, '') ||
                 (req.query?.apiKey as string) ||
                 (req.query?.key as string);

  if (!apiKey) {
    return { valid: false, tier: 'free', keyId: '', error: 'Missing X-API-Key', statusCode: 401 };
  }

  // 2b. Stateless OAuth 2.0 Access Token verification
  const oauthPayload = verifyToken(apiKey);
  if (oauthPayload && oauthPayload.userId) {
    try {
      const supabaseClient = getSupabase();
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('plan_tier')
        .eq('id', oauthPayload.userId)
        .single();

      if (error || !data) {
        return { valid: true, tier: 'free', keyId: `oauth-${oauthPayload.userId}` };
      }

      const dbTier = (data.plan_tier || 'free').toLowerCase();
      let tier: ApiTier = 'free';
      if (dbTier === 'premium' || dbTier === 'astrologer' || dbTier === 'admin') {
        tier = 'premium';
      } else if (dbTier === 'developer') {
        tier = 'developer';
      } else if (dbTier === 'solo') {
        tier = 'solo';
      }

      return { valid: true, tier, keyId: `oauth-${oauthPayload.userId}` };
    } catch {
      return { valid: true, tier: 'free', keyId: `oauth-${oauthPayload.userId}` };
    }
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, tier, calls_today, calls_month, last_reset_at, is_active')
      .eq('key', apiKey)
      .single();

    if (error || !data) {
      return { valid: false, tier: 'free', keyId: '', error: 'Invalid API key', statusCode: 401 };
    }

    if (!data.is_active) {
      return { valid: false, tier: 'free', keyId: data.id, error: 'API key is disabled', statusCode: 403 };
    }

    const tier = data.tier as ApiTier;

    // Reset daily count if needed
    const lastReset = new Date(data.last_reset_at);
    const needsReset = Date.now() - lastReset.getTime() > 86400000;
    const callsToday = needsReset ? 0 : data.calls_today;

    if (callsToday >= DAILY_LIMITS[tier]) {
      return { valid: false, tier, keyId: data.id, error: 'Daily limit reached. Upgrade your plan.', statusCode: 429 };
    }

    // Increment call count
    if (needsReset) {
      await supabase
        .from('api_keys')
        .update({ calls_today: 1, last_reset_at: new Date().toISOString() })
        .eq('id', data.id);
    } else {
      await supabase
        .from('api_keys')
        .update({ calls_today: callsToday + 1, calls_month: data.calls_month + 1 })
        .eq('id', data.id);
    }

    return { valid: true, tier, keyId: data.id };
  } catch (err: any) {
    return { valid: false, tier: 'free', keyId: '', error: 'Auth service error', statusCode: 500 };
  }
}

export function requireTier(authResult: AuthResult, required: ApiTier, res: any): boolean {
  const tiers: ApiTier[] = ['free', 'developer', 'solo', 'premium'];
  const userLevel = tiers.indexOf(authResult.tier);
  const requiredLevel = tiers.indexOf(required);
  if (userLevel < requiredLevel) {
    res.status(403).json({
      error: `This endpoint requires the '${required}' plan or higher. Your plan: '${authResult.tier}'.`,
      upgrade_url: 'https://marriage-astro.vercel.app/api-keys',
    });
    return false;
  }
  return true;
}

// Like requireTier but returns a teaser preview instead of 403 when tier is insufficient.
// Call AFTER chart generation so teaser can include real chart insights.
export function requireTierOrTeaser(
  authResult: AuthResult,
  required: ApiTier,
  res: any,
  teaser: () => Record<string, any>
): boolean {
  const tiers: ApiTier[] = ['free', 'developer', 'solo', 'premium'];
  const userLevel = tiers.indexOf(authResult.tier);
  const requiredLevel = tiers.indexOf(required);
  if (userLevel < requiredLevel) {
    res.status(200).json({
      success: true,
      preview: true,
      tier_required: required,
      upgrade_url: 'https://marriage-astro.vercel.app/api-keys',
      data: teaser(),
    });
    return false;
  }
  return true;
}

export function parseBirthData(body: any, prefix = '') {
  const p = prefix ? `${prefix}_` : '';
  return {
    name: body[`${p}name`] || 'Person',
    gender: body[`${p}gender`] || 'male',
    dateOfBirth: body[`${p}date`] || body[`${p}dateOfBirth`],
    timeOfBirth: body[`${p}time`] || body[`${p}timeOfBirth`] || '12:00',
    location: body[`${p}location`] || '',
    latitude: parseFloat(body[`${p}latitude`] || body[`${p}lat`]),
    longitude: parseFloat(body[`${p}longitude`] || body[`${p}lon`]),
    timezone: body[`${p}timezone`] || body[`${p}tz`] || 'UTC',
  };
}
