/**
 * Self Overview Widget
 * Executive summary for self analysis report
 */

import React, { useState } from 'react';
import { SelfAnalysisReport } from '../../types/selfAnalysis';
import {
  Sparkles,
  Heart,
  Clock,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Wand2
} from 'lucide-react';
import { useSelfAI } from '../../hooks/useSelfAI';
import ReactMarkdown from 'react-markdown';

interface SelfOverviewWidgetProps {
  report: SelfAnalysisReport;
}

export const SelfOverviewWidget: React.FC<SelfOverviewWidgetProps> = ({ report }) => {
  const [activeInsight, setActiveInsight] = useState<string | null>(null);
  const { insight, loading, error, generateInsight } = useSelfAI(report);

  const getAIInsight = async (type: any) => {
    setActiveInsight(type);
    await generateInsight(type);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
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
      {/* AI Guide Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Wand2 className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">🤖 AI Marriage Counselor</h2>
            <p className="text-purple-100 mb-4">
              Get personalized insights about your marriage journey
            </p>

            <div className="flex flex-wrap gap-2 no-print">
              <button
                onClick={() => getAIInsight('SELF_GUIDE')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                disabled={loading}
              >
                {loading && activeInsight === 'SELF_GUIDE' ? (
                  <RefreshCw className="w-4 h-4 animate-spin inline mr-1" />
                ) : null}
                Overall Guidance
              </button>
              <button
                onClick={() => getAIInsight('TIMING_FORECAST')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                disabled={loading}
              >
                {loading && activeInsight === 'TIMING_FORECAST' ? (
                  <RefreshCw className="w-4 h-4 animate-spin inline mr-1" />
                ) : null}
                Timing Prediction
              </button>
              <button
                onClick={() => getAIInsight('PERSONAL_REMEDIES')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                disabled={loading}
              >
                {loading && activeInsight === 'PERSONAL_REMEDIES' ? (
                  <RefreshCw className="w-4 h-4 animate-spin inline mr-1" />
                ) : null}
                My Remedies
              </button>
            </div>
          </div>
        </div>

        {/* AI Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-200 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </p>
          </div>
        )}

        {/* AI Response */}
        {insight && (
          <div className="mt-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>
                {insight}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Marriage Potential Score */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Score Circle */}
          <div className="relative">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className={`${getScoreColor(report.marriagePotential.score)}`}
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${report.marriagePotential.score * 4.4} 440`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                {report.marriagePotential.score}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/100</span>
            </div>
          </div>

          {/* Score Details */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${getTrafficLightColor(report.marriagePotential.trafficLightStatus)}`} />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 capitalize">
                {report.marriagePotential.verdict.replace('_', ' ')}
              </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {report.executiveSummary.oneLineSummary}
            </p>

            <div className="grid grid-cols-3 gap-4">
              <ScorePillar
                label="7th House"
                score={report.marriagePotential.seventhHouseStrength}
                icon={Shield}
              />
              <ScorePillar
                label="Navamsa"
                score={report.marriagePotential.navamsaQuality}
                icon={Sparkles}
              />
              <ScorePillar
                label="Dasha"
                score={report.marriagePotential.dashaSupport}
                icon={Clock}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Timing */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Marriage Timing
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Best Window: </span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {report.timingForecast?.nextMarriageWindow.yearRange || 'Calculating...'}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Expected Age: </span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {report.marriagePotential.expectedMarriageAge.min && !isNaN(report.marriagePotential.expectedMarriageAge.min)
                  ? `${report.marriagePotential.expectedMarriageAge.min}-${report.marriagePotential.expectedMarriageAge.max} years`
                  : 'Analyzing...'}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Quality: </span>
              <span className={`font-medium capitalize ${getScoreColor(
                report.marriagePotential.marriageQuality === 'high' ? 80 :
                  report.marriagePotential.marriageQuality === 'medium' ? 50 : 30
              )}`}>
                {report.marriagePotential.marriageQuality}
              </span>
            </div>
          </div>
        </div>

        {/* Spouse Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Future Spouse
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Field: </span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {report.spouseDetailedProfile?.career.field || 'Analysis pending'}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Archetype: </span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {report.spouseDetailedProfile?.career.archetype || 'Analyzing...'}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Meeting: </span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {report.spouseDetailedProfile?.meetingCircumstances.how || 'TBD'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Challenges */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Your Strengths
            </h3>
          </div>
          <ul className="space-y-2">
            {report.marriagePotential.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <TrendingUp className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Challenges */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Areas to Work On
            </h3>
          </div>
          <ul className="space-y-2">
            {report.marriagePotential.challenges.map((challenge, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                {challenge}
              </li>
            ))}
          </ul>
          {report.marriagePotential.challenges.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No major challenges identified! Your chart is well-balanced.
            </p>
          )}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Recommended Actions
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {report.executiveSummary.actionItems.map((action, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <span className="text-gray-700 dark:text-gray-300">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Advice */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
          Overall Advice
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {report.executiveSummary.overallAdvice}
        </p>
      </div>
    </div>
  );
};

// Score Pillar Component
const ScorePillar: React.FC<{
  label: string;
  score: number;
  icon: React.ElementType;
}> = ({ label, score, icon: Icon }) => (
  <div className="text-center">
    <div className="flex items-center justify-center gap-1 mb-1">
      <Icon className="w-4 h-4 text-gray-400" />
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
    <div className={`text-xl font-bold ${score >= 70 ? 'text-green-600 dark:text-green-400' :
      score >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
        'text-red-600 dark:text-red-400'
      }`}>
      {score}%
    </div>
  </div>
);

export default SelfOverviewWidget;
