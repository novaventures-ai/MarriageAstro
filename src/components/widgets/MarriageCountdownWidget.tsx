/**
 * MarriageCountdownWidget
 * Shown prominently for Searcher mode users.
 * Highlights the next favorable marriage window from the timing analysis.
 */

import React from 'react';
import { Calendar, Clock, Sparkles, TrendingUp } from 'lucide-react';

interface FavorableWindow {
  startDate: Date;
  endDate: Date;
  description: string;
  confidence: number;
}

interface VulnerableWindow {
  startDate: Date;
  endDate: Date;
  description: string;
  riskLevel: 'moderate' | 'high';
}

interface Props {
  favorablePeriods: FavorableWindow[];
  vulnerablePeriods?: VulnerableWindow[];
  name: string;
}

const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

export const MarriageCountdownWidget: React.FC<Props> = ({
  favorablePeriods,
  vulnerablePeriods,
  name,
}) => {
  const next = favorablePeriods[0];
  const upcoming = favorablePeriods.slice(1, 3);

  const confidenceLabel = (c: number) => {
    if (c >= 80) return { text: 'Very Strong', color: 'text-emerald-600 dark:text-emerald-400' };
    if (c >= 60) return { text: 'Strong', color: 'text-blue-600 dark:text-blue-400' };
    if (c >= 40) return { text: 'Moderate', color: 'text-amber-600 dark:text-amber-400' };
    return { text: 'Possible', color: 'text-gray-500 dark:text-gray-400' };
  };

  if (!next) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
        <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">No favorable windows found in the near term. Check back after generating your full timing analysis.</p>
      </div>
    );
  }

  const cl = confidenceLabel(next.confidence);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-bold text-lg">Your Next Marriage Window</h3>
        </div>
        <p className="text-violet-200 text-sm">Based on Vimshottari Dasha + transits for {name}</p>
      </div>

      {/* Next window hero */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-7 h-7 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-gray-800 dark:text-gray-100 text-base">Favorable Window</h4>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 ${cl.color}`}>
                {cl.text}
              </span>
            </div>
            <p className="text-violet-600 dark:text-violet-400 font-semibold text-sm mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {fmtDate(next.startDate)} – {fmtDate(next.endDate)}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">{next.description}</p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Window strength</span>
            <span className={`font-semibold ${cl.color}`}>{next.confidence}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-700"
              style={{ width: `${next.confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Upcoming windows */}
      {upcoming.length > 0 && (
        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Further Windows
          </p>
          <div className="space-y-3">
            {upcoming.map((p, i) => {
              const c = confidenceLabel(p.confidence);
              return (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-500 dark:text-gray-400">
                    {i + 2}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-700 dark:text-gray-200">{fmtDate(p.startDate)} – {fmtDate(p.endDate)}</span>
                    <span className={`ml-2 text-xs font-semibold ${c.color}`}>{p.confidence}%</span>
                    {p.description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{p.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Caution note */}
      {vulnerablePeriods && vulnerablePeriods.length > 0 && (
        <div className="px-5 pb-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300">
            <span className="font-semibold">Note:</span> {vulnerablePeriods[0].description}
          </div>
        </div>
      )}
    </div>
  );
};
