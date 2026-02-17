/**
 * Self Timing Widget
 * Simplified timing widget for self analysis
 */

import React from 'react';
import { Clock, Calendar, AlertTriangle, CheckCircle, Sparkles, Info } from 'lucide-react';

interface SelfTimingWidgetProps {
  timing: any;
  timingForecast?: any;
}

export const SelfTimingWidget: React.FC<SelfTimingWidgetProps> = ({
  timing,
  timingForecast
}) => {
  if (!timing) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
        <p className="text-gray-500 dark:text-gray-400">Timing analysis not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Marriage Timing Analysis</h2>
        <p className="text-blue-100">
          Favorable periods and timing predictions for your marriage
        </p>
      </div>

      {/* Current Dasha */}
      {timing.currentDasha && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Current Dasha Period
            </h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Planet:</span> {timing.currentDasha.planet}
            </p>
            {timing.currentDasha.startDate && (
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Started: {new Date(timing.currentDasha.startDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Marriage Window */}
      {timingForecast?.nextMarriageWindow && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Next Marriage Window
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                {timingForecast.nextMarriageWindow.yearRange}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Confidence: {timingForecast.nextMarriageWindow.confidence}%
            </p>
            {timingForecast.nextMarriageWindow.favorableMonths && (
              <div className="flex flex-wrap gap-2 mt-3">
                {timingForecast.nextMarriageWindow.favorableMonths.map((month: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm"
                  >
                    {month}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Favorable Periods */}
      {timingForecast?.favorablePeriods && timingForecast.favorablePeriods.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Favorable Periods
            </h3>
          </div>
          <div className="space-y-3">
            {timingForecast.favorablePeriods.map((period: any, index: number) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      {period.period}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {period.dates}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs">
                    {period.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Destiny Synchronization (New) */}
      {timingForecast?.extended?.destinySync && timingForecast.extended.destinySync.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/30 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-xl shadow-lg p-6 border-2 border-amber-200 dark:border-amber-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Destiny Synchronization
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Multi-System Alignment • Higher score = More systems aligned
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-4 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-amber-100 dark:border-amber-800/30">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-500"></div>
                <span className="text-gray-700 dark:text-gray-300"><strong>Gold</strong> = 3 systems</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                <span className="text-gray-700 dark:text-gray-300"><strong>Blue</strong> = 2 systems</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-gray-700 dark:text-gray-300"><strong>Grey</strong> = 1 system</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {timingForecast.extended.destinySync.map((item: any, index: number) => {
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
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isTripleAlignment 
                      ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/30 border-amber-400 dark:border-amber-500 shadow-md ring-1 ring-amber-200' 
                      : isDoubleAlignment
                        ? 'bg-white dark:bg-gray-800 border-indigo-300 dark:border-indigo-600 shadow-sm'
                        : 'bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 opacity-80'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-800 dark:text-gray-100">
                          {item.startDate}
                        </span>
                        {isTripleAlignment && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs rounded-full font-bold flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3 h-3" /> ★★★
                          </span>
                        )}
                        {isDoubleAlignment && !isTripleAlignment && (
                          <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs rounded-full font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> ★★
                          </span>
                        )}
                        {!isDoubleAlignment && (
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                            ★
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {isTripleAlignment 
                          ? "All 3 systems aligned!"
                          : isDoubleAlignment
                            ? "Multiple systems supporting"
                            : "Vimshottari Dasha only"
                        }
                      </p>
                    </div>
                    <div className="text-right ml-2">
                      <span className={`text-xl font-black ${
                        isTripleAlignment ? 'text-amber-600 dark:text-amber-400' : 
                        isDoubleAlignment ? 'text-indigo-600 dark:text-indigo-400' : 
                        'text-gray-500'
                      }`}>
                        {activeSystems}/3
                      </span>
                      <span className="text-xs text-gray-400 block">
                        {item.vimshottariConfidence}%
                      </span>
                    </div>
                  </div>

                  {/* System Alignment Bar */}
                  <div className="mb-3">
                    <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-gray-100">
                      <div className="flex-1 bg-blue-500"></div>
                      <div className={`flex-1 ${item.charaDashaActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className={`flex-1 ${item.vivahSahamActive ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {/* System Badges */}
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded flex items-center gap-1">
                      ✓ Vimshottari
                    </span>
                    <span className={`px-2 py-1 rounded flex items-center gap-1 border ${item.charaDashaActive ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                      {item.charaDashaActive ? '✓' : '✗'} Chara Dasha
                    </span>
                    <span className={`px-2 py-1 rounded flex items-center gap-1 border ${item.vivahSahamActive ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                      {item.vivahSahamActive ? '✓' : '✗'} Vivah Saham
                    </span>
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
            
            if (timingForecast?.extended?.charaDasha?.upcomingPeriods && timingForecast?.extended?.charaDasha?.marriageTiming?.favorableSigns) {
              const now = new Date();
              const futurePeriod = timingForecast.extended.charaDasha.upcomingPeriods.find((p: any) => {
                const startDate = new Date(p.startDate);
                return startDate > now && timingForecast.extended.charaDasha.marriageTiming.favorableSigns.includes(p.sign);
              });
              if (futurePeriod) {
                nextCharaActivation = `${futurePeriod.sign} (${new Date(futurePeriod.startDate).getFullYear()}-${new Date(futurePeriod.endDate).getFullYear()})`;
              }
            }
            
            // Calculate next Vivah Saham activation (Jupiter transit)
            if (timingForecast?.extended?.vivahSaham?.sign) {
              const vivahSign = timingForecast.extended.vivahSaham.sign;
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

      {/* Cautionary Periods */}
      {timingForecast?.cautionaryPeriods && timingForecast.cautionaryPeriods.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Cautionary Periods
            </h3>
          </div>
          <div className="space-y-3">
            {timingForecast.cautionaryPeriods.map((period: any, index: number) => (
              <div
                key={index}
                className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg"
              >
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  {period.period}
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  {period.reason}
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                  Advice: {period.advice}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Milestones */}
      {timingForecast?.keyMilestones && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Key Milestones
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold text-sm">1</div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">When You'll Meet</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{timingForecast.keyMilestones.whenYouMeet}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold text-sm">2</div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">When You'll Decide</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{timingForecast.keyMilestones.whenYouDecide}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold text-sm">3</div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Wedding Window</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{timingForecast.keyMilestones.weddingWindow}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfTimingWidget;
