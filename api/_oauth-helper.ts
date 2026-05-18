import crypto from 'crypto';

const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-fallback-secret-for-dev';

// Standard 30-day token lifetime
export const ACCESS_TOKEN_LIFETIME = 2592000;
// Standard 1-year refresh token lifetime
export const REFRESH_TOKEN_LIFETIME = 31536000;

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
