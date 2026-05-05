#!/usr/bin/env node
/**
 * vedic-astro-mcp — MCP Server for MarriageAstro
 * Exposes Vedic astrology calculations as MCP tools for Claude, Cursor, and other AI clients.
 *
 * Usage (Claude Desktop config):
 * {
 *   "mcpServers": {
 *     "vedic-astro": {
 *       "command": "npx",
 *       "args": ["vedic-astro-mcp"],
 *       "env": { "VEDIC_ASTRO_API_KEY": "your-key-here" }
 *     }
 *   }
 * }
 *
 * Get your API key at: https://marriageastro.com/api-keys
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { callApi } from './client.js';
import { BIRTH_DATA_SCHEMA, PAIR_SCHEMA, birthDataToPayload, pairToPayload } from './schema.js';

const server = new McpServer({
  name: 'vedic-astro-mcp',
  version: '1.0.0',
});

// ── TIER 1 — FREE ────────────────────────────────────────────────────────────

server.tool(
  'get_birth_chart',
  'Generate a Vedic birth chart (planets, houses, nakshatras, ascendant, yogas, dashas) for one person.',
  BIRTH_DATA_SCHEMA,
  async (args) => {
    const data = await callApi('birth-chart', birthDataToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'calculate_compatibility',
  'Calculate Ashtakoot Milan 36-point compatibility score between two people, including all 8 parameters (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi) and dosha flags.',
  PAIR_SCHEMA,
  async (args) => {
    const data = await callApi('compatibility', pairToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'analyze_dosha',
  'Check Mangal dosha, Nadi dosha, Kaal Sarpa, and other yoga/dosha patterns for one or two people.',
  PAIR_SCHEMA,
  async (args) => {
    const data = await callApi('dosha-check', pairToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

// ── TIER 2 — DEVELOPER ───────────────────────────────────────────────────────

server.tool(
  'get_full_compatibility_report',
  'Generate the complete compatibility report including synastry, navamsa, divisional charts, dasha analysis, and timing. Requires developer plan.',
  PAIR_SCHEMA,
  async (args) => {
    const data = await callApi('full-report', pairToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_marriage_timing',
  'Find auspicious marriage windows based on Vimshottari Dasha and transit confluence. Requires developer plan.',
  BIRTH_DATA_SCHEMA,
  async (args) => {
    const data = await callApi('marriage-timing', birthDataToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_synastry',
  'Cross-chart planetary aspect analysis and house overlays between two people. Requires developer plan.',
  PAIR_SCHEMA,
  async (args) => {
    const data = await callApi('synastry', pairToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_navamsa_matching',
  'D9 Navamsa chart compatibility — the marriage-specific divisional chart analysis. Requires developer plan.',
  PAIR_SCHEMA,
  async (args) => {
    const data = await callApi('navamsa', pairToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_kp_analysis',
  'Krishnamurti Paddhati (KP) stellar astrology analysis with 249 sub-lords. Requires developer plan.',
  BIRTH_DATA_SCHEMA,
  async (args) => {
    const data = await callApi('kp-analysis', birthDataToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_jaimini_dasha',
  'Jaimini/Chara Dasha analysis including Darakaraka and Upapada Lagna for marriage timing. Requires developer plan.',
  BIRTH_DATA_SCHEMA,
  async (args) => {
    const data = await callApi('jaimini-dasha', birthDataToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_self_analysis',
  'Single-person marriage readiness analysis — personality, timing forecast, spouse profile. Requires developer plan.',
  BIRTH_DATA_SCHEMA,
  async (args) => {
    const data = await callApi('self-analysis', birthDataToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

// ── TIER 3 — PREMIUM ─────────────────────────────────────────────────────────

server.tool(
  'get_divorce_risk',
  'Assess divorce probability from 7th and 2nd house afflictions. Unique feature — no other Vedic API provides this. Requires premium plan.',
  PAIR_SCHEMA,
  async (args) => {
    const data = await callApi('divorce-risk', pairToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_infidelity_risk',
  'Analyze infidelity indicators from 5th, 8th, and 12th house patterns, plus protective factors. Requires premium plan.',
  PAIR_SCHEMA,
  async (args) => {
    const data = await callApi('infidelity-risk', pairToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_sexual_compatibility',
  'Venus/Mars synastry + sexual temperament matching + mutual satisfaction analysis. Requires premium plan.',
  PAIR_SCHEMA,
  async (args) => {
    const data = await callApi('sexual-compatibility', pairToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_sexual_health',
  'Individual sexual health analysis — libido, PME/ED/Frigidity risk indicators from birth chart. Requires premium plan.',
  BIRTH_DATA_SCHEMA,
  async (args) => {
    const data = await callApi('sexual-health', birthDataToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_mental_health_analysis',
  'Analyze anxiety, depression, narcissism, and emotional stability markers from birth chart. Requires premium plan.',
  BIRTH_DATA_SCHEMA,
  async (args) => {
    const data = await callApi('mental-health', birthDataToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_psychological_profile',
  'Attachment style, emotional patterns, and personality profile from planetary positions. Requires premium plan.',
  BIRTH_DATA_SCHEMA,
  async (args) => {
    const data = await callApi('psychological-profile', birthDataToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_conflict_zones',
  'Identify conflict triggers, hot-button topics, and tension patterns between two people. Requires premium plan.',
  PAIR_SCHEMA,
  async (args) => {
    const data = await callApi('conflict-zones', pairToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_vulnerability_windows',
  'Find timing windows when the relationship is at highest stress/breakdown risk. Requires premium plan.',
  PAIR_SCHEMA,
  async (args) => {
    const data = await callApi('vulnerability-windows', pairToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_inlaw_analysis',
  'Analyze compatibility with partner\'s family from 4th and 8th house indicators. Requires premium plan.',
  PAIR_SCHEMA,
  async (args) => {
    const data = await callApi('inlaw-analysis', pairToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_spouse_prediction',
  'Predict future spouse\'s appearance, nature, profession, and when/how you will meet them. Requires premium plan.',
  BIRTH_DATA_SCHEMA,
  async (args) => {
    const data = await callApi('spouse-prediction', birthDataToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_modern_challenges',
  'Digital age relationship analysis — social media impact, long-distance patterns, modern planet (Uranus/Neptune/Pluto) influence. Requires premium plan.',
  PAIR_SCHEMA,
  async (args) => {
    const data = await callApi('modern-challenges', pairToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'get_remedies',
  'Lal Kitab remedies and gemstone recommendations based on planetary afflictions. Requires premium plan.',
  BIRTH_DATA_SCHEMA,
  async (args) => {
    const data = await callApi('remedies', birthDataToPayload(args));
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
