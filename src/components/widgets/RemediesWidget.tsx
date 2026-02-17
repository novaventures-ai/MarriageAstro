import React, { useState } from 'react';
import { Chart, Remedies } from '../../types';
import { ExtendedRemedies } from '../../types/extendedTypes';
import { Sparkles, Gem, Heart, CheckCircle, AlertCircle, Brain, ShieldCheck, RefreshCw, User } from 'lucide-react';
import { useGeminiInsight } from '../../hooks/useGeminiInsight';
import ReactMarkdown from 'react-markdown';

interface DoshasData {
  nadiDosha: boolean;
  bhakootDosha: boolean;
  ganaDosha: boolean;
}

interface RemediesWidgetProps {
  remedies: Remedies;
  extendedRemedies?: {
    partnerA: ExtendedRemedies;
    partnerB: ExtendedRemedies;
  };
  doshas: DoshasData;
  partnerAName?: string;
  partnerBName?: string;
  dashaInfo?: string;
}

export const RemediesWidget: React.FC<RemediesWidgetProps> = ({
  remedies,
  extendedRemedies,
  doshas,
  partnerAName = 'Partner A',
  partnerBName = 'Partner B',
  dashaInfo
}) => {
  const [activePartner, setActivePartner] = useState<'A' | 'B'>('A');
  const { lalKitab, gemstones, modernAdjustments } = remedies;
  const { loading, insight, error, triggerAnalysis } = useGeminiInsight();

  return (
    <div className="space-y-6">
      {/* AI Remedy Prioritization */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-32 h-32 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Vedic AI Remedy Prioritizer
              </h3>
              <p className="text-orange-100 text-sm mt-1">
                Confused by too many remedies? Let AI analyze your Dasha and pick the Top 3 most effective ones.
              </p>
            </div>
            <button
              onClick={() => triggerAnalysis('REMEDY_PRIORITY', {
                dasha: dashaInfo || 'General Analysis',
                remedies: { lalKitab, gemstones: gemstones.map(g => g.stone) },
                nameA: partnerAName,
                nameB: partnerBName
              })}
              disabled={loading}
              className="px-6 py-2 bg-white text-orange-600 rounded-full font-bold shadow-lg hover:bg-orange-50 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-orange-500" />}
              {insight ? 'Reprioritize' : 'Prioritize for Me'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0" />
              <p className="text-sm text-white">{error}</p>
            </div>
          )}

          {insight && (
            <div className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20 animate-in fade-in slide-in-from-top-2 backdrop-blur-sm">
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown>{insight}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dosha Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3 transition-colors">
          <AlertCircle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
          Dosha Summary & Remedies
        </h2>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <DoshaCard
            name="Nadi Dosha"
            present={doshas.nadiDosha}
            description="Health and genetic compatibility issue"
          />
          <DoshaCard
            name="Bhakoot Dosha"
            present={doshas.bhakootDosha}
            description="Emotional and financial flow issue"
          />
          <DoshaCard
            name="Gana Dosha"
            present={doshas.ganaDosha}
            description="Temperament mismatch"
          />
        </div>
      </div>

      {/* Lal Kitab & Planetary Remedies */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
            <Sparkles className="w-6 h-6 text-orange-500 dark:text-orange-400" />
            Planetary & Lal Kitab Remedies
          </h3>
          
          {/* Partner Toggle */}
          {extendedRemedies && (
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActivePartner('A')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activePartner === 'A'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <User className="w-4 h-4" />
                {partnerAName}
              </button>
              <button
                onClick={() => setActivePartner('B')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activePartner === 'B'
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <User className="w-4 h-4" />
                {partnerBName}
              </button>
            </div>
          )}
        </div>

        {extendedRemedies ? (
          <div className="space-y-6">
            {/* Active Partner Section */}
            <div className="space-y-4">
              <div className={`flex items-center gap-2 pb-2 border-b transition-colors ${
                activePartner === 'A' 
                  ? 'border-orange-100 dark:border-orange-800/30' 
                  : 'border-indigo-100 dark:border-indigo-800/30'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors ${
                  activePartner === 'A' ? 'bg-orange-600 dark:bg-orange-500' : 'bg-indigo-600 dark:bg-indigo-500'
                }`}>
                  {activePartner}
                </div>
                <h4 className="font-bold text-gray-800 dark:text-gray-100 transition-colors">
                  {activePartner === 'A' ? partnerAName : partnerBName}&apos;s Remedial Plan
                </h4>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Planet Specific */}
                {(activePartner === 'A' ? extendedRemedies.partnerA.planetSpecific : extendedRemedies.partnerB.planetSpecific).length > 0 && (
                  <div className="space-y-3">
                    <h5 className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                      activePartner === 'A' ? 'text-orange-700 dark:text-orange-300' : 'text-blue-700 dark:text-blue-300'
                    }`}>Planetary Adjustments</h5>
                    {(activePartner === 'A' ? extendedRemedies.partnerA.planetSpecific : extendedRemedies.partnerB.planetSpecific).map((item, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border shadow-sm transition-colors ${
                        activePartner === 'A' 
                          ? 'bg-orange-50/50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800/30'
                          : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30'
                      }`}>
                        <p className={`text-xs font-bold mb-1 transition-colors ${
                          activePartner === 'A' ? 'text-orange-800 dark:text-orange-200' : 'text-blue-800 dark:text-blue-200'
                        }`}>{item.affliction}</p>
                        <ul className="space-y-1">
                          {item.remedies.map((r, i) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                        <p className={`mt-2 text-xs italic transition-colors ${
                          activePartner === 'A' ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'
                        }`}>Mantra: {item.mantra}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Affliction Based */}
                {(activePartner === 'A' ? extendedRemedies.partnerA.afflictionBased : extendedRemedies.partnerB.afflictionBased).length > 0 && (
                  <div className="space-y-3">
                    <h5 className="text-sm font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider transition-colors">Specific Conditions</h5>
                    {(activePartner === 'A' ? extendedRemedies.partnerA.afflictionBased : extendedRemedies.partnerB.afflictionBased).map((item, idx) => (
                      <div key={idx} className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30 shadow-sm transition-colors">
                        <p className="text-xs font-bold text-indigo-800 dark:text-indigo-200 mb-1 transition-colors">{item.condition}</p>
                        <ul className="space-y-1">
                          {item.remedies.map((r, i) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Fallback to simple remedies */}
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3 transition-colors">General Remedies</h4>
              <ul className="space-y-2">
                {lalKitab.general.map((remedy: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 transition-colors">
                    <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{remedy}</span>
                  </li>
                ))}
              </ul>
            </div>

            {lalKitab.specific.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3 transition-colors">Specific Remedies</h4>
                <ul className="space-y-2">
                  {lalKitab.specific.map((remedy: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 transition-colors">
                      <CheckCircle className="w-5 h-5 text-orange-500 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                      <span>{remedy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Issue Specific & Psychological Remedies */}
      {extendedRemedies && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Issue Specific */}
          {(extendedRemedies.partnerA.issueSpecific?.length || 0) > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors border-l-4 border-rose-500">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3 transition-colors">
                <ShieldCheck className="w-6 h-6 text-rose-500" />
                Relationship Preservation
              </h3>
              <div className="space-y-6">
                {extendedRemedies.partnerA.issueSpecific?.map((issue, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="p-3 bg-rose-50 dark:bg-rose-900/10 rounded-lg">
                      <p className="text-xs font-bold text-rose-800 dark:text-rose-200 uppercase tracking-widest mb-1">Target Area: {issue.category}</p>
                      <ul className="space-y-2">
                        {issue.remedies.map((r, i) => (
                          <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                            <span className="text-rose-500 font-bold">•</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 bg-teal-50 dark:bg-teal-900/10 rounded-lg border-l-2 border-teal-400">
                      <p className="text-xs font-bold text-teal-800 dark:text-teal-200 uppercase tracking-widest mb-1">Modern Lifestyle Advice</p>
                      <ul className="space-y-1">
                        {issue.modernAdvice.map((a, i) => (
                          <li key={i} className="text-xs text-gray-600 dark:text-gray-400 italic">
                            &quot;{a}&quot;
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Psychological Remedies */}
          {(extendedRemedies.partnerA.psychologicalRemedies?.length || 0) > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors border-l-4 border-indigo-500">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3 transition-colors">
                <Brain className="w-6 h-6 text-indigo-500" />
                Psychological Guidance
              </h3>
              <div className="space-y-4">
                {extendedRemedies.partnerA.psychologicalRemedies?.map((remedy, idx) => (
                  <div key={idx} className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <h4 className="text-sm font-bold text-indigo-800 dark:text-indigo-200 mb-2">{remedy.trait}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                      <strong>Behavioral Shift:</strong> {remedy.behavioralChange}
                    </p>
                    {remedy.mantra && (
                      <div className="pt-2 border-t border-indigo-100 dark:border-indigo-800/20 text-center">
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium italic">Affirmation: {remedy.mantra}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gemstone Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3 transition-colors">
          <Gem className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Gemstone Recommendations
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {gemstones.map((gem: { stone: string; metal: string; finger: string; mantra: string }, index: number) => (
            <div key={index} className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <Gem className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors">{gem.stone}</h4>
              </div>

              <div className="space-y-2 text-gray-700 dark:text-gray-300 transition-colors">
                <p><span className="font-medium text-gray-800 dark:text-gray-200">Metal:</span> {gem.metal}</p>
                <p><span className="font-medium text-gray-800 dark:text-gray-200">Finger:</span> {gem.finger}</p>
                <p><span className="font-medium text-gray-800 dark:text-gray-200">Mantra:</span> <span className="italic text-indigo-600 dark:text-indigo-400">{gem.mantra}</span></p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg transition-colors">
          <p className="text-sm text-blue-700 dark:text-blue-300 transition-colors">
            <strong>Note:</strong> Consult a qualified astrologer before wearing gemstones.
            The recommendation is based on your chart analysis.
          </p>
        </div>
      </div>

      {/* Modern Adjustments */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3 transition-colors">
          <Heart className="w-6 h-6 text-pink-500 dark:text-pink-400" />
          Modern Relationship Advice
        </h3>

        <div className="space-y-3">
          {modernAdjustments.map((adjustment: string, index: number) => (
            <div
              key={index}
              className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-100 dark:border-pink-800/30 flex items-start gap-3 transition-colors"
            >
              <span className="text-pink-500 dark:text-pink-400 text-xl">💝</span>
              <span className="text-gray-700 dark:text-gray-300 transition-colors">{adjustment}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Recommendations */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Additional Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">For Marriage Harmony:</h4>
            <ul className="space-y-1 text-white/90">
              <li>• Perform Ganesh Puja before important decisions</li>
              <li>• Keep fast on Mondays for Moon strength</li>
              <li>• Donate white items on Fridays</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">For Relationship Strength:</h4>
            <ul className="space-y-1 text-white/90">
              <li>• Practice gratitude daily</li>
              <li>• Meditate together regularly</li>
              <li>• Celebrate small victories</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const DoshaCard: React.FC<{
  name: string;
  present: boolean;
  description: string;
}> = ({ name, present, description }) => (
  <div className={`p - 4 rounded - xl border transition - colors ${present
    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30'
    : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30'
    } `}>
    <div className="flex items-center justify-between mb-2">
      <span className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">{name}</span>
      {present ? (
        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs rounded-full transition-colors">Present</span>
      ) : (
        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs rounded-full transition-colors">Not Present</span>
      )}
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{description}</p>
  </div>
);

export default RemediesWidget;