import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
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

  const { 
    razorpay_payment_id, 
    razorpay_order_id, 
    razorpay_subscription_id,
    razorpay_signature,
    // Metadata passed from client for synchronous fulfillment
    userId,
    planType,
    sectionToUnlock,
    reportKey,
    amount,
    currency
  } = req.body || {};

  // A subscription checkout returns a subscription id in place of an order id.
  const isSubscription = Boolean(razorpay_subscription_id);

  if (!razorpay_payment_id || !razorpay_signature || (!razorpay_order_id && !isSubscription)) {
    return res.status(400).json({ error: 'Missing payment fields', valid: false });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return res.status(200).json({ valid: true, mock: true });
  }

  // 1. Verify Signature
  //
  // The two flows hash DIFFERENT strings, and the operand order is reversed
  // between them. An order signs `order_id|payment_id`; a subscription signs
  // `payment_id|subscription_id`. Using the order form on a subscription
  // produces a mismatch on every renewal, so this must branch.
  const body = isSubscription
    ? `${razorpay_payment_id}|${razorpay_subscription_id}`
    : `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  const valid = expected.length === String(razorpay_signature).length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(razorpay_signature)));

  if (!valid) {
    console.warn('verify-payment: signature mismatch', {
      razorpay_order_id, razorpay_subscription_id, razorpay_payment_id,
    });
    return res.status(401).json({ error: 'Invalid signature', valid: false });
  }

  // 2. Synchronous Fulfillment (Immediate UI satisfaction)
  // This provides a first-pass unlock while the webhook serves as the background source of truth.
  if (userId && planType) {
    try {
      const db = getServiceClient();
      
      // Record in history
      await db.from('payment_history').upsert({
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id || null,
        subscription_id: razorpay_subscription_id || null,
        user_id: userId,
        plan_type: planType,
        section_id: sectionToUnlock || null,
        report_key: reportKey || null,
        amount: amount || 0,
        // Without this the row is indistinguishable from a rupee sale of the
        // same integer, and every revenue total silently mixes the two.
        currency: currency === 'USD' ? 'USD' : 'INR',
        status: 'success',
        // raw_payload is deliberately ABSENT. It belongs to the webhook, which
        // stores the full Razorpay entity. Both endpoints upsert this same row,
        // so writing raw_payload here overwrote that entity whenever this
        // landed second — which is most of the time. PostgREST's upsert only
        // updates the columns present in the payload, so omitting it preserves
        // whatever the webhook wrote.
        verified_at: new Date().toISOString(),
      }, { onConflict: 'payment_id' });

      // Apply unlock(s)
      //
      // SAFETY NET: a paid unlock must never be silently dropped. This block
      // used to require `reportKey`, so any page that did not pass one (the
      // self-report did not) charged the customer and wrote nothing to
      // report_unlocks — money in, nothing delivered, and the webhook had the
      // same guard so there was no recovery. When no reportKey is available the
      // unlock is now granted GLOBALLY on profiles.unlocked_sections, which
      // usePremium.isSectionUnlocked already honours. Over-delivering slightly
      // is strictly better than taking money for nothing.
      if ((planType === 'section_unlock' || planType === 'full_report_unlock') && reportKey) {
        const sectionsToApply = [];
        const sid = planType === 'full_report_unlock' ? 'full_report' : sectionToUnlock;
        
        if (sid === 'sexual_detail' || sid === 'chemistry' || (sid && sid.toLowerCase().includes('chemistry'))) {
          sectionsToApply.push('sexual_detail');
        } else if (sid === 'full_compat_report' || sid === 'partner' || (sid && sid.toLowerCase().includes('personality'))) {
          sectionsToApply.push('full_compat_report', 'divisional_advanced');
        } else if (sid === 'divorce_risk' || sid === 'risks' || (sid && sid.toLowerCase().includes('risk'))) {
          sectionsToApply.push('divorce_risk', 'addiction_risk', 'mental_health', 'vulnerability_timeline');
        } else if (sid === 'remedies' || sid === 'timing' || (sid && sid.toLowerCase().includes('timing'))) {
          sectionsToApply.push('remedies', 'kp_detail');
        } else if (sid === 'full_report') {
          sectionsToApply.push('full_report');
        } else if (sid) {
          sectionsToApply.push(sid);
        }

        for (const targetSid of sectionsToApply) {
          await db.from('report_unlocks').upsert({
            user_id: userId,
            report_key: reportKey,
            section_id: targetSid,
            payment_id: razorpay_payment_id
          }, { onConflict: 'user_id,report_key,section_id' });
        }
      } else if (planType === 'section_unlock' || planType === 'full_report_unlock') {
        // No reportKey (e.g. the self-report, which is not a pairing): grant globally.
        const sid = planType === 'full_report_unlock' ? 'full_report' : sectionToUnlock;
        if (sid) {
          const { data: profile } = await db.from('profiles')
            .select('unlocked_sections').eq('id', userId).single();
          const existing: string[] = Array.isArray(profile?.unlocked_sections)
            ? profile!.unlocked_sections : [];
          if (!existing.includes(sid)) {
            await db.from('profiles')
              .update({ unlocked_sections: [...existing, sid] })
              .eq('id', userId);
          }
          console.log(`verify-payment: granted GLOBAL unlock "${sid}" to ${userId} (no reportKey supplied)`);
        }
      } else if (planType === 'premium_monthly' || planType === 'astrologer_monthly') {
        // 30 days covers this cycle. A recurring subscription re-extends it on
        // every subscription.charged webhook; a one-time purchase simply lapses,
        // which is why the non-recurring copy must not promise renewal.
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        const tier = planType === 'premium_monthly' ? 'premium' : 'astrologer';
        await db.from('profiles').update({
          plan_tier: tier,
          plan_expires_at: expiresAt,
          // NULL status marks a one-time purchase with no mandate behind it.
          razorpay_subscription_id: razorpay_subscription_id || null,
          subscription_status: isSubscription ? 'active' : null,
        }).eq('id', userId);
      }

      console.log(`verify-payment: synchronous fulfillment success for ${userId} (${planType})`);
    } catch (dbErr) {
      console.error('verify-payment: database fulfillment error', dbErr);
      // We don't fail the response because signature is valid — webhook will retry fulfillment
    }
  }

  return res.status(200).json({ valid: true });
}
