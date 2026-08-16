import React, { useMemo, useState } from 'react';
import { Chart } from '../../types';
import { calculateAshtakavarga } from '@lib/ashtakavarga';
import { Grid3X3, HelpCircle, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface AshtakavargaWidgetProps {
  chart: Chart;
  name?: string;
}

const HOUSE_MEANINGS: Record<number, string> = {
  1: 'Self, vitality',
  2: 'Wealth, family',
  3: 'Courage, siblings',
  4: 'Home, comfort',
  5: 'Children, romance',
  6: 'Health, obstacles',
  7: 'Marriage, partner',
  8: 'Longevity, crises',
  9: 'Fortune, dharma',
  10: 'Career, status',
  11: 'Gains, fulfilment',
  12: 'Loss, letting go',
};

/** SAV bands — the 12-house average is 28 bindus (337/12). */
function savTone(bindus: number) {
  if (bindus >= 32) return { label: 'Strong', bar: 'bg-green-500', chip: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700' };
  if (bindus >= 28) return { label: 'Good', bar: 'bg-blue-500', chip: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700' };
  if (bindus >= 25) return { label: 'Average', bar: 'bg-amber-500', chip: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700' };
  return { label: 'Needs care', bar: 'bg-red-500', chip: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700' };
}

export const AshtakavargaWidget: React.FC<AshtakavargaWidgetProps> = ({ chart, name = 'You' }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [showPlanets, setShowPlanets] = useState(false);

  const av = useMemo(() => {
    try {
      return calculateAshtakavarga(chart);
    } catch {
      return null;
    }
  }, [chart]);

  if (!av) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md text-center transition-colors">
        <p className="text-gray-500 dark:text-gray-400 italic transition-colors">Ashtakavarga data not available for this chart.</p>
      </div>
    );
  }

  const signAtHouse = (house: number) => {
    const ascIdx = av.signOrder.indexOf(av.ascendantSign);
    return av.signOrder[(ascIdx + house - 1) % 12];
  };

  const strongest = av.sarva.byHouse.reduce((best, v, i) => (v > av.sarva.byHouse[best] ? i : best), 0);
  const weakest = av.sarva.byHouse.reduce((low, v, i) => (v < av.sarva.byHouse[low] ? i : low), 0);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-t-4 border-teal-500 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 transition-colors">
            <Grid3X3 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            Ashtakavarga Strength — {name}
          </h3>
          <button
            onClick={() => setShowHelp(!showHelp)}
            aria-label="What is Ashtakavarga?"
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {showHelp && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-colors">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">What is Ashtakavarga?</h5>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Each house collects &ldquo;bindus&rdquo; (benefic points) from all seven planets plus your Ascendant —
                  a total of 337 across the chart, so the average house holds 28. Houses scoring well above 28 are
                  areas life tends to support you; those below 25 are the areas that reward conscious effort.
                  This is the classical tool for judging <em>when</em> a transit through a house will actually help.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Headline read */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 transition-colors">
            <p className="text-[11px] uppercase tracking-wider font-bold text-green-700 dark:text-green-300">Most supported</p>
            <p className="text-lg font-bold text-green-900 dark:text-green-100">
              House {strongest + 1} · {av.sarva.byHouse[strongest]} bindus
            </p>
            <p className="text-xs text-green-800 dark:text-green-200">{HOUSE_MEANINGS[strongest + 1]}</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 transition-colors">
            <p className="text-[11px] uppercase tracking-wider font-bold text-amber-700 dark:text-amber-300">Needs most care</p>
            <p className="text-lg font-bold text-amber-900 dark:text-amber-100">
              House {weakest + 1} · {av.sarva.byHouse[weakest]} bindus
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-200">{HOUSE_MEANINGS[weakest + 1]}</p>
          </div>
        </div>

        {/* SAV per house */}
        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 transition-colors">
          Sarvashtakavarga — total bindus by house
        </h4>
        <div className="space-y-2">
          {av.sarva.byHouse.map((bindus, i) => {
            const tone = savTone(bindus);
            return (
              <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-200 flex-shrink-0 transition-colors">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1 gap-2">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate transition-colors">
                      {signAtHouse(i + 1)} <span className="font-normal text-gray-500 dark:text-gray-400">· {HOUSE_MEANINGS[i + 1]}</span>
                    </span>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 flex-shrink-0 transition-colors">{bindus}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors">
                    <div className={`h-full transition-all duration-1000 ${tone.bar}`} style={{ width: `${Math.min(100, (bindus / 40) * 100)}%` }} />
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border flex-shrink-0 transition-colors ${tone.chip}`}>
                  {tone.label}
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 transition-colors">
          Total across all houses: <strong>{av.sarva.total}</strong> bindus (always 337) · average per house 28.
        </p>

        {/* Per-planet BAV */}
        <button
          onClick={() => setShowPlanets(!showPlanets)}
          className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700/60 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {showPlanets ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showPlanets ? 'Hide' : 'Show'} each planet&rsquo;s own bindus (Bhinnashtakavarga)
        </button>

        {showPlanets && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="text-gray-500 dark:text-gray-400">
                  <th className="text-left py-2 pr-2 font-bold uppercase tracking-wider">Planet</th>
                  {Array.from({ length: 12 }, (_, i) => (
                    <th key={i} className="py-2 px-1 font-bold text-center">{i + 1}</th>
                  ))}
                  <th className="py-2 pl-2 font-bold text-center">Tot</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(av.bhinna).map(([planet, bav]) => (
                  <tr key={planet} className="border-t border-gray-200 dark:border-gray-700 transition-colors">
                    <td className="py-2 pr-2 font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap transition-colors">{planet}</td>
                    {bav.byHouse.map((b, i) => (
                      <td
                        key={i}
                        className={`py-2 px-1 text-center font-medium transition-colors ${
                          b >= 5 ? 'text-green-600 dark:text-green-400'
                            : b <= 2 ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {b}
                      </td>
                    ))}
                    <td className="py-2 pl-2 text-center font-bold text-gray-700 dark:text-gray-200 transition-colors">{bav.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 transition-colors">
              Columns are houses 1–12. For a single planet, 5 or more bindus in a house is strong; 2 or fewer is weak.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
