import React from 'react';
import { SexualHealthAnalysis } from '../../types';
import { Heart, Activity, AlertCircle, CheckCircle, Stethoscope, RefreshCw } from 'lucide-react';
import { useGeminiInsight } from '../../hooks/useGeminiInsight';
import ReactMarkdown from 'react-markdown';

interface SexualHealthWidgetProps {
  sexualHealth: SexualHealthAnalysis;
  partnerAName?: string;
  partnerBName?: string;
}

export const SexualHealthWidget: React.FC<SexualHealthWidgetProps> = ({
  sexualHealth,
  partnerAName = 'Partner A',
  partnerBName = 'Partner B'
}) => {
  const { maleHealth, femaleHealth, mutualSatisfaction, libidoA, libidoB, orientationA, orientationB } = sexualHealth;
  const { loading, insight, error, triggerAnalysis } = useGeminiInsight();

  const getRiskBadge = (risk: 'Low' | 'Medium' | 'High') => {
    switch (risk) {
      case 'Low':
        return <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium transition-colors">Low Risk</span>;
      case 'Medium':
        return <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium transition-colors">Medium Risk</span>;
      case 'High':
        return <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-medium transition-colors">High Risk</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Mutual Satisfaction Score */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3 transition-colors">
          <Heart className="w-7 h-7 text-pink-500 dark:text-pink-400" />
          Sexual Compatibility
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Score Circle */}
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                className="stroke-pink-100 dark:stroke-pink-900/20 transition-colors"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                className="stroke-pink-500 dark:stroke-pink-400 transition-all duration-500"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${mutualSatisfaction.score * 3.52} 352`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{mutualSatisfaction.score}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">/100</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Vibe Match:</span>
              <span className="ml-2 font-semibold text-indigo-600 dark:text-indigo-400 transition-colors">{mutualSatisfaction.vibeMatch}</span>
            </div>
            <div className="mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Element Compatibility:</span>
              <p className="text-gray-700 dark:text-gray-300 mt-1 transition-colors">{mutualSatisfaction.elementCompatibility}</p>
            </div>
            <p className="text-gray-700 dark:text-gray-200 font-medium transition-colors">{mutualSatisfaction.description}</p>
          </div>
        </div>
      </div>

      {/* AI Vedic Doctor Consult */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity className="w-32 h-32 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-yellow-300" />
                Consult Vedic Doctor
              </h3>
              <p className="text-emerald-100 text-sm mt-1">
                Get a discreet, holistic analysis of physical intimacy and vitality from "The Healer".
              </p>
            </div>
            <button
              onClick={() => triggerAnalysis('SEXUAL_HEALTH_ANALYSIS', {
                mars: 'Mars data context', // In a real app, pass actual Mars position
                venus: 'Venus data context', // In a real app, pass actual Venus position
                eighthHouse: '8th House context',
                twelfthHouse: '12th House context',
                partnerName: 'Both Partners'
              })}
              disabled={loading}
              className="px-5 py-2 bg-white text-emerald-700 rounded-lg font-bold shadow-lg hover:bg-emerald-50 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Stethoscope className="w-4 h-4" />}
              {insight ? 'Consult Again' : 'Analyze Vitality'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0" />
              <p className="text-sm text-white">{error}</p>
            </div>
          )}

          {insight && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20 animate-in fade-in slide-in-from-top-2 backdrop-blur-sm">
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown>{insight}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Male & Female Health Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Male Health */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 transition-colors">{partnerAName}&apos;s Sexual Health</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300 transition-colors">PME (Quick Release) Risk</span>
              {getRiskBadge(maleHealth.pmeRisk)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300 transition-colors">ED (Vitality) Risk</span>
              {getRiskBadge(maleHealth.edRisk)}
            </div>

            {/* Indicators */}
            {maleHealth.indicators.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Indicators:</h4>
                <ul className="space-y-1">
                  {maleHealth.indicators.map((indicator, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 transition-colors">
                      <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {maleHealth.recommendations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors">
                <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2 transition-colors">Recommendations:</h4>
                <ul className="space-y-1">
                  {maleHealth.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 transition-colors">
                      <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Female Health */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-pink-500 dark:text-pink-400" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 transition-colors">{partnerBName}&apos;s Sexual Health</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300 transition-colors">Frigidity (Low Desire) Risk</span>
              {getRiskBadge(femaleHealth.frigidityRisk)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300 transition-colors">Physical Pain Risk</span>
              {getRiskBadge(femaleHealth.physicalPainRisk)}
            </div>

            {/* Indicators */}
            {femaleHealth.indicators.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Indicators:</h4>
                <ul className="space-y-1">
                  {femaleHealth.indicators.map((indicator, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 transition-colors">
                      <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {femaleHealth.recommendations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors">
                <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2 transition-colors">Recommendations:</h4>
                <ul className="space-y-1">
                  {femaleHealth.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 transition-colors">
                      <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orientation and Libido Sections */}
      <div className="grid md:grid-cols-2 gap-6 pb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors border-l-4 border-indigo-500">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
            {partnerAName}&apos;s Modern Insights
          </h3>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Sexual Orientation Profile</span>
              <p className="font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{orientationA?.pattern || 'Conventional'}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{orientationA?.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors border-l-4 border-pink-500">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
            {partnerBName}&apos;s Modern Insights
          </h3>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Sexual Orientation Profile</span>
              <p className="font-semibold text-pink-600 dark:text-pink-400 mt-0.5">{orientationB?.pattern || 'Conventional'}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{orientationB?.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg transition-colors">
        <p className="text-sm text-blue-700 dark:text-blue-300 transition-colors">
          <strong>Note:</strong> This analysis is based on astrological indicators and should not
          replace professional medical advice. If you have concerns about sexual health, please
          consult a qualified healthcare provider.
        </p>
      </div>
    </div>
  );
};

export default SexualHealthWidget;