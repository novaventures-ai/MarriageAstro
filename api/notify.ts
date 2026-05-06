/**
 * notify.ts — Unified notification handler
 * Handles both email (Resend) and web push notifications.
 *
 * Replaces /api/send-email and /api/send-push — vercel.json rewrites both paths here.
 *
 * Email POST body: { template, userId, toEmail?, data? }
 * Push  POST body: { subscriptions, title, body, url?, adminSecret }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VAPID_EMAIL ?? 'mailto:admin@marriage-astro.vercel.app',
  process.env.VAPID_PUBLIC_KEY ?? '',
  process.env.VAPID_PRIVATE_KEY ?? ''
);

const FROM_EMAIL = process.env.EMAIL_FROM || 'Astro Marriage <noreply@astromarriage.in>';
const APP_URL = process.env.APP_URL || 'https://marriage-astro.vercel.app';

type EmailTemplate = 'premium_welcome' | 'payment_confirmation' | 'section_unlocked';

function getServiceClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase service role not configured');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function renderTemplate(template: EmailTemplate, data: Record<string, string> = {}): { subject: string; html: string } {
  const { planName = 'Premium', sectionName = 'the section', amount = '' } = data;

  switch (template) {
    case 'premium_welcome':
      return {
        subject: `Welcome to Astro Marriage ${planName}! ✨`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0f0d1a;color:#f1f5f9;border-radius:16px">
            <h1 style="color:#f59e0b;margin-bottom:8px">Your ${planName} plan is now active 🎉</h1>
            <p style="color:#94a3b8;margin-bottom:24px">Full access to all astrological insights and AI features is unlocked.</p>
            <a href="${APP_URL}" style="display:inline-block;padding:12px 28px;background:#f59e0b;color:#000;font-weight:700;border-radius:10px;text-decoration:none">Open Astro Marriage</a>
            <p style="color:#64748b;margin-top:32px;font-size:13px">Questions? Reply to this email and we'll help you out.</p>
          </div>`,
      };
    case 'payment_confirmation':
      return {
        subject: `Payment confirmed — Astro Marriage`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0f0d1a;color:#f1f5f9;border-radius:16px">
            <h1 style="color:#10b981;margin-bottom:8px">Payment confirmed ✓</h1>
            <p style="color:#94a3b8">Amount charged: <strong style="color:#f1f5f9">${amount}</strong></p>
            <p style="color:#94a3b8;margin-bottom:24px">Your access has been activated immediately.</p>
            <a href="${APP_URL}" style="display:inline-block;padding:12px 28px;background:#f59e0b;color:#000;font-weight:700;border-radius:10px;text-decoration:none">View Your Report</a>
          </div>`,
      };
    case 'section_unlocked':
      return {
        subject: `Section unlocked: ${sectionName}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0f0d1a;color:#f1f5f9;border-radius:16px">
            <h1 style="color:#f59e0b;margin-bottom:8px">Unlocked: ${sectionName} 🔓</h1>
            <p style="color:#94a3b8;margin-bottom:24px">Your one-time unlock for <strong style="color:#f1f5f9">${sectionName}</strong> is now active.</p>
            <a href="${APP_URL}" style="display:inline-block;padding:12px 28px;background:#f59e0b;color:#000;font-weight:700;border-radius:10px;text-decoration:none">View Analysis</a>
          </div>`,
      };
  }
}

async function handleEmail(req: VercelRequest, res: VercelResponse) {
  const { template, userId, toEmail, data } = req.body as {
    template: EmailTemplate;
    userId: string;
    toEmail?: string;
    data?: Record<string, string>;
  };

  if (!template || !userId) {
    return res.status(400).json({ error: 'Missing template or userId' });
  }

  let recipientEmail = toEmail;
  if (!recipientEmail) {
    const db = getServiceClient();
    const { data: { user }, error } = await db.auth.admin.getUserById(userId);
    if (error || !user?.email) {
      return res.status(404).json({ error: 'User not found or has no email' });
    }
    recipientEmail = user.email;
  }

  const { subject, html } = renderTemplate(template, data || {});
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[notify:email MOCK] to=${recipientEmail} template=${template}`);
    return res.status(200).json({ success: true, mock: true });
  }

  const resend = new Resend(apiKey);
  const { error: sendError } = await resend.emails.send({ from: FROM_EMAIL, to: recipientEmail, subject, html });

  if (sendError) {
    console.error('notify:email Resend error', sendError);
    return res.status(500).json({ error: 'Failed to send email' });
  }

  return res.status(200).json({ success: true, mock: false });
}

async function handlePush(req: VercelRequest, res: VercelResponse) {
  const { subscriptions, title, body, url, adminSecret } = req.body as {
    subscriptions: webpush.PushSubscription[];
    title: string;
    body: string;
    url?: string;
    adminSecret: string;
  };

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

  return res.status(200).json({
    sent: results.filter((r) => r.status === 'fulfilled').length,
    failed: results.filter((r) => r.status === 'rejected').length,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Route: push if subscriptions present, else email
    if (Array.isArray(req.body?.subscriptions)) {
      return handlePush(req, res);
    }
    return handleEmail(req, res);
  } catch (error: any) {
    console.error('notify: unhandled error', error);
    return res.status(500).json({ error: 'Notification failed' });
  }
}
