import React, { useState } from 'react';
import { SexualCompatibility, Chart } from '../../types';
import { ExtendedSexualCompatibility } from '../../types/extendedTypes';
import { Heart, Sparkles, Star, AlertTriangle, HelpCircle, BookOpen, MapPin, Eye, EyeOff, Zap, Activity, Clock, Shield, RefreshCw, AlertCircle } from 'lucide-react';
import { useGeminiInsight } from '../../hooks/useGeminiInsight';
import ReactMarkdown from 'react-markdown';
import {
  resolveYoniKey, getFullYoniData, FullYoniData,
  getNakshatraDetails, getNakshatraCompat, getTopMatches, getBottomMatches,
  getGanaInfo, getYoniMatrixScore, getElementCompat, getPlanetRelationship, getDeityBlessing
} from './sexualCompatHelpers';

interface Props {
  sexualCompatibility: SexualCompatibility;
  extendedSexualCompatibility?: ExtendedSexualCompatibility;
  partnerAName?: string;
  partnerBName?: string;
  chartA?: Chart;
  chartB?: Chart;
}

export const SexualCompatibilityWidget: React.FC<Props> = ({
  sexualCompatibility, extendedSexualCompatibility, partnerAName = 'Partner A', partnerBName = 'Partner B', chartA, chartB
}) => {
  const { yoniMatch, nakshatraMatch, overallScore, recommendations } = sexualCompatibility;
  const getMoonNakshatra = (chart?: Chart) => chart?.planetaryPositions?.find(p => p.planet === 'Moon')?.nakshatra;
  const nakshatraA = getMoonNakshatra(chartA) || nakshatraMatch?.nakshatraA;
  const nakshatraB = getMoonNakshatra(chartB) || nakshatraMatch?.nakshatraB;

  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'yoni' | 'nakshatra'>('overview');
  const [showSensitive, setShowSensitive] = useState(false);
  const [revealedAnatomy, setRevealedAnatomy] = useState<Record<string, boolean>>({});

  const { loading, insight, error, triggerAnalysis } = useGeminiInsight();

  const scoreColor = (s: number) => s >= 80 ? 'text-green-600 dark:text-green-400' : s >= 60 ? 'text-blue-600 dark:text-blue-400' : s >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
  const scoreBg = (s: number) => s >= 80 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30' : s >= 60 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30' : s >= 40 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30';

  const yoniAFull = getFullYoniData(yoniMatch.yoniA);
  const yoniBFull = getFullYoniData(yoniMatch.yoniB);
  const nkA = nakshatraA ? getNakshatraDetails(nakshatraA) : null;
  const nkB = nakshatraB ? getNakshatraDetails(nakshatraB) : null;
  const nkCompat = nakshatraA && nakshatraB ? getNakshatraCompat(nakshatraA, nakshatraB) : null;

  const toggleReveal = (key: string) => setRevealedAnatomy(prev => ({ ...prev, [key]: !prev[key] }));

  // ============ PHYSIOLOGY SECTION ============
  const renderPhysiology = (name: string, d: FullYoniData | null, isMale: boolean, theme: 'indigo' | 'pink') => {
    if (!d) return null;
    const t = theme;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <h4 className={`text-lg font-semibold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2`}>
          <Sparkles className={`w-5 h-5 text-${t}-500`} /> Physical Nature &amp; Physiology ({name})
        </h4>

        {/* 4-Column Summary Grid (short labels) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-1 mb-1"><Zap className="w-4 h-4 text-yellow-500" /><span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Drive</span></div>
            <p className={`font-bold text-${t}-600 dark:text-${t}-400`}>{d.driveLevel}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-1 mb-1"><Activity className="w-4 h-4 text-green-500" /><span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Stamina</span></div>
            <p className={`font-bold text-${t}-600 dark:text-${t}-400`}>{d.staminaLevel}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-1 mb-1"><Clock className="w-4 h-4 text-blue-500" /><span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Session Style</span></div>
            <p className={`font-bold text-${t}-600 dark:text-${t}-400`}>{d.sessionLevel}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-1 mb-1"><Shield className="w-4 h-4 text-purple-500" /><span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Element</span></div>
            <p className={`font-bold text-${t}-600 dark:text-${t}-400`}>{d.element}</p>
          </div>
        </div>

        {/* Detailed Elaboration Cards */}
        <div className="space-y-4 mb-6">
          {[
            { icon: <Zap className="w-5 h-5 text-yellow-500" />, label: 'Drive', text: d.driveDesc, color: 'border-yellow-400' },
            { icon: <Activity className="w-5 h-5 text-green-500" />, label: 'Stamina', text: d.staminaDesc, color: 'border-green-400' },
            { icon: <Clock className="w-5 h-5 text-blue-500" />, label: 'Session Style', text: d.sessionDesc, color: 'border-blue-400' },
            { icon: <Shield className="w-5 h-5 text-purple-500" />, label: `Element (${d.element})`, text: d.elementDesc, color: 'border-purple-400' },
          ].map(({ icon, label, text, color }) => (
            <div key={label} className={`p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-l-4 ${color}`}>
              <div className="flex items-center gap-2 mb-1">{icon}<span className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">{label}</span></div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
        {/* Characteristics */}
        {d.characteristics.length > 0 && (
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Behavioral Signature:</p>
            <div className="space-y-2">
              {d.characteristics.map((c, i) => (
                <div key={i} className={`flex items-start gap-2 p-2 bg-${t}-50 dark:bg-${t}-900/10 rounded-lg`}>
                  <span className={`text-${t}-500 mt-0.5`}>&bull;</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{c}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {d.compatibilityNotes && (
          <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border-l-4 border-amber-400">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Compatibility Insight</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic">{d.compatibilityNotes}</p>
          </div>
        )}
        {/* Anatomy (sensitive) */}
        {showSensitive && d.anatomy && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Physiological Traits (Anatomical):</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(isMale ? ['foreskin', 'girth', 'glans'] : ['opening', 'passage', 'base']).map(trait => d.anatomy[trait] && (
                <div key={trait} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <span className="text-xs uppercase text-gray-500">{trait}</span>
                  {revealedAnatomy[`${name}-${trait}`] ? (
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">{d.anatomy[trait]}</p>
                  ) : (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-500">Protected</span>
                      <button onClick={() => toggleReveal(`${name}-${trait}`)} className="text-xs text-indigo-600 hover:underline">Reveal</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ============ YONI CARD ============
  const renderYoniCard = (name: string, yoniName: string, d: FullYoniData | null, theme: 'purple' | 'pink') => {
    const bg = theme === 'purple' ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/30' : 'bg-pink-50 dark:bg-pink-900/10 border-pink-100 dark:border-pink-800/30';
    const av = theme === 'purple' ? 'bg-purple-600 dark:bg-purple-500' : 'bg-pink-600 dark:bg-pink-500';
    const tc = theme === 'purple' ? 'text-purple-600 dark:text-purple-400' : 'text-pink-600 dark:text-pink-400';
    const bc = theme === 'purple' ? 'text-purple-500' : 'text-pink-500';
    return (
      <div className={`p-5 rounded-xl border ${bg}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 ${av} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md`}>{name.charAt(0)}</div>
          <div><p className={`text-sm ${tc}`}>{name}&apos;s Yoni</p><h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{yoniName}</h4></div>
        </div>
        {d ? (
          <div className="space-y-3">
            <div><p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nature:</p><p className="text-sm text-gray-600 dark:text-gray-400">{d.description.split('.')[0]}</p></div>
            <div><p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Element:</p><p className="text-sm text-gray-600 dark:text-gray-400">{d.elementDesc.split('—')[0]}</p></div>
            <div><p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Core Desires:</p>
              <ul className="mt-1 space-y-1">{d.characteristics.map((c, i) => (<li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"><span className={bc}>&bull;</span>{c}</li>))}</ul>
            </div>
            {(d.bestMatches.length > 0 || d.worstMatches.length > 0) && (
              <div className={`mt-3 pt-3 border-t border-${theme}-200 dark:border-${theme}-800/30`}>
                {d.bestMatches.length > 0 && <div className="mb-2"><span className="text-xs font-semibold text-green-600 dark:text-green-400">Best Matches: </span><div className="flex flex-wrap gap-1 mt-1">{d.bestMatches.map((m, i) => (<span key={i} className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">{m}</span>))}</div></div>}
                {d.worstMatches.length > 0 && <div><span className="text-xs font-semibold text-red-600 dark:text-red-400">Challenging: </span><div className="flex flex-wrap gap-1 mt-1">{d.worstMatches.map((m, i) => (<span key={i} className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">{m}</span>))}</div></div>}
              </div>
            )}
          </div>
        ) : <p className="text-gray-500 italic">Not available</p>}
      </div>
    );
  };

  // ============ NAKSHATRA CARD ============
  const renderNkCard = (name: string, nakshatra: string, d: any, theme: 'indigo' | 'pink') => {
    const topMatches = getTopMatches(nakshatra, 3);
    const bottomMatches = getBottomMatches(nakshatra, 3);
    return (
      <div className={`p-5 bg-${theme}-50 dark:bg-${theme}-900/10 rounded-xl border border-${theme}-100 dark:border-${theme}-800/30`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 bg-${theme}-600 dark:bg-${theme}-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md`}>{name.charAt(0)}</div>
          <div><p className={`text-sm text-${theme}-600 dark:text-${theme}-400`}>{name}&apos;s Nakshatra</p><h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{nakshatra}</h4></div>
        </div>
        {d && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Lord:</strong> {d.lord}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Deity:</strong> {d.deity}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Symbol:</strong> {d.symbol}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Gana:</strong> {d.gana}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Nadi:</strong> {d.nadi}</p>
            {/* Dynamic Top 3 */}
            {topMatches.length > 0 && (
              <div className={`mt-2 pt-2 border-t border-${theme}-200 dark:border-${theme}-800/30`}>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">Top 3 Compatible:</span>
                <div className="flex flex-wrap gap-1 mt-1">{topMatches.map((m, i) => (<span key={i} className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">{m.name} ({m.score})</span>))}</div>
              </div>
            )}
            {bottomMatches.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-red-600 dark:text-red-400">Bottom 3 Challenging:</span>
                <div className="flex flex-wrap gap-1 mt-1">{bottomMatches.map((m, i) => (<span key={i} className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">{m.name} ({m.score})</span>))}</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ============ MAIN RENDER ============
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-lg"><Heart className="w-8 h-8" /></div>
            <div><h2 className="text-2xl font-bold mb-1">Physical &amp; Intimate Compatibility</h2><p className="text-purple-100 text-sm max-w-2xl">Analysis of <strong>Yoni (Physical Nature)</strong> and <strong>Nakshatra (Psychological)</strong> chemistry.</p></div>
          </div>
          <button onClick={() => setShowSensitive(!showSensitive)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${showSensitive ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}>
            {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}{showSensitive ? 'Sensitive: ON' : 'Show Detail'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-2 flex gap-2 no-print">
        {['overview', 'yoni', 'nakshatra'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {/* ======== OVERVIEW ======== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Overall Compatibility Score</h3>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <svg className="w-40 h-40 transform -rotate-90"><circle cx="80" cy="80" r="70" stroke="rgba(139,92,246,0.2)" strokeWidth="12" fill="none" /><circle cx="80" cy="80" r="70" stroke={overallScore >= 80 ? '#22c55e' : overallScore >= 60 ? '#3b82f6' : overallScore >= 40 ? '#eab308' : '#ef4444'} strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={`${overallScore * 4.4} 440`} /></svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-4xl font-bold text-gray-800 dark:text-gray-100">{overallScore}</span><span className="text-sm text-gray-500">out of 100</span></div>
                </div>
                <div className="flex-1">
                  <div className={`p-4 rounded-xl ${scoreBg(overallScore)} mb-4`}>
                    <h4 className={`text-lg font-bold ${scoreColor(overallScore)} mb-2`}>{overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : overallScore >= 40 ? 'Moderate' : 'Challenging'} Compatibility</h4>
                    <p className="text-gray-700 dark:text-gray-300">{overallScore >= 80 ? 'Deep physical and emotional harmony.' : overallScore >= 60 ? 'Good compatibility with room for growth.' : overallScore >= 40 ? 'Different approaches require effort.' : 'Patient communication essential.'}</p>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><span className="text-sm text-purple-700 dark:text-purple-300">Physical: </span><span className="font-bold text-purple-800 dark:text-purple-200">{yoniMatch.score}/100</span></div>
                    <div className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg"><span className="text-sm text-pink-700 dark:text-pink-300">Psychological: </span><span className="font-bold text-pink-800 dark:text-pink-200">{nakshatraMatch.score}/100</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div onClick={() => setActiveTab('yoni')} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500" />Physical Nature</h4>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1"><p className="text-sm text-gray-500">{partnerAName}</p><p className="text-xl font-bold text-purple-700 dark:text-purple-400">{yoniMatch.yoniA}</p></div>
                  <div className="text-2xl text-gray-400">+</div>
                  <div className="flex-1"><p className="text-sm text-gray-500">{partnerBName}</p><p className="text-xl font-bold text-pink-700 dark:text-pink-400">{yoniMatch.yoniB}</p></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{yoniMatch.description}</p>
                <p className="text-xs text-indigo-600 mt-2">Click for detailed analysis &rarr;</p>
              </div>
              <div onClick={() => setActiveTab('nakshatra')} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2"><Star className="w-5 h-5 text-indigo-500" />Nakshatra</h4>
                {nakshatraA && nakshatraB ? (<><div className="flex items-center gap-4 mb-3"><div className="flex-1"><p className="text-sm text-gray-500">{partnerAName}</p><p className="text-xl font-bold text-indigo-700 dark:text-indigo-400">{nakshatraA}</p></div><div className="text-2xl text-gray-400">+</div><div className="flex-1"><p className="text-sm text-gray-500">{partnerBName}</p><p className="text-xl font-bold text-pink-700 dark:text-pink-400">{nakshatraB}</p></div></div><p className="text-sm text-gray-600 dark:text-gray-400">{nakshatraMatch.psychologicalProfile}</p></>) : <p className="text-sm text-gray-500 italic">Not available</p>}
                <p className="text-xs text-indigo-600 mt-2">Click for detailed analysis &rarr;</p>
              </div>
            </div>

            {/* AI Deep Erotic Astrology Reveal */}
            <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden transition-all mt-6">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Heart className="w-32 h-32 text-white" />
              </div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-pink-300" />
                      Deep Erotic Astrology Analysis
                    </h3>
                    <p className="text-purple-200 text-sm mt-1">
                      Ask "The Astrological Sexologist" to analyze deep physical intimacy, sexual chemistry, and erotic potential based on Mars, Venus, D9, and KP data.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const getPlanetData = (c?: Chart, pName?: string) => c?.planetaryPositions?.find(p => p.planet === pName);
                      const marsA = getPlanetData(chartA, 'Mars');
                      const venusA = getPlanetData(chartA, 'Venus');
                      const marsB = getPlanetData(chartB, 'Mars');
                      const venusB = getPlanetData(chartB, 'Venus');

                      // Simulate extracting deep data if directly available, or passing empty string to let AI use prompt Context
                      triggerAnalysis('DEEP_EROTIC_ASTROLOGY', {
                        nameA: partnerAName,
                        nameB: partnerBName,
                        mars: { partnerA: marsA, partnerB: marsB },
                        venus: { partnerA: venusA, partnerB: venusB },
                        houses: {
                          partnerA: { '5th': chartA?.houses?.[4], '8th': chartA?.houses?.[7], '12th': chartA?.houses?.[11] },
                          partnerB: { '5th': chartB?.houses?.[4], '8th': chartB?.houses?.[7], '12th': chartB?.houses?.[11] }
                        },
                        d9Data: extendedSexualCompatibility?.d9NavamsaInsights || 'Analyze D9 Navamsa intimacy connections automatically.',
                        kpData: extendedSexualCompatibility?.kpSublords || 'Analyze KP 5th/8th/12th Cusp Sublords automatically.',
                        yogas: extendedSexualCompatibility?.yogas || 'Identify relevant sexual or passionate yogas.'
                      });
                    }}
                    disabled={loading}
                    className="px-5 py-2 bg-pink-500 text-white rounded-lg font-bold shadow-lg hover:bg-pink-400 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {insight ? 'Reveal Again' : 'Analyze Erotic Chemistry'}
                  </button>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0" />
                    <p className="text-sm text-white">{error}</p>
                  </div>
                )}

                {insight && (
                  <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20 animate-in fade-in slide-in-from-top-2 backdrop-blur-sm max-h-[500px] overflow-y-auto custom-scrollbar">
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{insight}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ======== YONI TAB ======== */}
        {activeTab === 'yoni' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Your Physical Nature Profile</h3>
              <div className="grid md:grid-cols-2 gap-6">{renderYoniCard(partnerAName, yoniMatch.yoniA, yoniAFull, 'purple')}{renderYoniCard(partnerBName, yoniMatch.yoniB, yoniBFull, 'pink')}</div>
              <div className={`mt-6 p-5 rounded-xl border ${scoreBg(yoniMatch.score)}`}>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Match: {yoniMatch.nature}</h4>
                <span className={`text-2xl font-bold ${scoreColor(yoniMatch.score)}`}>{yoniMatch.score}/100</span>
                <p className="text-gray-700 dark:text-gray-300 mt-2">{yoniMatch.description}</p>
                {yoniAFull && yoniBFull && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Understanding Your Match:</h5>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>&bull; {yoniMatch.yoniA === yoniMatch.yoniB ? 'Same animal nature — deep intuitive physical understanding' : `Different natures — learning each other's rhythms deepens connection`}</li>
                      <li>&bull; {yoniAFull.element === yoniBFull.element ? `Shared ${yoniAFull.element} element creates natural energetic resonance` : `${yoniAFull.element} meets ${yoniBFull.element} — complementary contrasts`}</li>
                      <li>&bull; {yoniAFull.bestMatches.includes(resolveYoniKey(yoniMatch.yoniB)) ? `${partnerAName}'s nature naturally attracts ${partnerBName}'s type` : 'Building understanding through patience enhances compatibility'}</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {renderPhysiology(partnerAName, yoniAFull, chartA?.gender === 'male', 'indigo')}
            {renderPhysiology(partnerBName, yoniBFull, chartB?.gender === 'male', 'pink')}
            {/* Intimate Dynamics */}
            {yoniAFull && yoniBFull && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2"><Heart className="w-5 h-5 text-red-500" />Intimate Dynamics</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800/30">
                    <h5 className="font-semibold text-green-800 dark:text-green-300 mb-2">What Works</h5>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {yoniAFull.element === yoniBFull.element && <li>&bull; Shared {yoniAFull.element} creates natural rhythm</li>}
                      {yoniAFull.bestMatches.includes(resolveYoniKey(yoniMatch.yoniB)) && <li>&bull; {partnerAName} naturally attracts {partnerBName}</li>}
                      {yoniBFull.bestMatches.includes(resolveYoniKey(yoniMatch.yoniA)) && <li>&bull; {partnerBName} naturally attracts {partnerAName}</li>}
                      <li>&bull; {yoniMatch.score >= 80 ? 'Deep natural physical chemistry' : 'Communication about preferences enhances connection'}</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800/30">
                    <h5 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Areas for Awareness</h5>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {yoniAFull.element !== yoniBFull.element && <li>&bull; {yoniAFull.element} + {yoniBFull.element} need conscious blending</li>}
                      {yoniAFull.worstMatches.includes(resolveYoniKey(yoniMatch.yoniB)) && <li>&bull; Natural friction — patience recommended</li>}
                      <li>&bull; Discuss preferences openly to avoid assumptions</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======== NAKSHATRA TAB ======== */}
        {activeTab === 'nakshatra' && nakshatraA && nakshatraB && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Nakshatra (Birth Star) Compatibility</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">{renderNkCard(partnerAName, nakshatraA, nkA, 'indigo')}{renderNkCard(partnerBName, nakshatraB, nkB, 'pink')}</div>

              {/* Compatibility Score */}
              {nkCompat && (
                <div className={`p-6 rounded-xl ${scoreBg(nkCompat.score)} mb-6`}>
                  <div className="flex items-center gap-3 mb-4"><MapPin className="w-6 h-6 text-indigo-600" /><h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{nakshatraA} + {nakshatraB}</h4><span className={`text-2xl font-bold ${scoreColor(nkCompat.score)}`}>{nkCompat.score}/100</span></div>
                  <p className="p-4 bg-white dark:bg-gray-900 rounded-lg italic text-gray-700 dark:text-gray-300 mb-4">&quot;{nkCompat.description}&quot;</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg"><h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">What Works:</h5><p className="text-sm text-gray-600 dark:text-gray-400">{nkCompat.score >= 80 ? 'Natural harmony and deep emotional resonance' : nkCompat.score >= 60 ? 'Good potential with conscious effort' : 'Complementary differences fuel growth'}</p></div>
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg"><h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Watch Out For:</h5><p className="text-sm text-gray-600 dark:text-gray-400">{nkCompat.score >= 80 ? 'Over-reliance on natural chemistry' : nkCompat.score >= 60 ? 'Different emotional needs may cause friction' : 'Misaligned expectations need addressing'}</p></div>
                  </div>
                </div>
              )}

              {/* ======== ENRICHMENT SECTIONS ======== */}
              {nkA && nkB && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-500" />Deep Analysis</h4>

                  {/* Gana Analysis */}
                  {(() => {
                    const g = getGanaInfo(nkA.gana, nkB.gana); return (
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                        <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Gana (Temperament) Analysis</h5>
                        <div className="grid md:grid-cols-2 gap-3 mb-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400"><strong>{partnerAName}:</strong> {nkA.gana} — <em>{g.ganaANature}</em></p>
                          <p className="text-sm text-gray-600 dark:text-gray-400"><strong>{partnerBName}:</strong> {nkB.gana} — <em>{g.ganaBNature}</em></p>
                        </div>
                        <div className="flex items-center gap-2"><span className={`text-lg font-bold ${g.points >= 5 ? 'text-green-600' : g.points >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>{g.points}/{g.maxPoints}</span><span className={`px-2 py-0.5 rounded text-xs font-semibold ${g.points >= 5 ? 'bg-green-100 text-green-700' : g.points >= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{g.compatibility}</span>{g.hasDosha && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Gana Dosha</span>}</div>
                      </div>
                    );
                  })()}

                  {/* Nadi Analysis */}
                  <div className="p-4 bg-teal-50 dark:bg-teal-900/10 rounded-lg border border-teal-100 dark:border-teal-800/30">
                    <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Nadi (Constitution) Analysis</h5>
                    <div className="grid md:grid-cols-2 gap-3 mb-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400"><strong>{partnerAName}:</strong> {nkA.nadi}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400"><strong>{partnerBName}:</strong> {nkB.nadi}</p>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{nkA.nadi === nkB.nadi ? `Same Nadi (${nkA.nadi}) — same constitution can indicate health compatibility challenges. Nadi Dosha present.` : `Different Nadi (${nkA.nadi} vs ${nkB.nadi}) — complementary constitutions create healthy balance. Full 8/8 Nadi points.`}</p>
                  </div>

                  {/* Yoni Matrix */}
                  {(() => {
                    const ym = getYoniMatrixScore(nakshatraA, nakshatraB); return ym && (
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800/30">
                        <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Yoni Matrix Score</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{ym.animalA} + {ym.animalB}</p>
                        <div className="flex items-center gap-2"><span className={`text-lg font-bold ${ym.score >= 3 ? 'text-green-600' : ym.score >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>{ym.score}/{ym.maxScore}</span><span className={`px-2 py-0.5 rounded text-xs font-semibold ${ym.score >= 3 ? 'bg-green-100 text-green-700' : ym.score >= 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{ym.interpretation}</span></div>
                      </div>
                    );
                  })()}

                  {/* Element Compatibility */}
                  {yoniAFull && yoniBFull && (() => {
                    const ec = getElementCompat(yoniAFull.element, yoniBFull.element); return ec && (
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-800/30">
                        <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Element Compatibility ({yoniAFull.element} + {yoniBFull.element})</h5>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{ec}</p>
                      </div>
                    );
                  })()}

                  {/* Lord Friendship */}
                  {(() => {
                    const lf = getPlanetRelationship(nkA.lord, nkB.lord); return (
                      <div className="p-4 bg-cyan-50 dark:bg-cyan-900/10 rounded-lg border border-cyan-100 dark:border-cyan-800/30">
                        <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Nakshatra Lord Relationship ({nkA.lord} + {nkB.lord})</h5>
                        <div className="flex items-center gap-2 mb-2"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${lf.relation.includes('Friend') ? 'bg-green-100 text-green-700' : lf.relation.includes('Enemy') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{lf.relation}</span></div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{lf.description}</p>
                      </div>
                    );
                  })()}

                  {/* Deity Blessings */}
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800/30">
                    <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Deity Blessings</h5>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div><p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{nkA.deity}:</p><p className="text-sm text-gray-600 dark:text-gray-400">{getDeityBlessing(nkA.deity)}</p></div>
                      <div><p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{nkB.deity}:</p><p className="text-sm text-gray-600 dark:text-gray-400">{getDeityBlessing(nkB.deity)}</p></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-400 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5" />Recommendations</h4>
            <div className="space-y-3">{recommendations.map((r, i) => (<div key={i} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"><span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span><p className="text-gray-700 dark:text-gray-300">{r}</p></div>))}</div>
          </div>
        )}

        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400"><strong className="text-gray-800 dark:text-gray-200">Note:</strong> Based on Vedic astrological principles (Kama Shastra, Yoni Kuta). Every relationship is unique — use as guidance, not destiny.</p>
        </div>
      </div>
    </div>
  );
};

export default SexualCompatibilityWidget;
