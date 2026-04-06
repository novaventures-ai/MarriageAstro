import React, { useState } from 'react';
import { SynastryAspect, ModernPlanetAnalysis, ModernChallenges, Chart, HouseOverlay, PlanetaryConjunction, KPCompatibility, JaiminiCompatibility } from '../../types';
import { Star, Zap, Heart, AlertTriangle, Briefcase, Wifi, Info, BookOpen, Layers, GitMerge, HelpCircle, Brain, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { useGeminiInsight } from '../../hooks/useGeminiInsight';
import ReactMarkdown from 'react-markdown';
import { JargonTooltip, JargonTerm } from '../ui/JargonTooltip';

interface SynastryData {
  soulmateConnections: SynastryAspect[];
  karmicBonds: SynastryAspect[];
  sexualChemistry: SynastryAspect[];
  houseOverlays: HouseOverlay[];
  planetaryConjunctions: PlanetaryConjunction[];
  d9Overlays?: HouseOverlay[];
  kpCompatibility?: KPCompatibility;
  jaiminiCompatibility?: JaiminiCompatibility;
}

interface SynastryWidgetProps {
  synastry: SynastryData;
  chartAName?: string;
  chartBName?: string;
}

export const SynastryWidget: React.FC<SynastryWidgetProps> = ({
  synastry,
  chartAName = 'Partner A',
  chartBName = 'Partner B'
}) => {
  const {
    soulmateConnections,
    karmicBonds,
    sexualChemistry,
    houseOverlays = [],
    planetaryConjunctions = [],
    d9Overlays = [],
    kpCompatibility,
    jaiminiCompatibility
  } = synastry;

  const [activeTab, setActiveTab] = useState<'vedic' | 'navamsa' | 'advanced'>('vedic');
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [activeOverlayDir, setActiveOverlayDir] = useState<'A_in_B' | 'B_in_A'>('A_in_B');
  const { loading, insight, error, triggerAnalysis } = useGeminiInsight();

  const replaceNames = (text: string) => {
    if (!text) return text;
    return text.replace(/Partner A/g, chartAName).replace(/Partner B/g, chartBName);
  };

  const getAspectIcon = (nature: string) => {
    switch (nature) {
      case 'harmonious': return <Star className="w-5 h-5 text-yellow-500" />;
      case 'challenging': return <Zap className="w-5 h-5 text-amber-500" />;
      default: return <Heart className="w-5 h-5 text-pink-500" />;
    }
  };

  const HelpBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-colors">
      <div className="flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-1 transition-colors">{title}</h5>
          <div className="text-sm text-blue-700 dark:text-blue-300 transition-colors">{children}</div>
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
            <Star className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Synastry Analysis <JargonTooltip term="Synastry Analysis" className="ml-1" /></h2>
            <p className="text-indigo-100 leading-relaxed">
              Synastry compares {chartAName} and {chartBName}'s birth charts to reveal relationship dynamics.
              We analyze connection at three levels: <strong>Vedic (D1)</strong> for compatibility,
              <strong> Navamsa (D9)</strong> for marital destiny, and <strong>Advanced (KP/Jaimini)</strong> for soul contracts.
            </p>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('vedic')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'vedic'
            ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
        >
          <Star className="w-4 h-4" />
          Vedic (D1)
        </button>
        <button
          onClick={() => setActiveTab('navamsa')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'navamsa'
            ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
        >
          <Layers className="w-4 h-4" />
          Navamsa (D9)
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'advanced'
            ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
        >
          <GitMerge className="w-4 h-4" />
          Advanced (KP/Jaimini)
        </button>
      </div>

      <div className="mt-6">
        {/* ==================== VEDIC TAB ==================== */}
        {activeTab === 'vedic' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Soulmate Connections */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Soulmate Connections
                </h3>
                <button
                  onClick={() => setShowHelp(showHelp === 'soulmate' ? null : 'soulmate')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {showHelp === 'soulmate' && (
                <HelpBox title="What are Soulmate Connections?">
                  Harmonious aspects (trine, sextile, conjunction) that indicate natural ease and flow.
                </HelpBox>
              )}

              {/* AI Synastry Analysis */}
              <div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-32 h-32 text-white" />
                </div>

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-lg font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        AI Soul Purpose Decoder
                      </h4>
                      <p className="text-white/80 text-sm mt-1">
                        Reveal the deeper karmic reasons why you two met.
                      </p>
                    </div>
                    <button
                      onClick={() => triggerAnalysis('SYNASTRY_DEEP_DIVE', {
                        aspects: [...soulmateConnections, ...karmicBonds].map(a => `${a.planet1} ${a.aspectType} ${a.planet2}: ${a.interpretation}`),
                        dominantElement: 'Mixed'
                      })}
                      disabled={loading}
                      className="px-5 py-2 bg-white text-indigo-600 rounded-lg font-bold shadow-md hover:bg-indigo-50 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                    >
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {insight ? 'Reveal More' : 'Analyze Connection'}
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

              {soulmateConnections.length > 0 ? (
                <div className="space-y-3">
                  {soulmateConnections.map((aspect, index) => (
                    <div key={index} className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-800/30 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        {getAspectIcon(aspect.nature)}
                        <span className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">
                          {replaceNames(aspect.planet1)} {aspect.aspectType} {replaceNames(aspect.planet2)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 transition-colors">{replaceNames(aspect.interpretation)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No major soulmate connections found.</p>
              )}
            </div>

            {/* Karmic Bonds */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
                  <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  Karmic Bonds
                </h3>
              </div>
              {karmicBonds.length > 0 ? (
                <div className="space-y-3">
                  {karmicBonds.map((aspect, index) => (
                    <div key={index} className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800/30 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        {getAspectIcon(aspect.nature)}
                        <span className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">
                          {replaceNames(aspect.planet1)} {aspect.aspectType} {replaceNames(aspect.planet2)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 transition-colors">{replaceNames(aspect.interpretation)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No heavy karmic bonds detected.</p>
              )}
            </div>

            {/* House Overlays */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
                  <Briefcase className="w-6 h-6 text-indigo-500" />
                  House Overlays (Life Impact)
                </h3>

                {/* Direction Toggle */}
                {houseOverlays.some(o => o.direction) && (
                  <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl w-fit self-end sm:self-auto">
                    <button
                      onClick={() => setActiveOverlayDir('A_in_B')}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeOverlayDir === 'A_in_B'
                        ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-300 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                        }`}
                    >
                      {chartAName} → {chartBName}
                    </button>
                    <button
                      onClick={() => setActiveOverlayDir('B_in_A')}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeOverlayDir === 'B_in_A'
                        ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-300 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                        }`}
                    >
                      {chartBName} → {chartAName}
                    </button>
                  </div>
                )}
              </div>

              {houseOverlays.length > 0 ? (
                <div className="space-y-4">
                  {houseOverlays.filter(o => o.direction === activeOverlayDir || !o.direction).length > 0 ? (
                    houseOverlays
                      .filter(o => !o.direction || o.direction === activeOverlayDir)
                      .map((overlay, index) => (
                        <div key={index} className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-800/30 transition-colors">
                          <p className="font-semibold text-gray-800 dark:text-gray-100">{replaceNames(overlay.description.split(':')[0])}</p>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">{replaceNames(overlay.description.split(':').slice(1).join(':'))}</p>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500 italic text-center py-4">No significant overlays found for this direction.</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">No significant house overlays.</p>
              )}
            </div>
          </div>
        )}

        {/* ==================== NAVAMSA TAB ==================== */}
        {activeTab === 'navamsa' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-lg p-4 flex-grow transition-colors">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">
                      About <JargonTerm term="Navamsa">Navamsa</JargonTerm> Synastry
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      The D9 Navamsa chart rules marriage and long-term destiny. Interactions here show if you can
                      sustain a life together after the initial spark fades.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direction Toggle */}
              {d9Overlays.some(o => o.direction) && (
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl w-fit self-end sm:self-auto h-fit">
                  <button
                    onClick={() => setActiveOverlayDir('A_in_B')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeOverlayDir === 'A_in_B'
                      ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-300 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                      }`}
                  >
                    {chartAName} → {chartBName}
                  </button>
                  <button
                    onClick={() => setActiveOverlayDir('B_in_A')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeOverlayDir === 'B_in_A'
                      ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-300 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                      }`}
                  >
                    {chartBName} → {chartAName}
                  </button>
                </div>
              )}
            </div>

            {d9Overlays.length > 0 ? (
              <div className="space-y-3">
                {d9Overlays.filter(o => o.direction === activeOverlayDir || !o.direction).length > 0 ? (
                  d9Overlays
                    .filter(o => !o.direction || o.direction === activeOverlayDir)
                    .map((overlay, index) => (
                      <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-800/30 shadow-sm transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Layers className="w-5 h-5 text-purple-500" />
                          <span className="font-semibold text-gray-800 dark:text-gray-100">
                            {overlay.planet} activates Navamsa House {overlay.house}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{replaceNames(overlay.description)}</p>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 italic text-center py-8">No significant D9 overlays found for this direction.</p>
                )}
              </div>
            ) : (
              <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No critical D1-to-D9 overlays found. This suggests a neutral impact on the marital destiny chart.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ==================== ADVANCED TAB ==================== */}
        {activeTab === 'advanced' && (
          <div className="space-y-6 animate-fadeIn">
            {/* KP Astrology Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-3 transition-colors">
                <GitMerge className="w-6 h-6 text-emerald-500" />
                <JargonTerm term="KP">KP</JargonTerm> System Compatibility
              </h3>

              {kpCompatibility ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${kpCompatibility.cslConnection.hasConnection ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-gray-50 border-gray-200 dark:bg-gray-700/30 dark:border-gray-600'}`}>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">7th Cusp Sub-Lord Connection</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {kpCompatibility.cslConnection.hasConnection
                        ? replaceNames(kpCompatibility.cslConnection.description)
                        : "No direct Sub-Lord connection found between marriage cusps (Neutral)."}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Marriage Contract Alignment (KP)</h4>
                    <p className="text-gray-700 dark:text-gray-300">{replaceNames(kpCompatibility.rulingPlanetConnection.description)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">KP data not available.</p>
              )}
            </div>

            {/* Jaimini Sutras Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-3 transition-colors">
                <Star className="w-6 h-6 text-indigo-500" />
                <JargonTerm term="Jaimini">Jaimini</JargonTerm> Soul Compatibility
              </h3>

              {jaiminiCompatibility ? (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                    <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">Soul Purpose Alignment (Darakaraka)</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {replaceNames(jaiminiCompatibility.darakarakaContact.description)}
                    </p>
                  </div>

                  {jaiminiCompatibility.soulLink.hasLink && (
                    <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800/50">
                      <h4 className="font-semibold text-pink-900 dark:text-pink-200 mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4 fill-current" />
                        Soul Link Detected
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">{replaceNames(jaiminiCompatibility.soulLink.description)}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">Jaimini data not available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

import { ModernInsightsEnhanced } from '../../../lib/modernInsightsCalculations';

interface ModernInsightsWidgetProps {
  modernPlanets: ModernPlanetAnalysis;
  modernChallenges: ModernChallenges;
  chartA?: Chart;
  chartB?: Chart;
  enhancedInsights?: ModernInsightsEnhanced;
}

export const ModernInsightsWidget: React.FC<ModernInsightsWidgetProps> = ({
  modernPlanets,
  modernChallenges,
  chartA,
  chartB,
  enhancedInsights
}) => {
  const { uranus, neptune, pluto } = modernPlanets;
  const partnerAName = chartA?.name || 'Partner A';
  const partnerBName = chartB?.name || 'Partner B';

  // Get individual planet positions from charts
  const getPlanetInfo = (planetName: string, chart?: Chart) => {
    if (!chart?.planetaryPositions) return null;
    return chart.planetaryPositions.find((p: { planet: string }) => p.planet === planetName);
  };

  // Interpretations for Uranus in different houses (individual impact)
  const getUranusInterpretation = (house: number): string => {
    const interpretations: Record<number, string> = {
      1: "You're naturally unconventional and crave independence. In relationships, you need a partner who respects your freedom and doesn't try to confine you. You're drawn to unique individuals and may have sudden insights about your identity.",
      2: "Your values around money and possessions are unconventional. You may experience sudden financial changes and prefer non-traditional approaches to shared resources in relationships.",
      3: "Your communication style is innovative and unpredictable. You're drawn to intellectual stimulation and need a partner who can engage with your unconventional ideas and sudden insights.",
      4: "Your home life needs to be unconventional or you feel restless. You may have an unusual family background or desire a non-traditional living arrangement with your partner.",
      5: "You express creativity and romance in unique ways. Sudden attractions and unconventional approaches to dating appeal to you. Children or creative projects may come unexpectedly.",
      6: "You thrive in unconventional work environments and prefer alternative health approaches. Daily routines need variety or you become restless. Service to others takes unusual forms.",
      7: "You seek unconventional partnerships and may be attracted to eccentric or freedom-loving partners. Traditional marriage may feel restrictive. You need intellectual equality in relationships.",
      8: "Transformation comes through sudden insights and breakthroughs. You approach intimacy and shared resources unconventionally. May have unusual experiences with inheritance or taxes.",
      9: "Your beliefs and philosophy are progressive and unconventional. You're drawn to alternative spiritual paths and may suddenly change your worldview. Higher education takes unique forms.",
      10: "Your career path is unconventional and may involve sudden changes. You seek recognition for your unique contributions. Authority figures may be unconventional or you challenge traditional hierarchies.",
      11: "Your friendships and social circles are diverse and unconventional. You're drawn to humanitarian causes and groups that value individuality. Future hopes are progressive and unique.",
      12: "You have sudden spiritual insights and unconscious drives toward freedom. Hidden aspects of your psyche seek expression through unconventional means. May have intuitive or psychic flashes."
    };
    return interpretations[house] || "You express this planet's energy in unique and unexpected ways. Look for areas of life where you naturally break from tradition.";
  };

  // Interpretations for Neptune in different houses (individual impact)
  const getNeptuneInterpretation = (house: number): string => {
    const interpretations: Record<number, string> = {
      1: "You're sensitive, intuitive, and may have a dreamy or elusive personality. Others may project their ideals onto you. You need partners who honor your sensitivity and spiritual nature.",
      2: "Your values around money are idealistic. You may struggle with practical financial matters or see money as spiritual energy. Be cautious about financial illusions or scams.",
      3: "Your communication is imaginative and poetic. You may have difficulty with clear boundaries in conversations. Siblings or early education had spiritual or confusing elements.",
      4: "Your home is a sanctuary and you need a peaceful domestic environment. Family relationships may be idealized or involve sacrifice. Connection to ancestry is spiritual.",
      5: "Your creativity flows from imagination and spiritual sources. Romance is idealized and you may experience unconditional love or disappointment from unrealistic expectations. Children are highly spiritual beings to you.",
      6: "You prefer holistic or spiritual approaches to health. Daily work should have meaning or you feel lost. You may sacrifice yourself in service to others. Pets and small animals are spiritually significant.",
      7: "You idealize partnerships and may see partners through rose-colored glasses. Boundaries in relationships can be unclear. You're drawn to spiritual or artistic partners. Marriage involves sacrifice or spiritual union.",
      8: "Intimacy is deeply spiritual and transformative for you. You may experience mystical experiences through deep bonding. Shared resources require clarity to avoid confusion or deception.",
      9: "Your beliefs are deeply spiritual and you may be drawn to mystical traditions. Higher education and travel have spiritual significance. You seek universal truths beyond conventional religion.",
      10: "Your career calling is spiritual or artistic. You may be confused about your public path or idealize your professional image. Authority figures may be spiritual guides or deceptive.",
      11: "Your friendships are based on spiritual connection and shared ideals. You're drawn to humanitarian causes and may sacrifice for collective goals. Future hopes are idealistic and vision-driven.",
      12: "You have natural access to the subconscious and spiritual realms. Dreams are vivid and meaningful. You need solitude and spiritual practice. Unconscious patterns around sacrifice and transcendence."
    };
    return interpretations[house] || "You experience this area of life through intuition, imagination, and spiritual sensitivity. Maintain clarity to avoid confusion.";
  };

  // Interpretations for Pluto in different houses (individual impact)
  const getPlutoInterpretation = (house: number): string => {
    const interpretations: Record<number, string> = {
      1: "You're intense, magnetic, and may go through profound personal transformations. Others are drawn to your power but may also feel intimidated. You need partners who can handle your depth.",
      2: "Your relationship with money and possessions is transformative. You may experience financial crises that lead to rebirth. Values around worth and security undergo deep changes throughout life.",
      3: "Your mind is penetrating and you see beneath surface communications. Relationships with siblings may involve power dynamics. You prefer deep, meaningful conversations over small talk.",
      4: "Your home life and family relationships are intense and transformative. You may experience power struggles in your family of origin. Creating a secure foundation requires facing deep emotional truths.",
      5: "Your creative expression is intense and transformative. Romance involves deep passion and possible power dynamics. Relationships with children are profound and may involve healing ancestral patterns.",
      6: "Your approach to health is holistic and transformative. Daily work involves dealing with crises or deep investigations. You may be drawn to healing professions or psychology.",
      7: "Your partnerships are intense and transformative. Power dynamics require conscious navigation. You attract partners who mirror your shadow side, offering opportunities for deep growth through relationship.",
      8: "You naturally navigate the mysteries of life, death, and transformation. Intimacy is deeply bonding. Shared resources and inheritance may involve power struggles but also deep healing potential.",
      9: "Your beliefs undergo radical transformations. You question and investigate philosophical and religious systems deeply. Travel and higher education are transformative experiences.",
      10: "Your career involves power, transformation, or dealing with crisis. You're drawn to positions of authority or fields like psychology, investigation, or healing. Public image undergoes major transformations.",
      11: "Your friendships and social causes are intense and transformative. You may experience power struggles within groups or be drawn to transforming collective structures. Future hopes involve deep societal change.",
      12: "You have access to deep subconscious material and may experience psychological regeneration. Hidden enemies may be powerful but you have innate ability to transform shadow material. Spiritual power is subtle but profound."
    };
    return interpretations[house] || "This area of life involves deep transformation, power, and regeneration. Embrace the intensity for profound growth.";
  };

  // Get interpretation for a planet in a specific house
  const getPlanetInHouseInterpretation = (planet: string, house: number): string => {
    switch (planet) {
      case 'Uranus': return getUranusInterpretation(house);
      case 'Neptune': return getNeptuneInterpretation(house);
      case 'Pluto': return getPlutoInterpretation(house);
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Educational Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Star className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Modern Planets & Contemporary Challenges</h2>
            <p className="text-blue-100 leading-relaxed">
              Traditional Vedic astrology uses Sun through Saturn, but modern life requires understanding
              <strong> Uranus</strong> (innovation/freedom), <strong>Neptune</strong> (spirituality/illusion),
              and <strong>Pluto</strong> (transformation/power). These outer planets move slowly through houses,
              affecting entire generations but specifically impacting your relationship through their house positions.
            </p>
          </div>
        </div>
      </div>

      {/* Modern Planets Analysis - Note about combined data */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 mb-6 transition-colors">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-amber-800 dark:text-amber-200 font-semibold mb-1 transition-colors">About Modern Planets (Uranus, Neptune, Pluto)</p>
            <p className="text-sm text-amber-700 dark:text-amber-300 transition-colors">
              These are <strong>generational planets</strong> that move slowly through the zodiac (7-20+ years per sign),
              affecting entire generations. Below you can see where each planet is positioned in both partners' charts
              (D1 - Main Chart and D9 - Marriage Chart) and how their combined energies create your unique relationship dynamic.
            </p>
          </div>
        </div>
      </div>

      {/* Individual Partner Positions */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Partner A */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold transition-colors">
              {partnerAName.charAt(0)}
            </div>
            <h4 className="font-bold text-gray-800 dark:text-gray-100 transition-colors">{partnerAName}&apos;s Chart Positions</h4>
          </div>

          <div className="space-y-4">
            {['Uranus', 'Neptune', 'Pluto'].map((planet) => {
              const planetInfo = getPlanetInfo(planet, chartA);
              const d9Info = chartA?.vargaCharts?.D9?.planetaryPositions?.find((p: { planet: string }) => p.planet === planet);

              if (!planetInfo) return null;

              const d1Interpretation = getPlanetInHouseInterpretation(planet, planetInfo.house);
              const d9Interpretation = d9Info ? getPlanetInHouseInterpretation(planet, d9Info.house) : null;

              return (
                <div key={planet} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-800/50 shadow-sm transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${planet === 'Uranus' ? 'bg-cyan-400' :
                      planet === 'Neptune' ? 'bg-purple-400' : 'bg-red-400'
                      }`} />
                    <p className="font-semibold text-blue-800 dark:text-blue-300 transition-colors">{planet}</p>
                  </div>

                  {/* D1 Position */}
                  <div className="mb-3">
                    <div className="text-sm bg-blue-50 dark:bg-blue-900/40 p-2 rounded-lg mb-2 transition-colors">
                      <p className="text-gray-800 dark:text-gray-200"><strong>D1 (Main Chart):</strong> House {planetInfo.house}, {planetInfo.sign} ({planetInfo.signDegree.toFixed(1)}°)</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Nakshatra: {planetInfo.nakshatra} (Pada {planetInfo.nakshatraPada})</p>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border-l-4 border-blue-400 transition-colors">
                      <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">How this affects {partnerAName}:</p>
                      <p>{d1Interpretation}</p>
                    </div>
                  </div>

                  {/* D9 Position */}
                  {d9Info && (
                    <div>
                      <div className="text-sm bg-blue-50 dark:bg-blue-900/40 p-2 rounded-lg mb-2 transition-colors">
                        <p className="text-gray-800 dark:text-gray-200"><strong>D9 (Marriage Chart):</strong> House {d9Info.house}, {d9Info.sign}</p>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border-l-4 border-purple-400 transition-colors">
                        <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">Marriage/Long-term impact:</p>
                        <p>{d9Interpretation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Partner B */}
        <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-5 border border-pink-200 dark:border-pink-800/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold transition-colors">
              {partnerBName.charAt(0)}
            </div>
            <h4 className="font-bold text-gray-800 dark:text-gray-100 transition-colors">{partnerBName}&apos;s Chart Positions</h4>
          </div>

          <div className="space-y-4">
            {['Uranus', 'Neptune', 'Pluto'].map((planet) => {
              const planetInfo = getPlanetInfo(planet, chartB);
              const d9Info = chartB?.vargaCharts?.D9?.planetaryPositions?.find((p: { planet: string }) => p.planet === planet);

              if (!planetInfo) return null;

              const d1Interpretation = getPlanetInHouseInterpretation(planet, planetInfo.house);
              const d9Interpretation = d9Info ? getPlanetInHouseInterpretation(planet, d9Info.house) : null;

              return (
                <div key={planet} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-pink-100 dark:border-pink-800/50 shadow-sm transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${planet === 'Uranus' ? 'bg-cyan-400' :
                      planet === 'Neptune' ? 'bg-purple-400' : 'bg-red-400'
                      }`} />
                    <p className="font-semibold text-pink-800 dark:text-pink-300 transition-colors">{planet}</p>
                  </div>

                  {/* D1 Position */}
                  <div className="mb-3">
                    <div className="text-sm bg-pink-50 dark:bg-pink-900/40 p-2 rounded-lg mb-2 transition-colors">
                      <p className="text-gray-800 dark:text-gray-200"><strong>D1 (Main Chart):</strong> House {planetInfo.house}, {planetInfo.sign} ({planetInfo.signDegree.toFixed(1)}°)</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Nakshatra: {planetInfo.nakshatra} (Pada {planetInfo.nakshatraPada})</p>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border-l-4 border-pink-400 transition-colors">
                      <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">How this affects {partnerBName}:</p>
                      <p>{d1Interpretation}</p>
                    </div>
                  </div>

                  {/* D9 Position */}
                  {d9Info && (
                    <div>
                      <div className="text-sm bg-pink-50 dark:bg-pink-900/40 p-2 rounded-lg mb-2 transition-colors">
                        <p className="text-gray-800 dark:text-gray-200"><strong>D9 (Marriage Chart):</strong> House {d9Info.house}, {d9Info.sign}</p>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border-l-4 border-purple-400 transition-colors">
                        <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">Marriage/Long-term impact:</p>
                        <p>{d9Interpretation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Combined Relationship Impact */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3 transition-colors">
          <Star className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Combined Relationship Impact
        </h3>

        <div className="space-y-6">
          {/* Uranus */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg transition-colors">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2 transition-colors">
              <Zap className="w-4 h-4" />
              Uranus - Freedom & Innovation
            </h4>
            <div className="p-3 bg-white dark:bg-gray-900/50 rounded-lg border border-blue-200 dark:border-blue-800/50 mb-3 transition-colors">
              <p className="text-gray-700 dark:text-gray-300 transition-colors">{uranus.interpretation}</p>
            </div>
            <div className="p-3 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg transition-colors">
              <p className="text-sm text-blue-900 dark:text-blue-200 transition-colors">
                <strong>How This Shapes Your Relationship:</strong> Uranus brings the need for freedom,
                authenticity, and breaking from tradition. You both challenge conventional relationship
                norms and create your own unique path. Expect sudden insights and unconventional approaches
                to partnership.
              </p>
            </div>
            {uranus.challenges.length > 0 && (
              <div className="mt-3">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Key Challenges to Navigate:</span>
                <ul className="mt-1 space-y-1">
                  {uranus.challenges.map((challenge, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 transition-colors">
                      <AlertTriangle className="w-3 h-3 text-blue-500" />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Neptune */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg transition-colors">
            <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2 transition-colors">
              <Star className="w-4 h-4" />
              Neptune - Spirituality & Dreams
            </h4>
            <div className="p-3 bg-white dark:bg-gray-900/50 rounded-lg border border-purple-200 dark:border-purple-800/50 mb-3 transition-colors">
              <p className="text-gray-700 dark:text-gray-300 transition-colors">{neptune.interpretation}</p>
            </div>
            <div className="p-3 bg-purple-100/50 dark:bg-purple-900/30 rounded-lg transition-colors">
              <p className="text-sm text-purple-900 dark:text-purple-200 transition-colors">
                <strong>How This Shapes Your Relationship:</strong> Neptune dissolves boundaries between
                you, creating deep spiritual and emotional connection. You may idealize each other or share
                creative/spiritual pursuits. The challenge is maintaining clarity while enjoying the magical
                bond you share.
              </p>
            </div>
            {neptune.challenges.length > 0 && (
              <div className="mt-3">
                <span className="text-sm font-medium text-purple-700 dark:text-purple-400">Watch Out For:</span>
                <ul className="mt-1 space-y-1">
                  {neptune.challenges.map((challenge, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 transition-colors">
                      <AlertTriangle className="w-3 h-3 text-purple-500" />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Pluto */}
          <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg transition-colors">
            <h4 className="font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2 transition-colors">
              <Zap className="w-4 h-4" />
              Pluto - Transformation & Power
            </h4>
            <div className="p-3 bg-white dark:bg-gray-900/50 rounded-lg border border-red-200 dark:border-red-800/50 mb-3 transition-colors">
              <p className="text-gray-700 dark:text-gray-300 transition-colors">{pluto.interpretation}</p>
            </div>
            <div className="p-3 bg-red-100/50 dark:bg-red-900/30 rounded-lg transition-colors">
              <p className="text-sm text-red-900 dark:text-red-200 transition-colors">
                <strong>How This Shapes Your Relationship:</strong> Pluto brings intensity and the power
                to transform. This relationship will change you both profoundly. You&apos;ll face deep fears and
                shadows together. Power dynamics must be handled with awareness. The intensity is the path
                to profound growth.
              </p>
            </div>
            {pluto.challenges.length > 0 && (
              <div className="mt-3">
                <span className="text-sm font-medium text-red-700 dark:text-red-400">Transformation Requires:</span>
                <ul className="mt-1 space-y-1">
                  {pluto.challenges.map((challenge, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 transition-colors">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Challenges */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 transition-colors">Modern Relationship Challenges</h3>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">
          Contemporary relationships face unique challenges that traditional astrology didn't address.
          These insights help you navigate modern life together.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Digital Age */}
          {modernChallenges.digitalAge.length > 0 ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Wifi className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">Digital Age Issues</h4>
              </div>
              <ul className="space-y-2">
                {modernChallenges.digitalAge.map((issue, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 transition-colors">
                    <span className="text-blue-500 mt-0.5">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-green-800 dark:text-green-200 transition-colors">Digital Balance</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Your charts don't show major digital age conflicts. Maintain healthy tech boundaries.</p>
            </div>
          )}

          {/* Career Stress */}
          {modernChallenges.careerStress.length > 0 ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">Career Stress</h4>
              </div>
              <ul className="space-y-2">
                {modernChallenges.careerStress.map((issue, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 transition-colors">
                    <span className="text-amber-500 mt-0.5">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-green-800 dark:text-green-200 transition-colors">Work-Life Balance</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Your career planets support a healthy work-life integration for both.</p>
            </div>
          )}

          {/* Mental Health */}
          {modernChallenges.mentalHealth.length > 0 ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">Mental Wellness</h4>
              </div>
              <ul className="space-y-2">
                {modernChallenges.mentalHealth.map((issue, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 transition-colors">
                    <span className="text-purple-500 mt-0.5">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-green-800 dark:text-green-200 transition-colors">Mental Harmony</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Planetary influences support mental resilience and mutual understanding.</p>
            </div>
          )}

          {/* Communication Issues */}
          {modernChallenges.communicationIssues.length > 0 ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">Communication Flow</h4>
              </div>
              <ul className="space-y-2">
                {modernChallenges.communicationIssues.map((issue, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2 transition-colors">
                    <span className="text-red-500 mt-0.5">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-green-800 dark:text-green-200 transition-colors">Clear Communication</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Mercury aspects suggest open and effective communication between you.</p>
            </div>
          )}
        </div>
      </div>

      {/* ==================== ENHANCED INSIGHTS ==================== */}
      {enhancedInsights && (
        <>
          {/* Cross-Chart Outer Planet Aspects */}
          {enhancedInsights.crossChartAspects.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 transition-colors">Cross-Chart Outer Planet Aspects</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors">
                How each partner's generational planets (Uranus, Neptune, Pluto) interact with the other's personal planets — these create deep, transformative dynamics.
              </p>
              <div className="space-y-3">
                {enhancedInsights.crossChartAspects.map((asp, i) => (
                  <div key={i} className={`p-4 rounded-lg border transition-colors ${asp.nature === 'harmonious' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30' :
                    asp.nature === 'challenging' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30' :
                      'bg-violet-50 dark:bg-violet-900/10 border-violet-200 dark:border-violet-800/30'
                    }`}>
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <span className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">
                        {asp.planet1} {asp.aspectType} {asp.planet2}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${asp.nature === 'harmonious' ? 'bg-green-500 text-white' :
                          asp.nature === 'challenging' ? 'bg-red-500 text-white' :
                            'bg-violet-500 text-white'
                          }`}>{asp.nature}</span>
                        <span className="text-xs text-gray-400">orb {asp.orb}°</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 transition-colors">{asp.interpretation}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {asp.keywords.map((kw, j) => (
                        <span key={j} className="px-2 py-0.5 bg-white/50 dark:bg-gray-700/50 text-xs text-gray-600 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-600 transition-colors">{kw}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachment Theory */}
          {enhancedInsights.attachmentPatterns.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 transition-colors">Attachment Theory Analysis</h3>
              </div>

              {/* Style Summary */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800/30 transition-colors">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1 transition-colors">{partnerAName}'s Style</p>
                  <p className={`text-lg font-bold transition-colors ${enhancedInsights.overallAttachmentStyle.partnerA.includes('Secure') ? 'text-green-600 dark:text-green-400' :
                    enhancedInsights.overallAttachmentStyle.partnerA.includes('Anxious') ? 'text-amber-600 dark:text-amber-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>{enhancedInsights.overallAttachmentStyle.partnerA}</p>
                </div>
                <div className="p-4 bg-pink-50 dark:bg-pink-900/10 rounded-lg border border-pink-200 dark:border-pink-800/30 transition-colors">
                  <p className="text-sm font-medium text-pink-800 dark:text-pink-200 mb-1 transition-colors">{partnerBName}'s Style</p>
                  <p className={`text-lg font-bold transition-colors ${enhancedInsights.overallAttachmentStyle.partnerB.includes('Secure') ? 'text-green-600 dark:text-green-400' :
                    enhancedInsights.overallAttachmentStyle.partnerB.includes('Anxious') ? 'text-amber-600 dark:text-amber-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>{enhancedInsights.overallAttachmentStyle.partnerB}</p>
                </div>
              </div>

              {/* Compatibility Note */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-200 dark:border-indigo-800/30 mb-6 transition-colors">
                <p className="text-sm text-indigo-800 dark:text-indigo-200 transition-colors">
                  <strong>Compatibility:</strong> {enhancedInsights.overallAttachmentStyle.compatibilityNote}
                </p>
              </div>

              {/* Pattern Cards */}
              <div className="space-y-3">
                {enhancedInsights.attachmentPatterns.map((pat, i) => (
                  <div key={i} className={`p-4 rounded-lg border transition-colors ${pat.style === 'secure' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30' :
                    pat.style === 'anxious' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30' :
                      pat.style === 'avoidant' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30' :
                        'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
                    }`}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">{pat.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${pat.strength === 'strong' ? 'bg-red-500 text-white' :
                        pat.strength === 'moderate' ? 'bg-amber-500 text-white' :
                          'bg-green-500 text-white'
                        }`}>{pat.strength}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 transition-colors">{pat.description}</p>
                    <div className="space-y-1">
                      {pat.indicators.map((ind, j) => (
                        <div key={j} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 transition-colors">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></span>
                          {ind}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shadow Dynamics */}
          {enhancedInsights.shadowDynamics.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 transition-colors">Psychological Shadow Dynamics</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors">
                Shadow dynamics reveal unconscious patterns that surface in intimate relationships. 12th/8th house placements and Pluto contacts activate deep psychological material.
              </p>
              <div className="space-y-4">
                {enhancedInsights.shadowDynamics.map((sd, i) => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">{sd.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${sd.intensity === 'high' ? 'bg-purple-600 text-white' :
                        sd.intensity === 'moderate' ? 'bg-purple-400 text-white' :
                          'bg-purple-300 text-purple-800'
                        }`}>{sd.intensity}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 transition-colors">{sd.description}</p>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border-l-4 border-emerald-400 transition-colors">
                      <p className="text-sm text-emerald-800 dark:text-emerald-200 transition-colors">
                        <strong>Growth Opportunity:</strong> {sd.growthOpportunity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div >
  );
};
