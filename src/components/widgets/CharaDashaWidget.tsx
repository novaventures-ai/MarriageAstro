/**
 * CharaDashaWidget
 * Visualises the Jaimini Chara Dasha timeline for both partners.
 * Shows current period, upcoming windows, and marriage-favorable periods.
 */

import React, { useState } from 'react';
import { Calendar, Star, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { CharaDashaAnalysis } from '../../types/extendedTypes';
import { JargonTooltip } from '../ui/JargonTooltip';

interface CharaDashaWidgetProps {
  partnerA: CharaDashaAnalysis;
  partnerB: CharaDashaAnalysis;
  nameA?: string;
  nameB?: string;
}

const SIGN_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

const PLANET_COLORS: Record<string, string> = {
  Sun: 'amber', Moon: 'slate', Mars: 'red', Mercury: 'green', Jupiter: 'yellow',
  Venus: 'pink', Saturn: 'indigo', Rahu: 'purple', Ketu: 'orange',
};

function formatDate(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

function isFavorable(analysis: CharaDashaAnalysis, sign: string): boolean {
  return analysis.marriageTiming.favorableSigns.includes(sign as any);
}

export const CharaDashaWidget: React.FC<CharaDashaWidgetProps> = ({
  partnerA, partnerB, nameA = 'Partner A', nameB = 'Partner B'
}) => {
  const [selected, setSelected] = useState<'A' | 'B'>('A');
  const data = selected === 'A' ? partnerA : partnerB;
  const activeName = selected === 'A' ? nameA : nameB;
  const { currentPeriod, upcomingPeriods, marriageTiming } = data;

  const allPeriods = [currentPeriod, ...upcomingPeriods].slice(0, 7);

  const favCount = allPeriods.filter(p => isFavorable(data, p.sign)).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">Chara Dasha Timeline <JargonTooltip term="Chara Dasha" className="ml-1" /></h2>
            <p className="text-violet-100 text-sm leading-relaxed">
              Jaimini's sign-based dasha system — each sign rules a period of your life.
              Marriage is most likely when Darakaraka, 7th house, or Upapada signs are active.
            </p>
          </div>
        </div>
      </div>

      {/* Partner Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex gap-1">
          {[{ id: 'A' as const, name: nameA }, { id: 'B' as const, name: nameB }].map(({ id, name }) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                selected === id
                  ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Marriage Timing Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-violet-100 dark:border-violet-900/30">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Marriage Timing Analysis — {activeName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 italic">
          {marriageTiming.interpretation}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Darakaraka Sign', value: marriageTiming.darakarakaSign, sign: true },
            { label: '7th from DK', value: marriageTiming.seventhFromDK, sign: true },
            { label: 'Upapada Sign', value: marriageTiming.upapadaSign, sign: true },
            { label: 'Favorable Periods', value: `${favCount} of next ${allPeriods.length}`, sign: false },
          ].map(({ label, value, sign }) => (
            <div key={label} className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-3 text-center">
              <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mb-1">{label}</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {sign && SIGN_SYMBOLS[value]} {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dasha Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-violet-500" />
          Chara Dasha Periods — {activeName}
        </h3>
        <div className="space-y-3">
          {allPeriods.map((period, i) => {
            const favorable = isFavorable(data, period.sign);
            const isCurrent = period.isCurrent || i === 0;
            const color = PLANET_COLORS[period.lord] || 'indigo';

            return (
              <div
                key={`${period.sign}-${i}`}
                className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-md'
                    : favorable
                      ? 'border-amber-300 dark:border-amber-600/50 bg-amber-50/50 dark:bg-amber-900/10'
                      : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                }`}
              >
                {/* Timeline connector */}
                {i < allPeriods.length - 1 && (
                  <div className="absolute left-[30px] top-[56px] w-0.5 h-4 bg-gray-200 dark:bg-gray-700 z-0" />
                )}

                {/* Sign symbol */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 z-10 ${
                  isCurrent ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' :
                  favorable ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {SIGN_SYMBOLS[period.sign] || '♈'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`font-bold text-base ${
                      isCurrent ? 'text-violet-700 dark:text-violet-300' : 'text-gray-800 dark:text-gray-100'
                    }`}>
                      {period.sign} Dasha
                    </span>
                    {isCurrent && (
                      <span className="text-xs font-bold px-2 py-0.5 bg-violet-600 text-white rounded-full">
                        Current
                      </span>
                    )}
                    {favorable && (
                      <span className="text-xs font-bold px-2 py-0.5 bg-amber-500 text-white rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" /> Marriage Window
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Lord: <span className={`font-semibold text-${color}-600 dark:text-${color}-400`}>{period.lord}</span>
                    {' · '}
                    {period.direction === 'reverse' ? '↺ Reverse' : '→ Direct'}
                    {' · '}
                    {period.durationYears.toFixed(1)} yrs
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {formatDate(period.startDate)} <ArrowRight className="w-3 h-3 inline" /> {formatDate(period.endDate)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Favorable Signs Legend */}
      <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-700/30">
        <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-2">Favorable Signs for Marriage</p>
        <div className="flex flex-wrap gap-2">
          {marriageTiming.favorableSigns.map(sign => (
            <span key={sign} className="text-sm px-3 py-1 bg-amber-200 dark:bg-amber-800/40 text-amber-900 dark:text-amber-200 rounded-full font-medium">
              {SIGN_SYMBOLS[sign]} {sign}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
