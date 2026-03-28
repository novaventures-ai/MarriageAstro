/**
 * Admin Users API
 * Server-side admin operations using the Supabase service role key (bypasses RLS).
 * Verifies caller JWT and checks against hardcoded ADMIN_EMAILS before acting.
 */

import { createClient } from '@supabase/supabase-js';
import webpush from 'web-push';

const ADMIN_EMAILS = [
  'novaventures.contact@gmail.com',
  'rahul.govalkar.1807@gmail.com',
];

function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

function getServiceClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase service role not configured');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function verifyAdmin(req: any): Promise<string | null> {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;

  // Use anon client to verify the user's JWT
  const anonUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!anonUrl || !anonKey) return null;

  const anonClient = createClient(anonUrl, anonKey);
  const { data: { user }, error } = await anonClient.auth.getUser(token);
  if (error || !user?.email) return null;
  if (!isAdminEmail(user.email)) return null;
  return user.email;
}

export default async function handler(req: any, res: any) {
  // Verify admin JWT on every request
  const adminEmail = await verifyAdmin(req);
  if (!adminEmail) {
    return res.status(403).json({ error: 'Forbidden: admin access required' });
  }

  const db = getServiceClient();

  // GET ?action=list
  if (req.method === 'GET') {
    const { data, error } = await db
      .from('profiles')
      .select('id, email, full_name, plan_tier, plan_expires_at, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('admin-users: list failed', error.message);
      return res.status(500).json({ error: 'Failed to list users' });
    }

    return res.status(200).json({ users: data || [] });
  }

  // POST { action, userId, tier?, expiresAt? }
  if (req.method === 'POST') {
    const { action, userId, tier, expiresAt } = req.body || {};

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Missing userId' });
    }

    if (action === 'grant') {
      if (!tier || !['free', 'premium', 'astrologer'].includes(tier)) {
        return res.status(400).json({ error: 'Invalid tier' });
      }

      const { error } = await db
        .from('profiles')
        .update({
          plan_tier: tier,
          plan_expires_at: expiresAt ?? null,
        })
        .eq('id', userId);

      if (error) {
        console.error('admin-users: grant failed', error.message);
        return res.status(500).json({ error: 'Failed to grant plan' });
      }

      return res.status(200).json({ success: true });
    }

    if (action === 'revoke') {
      const { error } = await db
        .from('profiles')
        .update({
          plan_tier: 'free',
          plan_expires_at: null,
          unlocked_sections: [],
        })
        .eq('id', userId);

      if (error) {
        console.error('admin-users: revoke failed', error.message);
        return res.status(500).json({ error: 'Failed to revoke plan' });
      }

      return res.status(200).json({ success: true });
    }

    // ── push_stats: count of active push subscribers ─────────────────────────
    if (action === 'push_stats') {
      const { count, error: cErr } = await db
        .from('push_subscriptions')
        .select('*', { count: 'exact', head: true });

      if (cErr) return res.status(500).json({ error: cErr.message });
      return res.status(200).json({ count: count ?? 0 });
    }

    // ── push_broadcast: send notification to subscribers ──────────────────────
    if (action === 'push_broadcast') {
      const { title, body: msgBody, url, targetTier } = req.body as {
        title: string; body: string; url?: string; targetTier?: string;
      };

      if (!title || !msgBody) {
        return res.status(400).json({ error: 'title and body required' });
      }

      // Fetch subscriptions — optionally filtered by plan tier via join
      let query = db
        .from('push_subscriptions')
        .select(targetTier && targetTier !== 'all'
          ? 'subscription, profiles!inner(plan_tier)'
          : 'subscription');

      if (targetTier && targetTier !== 'all') {
        query = query.eq('profiles.plan_tier', targetTier);
      }

      const { data: rows, error: fetchErr } = await query;
      if (fetchErr) return res.status(500).json({ error: fetchErr.message });

      const vapidEmail = process.env.VAPID_EMAIL ?? 'mailto:admin@marriage-astro.vercel.app';
      const vapidPub   = process.env.VAPID_PUBLIC_KEY ?? '';
      const vapidPriv  = process.env.VAPID_PRIVATE_KEY ?? '';

      if (!vapidPub || !vapidPriv) {
        return res.status(503).json({ error: 'VAPID keys not configured' });
      }

      webpush.setVapidDetails(vapidEmail, vapidPub, vapidPriv);

      const payload = JSON.stringify({ title, body: msgBody, url: url ?? '/' });
      const results = await Promise.allSettled(
        (rows ?? []).map((row: any) =>
          webpush.sendNotification(row.subscription as webpush.PushSubscription, payload)
        )
      );

      const sent   = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;
      return res.status(200).json({ sent, failed });
    }

    return res.status(400).json({ error: 'Unknown action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
