import React, { useState } from 'react';
import { SelfAnalysisReport } from '../../types/selfAnalysis';
import {
  CheckCircle, Circle, Star, Shield, Heart, Clock, Brain,
  Sparkles, TrendingUp, AlertTriangle, Gem, Zap, Target
} from 'lucide-react';

interface MarriageReadinessWidgetProps {
  report: SelfAnalysisReport;
}

interface ReadinessItem {
  id: string;
  category: string;
  label: string;
  description: string;
  passed: boolean;
  weight: number;
  icon: React.ReactNode;
}

export const MarriageReadinessWidget: React.FC<MarriageReadinessWidgetProps> = ({ report }) => {
  const [showDetails, setShowDetails] = useState(true);

  const mp = report?.marriagePotential;
  const timing = report?.timingForecast;
  const psych = report?.psychologicalProfile;
  const mh = report?.mentalHealth;
  const doshas = report?.doshaAnalysis;
  const addictionRisk = report?.addictionRisk;

  // If marriagePotential is missing, show fallback
  if (!mp) {
    return (
      <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">Marriage readiness data not available. Please regenerate your report.</p>
      </div>
    );
  }

  // Build checklist from report data
  const items: ReadinessItem[] = [
    // Core indicators
    {
      id: 'score',
      category: 'Core',
      label: 'Marriage Potential Score Above 50',
      description: `Your score: ${mp.score ?? 0}/100`,
      passed: (mp.score ?? 0) >= 50,
      weight: 15,
      icon: <Star className="w-4 h-4" />
    },
    {
      id: '7th-house',
      category: 'Core',
      label: '7th House Strength Above 50',
      description: `7th House: ${mp.seventhHouseStrength ?? 0}/100`,
      passed: (mp.seventhHouseStrength ?? 0) >= 50,
      weight: 12,
      icon: <Target className="w-4 h-4" />
    },
    {
      id: 'navamsa',
      category: 'Core',
      label: 'Navamsa Quality Above 50',
      description: `Navamsa: ${mp.navamsaQuality ?? 0}/100`,
      passed: (mp.navamsaQuality ?? 0) >= 50,
      weight: 10,
      icon: <Gem className="w-4 h-4" />
    },
    {
      id: 'dasha',
      category: 'Core',
      label: 'Favorable Dasha Period Active',
      description: `Dasha support: ${mp.dashaSupport ?? 0}/100`,
      passed: (mp.dashaSupport ?? 0) >= 50,
      weight: 12,
      icon: <Clock className="w-4 h-4" />
    },

    // Timing
    {
      id: 'timing-window',
      category: 'Timing',
      label: 'Marriage Window Identified',
      description: timing?.nextMarriageWindow?.yearRange ? `Window: ${timing.nextMarriageWindow.yearRange}` : 'No specific window identified',
      passed: !!(timing?.nextMarriageWindow?.yearRange),
      weight: 8,
      icon: <Clock className="w-4 h-4" />
    },
    {
      id: 'no-delays',
      category: 'Timing',
      label: 'No Major Delay Indicators',
      description: `${(mp.delayIndicators || []).length} delay indicator(s) found`,
      passed: (mp.delayIndicators || []).length <= 1,
      weight: 8,
      icon: <TrendingUp className="w-4 h-4" />
    },

    // Psychological
    {
      id: 'mental-health',
      category: 'Psychological',
      label: 'Mental Wellbeing Stable',
      description: `Overall: ${mh?.overallWellbeing || 'unknown'}`,
      passed: mh?.overallWellbeing === 'strong' || mh?.overallWellbeing === 'moderate',
      weight: 8,
      icon: <Brain className="w-4 h-4" />
    },
    {
      id: 'low-addiction',
      category: 'Psychological',
      label: 'Low Addiction Risk',
      description: `Risk level: ${addictionRisk?.overallRisk || 'unknown'}`,
      passed: addictionRisk?.overallRisk === 'low' || addictionRisk?.overallRisk === 'moderate',
      weight: 7,
      icon: <Shield className="w-4 h-4" />
    },

    // Dosha
    {
      id: 'no-severe-dosha',
      category: 'Doshas',
      label: 'No Severe Doshas Present',
      description: `${(doshas?.doshas || []).filter((d: any) => d.severity === 'severe').length} severe dosha(s)`,
      passed: (doshas?.doshas || []).filter((d: any) => d.severity === 'severe').length === 0,
      weight: 10,
      icon: <Shield className="w-4 h-4" />
    },
    {
      id: 'marriage-quality',
      category: 'Core',
      label: 'Marriage Quality Not Low',
      description: `Quality: ${mp.marriageQuality || 'unknown'}`,
      passed: mp.marriageQuality ? mp.marriageQuality !== 'low' : false,
      weight: 10,
      icon: <Heart className="w-4 h-4" />
    },
  ];

  // Calculate readiness score
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const earnedWeight = items.filter(i => i.passed).reduce((sum, item) => sum + item.weight, 0);
  const readinessScore = Math.round((earnedWeight / totalWeight) * 100);
  const passedCount = items.filter(i => i.passed).length;

  // Categories
  const categories = [...new Set(items.map(i => i.category))];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Highly Ready';
    if (score >= 60) return 'Moderately Ready';
    if (score >= 40) return 'Preparation Needed';
    return 'Significant Work Needed';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  // SVG Gauge
  const gaugeRadius = 80;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeOffset = gaugeCircumference - (readinessScore / 100) * gaugeCircumference;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Sparkles className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <Sparkles className="w-10 h-10 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Marriage Readiness</h2>
              <p className="text-emerald-200/80">Gamified checklist of your preparedness</p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Gauge */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 flex flex-col items-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={gaugeRadius} fill="none" stroke="#e5e7eb" strokeWidth="12" className="dark:stroke-gray-600" />
            <circle
              cx="100" cy="100" r={gaugeRadius} fill="none"
              stroke={readinessScore >= 80 ? '#10b981' : readinessScore >= 60 ? '#f59e0b' : '#ef4444'}
              strokeWidth="12" strokeLinecap="round"
              strokeDasharray={gaugeCircumference}
              strokeDashoffset={gaugeOffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor(readinessScore)}`}>{readinessScore}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">/ 100</span>
          </div>
        </div>
        <p className={`mt-4 text-lg font-semibold ${getScoreColor(readinessScore)}`}>{getScoreLabel(readinessScore)}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{passedCount}/{items.length} criteria met</p>

        {/* Progress bar */}
        <div className="w-full mt-6">
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(readinessScore)}`}
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist by Category */}
      <div className="space-y-4">
        {categories.map(category => {
          const categoryItems = items.filter(i => i.category === category);
          const categoryPassed = categoryItems.filter(i => i.passed).length;
          return (
            <div key={category} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{category}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{categoryPassed}/{categoryItems.length}</span>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {categoryItems.map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-4">
                    <div className="mt-0.5">
                      {item.passed ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${item.passed ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                    </div>
                    <div className={`shrink-0 p-1.5 rounded-lg ${item.passed ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                      {item.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Items */}
      {items.filter(i => !i.passed).length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800/50">
          <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Areas to Work On
          </h3>
          <div className="space-y-2">
            {items.filter(i => !i.passed).map(item => (
              <div key={item.id} className="flex items-start gap-2 text-sm">
                <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <span className="text-amber-700 dark:text-amber-300">{item.label} — {item.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
