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

  const rzpKeyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!rzpKeyId || !rzpKeySecret) {
    return res.status(500).json({ error: 'Razorpay keys not configured' });
  }

  const razorpay = new Razorpay({ key_id: rzpKeyId, key_secret: rzpKeySecret });
  const db = getServiceClient();

  try {
    // 1. Fetch recent captured payments (last 50 for depth)
    const paymentsResponse = await razorpay.payments.all({ count: 50 });
    
    // 2. Filter by user email OR userId in notes
    // We also search by base email to catch mismatched personal emails
    const userPayments = paymentsResponse.items.filter(p => 
      p.status === 'captured' && 
      (p.email?.toLowerCase() === userEmail.toLowerCase() || p.notes?.userId === userId)
    );

    if (userPayments.length === 0) {
      return res.status(200).json({ success: true, recovered: 0, message: 'No missing payments found for this account.' });
    }

    const recovered = [];
    const errors = [];

    for (const payment of userPayments) {
      let planType = (payment.notes?.planType as string) || (payment.amount === 4900 ? 'section_unlock' : 'full_report_unlock');
      let sectionToUnlock = payment.notes?.sectionToUnlock as string;
      let reportKey = payment.notes?.reportKey as string;

      // --- SMART RECOVERY (Fuzzy Fulfillment) ---
      // If metadata is missing but it's a ₹49 payment, we assume it's for their most recent partner
      if (payment.amount === 4900 && !reportKey) {
        console.log(`sync-payments: Fuzzy recovery for ${payment.id}`);
        const { data: partners } = await db
          .from('partners')
          .select('id')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(1);
        
        reportKey = (partners && partners.length > 0) ? partners[0].id : 'self';
        planType = 'section_unlock';

        // Try to guess section from description
        const desc = (payment.description || '').toLowerCase();
        if (desc.includes('chemistry') || desc.includes('intimacy')) {
          sectionToUnlock = 'sexual_detail';
        } else if (desc.includes('personality') || desc.includes('character')) {
          sectionToUnlock = 'full_compat_report';
        } else if (desc.includes('risk') || desc.includes('radar')) {
          sectionToUnlock = 'divorce_risk';
        } else if (desc.includes('timing') || desc.includes('remedy')) {
          sectionToUnlock = 'remedies';
        } else {
          // Default to chemistry if we can't tell (most common)
          sectionToUnlock = 'sexual_detail';
        }
      }

      // If amount is 169 (16900), it's a full report unlock
      if (payment.amount === 16900 && !sectionToUnlock) {
        planType = 'full_report_unlock';
        sectionToUnlock = 'full_report';
      }

      // 3. Check if already acknowledged in history
      const { data: existing } = await db
        .from('payment_history')
        .select('payment_id')
        .eq('payment_id', payment.id)
        .maybeSingle();

      if (existing) continue;

      // 4. Record in history (Safely handling potential schema lag)
      const historyData: any = {
        payment_id: payment.id as string,
        order_id: (payment.order_id || '') as string,
        user_id: userId,
        plan_type: planType,
        section_id: sectionToUnlock || null,
        amount: Number(payment.amount || 0),
        status: 'success',
        raw_payload: payment
      };
      
      // Only add report_key if column exists (fuzzy check or we just assume it exists now)
      historyData.report_key = reportKey || null;

      const { error: historyErr } = await db.from('payment_history').upsert(historyData);
      if (historyErr) {
        console.error(`sync-payments: History upsert error for ${payment.id}:`, historyErr);
        // If it's a column error, try without the column for now to at least track the money
        if (historyErr.message.includes('report_key')) {
          delete historyData.report_key;
          await db.from('payment_history').upsert(historyData);
        }
      }

      // 5. Apply unlock(s)
      if (reportKey) {
        const sectionsToApply = [];
        const sid = sectionToUnlock;
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

        for (const sid of sectionsToApply) {
          const { error: unlockErr } = await db.from('report_unlocks').upsert({
            user_id: userId,
            report_key: reportKey,
            section_id: sid,
            payment_id: payment.id as string
          });
          if (unlockErr) {
            console.error(`sync-payments: Unlock error for ${sid} in ${payment.id}:`, unlockErr);
            errors.push(`Unlock failed for ${sid} (${payment.id})`);
          }
        }
      } else if (planType === 'premium' || planType === 'premium_monthly') {
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        await db.from('profiles').update({ plan_tier: 'premium', plan_expires_at: expiresAt }).eq('id', userId);
      }

      recovered.push(payment.id);
    }

    return res.status(200).json({ 
      success: true, 
      recovered: recovered.length,
      errors: errors.length > 0 ? errors : undefined,
      message: recovered.length > 0 
        ? `Successfully recovered ${recovered.length} payment(s)! Your content is now unlocked.` 
        : 'Your payments are already up to date.'
    });

  } catch (err: any) {
    console.error('sync-payments error:', err);
    return res.status(500).json({ error: err.message });
  }
}
