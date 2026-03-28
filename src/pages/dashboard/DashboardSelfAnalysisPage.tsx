/**
 * Dashboard Self Analysis Page
 * Wraps existing self report functionality within the dashboard layout
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, Edit2, Loader2 } from 'lucide-react';
import { useUserProfileStore } from '../../store/useUserProfileStore';
import { useAuth } from '../../context/AuthContext';
import { SEOHead } from '../../components/SEOHead';

export const DashboardSelfAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { selfChart, selfBirthData, selfReport, isLoadingPartners } = useUserProfileStore();
  const { isLoading: isAuthLoading } = useAuth();

  // Show skeleton while auth session or cloud profile is loading
  if (isAuthLoading || isLoadingPartners) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Loader2 className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Loading your profile…</p>
      </div>
    );
  }

  if (!selfChart) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          No Profile Yet
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Create your birth profile to get your personalized marriage analysis
        </p>
        <button
          onClick={() => navigate('/self-calculator')}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium inline-flex items-center gap-2"
        >
          Create Profile <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <SEOHead
        title="Self Analysis - Personal Marriage Predictions"
        description="Your personalized Vedic astrology self-analysis with marriage timing, spouse predictions, and birth chart insights."
        path="/dashboard/self-analysis"
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Self Analysis</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Your personal marriage analysis and predictions
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/self-calculator')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm inline-flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
          <button
            onClick={() => navigate('/self-report')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium inline-flex items-center gap-2"
          >
            Full Report <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <span className="text-2xl font-bold text-purple-600">
              {selfChart.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{selfChart.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selfBirthData?.dateOfBirth ? new Date(selfBirthData.dateOfBirth).toLocaleDateString() : ''} &bull; {selfChart.gender}
            </p>
          </div>
        </div>

        {/* Key Astrological Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <DetailCard label="Ascendant" value={selfChart.ascendant || '--'} />
          <DetailCard label="Moon Sign" value={selfChart.planetaryPositions?.find(p => p.planet === 'Moon')?.sign || '--'} />
          <DetailCard label="Sun Sign" value={selfChart.planetaryPositions?.find(p => p.planet === 'Sun')?.sign || '--'} />
          <DetailCard label="Nakshatra" value={selfChart.planetaryPositions?.find(p => p.planet === 'Moon')?.nakshatra || '--'} />
        </div>
      </div>

      {/* Report Status */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Analysis Report
        </h3>
        {selfReport ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <p className="text-green-700 dark:text-green-400 font-medium text-sm">
                Report generated and available
              </p>
            </div>
            <button
              onClick={() => navigate('/self-report')}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium inline-flex items-center justify-center gap-2"
            >
              View Full Report <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <p className="text-amber-700 dark:text-amber-400 font-medium text-sm">
                Report not yet generated
              </p>
            </div>
            <button
              onClick={() => navigate('/self-report')}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium inline-flex items-center justify-center gap-2"
            >
              Generate Report <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</p>
    <p className="font-semibold text-gray-800 dark:text-gray-100">{value}</p>
  </div>
);

export default DashboardSelfAnalysisPage;
