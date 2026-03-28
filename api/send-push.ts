/**
 * send-push.ts — Vercel Serverless Function
 *
 * Sends Web Push notifications to one or more subscriptions.
 *
 * POST /api/send-push
 * Body: {
 *   subscriptions: PushSubscription[],
 *   title: string,
 *   body: string,
 *   url?: string,
 *   adminSecret: string   // must match ADMIN_PUSH_SECRET env var
 * }
 *
 * Required env vars:
 *   VAPID_PUBLIC_KEY   — generate with: npx web-push generate-vapid-keys
 *   VAPID_PRIVATE_KEY  — (same command)
 *   VAPID_EMAIL        — e.g. mailto:admin@example.com
 *   ADMIN_PUSH_SECRET  — any random secret string for server-to-server calls
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VAPID_EMAIL ?? 'mailto:admin@marriage-astro.vercel.app',
  process.env.VAPID_PUBLIC_KEY ?? '',
  process.env.VAPID_PRIVATE_KEY ?? ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subscriptions, title, body, url, adminSecret } = req.body as {
    subscriptions: webpush.PushSubscription[];
    title: string;
    body: string;
    url?: string;
    adminSecret: string;
  };

  // Simple secret check — keeps this endpoint internal
  if (adminSecret !== process.env.ADMIN_PUSH_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
    return res.status(400).json({ error: 'subscriptions array required' });
  }

  const payload = JSON.stringify({ title, body, url: url ?? '/' });

  const results = await Promise.allSettled(
    subscriptions.map((sub) => webpush.sendNotification(sub, payload))
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  return res.status(200).json({ sent, failed });
}
