/**
 * POST /api/mcp
 * Remote Model Context Protocol (MCP) Server for MarriageAstro
 * Exposes all 22 Vedic Astrology calculation tools as a Claude Custom Connector.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from './_oauth-helper';

import birthChart from './v1/_birth-chart';
import compatibility from './v1/_compatibility';
import doshaCheck from './v1/_dosha-check';
import fullReport from './v1/_full-report';
import marriageTiming from './v1/_marriage-timing';
import synastry from './v1/_synastry';
import navamsa from './v1/_navamsa';
import kpAnalysis from './v1/_kp-analysis';
import jaiminiDasha from './v1/_jaimini-dasha';
import selfAnalysis from './v1/_self-analysis';
import divorceRisk from './v1/_divorce-risk';
import infidelityRisk from './v1/_infidelity-risk';
import sexualCompatibility from './v1/_sexual-compatibility';
import sexualHealth from './v1/_sexual-health';
import mentalHealth from './v1/_mental-health';
import psychologicalProfile from './v1/_psychological-profile';
import conflictZones from './v1/_conflict-zones';
import vulnerabilityWindows from './v1/_vulnerability-windows';
import inlawAnalysis from './v1/_inlaw-analysis';
import spousePrediction from './v1/_spouse-prediction';
import modernChallenges from './v1/_modern-challenges';
import remedies from './v1/_remedies';

const handlers: Record<string, (req: any, res: any) => Promise<any>> = {
  'birth-chart': birthChart,
  'compatibility': compatibility,
  'dosha-check': doshaCheck,
  'full-report': fullReport,
  'marriage-timing': marriageTiming,
  'synastry': synastry,
  'navamsa': navamsa,
  'kp-analysis': kpAnalysis,
  'jaimini-dasha': jaiminiDasha,
  'self-analysis': selfAnalysis,
  'divorce-risk': divorceRisk,
  'infidelity-risk': infidelityRisk,
  'sexual-compatibility': sexualCompatibility,
  'sexual-health': sexualHealth,
  'mental-health': mentalHealth,
  'psychological-profile': psychologicalProfile,
  'conflict-zones': conflictZones,
  'vulnerability-windows': vulnerabilityWindows,
  'inlaw-analysis': inlawAnalysis,
  'spouse-prediction': spousePrediction,
  'modern-challenges': modernChallenges,
  'remedies': remedies,
};

// ── AUTHENTICATION SYSTEM ──────────────────────────────────────────────────

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
  const rapidApiHost = req.headers['x-rapidapi-host'] as string;

  function mapRapidApiPlan(plan: string): ApiTier {
    const p = (plan || 'free').toLowerCase();
    if (p.includes('premium') || p.includes('ultra') || p.includes('mega')) return 'premium';
    if (p.includes('solo') || p.includes('pro')) return 'solo';
    if (p.includes('developer') || p.includes('dev')) return 'developer';
    return 'free';
  }

  const isRapidApiRequest = !!rapidApiHost;

  if (isRapidApiRequest && expectedSecret && proxySecret === expectedSecret) {
    return { valid: true, tier: mapRapidApiPlan(rapidApiPlan), keyId: 'rapidapi-verified' };
  }

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

  // Local testing / Mock bypass
  if (apiKey === 'test-key') {
    return { valid: true, tier: 'developer', keyId: 'mock-key' };
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

    const lastReset = new Date(data.last_reset_at);
    const needsReset = Date.now() - lastReset.getTime() > 86400000;
    const callsToday = needsReset ? 0 : data.calls_today;

    if (callsToday >= DAILY_LIMITS[tier]) {
      return { valid: false, tier, keyId: data.id, error: 'Daily limit reached. Upgrade your plan.', statusCode: 429 };
    }

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

// ── SCHEMAS ─────────────────────────────────────────────────────────────────

const BIRTH_DATA_SCHEMA = {
  name: z.string().optional().describe("Person's name"),
  gender: z.enum(['male', 'female', 'other']).optional().describe("Gender (male/female/other)"),
  date: z.string().describe("Date of birth in YYYY-MM-DD format"),
  time: z.string().optional().describe("Time of birth in HH:MM format (24h, defaults to 12:00)"),
  latitude: z.number().describe("Birth place latitude (e.g. 19.076 for Mumbai)"),
  longitude: z.number().describe("Birth place longitude (e.g. 72.877 for Mumbai)"),
  timezone: z.string().optional().describe("Timezone name (e.g. 'Asia/Kolkata', defaults to UTC)"),
  location: z.string().optional().describe("Birth place name (e.g. 'Mumbai, India')"),
};

const PAIR_SCHEMA = {
  person_a_name: z.string().optional().describe("Person A's name"),
  person_a_gender: z.enum(['male', 'female', 'other']).optional().describe("Person A's gender (male/female/other)"),
  person_a_date: z.string().describe("Person A's date of birth in YYYY-MM-DD format"),
  person_a_time: z.string().optional().describe("Person A's time of birth in HH:MM format (24h, defaults to 12:00)"),
  person_a_latitude: z.number().describe("Person A's birth place latitude (e.g. 19.076 for Mumbai)"),
  person_a_longitude: z.number().describe("Person A's birth place longitude (e.g. 72.877 for Mumbai)"),
  person_a_timezone: z.string().optional().describe("Person A's timezone name (e.g. 'Asia/Kolkata', defaults to UTC)"),
  person_a_location: z.string().optional().describe("Person A's birth place name (e.g. 'Mumbai, India')"),

  person_b_name: z.string().optional().describe("Person B's name"),
  person_b_gender: z.enum(['male', 'female', 'other']).optional().describe("Person B's gender (male/female/other)"),
  person_b_date: z.string().optional().describe("Person B's date of birth in YYYY-MM-DD format (omit for single-person analysis)"),
  person_b_time: z.string().optional().describe("Person B's time of birth in HH:MM format (24h, defaults to 12:00)"),
  person_b_latitude: z.number().optional().describe("Person B's birth place latitude (e.g. 19.076 for Mumbai)"),
  person_b_longitude: z.number().optional().describe("Person B's birth place longitude (e.g. 72.877 for Mumbai)"),
  person_b_timezone: z.string().optional().describe("Person B's timezone name (e.g. 'Asia/Kolkata', defaults to UTC)"),
  person_b_location: z.string().optional().describe("Person B's birth place name (e.g. 'Mumbai, India')"),
};

function birthDataToPayload(args: any) {
  return {
    name: args.name,
    gender: args.gender,
    date: args.date,
    time: args.time,
    latitude: args.latitude,
    longitude: args.longitude,
    timezone: args.timezone,
    location: args.location,
  };
}

// ── MCP SERVER INITIALIZATION ────────────────────────────────────────────────

const server = new McpServer({
  name: 'marriage-astro-mcp',
  version: '1.0.2',
});

// Helper to execute internal API requests directly within the same process on behalf of the MCP tool callers.
// This completely avoids external HTTP fetches, DNS resolution, network roundtrips, and Vercel Cold Starts!
async function callInternalApi(
  endpoint: string,
  body: any,
  apiKey: string,
  _host?: string,
  _protocol?: string
): Promise<any> {
  const handler = handlers[endpoint];
  if (!handler) {
    throw new Error(`Handler not found for endpoint: ${endpoint}`);
  }

  const mockReq = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'authorization': `Bearer ${apiKey}`,
    },
    query: {},
    body,
  };

  let responseStatus = 200;
  let responseBody: any = null;

  const mockRes = {
    status(code: number) {
      responseStatus = code;
      return this;
    },
    json(body: any) {
      responseBody = body;
      return this;
    },
    setHeader() {
      return this;
    },
    end() {
      return this;
    }
  };

  try {
    await handler(mockReq, mockRes);
  } catch (err: any) {
    throw new Error(err.message || 'Intra-process execution failed');
  }

  if (responseStatus < 200 || responseStatus >= 300) {
    const message = responseBody?.error || `API error: ${responseStatus}`;
    throw new Error(message);
  }

  return responseBody;
}

// Helper to register tools dynamically
function registerTools(server: McpServer, activeApiKey: string, activeHost: string, activeProtocol: string) {
  // ── TIER 1 — FREE ──────────────────────────────────────────────────────────

  server.tool(
    'get_birth_chart',
    'Generate a Vedic birth chart (planets, houses, nakshatras, ascendant, yogas, dashas) for one person.',
    BIRTH_DATA_SCHEMA,
    async (args) => {
      const data = await callInternalApi('birth-chart', birthDataToPayload(args), activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'calculate_compatibility',
    'Calculate Ashtakoot Milan 36-point compatibility score between two people, including all 8 parameters (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi) and dosha flags.',
    PAIR_SCHEMA,
    async (args) => {
      const data = await callInternalApi('compatibility', args, activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'analyze_dosha',
    'Check Mangal dosha, Nadi dosha, Kaal Sarpa, and other yoga/dosha patterns for one or two people.',
    PAIR_SCHEMA,
    async (args) => {
      const data = await callInternalApi('dosha-check', args, activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  // ── TIER 2 — DEVELOPER ─────────────────────────────────────────────────────

  server.tool(
    'get_full_compatibility_report',
    'Generate the complete compatibility report including synastry, navamsa, divisional charts, dasha analysis, and timing. Requires developer plan.',
    PAIR_SCHEMA,
    async (args) => {
      const data = await callInternalApi('full-report', args, activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_marriage_timing',
    'Find auspicious marriage windows based on Vimshottari Dasha and transit confluence. Requires developer plan.',
    BIRTH_DATA_SCHEMA,
    async (args) => {
      const data = await callInternalApi('marriage-timing', birthDataToPayload(args), activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_synastry',
    'Cross-chart planetary aspect analysis and house overlays between two people. Requires developer plan.',
    PAIR_SCHEMA,
    async (args) => {
      const data = await callInternalApi('synastry', args, activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_navamsa_matching',
    'D9 Navamsa chart compatibility — the marriage-specific divisional chart analysis. Requires developer plan.',
    PAIR_SCHEMA,
    async (args) => {
      const data = await callInternalApi('navamsa', args, activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_kp_analysis',
    'Krishnamurti Paddhati (KP) stellar astrology analysis with 249 sub-lords. Requires developer plan.',
    BIRTH_DATA_SCHEMA,
    async (args) => {
      const data = await callInternalApi('kp-analysis', birthDataToPayload(args), activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_jaimini_dasha',
    'Jaimini/Chara Dasha analysis including Darakaraka and Upapada Lagna for marriage timing. Requires developer plan.',
    BIRTH_DATA_SCHEMA,
    async (args) => {
      const data = await callInternalApi('jaimini-dasha', birthDataToPayload(args), activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_self_analysis',
    'Single-person marriage readiness analysis — personality, timing forecast, spouse profile. Requires developer plan.',
    BIRTH_DATA_SCHEMA,
    async (args) => {
      const data = await callInternalApi('self-analysis', birthDataToPayload(args), activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  // ── TIER 3 — PREMIUM ───────────────────────────────────────────────────────

  server.tool(
    'get_divorce_risk',
    'Assess divorce probability from 7th and 2nd house afflictions. Unique feature — no other Vedic API provides this. Requires premium plan.',
    PAIR_SCHEMA,
    async (args) => {
      const data = await callInternalApi('divorce-risk', args, activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_infidelity_risk',
    'Analyze infidelity indicators from 5th, 8th, and 12th house patterns, plus protective factors. Requires premium plan.',
    PAIR_SCHEMA,
    async (args) => {
      const data = await callInternalApi('infidelity-risk', args, activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_sexual_compatibility',
    'Venus/Mars synastry + sexual temperament matching + mutual satisfaction analysis. Requires premium plan.',
    PAIR_SCHEMA,
    async (args) => {
      const data = await callInternalApi('sexual-compatibility', args, activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_sexual_health',
    'Individual sexual health analysis — libido, PME/ED/Frigidity risk indicators from birth chart. Requires premium plan.',
    BIRTH_DATA_SCHEMA,
    async (args) => {
      const data = await callInternalApi('sexual-health', birthDataToPayload(args), activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_mental_health_analysis',
    'Analyze anxiety, depression, narcissism, and emotional stability markers from birth chart. Requires premium plan.',
    BIRTH_DATA_SCHEMA,
    async (args) => {
      const data = await callInternalApi('mental-health', birthDataToPayload(args), activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_psychological_profile',
    'Attachment style, emotional patterns, and personality profile from planetary positions. Requires premium plan.',
    BIRTH_DATA_SCHEMA,
    async (args) => {
      const data = await callInternalApi('psychological-profile', birthDataToPayload(args), activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_conflict_zones',
    'Identify conflict triggers, hot-button topics, and tension patterns between two people. Requires premium plan.',
    PAIR_SCHEMA,
    async (args) => {
      const data = await callInternalApi('conflict-zones', args, activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_vulnerability_windows',
    'Find timing windows when the relationship is at highest stress/breakdown risk. Requires premium plan.',
    PAIR_SCHEMA,
    async (args) => {
      const data = await callInternalApi('vulnerability-windows', args, activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_inlaw_analysis',
    'Analyze compatibility with partner\'s family from 4th and 8th house indicators. Requires premium plan.',
    PAIR_SCHEMA,
    async (args) => {
      const data = await callInternalApi('inlaw-analysis', args, activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_spouse_prediction',
    'Predict future spouse\'s appearance, nature, profession, and when/how you will meet them. Requires premium plan.',
    BIRTH_DATA_SCHEMA,
    async (args) => {
      const data = await callInternalApi('spouse-prediction', birthDataToPayload(args), activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_modern_challenges',
    'Digital age relationship analysis — social media impact, long-distance patterns, modern planet (Uranus/Neptune/Pluto) influence. Requires premium plan.',
    PAIR_SCHEMA,
    async (args) => {
      const data = await callInternalApi('modern-challenges', args, activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'get_remedies',
    'Lal Kitab remedies and gemstone recommendations based on planetary afflictions. Requires premium plan.',
    BIRTH_DATA_SCHEMA,
    async (args) => {
      const data = await callInternalApi('remedies', birthDataToPayload(args), activeApiKey, activeHost, activeProtocol);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );
}

// ── VERCEL SERVERLESS FUNCTION HANDLER ───────────────────────────────────────

export default async function handler(req: any, res: any) {
  // Add CORS headers for preflight and standard requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Authenticate the remote request using the exact same middleware
  const auth = await validateApiKey(req);
  if (!auth.valid) {
    if (auth.statusCode === 401) {
      res.setHeader(
        'WWW-Authenticate',
        'Bearer authorization_uri="https://marriage-astro.vercel.app/authorize", resource_metadata="https://marriage-astro.vercel.app/.well-known/oauth-protected-resource"'
      );
    }
    return res.status(auth.statusCode || 401).json({
      error: auth.error || 'Unauthorized',
      message: 'To use the MarriageAstro Custom Connector in Claude, please register an API key or pass it via headers or query parameters.',
      upgrade_url: 'https://marriage-astro.vercel.app/api-keys'
    });
  }

  // 2. Set active details for local API invocation inside the tool handlers
  // Retrieve caller's API key
  const activeApiKey = (req.headers['x-api-key'] as string) ||
                 (req.headers['authorization'] as string)?.replace(/^Bearer\s+/i, '') ||
                 (req.query.apiKey as string) ||
                 (req.query.key as string) ||
                 '';
  
  // Retrieve calling URL details (host + protocol) for dynamic matching
  const activeHost = req.headers.host || 'marriage-astro.vercel.app';
  const activeProtocol = req.headers['x-forwarded-proto'] || 'https';

  // Instantiate server per-request to avoid cross-request state pollution
  const server = new McpServer({
    name: 'marriage-astro-mcp',
    version: '1.0.2',
  });

  registerTools(server, activeApiKey, activeHost, activeProtocol);

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  (transport as any).onerror = (error: any) => {
    console.error('MCP Transport Error:', error);
  };
  (server as any).onerror = (error: any) => {
    console.error('MCP Server Error:', error);
  };

  await server.connect(transport);

  // 3. Delegate to MCP Streamable HTTP transport handler
  try {
    // Vercel may pass req.body as a pre-parsed object, a Buffer, a string, or undefined.
    // The MCP SDK expects a parsed JSON object as the 3rd argument to handleRequest.
    // When req.body is undefined (ESM Vercel functions don't auto-parse), we
    // manually read the raw stream and JSON.parse it.
    let body = req.body;

    if (body === undefined || body === null) {
      // Manually read the raw body from the Node.js IncomingMessage stream
      const rawBody = await new Promise<string>((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        req.on('error', reject);
      });
      try { body = JSON.parse(rawBody); } catch { body = rawBody; }
    } else if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { /* leave as string */ }
    } else if (Buffer.isBuffer(body)) {
      try { body = JSON.parse(body.toString('utf-8')); } catch { /* leave */ }
    }

    // Robustly override headers in both req.headers and req.rawHeaders
    // to ensure @hono/node-server and @modelcontextprotocol/sdk correctly process them.
    const overrideHeader = (key: string, val: string) => {
      req.headers = req.headers || {};
      req.headers[key.toLowerCase()] = val;
      if (req.rawHeaders) {
        let found = false;
        for (let i = 0; i < req.rawHeaders.length; i += 2) {
          if (req.rawHeaders[i].toLowerCase() === key.toLowerCase()) {
            req.rawHeaders[i + 1] = val;
            found = true;
            break;
          }
        }
        if (!found) {
          req.rawHeaders.push(key, val);
        }
      } else {
        req.rawHeaders = [];
        for (const [k, v] of Object.entries(req.headers)) {
          req.rawHeaders.push(k, String(v));
        }
      }
    };

    overrideHeader('accept', 'application/json, text/event-stream');
    if (req.method === 'POST') {
      overrideHeader('content-type', 'application/json');
    }

    await transport.handleRequest(req, res, body);
  } catch (error: any) {
    console.error('MCP Request Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal Server Error', stack: error.stack });
    } else {
      res.end(`\n\nERROR IN MCP HANDLER AFTER HEADERS SENT: ${error.message}\n${error.stack}\n`);
    }
  }
}

