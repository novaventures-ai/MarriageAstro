import React, { useState } from 'react';
import { CompatibilityReport } from '../../types';
import { Heart, AlertTriangle, CheckCircle, Info, Star, Target, Shield, BookOpen, Activity, Grid3X3, ChevronDown } from 'lucide-react';
import { AIVerdictGenerator } from '../ai/AIVerdictGenerator';

interface OverviewWidgetProps {
  report: CompatibilityReport;
  viewMode: 'executive' | 'detailed';
}

export const OverviewWidget: React.FC<OverviewWidgetProps> = ({ report, viewMode }) => {
  const { executiveSummary, overallScore, overallVerdict } = report;
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  const togglePillar = (key: string) => {
    setExpandedPillar(expandedPillar === key ? null : key);
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'excellent': return 'text-green-600 dark:text-green-400';
      case 'very_good': return 'text-emerald-600 dark:text-emerald-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'fair': return 'text-yellow-600 dark:text-yellow-400';
      case 'challenging': return 'text-orange-600 dark:text-orange-400';
      case 'poor': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTrafficLightColor = (status: string) => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Score Circle */}
          <div className="relative">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-700"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${overallScore * 4.4} 440`}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{overallScore}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">out of 100</span>
            </div>
          </div>

          {/* Verdict */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">
              {overallVerdict.replace('_', ' ').toUpperCase()}
            </h2>
            <p className={`text-lg font-medium ${getVerdictColor(overallVerdict)} mb-4 transition-colors`}>
              {executiveSummary.verdict}
            </p>

            {/* Traffic Light */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Status:</span>
              <div className={`w-4 h-4 rounded-full ${getTrafficLightColor(executiveSummary.trafficLightStatus)}`} />
              <span className="text-sm font-medium capitalize text-gray-800 dark:text-gray-200 transition-colors">
                {executiveSummary.trafficLightStatus} Light
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Score Breakdown Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors border border-indigo-100 dark:border-indigo-900/30">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-6 h-6 text-indigo-500" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Comprehensive Analysis Scorecard</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(report.advancedBreakdown || {}).map(([key, pillar]: [string, any], idx) => {
            const Icon = {
              tradition: BookOpen,
              promise: Target,
              soul: Star,
              interaction: Heart,
              stability: Shield
            }[key] || Info;

            const statusColors = {
              positive: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
              neutral: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
              challenging: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
            }[pillar.status as 'positive' | 'neutral' | 'challenging'] || 'text-gray-600 bg-gray-50';

            const isExpanded = expandedPillar === key;

            return (
              <div
                key={key}
                className="p-5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 transition-all hover:shadow-lg group animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div
                  className="flex justify-between items-start mb-4 cursor-pointer group/header"
                  onClick={() => togglePillar(key)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${statusColors}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">{key}</span>
                        {pillar.breakdown && (
                          <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight group-hover/header:text-indigo-600 transition-colors">{pillar.label}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{pillar.score}%</span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>

                {isExpanded && pillar.breakdown && (
                  <div className="mb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {pillar.breakdown.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
                            <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${item.score}%` }} />
                          </div>
                          <span className="font-bold text-gray-700 dark:text-gray-300 w-8 text-right">{item.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    <span className="font-semibold text-indigo-500 dark:text-indigo-400 mr-1">Insight:</span>
                    {pillar.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-start gap-3 p-5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/20">
          <Info className="w-5 h-5 text-indigo-500 mt-1 flex-shrink-0" />
          <div className="space-y-1">
            <h5 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">About this Scorecard</h5>
            <p className="text-xs text-indigo-700/80 dark:text-indigo-400/80 leading-relaxed">
              This proper breakdown integrates high-precision Krishnamurti Paddhati (KP) rules, Traditional Vedic Guna Milan, Jaimini Maharishi's soul constructs,
              and Modern Synastry dynamics. Each pillar is weighted specifically to reflect long-term marital success probabilities.
            </p>
          </div>
        </div>
      </div>

      {/* AI Verdict Generator */}
      <AIVerdictGenerator report={report} />

      {/* Detailed View Content */}
      {viewMode === 'detailed' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 transition-colors" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 transition-colors">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {executiveSummary.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 transition-colors">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 transition-colors" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 transition-colors">Challenges</h3>
            </div>
            <ul className="space-y-3">
              {executiveSummary.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 transition-colors">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Soul Level Summary (Takeaway Card) */}
      <div className="mt-8 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl shadow-xl p-1 overflow-hidden transition-all hover:scale-[1.01] duration-500">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-[14px] p-6 h-full border border-white/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
              <Star className="w-8 h-8 text-rose-600 dark:text-rose-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">Soul Level Takeaway</h3>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Jaimini Atmakaraka Connection</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-rose-500" />
                The Core Synthesis
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Your relationship is fundamentally driven by a <strong>Soul-to-Soul</strong> blueprint.
                Beyond transactional compatibility, the alignment of Atmakarakas signifies a deep karmic obligation
                to support each other&apos;s spiritual evolution and emotional security.
              </p>
            </div>
            <div className="bg-rose-50 dark:bg-rose-900/10 rounded-xl p-4 border border-rose-100 dark:border-rose-800/20">
              <h4 className="font-bold text-rose-800 dark:text-rose-200 text-sm mb-2">Preservation Key</h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed font-semibold italic">
                &quot;True stability comes from recognizing the silent mirror your partner holds to your own soul.
                When conflict arises, look for the internal transformation it is asking of you.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewWidget;