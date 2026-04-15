/**
 * Pricing Page
 * Full tier comparison with FAQ and email capture.
 * Auto-detects visitor region and shows INR or USD pricing.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Crown, Shield, Sparkles, Lock, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { AuthButton } from '../components/ui/AuthButton';
import { Logo } from '../components/ui/Logo';
import { SEOHead } from '../components/SEOHead';
import { supabase } from '../lib/supabase';
import { initiateCheckout } from '../lib/paymentService';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { detectRegion, PRICING_INR, PRICING_USD } from '../lib/regionService';
import { Loader2, AlertTriangle } from 'lucide-react';

const TIERS = [
  {
    name: 'Free',
    priceKey: null,
    staticPrice: { INR: '₹0', USD: '$0' },
    period: 'forever',
    color: 'gray',
    icon: <Sparkles className="w-7 h-7" />,
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
    cta: 'Current Plan',
    disabled: true,
  },
  {
    name: 'Per-Module Unlock',
    priceKey: 'section_unlock' as const,
    staticPrice: null,
    period: '/module',
    color: 'blue',
    icon: <Lock className="w-7 h-7" />,
    features: [
      { text: 'Unlock 4-5 related insights at once', included: true },
      { text: 'Entire Category (e.g., Risks) access', included: true },
      { text: 'Full Report — one-time bundle unlock', included: true },
      { text: 'Permanent Lifetime Access', included: true },
      { text: 'Divorce & Infidelity Risk Module', included: true },
      { text: 'Sexual & Intimacy Module', included: true },
      { text: 'Remedies & Timing Module', included: true },
    ],
    cta: 'Unlock in Report',
    disabled: true, // Only triggerable from report page lock gates
  },
  {
    name: 'Premium',
    priceKey: 'premium_monthly' as const,
    staticPrice: null,
    period: '/month',
    color: 'amber',
    icon: <Crown className="w-7 h-7" />,
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
    cta: 'Get Premium',
    disabled: false,
    planType: 'premium_monthly' as const,
  },
  {
    name: 'Astrologer',
    priceKey: 'astrologer_monthly' as const,
    staticPrice: null,
    period: '/month',
    color: 'purple',
    icon: <Shield className="w-7 h-7" />,
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
    cta: 'Coming Soon',
    disabled: true,
    planType: 'astrologer_monthly' as const,
  },
];

const FAQS = [
  {
    q: 'Is my birth data safe?',
    a: 'All astrological calculations happen client-side in your browser using Swiss Ephemeris WASM. Your birth data never leaves your device for computations. Only your profile (name, DOB) is stored in our encrypted Supabase database if you choose to save it.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'India: UPI (GPay, PhonePe), credit/debit cards, net banking, and wallets via Razorpay. International: Visa/Mastercard/Amex international cards accepted in USD. Prices are shown in your local currency automatically.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes, you can cancel your subscription at any time. Your premium access will continue until the end of your billing period. One-time module unlocks and full report bundles are permanent and never expire.',
  },
  {
    q: 'What happens to my unlocked sections if I cancel?',
    a: 'One-time module or full report unlocks are permanent. If you cancel a monthly subscription, you keep access until the period ends, then revert to the free tier. Your reports and data are never deleted.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'We offer full refunds within 24 hours of purchase if you are not satisfied. Contact us at novaventures.contact@gmail.com for any billing issues.',
  },
];

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [isInternational, setIsInternational] = useState(false);
  const loadPlanFromCloud = useUserProfileStore((s) => s.loadPlanFromCloud);

  useEffect(() => {
    detectRegion().then(({ currency: c, isInternational: intl }) => {
      setCurrency(c);
      setIsInternational(intl);
    });
  }, []);

  const pricing = currency === 'USD' ? PRICING_USD : PRICING_INR;

  const handleTierCheckout = async (planType: 'premium_monthly' | 'astrologer_monthly', tierName: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/login?redirect=/pricing');
        return;
      }

      setLoadingTier(tierName);
      setPaymentError(null);

      const result = await initiateCheckout({ 
        userId: session.user.id, 
        planType, 
        userEmail: session.user.email 
      });
      
      if (result.success) {
        setLoadingTier('Fulfilling...');
        // Wait for webhook (2.5s)
        await new Promise(resolve => setTimeout(resolve, 2500));
        await loadPlanFromCloud(session.user.id, session.user.email || '');
        setLoadingTier(null);
        navigate('/dashboard');
      } else {
        setLoadingTier(null);
        if (result.message && !result.mock) {
          setPaymentError(result.message);
        }
      }
    } catch (err: any) {
      setLoadingTier(null);
      setPaymentError(err.message || 'An unexpected error occurred during checkout.');
    }
  };

  const handleNotify = async () => {
    if (!email.trim()) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.from('waitlist').upsert({
        email: email.trim(),
        user_id: session?.user?.id ?? null,
        plan: 'premium',
        source: 'pricing_page',
      }, { onConflict: 'email' });
      setNotified(true);
    } catch {
      setNotified(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      <SEOHead
        title="Pricing - Astro Marriage Premium Plans"
        description="Simple, transparent pricing for Astro Marriage. Free core features forever. Unlock detailed risk analysis, sexual compatibility, mental health insights, and unlimited AI chat."
        path="/pricing"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQS.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-4 sm:px-6 py-3 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <Logo size="sm" />
        </div>
        <div className="flex items-center gap-2">
          <AuthButton />
          <ThemeToggle />
        </div>
      </header>

      {/* Hero */}
      <div className="text-center py-12 sm:py-16 px-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/50 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Beta Launch Offer — Get 50% Off Lifetime on Premium
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Ready to Unlock Your Relationship Clarity?
        </h1>
        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Choose a plan that fits your journey. From deep compatibility analysis to predictive marriage windows, get the answers you need today.
        </p>
      </div>

      {/* Error Message */}
      {paymentError && (
        <div className="max-w-5xl mx-auto px-4 mb-8">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800 dark:text-red-200 font-medium">{paymentError}</p>
          </div>
        </div>
      )}

      {/* International pricing notice */}
      {isInternational && (
        <div className="max-w-5xl mx-auto px-4 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-xl px-4 py-3 flex items-center gap-3 text-sm">
            <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="text-blue-700 dark:text-blue-300">
              Showing <strong>USD pricing</strong> for international visitors. All features identical — pay in your local currency via card or PayPal.
            </span>
          </div>
        </div>
      )}

      {/* One-time unlock banner */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl p-5 border border-amber-200 dark:border-amber-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <Lock className="w-4 h-4" /> One-Time Section Unlock
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
              {pricing.section_unlock.display.replace('/mo', '')} per entire module or {pricing.full_report_unlock.display.replace('/mo', '')} for the full report — permanent access, no subscription needed
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 bg-amber-200 dark:bg-amber-800/40 text-amber-800 dark:text-amber-200 rounded-full">
            Available Now
          </span>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-2xl border-2 p-6 bg-white dark:bg-gray-900 transition-all ${
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
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{tier.name}</h3>
            <div className="mt-2 mb-5">
              <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                {tier.staticPrice
                  ? tier.staticPrice[currency]
                  : tier.priceKey
                    ? pricing[tier.priceKey].display.replace('/mo', '')
                    : '—'}
              </span>
              <span className="text-sm text-gray-500">{tier.period}</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {tier.features.map((f, i) => (
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
            <button
              disabled={tier.disabled || (loadingTier !== null)}
              onClick={tier.planType ? () => handleTierCheckout(tier.planType as any, tier.name) : undefined}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                tier.popular
                  ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20 border-b-4 border-amber-700 active:border-b-0 active:translate-y-1'
                  : tier.color === 'purple'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 disabled:opacity-60 cursor-not-allowed'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-60'
              }`}
            >
              {loadingTier === tier.name ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Waitlist / Notify Me — prominent section */}
      <div id="waitlist-form" className="max-w-2xl mx-auto px-4 mb-16 scroll-mt-20">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl p-6 sm:p-8 border border-indigo-100 dark:border-indigo-800/30 text-center">
          {notified ? (
            <div>
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-green-600 dark:text-green-400 font-bold text-lg">You&apos;re on the list!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We&apos;ll email you when Premium launches with your 50% founding-member discount.</p>
            </div>
          ) : (
            <>
              <Crown className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <p className="font-bold text-indigo-800 dark:text-indigo-200 text-lg mb-1">Join the Premium Waitlist</p>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-5">Be first to know when Premium launches — founding members get 50% off forever.</p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNotify()}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  onClick={handleNotify}
                  className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
                >
                  Count Me In
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">No spam. Unsubscribe anytime. Your email is encrypted.</p>
            </>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <PricingFAQ key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PricingFAQ: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 pr-4">{question}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <p className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{answer}</p>
      )}
    </div>
  );
};

export default PricingPage;
