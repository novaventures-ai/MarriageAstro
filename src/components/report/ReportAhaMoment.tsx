/**
 * ReportAhaMoment
 * The first thing a user sees after a report loads.
 * One bold verdict + 3 key signals — answers the core question in 5 seconds.
 */

import React from 'react';
import { CompatibilityReport } from '@types';

interface Props {
  report: CompatibilityReport;
}

export const ReportAhaMoment: React.FC<Props> = ({ report }) => {
  const score = report.ashtakoot?.totalScore ?? 0;
  const riskLevel = (report.riskAssessment as any)?.overallRisk?.level ?? 'Unknown';
  const sexScore = (report.sexualCompatibility as any)?.score ?? 0;
  const moonSign = report.chartA?.planetaryPositions?.find(p => p.planet === 'Moon')?.sign ?? '—';
  const partnerMoonSign = report.chartB?.planetaryPositions?.find(p => p.planet === 'Moon')?.sign ?? '—';

  // Derive a plain-language match verdict
  const getVerdict = () => {
    if (score >= 28) return { label: 'Exceptional Match', color: 'emerald', bg: 'from-emerald-500 to-teal-500', emoji: '🌟' };
    if (score >= 22) return { label: 'Strong Match', color: 'green', bg: 'from-green-500 to-emerald-500', emoji: '✨' };
    if (score >= 18) return { label: 'Good Match', color: 'blue', bg: 'from-blue-500 to-indigo-500', emoji: '💫' };
    if (score >= 14) return { label: 'Average Match', color: 'amber', bg: 'from-amber-500 to-orange-500', emoji: '⚖️' };
    return { label: 'Challenging Match', color: 'rose', bg: 'from-rose-500 to-pink-500', emoji: '⚠️' };
  };

  const getRiskBadge = () => {
    if (riskLevel === 'Low') return { text: 'Low Risk', color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40' };
    if (riskLevel === 'High' || riskLevel === 'Critical') return { text: `${riskLevel} Risk`, color: 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/40' };
    return { text: `${riskLevel} Risk`, color: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40' };
  };

  const getSexBadge = () => {
    if (sexScore >= 75) return { text: 'High Chemistry', color: 'text-pink-700 dark:text-pink-300 bg-pink-100 dark:bg-pink-900/40' };
    if (sexScore >= 50) return { text: 'Moderate Chemistry', color: 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40' };
    return { text: 'Low Chemistry', color: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800' };
  };

  const verdict = getVerdict();
  const riskBadge = getRiskBadge();
  const sexBadge = getSexBadge();

  return (
    <div className="mb-6 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
      {/* Gradient header with score */}
      <div className={`bg-gradient-to-r ${verdict.bg} p-5 sm:p-6 text-white`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Score ring */}
          <div className="flex-shrink-0 w-20 h-20 rounded-full bg-white/20 backdrop-blur flex flex-col items-center justify-center border-4 border-white/40">
            <span className="text-2xl font-black leading-none">{score}</span>
            <span className="text-xs font-semibold opacity-80">/36</span>
          </div>

          {/* Verdict text */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{verdict.emoji}</span>
              <h2 className="text-xl sm:text-2xl font-bold">{verdict.label}</h2>
            </div>
            <p className="text-white/85 text-sm sm:text-base">
              {report.chartA.name} &amp; {report.chartB.name} &bull; Ashtakoot score {score}/36
            </p>
            <p className="text-white/70 text-xs mt-1">
              Moon: {moonSign} &times; {partnerMoonSign}
            </p>
          </div>

          {/* Mini signal badges */}
          <div className="flex sm:flex-col gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${riskBadge.color}`}>
              {riskBadge.text}
            </span>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${sexBadge.color}`}>
              {sexBadge.text}
            </span>
          </div>
        </div>
      </div>

      {/* Quick 3-point summary */}
      <div className="bg-white dark:bg-gray-800 px-5 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <Signal
          label="Best Strength"
          value={getBestStrength(report)}
          icon="💚"
        />
        <Signal
          label="Main Challenge"
          value={getMainChallenge(report)}
          icon="🔶"
        />
        <Signal
          label="Start Here"
          value='Tap a topic in the "Cosmic Navigator" below to explore any area in depth'
          icon="👇"
          muted
        />
      </div>
    </div>
  );
};

const Signal: React.FC<{ label: string; value: string; icon: string; muted?: boolean }> = ({ label, value, icon, muted }) => (
  <div className="flex gap-2 items-start">
    <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
    <div>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`text-sm mt-0.5 ${muted ? 'text-gray-400 dark:text-gray-500 italic' : 'text-gray-700 dark:text-gray-200 font-medium'}`}>{value}</p>
    </div>
  </div>
);

const PARAM_LABELS: Record<string, string> = {
  varna: 'Spiritual alignment', vashya: 'Mutual attraction', tara: 'Destiny compatibility',
  yoni: 'Physical nature', grahaMaitri: 'Mental friendship', gana: 'Temperament',
  bhakoot: 'Prosperity alignment', nadi: 'Health compatibility',
};

function getBestStrength(report: CompatibilityReport): string {
  const score = report.ashtakoot?.totalScore ?? 0;
  const params = report.ashtakoot?.parameters;
  if (params) {
    const entries = Object.entries(params) as [string, { pointsObtained: number; maxPoints: number }][];
    const best = entries.sort((a, b) => (b[1].pointsObtained / b[1].maxPoints) - (a[1].pointsObtained / a[1].maxPoints))[0];
    if (best && best[1].pointsObtained === best[1].maxPoints) return `${PARAM_LABELS[best[0]] ?? best[0]} is excellent`;
  }
  if (score >= 22) return 'Strong foundational Vedic compatibility';
  return 'Compatible Moon energies';
}

function getMainChallenge(report: CompatibilityReport): string {
  const riskLevel = (report.riskAssessment as any)?.overallRisk?.level;
  const params = report.ashtakoot?.parameters;
  if (params) {
    const entries = Object.entries(params) as [string, { pointsObtained: number; maxPoints: number }][];
    const worst = entries
      .filter(([, v]) => v.maxPoints > 0)
      .sort((a, b) => (a[1].pointsObtained / a[1].maxPoints) - (b[1].pointsObtained / b[1].maxPoints))[0];
    if (worst && worst[1].pointsObtained < worst[1].maxPoints) return `${PARAM_LABELS[worst[0]] ?? worst[0]} needs attention`;
  }
  if (riskLevel === 'High' || riskLevel === 'Critical') return 'Elevated risk areas — review the Risk section';
  return 'Minor friction points — manageable with awareness';
}
