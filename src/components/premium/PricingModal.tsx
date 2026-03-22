/**
 * Pricing Modal
 * Shows tier comparison and pricing. Currently "Coming Soon" for payments.
 */

import React, { useState } from 'react';
import { X, Check, Crown, Shield, Sparkles, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightSection?: string;
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
      { text: 'PDF Export', included: false },
    ],
    cta: 'Current Plan',
    disabled: true,
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
      { text: 'PDF Export', included: true },
      { text: '10 Saved Reports', included: true },
      { text: 'Advanced KP Significators', included: false },
      { text: 'API Access', included: false },
    ],
    cta: 'Coming Soon',
    disabled: true,
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
      { text: 'Branded PDF Reports', included: true },
      { text: 'Priority AI (no limits)', included: true },
      { text: 'API Access for Integrations', included: true },
      { text: 'Client Management Tools', included: true },
      { text: 'Bulk Analysis', included: true },
      { text: '', included: true },
      { text: '', included: true },
    ],
    cta: 'Contact Us',
    disabled: true,
  },
];

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, highlightSection }) => {
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);

  if (!isOpen) return null;

  const handleNotify = async () => {
    if (!email.trim()) return;
    try {
      // Save to a simple field on the user's profile or log it
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Could store in a notifications preferences column — for now just log
        console.log('Premium interest from:', session.user.email, 'notify email:', email);
      }
      setNotified(true);
    } catch {
      setNotified(true);
    }
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
            {highlightSection && (
              <p className="text-sm text-gray-500 mt-0.5">Upgrade to see detailed {highlightSection.replace(/_/g, ' ')} analysis</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

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
            <span className="text-xs font-bold px-3 py-1.5 bg-amber-200 dark:bg-amber-800/40 text-amber-800 dark:text-amber-200 rounded-full">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Tier Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
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
              <button
                disabled={tier.disabled}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  tier.popular
                    ? 'bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60'
                    : tier.color === 'purple'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 disabled:opacity-60'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 disabled:opacity-60'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Notify Me Section */}
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800/30">
            {notified ? (
              <div className="text-center">
                <p className="text-green-600 dark:text-green-400 font-semibold">We&apos;ll notify you when premium launches!</p>
              </div>
            ) : (
              <>
                <p className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Get notified when Premium launches</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 rounded-lg text-sm text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    onClick={handleNotify}
                    className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Notify Me
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
