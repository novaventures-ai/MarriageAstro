/**
 * API Keys Management Page
 * Lets authenticated users create, view, and delete API keys for the v1 REST API + MCP server
 */
import React, { useEffect, useState, useCallback } from 'react';
import { Key, Plus, Copy, Trash2, CheckCircle, AlertCircle, ExternalLink, Shield, Zap, Crown, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { SEOHead } from '../components/SEOHead';
import { Link } from 'react-router-dom';

interface ApiKey {
  id: string;
  key: string;
  label: string | null;
  tier: 'free' | 'developer' | 'premium';
  calls_today: number;
  calls_month: number;
  is_active: boolean;
  created_at: string;
}

const TIER_META = {
  free:      { icon: Shield,  color: 'text-slate-600 dark:text-slate-300',  bg: 'bg-slate-100 dark:bg-slate-800',  label: 'Free',      daily: 50,    price: '$0' },
  developer: { icon: Zap,     color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-100 dark:bg-blue-900/40', label: 'Developer', daily: 500,   price: '$9/mo' },
  premium:   { icon: Crown,   color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-100 dark:bg-amber-900/40', label: 'Premium', daily: 99999, price: '$99/mo' },
};

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });
}

function maskKey(key: string) {
  if (key.length <= 12) return '••••••••••••';
  return key.slice(0, 8) + '••••••••••••••••' + key.slice(-4);
}

function generateKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const arr = new Uint8Array(40);
  crypto.getRandomValues(arr);
  return 'va_' + Array.from(arr).map(b => chars[b % chars.length]).join('');
}

