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

// ─── Push Notification Admin ──────────────────────────────────────────────────

export async function getPushStats(): Promise<{ count: number }> {
  const auth = await getAuthHeader();
  const res = await fetch('/api/admin-users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({ action: 'push_stats' }),
  });
  if (!res.ok) return { count: 0 };
  return res.json();
}

export async function sendPushBroadcast(
  title: string,
  body: string,
  url: string,
  targetTier?: string
): Promise<{ sent: number; failed: number }> {
  const auth = await getAuthHeader();
  const res = await fetch('/api/admin-users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({ action: 'push_broadcast', title, body, url, targetTier }),
  });
  if (!res.ok) return { sent: 0, failed: 0 };
  return res.json();
}

// ─── Affiliate Admin ──────────────────────────────────────────────────────────

export interface AffiliateRecord {
  id: string;
  affiliate_code: string;
  affiliate_name: string;
  bureau_name: string | null;
  affiliate_email: string | null;
  affiliate_whatsapp: string | null;
  total_clicks: number;
  total_referrals: number;
  total_conversions: number;
  pending_payout_inr: number;
  payout_status: string;
  upi_id: string | null;
  created_at: string;
}

export async function listAffiliates(): Promise<AffiliateRecord[]> {
  const auth = await getAuthHeader();
  const res = await fetch('/api/admin-affiliates', {
    headers: { Authorization: auth },
  });
  if (!res.ok) {
    console.error('Admin: failed to list affiliates', res.status);
    return [];
  }
  const { affiliates } = await res.json();
  return affiliates ?? [];
}

export async function markAffiliatePaid(affiliateId: string): Promise<boolean> {
  const auth = await getAuthHeader();
  const res = await fetch('/api/admin-affiliates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({ action: 'markPaid', affiliateId }),
  });
  return res.ok;
}

export async function disableAffiliate(affiliateId: string): Promise<boolean> {
  const auth = await getAuthHeader();
  const res = await fetch('/api/admin-affiliates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({ action: 'disable', affiliateId }),
  });
  return res.ok;
}

export async function addAffiliate(data: {
  name: string; email: string; whatsapp?: string; bureauName?: string; upiId?: string;
}): Promise<{ success: boolean; affiliateCode?: string; error?: string }> {
  const auth = await getAuthHeader();
  const res = await fetch('/api/admin-affiliates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({ action: 'addAffiliate', ...data }),
  });
  const json = await res.json();
  if (res.ok) return { success: true, affiliateCode: json.affiliateCode };
  return { success: false, error: json.error };
}

export async function creditMissedPayment(
  affiliateId: string,
  paymentId: string,
  commissionInr: number
): Promise<{ success: boolean; error?: string }> {
  const auth = await getAuthHeader();
  const res = await fetch('/api/admin-affiliates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({ action: 'creditMissed', affiliateId, paymentId, commissionInr }),
  });
  const data = await res.json();
  return res.ok ? { success: true } : { success: false, error: data.error };
}

export interface AffiliateConversion {
  id: string;
  affiliate_code: string;
  payment_id: string;
  plan_type: string;
  commission_inr: number;
  created_at: string;
}

export async function payoutAffiliate(affiliateId: string): Promise<{ success: boolean; payoutId?: string; status?: string; error?: string }> {
  const auth = await getAuthHeader();
  const res = await fetch('/api/admin-affiliates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({ action: 'payout', affiliateId }),
  });
  const data = await res.json();
  return res.ok
    ? { success: true, payoutId: data.payoutId, status: data.status }
    : { success: false, error: data.error };
}

export async function updateAffiliateUpiId(affiliateId: string, upiId: string): Promise<boolean> {
  const auth = await getAuthHeader();
  const res = await fetch('/api/admin-affiliates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({ action: 'updateUpiId', affiliateId, upiId }),
  });
  return res.ok;
}

export async function listAffiliateConversions(affiliateCode: string): Promise<AffiliateConversion[]> {
  const auth = await getAuthHeader();
  const res = await fetch(`/api/admin-affiliates?code=${encodeURIComponent(affiliateCode)}`, {
    headers: { Authorization: auth },
  });
  if (!res.ok) return [];
  const { conversions } = await res.json();
  return conversions ?? [];
}

// ─── Payment History Admin ───────────────────────────────────────────────────

export interface PaymentRecord {
  payment_id: string;
  order_id: string;
  user_id: string;
  user_email: string;
  amount: number;
  plan_type: string;
  section_id: string | null;
  report_key: string | null;
  status: string;
  created_at: string;
}

export async function listAllPayments(): Promise<PaymentRecord[]> {
  const auth = await getAuthHeader();
  const res = await fetch('/api/admin-users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: auth },
    body: JSON.stringify({ action: 'list_payments' }),
  });
  if (!res.ok) {
    console.error('Admin: failed to list payments', res.status);
    return [];
  }
  const { payments } = await res.json();
  return payments ?? [];
}
