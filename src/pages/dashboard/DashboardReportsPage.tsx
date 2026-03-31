/**
 * Dashboard Reports Page
 * Shows saved compatibility reports, wrapping SavedReportsPanel
 */

import React from 'react';
import { FileText } from 'lucide-react';
import { SavedReportsPanel } from '../../components/ui/SavedReportsPanel';
import { SEOHead } from '../../components/SEOHead';
import { useUserProfileStore } from '../../store/useUserProfileStore';

const MODE_SUBTITLE: Record<string, string> = {
  searcher: 'Browse past compatibility checks — find who scored highest',
  decider: 'Your saved reports for the person you\'re evaluating',
  navigator: 'Your couple\'s compatibility history and analysis archive',
};

const MODE_CTA: Record<string, { bg: string; text: string }> = {
  searcher: {
    bg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
    text: 'Tip: Sort by score to spot your best matches',
  },
  decider: {
    bg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    text: 'Tip: Open the latest report for your Quick Verdict',
  },
  navigator: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300',
    text: 'Tip: Re-generate to see updated timing and Dasha guidance',
  },
};

export const DashboardReportsPage: React.FC = () => {
  const { userMode } = useUserProfileStore();

  const subtitle = userMode
    ? (MODE_SUBTITLE[userMode] ?? 'Your previously generated compatibility reports')
    : 'Your previously generated compatibility reports';

  const ctaConfig = userMode ? (MODE_CTA[userMode] ?? null) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SEOHead
        title="Saved Reports - Compatibility History"
        description="View your saved Vedic astrology compatibility reports and marriage analysis history."
        path="/dashboard/reports"
      />
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-600" />
          Saved Reports
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </p>
      </div>

      {/* Mode-aware CTA pill */}
      {ctaConfig && (
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${ctaConfig.bg}`}>
          {ctaConfig.text}
        </div>
      )}

      <SavedReportsPanel />
    </div>
  );
};

export default DashboardReportsPage;