export function ApiKeysPage() {
  const { user } = useAuth();
  const isAdmin = useUserProfileStore(state => state.isAdmin);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newlyCreated, setNewlyCreated] = useState<ApiKey | null>(null);

  const fetchKeys = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error: err } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setKeys(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  async function createKey() {
    if (!user) return;
    setCreating(true);
    setError(null);
    const key = generateKey();
    const tier = isAdmin ? 'premium' : 'free';
    const { data, error: err } = await supabase
      .from('api_keys')
      .insert({ key, user_id: user.id, label: newLabel || null, tier })
      .select()
      .single();
    setCreating(false);
    if (err) { setError(err.message); return; }
    setNewlyCreated(data);
    setKeys(prev => [data, ...prev]);
    setNewLabel('');
    setShowCreate(false);
    setRevealedId(data.id);
  }

  async function deleteKey(id: string) {
    if (!confirm('Delete this API key? This cannot be undone.')) return;
    const { error: err } = await supabase.from('api_keys').delete().eq('id', id);
    if (err) { setError(err.message); return; }
    setKeys(prev => prev.filter(k => k.id !== id));
    if (newlyCreated?.id === id) setNewlyCreated(null);
  }

  function handleCopy(key: ApiKey) {
    copyToClipboard(key.key);
    setCopiedId(key.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Key className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Sign in required</h2>
          <p className="text-slate-500">Please sign in to manage your API keys.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="API Keys — MarriageAstro Developer API"
        description="Manage your MarriageAstro API keys for Vedic astrology calculations. Access birth charts, compatibility, divorce risk, spouse prediction, and 22 more endpoints."
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 dark:from-slate-950 dark:to-violet-950/20 py-12 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-lg">
                <Key className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">API Keys</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Use these keys to access the{' '}
              <Link to="/api-docs" className="text-violet-600 hover:underline">
                MarriageAstro REST API
              </Link>{' '}
              and the{' '}
              <Link to="/mcp-docs" className="text-sm text-violet-600 hover:underline bg-slate-100 dark:bg-slate-800 px-1 rounded">marriage-astro-mcp</Link> server.
            </p>
          </div>

          {/* Plan tiers info */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {(Object.entries(TIER_META) as [string, typeof TIER_META.free][]).map(([tier, meta]) => {
              const Icon = meta.icon;
              return (
                <div key={tier} className={`rounded-xl border border-slate-200 dark:border-slate-700 p-4 ${meta.bg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${meta.color}`} />
                    <span className={`text-sm font-semibold ${meta.color}`}>{meta.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {meta.daily >= 99999 ? 'Unlimited' : `${meta.daily.toLocaleString()}`} calls/day
                  </p>
                  <p className={`text-sm font-bold mt-1 ${meta.color}`}>{meta.price}</p>
                </div>
              );
            })}
          </div>

          {/* Newly created banner */}
          {newlyCreated && (
            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">API key created — copy it now</span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-3">
                This is the only time the full key is shown. Copy it before leaving.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-700 rounded-lg px-3 py-2 font-mono break-all">
                  {newlyCreated.key}
                </code>
                <button
                  onClick={() => handleCopy(newlyCreated)}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  {copiedId === newlyCreated.id ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Create new key */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
            {!showCreate ? (
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Create new API key
              </button>
            ) : (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">New API key</h3>
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Label (optional)</label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    placeholder="e.g. My app, RapidAPI test..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    maxLength={64}
                    onKeyDown={e => e.key === 'Enter' && createKey()}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAdmin ? (
                    <span className="text-emerald-600 font-medium">Admin detected: Your new key will be on the <strong>Premium</strong> tier automatically.</span>
                  ) : (
                    <>New keys start on the <strong>Free</strong> tier (50 calls/day). Upgrade at any time from the{' '}
                    <a href="/pricing" className="text-violet-600 hover:underline">Pricing page</a>.</>
                  )}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={createKey}
                    disabled={creating}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    {creating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {creating ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    onClick={() => { setShowCreate(false); setNewLabel(''); }}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Keys list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-slate-900 dark:text-white">Your keys ({keys.length})</h2>
              <button onClick={fetchKeys} className="text-slate-400 hover:text-slate-600 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-400">Loading keys...</div>
            ) : keys.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <Key className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No API keys yet. Create your first one above.</p>
              </div>
            ) : (
              keys.map(apiKey => {
                const meta = TIER_META[apiKey.tier];
                const Icon = meta.icon;
                const isRevealed = revealedId === apiKey.id;
                const isCopied = copiedId === apiKey.id;
                const dailyLimit = meta.daily >= 99999 ? '∞' : meta.daily;
                const usagePct = meta.daily >= 99999 ? 0 : (apiKey.calls_today / meta.daily) * 100;

                return (
                  <div key={apiKey.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Label + tier badge */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-slate-900 dark:text-white truncate">
                            {apiKey.label || 'Unnamed key'}
                          </span>
                          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${meta.bg} ${meta.color}`}>
                            <Icon className="w-3 h-3" />
                            {meta.label}
                          </span>
                          {!apiKey.is_active && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600">Disabled</span>
                          )}
                        </div>

                        {/* Key value */}
                        <div className="flex items-center gap-2 mb-3">
                          <code className="text-sm font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded truncate max-w-xs">
                            {isRevealed ? apiKey.key : maskKey(apiKey.key)}
                          </code>
                          <button
                            onClick={() => setRevealedId(isRevealed ? null : apiKey.id)}
                            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0"
                          >
                            {isRevealed ? 'Hide' : 'Reveal'}
                          </button>
                        </div>

                        {/* Usage bar */}
                        {meta.daily < 99999 && (
                          <div className="mb-2">
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                              <span>Today: {apiKey.calls_today} / {dailyLimit} calls</span>
                              <span>Month: {apiKey.calls_month.toLocaleString()}</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${usagePct > 90 ? 'bg-red-500' : usagePct > 70 ? 'bg-amber-500' : 'bg-violet-500'}`}
                                style={{ width: `${Math.min(usagePct, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-slate-400">
                          Created {new Date(apiKey.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleCopy(apiKey)}
                          title="Copy key"
                          className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                        >
                          {isCopied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteKey(apiKey.id)}
                          title="Delete key"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Docs link */}
          <div className="mt-8 p-4 bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30 rounded-xl flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-violet-800 dark:text-violet-200">Need help getting started?</p>
              <p className="text-sm text-violet-600 dark:text-violet-400">Read the API docs or install the MCP server.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                to="/api-docs"
                className="flex items-center gap-1 px-3 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                API Docs
              </Link>
              <Link
                to="/mcp-docs"
                className="flex items-center gap-1 px-3 py-2 text-sm border border-violet-200 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900/40 text-violet-700 dark:text-violet-300 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                MCP Setup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
