
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const rzpKeyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Simple auth check via query param for safety
  if (req.query.secret !== process.env.RAZORPAY_WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!supabaseUrl || !supabaseServiceKey || !rzpKeyId || !rzpKeySecret) {
    return res.status(500).json({ error: 'Missing config' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const razorpay = new Razorpay({ key_id: rzpKeyId, key_secret: rzpKeySecret });

  try {
    // 1. Fetch recent captured payments (last 20)
    const paymentsResponse = await razorpay.payments.all({ count: 20 });
    const payments = paymentsResponse.items.filter(p => p.status === 'captured');

    const results = [];

    for (const payment of payments) {
      let userId = payment.notes?.userId;
      let planType = payment.notes?.planType;
      let sectionToUnlock = payment.notes?.sectionToUnlock;

      // Fallback to order if notes missing on payment
      if ((!userId || !planType) && payment.order_id) {
        try {
          const order = await razorpay.orders.fetch(payment.order_id);
          userId = userId || order.notes?.userId;
          planType = planType || order.notes?.planType;
          sectionToUnlock = sectionToUnlock || order.notes?.sectionToUnlock;
        } catch (e) {
            console.error('Failed order fetch for', payment.id);
        }
      }

      if (!userId || !planType) {
        results.push({ id: payment.id, status: 'unidentified', email: payment.email });
        continue;
      }

      // 2. Check if already in history
      const { data: existing } = await supabase
        .from('payment_history')
        .select('*')
        .eq('payment_id', payment.id)
        .single();

      if (existing && existing.status === 'success') {
        results.push({ id: payment.id, status: 'already_fulfilled', userId });
        continue;
      }

      // 3. Fulfill the payment
      console.log('Recovering payment:', payment.id, 'for user:', userId);
      
      // Update profile
      if (planType === 'full_report_unlock' || planType === 'premium_monthly') {
          await supabase.from('profiles').update({
              plan_tier: planType === 'premium_monthly' ? 'premium' : 'full_report',
              plan_expires_at: planType === 'premium_monthly' 
                ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                : null
          }).eq('id', userId);
      } else if (planType === 'section_unlock' && sectionToUnlock) {
          // Get current sections
          const { data: profile } = await supabase.from('profiles').select('unlocked_sections').eq('id', userId).single();
          const currentSections = profile?.unlocked_sections || [];
          if (!currentSections.includes(sectionToUnlock)) {
              await supabase.from('profiles').update({
                  unlocked_sections: [...currentSections, sectionToUnlock]
              }).eq('id', userId);
          }
      }

      // Log to history
      await supabase.from('payment_history').upsert({
        payment_id: payment.id,
        order_id: payment.order_id,
        user_id: userId,
        plan_type: planType,
        section_id: sectionToUnlock,
        amount: payment.amount,
        status: 'success',
        raw_payload: payment
      }, { onConflict: 'payment_id' });

      results.push({ id: payment.id, status: 'recovered', userId, planType });
    }

    return res.status(200).json({ success: true, processed: payments.length, results });
  } catch (error: any) {
    console.error('Recovery error:', error);
    return res.status(500).json({ error: error.message });
  }
}
