import React, { useState } from 'react';
import {
  Heart, TrendingUp, Baby, Shield, AlertTriangle,
  Sparkles, Clock, ChevronDown, ChevronUp, Star,
  Activity, Users, Sun, CloudRain
} from 'lucide-react';
import { CompatibilityReport } from '../../types';

interface Props {
  report: CompatibilityReport;
}

// ── Domain scoring helpers ──────────────────────────────────────────────────

function getEmotionalScore(report: CompatibilityReport): number {
  const base = report.navamsaMatching.score ?? 50;
  const ashtakootPct = report.ashtakoot.percentage ?? 50;
  return Math.round((base + ashtakootPct) / 2);
}

function getProsperityScore(report: CompatibilityReport): number {
  const second = report.inLawAnalysis.secondHouseScore ?? 5;
  const tenth = report.inLawAnalysis.tenthHouseScore ?? 5;
  return Math.min(100, Math.round(((second + tenth) / 20) * 100));
}

function getHealthScore(report: CompatibilityReport): number {
  const longevity = report.riskAssessment.spouseLongevity;
  if (!longevity) return 60;
  return longevity.level === 'stable' ? 80 : longevity.level === 'moderate' ? 55 : 35;
}

function getChildrenScore(report: CompatibilityReport): number {
  const d7 = report.divisionalAnalysis.d7;
  const fertility = d7.fertility?.toLowerCase() ?? '';
  if (fertility.includes('excellent') || fertility.includes('high')) return 85;
  if (fertility.includes('good') || fertility.includes('favourable')) return 70;
  if (fertility.includes('moderate') || fertility.includes('average')) return 55;
  if (fertility.includes('low') || fertility.includes('difficult')) return 35;
  return 60;
}

function getStatusScore(report: CompatibilityReport): number {
  const tenth = report.inLawAnalysis.tenthHouseScore ?? 5;
  return Math.min(100, Math.round((tenth / 10) * 100));
}

function getConflictScore(report: CompatibilityReport): number {
  const severity = report.conflictZone.overallSeverity;
  const divorce = report.riskAssessment.divorceProbability.level;
  let base = severity === 'Low' ? 80 : severity === 'Medium' ? 55 : 30;
  if (divorce === 'low') base = Math.min(100, base + 10);
  if (divorce === 'high' || divorce === 'very_high') base = Math.max(10, base - 20);
  return base;
}

// ── Score → display ─────────────────────────────────────────────────────────

function scoreToTier(score: number): 'strong' | 'moderate' | 'weak' {
  if (score >= 68) return 'strong';
  if (score >= 42) return 'moderate';
  return 'weak';
}

