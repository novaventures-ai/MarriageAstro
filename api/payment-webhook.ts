/**
 * Payment Webhook - Vercel Serverless Function
 *
 * Handles Razorpay payment confirmation webhooks.
 * Currently a placeholder — swap with real verification when Razorpay is live.
 *
 * TODO (Razorpay swap):
 * 1. Verify webhook signature using RAZORPAY_WEBHOOK_SECRET
 *    const crypto = require('crypto');
 *    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
 *      .update(JSON.stringify(req.body)).digest('hex');
 *    if (expectedSignature !== req.headers['x-razorpay-signature']) return res.status(401).json({ error: 'Invalid signature' });
 * 2. Parse event type (payment.captured, subscription.activated, etc.)
 * 3. Update profiles table via Supabase:
 *    - section_unlock: append to unlocked_sections JSONB
 *    - premium_monthly: set plan_tier='premium', plan_expires_at=+30 days
 *    - astrologer_monthly: set plan_tier='astrologer', plan_expires_at=+30 days
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: Verify Razorpay webhook signature
    // const crypto = require('crypto');
    // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    //   .update(JSON.stringify(req.body)).digest('hex');
    // if (expectedSignature !== req.headers['x-razorpay-signature']) {
    //   return res.status(401).json({ error: 'Invalid webhook signature' });
    // }

    const event = req.body;
    console.log('Payment webhook received:', JSON.stringify(event).slice(0, 500));

    // TODO: Parse event and update Supabase
    // const { createClient } = require('@supabase/supabase-js');
    // const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    //
    // if (event.event === 'payment.captured') {
    //   const { userId, planType, sectionToUnlock } = event.payload.payment.entity.notes;
    //   if (planType === 'section_unlock' && sectionToUnlock) {
    //     // Append section to unlocked_sections
    //     const { data: profile } = await supabase.from('profiles').select('unlocked_sections').eq('id', userId).single();
    //     const sections = [...(profile?.unlocked_sections || []), sectionToUnlock];
    //     await supabase.from('profiles').update({ unlocked_sections: sections }).eq('id', userId);
    //   } else if (planType === 'premium_monthly') {
    //     await supabase.from('profiles').update({
    //       plan_tier: 'premium',
    //       plan_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    //     }).eq('id', userId);
    //   }
    // }

    return res.status(200).json({
      success: true,
      mock: true,
      message: 'Webhook received (mock mode). Payment processing not yet active.',
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
