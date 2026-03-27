/**
 * AdvancedKPWidget
 * Deep-dive KP significators table + cuspal interlinks + marriage timing.
 * Premium (kp_detail) gated — shown below the main KPAnalysisWidget.
 */

import React, { useState } from 'react';
import { Crosshair, Link2, Shield, ShieldAlert, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { KPAnalysis, KPSignificatorDetailed } from '../../types/extendedTypes';

interface AdvancedKPWidgetProps {
  partnerA: KPAnalysis;
  partnerB: KPAnalysis;
  nameA?: string;
  nameB?: string;
}

const PLANET_COLORS: Record<string, string> = {
  Sun: 'amber', Moon: 'slate', Mars: 'red', Mercury: 'emerald', Jupiter: 'yellow',
  Venus: 'pink', Saturn: 'indigo', Rahu: 'purple', Ketu: 'orange',
};

const STRENGTH_STYLES: Record<string, string> = {
  strong: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  moderate: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
  weak: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
};

const SEVERITY_STYLES: Record<string, string> = {
  low: 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
  moderate: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
  high: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
};

function HouseTag({ house }: { house: number }) {
  const isMarriageHouse = [1, 2, 7, 11].includes(house);
  const isBreakHouse = [6, 8, 12].includes(house);
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-1 ${
      isMarriageHouse ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300' :
      isBreakHouse ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
      'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
    }`}>
      {house}
    </span>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">{icon}</div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

export const AdvancedKPWidget: React.FC<AdvancedKPWidgetProps> = ({
  partnerA, partnerB, nameA = 'Partner A', nameB = 'Partner B'
}) => {
  const [selected, setSelected] = useState<'A' | 'B'>('A');
  const data = selected === 'A' ? partnerA : partnerB;
  const activeName = selected === 'A' ? nameA : nameB;

  const marriageSigs = data.significators.filter(s => s.significations.some(h => [1, 2, 7, 11].includes(h)));
  const breakSigs = data.significators.filter(s => s.significations.some(h => [6, 8, 12].includes(h)));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Crosshair className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">Advanced KP Significators</h2>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Complete significator table with sub-lords, star lords, and 4-level analysis.
              Houses 1-2-7-11 support marriage; 6-8-12 indicate obstacles or delay.
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
                  ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* House Legend */}
      <div className="flex flex-wrap gap-3 text-xs px-1">
        <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">7</span> Marriage houses (1,2,7,11)</span>
        <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 flex items-center justify-center font-bold text-xs">8</span> Obstacle houses (6,8,12)</span>
        <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center font-bold text-xs">3</span> Neutral houses</span>
      </div>

      {/* Significators Table */}
      <SectionCard title={`Full Significator Table — ${activeName}`} icon={<Activity className="w-5 h-5" />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="text-left py-2 pr-3">Planet</th>
                <th className="text-left py-2 pr-3">Star Lord</th>
                <th className="text-left py-2 pr-3">Sub Lord</th>
                <th className="text-left py-2 pr-3">Signified Houses</th>
                <th className="text-left py-2">Strength</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {data.significators.map((sig: KPSignificatorDetailed, i: number) => {
                const pc = PLANET_COLORS[sig.planet] || 'indigo';
                return (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-2.5 pr-3">
                      <span className={`font-bold text-${pc}-700 dark:text-${pc}-400`}>{sig.planet}</span>
                      <span className="text-xs text-gray-400 ml-1">(H{sig.occupiedHouse})</span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className={`text-${PLANET_COLORS[sig.starLord] || 'gray'}-600 dark:text-${PLANET_COLORS[sig.starLord] || 'gray'}-400 font-medium`}>{sig.starLord}</span>
                      <div className="text-xs text-gray-400">
                        {sig.starLordHouses.map(h => <HouseTag key={h} house={h} />)}
                      </div>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className={`text-${PLANET_COLORS[sig.subLord] || 'gray'}-600 dark:text-${PLANET_COLORS[sig.subLord] || 'gray'}-400 font-medium`}>{sig.subLord}</span>
                      <div className="text-xs text-gray-400">
                        {sig.subLordHouses.map(h => <HouseTag key={h} house={h} />)}
                      </div>
                    </td>
                    <td className="py-2.5 pr-3">
                      <div className="flex flex-wrap gap-1">
                        {sig.significations.map(h => <HouseTag key={h} house={h} />)}
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STRENGTH_STYLES[sig.strength]}`}>
                        {sig.strength}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Quick summary */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3">
            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-2">Marriage Significators ({marriageSigs.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {marriageSigs.map(s => (
                <span key={s.planet} className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-full font-medium">{s.planet}</span>
              ))}
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-3">
            <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">Obstacle Significators ({breakSigs.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {breakSigs.map(s => (
                <span key={s.planet} className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full font-medium">{s.planet}</span>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Cuspal Interlinks */}
      {data.cuspalInterlinks && (
        <SectionCard title="Cuspal Interlink Analysis" icon={<Link2 className="w-5 h-5" />}>
          {/* Breakdown houses */}
          <div className={`p-4 rounded-xl mb-4 ${SEVERITY_STYLES[data.cuspalInterlinks.breakdownGrouping.severity]}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm">Breakdown Houses (6-8-12)</p>
              <span className="text-xs font-bold capitalize px-2 py-0.5 bg-white/40 rounded-full">
                {data.cuspalInterlinks.breakdownGrouping.severity} risk
              </span>
            </div>
            <p className="text-xs mb-3">{data.cuspalInterlinks.breakdownGrouping.interpretation}</p>
            {data.cuspalInterlinks.breakdownGrouping.isActive && (
              <div className="space-y-1.5">
                {data.cuspalInterlinks.breakdownGrouping.houses6_8_12.map(h => (
                  <div key={h.house} className="flex items-center gap-2 text-xs bg-white/30 dark:bg-black/20 rounded-lg p-2">
                    <HouseTag house={h.house} />
                    <span>Sub-Lord: <strong>{h.subLord}</strong></span>
                    <span className="text-gray-500">→ signifies houses:</span>
                    <div className="flex">{h.significations.map(s => <HouseTag key={s} house={s} />)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sub-lord chains */}
          {data.cuspalInterlinks.subLordChain.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Sub-Lord Chains</p>
              <div className="space-y-2">
                {data.cuspalInterlinks.subLordChain.map((chain, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg text-xs">
                    <span className={`font-bold text-${PLANET_COLORS[chain.planet] || 'indigo'}-600 dark:text-${PLANET_COLORS[chain.planet] || 'indigo'}-400 min-w-[60px]`}>{chain.planet}</span>
                    <span className="text-gray-600 dark:text-gray-400 flex-1">{chain.connectionPath}</span>
                    <div className="flex flex-shrink-0">{chain.houses.map(h => <HouseTag key={h} house={h} />)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* Protection Formula */}
      {data.protectionFormula && (
        <SectionCard title="Protection Formula" icon={data.protectionFormula.isActive ? <Shield className="w-5 h-5 text-green-500" /> : <ShieldAlert className="w-5 h-5 text-red-500" />}>
          <div className={`p-4 rounded-xl ${
            data.protectionFormula.strength === 'high' ? 'bg-green-50 dark:bg-green-900/20' :
            data.protectionFormula.strength === 'moderate' ? 'bg-amber-50 dark:bg-amber-900/10' :
            'bg-red-50 dark:bg-red-900/10'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-sm capitalize">{data.protectionFormula.isActive ? 'Protection Active' : 'Protection Absent'}</span>
              <span className={`text-xs font-bold capitalize px-2 py-0.5 rounded-full ${
                data.protectionFormula.strength === 'high' ? 'bg-green-200 dark:bg-green-800/40 text-green-800 dark:text-green-300' :
                data.protectionFormula.strength === 'moderate' ? 'bg-amber-200 dark:bg-amber-800/40 text-amber-800 dark:text-amber-300' :
                'bg-red-200 dark:bg-red-800/40 text-red-800 dark:text-red-300'
              }`}>{data.protectionFormula.strength}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{data.protectionFormula.interpretation}</p>
            <div className="flex flex-wrap gap-1">
              {data.protectionFormula.houses.map(h => <HouseTag key={h} house={h} />)}
            </div>
          </div>
        </SectionCard>
      )}

      {/* Ruling Planets */}
      <SectionCard title={`Ruling Planets — ${activeName}`} icon={<Activity className="w-5 h-5" />}>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(data.rulingPlanets).map(([key, planet]) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
            const pc = PLANET_COLORS[planet as string] || 'indigo';
            return (
              <div key={key} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                <p className={`font-bold text-${pc}-700 dark:text-${pc}-400`}>{planet as string}</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
          Ruling planets at the time of query strengthen the periods active in Dasha sequence when they also signify marriage houses (1-2-7-11).
        </p>
      </SectionCard>
    </div>
  );
};
