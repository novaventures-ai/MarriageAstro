/**
 * Dashboard Compatibility Page
 * Quick access to compatibility check and AI insights
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { useUserProfileStore } from '../../store/useUserProfileStore';
import { SEOHead } from '../../components/SEOHead';
import { CosmicMatchWidget } from '../../components/dashboard/CosmicMatchWidget';
import { CouplePulseWidget } from '../../components/widgets/CouplePulseWidget';

export const DashboardCompatibilityPage: React.FC = () => {
  const navigate = useNavigate();
  const { selfChart, selfBirthData, partners, userMode } = useUserProfileStore();
  const primaryPartner = partners[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SEOHead
        title="Compatibility Insights - AI Match Analysis"
        description="AI-powered marriage compatibility insights with Vedic astrology. View match scores, cosmic connections, and detailed partner analysis."
        path="/dashboard/compatibility"
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-600" />
            Compatibility
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            AI-powered match analysis and compatibility insights
          </p>
        </div>
        <button
          onClick={() => navigate('/calculator')}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium inline-flex items-center gap-2"
        >
          New Compatibility Check <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Navigator mode: Monthly Couple Pulse */}
      {userMode === 'navigator' && selfChart && primaryPartner?.chart && (
        <CouplePulseWidget
          chartA={selfChart}
          chartB={primaryPartner.chart}
          nameA={selfChart.name}
          nameB={primaryPartner.name}
        />
      )}

      {/* AI Insights Widget */}
      {selfChart && partners.length > 0 ? (
        <CosmicMatchWidget
          selfChart={selfChart}
          selfBirthData={selfBirthData}
          partners={partners}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-pink-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {!selfChart ? 'Create your profile first' : 'Add partners to see insights'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto text-sm">
            {!selfChart
              ? 'You need a birth profile before you can check compatibility with partners'
              : 'Add at least one partner to get AI-powered compatibility insights'
            }
          </p>
          <button
            onClick={() => navigate(!selfChart ? '/self-calculator' : '/add-partner')}
            className="px-6 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
          >
            {!selfChart ? 'Create Profile' : 'Add Partner'}
          </button>
        </div>
      )}

      {/* Quick Compatibility Check Card */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-pink-200 dark:border-pink-800 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Quick Compatibility Check
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Enter two birth details for an instant 36-point Vedic compatibility analysis
        </p>
        <button
          onClick={() => navigate('/calculator')}
          className="px-5 py-2.5 bg-white dark:bg-gray-800 text-pink-600 dark:text-pink-400 font-medium rounded-lg border border-pink-200 dark:border-pink-700 hover:shadow-md transition-all text-sm inline-flex items-center gap-2"
        >
          Start Check <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DashboardCompatibilityPage;
