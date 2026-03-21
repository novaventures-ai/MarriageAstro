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
  Sparkles
} from 'lucide-react';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selfChart, selfBirthData, partners, isHydrated, loadFromCloud } = useUserProfileStore();

  // Ensure cloud data is loaded when dashboard mounts
  useEffect(() => {
    if (isHydrated && user && !selfChart) {
      loadFromCloud();
    }
  }, [isHydrated, user, selfChart, loadFromCloud]);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  // Derive moon/sun sign from planetary positions
  const moonSign = selfChart?.planetaryPositions?.find(p => p.planet === 'Moon')?.sign || '--';
  const sunSign = selfChart?.planetaryPositions?.find(p => p.planet === 'Sun')?.sign || '--';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {displayName.split(' ')[0]}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Your cosmic journey at a glance
        </p>
      </div>

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

      {/* Partners + Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}> = ({ icon, label, value, accent }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg bg-${accent}-100 dark:bg-${accent}-900/30 flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{value}</p>
      </div>
    </div>
  </div>
);

const QuickAction: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}> = ({ icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-${color}-700 dark:text-${color}-400 hover:bg-${color}-50 dark:hover:bg-${color}-900/20 transition-colors text-left`}
  >
    {icon}
    {label}
    <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
  </button>
);

export default DashboardPage;