const TIER_STYLES = {
  strong:   { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300', label: 'Favourable' },
  moderate: { bar: 'bg-amber-400',   text: 'text-amber-600  dark:text-amber-400',   badge: 'bg-amber-100  dark:bg-amber-900/30  text-amber-700  dark:text-amber-300',  label: 'Mixed'      },
  weak:     { bar: 'bg-rose-500',    text: 'text-rose-600   dark:text-rose-400',    badge: 'bg-rose-100   dark:bg-rose-900/30   text-rose-700   dark:text-rose-300',   label: 'Challenging'},
};

// ── Domain definitions ───────────────────────────────────────────────────────

interface Domain {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  score: number;
  detail: string;
}

function buildDomains(report: CompatibilityReport): Domain[] {
  return [
    {
      id: 'happiness',
      icon: <Heart className="w-5 h-5" />,
      title: 'Emotional Happiness',
      subtitle: 'Love, warmth & daily joy',
      score: getEmotionalScore(report),
      detail: report.navamsaMatching.maritalHappiness || 'Based on Navamsa and Ashtakoot analysis.',
    },
    {
      id: 'prosperity',
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Financial Prosperity',
      subtitle: 'Wealth, stability & resources',
      score: getProsperityScore(report),
      detail: report.inLawAnalysis.interpretation || 'Based on 2nd and 10th house strength.',
    },
    {
      id: 'health',
      icon: <Activity className="w-5 h-5" />,
      title: 'Health & Longevity',
      subtitle: 'Vitality & physical wellbeing',
      score: getHealthScore(report),
      detail: report.riskAssessment.spouseLongevity
        ? `Partner longevity indicator: ${report.riskAssessment.spouseLongevity.level}. ${report.riskAssessment.spouseLongevity.indicators?.[0]?.text ?? ''}`
        : 'Based on 8th house and Mangal placement.',
    },
    {
      id: 'children',
      icon: <Baby className="w-5 h-5" />,
      title: 'Children & Legacy',
      subtitle: '5th house, D7 chart & Putrakaraka',
      score: getChildrenScore(report),
      detail: report.divisionalAnalysis.d7.fertility
        ? `Fertility: ${report.divisionalAnalysis.d7.fertility}. ${report.divisionalAnalysis.d7.childrenIndications?.[0] ?? ''}`
        : 'Based on 5th house and D7 Saptamsa chart.',
    },
    {
      id: 'status',
      icon: <Star className="w-5 h-5" />,
      title: 'Social Status & Career',
      subtitle: '10th house, reputation & growth',
      score: getStatusScore(report),
      detail: `10th house score: ${report.inLawAnalysis.tenthHouseScore}/10. ${report.navamsaMatching.mutualRespect || 'Career and public image influenced by the partnership.'}`,
    },
    {
      id: 'conflict',
      icon: <Shield className="w-5 h-5" />,
      title: 'Conflict & Stability',
      subtitle: 'How much friction enters life',
      score: getConflictScore(report),
      detail: `Overall conflict severity: ${report.conflictZone.overallSeverity}. Separation risk: ${report.riskAssessment.divorceProbability.level}.`,
    },
  ];
}

// ── Blessings & Challenges ───────────────────────────────────────────────────

function getBlessings(report: CompatibilityReport): string[] {
  const list: string[] = [];

  const strong = (report.riskAssessment.protectiveFactors ?? [])
    .filter(f => f.strength === 'strong')
    .map(f => f.text)
    .slice(0, 3);
  list.push(...strong);

  const happiness = report.navamsaMatching.maritalHappiness;
  if (happiness && !list.some(l => l === happiness)) list.push(happiness);

  const preds = (report.spousePrediction.predictions ?? []).slice(0, 2);
  list.push(...preds);

  if (report.navamsaMatching.familyRelations) {
    list.push(report.navamsaMatching.familyRelations);
  }

  return [...new Set(list)].slice(0, 5);
}

function getChallenges(report: CompatibilityReport): string[] {
  const list: string[] = [];

  const yogas = (report.riskAssessment.detectedYogas ?? [])
    .filter(y => y.severity !== 'mild')
    .map(y => `${y.name}: ${y.description}`)
    .slice(0, 2);
  list.push(...yogas);

  const peopleTriggers = report.conflictZone.people.slice(0, 1).map(t => t.description);
  list.push(...peopleTriggers);

  const ideologyTriggers = report.conflictZone.ideology.slice(0, 1).map(t => t.description);
  list.push(...ideologyTriggers);

  if (report.riskAssessment.divorceProbability.level !== 'low') {
    const ind = report.riskAssessment.divorceProbability.indicators?.[0]?.text;
    if (ind) list.push(ind);
  }

  return [...new Set(list)].filter(Boolean).slice(0, 5);
}

// ── Timing ───────────────────────────────────────────────────────────────────

function getWindows(report: CompatibilityReport) {
  const favourable = (report.timing.favorablePeriods ?? []).slice(0, 2).map(p => ({
    type: 'good' as const,
    label: p.description,
    date: new Date(p.startDate).getFullYear(),
  }));
  const vulnerable = (report.timing.vulnerablePeriods ?? []).slice(0, 2).map(p => ({
    type: 'caution' as const,
    label: p.description,
    date: new Date(p.startDate).getFullYear(),
  }));
  return [...favourable, ...vulnerable].sort((a, b) => a.date - b.date);
}

// ── Overall verdict ──────────────────────────────────────────────────────────

function getOverallVerdict(domains: Domain[]): { label: string; sub: string; color: string } {
  const avg = domains.reduce((s, d) => s + d.score, 0) / domains.length;
  if (avg >= 70) return { label: 'This marriage predominantly brings growth and happiness', sub: 'Planetary energies align to support a fulfilling life together', color: 'from-emerald-500 to-teal-500' };
  if (avg >= 55) return { label: 'A balanced union — joys and trials arrive together', sub: 'Neither a bed of roses nor a field of thorns — wisdom wins here', color: 'from-amber-500 to-orange-400' };
  return { label: 'Significant life tests will accompany this marriage', sub: 'The stars call for awareness, effort, and the right remedies', color: 'from-rose-500 to-pink-500' };
}

// ── Component ────────────────────────────────────────────────────────────────

export const LifeAfterMarriageWidget: React.FC<Props> = ({ report }) => {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [showAllBlessings, setShowAllBlessings] = useState(false);
  const [showAllChallenges, setShowAllChallenges] = useState(false);

  const domains = buildDomains(report);
  const blessings = getBlessings(report);
  const challenges = getChallenges(report);
  const windows = getWindows(report);
  const verdict = getOverallVerdict(domains);

  const visibleBlessings = showAllBlessings ? blessings : blessings.slice(0, 3);
  const visibleChallenges = showAllChallenges ? challenges : challenges.slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Life After Marriage</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">What this union brings to every dimension of life</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">

        {/* Overall verdict banner */}
        <div className={`bg-gradient-to-r ${verdict.color} rounded-xl p-4 text-white`}>
          <p className="font-semibold text-sm leading-snug">{verdict.label}</p>
          <p className="text-xs mt-1 text-white/80">{verdict.sub}</p>
        </div>

        {/* 6 Life Domain Cards */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            Impact Across Life Areas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {domains.map(domain => {
              const tier = scoreToTier(domain.score);
              const s = TIER_STYLES[tier];
              const isOpen = expandedDomain === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => setExpandedDomain(isOpen ? null : domain.id)}
                  className="text-left bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-700/50 w-full"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={s.text}>{domain.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{domain.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{domain.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                    </div>
                  </div>
                  {/* Score bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400 dark:text-gray-500">Strength</span>
                      <span className={`text-xs font-bold ${s.text}`}>{domain.score}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${s.bar} rounded-full transition-all`} style={{ width: `${domain.score}%` }} />
                    </div>
                  </div>
                  {/* Expanded detail */}
                  {isOpen && (
                    <p className="mt-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-3">
                      {domain.detail}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Blessings & Challenges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Blessings */}
          <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30">
            <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              What This Marriage Brings
            </h3>
            {blessings.length === 0 ? (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Consult a detailed report for specific blessings.</p>
            ) : (
              <ul className="space-y-2">
                {visibleBlessings.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✦</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {blessings.length > 3 && (
              <button
                onClick={() => setShowAllBlessings(!showAllBlessings)}
                className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {showAllBlessings ? 'Show less' : `+${blessings.length - 3} more`}
              </button>
            )}
          </div>

          {/* Challenges */}
          <div className="bg-rose-50 dark:bg-rose-950/20 rounded-xl p-4 border border-rose-100 dark:border-rose-900/30">
            <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              What to Navigate
            </h3>
            {challenges.length === 0 ? (
              <p className="text-xs text-rose-600 dark:text-rose-400">No major challenges detected in the chart data.</p>
            ) : (
              <ul className="space-y-2">
                {visibleChallenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-rose-800 dark:text-rose-300">
                    <span className="text-rose-400 mt-0.5 flex-shrink-0">▲</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            )}
            {challenges.length > 3 && (
              <button
                onClick={() => setShowAllChallenges(!showAllChallenges)}
                className="mt-3 text-xs text-rose-600 dark:text-rose-400 hover:underline"
              >
                {showAllChallenges ? 'Show less' : `+${challenges.length - 3} more`}
              </button>
            )}
          </div>
        </div>

        {/* Critical Timing Windows */}
        {windows.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Life Turning Points
            </h3>
            <div className="space-y-2">
              {windows.map((w, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-lg p-3 text-xs ${
                    w.type === 'good'
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30'
                      : 'bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30'
                  }`}
                >
                  <span className="flex-shrink-0 mt-0.5">
                    {w.type === 'good'
                      ? <Sun className="w-3.5 h-3.5 text-emerald-500" />
                      : <CloudRain className="w-3.5 h-3.5 text-amber-500" />}
                  </span>
                  <div>
                    <span className={`font-semibold ${w.type === 'good' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                      {w.date}
                    </span>
                    <span className={`ml-2 ${w.type === 'good' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                      {w.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Protective Factors Summary */}
        {(report.riskAssessment.protectiveFactors ?? []).filter(f => f.strength === 'strong').length > 0 && (
          <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/30">
            <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              What Protects This Marriage
            </h3>
            <ul className="space-y-1.5">
              {(report.riskAssessment.protectiveFactors ?? [])
                .filter(f => f.strength === 'strong')
                .slice(0, 3)
                .map((f, i) => (
                  <li key={i} className="text-xs text-indigo-700 dark:text-indigo-300 flex items-start gap-2">
                    <span className="text-indigo-400 flex-shrink-0 mt-0.5">◆</span>
                    {f.text}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Navamsa Summary */}
        <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30">
          <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Navamsa (D9) — The Soul of This Marriage
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-purple-600 dark:text-purple-400 font-semibold mb-0.5">Happiness</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{report.navamsaMatching.maritalHappiness || '—'}</p>
            </div>
            <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-purple-600 dark:text-purple-400 font-semibold mb-0.5">Respect</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{report.navamsaMatching.mutualRespect || '—'}</p>
            </div>
            <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-purple-600 dark:text-purple-400 font-semibold mb-0.5">Family</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{report.navamsaMatching.familyRelations || '—'}</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 dark:text-gray-600 text-center leading-relaxed">
          Astrological indicators show tendencies, not certainties. Free will and conscious effort shape the final outcome.
        </p>
      </div>
    </div>
  );
};
