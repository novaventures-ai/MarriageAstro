import React, { useState } from 'react';
import { DivisionalChartAnalysis, Chart } from '../../types';
import { Grid3X3, Star, Clock, Heart, Sparkles, BarChart3, Crown, ChevronDown, ChevronUp, HelpCircle, BookOpen, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { useGeminiInsight } from '../../hooks/useGeminiInsight';
import ReactMarkdown from 'react-markdown';

interface DivisionalChartWidgetProps {
  divisionalAnalysis: DivisionalChartAnalysis;
  nameA?: string;
  nameB?: string;
  chartA?: Chart; // Make optional to not break if not passed immediately, but we will pass it
  chartB?: Chart;
}

export const DivisionalChartWidget: React.FC<DivisionalChartWidgetProps> = ({
  divisionalAnalysis,
  nameA = 'Partner A',
  nameB,
  chartA,
  chartB
}) => {
  const { d9, d7, d60, overall, extended } = divisionalAnalysis;
  const [selectedPartner, setSelectedPartner] = useState<'A' | 'B'>('A');
  const [showAllHouses, setShowAllHouses] = useState(false);
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const { loading, insight, error, triggerAnalysis } = useGeminiInsight();

  // Get current active data
  const activeExtended = selectedPartner === 'A' ? extended?.partnerA : extended?.partnerB;
  const activeName = selectedPartner === 'A' ? nameA : nameB;

  // Use individual data if available, fallback to combined/basic
  const activeD9 = activeExtended?.d9Full || d9;
  const activeD7 = activeExtended?.d7Full || d7;

  if (!activeD9) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md text-center">
        <p className="text-gray-500 italic">Divisional analysis data not available</p>
      </div>
    );
  }

  const getPlanetIcon = (planet: string) => {
    switch (planet) {
      case 'Sun':
        return <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Su</div>;
      case 'Moon':
        return <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-xs font-bold">Mo</div>;
      case 'Mars':
        return <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Ma</div>;
      case 'Mercury':
        return <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Me</div>;
      case 'Jupiter':
        return <div className="w-6 h-6 bg-yellow-700 rounded-full flex items-center justify-center text-white text-xs font-bold">Ju</div>;
      case 'Venus':
        return <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Ve</div>;
      case 'Saturn':
        return <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">Sa</div>;
      default:
        return <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{planet?.charAt(0)}</div>;
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'very_strong': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50';
      case 'strong': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/50';
      case 'moderate': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50';
      case 'weak': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/50';
      case 'very_weak': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getDeityNatureColor = (nature: string) => {
    switch (nature) {
      case 'benefic': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'malefic': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  const HelpBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border-l-4 border-blue-500 transition-colors">
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
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Grid3X3 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Divisional Charts (Varga) Analysis</h2>
            <p className="text-amber-100 leading-relaxed">
              Divisional charts are like zooming into specific life areas. Your main chart (D1) is divided into
              smaller sections to reveal deeper details. <strong>D9 Navamsa</strong> is most important for marriage
              - it shows your inner nature and married life quality. <strong>D7 Saptamsa</strong> reveals children
              and fertility. <strong>D60 Shashtiamsa</strong> shows past life karma affecting marriage.
            </p>
          </div>
        </div>
      </div>

      {/* AI Decoder */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-32 h-32 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Decode with Vedic AI
              </h3>
              <p className="text-white/80 text-sm mt-1">
                Confused by D1 vs D9? Let the AI explain your "Inner Marriage Potential".
              </p>
            </div>
            <button
              onClick={() => {
                const activeChart = selectedPartner === 'A' ? chartA : chartB;
                if (!activeChart) return;

                triggerAnalysis('DIVISIONAL_ANALYSIS', {
                  d1: {
                    ascendant: activeChart.ascendant,
                    seventhLord: activeChart.planetaryPositions.find(p => p.planet === 'Venus')?.sign || 'Unknown' // Simplified relative to 7th lord logic, utilizing Venus as Karaka
                  },
                  d9: { ascendant: activeD9.ascendant, seventhLord: activeD9.seventhLord },
                  focusPlanet: 'Venus (Marriage Karaka) & 7th Lord',
                  partnerName: activeName
                });
              }}
              disabled={loading}
              className="px-5 py-2 bg-white text-violet-600 rounded-lg font-bold shadow-md hover:bg-violet-50 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {insight ? 'Decode Again' : 'Decode D9 Chart'}
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

      {/* Partner Toggle - Only show if nameB is present */}
      {extended && nameB && (
        <div className="flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center gap-1 transition-colors">
            <button
              onClick={() => setSelectedPartner('A')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedPartner === 'A' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {nameA}
            </button>
            <button
              onClick={() => setSelectedPartner('B')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedPartner === 'B' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {nameB}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* D9 Navamsa Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-t-4 border-indigo-500 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 transition-colors">
                <Heart className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                D9 Navamsa: Marriage Quality - {activeName}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl transition-colors">
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase transition-colors">Ascendant</span>
                <p className="text-xl font-black text-indigo-900 dark:text-indigo-100 transition-colors">{activeD9.ascendant}</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl transition-colors">
                <span className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase transition-colors">7th Lord</span>
                <div className="flex items-center gap-2 transition-colors">
                  {getPlanetIcon(activeD9.seventhLord)}
                  <p className="text-xl font-black text-purple-900 dark:text-purple-100 transition-colors">{activeD9.seventhLord}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2 transition-colors">
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                Marriage Indications
              </h4>
              <div className="space-y-2">
                {activeD9.marriageIndications.map((ind, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 mt-2 flex-shrink-0 transition-colors" />
                    <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">{ind}</p>
                  </div>
                ))}
              </div>
            </div>

            {activeD9.vargottamaPlanets.length > 0 && (
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30 transition-colors">
                <h4 className="text-sm font-bold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2 transition-colors">
                  <Star className="w-4 h-4" />
                  Vargottama Planets (Strongest)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeD9.vargottamaPlanets.map(p => (
                    <span key={p} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-xs font-bold text-amber-700 dark:text-amber-300 shadow-sm border border-amber-200 dark:border-amber-800/50 transition-colors">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Jaimini D-9 2nd House Analysis */}
          {activeExtended?.jaiminiD9Analysis && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-t-4 border-rose-500 transition-colors mt-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-6 transition-colors">
                <ShieldCheck className="w-6 h-6 text-rose-500" />
                Jaimini D-9: Family Karma - {activeName}
              </h3>

              <div className="flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-800/30 mb-4 transition-colors">
                <div>
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-bold uppercase transition-colors">2nd House Sign (UL Support)</span>
                  <p className="text-lg font-black text-rose-900 dark:text-rose-100 transition-colors">
                    {activeExtended.jaiminiD9Analysis.secondHouseSign}
                  </p>
                </div>
                {activeExtended.jaiminiD9Analysis.familyRisk !== 'low' && (
                  <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full animate-pulse transition-colors">
                    Karmic Alert
                  </span>
                )}
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl transition-colors">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-colors">
                  {activeExtended.jaiminiD9Analysis.interpretation}
                </p>
                {activeExtended.jaiminiD9Analysis.secondHousePlanets.length > 0 && (
                  <div className="flex gap-2 mt-3 transition-colors">
                    {activeExtended.jaiminiD9Analysis.secondHousePlanets.map(p => (
                      <div key={p} title={`${p} affecting family values`}>{getPlanetIcon(p)}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Soul Mirror: Arudha Padas (NEW) */}
          {activeExtended?.arudhaPadas && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-t-4 border-cyan-500 transition-colors mt-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-6 transition-colors">
                <ShieldCheck className="w-6 h-6 text-cyan-500" />
                Soul Mirror: Arudha Padas - {activeName}
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-cyan-50 dark:bg-cyan-900/10 rounded-xl border border-cyan-100 dark:border-cyan-800/30">
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-widest">A7 (Dara Pada)</span>
                  <p className="text-lg font-black text-cyan-900 dark:text-cyan-100">{activeExtended.arudhaPadas.a7.sign}</p>
                  <p className="text-[10px] text-gray-500 mt-1 leading-tight">{activeExtended.arudhaPadas.a7.meaning}</p>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">UL (Upapada)</span>
                  <p className="text-lg font-black text-indigo-900 dark:text-indigo-100">{activeExtended.arudhaPadas.ul.sign}</p>
                  <p className="text-[10px] text-gray-500 mt-1 leading-tight">{activeExtended.arudhaPadas.ul.meaning}</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                  <strong>Soul Dynamic:</strong> {activeExtended.arudhaPadas.dynamicRange}
                </p>
              </div>
            </div>
          )}

          {/* D7 Saptamsa Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-t-4 border-green-500 transition-colors">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2 transition-colors">
              <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
              D7 Saptamsa: Progeny & Lineage - {activeName}
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/30 transition-colors">
                <span className="text-xs text-green-600 dark:text-green-400 font-bold uppercase transition-colors">Fertility Status</span>
                <p className="text-lg font-bold text-green-900 dark:text-green-100 mt-1 transition-colors">{activeD7.fertility}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 transition-colors">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider transition-colors">Lineage Insights</h4>
                <div className="space-y-3">
                  {activeD7.childrenIndications.map((ind, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                      <div className="w-1 h-1 rounded-full bg-green-400 dark:bg-green-500 transition-colors" />
                      {ind}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shodashvarga Strength & D60 */}
        <div className="space-y-6">
          {/* Vimshopaka Scores */}
          {activeExtended && activeExtended.vimshopakaScores.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-t-4 border-amber-500 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 transition-colors">
                  <BarChart3 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  Planetary Strength (Vimshopaka) - {activeName}
                </h3>
                <button
                  onClick={() => setShowHelp(showHelp === 'vimshopaka' ? null : 'vimshopaka')}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>

              {showHelp === 'vimshopaka' && (
                <HelpBox title="What is Vimshopaka?">
                  Vimshopaka is a 20-point scoring system that measures the consolidated strength of planets across many divisional charts.
                  A score above 15 is excellent, while below 10 indicates a need for strengthening that energy.
                </HelpBox>
              )}

              <div className="space-y-3">
                {activeExtended.vimshopakaScores.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl transition-colors">
                    {getPlanetIcon(item.planet)}
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-800 dark:text-gray-100 transition-colors">{item.planet}</span>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors">{item.total}/20</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors">
                        <div
                          className={`h-full transition-all duration-1000 ${item.strength === 'very_strong' ? 'bg-green-500' :
                            item.strength === 'strong' ? 'bg-blue-500' :
                              item.strength === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${(item.total / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border transition-colors ${getStrengthColor(item.strength)}`}>
                      {item.strength.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* D60 Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-t-4 border-purple-500 transition-colors">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2 transition-colors">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              D60 Shashtiamsa: Karmic Destiny - {activeName}
            </h3>

            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30 transition-colors">
                <h4 className="text-sm font-bold text-purple-800 dark:text-purple-200 mb-2 uppercase flex items-center gap-2 transition-colors">
                  <Crown className="w-4 h-4" />
                  Core Past Life Karma
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm italic transition-colors">
                  &quot;{activeExtended?.d60Deities?.[0]?.interpretation || d60.pastLifeKarma}&quot;
                </p>
              </div>

              {activeExtended && activeExtended.d60Deities.length > 0 && (
                <div className="grid grid-cols-1 gap-3">
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-2 transition-colors">D60 Planetary Deities</h4>
                  {activeExtended.d60Deities.map((deity, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <div className="flex items-center gap-2 transition-colors">
                        {getPlanetIcon(deity.planet)}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">{deity.planet}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase transition-colors ${getDeityNatureColor(deity.nature)}`}>
                        {deity.deity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navamsa House Meanings Toggle View */}
      {activeExtended && activeExtended.navamsaHouseMeanings.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 transition-colors">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Navamsa House Deep-Dive - {activeName}
            </h3>
            <button
              onClick={() => setShowAllHouses(!showAllHouses)}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold text-sm flex items-center gap-1 transition-colors"
            >
              {showAllHouses ? 'Show Less' : 'Show All 12 Houses'}
              {showAllHouses ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeExtended.navamsaHouseMeanings
              .filter(h => showAllHouses || [1, 7, 2, 4, 8, 12].includes(h.house))
              .map((house, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-7 h-7 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors">
                      {house.house}
                    </span>
                    <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase transition-colors">{house.sign}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1 transition-colors">{house.meaning.split(',')[0]}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-snug transition-colors">{house.meaning}</p>
                  {house.planets.length > 0 && (
                    <div className="flex gap-1">
                      {house.planets.map(p => (
                        <div key={p} title={p}>{getPlanetIcon(p)}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Full Shodashvarga */}
      {activeExtended && activeExtended.shodashvarga && activeExtended.shodashvarga.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
                <Grid3X3 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                Complete Shodashvarga Analysis - {activeName}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
                Deep micro-analysis across all 16 life divisions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeExtended.shodashvarga.map((item, idx) => (
              <div key={idx} className="p-4 bg-amber-50/30 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/30 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded uppercase transition-colors">{item.varga}</span>
                  <div className="flex items-center gap-1 transition-colors">
                    {getPlanetIcon(item.lord)}
                  </div>
                </div>
                <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1 transition-colors">{item.name}</h4>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mb-2 uppercase tracking-tight transition-colors">{item.area}</p>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 transition-colors">
                  <p><strong className="text-gray-700 dark:text-gray-300 transition-colors">Sign:</strong> {item.sign}</p>
                  <p className="italic leading-snug">{item.interpretation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overall Summary (Stays static as it compares both) */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl shadow-lg p-6 border border-amber-200 dark:border-amber-800/30 transition-colors">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
          <Grid3X3 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          Overall Synthesis
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed transition-colors">{overall}</p>
      </div>
    </div>
  );
};

export default DivisionalChartWidget;
