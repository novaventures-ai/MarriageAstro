import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase service role or URL not configured');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, userEmail } = req.body || {};

  if (!userId || !userEmail) {
    return res.status(400).json({ error: 'User context missing' });
  }

  const rzpKeyId = process.env.RAZORPAY_KEY_ID;
  const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!rzpKeyId || !rzpKeySecret) {
    return res.status(500).json({ error: 'Razorpay keys not configured' });
  }

  const razorpay = new Razorpay({ key_id: rzpKeyId, key_secret: rzpKeySecret });
  const db = getServiceClient();

  try {
    // 1. Fetch recent captured payments (last 20)
    const paymentsResponse = await razorpay.payments.all({ count: 20 });
    const userPayments = paymentsResponse.items.filter(p => 
      p.status === 'captured' && 
      (p.email === userEmail || p.notes?.userId === userId)
    );

    if (userPayments.length === 0) {
      return res.status(200).json({ success: true, processed: 0, message: 'No missing payments found.' });
    }

    const recovered = [];

    for (const payment of userPayments) {
      const planType = payment.notes?.planType as string;
      const sectionToUnlock = payment.notes?.sectionToUnlock as string;
      const reportKey = payment.notes?.reportKey as string;

      if (!planType) continue;

      // Check if already in history
      const { data: existing } = await db
        .from('payment_history')
        .select('payment_id')
        .eq('payment_id', payment.id)
        .single();

      if (existing) continue;

      // Apply Fulfill
      console.log(`sync-payments: Recovering ${payment.id} for ${userId}`);

      // Record in history
      await db.from('payment_history').upsert({
        payment_id: payment.id as string,
        order_id: (payment.order_id || '') as string,
        user_id: userId,
        plan_type: planType,
        section_id: sectionToUnlock || null,
        report_key: reportKey || null,
        amount: Number(payment.amount || 0),
        status: 'success',
        raw_payload: payment
      }, { onConflict: 'payment_id' });

      // Apply unlock
      if ((planType === 'section_unlock' || planType === 'full_report_unlock') && reportKey) {
        await db.from('report_unlocks').upsert({
          user_id: userId,
          report_key: reportKey,
          section_id: planType === 'full_report_unlock' ? 'full_report' : sectionToUnlock,
          payment_id: payment.id as string
        });
      } else if (planType === 'premium_monthly') {
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        await db.from('profiles').update({ plan_tier: 'premium', plan_expires_at: expiresAt }).eq('id', userId);
      }

      recovered.push(payment.id);
    }

    return res.status(200).json({ 
      success: true, 
      processed: userPayments.length, 
      recovered: recovered.length,
      message: recovered.length > 0 ? `Successfully recovered ${recovered.length} payment(s)!` : 'Your payments are already up to date.'
    });

  } catch (err: any) {
    console.error('sync-payments error:', err);
    return res.status(500).json({ error: err.message });
  }
}
