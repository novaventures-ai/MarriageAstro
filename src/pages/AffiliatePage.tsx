/**
 * AffiliatePage — Marriage Bureau Affiliate Program
 *
 * Earn ₹100 per premium signup you refer.
 * Target audience: marriage bureau operators, wedding planners, pandits.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, Users, Link2, Copy, Check, Star, ArrowRight, LogIn } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { AuthButton } from '../components/ui/AuthButton';
import { Logo } from '../components/ui/Logo';

const SITE_URL = 'https://marriage-astro.vercel.app';

const steps = [
  {
    icon: '📝',
    title: 'Sign up free',
    desc: 'Create your affiliate account in 30 seconds — no fees, no KYC required.',
  },
  {
    icon: '🔗',
    title: 'Share your link',
    desc: 'Get a unique referral link. Share it in your WhatsApp groups, website, or with every client you meet.',
  },
  {
    icon: '💰',
    title: 'Earn ₹100 per conversion',
    desc: 'When anyone upgrades to Premium via your link, ₹100 is credited to you. No cap.',
  },
];

const benefits = [
  'No investment required — 100% free to join',
  'Instant unique referral link after signup',
  '₹100 per Premium conversion (₹399/month plan)',
  '₹200 per Annual plan conversion (₹999/year)',
  'Monthly payout via UPI / bank transfer',
  'Real-time dashboard showing clicks + conversions',
  'No limit on earnings — more referrals = more income',
];

export function AffiliatePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', bureauName: '' });
  const [submitting, setSubmitting] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, email: user.email ?? '' }));
      // Check if already registered
      fetch(`/api/affiliate-track?userId=${user.id}`)
        .then((r) => r.json())
        .then((d) => { if (d.affiliate_code) setAffiliateCode(d.affiliate_code); })
        .catch(() => {});
    }
  }, [user]);

  const referralLink = affiliateCode ? `${SITE_URL}/?ref=${affiliateCode}` : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError('');
    try {
      await supabase.auth.getSession();
      // Generate a simple affiliate code
      const code = `AFF-${form.name.toUpperCase().replace(/\s+/g, '').slice(0, 6)}-${Date.now().toString(36).toUpperCase()}`;
      const { error: dbErr } = await supabase.from('affiliates').upsert({
        user_id: user?.id ?? null,
        name: form.name,
        email: form.email,
        whatsapp: form.whatsapp ?? null,
        bureau_name: form.bureauName ?? null,
        affiliate_code: code,
        status: 'pending',
        created_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      if (dbErr) throw dbErr;
      setAffiliateCode(code);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = async () => {
    if (!referralLink) return;
    try { await navigator.clipboard.writeText(referralLink); } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <SEOHead
        title="Affiliate Program — Earn with AstroMarriage | Marriage Bureau Partners"
        description="Earn ₹100 per premium referral. Join the AstroMarriage affiliate program for marriage bureaus, wedding planners, and astrologers. Free to join."
      />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
          <Link to="/"><Logo /></Link>
          <AuthButton />
        </nav>

        <main className="max-w-4xl mx-auto px-4 py-12">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <IndianRupee className="w-4 h-4" />
              Affiliate Program
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Earn ₹100 for every<br />
              <span className="text-indigo-600 dark:text-indigo-400">premium referral</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Perfect for marriage bureau operators, wedding planners, and astrologers.
              Share your link — we pay you every time someone upgrades.
            </p>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {steps.map((s) => (
              <div key={s.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Earnings example */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-16 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Your earning potential</h2>
            <p className="text-indigo-200 mb-6">Refer just 10 clients a month — see what you earn:</p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Referrals / month', val: '10' },
                { label: 'Conversion rate', val: '30%' },
                { label: 'Monthly earnings', val: '₹300+' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-bold">{s.val}</div>
                  <div className="text-sm text-indigo-200 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-indigo-300 mt-4">50 referrals/month = ₹1,500+. No cap, no expiry.</p>
          </div>

          {/* Benefits */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">What you get</h2>
            </div>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Signup / Dashboard */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            {!user ? (
              <div className="text-center py-8">
                <LogIn className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sign in to get your link</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Your referral link is tied to your account.</p>
                <AuthButton />
              </div>
            ) : affiliateCode ? (
              /* Already registered — show link + stats */
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-indigo-500" />
                  Your referral link
                </h2>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 mb-6">
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 font-mono truncate">{referralLink}</span>
                  <button
                    onClick={copyLink}
                    className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">—</div>
                    <div className="text-xs text-gray-500 mt-1">Referrals</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">₹0</div>
                    <div className="text-xs text-gray-500 mt-1">Pending payout</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Share this link on WhatsApp with clients. Payouts processed monthly via UPI.
                </p>
              </div>
            ) : (
              /* Registration form */
              <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  Create your affiliate account
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your name *</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Ramesh Sharma"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">WhatsApp number</label>
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marriage bureau / business name</label>
                    <input
                      type="text"
                      value={form.bureauName}
                      onChange={(e) => setForm((f) => ({ ...f, bureauName: e.target.value }))}
                      placeholder="Sharma Vivah Kendra"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  {submitting ? 'Creating account…' : (
                    <>Get my referral link <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  Free to join. No commission deducted. Paid monthly via UPI.
                </p>
              </form>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
