/**
 * Pricing Modal
 * Shows tier comparison and pricing.
 * Calls initiateCheckout() when Razorpay key is configured; shows "Coming Soon" otherwise.
 */

import React, { useState } from 'react';
import { X, Check, Crown, Shield, Sparkles, Lock, Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { usePremium } from '../../hooks/usePremium';
import { initiateCheckout } from '../../lib/paymentService';
import { useUserProfileStore } from '../../store/useUserProfileStore';


interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId?: string;
  sectionLabel?: string;
}

const TIERS = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    color: 'gray',
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      { text: 'Full Ashtakoot Milan (36 pts)', included: true },
      { text: 'Marriage Potential Score', included: true },
      { text: 'Psychological Profile', included: true },
      { text: 'Basic Spouse Prediction', included: true },
      { text: 'Basic Timing Windows', included: true },
      { text: '3 AI Queries / Day', included: true },
      { text: 'Divorce & Infidelity Risk Details', included: false },
      { text: 'Sexual Compatibility Deep Dive', included: false },
      { text: 'Mental Health & Addiction Analysis', included: false },
      { text: 'Remedies & Solutions', included: false },
      { text: 'Unlimited AI Chat', included: false },
    ],
    planType: null as null,
    cta: 'Current Plan',
  },
  {
    name: 'Premium',
    price: '₹399',
    period: '/month',
    color: 'amber',
    icon: <Crown className="w-6 h-6" />,
    popular: true,
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Divorce & Infidelity Risk Details', included: true },
      { text: 'Sexual Compatibility Deep Dive', included: true },
      { text: 'Mental Health & Addiction Analysis', included: true },
      { text: 'Full Remedies & Solutions', included: true },
      { text: 'Vulnerability Timeline Details', included: true },
      { text: 'Unlimited AI Chat', included: true },
      { text: 'Up to 5 Partner Profiles', included: true },
      { text: '10 Saved Reports', included: true },
      { text: 'Advanced KP Significators', included: false },
      { text: 'API Access', included: false },
    ],
    planType: 'premium_monthly' as const,
    cta: 'Get Premium',
  },
  {
    name: 'Astrologer',
    price: '₹1,499',
    period: '/month',
    color: 'purple',
    icon: <Shield className="w-6 h-6" />,
    features: [
      { text: 'Everything in Premium', included: true },
      { text: 'Unlimited Partner Profiles', included: true },
      { text: 'Advanced KP Significators', included: true },
      { text: 'D7/D60 Divisional Charts', included: true },
      { text: 'Unlimited Saved Reports', included: true },
      { text: 'Priority AI (no limits)', included: true },
      { text: 'API Access for Integrations', included: true },
      { text: 'Client Management Tools', included: true },
      { text: 'Bulk Analysis', included: true },
    ],
    planType: 'astrologer_monthly' as const,
    cta: 'Get Astrologer',
  },
];

