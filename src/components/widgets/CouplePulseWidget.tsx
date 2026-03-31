/**
 * CouplePulseWidget
 * Navigator mode — shows the current month's relationship energy
 * based on both partners' active Dashas and seasonal transit quality.
 */

import React from 'react';
import { Compass, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import { Chart } from '@types';

interface DashaEntry {
  planet: string;
  isCurrent: boolean;
  endDate?: Date | string;
}

interface Props {
  chartA: Chart;
  chartB: Chart;
  nameA: string;
  nameB: string;
}

const PLANET_ENERGY: Record<string, { nature: string; theme: string; quality: 'harmonious' | 'neutral' | 'tense' }> = {
  Jupiter: { nature: 'Expansive', theme: 'Growth, wisdom, abundance', quality: 'harmonious' },
  Venus:   { nature: 'Harmonious', theme: 'Love, beauty, connection', quality: 'harmonious' },
  Moon:    { nature: 'Emotional', theme: 'Feelings, intimacy, nurturing', quality: 'harmonious' },
  Mercury: { nature: 'Communicative', theme: 'Dialogue, plans, mental clarity', quality: 'neutral' },
  Sun:     { nature: 'Assertive', theme: 'Identity, ego, leadership', quality: 'neutral' },
  Mars:    { nature: 'Intense', theme: 'Passion, conflict, energy', quality: 'tense' },
  Saturn:  { nature: 'Restrictive', theme: 'Discipline, delays, hard lessons', quality: 'tense' },
  Rahu:    { nature: 'Disruptive', theme: 'Obsession, sudden changes, illusion', quality: 'tense' },
  Ketu:    { nature: 'Detaching', theme: 'Withdrawal, spiritual shift, endings', quality: 'tense' },
};

const qualityStyles = {
  harmonious: { label: 'Harmonious Period', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800/40', icon: TrendingUp },
  neutral:    { label: 'Steady Period', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800/40', icon: Minus },
  tense:      { label: 'Challenging Period', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800/40', icon: TrendingDown },
};

export const CouplePulseWidget: React.FC<Props> = ({ chartA, chartB, nameA, nameB }) => {
  const dashaA = chartA.dashas?.find((d: DashaEntry) => d.isCurrent);
  const dashaB = chartB.dashas?.find((d: DashaEntry) => d.isCurrent);

  const energyA = dashaA ? PLANET_ENERGY[dashaA.planet] : null;
  const energyB = dashaB ? PLANET_ENERGY[dashaB.planet] : null;

  // Compute combined quality
  const combined = getCombinedQuality(energyA?.quality, energyB?.quality);
  const style = qualityStyles[combined];
  const Icon = style.icon;

  const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className={`rounded-2xl border ${style.border} ${style.bg} overflow-hidden`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-current/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className={`w-5 h-5 ${style.color}`} />
          <h3 className={`font-bold text-base ${style.color}`}>Couple Pulse — {month}</h3>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-white/60 dark:bg-black/20 ${style.color}`}>
          <Icon className="w-3 h-3 inline mr-1" />
          {style.label}
        </span>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Partner A Dasha */}
        <DashaSummary
          name={nameA}
          dasha={dashaA}
          energy={energyA}
        />
        {/* Partner B Dasha */}
        <DashaSummary
          name={nameB}
          dasha={dashaB}
          energy={energyB}
        />
      </div>

      {/* Combined guidance */}
      <div className="px-5 pb-5">
        <div className="bg-white/60 dark:bg-black/20 rounded-xl p-4 text-sm">
          <p className={`font-semibold ${style.color} mb-1`}>This month's focus</p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {getCombinedGuidance(combined, energyA, energyB, nameA, nameB)}
          </p>
        </div>
      </div>
    </div>
  );
};

const DashaSummary: React.FC<{
  name: string;
  dasha: DashaEntry | undefined;
  energy: typeof PLANET_ENERGY[string] | null;
}> = ({ name, dasha, energy }) => {
  if (!dasha || !energy) {
    return (
      <div className="rounded-xl bg-white/50 dark:bg-black/10 p-4 text-sm text-gray-500 dark:text-gray-400">
        <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">{name}</p>
        <p className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Dasha data unavailable</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white/50 dark:bg-black/10 p-4">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">{name}</p>
      <p className="font-bold text-gray-800 dark:text-gray-100 text-base">{dasha.planet} Dasha</p>
      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-0.5">{energy.nature} energy</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{energy.theme}</p>
      {dasha.endDate && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Until: {dasha.endDate instanceof Date ? dasha.endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : String(dasha.endDate)}
        </p>
      )}
    </div>
  );
};

function getCombinedQuality(
  a?: 'harmonious' | 'neutral' | 'tense',
  b?: 'harmonious' | 'neutral' | 'tense'
): 'harmonious' | 'neutral' | 'tense' {
  if (!a || !b) return 'neutral';
  const map = { harmonious: 0, neutral: 1, tense: 2 };
  const avg = (map[a] + map[b]) / 2;
  if (avg <= 0.5) return 'harmonious';
  if (avg <= 1.5) return 'neutral';
  return 'tense';
}

function getCombinedGuidance(
  quality: 'harmonious' | 'neutral' | 'tense',
  energyA: typeof PLANET_ENERGY[string] | null,
  energyB: typeof PLANET_ENERGY[string] | null,
  nameA: string,
  nameB: string
): string {
  if (quality === 'harmonious') {
    return `Both ${nameA} and ${nameB} are running positive Dasha energies this month. This is an excellent time for important conversations, decisions, and deepening connection. Use this window intentionally.`;
  }
  if (quality === 'tense') {
    return `One or both partners are in a more demanding Dasha phase. Expect heightened sensitivity and potential friction. Prioritise patience, avoid major confrontations, and focus on listening over reacting.`;
  }
  return `A steady, workable month. No major planetary storms — but no exceptional support either. Good for routine relationship maintenance, honest conversations, and practical planning together.`;
}
