import React, { useMemo, useState } from 'react';
import { Chart } from '../../types';
import { calculateShadbala } from '@lib/shadbala';
import { calculateYoginiDasha } from '@lib/yoginiDasha';
import { Gauge, Clock, HelpCircle, BookOpen, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface StrengthTimingWidgetProps {
  chart: Chart;
  name?: string;
}

const fmt = (d: Date | string) => {
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

/** Yogini flavour — the classical temperament of each period. */
const YOGINI_NATURE: Record<string, string> = {
  Mangala: 'Auspicious beginnings, momentum',
  Pingala: 'Visibility, authority, ego tests',
  Dhanya: 'Prosperity, learning, good fortune',
  Bhramari: 'Movement, restlessness, travel',
  Bhadrika: 'Communication, intellect, steadiness',
  Ulka: 'Friction, endurance, hard lessons',
  Siddha: 'Accomplishment, comfort, success',
  Sankata: 'Pressure, transformation, caution',
};

export const StrengthTimingWidget: React.FC<StrengthTimingWidgetProps> = ({ chart, name = 'You' }) => {
  const [showShadbalaHelp, setShowShadbalaHelp] = useState(false);
  const [showYoginiHelp, setShowYoginiHelp] = useState(false);
  const [showScope, setShowScope] = useState(false);
  const [showAllYogini, setShowAllYogini] = useState(false);

  const shadbala = useMemo(() => {
    try { return calculateShadbala(chart); } catch { return null; }
  }, [chart]);

  const yogini = useMemo(() => {
    try { return calculateYoginiDasha(chart); } catch { return null; }
  }, [chart]);

  const currentYogini = yogini?.periods.find(p => p.isCurrent) || null;
  const currentAntar = currentYogini?.antardashas?.find(a => a.isCurrent) || null;
  const upcoming = yogini
    ? yogini.periods.filter(p => p.endDate > new Date()).slice(0, showAllYogini ? 12 : 5)
    : [];

  return (
    <div className="space-y-6">
      {/* ─── Shadbala ─────────────────────────────────────────────── */}
      {shadbala && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-t-4 border-indigo-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 transition-colors">
              <Gauge className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Planetary Power (Shadbala) — {name}
            </h3>
            <button
              onClick={() => setShowShadbalaHelp(!showShadbalaHelp)}
              aria-label="What is Shadbala?"
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          {showShadbalaHelp && (
            <div className="mb-5 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-colors">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">What is Shadbala?</h5>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    &ldquo;Six-fold strength&rdquo; — it scores each planet on position, direction, time, motion,
                    natural power and aspect, measured in <em>rupas</em>. Each planet has a minimum it should reach
                    to act reliably. A planet above its requirement delivers its promise more consistently.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Honesty banner — the total is a lower bound, say so up front. */}
          <button
            onClick={() => setShowScope(!showScope)}
            className="w-full mb-5 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-800 text-left transition-colors"
          >
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">
                  Partial calculation — read as indicative, not final
                  {showScope ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />}
                </p>
                {showScope && (
                  <div className="mt-2 text-xs text-amber-700 dark:text-amber-300 space-y-2">
                    <p>{shadbala.completeness.note}</p>
                    <div>
                      <p className="font-semibold">Fully computed:</p>
                      <ul className="list-disc list-inside">
                        {shadbala.completeness.fullyComputed.map((x, i) => <li key={i}>{x}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold">Approximated:</p>
                      <ul className="list-disc list-inside">
                        {shadbala.completeness.approximated.map((x, i) => <li key={i}>{x}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold">Not included:</p>
                      <ul className="list-disc list-inside">
                        {shadbala.completeness.omitted.map((x, i) => <li key={i}>{x}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </button>

          <div className="space-y-3">
            {Object.entries(shadbala.planets).map(([planet, p]) => (
              <div key={planet} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1 gap-2">
                    <span className="font-bold text-gray-800 dark:text-gray-100 transition-colors">{planet}</span>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex-shrink-0 transition-colors">
                      {p.totalRupas} / {p.requiredRupas} rupas
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors">
                    <div
                      className={`h-full transition-all duration-1000 ${p.meetsRequirement ? 'bg-green-500' : p.ratio >= 0.8 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, p.ratio * 100)}%` }}
                    />
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase border flex-shrink-0 transition-colors ${
                    p.meetsRequirement
                      ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
                      : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700'
                  }`}
                >
                  {p.meetsRequirement ? 'Meets' : 'Below'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Yogini Dasha ─────────────────────────────────────────── */}
      {yogini && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-t-4 border-fuchsia-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 transition-colors">
              <Clock className="w-6 h-6 text-fuchsia-600 dark:text-fuchsia-400" />
              Yogini Dasha Timeline — {name}
            </h3>
            <button
              onClick={() => setShowYoginiHelp(!showYoginiHelp)}
              aria-label="What is Yogini Dasha?"
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          {showYoginiHelp && (
            <div className="mb-5 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-colors">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">What is Yogini Dasha?</h5>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    An eight-part cycle of 36 years, set by your Moon&rsquo;s birth star. It runs alongside your main
                    Vimshottari timeline as a <em>second opinion</em> on timing — when both systems point at the same
                    stretch of years, that reading is much more reliable.
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentYogini && (
            <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white">
              <p className="text-[11px] uppercase tracking-wider font-bold opacity-80">Running now</p>
              <p className="text-2xl font-bold">{currentYogini.yogini}</p>
              <p className="text-sm opacity-90">
                Ruled by {currentYogini.lord} · {fmt(currentYogini.startDate)} – {fmt(currentYogini.endDate)}
              </p>
              <p className="text-sm mt-1 opacity-95">{YOGINI_NATURE[currentYogini.yogini]}</p>
              {currentAntar && (
                <p className="text-xs mt-2 opacity-80">
                  Sub-period: {currentAntar.yogini} ({currentAntar.lord}) until {fmt(currentAntar.endDate)}
                </p>
              )}
            </div>
          )}

          <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 transition-colors">
            What comes next
          </h4>
          <div className="space-y-2">
            {upcoming.map((p, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  p.isCurrent
                    ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20 border-fuchsia-300 dark:border-fuchsia-700'
                    : 'bg-gray-50 dark:bg-gray-900/50 border-transparent'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100 transition-colors">
                    {p.yogini} <span className="font-normal text-gray-500 dark:text-gray-400">· {p.lord}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{YOGINI_NATURE[p.yogini]}</p>
                </div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex-shrink-0 transition-colors">
                  {fmt(p.startDate)} – {fmt(p.endDate)}
                </span>
              </div>
            ))}
          </div>

          {yogini.periods.filter(p => p.endDate > new Date()).length > 5 && (
            <button
              onClick={() => setShowAllYogini(!showAllYogini)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700/60 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {showAllYogini ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showAllYogini ? 'Show fewer periods' : 'Show more periods'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
