import React, { useState } from 'react';
import { SexualCompatibility, Chart } from '../../types';
import { ExtendedSexualCompatibility } from '../../types/extendedTypes';
import { Heart, Sparkles, Star, AlertTriangle, HelpCircle, BookOpen, MapPin, Eye, EyeOff } from 'lucide-react';

import nakshatraCompatData from '../../../knowledge/nakshatra_compatibility.json';
import yoniCompatData from '../../../knowledge/yoni_sexual_compatibility.json';
import yoniMatrixData from '../../../knowledge/yoni_matrix.json';

interface SexualCompatibilityWidgetProps {
  sexualCompatibility: SexualCompatibility;
  extendedSexualCompatibility?: ExtendedSexualCompatibility;
  partnerAName?: string;
  partnerBName?: string;
  chartA?: Chart;
  chartB?: Chart;
}

export const SexualCompatibilityWidget: React.FC<SexualCompatibilityWidgetProps> = ({
  sexualCompatibility,
  extendedSexualCompatibility,
  partnerAName = 'Partner A',
  partnerBName = 'Partner B',
  chartA,
  chartB
}) => {
  const { yoniMatch, nakshatraMatch, overallScore, recommendations } = sexualCompatibility;

  // Extract Moon nakshatra from chart data
  const getMoonNakshatra = (chart?: Chart): string | undefined => {
    if (!chart?.planetaryPositions) return undefined;
    const moon = chart.planetaryPositions.find(p => p.planet === 'Moon');
    return moon?.nakshatra;
  };

  const nakshatraA = getMoonNakshatra(chartA) || nakshatraMatch?.nakshatraA;
  const nakshatraB = getMoonNakshatra(chartB) || nakshatraMatch?.nakshatraB;
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'yoni' | 'nakshatra'>('overview');
  const [showSensitive, setShowSensitive] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30';
    if (score >= 60) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30';
    if (score >= 40) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30';
  };

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

  // Get Yoni details from knowledge base
  const getYoniDetails = (yoniName: string) => {
    // Extract animal name from format like "Vyaghra (Tiger)" -> "Tiger" or "Hare"
    let animalName = yoniName;
    const match = yoniName.match(/\(([^)]+)\)/);
    if (match) {
      animalName = match[1];
    }

    // Special mapping for inconsistencies
    const mapping: Record<string, string> = {
      'Deer': 'Mriga',
      'Hare': 'Mriga',
      'Snake': 'Sarpa',
      'Goat': 'Aja',
      'Sheep': 'Aja',
      'Camel': 'Ustra',
      'Mongoose': 'Nakula',
      'Dog': 'Shwaan',
      'Cat': 'Marjara',
      'Cow': 'Gow',
      'Buffalo': 'Mahisha',
      'Tiger': 'Vyaghra',
      'Lion': 'Simha',
      'Monkey': 'Vanar',
      'Rat': 'Mushaka',
      'Elephant': 'Gaja',
      'Horse': 'Ashwa'
    };

    const sanskritName = mapping[animalName] || animalName;
    const yoniInfo = (yoniCompatData as any).yoni_system.yonis[sanskritName];

    if (!yoniInfo) return null;

    return {
      nature: yoniInfo.sexual_nature.description.split('.')[0],
      temperament: yoniInfo.sexual_nature.characteristics[0],
      desires: yoniInfo.sexual_nature.characteristics,
      bestWith: yoniInfo.best_matches || [],
      challengingWith: yoniInfo.worst_matches || [],
      description: yoniInfo.sexual_nature.description
    };
  };

  // Get detailed Nakshatra compatibility
  const getNakshatraDetails = (nakshatra: string) => {
    const data = nakshatraCompatData.nakshatra_compatibility[nakshatra as keyof typeof nakshatraCompatData.nakshatra_compatibility];
    return data || null;
  };

  const yoniADetails = getYoniDetails(yoniMatch.yoniA);
  const yoniBDetails = getYoniDetails(yoniMatch.yoniB);
  const nakshatraADetails = nakshatraA ? getNakshatraDetails(nakshatraA) : null;
  const nakshatraBDetails = nakshatraB ? getNakshatraDetails(nakshatraB) : null;

  // Get compatibility between the two nakshatras
  const getNakshatraCompat = () => {
    if (!nakshatraA || !nakshatraB || !nakshatraADetails) return null;
    return nakshatraADetails.compatibility[nakshatraB as keyof typeof nakshatraADetails.compatibility] || null;
  };

  const nakshatraCompat = getNakshatraCompat();

  return (
    <div className="space-y-6">
      {/* Educational Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Physical & Intimate Compatibility</h2>
              <p className="text-purple-100 text-sm leading-relaxed max-w-2xl">
                Analysis of <strong>Yoni (Physical Nature)</strong> and <strong>Nakshatra (Psychological)</strong> chemistry.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSensitive(!showSensitive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${showSensitive
              ? 'bg-red-500 text-white shadow-inner'
              : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            title={showSensitive ? 'Hide Sensitive Anatomical Details' : 'Show Sensitive Anatomical Details'}
          >
            {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSensitive ? 'Sensitive: ON' : 'Show Detail'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs - Hidden in Print */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-2 flex gap-2 transition-colors no-print">
        {['overview', 'yoni', 'nakshatra'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === tab
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Overview Row */}
        {activeTab === 'overview' && (
          <div>
            <>
              {/* Overall Score */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Overall Compatibility Score</h3>
                  <button
                    onClick={() => setShowHelp(showHelp === 'overall' ? null : 'overall')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {showHelp === 'overall' && (
                  <HelpBox title="Understanding Your Score">
                    This score combines your <strong>Physical (Yoni) compatibility</strong> and <strong>Psychological (Nakshatra) compatibility</strong>.
                    Physical compatibility measures your natural physical attraction based on animal natures.
                    Psychological compatibility measures emotional connection based on Moon constellations.
                    Together they predict overall intimate satisfaction.
                  </HelpBox>
                )}

                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="12" fill="none" />
                      <circle
                        cx="80" cy="80" r="70"
                        stroke={overallScore >= 80 ? '#22c55e' : overallScore >= 60 ? '#3b82f6' : overallScore >= 40 ? '#eab308' : '#ef4444'}
                        strokeWidth="12" fill="none" strokeLinecap="round"
                        strokeDasharray={`${overallScore * 4.4} 440`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{overallScore}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">out of 100</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className={`p-4 rounded-xl ${getScoreBgColor(overallScore)} mb-4`}>
                      <h4 className={`text-lg font-bold ${getScoreColor(overallScore)} mb-2`}>
                        {overallScore >= 80 ? 'Excellent Compatibility' :
                          overallScore >= 60 ? 'Good Compatibility' :
                            overallScore >= 40 ? 'Moderate Compatibility' : 'Challenging Compatibility'}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 transition-colors">
                        {overallScore >= 80
                          ? 'You share deep physical and emotional harmony. Your natural desires align well, creating a fulfilling intimate connection.'
                          : overallScore >= 60
                            ? 'You have good compatibility with room for growth. Understanding each other\'s needs will enhance your connection.'
                            : overallScore >= 40
                              ? 'Your compatibility is moderate. Different needs and approaches may require conscious effort and open communication.'
                              : 'Significant differences exist in your desires and approaches. Patient communication and understanding are essential.'}
                      </p>
                    </div>

                    <div className="flex gap-4 flex-wrap">
                      <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg transition-colors">
                        <span className="text-sm text-purple-700 dark:text-purple-300">Physical (Yoni): </span>
                        <span className="font-bold text-purple-800 dark:text-purple-200">{yoniMatch.score}/100</span>
                      </div>
                      <div className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg transition-colors">
                        <span className="text-sm text-pink-700 dark:text-pink-300">Psychological (Nakshatra): </span>
                        <span className="font-bold text-pink-800 dark:text-pink-200">{nakshatraMatch.score}/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Summary Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <div
                  onClick={() => setActiveTab('yoni')}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all"
                >
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2 transition-colors">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Physical Nature Compatibility
                  </h4>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{partnerAName}</p>
                      <p className="text-xl font-bold text-purple-700 dark:text-purple-400 transition-colors">{yoniMatch.yoniA}</p>
                    </div>
                    <div className="text-2xl text-gray-400 dark:text-gray-500 transition-colors">+</div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{partnerBName}</p>
                      <p className="text-xl font-bold text-pink-700 dark:text-pink-400 transition-colors">{yoniMatch.yoniB}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{yoniMatch.description}</p>
                  <p className="text-xs text-indigo-600 mt-2">Click to see detailed characteristics →</p>
                </div>

                <div
                  onClick={() => setActiveTab('nakshatra')}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all"
                >
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2 transition-colors">
                    <Star className="w-5 h-5 text-indigo-500" />
                    Nakshatra Compatibility
                  </h4>
                  {nakshatraA && nakshatraB ? (
                    <>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{partnerAName}</p>
                          <p className="text-xl font-bold text-indigo-700 dark:text-indigo-400 transition-colors">{nakshatraA}</p>
                        </div>
                        <div className="text-2xl text-gray-400 dark:text-gray-500 transition-colors">+</div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{partnerBName}</p>
                          <p className="text-xl font-bold text-pink-700 dark:text-pink-400 transition-colors">{nakshatraB}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{nakshatraMatch.psychologicalProfile}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Nakshatra data not available</p>
                  )}
                  <p className="text-xs text-indigo-600 mt-2">Click to see detailed analysis →</p>
                </div>
              </div>
            </>
          </div>
        )}

        {/* Yoni Tab */}
        {activeTab === 'yoni' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors">Your Physical Nature Profile</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Partner A Yoni Details */}
                <div className="p-5 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {partnerAName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400">{partnerAName}'s Yoni</p>
                      <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{yoniMatch.yoniA}</h4>
                    </div>
                  </div>

                  {yoniADetails ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nature:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{yoniADetails.nature}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Temperament:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{yoniADetails.temperament}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{yoniADetails.description}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Core Desires:</p>
                        <ul className="mt-1 space-y-1">
                          {yoniADetails.desires.map((desire: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <span className="text-purple-500">•</span>
                              {desire}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-3 border-t border-purple-200 dark:border-purple-800/50">
                        <p className="text-xs text-purple-700 dark:text-purple-300">
                          <strong>Best Matches:</strong> {yoniADetails.bestWith.join(', ')}
                        </p>
                        <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                          <strong>Challenging:</strong> {yoniADetails.challengingWith.join(', ')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Detailed characteristics not available</p>
                  )}
                </div>

                {/* Partner B Yoni Details */}
                <div className="p-5 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-100 dark:border-pink-800/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-pink-600 dark:bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {partnerBName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-pink-600 dark:text-pink-400">{partnerBName}'s Yoni</p>
                      <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{yoniMatch.yoniB}</h4>
                    </div>
                  </div>

                  {yoniBDetails ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nature:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{yoniBDetails.nature}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Temperament:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{yoniBDetails.temperament}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{yoniBDetails.description}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Core Desires:</p>
                        <ul className="mt-1 space-y-1">
                          {yoniBDetails.desires.map((desire: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                              <span className="text-pink-500">•</span>
                              {desire}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-3 border-t border-pink-200 dark:border-pink-800/50">
                        <p className="text-xs text-pink-700 dark:text-pink-300">
                          <strong>Best Matches:</strong> {yoniBDetails.bestWith.join(', ')}
                        </p>
                        <p className="text-xs text-pink-700 dark:text-pink-300 mt-1">
                          <strong>Challenging:</strong> {yoniBDetails.challengingWith.join(', ')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Detailed characteristics not available</p>
                  )}
                </div>
              </div>

              {/* Yoni Compatibility Score */}
              <div className={`mt-6 p-5 rounded-xl border transition-colors ${getScoreBgColor(yoniMatch.score)}`}>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Your Physical Nature Match: {yoniMatch.nature}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-2xl font-bold transition-colors ${getScoreColor(yoniMatch.score)}`}>
                    {yoniMatch.score}/100
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 transition-colors">{yoniMatch.description}</p>

                <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 transition-colors shadow-sm">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 transition-colors">Understanding Your Match:</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 transition-colors">
                    <li>• {yoniMatch.score >= 80 ? 'Excellent natural physical harmony' :
                      yoniMatch.score >= 60 ? 'Good physical compatibility with adjustments needed' :
                        yoniMatch.score >= 40 ? 'Different approaches require understanding' : 'Significant differences in physical nature'}</li>
                    <li>• Your animal natures are {yoniMatch.yoniA === yoniMatch.yoniB ? 'the same' : 'different'} -
                      {yoniMatch.yoniA === yoniMatch.yoniB ? ' you naturally understand each other' : ' you may need to learn each other\'s rhythms'}</li>
                  </ul>
                </div>
              </div>

              {/* Detailed Yoni Depth / Anatomy Section (Enhanced) */}
              {(extendedSexualCompatibility?.yoniDepth || sexualCompatibility.yoniDepth) && (
                <div className="space-y-8 mt-8 pt-8 border-t border-gray-100">
                  {/* Partner A Section */}
                  {(() => {
                    const depth = extendedSexualCompatibility?.yoniDepth?.partnerA || (sexualCompatibility.yoniDepth as any);
                    if (!depth) return null;
                    return (
                      <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 transition-colors">
                        <h4 className="text-lg font-bold text-indigo-800 dark:text-indigo-200 mb-4 flex items-center gap-2 transition-colors">
                          <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                          Physical Nature & Physiology ({partnerAName})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-50 dark:border-indigo-800/20 transition-colors">
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 italic">Drive</p>
                            <p className="font-bold text-indigo-700 dark:text-indigo-300">{depth.drive}</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-50 dark:border-indigo-800/20 transition-colors">
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 italic">Stamina</p>
                            <p className="font-bold text-indigo-700 dark:text-indigo-300">{depth.stamina}</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-50 dark:border-indigo-800/20 transition-colors">
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 italic">Duration</p>
                            <p className="font-bold text-indigo-700 dark:text-indigo-300">{depth.sessionDuration}</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-50 dark:border-indigo-800/20 transition-colors">
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 italic">Element</p>
                            <p className="font-bold text-indigo-700 dark:text-indigo-300">{depth.bodyElement}</p>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Detailed Characteristics:</p>
                            <div className="flex flex-wrap gap-2">
                              {depth.characteristics.map((char: string, idx: number) => (
                                <span key={idx} className="px-3 py-1 bg-white dark:bg-gray-700 border border-indigo-100 dark:border-indigo-800/50 rounded-full text-xs font-medium text-indigo-600 dark:text-indigo-300 shadow-sm transition-colors">
                                  {char}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">Physiological Traits (Anatomical):</p>
                              <button
                                onClick={() => setShowHelp(showHelp === 'anatomy' ? null : 'anatomy')}
                                className="text-[10px] text-indigo-500 dark:text-indigo-400 flex items-center gap-1 hover:underline transition-colors"
                              >
                                <HelpCircle className="w-3 h-3" />
                                What do these mean?
                              </button>
                            </div>

                            {showHelp === 'anatomy' && (
                              <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30 text-[11px] text-indigo-800 dark:text-indigo-200 grid grid-cols-2 gap-x-4 gap-y-2 transition-colors">
                                <div><strong>Opening:</strong> Initial receptivity & sensitivity.</div>
                                <div><strong>Foreskin:</strong> External sensitivity level.</div>
                                <div><strong>Passage:</strong> Internal texture & flow.</div>
                                <div><strong>Girth:</strong> Presence & expansion intensity.</div>
                                <div><strong>Base:</strong> Depth & root stamina.</div>
                                <div><strong>Glans:</strong> Focal point of peak sensation.</div>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {/* Anatomical details filtered by biological gender */}
                              {Object.entries(depth.anatomy).map(([key, value]) => {
                                if (!value) return null;

                                // Filter traits based on biological gender
                                const isMaleTrait = ['foreskin', 'girth', 'glans'].includes(key);
                                const isFemaleTrait = ['opening', 'passage', 'base'].includes(key);
                                const isArchetype = key === 'lingamType' || key === 'gender';

                                const biologicalGender = chartA?.gender || 'male'; // Default or from chart

                                if (biologicalGender === 'male' && isFemaleTrait) return null;
                                if (biologicalGender === 'female' && isMaleTrait) return null;

                                return (
                                  <div key={key} className={`flex flex-col p-3 rounded-xl border transition-all duration-300 ${!showSensitive ? 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800' : 'bg-white dark:bg-gray-800 border-indigo-100 dark:border-indigo-800/30 shadow-sm'}`}>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold mb-1 transition-colors">
                                      {isArchetype ? 'Nature Archetype' : key}
                                    </span>
                                    {showSensitive ? (
                                      <div className="space-y-1">
                                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 capitalize transition-colors">{value as string}</span>
                                        {isArchetype && (
                                          <p className="text-[9px] text-indigo-500 dark:text-indigo-400 leading-tight transition-colors">
                                            Behavioral energy of animal nature (not biological sex)
                                          </p>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded italic transition-colors">Protected</span>
                                        <button
                                          onClick={() => setShowSensitive(true)}
                                          className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold transition-colors"
                                        >
                                          Reveal
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            {!showSensitive && (
                              <p className="mt-3 text-[10px] text-gray-400 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Some anatomical details are hidden for privacy.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Partner B Section */}
                  {extendedSexualCompatibility?.yoniDepth?.partnerB && (
                    <div className="p-6 bg-pink-50/50 dark:bg-pink-900/10 rounded-2xl border border-pink-100 dark:border-pink-800/30 transition-colors">
                      <h4 className="text-lg font-bold text-pink-800 dark:text-pink-200 mb-4 flex items-center gap-2 transition-colors">
                        <Sparkles className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                        Physical Nature & Physiology ({partnerBName})
                      </h4>
                      {/* ... repeat logic for Partner B ... */}
                      {(() => {
                        const depth = extendedSexualCompatibility.yoniDepth!.partnerB;
                        return (
                          <>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-pink-50 dark:border-pink-800/20 transition-colors">
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 italic">Drive</p>
                                <p className="font-bold text-pink-700 dark:text-pink-300">{depth.drive}</p>
                              </div>
                              {/* ... more cards ... */}
                              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-pink-50 dark:border-pink-800/20 transition-colors">
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 italic">Stamina</p>
                                <p className="font-bold text-pink-700 dark:text-pink-300">{depth.stamina}</p>
                              </div>
                              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-pink-50 dark:border-pink-800/20 transition-colors">
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 italic">Duration</p>
                                <p className="font-bold text-pink-700 dark:text-pink-300">{depth.sessionDuration}</p>
                              </div>
                              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-pink-50 dark:border-pink-800/20 transition-colors">
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 italic">Element</p>
                                <p className="font-bold text-pink-700 dark:text-pink-300">{depth.bodyElement}</p>
                              </div>
                            </div>

                            <div className="space-y-5">
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Detailed Characteristics:</p>
                                <div className="flex flex-wrap gap-2">
                                  {depth.characteristics.map((char: string, idx: number) => (
                                    <span key={idx} className="px-3 py-1 bg-white dark:bg-gray-700 border border-pink-100 dark:border-pink-800/50 rounded-full text-xs font-medium text-pink-600 dark:text-pink-300 shadow-sm transition-colors">
                                      {char}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors">Physiological Traits (Anatomical):</p>
                                  <button
                                    onClick={() => setShowHelp(showHelp === 'anatomy' ? null : 'anatomy')}
                                    className="text-[10px] text-pink-500 dark:text-pink-400 flex items-center gap-1 hover:underline transition-colors"
                                  >
                                    <HelpCircle className="w-3 h-3" />
                                    What do these mean?
                                  </button>
                                </div>

                                {showHelp === 'anatomy' && (
                                  <div className="mb-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-100 dark:border-pink-800/30 text-[11px] text-pink-800 dark:text-pink-200 grid grid-cols-2 gap-x-4 gap-y-2 transition-colors">
                                    <div><strong>Opening:</strong> Initial receptivity & sensitivity.</div>
                                    <div><strong>Foreskin:</strong> External sensitivity level.</div>
                                    <div><strong>Passage:</strong> Internal texture & flow.</div>
                                    <div><strong>Girth:</strong> Presence & expansion intensity.</div>
                                    <div><strong>Base:</strong> Depth & root stamina.</div>
                                    <div><strong>Glans:</strong> Focal point of peak sensation.</div>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  {Object.entries(depth.anatomy).map(([key, value]) => {
                                    if (!value) return null;

                                    // Filter traits based on biological gender
                                    const isMaleTrait = ['foreskin', 'girth', 'glans'].includes(key);
                                    const isFemaleTrait = ['opening', 'passage', 'base'].includes(key);
                                    const isArchetype = key === 'lingamType' || key === 'gender';

                                    const biologicalGender = chartB?.gender || 'female'; // Default for partner B or from chart

                                    if (biologicalGender === 'male' && isFemaleTrait) return null;
                                    if (biologicalGender === 'female' && isMaleTrait) return null;

                                    return (
                                      <div key={key} className={`flex flex-col p-3 rounded-xl border transition-all duration-300 ${!showSensitive ? 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800' : 'bg-white dark:bg-gray-800 border-pink-100 dark:border-pink-800/30 shadow-sm'}`}>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold mb-1 transition-colors">
                                          {isArchetype ? 'Nature Archetype' : key}
                                        </span>
                                        {showSensitive ? (
                                          <div className="space-y-1">
                                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 capitalize transition-colors">{value as string}</span>
                                            {isArchetype && (
                                              <p className="text-[9px] text-pink-500 dark:text-pink-400 leading-tight transition-colors">
                                                Behavioral energy of animal nature (not biological sex)
                                              </p>
                                            )}
                                          </div>
                                        ) : (
                                          <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded italic transition-colors">Protected</span>
                                            <button
                                              onClick={() => setShowSensitive(true)}
                                              className="text-[10px] text-pink-600 dark:text-pink-400 hover:underline font-bold transition-colors"
                                            >
                                              Reveal
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nakshatra Tab */}
        {activeTab === 'nakshatra' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors">Nakshatra (Birth Star) Compatibility</h3>

              {!nakshatraA || !nakshatraB ? (
                <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-xl transition-colors">
                  <Star className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2 transition-colors">Nakshatra information not available</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 transition-colors">Nakshatra (birth star) data is required for detailed compatibility analysis.</p>
                </div>
              ) : !nakshatraADetails || !nakshatraBDetails ? (
                <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-xl transition-colors">
                  <Star className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2 transition-colors">Nakshatra: {nakshatraA} + {nakshatraB}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 transition-colors">Detailed compatibility data not found in knowledge base for these nakshatras.</p>
                </div>
              ) : (
                <>
                  {/* Nakshatra Details Grid */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Partner A Nakshatra */}
                    <div className="p-5 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                          {partnerAName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-indigo-600 dark:text-indigo-400">{partnerAName}'s Nakshatra</p>
                          <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{nakshatraA}</h4>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <p><strong className="text-gray-800 dark:text-gray-200">Lord:</strong> {nakshatraADetails.lord}</p>
                        <p><strong className="text-gray-800 dark:text-gray-200">Deity:</strong> {nakshatraADetails.deity}</p>
                        <p><strong className="text-gray-800 dark:text-gray-200">Symbol:</strong> {nakshatraADetails.symbol}</p>
                        <p><strong className="text-gray-800 dark:text-gray-200">Gana:</strong> {nakshatraADetails.gana} ({nakshatraADetails.gana === 'Deva' ? 'Godly/Noble' : nakshatraADetails.gana === 'Manushya' ? 'Human/Mixed' : 'Demonic/Intense'})</p>
                        <p><strong className="text-gray-800 dark:text-gray-200">Nadi:</strong> {nakshatraADetails.nadi} ({nakshatraADetails.nadi === 'Vata' ? 'Air/Space' : nakshatraADetails.nadi === 'Pitta' ? 'Fire' : 'Water/Earth'})</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-indigo-200 dark:border-indigo-800/50">
                        <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Best Matches:</p>
                        <div className="flex flex-wrap gap-1">
                          {nakshatraADetails.best_match.map((match: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 bg-white dark:bg-gray-800 rounded text-xs text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
                              {match}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-2 mb-1">Challenging:</p>
                        <div className="flex flex-wrap gap-1">
                          {nakshatraADetails.worst_match.map((match: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 bg-white dark:bg-gray-800 rounded text-xs text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50">
                              {match}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Partner B Nakshatra */}
                    <div className="p-5 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-100 dark:border-pink-800/30 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-pink-600 dark:bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                          {partnerBName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-pink-600 dark:text-pink-400">{partnerBName}'s Nakshatra</p>
                          <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{nakshatraB}</h4>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <p><strong className="text-gray-800 dark:text-gray-200">Lord:</strong> {nakshatraBDetails.lord}</p>
                        <p><strong className="text-gray-800 dark:text-gray-200">Deity:</strong> {nakshatraBDetails.deity}</p>
                        <p><strong className="text-gray-800 dark:text-gray-200">Symbol:</strong> {nakshatraBDetails.symbol}</p>
                        <p><strong className="text-gray-800 dark:text-gray-200">Gana:</strong> {nakshatraBDetails.gana} ({nakshatraBDetails.gana === 'Deva' ? 'Godly/Noble' : nakshatraBDetails.gana === 'Manushya' ? 'Human/Mixed' : 'Demonic/Intense'})</p>
                        <p><strong className="text-gray-800 dark:text-gray-200">Nadi:</strong> {nakshatraBDetails.nadi} ({nakshatraBDetails.nadi === 'Vata' ? 'Air/Space' : nakshatraBDetails.nadi === 'Pitta' ? 'Fire' : 'Water/Earth'})</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-pink-200 dark:border-pink-800/50">
                        <p className="text-xs font-semibold text-pink-700 dark:text-pink-400 mb-1">Best Matches:</p>
                        <div className="flex flex-wrap gap-1">
                          {nakshatraBDetails.best_match.map((match: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 bg-white dark:bg-gray-800 rounded text-xs text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800/50">
                              {match}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs font-semibold text-red-600 dark:text-red-400 mt-2 mb-1">Challenging:</p>
                        <div className="flex flex-wrap gap-1">
                          {nakshatraBDetails.worst_match.map((match: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 bg-white dark:bg-gray-800 rounded text-xs text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50">
                              {match}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Between These Nakshatras */}
                  {nakshatraCompat && (
                    <div className={`p-6 rounded-xl ${getScoreBgColor(nakshatraCompat.score)}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <MapPin className="w-6 h-6 text-indigo-600" />
                        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                          {nakshatraA} + {nakshatraB} Compatibility
                        </h4>
                        <span className={`text-2xl font-bold ${getScoreColor(nakshatraCompat.score)}`}>
                          {nakshatraCompat.score}/100
                        </span>
                      </div>

                      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-inner transition-colors">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg italic transition-colors">
                          &quot;{nakshatraCompat.description}&quot;
                        </p>
                      </div>

                      <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                          <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1 transition-colors">What Works:</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {nakshatraCompat.score >= 70 ? 'Strong natural affinity and mutual understanding' :
                              nakshatraCompat.score >= 50 ? 'Good potential with conscious effort' :
                                'Different approaches need patience and communication'}
                          </p>
                        </div>
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                          <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1 transition-colors">Watch Out For:</p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {nakshatraCompat.score >= 70 ? 'May become too comfortable - keep passion alive' :
                              nakshatraCompat.score >= 50 ? 'Different emotional needs may cause friction' :
                                'Significant adjustments needed - seek guidance'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-6 transition-colors">
            <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              Recommendations for Enhancing Your Connection
            </h4>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-amber-50 dark:border-amber-800/20 transition-colors">
                  <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg transition-colors">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong className="text-gray-800 dark:text-gray-200">Important Note:</strong> This analysis is based on ancient Vedic astrological principles
            and provides insights into natural tendencies and compatibilities. However, every relationship is unique,
            and open communication, mutual respect, and understanding between partners are the most important factors
            for a fulfilling intimate life. Use this as guidance, not as a fixed destiny.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SexualCompatibilityWidget;
