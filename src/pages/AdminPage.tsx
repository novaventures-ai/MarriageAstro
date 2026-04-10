/**
 * Admin Page
 * Tabbed admin panel: Users | Push Notifications | Affiliates
 * Protected: redirects non-admins to home.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Crown, UserX, Search, ArrowLeft, RefreshCw,
  Bell, Users, IndianRupee, Send, CheckCircle, CreditCard,
} from 'lucide-react';
import { usePremium } from '../hooks/usePremium';
import {
  listAllUsers, grantPremium, revokePremium, UserRecord,
  getPushStats, sendPushBroadcast,
  listAffiliates, markAffiliatePaid, disableAffiliate, AffiliateRecord,
  listAllPayments, PaymentRecord,
} from '../lib/adminService';
import { PlanTier } from '../types';

type Tab = 'users' | 'payments' | 'push' | 'affiliates';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'users',      label: 'Users',              icon: <Users className="w-4 h-4" /> },
  { id: 'payments',   label: 'Payments',           icon: <CreditCard className="w-4 h-4" /> },
  { id: 'push',       label: 'Push Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'affiliates', label: 'Affiliates',          icon: <IndianRupee className="w-4 h-4" /> },
];

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = usePremium();
  const [tab, setTab] = useState<Tab>('users');

  // ─── Users tab state ─────────────────────────────────────────────────────
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ─── Push tab state ──────────────────────────────────────────────────────
  const [pushCount, setPushCount] = useState<number | null>(null);
  const [pushForm, setPushForm] = useState({ title: '', body: '', url: 'https://marriage-astro.vercel.app', targetTier: 'all' });
  const [pushSending, setPushSending] = useState(false);
  const [pushResult, setPushResult] = useState<{ sent: number; failed: number } | null>(null);

  // ─── Payments tab state ──────────────────────────────────────────────────
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsLoaded, setPaymentsLoaded] = useState(false);

  // ─── Affiliates tab state ────────────────────────────────────────────────
  const [affiliates, setAffiliates] = useState<AffiliateRecord[]>([]);
  const [affiliatesLoading, setAffiliatesLoading] = useState(false);
  const [affiliatesLoaded, setAffiliatesLoaded] = useState(false);
  const [affActionLoading, setAffActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    fetchUsers();
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (tab === 'payments' && !paymentsLoaded) fetchPayments();
    if (tab === 'push' && pushCount === null) fetchPushStats();
    if (tab === 'affiliates' && !affiliatesLoaded) fetchAffiliates();
  }, [tab]);

  // ─── Users ───────────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsers(await listAllUsers());
    setUsersLoading(false);
  };

  const handleGrant = async (userId: string, tier: PlanTier) => {
    setActionLoading(userId);
    const expiresAt = tier === 'premium'
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : null;
    if (await grantPremium(userId, tier, expiresAt)) await fetchUsers();
    setActionLoading(null);
  };

  const handleRevoke = async (userId: string) => {
    setActionLoading(userId);
    if (await revokePremium(userId)) await fetchUsers();
    setActionLoading(null);
  };

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name || '').toLowerCase().includes(search.toLowerCase())
  );

  // ─── Payments ─────────────────────────────────────────────────────────────
  const fetchPayments = async () => {
    setPaymentsLoading(true);
    setPayments(await listAllPayments());
    setPaymentsLoading(false);
    setPaymentsLoaded(true);
  };

  // ─── Push ─────────────────────────────────────────────────────────────────
  const fetchPushStats = async () => {
    const { count } = await getPushStats();
    setPushCount(count);
  };

  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setPushSending(true);
    setPushResult(null);
    const result = await sendPushBroadcast(
      pushForm.title, pushForm.body, pushForm.url, pushForm.targetTier
    );
    setPushResult(result);
    setPushSending(false);
  };

  // ─── Affiliates ───────────────────────────────────────────────────────────
  const fetchAffiliates = async () => {
    setAffiliatesLoading(true);
    setAffiliates(await listAffiliates());
    setAffiliatesLoading(false);
    setAffiliatesLoaded(true);
  };

  const handleMarkPaid = async (id: string) => {
    setAffActionLoading(id);
    if (await markAffiliatePaid(id)) await fetchAffiliates();
    setAffActionLoading(null);
  };

  const handleDisable = async (id: string) => {
    setAffActionLoading(id);
    if (await disableAffiliate(id)) await fetchAffiliates();
    setAffActionLoading(null);
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const tierBadge = (tier: PlanTier) => {
    switch (tier) {
      case 'astrologer':
        return <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full">Astrologer</span>;
      case 'premium':
        return <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full">Premium</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-full">Free</span>;
    }
  };

  const payoutBadge = (status: string) => {
    switch (status) {
      case 'paid':     return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Paid</span>;
      case 'disabled': return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">Disabled</span>;
      default:         return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Pending</span>;
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <Shield className="w-6 h-6 text-purple-600" />
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Admin Panel</h1>
          </div>
          {tab === 'users' && (
            <button onClick={fetchUsers} disabled={usersLoading} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${usersLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
          {tab === 'payments' && (
            <button onClick={fetchPayments} disabled={paymentsLoading} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${paymentsLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
          {tab === 'affiliates' && (
            <button onClick={fetchAffiliates} disabled={affiliatesLoading} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${affiliatesLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 w-fit">
          {TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                tab === id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {icon}{label}
            </button>
          ))}
        </div>

        {/* ── USERS TAB ──────────────────────────────────────────────────────── */}
        {tab === 'users' && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Total Users</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{users.length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Premium</p>
                <p className="text-2xl font-bold text-amber-600">{users.filter(u => u.plan_tier === 'premium').length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Astrologer</p>
                <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.plan_tier === 'astrologer').length}</p>
              </div>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email or name..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
              />
            </div>

            {usersLoading ? (
              <div className="text-center py-12 text-gray-500">Loading users...</div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Expires</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                      {filtered.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{user.full_name || 'No name'}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">{tierBadge(user.plan_tier)}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-500">
                              {user.plan_expires_at
                                ? new Date(user.plan_expires_at).toLocaleDateString()
                                : user.plan_tier !== 'free' ? 'Never' : '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {actionLoading === user.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                              ) : (
                                <>
                                  {user.plan_tier !== 'premium' && (
                                    <button
                                      onClick={() => handleGrant(user.id, 'premium')}
                                      className="px-2.5 py-1 text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors flex items-center gap-1"
                                    >
                                      <Crown className="w-3 h-3" /> Premium
                                    </button>
                                  )}
                                  {user.plan_tier !== 'astrologer' && (
                                    <button
                                      onClick={() => handleGrant(user.id, 'astrologer')}
                                      className="px-2.5 py-1 text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors flex items-center gap-1"
                                    >
                                      <Shield className="w-3 h-3" /> Astrologer
                                    </button>
                                  )}
                                  {user.plan_tier !== 'free' && (
                                    <button
                                      onClick={() => handleRevoke(user.id)}
                                      className="px-2.5 py-1 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-1"
                                    >
                                      <UserX className="w-3 h-3" /> Revoke
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                            {search ? 'No users match your search.' : 'No users found.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── PAYMENTS TAB ─────────────────────────────────────────────────── */}
        {tab === 'payments' && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{payments.length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Successful</p>
                <p className="text-2xl font-bold text-green-600">{payments.filter(p => p.status === 'success').length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-bold text-indigo-600">
                  ₹{payments.filter(p => p.status === 'success').reduce((s, p) => s + (p.amount / 100), 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {paymentsLoading ? (
              <div className="text-center py-12 text-gray-500">Loading payments...</div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                      {payments.map((p) => (
                        <tr key={p.payment_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-800 dark:text-gray-100 truncate max-w-[200px]">{p.user_email || p.user_id.slice(0, 8)}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-medium capitalize text-gray-700 dark:text-gray-300">
                              {p.section_id ? `Section: ${p.section_id.replace(/_/g, ' ')}` : p.plan_type.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">₹{p.amount / 100}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              p.status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              p.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                            {new Date(p.created_at).toLocaleDateString()} {new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-[10px] bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono text-gray-500 truncate max-w-[120px] inline-block">
                              {p.payment_id}
                            </code>
                          </td>
                        </tr>
                      ))}
                      {payments.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            No payment records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── PUSH TAB ───────────────────────────────────────────────────────── */}
        {tab === 'push' && (
          <div className="max-w-2xl">
            {/* Subscriber count card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <Bell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Active Push Subscribers</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {pushCount === null ? '—' : pushCount}
                </p>
              </div>
              <button
                onClick={fetchPushStats}
                className="ml-auto p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Compose form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-500" />
                Broadcast Notification
              </h2>
              <form onSubmit={handleSendPush} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title <span className="text-gray-400 font-normal">(max 80 chars)</span>
                  </label>
                  <input
                    required
                    maxLength={80}
                    value={pushForm.title}
                    onChange={(e) => setPushForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Weekly compatibility update 🔮"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Body <span className="text-gray-400 font-normal">(max 200 chars)</span>
                  </label>
                  <textarea
                    required
                    maxLength={200}
                    rows={3}
                    value={pushForm.body}
                    onChange={(e) => setPushForm(f => ({ ...f, body: e.target.value }))}
                    placeholder="Check your updated compatibility insights..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label>
                    <input
                      type="url"
                      value={pushForm.url}
                      onChange={(e) => setPushForm(f => ({ ...f, url: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target</label>
                    <select
                      value={pushForm.targetTier}
                      onChange={(e) => setPushForm(f => ({ ...f, targetTier: e.target.value }))}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="all">All subscribers</option>
                      <option value="free">Free tier only</option>
                      <option value="premium">Premium only</option>
                      <option value="astrologer">Astrologer only</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={pushSending}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  {pushSending
                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> Sending…</>
                    : <><Send className="w-4 h-4" /> Send Notification</>}
                </button>
                {pushResult && (
                  <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg px-4 py-3">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {pushResult.sent} sent{pushResult.failed > 0 ? `, ${pushResult.failed} failed` : ''}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* ── AFFILIATES TAB ─────────────────────────────────────────────────── */}
        {tab === 'affiliates' && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Total Affiliates</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{affiliates.length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Total Referrals</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {affiliates.reduce((s, a) => s + (a.total_referrals ?? 0), 0)}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Pending Payouts</p>
                <p className="text-2xl font-bold text-amber-600">
                  ₹{affiliates.reduce((s, a) => s + (a.pending_payout_inr ?? 0), 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {affiliatesLoading ? (
              <div className="text-center py-12 text-gray-500">Loading affiliates...</div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Affiliate</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Referrals</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Conversions</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pending ₹</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                      {affiliates.map((aff) => (
                        <tr key={aff.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{aff.affiliate_name}</p>
                              <p className="text-xs text-gray-500">{aff.bureau_name || aff.affiliate_email || '—'}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded font-mono text-gray-700 dark:text-gray-300">
                              {aff.affiliate_code}
                            </code>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 font-medium">{aff.total_referrals ?? 0}</td>
                          <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 font-medium">{aff.total_conversions ?? 0}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-amber-600">
                            {aff.pending_payout_inr > 0 ? `₹${aff.pending_payout_inr}` : '—'}
                          </td>
                          <td className="px-4 py-3">{payoutBadge(aff.payout_status)}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {affActionLoading === aff.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                              ) : (
                                <>
                                  {aff.payout_status === 'pending' && aff.pending_payout_inr > 0 && (
                                    <button
                                      onClick={() => handleMarkPaid(aff.id)}
                                      className="px-2.5 py-1 text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1"
                                    >
                                      <CheckCircle className="w-3 h-3" /> Mark Paid
                                    </button>
                                  )}
                                  {aff.payout_status !== 'disabled' && (
                                    <button
                                      onClick={() => handleDisable(aff.id)}
                                      className="px-2.5 py-1 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                                    >
                                      <UserX className="w-3 h-3" /> Disable
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {affiliates.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                            No affiliates yet. Share <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">/affiliate</code> with marriage bureau operators.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
