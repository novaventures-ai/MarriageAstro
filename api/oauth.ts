/**
 * OAuth 2.0 Serverless Endpoint for MarriageAstro
 *
 * Implements a high-performance, secure, stateless OAuth 2.0 server.
 * Uses native Node.js crypto module to sign and verify tokens using the 
 * SUPABASE_SERVICE_ROLE_KEY as a private signing key.
 *
 * Exposes two main paths:
 * 1. POST /api/oauth { action: 'authorize', ... }
 *    - Authenticates user via Supabase client JWT
 *    - Generates a short-lived authorization code (5 mins)
 *
 * 2. POST /api/oauth (Standard OAuth 2.0 Token Exchange / Refresh)
 *    - Exchanged with grant_type: 'authorization_code' -> returns access_token + refresh_token
 *    - Exchanged with grant_type: 'refresh_token'     -> returns new tokens
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { signToken, verifyToken, ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from './_oauth-helper.js';

// Parse urlencoded or JSON parameters robustly
function parseParams(req: VercelRequest): Record<string, string> {
  const params: Record<string, string> = {};

  if (req.query) {
    for (const [k, v] of Object.entries(req.query)) {
      params[k] = String(v);
    }
  }

  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    for (const [k, v] of Object.entries(req.body)) {
      params[k] = String(v);
    }
  }

  if (typeof req.body === 'string') {
    try {
      const searchParams = new URLSearchParams(req.body);
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
    } catch {
      // Ignore
    }
  }

  return params;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const params = parseParams(req);
  console.log(`[OAuth Debug] Request Method: ${req.method}, Content-Type: ${req.headers['content-type']}`);
  console.log(`[OAuth Debug] Parameters received:`, JSON.stringify({ ...params, client_secret: params.client_secret ? '***' : undefined }));

  // ── GET Method: Metadata helper ───────────────────────────────────────────
  if (req.method === 'GET') {
    return res.status(200).json({
      name: 'MarriageAstro OAuth 2.0 Authentication Server',
      status: 'active',
      endpoints: {
        authorization: '/oauth/authorize',
        token: '/api/oauth'
      },
      client_id: process.env.CLAUDE_CLIENT_ID || 'claude-connector'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Action 1: User-Facing Authorization Code Request (from Frontend React Page)
  if (params.action === 'authorize') {
    const authHeader = req.headers['authorization'] || '';
    const userToken = authHeader.replace('Bearer ', '').trim();

    if (!userToken) {
      console.warn('[OAuth Debug] Authorization Failed: User auth token missing from Authorization header');
      return res.status(401).json({ error: 'unauthorized', error_description: 'User auth token required' });
    }

    const { clientId, redirectUri } = params;
    if (!clientId || !redirectUri) {
      console.warn('[OAuth Debug] Authorization Failed: clientId or redirectUri missing', { clientId, redirectUri });
      return res.status(400).json({ error: 'invalid_request', error_description: 'clientId and redirectUri required' });
    }

    try {
      // Verify user JWT with Supabase anon client
      const anonUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
      if (!anonUrl || !anonKey) {
        console.error('[OAuth Debug] Authorization Failed: Supabase environment variables not configured');
        return res.status(500).json({ error: 'server_error', error_description: 'Supabase not configured' });
      }

      const anonClient = createClient(anonUrl, anonKey);
      const { data: { user }, error } = await anonClient.auth.getUser(userToken);

      if (error || !user) {
        console.warn('[OAuth Debug] Authorization Failed: Invalid user session/token check via Supabase:', error?.message);
        return res.status(401).json({ error: 'unauthorized', error_description: 'Invalid user session' });
      }

      // Generate a short-lived authorization code (valid for 5 mins)
      const code = signToken({
        userId: user.id,
        clientId,
        redirectUri
      }, 300);

      console.log(`[OAuth Debug] Authorization Code generated successfully for user: ${user.id}`);
      return res.status(200).json({ code });
    } catch (err: any) {
      console.error('[OAuth Debug] Authorization Code Exception:', err);
      return res.status(500).json({ error: 'server_error', error_description: err.message });
    }
  }

  // ── Action 2: Standard OAuth 2.0 Grant/Token Request (from Claude Backend)
  const { grant_type, code, redirect_uri, client_id, client_secret, refresh_token } = params;

  // Validate Client Credentials
  const expectedClientId = process.env.CLAUDE_CLIENT_ID || 'claude-connector';
  const expectedClientSecret = process.env.CLAUDE_CLIENT_SECRET;

  console.log(`[OAuth Debug] Validating Client. Received client_id: "${client_id}", expectedClientId: "${expectedClientId}". Received client_secret: "${client_secret ? '***' : 'none'}", expectedClientSecret: "${expectedClientSecret ? '***' : 'none'}"`);

  if (client_id && client_id !== expectedClientId) {
    console.warn(`[OAuth Debug] Client ID mismatch. Received: "${client_id}", Expected: "${expectedClientId}"`);
    return res.status(400).json({ error: 'invalid_client', error_description: 'Client ID mismatch' });
  }

  if (expectedClientSecret && client_secret && client_secret !== expectedClientSecret) {
    console.warn('[OAuth Debug] Client Secret mismatch.');
    return res.status(400).json({ error: 'invalid_client', error_description: 'Client Secret mismatch' });
  }

  // Handle Token Exchange
  if (grant_type === 'authorization_code') {
    console.log(`[OAuth Debug] Grant Type 'authorization_code' token exchange requested.`);
    if (!code) {
      console.warn('[OAuth Debug] Token Exchange Failed: Code is missing');
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Missing code' });
    }

    const payload = verifyToken(code);
    if (!payload) {
      console.warn('[OAuth Debug] Token Exchange Failed: Code verification failed or code has expired');
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Code invalid or expired' });
    }

    console.log('[OAuth Debug] Authorization code verified successfully. Payload:', JSON.stringify(payload));

    // Verify redirect URI matches
    if (redirect_uri && payload.redirectUri && redirect_uri !== payload.redirectUri) {
      console.warn(`[OAuth Debug] Redirect URI mismatch. Received: "${redirect_uri}", Expected: "${payload.redirectUri}"`);
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Redirect URI mismatch' });
    }

    // Generate stateless Access and Refresh tokens
    const accessToken = signToken({ userId: payload.userId, clientId: payload.clientId }, ACCESS_TOKEN_LIFETIME);
    const refreshToken = signToken({ userId: payload.userId, clientId: payload.clientId, type: 'refresh' }, REFRESH_TOKEN_LIFETIME);

    console.log(`[OAuth Debug] Tokens issued successfully for user ${payload.userId}`);
    return res.status(200).json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: ACCESS_TOKEN_LIFETIME,
      refresh_token: refreshToken
    });
  }

  // Handle Refresh Token
  if (grant_type === 'refresh_token') {
    console.log('[OAuth Debug] Grant Type "refresh_token" token refresh requested.');
    if (!refresh_token) {
      console.warn('[OAuth Debug] Token Refresh Failed: refresh_token is missing');
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Missing refresh_token' });
    }

    const payload = verifyToken(refresh_token);
    if (!payload || payload.type !== 'refresh') {
      console.warn('[OAuth Debug] Token Refresh Failed: refresh_token verification failed or expired');
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Invalid or expired refresh token' });
    }

    const accessToken = signToken({ userId: payload.userId, clientId: payload.clientId }, ACCESS_TOKEN_LIFETIME);
    const newRefreshToken = signToken({ userId: payload.userId, clientId: payload.clientId, type: 'refresh' }, REFRESH_TOKEN_LIFETIME);

    console.log(`[OAuth Debug] Tokens refreshed successfully for user ${payload.userId}`);
    return res.status(200).json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: ACCESS_TOKEN_LIFETIME,
      refresh_token: newRefreshToken
    });
  }

  console.warn(`[OAuth Debug] Unsupported Grant Type requested: "${grant_type}"`);
  return res.status(400).json({ error: 'unsupported_grant_type', error_description: 'Supported: authorization_code, refresh_token' });
}
