import React, { useState } from 'react';
import { AshtakootResult } from '../../types';
import { CheckCircle, AlertCircle, Star, ChevronDown, ChevronUp, HelpCircle, BookOpen, Info, Sparkles, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useGeminiInsight } from '../../hooks/useGeminiInsight';

interface AshtakootWidgetProps {
  ashtakoot: AshtakootResult;
  viewMode: 'executive' | 'detailed';
  nakshatraA?: string;
  nakshatraB?: string;
  nameA?: string;
  nameB?: string;
  detailedNakshatraCompat?: {
    score: number;
    description: string;
    bestMatch: boolean;
    worstMatch: boolean;
  };
}

export const AshtakootWidget: React.FC<AshtakootWidgetProps> = ({
  ashtakoot,
  viewMode,
  nakshatraA,
  nakshatraB,
  nameA = 'Partner A',
  nameB = 'Partner B',
  detailedNakshatraCompat
}) => {
  const { totalScore, maxScore, percentage, parameters, doshas, exceptions } = ashtakoot;
  const [showNakshatraDetails, setShowNakshatraDetails] = useState(false);
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [expandedParam, setExpandedParam] = useState<string | null>(null);
  const { loading, insight, error, triggerAnalysis } = useGeminiInsight();

  const getScoreColor = (score: number, max: number) => {
    const ratio = score / max;
    if (ratio >= 0.8) return 'text-green-600 dark:text-green-400';
    if (ratio >= 0.6) return 'text-blue-600 dark:text-blue-400';
    if (ratio >= 0.4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 28) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30';
    if (score >= 20) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30';
    if (score >= 18) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30';
  };

  const parameterList = [
    {
      key: 'varna',
      label: 'Varna (Spiritual Development)',
      max: 1,
      description: 'Compares spiritual evolution and ego levels',
      detailInfo: 'Varna represents spiritual development. There are 4 levels: Brahmin (highest, spiritual), Kshatriya (rulers, warriors), Vaishya (merchants), and Shudra (workers). Partners should ideally be in the same or compatible varnas for spiritual harmony.'
    },
    {
      key: 'vashya',
      label: 'Vashya (Mutual Attraction)',
      max: 2,
      description: 'Measures who influences whom in the relationship',
      detailInfo: 'Vashya shows the power dynamic and attraction. There are 5 categories: Manava (humans), Vanachara (wild animals), Chatushpada (domestic animals), Jalchara (water creatures), and Keeta (insects). Compatible vashyas create balanced attraction.'
    },
    {
      key: 'tara',
      label: 'Tara (Destiny/Star Compatibility)',
      max: 3,
      description: 'Based on nakshatra positions - destiny alignment',
      detailInfo: 'Tara measures destiny compatibility by counting nakshatras from one partner to another. The 9 tara positions are: Janma (birth), Sampat (wealth), Vipat (obstacles), Kshema (well-being), Pratyari (enemy), Sadhaka (success), Vadha (death), Mitra (friend), and Ati-mitra (best friend). Favorable taras bring good fortune.'
    },
    {
      key: 'yoni',
      label: 'Physical Nature Compatibility (Yoni)',
      max: 4,
      description: 'Animal symbols representing physical nature',
      detailInfo: 'Yoni represents the animal nature and physical compatibility. Each nakshatra has an animal symbol (Horse, Elephant, Snake, etc.). Friendly animal pairs score high (4 points), neutral score medium (2-3), and enemy animals score low (0-1). This affects physical attraction and satisfaction.'
    },
    {
      key: 'grahaMaitri',
      label: 'Graha Maitri (Planetary Friendship)',
      max: 5,
      description: 'Relationship between Moon sign lords',
      detailInfo: 'Graha Maitri examines the friendship between the lords of your Moon signs. Natural friends (like Sun-Mars-Jupiter) score 5 points, neutral relationships score 3, and enemies (like Sun-Saturn) score 0. This determines mental harmony and emotional understanding.'
    },
    {
      key: 'gana',
      label: 'Gana (Temperament)',
      max: 6,
      description: 'Deva (godly), Manushya (human), Rakshasa (demonic)',
      detailInfo: 'Gana represents temperament. Deva (godly) are gentle, kind, and spiritual. Manushya (human) are practical and balanced. Rakshasa (demonic) are intense, passionate, and strong-willed. Deva-Deva or Manushya-Manushya matches are best. Deva-Rakshasa can work with effort. This affects daily compatibility and temperament harmony.'
    },
    {
      key: 'bhakoot',
      label: 'Bhakoot (Relative Moon Positions)',
      max: 7,
      description: 'Moon sign positions and their effects',
      detailInfo: 'Bhakoot measures the relative position of Moon signs. Certain positions (2/12, 5/9, 6/8) create dosha (problems) affecting wealth, health, or progeny. Good positions (1/1, 1/7, 3/11, 4/10) bring harmony. This is important for prosperity and well-being in marriage.'
    },
    {
      key: 'nadi',
      label: 'Nadi (Health & Progeny)',
      max: 8,
      description: 'Ayurvedic constitution - most important parameter',
      detailInfo: 'Nadi is the MOST IMPORTANT parameter (8 points). It represents the Ayurvedic dosha: Vata (air), Pitta (fire), or Kapha (water). Partners should have different nadis for health and progeny. Same nadi creates Nadi Dosha, indicating potential health issues for offspring or genetic incompatibility.'
    },
  ];

  const HelpBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-colors">
      <div className="flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">{title}</h5>
          <div className="text-sm text-blue-700 dark:text-blue-300">{children}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Educational Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white transition-all">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Star className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Ashtakoot Milan (36-Point System)</h2>
            <p className="text-indigo-100 leading-relaxed">
              Ashtakoot Milan is the traditional Vedic compatibility system that analyzes <strong>8 different parameters</strong>
              to assess marriage compatibility. Each parameter evaluates a different aspect of relationship harmony:
              spiritual development, attraction, destiny, physical compatibility, mental friendship, temperament,
              relative positions, and health/progeny. Maximum score is 36 points.
            </p>
          </div>
        </div>
      </div>

      {/* Score Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center w-full">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Your Compatibility Score</h2>
            <p className="text-gray-600 dark:text-gray-400 transition-colors">Based on 8 traditional parameters</p>
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-colors ${getScoreBgColor(totalScore)} mb-6`}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Total Score */}
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 transition-colors ${totalScore >= 28 ? 'text-green-600 dark:text-green-400' :
                totalScore >= 20 ? 'text-blue-600 dark:text-blue-400' :
                  totalScore >= 18 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                }`}>
                {totalScore}<span className="text-2xl text-gray-400 dark:text-gray-500">/{maxScore}</span>
              </div>
              <div className="text-lg font-medium text-gray-700 dark:text-gray-300 transition-colors">
                {percentage.toFixed(1)}% Match
              </div>
            </div>

            {/* Interpretation */}
            <div className="text-left max-w-md">
              {totalScore >= 28 && (
                <div className="text-green-600 dark:text-green-400 font-semibold text-lg transition-colors">Excellent Match (28-36 points)</div>
              )}
              {totalScore >= 20 && totalScore < 28 && (
                <div className="text-blue-600 dark:text-blue-400 font-semibold text-lg transition-colors">Good Match (20-27 points)</div>
              )}
              {totalScore >= 18 && totalScore < 20 && (
                <div className="text-yellow-600 dark:text-yellow-400 font-semibold text-lg transition-colors">Average Match (18-19 points)</div>
              )}
              {totalScore < 18 && (
                <div className="text-red-600 dark:text-red-400 font-semibold text-lg transition-colors">Below Average Match (&lt;18 points)</div>
              )}

              <p className="text-gray-700 dark:text-gray-300 mt-2 transition-colors">
                {totalScore >= 28
                  ? 'Outstanding compatibility! Your charts show strong alignment across most parameters. Marriage is highly recommended from traditional standpoint.'
                  : totalScore >= 24
                    ? 'Very good compatibility with minor areas for attention. Strong foundation for marriage.'
                    : totalScore >= 20
                      ? 'Good compatibility overall. Some differences exist but can be managed with understanding.'
                      : totalScore >= 18
                        ? 'Acceptable match but requires conscious effort. Consider remedies and compatibility in other areas.'
                        : 'Significant differences detected. Careful consideration advised. Consult an astrologer for remedies if proceeding.'}
              </p>
            </div>
          </div>
        </div>

        {/* Score Guide */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800/30 text-center transition-colors">
            <span className="text-green-700 dark:text-green-400 font-bold">28-36:</span>
            <p className="text-green-600 dark:text-green-500">Excellent</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800/30 text-center transition-colors">
            <span className="text-blue-700 dark:text-blue-400 font-bold">20-27:</span>
            <p className="text-blue-600 dark:text-blue-500">Good</p>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800/30 text-center transition-colors">
            <span className="text-yellow-700 dark:text-yellow-400 font-bold">18-19:</span>
            <p className="text-yellow-600 dark:text-yellow-500">Average</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800/30 text-center transition-colors">
            <span className="text-red-700 dark:text-red-400 font-bold">Below 18:</span>
            <p className="text-red-600 dark:text-red-500">Challenging</p>
          </div>
        </div>

        {/* AI Analysis Button & Insight */}
        <div className="mt-8">
          {!insight ? (
            <div className="flex justify-center">
              <button
                onClick={() => triggerAnalysis('ASHTAKOOT_ANALYSIS', { total: totalScore, doshas, exceptions, nameA, nameB })}
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Decode with Vedic AI
              </button>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-6 text-center">
              <div className="flex justify-center mb-2">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
              <button
                onClick={() => triggerAnalysis('ASHTAKOOT_ANALYSIS', { total: totalScore, doshas, exceptions, nameA, nameB })}
                className="text-sm font-semibold text-red-700 dark:text-red-200 hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 border border-violet-200 dark:border-violet-800/30 rounded-xl p-6 relative overflow-hidden transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-violet-600 dark:text-violet-400" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-violet-900 dark:text-violet-100">Vedic Pundit Understanding</h3>
                      <p className="text-xs text-violet-700 dark:text-violet-300">AI Analysis of Doshas & Cancellations</p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerAnalysis('ASHTAKOOT_ANALYSIS', { total: totalScore, doshas, exceptions, nameA, nameB })}
                    className="text-xs flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:underline"
                    disabled={loading}
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    Regenerate
                  </button>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                  <ReactMarkdown>{insight}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Doshas Alert */}
        {(doshas.nadiDosha || doshas.bhakootDosha || doshas.ganaDosha) && (
          <div className="mt-8 p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg transition-colors">
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Doshas (Obstacles) Detected
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
              Doshas indicate areas of potential challenge. However, many doshas can be cancelled or mitigated
              through specific remedies. Consult a Vedic astrologer for guidance.
            </p>
            <div className="flex gap-3 flex-wrap">
              {doshas.nadiDosha && (
                <div className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg text-sm transition-colors">
                  <strong>Nadi Dosha</strong> - Same constitution, potential health/progeny concerns
                </div>
              )}
              {doshas.bhakootDosha && (
                <div className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg text-sm transition-colors">
                  <strong>Bhakoot Dosha</strong> - Moon position conflict, affects prosperity
                </div>
              )}
              {doshas.ganaDosha && (
                <div className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg text-sm transition-colors">
                  <strong>Gana Dosha</strong> - Temperament mismatch, daily friction possible
                </div>
              )}
            </div>
          </div>
        )}

        {/* Exceptions */}
        {exceptions.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg transition-colors">
            <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Dosha Cancellations (Remedial Factors)
            </h3>
            <p className="text-sm text-green-700 dark:text-green-400 mb-2">
              Good news! The following factors help cancel or reduce the dosha effects:
            </p>
            <ul className="space-y-2">
              {exceptions.map((exception, index) => (
                <li key={index} className="text-green-700 dark:text-green-400 text-sm flex items-start gap-2">
                  <span className="text-green-500 dark:text-green-400 mt-1">✓</span>
                  {exception}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Detailed Nakshatra Compatibility */}
        {detailedNakshatraCompat && nakshatraA && nakshatraB && (
          <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-200 dark:border-indigo-800/30 rounded-xl transition-all">
            <button
              onClick={() => setShowNakshatraDetails(!showNakshatraDetails)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h3 className="font-semibold text-indigo-900 dark:text-indigo-200">
                    Detailed Nakshatra Analysis
                  </h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-400">
                    {nakshatraA} + {nakshatraB}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold transition-colors ${detailedNakshatraCompat.score >= 80 ? 'text-green-600 dark:text-green-400' :
                  detailedNakshatraCompat.score >= 60 ? 'text-blue-600 dark:text-blue-400' :
                    detailedNakshatraCompat.score >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                  {detailedNakshatraCompat.score}/100
                </span>
                {showNakshatraDetails ? (
                  <ChevronUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
            </button>

            {showNakshatraDetails && (
              <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-800/30">
                <div className="flex gap-2 mb-3">
                  {detailedNakshatraCompat.bestMatch && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                      Best Match
                    </span>
                  )}
                  {detailedNakshatraCompat.worstMatch && (
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-sm font-medium">
                      Challenging Match
                    </span>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic transition-colors">
                  &quot;{detailedNakshatraCompat.description}&quot;
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detailed Parameter Breakdown */}
      {viewMode === 'detailed' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 transition-colors">8 Parameters Explained</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
                Click on each parameter to understand what it means
              </p>
            </div>
            <button
              onClick={() => setShowHelp(showHelp === 'params' ? null : 'params')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {showHelp === 'params' && (
            <HelpBox title="Understanding the 8 Parameters">
              Ashtakoot Milan analyzes 8 different dimensions of compatibility. Each parameter has different
              maximum points reflecting its importance. <strong>Nadi (8 points)</strong> is most important for health
              and progeny. <strong>Bhakoot (7 points)</strong> affects prosperity. <strong>Gana (6 points)</strong>
              determines daily temperament harmony. Together they create a comprehensive compatibility picture.
            </HelpBox>
          )}

          <div className="space-y-4">
            {parameterList.map((param) => {
              const paramData = parameters[param.key as keyof typeof parameters];
              if (!paramData) return null;
              const isExpanded = expandedParam === param.key;

              return (
                <div
                  key={param.key}
                  className={`p-4 rounded-lg transition-all ${isExpanded ? 'bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800/30' : 'bg-gray-50 dark:bg-gray-900/20 hover:bg-gray-100 dark:hover:bg-gray-900/40'}`}
                >
                  <div
                    className="flex justify-between items-start cursor-pointer"
                    onClick={() => setExpandedParam(isExpanded ? null : param.key)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">{param.label}</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-500 font-medium">(Max {param.max} points)</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors">{param.description}</p>
                    </div>
                    <div className={`text-2xl font-bold transition-colors ${getScoreColor(paramData.pointsObtained, paramData.maxPoints)}`}>
                      {paramData.pointsObtained}/{paramData.maxPoints}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3 transition-colors">
                    <div
                      className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(paramData.pointsObtained / paramData.maxPoints) * 100}%` }}
                    />
                  </div>

                  {/* Values */}
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-500 font-medium transition-colors">
                    {paramData.name === 'Graha Maitri' || paramData.name === 'Gana' || paramData.name === 'Nadi' ? (
                      <span>Values: {paramData.boyValue} + {paramData.girlValue}</span>
                    ) : (
                      <span>Values: {paramData.boyValue} → {paramData.girlValue}</span>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-indigo-100 dark:border-indigo-800/30 transition-colors">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">{param.detailInfo}</p>
                          <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
                            <strong>Your Result:</strong> {paramData.interpretation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AshtakootWidget;