const razorpayLive = true; // Enabled by default; the server handles mock fallbacks if keys are missing

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, sectionId, sectionLabel }) => {
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { planTier } = usePremium();
  const loadPlanFromCloud = useUserProfileStore((s) => s.loadPlanFromCloud);
  const [loadingNotify, setLoadingNotify] = useState(false);

  if (!isOpen) return null;

  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  };

  const handleTierCheckout = async (planType: 'premium_monthly' | 'astrologer_monthly', tierName: string) => {
    const session = await getSession();
    if (!session?.user) return;
    setLoadingTier(tierName);
    setPaymentError(null);
    const result = await initiateCheckout({ userId: session.user.id, planType, userEmail: session.user.email });
    
    if (result.success) {
      setLoadingTier('Fulfilling...');
      // Wait for webhook (2.5s)
      await new Promise(resolve => setTimeout(resolve, 2500));
      await loadPlanFromCloud(session.user.id, session.user.email || '');
      setLoadingTier(null);
      onClose();
    } else {
      setLoadingTier(null);
      if (result.message && !result.mock) {
        setPaymentError(result.message);
      }
    }
  };

  const handleSectionUnlock = async () => {
    const session = await getSession();
    if (!session?.user) return;
    setSectionLoading(true);
    setPaymentError(null);
    const result = await initiateCheckout({ 
      userId: session.user.id, 
      planType: 'section_unlock', 
      sectionToUnlock: sectionId || sectionLabel, 
      userEmail: session.user.email 
    });
    
    if (result.success) {
      setSectionLoading(true); // Keep spinner on
      // Wait for webhook (2.5s)
      await new Promise(resolve => setTimeout(resolve, 2500));
      await loadPlanFromCloud(session.user.id, session.user.email || '');
      setSectionLoading(false);
      onClose();
    } else {
      setSectionLoading(false);
      if (result.message && !result.mock) {
        setPaymentError(result.message);
      }
    }
  };

  const handleNotify = async (plan = 'premium') => {
    const target = email.trim();
    if (!target) return;
    setLoadingNotify(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.from('waitlist').upsert({
        email: target,
        user_id: session?.user?.id ?? null,
        plan,
        source: 'pricing_modal',
      }, { onConflict: 'email' });
      setNotified(true);
    } catch {
      setNotified(true);
    } finally {
      setLoadingNotify(false);
    }
  };

  const handleTierWaitlist = async (plan: string) => {
    const session = await getSession();
    const userEmail = session?.user?.email || '';
    setLoadingTier(plan);
    try {
      await supabase.from('waitlist').upsert({
        email: userEmail,
        user_id: session?.user?.id ?? null,
        plan,
        source: 'tier_button',
      }, { onConflict: 'email' });
    } catch { /* ignore */ } finally {
      setLoadingTier(null);
    }
    setNotified(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Unlock Full Insights</h2>
            {sectionLabel && (
              <p className="text-sm text-gray-500 mt-0.5">Upgrade to see detailed {sectionLabel.replace(/_/g, ' ')} analysis</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Error Message */}
        {paymentError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800 dark:text-red-200">{paymentError}</p>
          </div>
        )}

        {/* One-time unlock option */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-b border-amber-100 dark:border-amber-800/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
                <Lock className="w-4 h-4" /> One-Time Unlock
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
                ₹49 per section • ₹169 for full report unlock
              </p>
            </div>
            {razorpayLive ? (
              <button
                onClick={handleSectionUnlock}
                disabled={sectionLoading}
                className="flex items-center gap-2 px-4 py-1.5 bg-amber-500 text-white text-sm font-bold rounded-lg hover:bg-amber-600 disabled:opacity-70 transition-colors"
              >
                {sectionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {sectionLabel ? `Unlock ₹49` : 'Unlock Section ₹49'}
              </button>
            ) : (
              <span className="text-xs font-bold px-3 py-1.5 bg-amber-200 dark:bg-amber-800/40 text-amber-800 dark:text-amber-200 rounded-full">
                Coming Soon
              </span>
            )}
          </div>
        </div>

        {/* Tier Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => {
            const isCurrentPlan = tier.planType === null
              ? planTier === 'free'
              : planTier === (tier.planType === 'premium_monthly' ? 'premium' : 'astrologer');
            const isLoading = loadingTier === tier.name;

            return (
              <div
                key={tier.name}
                className={`relative rounded-xl border-2 p-6 transition-all ${
                  tier.popular
                    ? 'border-amber-400 dark:border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                    Most Popular
                  </span>
                )}
                <div className={`text-${tier.color}-600 dark:text-${tier.color}-400 mb-3`}>{tier.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{tier.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">{tier.price}</span>
                  <span className="text-sm text-gray-500">{tier.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {tier.features.filter(f => f.text).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {f.included ? (
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={f.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}>{f.text}</span>
                    </li>
                  ))}
                </ul>

                {tier.planType === null ? (
                  // Free tier
                  <button disabled className={`w-full py-2.5 rounded-lg font-semibold text-sm bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-default`}>
                    {isCurrentPlan ? 'Current Plan' : tier.cta}
                  </button>
                ) : isCurrentPlan ? (
                  <button disabled className="w-full py-2.5 rounded-lg font-semibold text-sm bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-default">
                    Active Plan
                  </button>
                ) : razorpayLive ? (
                  <button
                    onClick={() => handleTierCheckout(tier.planType!, tier.name)}
                    disabled={isLoading}
                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                      tier.popular
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                    }`}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {tier.cta}
                  </button>
                ) : (
                  <button
                    onClick={() => handleTierWaitlist(tier.planType!)}
                    disabled={loadingTier === tier.planType}
                    className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                      tier.popular
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200'
                    }`}
                  >
                    {loadingTier === tier.planType ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Get Early Access
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Early Access Section — shown only when payments not yet live */}
        {!razorpayLive && (
          <div className="px-6 pb-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800/30">
              {notified ? (
                <div className="text-center py-2">
                  <div className="text-2xl mb-2">🎉</div>
                  <p className="text-green-600 dark:text-green-400 font-semibold text-base">You&apos;re on the early access list!</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We&apos;ll email you the moment Premium launches — with a launch discount.</p>
                </div>
              ) : (
                <>
                  <p className="font-semibold text-indigo-800 dark:text-indigo-200 mb-1">Join the early access list</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-3">Premium launching soon. Early members get a special launch discount.</p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleNotify()}
                      placeholder="your@email.com"
                      className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                      onClick={() => handleNotify()}
                      disabled={loadingNotify}
                      className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                      {loadingNotify ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      Reserve Spot
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
