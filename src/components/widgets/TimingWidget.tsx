
import React, { useState } from 'react';
import { TimingAnalysis } from '../../types';
import { ExtendedTimingAnalysis } from '../../types/extendedTypes';
import { Calendar, Clock, Sparkles, Star, Heart, Info, HelpCircle, BookOpen, ArrowRight, AlertTriangle, ShieldAlert, BarChartHorizontal as ChartBar, Gift, AlertCircle, TrendingUp, RefreshCw } from 'lucide-react';
import { useGeminiInsight } from '../../hooks/useGeminiInsight';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';

interface TimingWidgetProps {
  timing: TimingAnalysis & { extended?: ExtendedTimingAnalysis };
}

export const TimingWidget: React.FC<TimingWidgetProps> = ({ timing }) => {
  const { favorablePeriods, transitNotes, partnerA, partnerB } = timing;
  const { loading, insight, error, triggerAnalysis } = useGeminiInsight();
  const extended = timing.extended;
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<{
    date: Date;
    status: string;
    description: string;
    person: string;
  } | null>(null);

  if (!partnerA) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50';
    if (confidence >= 60) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/50';
    if (confidence >= 40) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/50';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  };

  const getFavorabilityColor = (favourability: string) => {
    switch (favourability) {
      case 'positive': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30';
      case 'neutral': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30';
      case 'challenging': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const HelpBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-colors">
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Marriage Timing Analysis</h2>
            <p className="text-indigo-100 leading-relaxed">
              Timing is everything in Vedic astrology! Marriage occurs when your <strong>Dasha periods</strong>
              (planetary time cycles) align favorably. This analysis identifies your most auspicious windows
              for marriage based on planetary positions and transits. The best time is when both partners
              have overlapping positive periods.
            </p>
          </div>
        </div>
      </div>

      {/* AI Key Dates Forecast */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Calendar className="w-32 h-32 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                Forecast Key Milestones
              </h3>
              <p className="text-blue-200 text-sm mt-1">
                Ask "The Planner" to identify Golden Windows for marriage, proposal, or travel based on Dasha & Transits.
              </p>
            </div>
            <button
              onClick={() => triggerAnalysis('TIMING_ANALYSIS', {
                dasha: `${partnerA.name}: ${partnerA.currentDasha}, ${partnerB.name}: ${partnerB.currentDasha}`,
                transits: transitNotes,
                goal: 'Identify Best Dates for Marriage/Proposal'
              })}
              disabled={loading}
              className="px-5 py-2 bg-yellow-400 text-blue-900 rounded-lg font-bold shadow-lg hover:bg-yellow-300 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
              {insight ? 'Forecast Again' : 'Get Timeline'}
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

      {/* Favorable Periods */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
              <Calendar className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              Favorable Marriage Windows
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
              Best time periods for marriage based on planetary alignments
            </p>
          </div>
          <button
            onClick={() => setShowHelp(showHelp === 'windows' ? null : 'windows')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {showHelp === 'windows' && (
          <HelpBox title="Understanding Favorable Windows">
            These are periods when planets supporting marriage are activated in your chart.
            The <strong>confidence percentage</strong> indicates how strongly the planets align for marriage.
            80%+ means excellent timing, 60-79% is good, 40-59% is acceptable with awareness,
            below 40% requires caution. The most favorable time is when both partners have overlapping positive windows.
          </HelpBox>
        )}

        {favorablePeriods.length > 0 ? (
          <div className="space-y-4">
            {favorablePeriods.map((period, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md transition-colors">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg transition-colors">
                        {format(new Date(period.startDate), 'MMMM yyyy')} - {format(new Date(period.endDate), 'MMMM yyyy')}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 transition-colors">{period.description}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${getConfidenceColor(period.confidence)}`}>
                    {period.confidence}% Confidence
                  </span>
                </div>

                <div className="w-full bg-white dark:bg-gray-700/50 rounded-full h-2 mb-4 transition-colors">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm transition-all duration-500"
                    style={{ width: `${period.confidence}% ` }}
                  />
                </div>

                <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    <span>Starts: {format(new Date(period.startDate), 'PPP')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <span>Ends: {format(new Date(period.endDate), 'PPP')}</span>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-white/60 dark:bg-gray-900/40 rounded-lg backdrop-blur-sm transition-colors">
                  <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors">
                    <strong>Why this period?</strong> {getPeriodExplanation(period.confidence)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 transition-colors">
            <Sparkles className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 font-medium transition-colors">No specific favorable periods identified at this time.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors">This doesn't mean marriage won't happen - consult an astrologer for detailed analysis.</p>
          </div>
        )}
      </div>

      {/* Joint Destiny Synchronization (New) */}
      {extended?.destinySync && extended.destinySync.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/30 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-2xl shadow-xl p-6 border-2 border-amber-200 dark:border-amber-700/50 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Joint Destiny Synchronization
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Multi-System Alignment Score • Higher score = More systems aligned
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-4 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-amber-100 dark:border-amber-800/30">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-500"></div>
                <span className="text-gray-700 dark:text-gray-300"><strong>Gold</strong> = 3 systems aligned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                <span className="text-gray-700 dark:text-gray-300"><strong>Blue</strong> = 2 systems aligned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-gray-700 dark:text-gray-300"><strong>Grey</strong> = 1 system only</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {extended.destinySync.map((item: any, index: number) => {
              // Calculate how many systems are active
              const activeSystems = [
                true, // Vimshottari is always the base
                item.charaDashaActive,
                item.vivahSahamActive
              ].filter(Boolean).length;
              
              const isTripleAlignment = activeSystems === 3;
              const isDoubleAlignment = activeSystems === 2;
              
              return (
                <div
                  key={index}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    isTripleAlignment 
                      ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/30 border-amber-400 dark:border-amber-500 shadow-lg ring-2 ring-amber-200 dark:ring-amber-800/50' 
                      : isDoubleAlignment
                        ? 'bg-white dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 shadow-md'
                        : 'bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 opacity-80'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                          {item.startDate}
                        </span>
                        {isTripleAlignment && (
                          <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs rounded-full font-bold flex items-center gap-1 shadow-md">
                            <Sparkles className="w-3.5 h-3.5" /> Triple Alignment ★★★
                          </span>
                        )}
                        {isDoubleAlignment && !isTripleAlignment && (
                          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs rounded-full font-bold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> Double Alignment ★★
                          </span>
                        )}
                        {!isDoubleAlignment && (
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                            Single System ★
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {isTripleAlignment 
                          ? "Exceptional period! All three predictive systems are aligned for marriage."
                          : isDoubleAlignment
                            ? "Strong period with multiple systems supporting marriage timing."
                            : "Standard favorable period based on Vimshottari Dasha."
                        }
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block mb-1">
                        ALIGNMENT SCORE
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-black ${
                          isTripleAlignment ? 'text-amber-600 dark:text-amber-400' : 
                          isDoubleAlignment ? 'text-indigo-600 dark:text-indigo-400' : 
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {activeSystems}
                        </span>
                        <span className="text-sm text-gray-500">/3</span>
                      </div>
                      <span className="text-xs text-gray-400 block mt-1">
                        Base: {item.vimshottariConfidence}%
                      </span>
                    </div>
                  </div>

                  {/* System Alignment Bar */}
                  <div className="mb-4">
                    <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <div className="flex-1 bg-blue-500" title="Vimshottari"></div>
                      <div className={`flex-1 ${item.charaDashaActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} title="Chara Dasha"></div>
                      <div className={`flex-1 ${item.vivahSahamActive ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`} title="Vivah Saham"></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-gray-400">
                      <span>Vimshottari</span>
                      <span>Chara Dasha</span>
                      <span>Vivah Saham</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-3 text-xs">
                    {/* System Badges */}
                    <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded border border-blue-100 dark:border-blue-800/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Vimshottari ✓
                    </div>
                    <div className={`flex items-center gap-2 px-2 py-1 rounded border ${item.charaDashaActive ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800/30' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.charaDashaActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      Chara Dasha {item.charaDashaActive ? '✓' : '✗'}
                    </div>
                    <div className={`flex items-center gap-2 px-2 py-1 rounded border ${item.vivahSahamActive ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800/30' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.vivahSahamActive ? 'bg-purple-500' : 'bg-gray-400'}`}></span>
                      Vivah Saham {item.vivahSahamActive ? '✓' : '✗'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Activation Info Box */}
          {(() => {
            // Calculate next Chara Dasha activation
            let nextCharaActivation: string | null = null;
            let nextVivahActivation: string | null = null;
            
            if (extended?.charaDasha?.upcomingPeriods && extended?.charaDasha?.marriageTiming?.favorableSigns) {
              const now = new Date();
              const futurePeriod = extended.charaDasha.upcomingPeriods.find((p: any) => {
                const startDate = new Date(p.startDate);
                return startDate > now && extended.charaDasha.marriageTiming.favorableSigns.includes(p.sign);
              });
              if (futurePeriod) {
                nextCharaActivation = `${futurePeriod.sign} (${new Date(futurePeriod.startDate).getFullYear()}-${new Date(futurePeriod.endDate).getFullYear()})`;
              }
            }
            
            // Calculate next Vivah Saham activation (Jupiter transit)
            if (extended?.vivahSaham?.sign) {
              const vivahSign = extended.vivahSaham.sign;
              const jupiterTransits = [
                { year: 2024, sign: 'Taurus' },
                { year: 2025, sign: 'Gemini' },
                { year: 2026, sign: 'Cancer' },
                { year: 2027, sign: 'Leo' },
                { year: 2028, sign: 'Virgo' },
                { year: 2029, sign: 'Libra' },
                { year: 2030, sign: 'Scorpio' },
                { year: 2031, sign: 'Sagittarius' },
                { year: 2032, sign: 'Capricorn' },
                { year: 2033, sign: 'Aquarius' },
                { year: 2034, sign: 'Pisces' },
                { year: 2035, sign: 'Aries' }
              ];
              
              const currentYear = new Date().getFullYear();
              const nextTransit = jupiterTransits.find(t => t.year >= currentYear && t.sign === vivahSign);
              if (nextTransit) {
                nextVivahActivation = `${vivahSign} (${nextTransit.year})`;
              }
            }
            
            if (nextCharaActivation || nextVivahActivation) {
              return (
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                        When Will These Systems Activate?
                      </h4>
                      <div className="space-y-2 text-sm">
                        {nextCharaActivation && (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-gray-700 dark:text-gray-300">
                              <strong className="text-green-700 dark:text-green-400">Chara Dasha:</strong> Next favorable period during {nextCharaActivation}
                            </span>
                          </div>
                        )}
                        {nextVivahActivation && (
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            <span className="text-gray-700 dark:text-gray-300">
                              <strong className="text-purple-700 dark:text-purple-400">Vivah Saham:</strong> Activates when Jupiter enters {nextVivahActivation}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
                        These systems add extra confirmation when they align with Vimshottari Dasha periods.
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Partner Dasha Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Current Planetary Periods (Dasha)
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
              Each person is running different planetary cycles - see how they align
            </p>
          </div>
          <button
            onClick={() => setShowHelp(showHelp === 'dasha' ? null : 'dasha')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {showHelp === 'dasha' && (
          <HelpBox title="What is Dasha?">
            <strong>Dasha</strong> means "planetary period" - a system where each planet rules your life for a
            specific time. The main period is called <strong>Mahadasha</strong>, with sub-periods <strong>Antardasha</strong>
            and <strong>Pratyantardasha</strong>. When marriage-benefic planets (Venus, Jupiter, 7th lord) are active,
            marriage is supported. When malefic planets run, delays may occur.
          </HelpBox>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 transition-colors">{partnerA.name}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border transition-colors ${getFavorabilityColor(partnerA.favourability)}`}>
                {partnerA.favourability}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors">
              <strong>Currently Running:</strong> {partnerA.currentDasha}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">{partnerA.analysis}</p>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 transition-colors">
              {partnerA.favourability === 'positive' && '✓ Good time for marriage decisions'}
              {partnerA.favourability === 'neutral' && '⚡ Proceed with awareness and patience'}
              {partnerA.favourability === 'challenging' && '⚠ Delays possible - wait for better period'}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg border border-pink-100 dark:border-pink-800/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-pink-800 dark:text-pink-200 transition-colors">{partnerB.name}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border transition-colors ${getFavorabilityColor(partnerB.favourability)}`}>
                {partnerB.favourability}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors">
              <strong>Currently Running:</strong> {partnerB.currentDasha}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">{partnerB.analysis}</p>
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 transition-colors">
              {partnerB.favourability === 'positive' && '✓ Good time for marriage decisions'}
              {partnerB.favourability === 'neutral' && '⚡ Proceed with awareness and patience'}
              {partnerB.favourability === 'challenging' && '⚠ Delays possible - wait for better period'}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30 transition-colors">
          <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2 transition-colors">Key Dasha Periods That Support Marriage:</h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 transition-colors">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 dark:text-purple-400 mt-1">•</span>
              <span><strong>Venus Dasha/Antardasha:</strong> Natural marriage karaka - brings love and relationships</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 dark:text-purple-400 mt-1">•</span>
              <span><strong>Jupiter Dasha/Antardasha:</strong> Blessings, expansion, and good fortune in relationships</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 dark:text-purple-400 mt-1">•</span>
              <span><strong>7th Lord Dasha:</strong> Direct activation of the marriage house</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 dark:text-purple-400 mt-1">•</span>
              <span><strong>Moon Dasha:</strong> Emotional readiness and family support</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Extended Timing Analysis - Chara Dasha */}
      {extended && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
                <ArrowRight className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                Chara Dasha (Jaimini System)
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
                Sign-based timing system - another layer of marriage prediction
              </p>
            </div>
            <button
              onClick={() => setShowHelp(showHelp === 'chara' ? null : 'chara')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {showHelp === 'chara' && (
            <HelpBox title="Chara Dasha vs Vimshottari Dasha">
              While <strong>Vimshottari Dasha</strong> uses planets for timing, <strong>Chara Dasha</strong> uses
              the 12 zodiac signs. It's especially powerful for timing marriage - when the Dasha of the sign
              containing your Darakaraka (spouse planet) or the 7th from it runs, marriage is likely.
              This provides a second confirmation layer to planetary Dasha.
            </HelpBox>
          )}

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 transition-colors">Current Sign Period</h4>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{extended.charaDasha.currentPeriod.sign}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                {extended.charaDasha.currentPeriod.durationYears} years
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 transition-colors">
                Lord: {extended.charaDasha.currentPeriod.lord}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-b from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 transition-colors">Darakaraka Sign</h4>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{extended.charaDasha.marriageTiming.darakarakaSign}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Spouse planet position</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 transition-colors">Marriage when this sign activates</p>
            </div>

            <div className="p-4 bg-gradient-to-b from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg border border-pink-100 dark:border-pink-800/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                <h4 className="font-semibold text-pink-800 dark:text-pink-200 transition-colors">Upapada Sign</h4>
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{extended.charaDasha.marriageTiming.upapadaSign}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Marriage point</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 transition-colors">Also indicates marriage timing</p>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30 transition-colors">
            <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2 flex items-center gap-2 transition-colors">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Marriage Timing from Chara Dasha
            </h4>
            <p className="text-gray-700 dark:text-gray-300 transition-colors">{extended.charaDasha.marriageTiming.interpretation}</p>
            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 transition-colors">Favorable Signs for Marriage:</p>
              <div className="flex flex-wrap gap-2">
                {extended.charaDasha.marriageTiming.favorableSigns.map((sign, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700/50 shadow-sm transition-colors">
                    {sign}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vulnerable Periods */}
      {timing.vulnerablePeriods && timing.vulnerablePeriods.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors border-2 border-amber-100 dark:border-amber-900/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
                <AlertTriangle className="w-7 h-7 text-amber-500" />
                Vulnerable Relationship Periods
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
                Periods requiring extra patience, communication, and awareness
              </p>
            </div>
            <button
              onClick={() => setShowHelp(showHelp === 'vulnerable' ? null : 'vulnerable')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {showHelp === 'vulnerable' && (
            <HelpBox title="Understanding Vulnerable Periods">
              These are planetary cycles (usually Rahu, Ketu, or separative lords) that can cloud judgment,
              increase impulsivity, or create a sense of detachment. They are not "bad," but they are times
              when relationship stress is higher. Awareness during these periods helps couples navigate
              challenges without making permanent decisions based on temporary planetary pressures.
            </HelpBox>
          )}

          <div className="grid gap-4">
            {timing.vulnerablePeriods.slice(0, 6).map((period, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border transition-colors ${period.riskLevel === 'high'
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30'
                  : 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/30'
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-1 ${period.riskLevel === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                          {period.profileName}'s Awareness Period
                        </h4>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${period.riskLevel === 'high' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                          }`}>
                          {period.riskLevel} Risk
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                        {format(new Date(period.startDate), 'MMM yyyy')} - {format(new Date(period.endDate), 'MMM yyyy')}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                        {period.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stability Timeline (Dynamic) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors border-2 border-indigo-100/50 dark:border-indigo-900/30">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3 mb-6 transition-colors">
          <ChartBar className="w-6 h-6 text-indigo-600" />
          Stability Timeline Analysis
        </h3>

        <div className="space-y-8">
          {/* Partner A Timeline */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{partnerA.name}&apos;s Cycle</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Next 24 Months</span>
            </div>
            {timing.timeline?.partnerA ? (
              <div className="relative h-8 py-1">
                <div className="absolute inset-y-0 inset-x-0 bg-gray-100 dark:bg-gray-900/50 rounded-full" />
                <div className="relative h-6 flex rounded-full overflow-hidden">
                  {timing.timeline.partnerA.map((segment, idx) => {
                    const partnerATimeline = timing.timeline!.partnerA;
                    const nowTime = new Date().getTime();
                    const lastDate = new Date(partnerATimeline[partnerATimeline.length - 1].date).getTime();
                    const totalDuration = Math.max(lastDate - nowTime, 1000); // Prevent div by zero

                    const currentDate = new Date(segment.date).getTime();
                    const previousDate = idx === 0
                      ? nowTime
                      : new Date(partnerATimeline[idx - 1].date).getTime();

                    const segmentDuration = currentDate - previousDate;
                    const widthPercent = (segmentDuration / totalDuration) * 100;

                    if (widthPercent <= 0) return null;

                    let colorClass = 'bg-gray-300';
                    if (segment.status === 'harmonious') colorClass = 'bg-green-500';
                    if (segment.status === 'caution') colorClass = 'bg-amber-500';
                    if (segment.status === 'high_awareness') colorClass = 'bg-red-500';

                    return (
                      <div
                        key={idx}
                        className={`h-full ${colorClass} opacity-70 hover:opacity-100 transition-all cursor-help relative group border-r border-white/10 last:border-r-0`}
                        style={{ width: `${widthPercent}%` }}
                        onMouseEnter={() => setHoveredSegment({
                          date: new Date(segment.date),
                          status: segment.status,
                          description: segment.description,
                          person: partnerA.name
                        })}
                        onMouseLeave={() => setHoveredSegment(null)}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg pointer-events-none">
                          <p className="font-bold">{format(new Date(segment.date), 'MMM yyyy')}</p>
                          <p>{segment.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center text-sm text-gray-500">Timeline data unavailable</div>
            )}
          </div>

          {/* Partner B Timeline */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{partnerB.name}&apos;s Cycle</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Next 24 Months</span>
            </div>
            {timing.timeline?.partnerB ? (
              <div className="relative h-8 py-1">
                <div className="absolute inset-y-0 inset-x-0 bg-gray-100 dark:bg-gray-900/50 rounded-full" />
                <div className="relative h-6 flex rounded-full overflow-hidden">
                  {timing.timeline.partnerB.map((segment, idx) => {
                    const partnerBTimeline = timing.timeline!.partnerB;
                    const nowTime = new Date().getTime();
                    const lastDate = new Date(partnerBTimeline[partnerBTimeline.length - 1].date).getTime();
                    const totalDuration = Math.max(lastDate - nowTime, 1000);

                    const currentDate = new Date(segment.date).getTime();
                    const previousDate = idx === 0
                      ? nowTime
                      : new Date(partnerBTimeline[idx - 1].date).getTime();

                    const segmentDuration = currentDate - previousDate;
                    const widthPercent = (segmentDuration / totalDuration) * 100;

                    if (widthPercent <= 0) return null;

                    let colorClass = 'bg-gray-300';
                    if (segment.status === 'harmonious') colorClass = 'bg-green-500';
                    if (segment.status === 'caution') colorClass = 'bg-amber-500';
                    if (segment.status === 'high_awareness') colorClass = 'bg-red-500';

                    return (
                      <div
                        key={idx}
                        className={`h-full ${colorClass} opacity-70 hover:opacity-100 transition-all cursor-help relative group border-r border-white/10 last:border-r-0`}
                        style={{ width: `${widthPercent}%` }}
                        onMouseEnter={() => setHoveredSegment({
                          date: new Date(segment.date),
                          status: segment.status,
                          description: segment.description,
                          person: partnerB.name
                        })}
                        onMouseLeave={() => setHoveredSegment(null)}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg pointer-events-none">
                          <p className="font-bold">{format(new Date(segment.date), 'MMM yyyy')}</p>
                          <p>{segment.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center text-sm text-gray-500">Timeline data unavailable</div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-green-500/70" />
            <span>Harmonious</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-amber-500/70" />
            <span>Caution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-red-500/70" />
            <span>High Awareness</span>
          </div>
        </div>

        {/* Hover Insights Section */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50">
          <div className={`p-4 rounded-xl transition-all duration-300 ${hoveredSegment
            ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 shadow-sm'
            : 'bg-gray-50/50 dark:bg-gray-900/20 border border-transparent'
            }`}>
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-lg transition-colors ${hoveredSegment ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                }`}>
                {hoveredSegment ? <Sparkles className="w-5 h-5 animate-pulse" /> : <Info className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 dark:text-gray-100 transition-colors">
                  {hoveredSegment ? `${hoveredSegment.person}'s Cycle Trace` : 'Timeline Insights'}
                  {hoveredSegment && (
                    <span className="ml-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                      ({format(hoveredSegment.date, 'MMMM yyyy')})
                    </span>
                  )}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed min-h-[2.5rem]">
                  {hoveredSegment ? hoveredSegment.description : 'Explore the planetary cycles by hovering over the colored segments. Each section reveals the underlying energy shifts for that specific time window.'}
                </p>
                {hoveredSegment && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${hoveredSegment.status === 'harmonious' ? 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30' :
                      hoveredSegment.status === 'caution' ? 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30' :
                        'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${hoveredSegment.status === 'harmonious' ? 'bg-green-500' :
                        hoveredSegment.status === 'caution' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                      {hoveredSegment.status.replace('_', ' ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transit Notes */}
      {transitNotes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
                <Sparkles className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                Important Planetary Transits
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
                Current planetary movements affecting your marriage timing
              </p>
            </div>
            <button
              onClick={() => setShowHelp(showHelp === 'transit' ? null : 'transit')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {showHelp === 'transit' && (
            <HelpBox title="What are Transits?">
              <strong>Transits (Gochara)</strong> are the current positions of planets in the sky as they move
              through zodiac signs. They trigger events promised in your birth chart. Jupiter transiting your
              7th house or aspecting it brings marriage opportunities. Saturn transits bring stability but
              delays. Venus transits activate romance.
            </HelpBox>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {transitNotes.map((note, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30 transition-colors">
                <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 transition-colors">{note}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timing Tips */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Marriage Timing Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none">💡</span>
              <span>The most favorable time is when both partners have overlapping positive Dasha periods.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none">🌟</span>
              <span>Jupiter transits through the 7th house or aspecting it are excellent for marriage.</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none">⏰</span>
              <span>Avoid Saturn's return periods (age 28-30, 56-60) for major relationship decisions.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none">🎯</span>
              <span>Venus-Jupiter conjunctions are highly favorable for proposals and weddings.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function
function getPeriodExplanation(confidence: number): string {
  if (confidence >= 80) {
    return 'Major marriage-benefic planets are strongly aligned. This is an excellent time for marriage decisions.';
  } else if (confidence >= 60) {
    return 'Good planetary support for marriage with some minor challenges that can be managed.';
  } else if (confidence >= 40) {
    return 'Moderate planetary alignment. Marriage possible but may require extra effort and patience.';
  } else {
    return 'Planetary alignment is weak. Consider waiting for a better period if possible.';
  }
}

export default TimingWidget;
