/**
 * Dashboard Compatibility Page
 * Quick access to compatibility check and AI insights
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles, CheckCircle, AlertTriangle, XCircle, FileText } from 'lucide-react';
import { useUserProfileStore } from '../../store/useUserProfileStore';
import { useAppStore } from '../../store/useAppStore';
import { SEOHead } from '../../components/SEOHead';
import { CosmicMatchWidget } from '../../components/dashboard/CosmicMatchWidget';
import { CouplePulseWidget } from '../../components/widgets/CouplePulseWidget';

export const DashboardCompatibilityPage: React.FC = () => {
  const navigate = useNavigate();
  const { selfChart, selfBirthData, partners, userMode } = useUserProfileStore();
  const currentReport = useAppStore((s) => s.currentReport);
  const primaryPartner = partners[0];

  // Decider verdict derived from current report
  const deciderVerdict = React.useMemo(() => {
    if (!currentReport) return null;
    const score = currentReport.ashtakoot?.totalScore ?? 0;
    const riskLevel = (currentReport.riskAssessment as any)?.overallRisk?.level ?? 'Unknown';
    const sexScore = (currentReport.sexualCompatibility as any)?.score ?? 50;
    const highRisk = riskLevel === 'High' || riskLevel === 'Critical';
    if (score >= 24 && !highRisk && sexScore >= 50) {
      return { tone: 'yes' as const, headline: 'Strong Foundation', sub: 'Vedic indicators align well. The astrological case for this match is solid.', icon: CheckCircle, gradient: 'from-emerald-500 to-green-600', badge: 'Proceed with confidence' };
    }
    if (score >= 18 && !highRisk) {
      return { tone: 'caution' as const, headline: 'Proceed Thoughtfully', sub: 'Good compatibility with some areas needing attention. Review the Risk and Chemistry sections.', icon: AlertTriangle, gradient: 'from-amber-500 to-orange-500', badge: 'Review full report' };
    }
    return { tone: 'no' as const, headline: 'Significant Friction', sub: 'Multiple incompatibility signals detected. Understand the challenges before deciding.', icon: XCircle, gradient: 'from-rose-500 to-red-600', badge: 'Read carefully' };
  }, [currentReport]);

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

      {/* Decider mode: Quick Verdict Card */}
      {userMode === 'decider' && deciderVerdict && (
        <div className={`bg-gradient-to-r ${deciderVerdict.gradient} rounded-2xl p-6 text-white shadow-lg`}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <deciderVerdict.icon className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="text-xl font-bold">{deciderVerdict.headline}</h2>
                <span className="px-2.5 py-0.5 bg-white/25 rounded-full text-xs font-semibold">{deciderVerdict.badge}</span>
              </div>
              <p className="text-white/85 text-sm leading-relaxed">{deciderVerdict.sub}</p>
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <button
                  onClick={() => navigate('/report')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors"
                >
                  <FileText className="w-4 h-4" /> Full Report
                </button>
                <span className="text-white/60 text-xs">
                  Ashtakoot: {currentReport?.ashtakoot?.totalScore ?? '—'}/36
                  {' · '}Risk: {(currentReport?.riskAssessment as any)?.overallRisk?.level ?? '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {userMode === 'decider' && !deciderVerdict && selfChart && partners.length > 0 && (
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-pink-200 dark:border-pink-800 p-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">No report generated yet</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Run a compatibility check to see your verdict.</p>
            </div>
            <button
              onClick={() => navigate('/calculator')}
              className="ml-auto px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors whitespace-nowrap"
            >
              Get Verdict
            </button>
          </div>
        </div>
      )}

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
