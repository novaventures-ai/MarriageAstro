/**
 * Admin Service
 * Operations for admin users to manage other users' premium access.
 * Only callable by admin-email users (enforced at UI level + RLS).
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

export async function listAllUsers(): Promise<UserRecord[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, plan_tier, plan_expires_at, updated_at')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Admin: failed to list users', error.message);
    return [];
  }

  return (data || []).map(row => ({
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
  const { error } = await supabase
    .from('profiles')
    .update({
      plan_tier: tier,
      plan_expires_at: expiresAt ?? null,
    })
    .eq('id', userId);

  if (error) {
    console.error('Admin: failed to grant premium', error.message);
    return false;
  }
  return true;
}

export async function revokePremium(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update({
      plan_tier: 'free',
      plan_expires_at: null,
      unlocked_sections: [],
    })
    .eq('id', userId);

  if (error) {
    console.error('Admin: failed to revoke premium', error.message);
    return false;
  }
  return true;
}
