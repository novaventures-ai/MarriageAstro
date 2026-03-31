/**
 * QuickVerdictBanner
 * Shown at the very top of the report for Decider mode users.
 * 2-line AI-style verdict answering "should I proceed with this person?"
 */

import React from 'react';
import { CompatibilityReport } from '@types';

interface Props {
  report: CompatibilityReport;
}

export const QuickVerdictBanner: React.FC<Props> = ({ report }) => {
  const score = report.ashtakoot?.totalScore ?? 0;
  const riskLevel = (report.riskAssessment as any)?.overallRisk?.level ?? 'Unknown';
  const sexScore = (report.sexualCompatibility as any)?.score ?? 0;

  const { headline, sub, tone } = deriveVerdict(score, riskLevel, sexScore);

  const toneStyles = {
    positive: {
      bg: 'from-emerald-500 to-teal-500',
      icon: '🌟',
      badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200',
      badgeText: 'Proceed with Confidence',
    },
    caution: {
      bg: 'from-amber-500 to-orange-500',
      icon: '⚖️',
      badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200',
      badgeText: 'Proceed with Eyes Open',
    },
    concern: {
      bg: 'from-rose-500 to-pink-600',
      icon: '⚠️',
      badge: 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200',
      badgeText: 'Significant Concerns Present',
    },
  };

  const style = toneStyles[tone];

  return (
    <div className={`mb-6 rounded-2xl bg-gradient-to-r ${style.bg} p-5 sm:p-6 text-white shadow-lg`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="text-4xl flex-shrink-0">{style.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${style.badge}`}>
              {style.badgeText}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold leading-snug">{headline}</h2>
          <p className="text-white/80 text-sm mt-1 leading-relaxed">{sub}</p>
        </div>
        <div className="flex-shrink-0 text-center bg-white/15 backdrop-blur rounded-xl px-4 py-3">
          <div className="text-3xl font-black leading-none">{score}</div>
          <div className="text-xs text-white/70 font-medium">out of 36</div>
          <div className="text-xs text-white/60 mt-0.5">Ashtakoot</div>
        </div>
      </div>
    </div>
  );
};

function deriveVerdict(
  score: number,
  riskLevel: string,
  sexScore: number
): { headline: string; sub: string; tone: 'positive' | 'caution' | 'concern' } {
  const highRisk = riskLevel === 'High' || riskLevel === 'Critical';
  const lowRisk = riskLevel === 'Low';

  if (score >= 24 && lowRisk) {
    return {
      headline: 'This match has strong Vedic foundations.',
      sub: `A score of ${score}/36 with low risk indicators suggests this person aligns well with your astrological blueprint. Explore the sections below to understand the full picture.`,
      tone: 'positive',
    };
  }
  if (score >= 18 && !highRisk) {
    return {
      headline: 'Solid compatibility with some areas to understand.',
      sub: `${score}/36 is a workable foundation. No major red flags in the risk analysis. Review the "Who Are They Really?" and "What Could Go Wrong?" sections for the nuances that matter.`,
      tone: 'positive',
    };
  }
  if (score >= 14 || !highRisk) {
    return {
      headline: 'Average match — go in with clarity, not assumptions.',
      sub: `${score}/36 falls in the middle range. Whether this works depends heavily on both people's self-awareness. Study the risk and psychology sections carefully before deciding.`,
      tone: 'caution',
    };
  }
  return {
    headline: 'This match presents significant astrological challenges.',
    sub: `${score}/36 combined with ${riskLevel.toLowerCase()} risk indicators flags real compatibility friction. This doesn't mean impossible — but it means you need to go in with full information. Read every section.`,
    tone: 'concern',
  };
}
