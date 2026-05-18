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
import crypto from 'crypto';

const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-fallback-secret-for-dev';

// Standard 30-day token lifetime
const ACCESS_TOKEN_LIFETIME = 2592000;
// Standard 1-year refresh token lifetime
const REFRESH_TOKEN_LIFETIME = 31536000;

// Helper to sign a JWT-like token statelessly
export function signToken(payload: any, expiresInSeconds: number): string {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const header = { alg: 'HS256', typ: 'JWT' };
  const fullPayload = { ...payload, exp: expiresAt };

  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');

  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(`${headerB64}.${payloadB64}`);
  const signature = hmac.digest('base64url');

  return `${headerB64}.${payloadB64}.${signature}`;
}

// Helper to verify a token
export function verifyToken(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signaturePart] = parts;
    const hmac = crypto.createHmac('sha256', SECRET);
    hmac.update(`${headerB64}.${payloadB64}`);
    const expectedSignature = hmac.digest('base64url');

    if (signaturePart !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

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
      return res.status(401).json({ error: 'unauthorized', error_description: 'User auth token required' });
    }

    const { clientId, redirectUri } = params;
    if (!clientId || !redirectUri) {
      return res.status(400).json({ error: 'invalid_request', error_description: 'clientId and redirectUri required' });
    }

    try {
      // Verify user JWT with Supabase anon client
      const anonUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
      if (!anonUrl || !anonKey) {
        return res.status(500).json({ error: 'server_error', error_description: 'Supabase not configured' });
      }

      const anonClient = createClient(anonUrl, anonKey);
      const { data: { user }, error } = await anonClient.auth.getUser(userToken);

      if (error || !user) {
        return res.status(401).json({ error: 'unauthorized', error_description: 'Invalid user session' });
      }

      // Generate a short-lived authorization code (valid for 5 mins)
      const code = signToken({
        userId: user.id,
        clientId,
        redirectUri
      }, 300);

      return res.status(200).json({ code });
    } catch (err: any) {
      return res.status(500).json({ error: 'server_error', error_description: err.message });
    }
  }

  // ── Action 2: Standard OAuth 2.0 Grant/Token Request (from Claude Backend)
  const { grant_type, code, redirect_uri, client_id, client_secret, refresh_token } = params;

  // Validate Client Credentials
  const expectedClientId = process.env.CLAUDE_CLIENT_ID || 'claude-connector';
  const expectedClientSecret = process.env.CLAUDE_CLIENT_SECRET;

  if (client_id && client_id !== expectedClientId) {
    return res.status(400).json({ error: 'invalid_client', error_description: 'Client ID mismatch' });
  }

  if (expectedClientSecret && client_secret && client_secret !== expectedClientSecret) {
    return res.status(400).json({ error: 'invalid_client', error_description: 'Client Secret mismatch' });
  }

  // Handle Token Exchange
  if (grant_type === 'authorization_code') {
    if (!code) {
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Missing code' });
    }

    const payload = verifyToken(code);
    if (!payload) {
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Code invalid or expired' });
    }

    // Verify redirect URI matches
    if (redirect_uri && payload.redirectUri && redirect_uri !== payload.redirectUri) {
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Redirect URI mismatch' });
    }

    // Generate stateless Access and Refresh tokens
    const accessToken = signToken({ userId: payload.userId, clientId: payload.clientId }, ACCESS_TOKEN_LIFETIME);
    const refreshToken = signToken({ userId: payload.userId, clientId: payload.clientId, type: 'refresh' }, REFRESH_TOKEN_LIFETIME);

    return res.status(200).json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: ACCESS_TOKEN_LIFETIME,
      refresh_token: refreshToken
    });
  }

  // Handle Refresh Token
  if (grant_type === 'refresh_token') {
    if (!refresh_token) {
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Missing refresh_token' });
    }

    const payload = verifyToken(refresh_token);
    if (!payload || payload.type !== 'refresh') {
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Invalid or expired refresh token' });
    }

    const accessToken = signToken({ userId: payload.userId, clientId: payload.clientId }, ACCESS_TOKEN_LIFETIME);
    const newRefreshToken = signToken({ userId: payload.userId, clientId: payload.clientId, type: 'refresh' }, REFRESH_TOKEN_LIFETIME);

    return res.status(200).json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: ACCESS_TOKEN_LIFETIME,
      refresh_token: newRefreshToken
    });
  }

  return res.status(400).json({ error: 'unsupported_grant_type', error_description: 'Supported: authorization_code, refresh_token' });
}
