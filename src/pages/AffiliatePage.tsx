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
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', bureauName: '', upiId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const [stats, setStats] = useState<{
    total_clicks: number;
    total_referrals: number;
    total_conversions: number;
    pending_payout_inr: number;
    total_earned_inr: number;
  }>({ total_clicks: 0, total_referrals: 0, total_conversions: 0, pending_payout_inr: 0, total_earned_inr: 0 });
  const [conversions, setConversions] = useState<{ id: string; payment_id: string; plan_type: string; commission_inr: number; created_at: string }[]>([]);
  const [convsLoading, setConvsLoading] = useState(false);
  const [upiId, setUpiId] = useState<string>('');
  const [upiEdit, setUpiEdit] = useState(false);
  const [upiSaving, setUpiSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, email: user.email ?? '' }));
      supabase
        .from('affiliates')
        .select('affiliate_code, total_clicks, total_referrals, total_conversions, pending_payout_inr, upi_id')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.affiliate_code) {
            setAffiliateCode(data.affiliate_code);
            setUpiId(data.upi_id ?? '');
            // Load itemized conversion log first to compute accurate total_earned
            setConvsLoading(true);
            supabase
              .from('affiliate_conversions')
              .select('id, payment_id, plan_type, commission_inr, created_at')
              .eq('affiliate_code', data.affiliate_code)
              .order('created_at', { ascending: false })
              .then(({ data: convData }) => {
                const rows = convData ?? [];
                setConversions(rows);
                setConvsLoading(false);
                setStats({
                  total_clicks: data.total_clicks ?? 0,
                  total_referrals: data.total_referrals ?? 0,
                  total_conversions: data.total_conversions ?? 0,
                  pending_payout_inr: data.pending_payout_inr ?? 0,
                  total_earned_inr: rows.reduce((s, c) => s + c.commission_inr, 0),
                });
              });
          }
        });
    }
  }, [user]);

  const referralLink = affiliateCode ? `${SITE_URL}/?ref=${affiliateCode}` : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/affiliate-track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          action: 'register',
          name: form.name.trim(),
          email: form.email.trim(),
          whatsapp: form.whatsapp.trim(),
          bureauName: form.bureauName.trim(),
          upiId: form.upiId.trim(),
          userId: user.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setAffiliateCode(data.affiliate_code);
      setUpiId(form.upiId.trim());
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const saveUpi = async (newUpi: string) => {
    if (!user || !affiliateCode) return;
    setUpiSaving(true);
    await supabase.from('affiliates')
      .update({ upi_id: newUpi.trim() || null })
      .eq('affiliate_code', affiliateCode)
      .eq('user_id', user.id);
    setUpiId(newUpi.trim());
    setUpiEdit(false);
    setUpiSaving(false);
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
                {/* Funnel stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total_clicks}</div>
                    <div className="text-xs text-gray-500 mt-1">Link Clicks</div>
                    <div className="text-xs text-gray-400 mt-0.5">visited your link</div>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.total_referrals}</div>
                    <div className="text-xs text-gray-500 mt-1">Signups</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {stats.total_clicks > 0
                        ? `${Math.round((stats.total_referrals / stats.total_clicks) * 100)}% of clicks`
                        : 'created accounts'}
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.total_conversions}</div>
                    <div className="text-xs text-gray-500 mt-1">Paid</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {stats.total_referrals > 0
                        ? `${Math.round((stats.total_conversions / stats.total_referrals) * 100)}% of signups`
                        : 'made a purchase'}
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">₹{stats.total_earned_inr}</div>
                    <div className="text-xs text-gray-500 mt-1">Total Earned</div>
                    <div className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 font-medium">
                      ₹{stats.pending_payout_inr} pending
                    </div>
                  </div>
                </div>

                {/* Itemized conversion log */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-green-500" />
                    Conversion History
                    <span className="text-xs text-gray-400 font-normal">(each payment credited to you)</span>
                  </h3>
                  {convsLoading ? (
                    <p className="text-xs text-gray-400 py-3 text-center">Loading…</p>
                  ) : conversions.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-6 text-center">
                      <p className="text-sm text-gray-500">No conversions yet.</p>
                      <p className="text-xs text-gray-400 mt-1">Share your link — when someone pays via your link, it appears here.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment ID</th>
                            <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">You Earned</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                          {conversions.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400 text-xs">
                                {new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300 capitalize">
                                {c.plan_type.replace(/_/g, ' ')}
                              </td>
                              <td className="px-4 py-2.5 font-mono text-xs text-gray-400">{c.payment_id}</td>
                              <td className="px-4 py-2.5 text-right font-semibold text-green-600">₹{c.commission_inr}</td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50 dark:bg-gray-800 font-semibold">
                            <td colSpan={3} className="px-4 py-2.5 text-gray-700 dark:text-gray-300">Total earned</td>
                            <td className="px-4 py-2.5 text-right text-green-700 dark:text-green-400">
                              ₹{conversions.reduce((s, c) => s + c.commission_inr, 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* UPI payout ID */}
                <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 mb-5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Payout UPI ID</span>
                    </div>
                    {!upiEdit && (
                      <button onClick={() => setUpiEdit(true)} className="text-xs text-indigo-500 hover:underline">
                        {upiId ? 'Edit' : 'Add'}
                      </button>
                    )}
                  </div>
                  {upiEdit ? (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        defaultValue={upiId}
                        id="upi-input"
                        placeholder="name@upi or 9876543210@paytm"
                        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1.5 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button
                        onClick={() => {
                          const val = (document.getElementById('upi-input') as HTMLInputElement)?.value ?? '';
                          saveUpi(val);
                        }}
                        disabled={upiSaving}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg"
                      >
                        {upiSaving ? '…' : 'Save'}
                      </button>
                      <button onClick={() => setUpiEdit(false)} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700">
                        Cancel
                      </button>
                    </div>
                  ) : upiId ? (
                    <p className="text-sm font-mono text-gray-600 dark:text-gray-300 mt-1">{upiId}</p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">Add your UPI ID so we can pay you instantly when your commission is ready.</p>
                  )}
                </div>

                <p className="text-xs text-gray-400 text-center mb-5">
                  Share this link on WhatsApp with clients. Payouts processed monthly via UPI.
                </p>

                {/* Claim missed earning */}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-amber-500" />
                    Missing a conversion?
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    If a client paid via your link but it's not showing above, send us the Razorpay payment ID and we'll verify and credit your commission within 24 hours.
                  </p>
                  <a
                    href={`mailto:novaventures.contact@gmail.com?subject=Affiliate%20Missed%20Earning%20Claim&body=Affiliate%20Code%3A%20${affiliateCode}%0APayment%20ID%3A%20pay_XXXXXXXXXX%0A%0APlease%20verify%20and%20credit%20my%20commission.`}
                    className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <ArrowRight className="w-3 h-3" /> Email claim to support
                  </a>
                </div>
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
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      UPI ID <span className="text-gray-400 font-normal">(for receiving payouts)</span>
                    </label>
                    <input
                      type="text"
                      value={form.upiId}
                      onChange={(e) => setForm((f) => ({ ...f, upiId: e.target.value }))}
                      placeholder="yourname@upi or 9876543210@paytm"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">Optional — you can add it later. We pay monthly via UPI directly.</p>
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
