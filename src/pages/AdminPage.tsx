/**
 * Admin Page
 * Allows admin users to view all users and grant/revoke premium access.
 * Protected: redirects non-admins to home.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Crown, UserX, Search, ArrowLeft, RefreshCw } from 'lucide-react';
import { usePremium } from '../hooks/usePremium';
import { listAllUsers, grantPremium, revokePremium, UserRecord } from '../lib/adminService';
import { PlanTier } from '../types';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = usePremium();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await listAllUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleGrant = async (userId: string, tier: PlanTier) => {
    setActionLoading(userId);
    // Premium: 1 year expiry. Astrologer: no expiry.
    const expiresAt = tier === 'premium'
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : null;
    const ok = await grantPremium(userId, tier, expiresAt);
    if (ok) await fetchUsers();
    setActionLoading(null);
  };

  const handleRevoke = async (userId: string) => {
    setActionLoading(userId);
    const ok = await revokePremium(userId);
    if (ok) await fetchUsers();
    setActionLoading(null);
  };

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name || '').toLowerCase().includes(search.toLowerCase())
  );

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
          <button onClick={fetchUsers} disabled={loading} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
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

        {/* Search */}
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

        {/* User Table */}
        {loading ? (
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
                                  title="Grant Premium (1 year)"
                                >
                                  <Crown className="w-3 h-3" /> Premium
                                </button>
                              )}
                              {user.plan_tier !== 'astrologer' && (
                                <button
                                  onClick={() => handleGrant(user.id, 'astrologer')}
                                  className="px-2.5 py-1 text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors flex items-center gap-1"
                                  title="Grant Astrologer (no expiry)"
                                >
                                  <Shield className="w-3 h-3" /> Astrologer
                                </button>
                              )}
                              {user.plan_tier !== 'free' && (
                                <button
                                  onClick={() => handleRevoke(user.id)}
                                  className="px-2.5 py-1 text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-1"
                                  title="Revoke to Free"
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
      </div>
    </div>
  );
};
