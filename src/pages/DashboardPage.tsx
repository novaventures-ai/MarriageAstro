/**
 * Dashboard Overview Page
 * Main hub showing self profile, partners summary, and quick actions
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Heart,
  Users,
  ArrowRight,
  Plus,
  Scale,
  Star,
  FileText,
  Sparkles,
  Clock,
  Search,
  Compass,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { useUserProfileStore, UserMode } from '../store/useUserProfileStore';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/SEOHead';
import { UserModeOnboarding } from '../components/onboarding/UserModeOnboarding';
import { RawModeToggle } from '../components/admin/RawModeToggle';

const MODE_COLORS: Record<string, {
  border: string; bg: string; text: string; badge: string;
  ctaBtn: string; statBg: string; statBorder: string; statText: string;
}> = {
  violet: {
    border: 'border-violet-200 dark:border-violet-800/50',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    text: 'text-violet-800 dark:text-violet-200',
    badge: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
    ctaBtn: 'bg-violet-600 hover:bg-violet-700 text-white',
    statBg: 'bg-violet-50 dark:bg-violet-900/20',
    statBorder: 'border-violet-200 dark:border-violet-800/30',
    statText: 'text-violet-700 dark:text-violet-300',
  },
  rose: {
    border: 'border-rose-200 dark:border-rose-800/50',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    text: 'text-rose-800 dark:text-rose-200',
    badge: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
    ctaBtn: 'bg-rose-600 hover:bg-rose-700 text-white',
    statBg: 'bg-rose-50 dark:bg-rose-900/20',
    statBorder: 'border-rose-200 dark:border-rose-800/30',
    statText: 'text-rose-700 dark:text-rose-300',
  },
  emerald: {
    border: 'border-emerald-200 dark:border-emerald-800/50',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-800 dark:text-emerald-200',
    badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    ctaBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    statBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    statBorder: 'border-emerald-200 dark:border-emerald-800/30',
    statText: 'text-emerald-700 dark:text-emerald-300',
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  'cat_personality': 'Personality & Character',
  'cat_risks': 'Full Risk Analysis',
  'cat_chemistry': 'Deep Chemistry & Intimacy',
  'cat_timing': 'Marriage Timing & Remedies',
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const { 
    selfChart, selfBirthData, partners, isHydrated, isDemoMode, loadFromCloud, 
    userMode, setUserMode, planTier, unlockedSections, planExpiresAt,
    wantsAutoRenew, toggleAutoRenewInterest, paymentHistory
  } = useUserProfileStore();

  // Load cloud data when dashboard mounts (skip in demo mode)
  useEffect(() => {
    if (isHydrated && user && !isDemoMode) {
      loadFromCloud();
    }
  }, [isHydrated, user, isDemoMode, loadFromCloud]);

  const displayName = isDemoMode
    ? (selfBirthData?.name || 'Demo User')
    : (user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User');

  // Derive moon/sun sign from planetary positions
  const moonSign = selfChart?.planetaryPositions?.find(p => p.planet === 'Moon')?.sign || '--';
  const sunSign = selfChart?.planetaryPositions?.find(p => p.planet === 'Sun')?.sign || '--';

  const modeConfig: Record<UserMode, { icon: React.ReactNode; color: string; headline: string; sub: string; primaryCta: string; primaryPath: string }> = {
    searcher: {
      icon: <Search className="w-5 h-5" />,
      color: 'violet',
      headline: 'Your Marriage Timeline',
      sub: 'Discover your auspicious windows and future spouse traits',
      primaryCta: selfChart ? 'View Marriage Timing' : 'Create Your Profile',
      primaryPath: selfChart ? '/self-report' : '/self-calculator',
    },
    decider: {
      icon: <Scale className="w-5 h-5" />,
      color: 'rose',
      headline: 'Is This Person Right For You?',
      sub: 'Get the full honest picture — including what most people are afraid to ask',
      primaryCta: partners.length > 0 ? 'View Full Report' : 'Add Partner to Analyse',
      primaryPath: partners.length > 0 ? `/quick-compare/${partners[0]?.id}` : '/add-partner',
    },
    navigator: {
      icon: <Compass className="w-5 h-5" />,
      color: 'emerald',
      headline: "Your Relationship Pulse",
      sub: "Understand each other deeper and navigate what's coming",
      primaryCta: partners.length > 0 ? 'View Couple Report' : 'Add Your Partner',
      primaryPath: partners.length > 0 ? '/dashboard/compatibility' : '/add-partner',
    },
  };

  const activeModeConfig = userMode ? modeConfig[userMode] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <RawModeToggle />
      <SEOHead title="Your Astrology Dashboard - Birth Chart Analysis" description="View your complete Vedic astrology dashboard with birth chart analysis, Dasha periods, marriage timing predictions, and personalized insights." path="/dashboard" />

      {/* Onboarding: shown when user hasn't chosen a mode yet */}
      {!userMode && isHydrated && (
        <UserModeOnboarding onSelect={setUserMode} />
      )}

      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {displayName.split(' ')[0]}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Your cosmic journey at a glance
          </p>
        </div>
        {userMode && (
          <button
            onClick={() => setUserMode(null as any)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors self-start sm:self-auto"
            title="Switch journey mode"
          >
            {modeConfig[userMode].icon}
            <span className="capitalize">{userMode === 'searcher' ? 'Still Searching' : userMode === 'decider' ? 'Evaluating Someone' : 'Already Together'}</span>
            <span className="text-gray-400">· change</span>
          </button>
        )}
      </div>

      {/* Mode-specific focus banner */}
      {activeModeConfig && (() => {
        const mc = MODE_COLORS[activeModeConfig.color];
        return (
          <div className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${mc.border} ${mc.bg}`}>
            <div>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${mc.text}`}>
                {activeModeConfig.icon}
                {activeModeConfig.headline}
              </h2>
              <p className={`text-sm mt-1 ${mc.statText}`}>
                {activeModeConfig.sub}
              </p>
            </div>
            <button
              onClick={() => navigate(activeModeConfig.primaryPath)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${mc.ctaBtn}`}
            >
              {activeModeConfig.primaryCta} →
            </button>
          </div>
        );
      })()}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<User className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          label="Profile"
          value={selfChart ? 'Complete' : 'Not Set'}
          accent={selfChart ? 'purple' : 'gray'}
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-pink-600 dark:text-pink-400" />}
          label="Partners"
          value={String(partners.length)}
          accent="pink"
        />
        <StatCard
          icon={<Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          label="Ascendant"
          value={selfChart?.ascendant || '--'}
          accent="amber"
        />
        <StatCard
          icon={<Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          label="Moon Sign"
          value={moonSign}
          accent="indigo"
        />
      </div>

      {/* Self Profile Section */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Your Profile
          </h2>
          {selfChart && (
            <button
              onClick={() => navigate('/dashboard/self-analysis')}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              View Full Analysis <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="p-6">
          {selfChart ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-purple-600">
                  {selfChart.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {selfChart.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {selfBirthData?.dateOfBirth
                    ? new Date(selfBirthData.dateOfBirth).toLocaleDateString()
                    : ''}{' '}
                  &bull; {selfChart.ascendant} Ascendant &bull; {selfChart.gender}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/self-report')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  View Report
                </button>
                <button
                  onClick={() => navigate('/self-calculator')}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Create Your Birth Profile
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto text-sm">
                Enter your birth details to unlock marriage timing predictions, spouse characteristics, and personalized remedies
              </p>
              <button
                onClick={() => navigate('/self-calculator')}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Subscription & Access Section */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/20">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Your Access & Premium Features
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                setIsSyncing(true);
                await loadFromCloud();
                setTimeout(() => setIsSyncing(false), 500);
              }}
              disabled={isSyncing}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                isSyncing 
                  ? 'bg-gray-100 text-gray-400' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Refresh Access'}
            </button>
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
              planTier === 'free' ? 'bg-gray-100 text-gray-500' : 
              planTier === 'premium' ? 'bg-purple-100 text-purple-700' : 
              'bg-amber-100 text-amber-700'
            }`}>
              {planTier} plan
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Current Status</h3>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${planTier === 'free' ? 'bg-gray-100' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
                    {planTier === 'free' ? <User className="w-5 h-5 text-gray-400" /> : <Sparkles className="w-5 h-5 text-amber-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white capitalize">{planTier} Access</p>
                    {planExpiresAt && (
                      <p className="text-xs text-gray-500">Expires {new Date(planExpiresAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
              
                {planTier === 'free' && (
                  <button 
                    onClick={() => navigate('/pricing')}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg text-sm font-semibold hover:shadow-md transition-shadow"
                  >
                    Upgrade to Premium
                  </button>
                )}

                {/* Auto-Renew Interest Tracker */}
                {planTier !== 'free' && (
                  <div className="mt-4 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-800/20">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                        <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ${!wantsAutoRenew ? 'animate-pulse' : ''}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-100 mb-1">
                          {wantsAutoRenew ? "You're on the list!" : "Enable Auto-Renew?"}
                        </p>
                        <p className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 leading-relaxed mb-3">
                          {wantsAutoRenew 
                            ? "We'll notify you as soon as automatic recurring billing is available."
                            : "Tired of manual renewals? Join our waitlist to get automatic billing first."
                          }
                        </p>
                        {!wantsAutoRenew ? (
                          <button 
                            onClick={() => toggleAutoRenewInterest(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-md transition-colors shadow-sm"
                          >
                            Join Waitlist
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-[10px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Waitlist Joined
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            {/* Unlocked Sections List */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Individually Unlocked</h3>
              {unlockedSections.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {unlockedSections.map((sectionId) => {
                    const label = CATEGORY_LABELS[sectionId] || sectionId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    return (
                      <div 
                        key={sectionId}
                        className="px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 text-green-700 dark:text-green-400 text-xs font-medium flex items-center gap-1.5"
                      >
                        <Heart className="w-3 h-3 fill-current" />
                        {label}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No individual sections unlocked yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Partners + Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Partners Summary */}
        <section className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              Partners ({partners.length})
            </h2>
            <button
              onClick={() => navigate('/dashboard/partners')}
              className="text-sm text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            {partners.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-7 h-7 text-pink-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">
                  No partners added yet
                </p>
                <button
                  onClick={() => navigate('/add-partner')}
                  className="px-5 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium"
                >
                  Add Your First Partner
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {partners.slice(0, 5).map((partner) => (
                  <div
                    key={partner.id}
                    onClick={() => navigate(`/partner/${partner.id}`)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-pink-600">
                        {partner.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">
                        {partner.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {partner.gender} &bull; Added {new Date(partner.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/quick-compare/${partner.id}`);
                      }}
                      className="px-3 py-1.5 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-lg text-xs font-medium hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors flex items-center gap-1"
                    >
                      <Scale className="w-3 h-3" />
                      Compare
                    </button>
                  </div>
                ))}
                {partners.length > 5 && (
                  <button
                    onClick={() => navigate('/dashboard/partners')}
                    className="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 py-2"
                  >
                    +{partners.length - 5} more partners...
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Quick Actions
            </h2>
          </div>
          <div className="p-4 space-y-2">
            <QuickAction
              icon={<User className="w-5 h-5" />}
              label={selfChart ? 'View Self Report' : 'Create Profile'}
              onClick={() => navigate(selfChart ? '/self-report' : '/self-calculator')}
              color="purple"
            />
            <QuickAction
              icon={<Plus className="w-5 h-5" />}
              label="Add Partner"
              onClick={() => navigate('/add-partner')}
              color="pink"
            />
            <QuickAction
              icon={<Heart className="w-5 h-5" />}
              label="Compatibility Check"
              onClick={() => navigate('/calculator')}
              color="rose"
            />
            <QuickAction
              icon={<Scale className="w-5 h-5" />}
              label="Compare Partners"
              onClick={() => navigate('/comparison')}
              color="indigo"
            />
            <QuickAction
              icon={<FileText className="w-5 h-5" />}
              label="Saved Reports"
              onClick={() => navigate('/dashboard/reports')}
              color="amber"
            />
          </div>
        </section>
      </div>

      {/* Transaction History */}
      {paymentHistory.length > 0 && (
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              Recent Transactions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/20 text-gray-500 font-medium">
                  <th className="px-6 py-3">Module / Plan</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {paymentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.sectionId ? (CATEGORY_LABELS[item.sectionId] || item.sectionId.replace(/_/g, ' ')) : item.planType.replace(/_/g, ' ')}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">{item.id}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      ₹{item.amount / 100}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'success' ? 'bg-green-100 text-green-700' :
                        item.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

const STAT_ACCENT_BG: Record<string, string> = {
  purple: 'bg-purple-100 dark:bg-purple-900/30',
  pink:   'bg-pink-100 dark:bg-pink-900/30',
  amber:  'bg-amber-100 dark:bg-amber-900/30',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/30',
  gray:   'bg-gray-100 dark:bg-gray-700/50',
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}> = ({ icon, label, value, accent }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${STAT_ACCENT_BG[accent] ?? STAT_ACCENT_BG['gray']}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{value}</p>
      </div>
    </div>
  </div>
);

const QUICK_ACTION_COLORS: Record<string, string> = {
  purple: 'text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20',
  pink:   'text-pink-700 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20',
  rose:   'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20',
  indigo: 'text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
  amber:  'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20',
};

const QuickAction: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}> = ({ icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${QUICK_ACTION_COLORS[color] ?? ''}`}
  >
    {icon}
    {label}
    <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
  </button>
);

export default DashboardPage;
