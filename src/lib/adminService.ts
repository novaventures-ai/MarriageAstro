/**
 * Admin Service
 * Routes all admin operations through the /api/admin-users serverless function,
 * which uses the Supabase service role key to bypass RLS for cross-user access.
 * The serverless function independently verifies the caller's JWT.
 */

import { supabase } from './supabase';
import { PlanTier } from '../types';

export interface UserRecord {
  id: string;
  email: string;
  full_name: string | null;
  plan_tier: PlanTier;
  plan_expires_at: string | null;
  updated_at: string;
}

async function getAuthHeader(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ? `Bearer ${session.access_token}` : '';
}

export async function listAllUsers(): Promise<UserRecord[]> {
  const auth = await getAuthHeader();
  const res = await fetch('/api/admin-users', {
    headers: { Authorization: auth },
  });

  if (!res.ok) {
    console.error('Admin: failed to list users', res.status);
    return [];
  }

  const { users } = await res.json();
  return (users || []).map((row: any) => ({
    id: row.id,
    email: row.email || '',
    full_name: row.full_name || null,
    plan_tier: (row.plan_tier as PlanTier) || 'free',
    plan_expires_at: row.plan_expires_at || null,
    updated_at: row.updated_at || '',
  }));
}

export async function grantPremium(
  userId: string,
  tier: PlanTier,
  expiresAt?: string | null
): Promise<boolean> {
  const auth = await getAuthHeader();
  const res = await fetch('/api/admin-users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({ action: 'grant', userId, tier, expiresAt: expiresAt ?? null }),
  });

  if (!res.ok) {
    console.error('Admin: failed to grant premium', res.status);
    return false;
  }
  return true;
}

export async function revokePremium(userId: string): Promise<boolean> {
  const auth = await getAuthHeader();
  const res = await fetch('/api/admin-users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({ action: 'revoke', userId }),
  });

  if (!res.ok) {
    console.error('Admin: failed to revoke premium', res.status);
    return false;
  }
  return true;
}
