import React, { useState } from 'react';
import { KPAnalysis } from '../../types/extendedTypes';
import { Target, Star, Crosshair, Activity, Info, CheckCircle, XCircle, AlertTriangle, HelpCircle, BookOpen, ShieldAlert, Briefcase, Link2, Sparkles, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { useGeminiInsight } from '../../hooks/useGeminiInsight';
import ReactMarkdown from 'react-markdown';

interface KPAnalysisWidgetProps {
  partnerA: KPAnalysis;
  partnerB: KPAnalysis;
  nameA?: string;
  nameB?: string;
}

export const KPAnalysisWidget: React.FC<KPAnalysisWidgetProps> = ({
  partnerA,
  partnerB,
  nameA = 'Partner A',
  nameB
}) => {
  const [selectedPartner, setSelectedPartner] = useState<'A' | 'B'>('A');
  const activeAnalysis = selectedPartner === 'A' ? partnerA : partnerB;
  const activeName = selectedPartner === 'A' ? nameA : nameB;

  const { seventhCuspSubLord, significators, rulingPlanets, fourFoldAnalysis, fifthCuspAffairFormula, cuspalInterlinks, workplaceAffairGrouping } = activeAnalysis;
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const { loading, insight, error, triggerAnalysis } = useGeminiInsight();

  const getMarriagePromiseIcon = (promise: string) => {
    switch (promise) {
      case 'promised': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'denied': return <XCircle className="w-6 h-6 text-red-500" />;
      case 'complicated': return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      default: return <Info className="w-6 h-6 text-gray-500" />;
    }
  };

  const getMarriagePromiseColor = (promise: string) => {
    switch (promise) {
      case 'promised': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50';
      case 'denied': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50';
      case 'complicated': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'moderate': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';
      case 'weak': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
    }
  };

  const HelpBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border-l-4 border-blue-500 transition-colors">
      <div className="flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">{title}</h5>
          <div className="text-sm text-blue-700 dark:text-blue-300">{children}</div>
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
            <Target className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">KP Astrology Analysis</h2>
            <p className="text-indigo-100 leading-relaxed">
              KP (Krishnamurti Paddhati) is a precision-based predictive system that uses sub-lords and significators
              to predict marriage timing with high accuracy. This analysis reveals whether marriage is promised,
              denied, or complicated in your destiny.
            </p>
          </div>
        </div>
      </div>

      {/* Partner Toggle - Only show if nameB is present and different from nameA */}
      {nameB && nameB !== nameA && (
        <div className="flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center gap-1 transition-colors">
            <button
              onClick={() => setSelectedPartner('A')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedPartner === 'A' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {nameA}
            </button>
            <button
              onClick={() => setSelectedPartner('B')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedPartner === 'B' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {nameB}
            </button>
          </div>
        </div>
      )}

      {/* 7th Cusp Sub Lord - Most Critical */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
            <Target className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Marriage Promise Analysis - {activeName}
          </h2>
          <button
            onClick={() => setShowHelp(showHelp === 'cusp' ? null : 'cusp')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="What is this?"
          >
            <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {showHelp === 'cusp' && (
          <HelpBox title="What is 7th Cusp Sub Lord?">
            In KP astrology, the 7th house cusp (starting point) has a "Sub Lord" - a planet that acts as the
            manager of your marriage house. This planet's position and the houses it "signifies" determines
            whether marriage is promised, denied, or complicated in your life. Think of it as the decision-maker
            for your marital destiny.
          </HelpBox>
        )}

        {/* AI Prediction */}
        <div className="mb-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock className="w-32 h-32 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Predict with Vedic AI
                </h3>
                <p className="text-white/80 text-sm mt-1">
                  Decode the "Promise of Event" using KP Rules (Sub-Lord & Significators).
                </p>
              </div>
              <button
                onClick={() => triggerAnalysis('KP_PREDICTION', {
                  cuspData: activeAnalysis.seventhCuspSubLord,
                  significators: activeAnalysis.significators.filter(s => s.significations.includes(7) || s.significations.includes(2) || s.significations.includes(11)).slice(0, 5), // Send top 5 relevant significators
                  partnerName: activeName
                })}
                disabled={loading}
                className="px-5 py-2 bg-white text-violet-600 rounded-lg font-bold shadow-md hover:bg-violet-50 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {insight ? 'Analyze Again' : 'Analyze Marriage Promise'}
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

        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg transition-colors">
                {seventhCuspSubLord.planet.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-xl transition-colors">{seventhCuspSubLord.planet}</h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors">Your Marriage Manager Planet</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 transition-colors ${getMarriagePromiseColor(seventhCuspSubLord.marriagePromise)}`}>
              {getMarriagePromiseIcon(seventhCuspSubLord.marriagePromise)}
              <span className="capitalize">{seventhCuspSubLord.marriagePromise.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="mb-4 text-gray-700 dark:text-gray-300 transition-colors">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2 transition-colors">
              <Info className="w-4 h-4" />
              What This Planet Controls:
            </h4>
            <div className="flex flex-wrap gap-2">
              {seventhCuspSubLord.significations.map((house, idx) => (
                <span key={idx} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg text-sm font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 shadow-sm transition-colors">
                  House {house} - {getHouseMeaning(house)}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-gray-900/50 rounded-lg border border-indigo-200 dark:border-indigo-800/50 transition-colors">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors">{seventhCuspSubLord.interpretation}</p>
          </div>
        </div>

        {/* Marriage Promise Guide */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg transition-colors">
          <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2 transition-colors">
            <BookOpen className="w-5 h-5" />
            Understanding Your Marriage Status
          </h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800/30 transition-colors">
              <div className="flex items-center gap-2 mb-2 transition-colors">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-bold text-green-800 dark:text-green-200">Marriage Promised</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                When the marriage manager planet connects to houses 2 (family), 7 (marriage), or 11 (fulfillment),
                it means marriage is definitely written in your destiny. The timing depends on when these
                planetary periods activate.
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-800/30 transition-colors">
              <div className="flex items-center gap-2 mb-2 transition-colors">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="font-bold text-red-800 dark:text-red-200">Marriage Denied</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                If the manager planet connects to house 1 (self-focus), 6 (obstacles), or 10 (career), marriage
                may be denied, significantly delayed, or you may remain single by choice. Career or independence
                takes precedence.
              </p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800/30 transition-colors">
              <div className="flex items-center gap-2 mb-2 transition-colors">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="font-bold text-amber-800 dark:text-amber-200">Complicated Marriage</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">
                Connection to house 5 (romance), 8 (challenges), or 12 (loss) suggests marriage will happen but
                with complications - could be inter-caste, foreign spouse, secret affairs, or transformative
                challenges that test the relationship.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Four-Fold Significator Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
              <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Four Levels of Planetary Influence - {activeName}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
              How strongly each planet influences your marriage - ranked by power
            </p>
          </div>
          <button
            onClick={() => setShowHelp(showHelp === 'fourfold' ? null : 'fourfold')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {showHelp === 'fourfold' && (
          <HelpBox title="Understanding the 4 Levels">
            KP astrology recognizes that planets influence marriage in 4 different ways, from strongest to weakest:
            <br /><br />
            <strong>Level 1 (Strongest):</strong> Planet is in the star of a planet sitting in a house.<br />
            <strong>Level 2:</strong> Planet is physically sitting in a house.<br />
            <strong>Level 3:</strong> Planet is in the star of a house owner.<br />
            <strong>Level 4 (Base):</strong> Planet owns a house.
          </HelpBox>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg border border-purple-100 dark:border-purple-800/30 transition-colors">
            <div className="flex items-center gap-2 mb-3 transition-colors">
              <span className="w-8 h-8 bg-purple-600 dark:bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-colors">1</span>
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 transition-colors">Star of Occupant (Strongest Influence)</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors">
              These planets are in the "star" (nakshatra) of a planet sitting in a specific house.
              They give the RESULTS of that house most powerfully.
            </p>
            <div className="space-y-1">
              {fourFoldAnalysis.level1.length > 0 ? fourFoldAnalysis.level1.map((item, idx) => (
                <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded shadow-sm transition-colors">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  {item}
                </div>
              )) : (
                <p className="text-sm text-gray-500 dark:text-gray-500 italic transition-colors">No planets at this level</p>
              )}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg border border-blue-100 dark:border-blue-800/30 transition-colors">
            <div className="flex items-center gap-2 mb-3 transition-colors">
              <span className="w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-colors">2</span>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 transition-colors">Occupant of House (Strong)</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors">
              These planets are physically sitting in specific houses. They directly influence
              the matters of that house.
            </p>
            <div className="space-y-1">
              {fourFoldAnalysis.level2.length > 0 ? fourFoldAnalysis.level2.map((item, idx) => (
                <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded shadow-sm transition-colors">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {item}
                </div>
              )) : (
                <p className="text-sm text-gray-500 dark:text-gray-500 italic transition-colors">No planets at this level</p>
              )}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-lg border border-amber-100 dark:border-amber-800/30 transition-colors">
            <div className="flex items-center gap-2 mb-3 transition-colors">
              <span className="w-8 h-8 bg-amber-600 dark:bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-colors">3</span>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 transition-colors">Star of Lord (Moderate)</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors">
              These planets are in the star of a house owner (lord). They give results of
              houses owned by their star lord.
            </p>
            <div className="space-y-1">
              {fourFoldAnalysis.level3.length > 0 ? fourFoldAnalysis.level3.map((item, idx) => (
                <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded shadow-sm transition-colors">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  {item}
                </div>
              )) : (
                <p className="text-sm text-gray-500 dark:text-gray-500 italic transition-colors">No planets at this level</p>
              )}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 rounded-lg border border-green-100 dark:border-green-800/30 transition-colors">
            <div className="flex items-center gap-2 mb-3 transition-colors">
              <span className="w-8 h-8 bg-green-600 dark:bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-colors">4</span>
              <h4 className="font-semibold text-green-800 dark:text-green-200 transition-colors">Lord of House (Base)</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors">
              These planets own specific houses. They provide the base-level influence
              over those house matters.
            </p>
            <div className="space-y-1">
              {fourFoldAnalysis.level4.length > 0 ? fourFoldAnalysis.level4.map((item, idx) => (
                <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded shadow-sm transition-colors">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {item}
                </div>
              )) : (
                <p className="text-sm text-gray-500 dark:text-gray-500 italic transition-colors">No planets at this level</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Significators Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
              <Crosshair className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Planetary Significators - {activeName}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
              Complete breakdown of how each planet influences your life areas
            </p>
          </div>
          <button
            onClick={() => setShowHelp(showHelp === 'significators' ? null : 'significators')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {showHelp === 'significators' && (
          <HelpBox title="Understanding This Table">
            Each planet in your chart is a "significator" - it signifies (represents) certain houses/life areas.
            The <strong>Star Lord</strong> is the planet ruling the nakshatra (star) your planet is in.
            The <strong>Sub Lord</strong> further refines the prediction.
            <strong>Significations</strong> show which houses the planet influences.
            <strong>Strength</strong> indicates how powerfully it delivers those results.
          </HelpBox>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 transition-colors">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200 transition-colors">Planet</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200 transition-colors">Occupies</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200 transition-colors">Star Lord</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200 transition-colors">Sub Lord</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200 transition-colors">Influences These Life Areas</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-200 transition-colors">Power</th>
              </tr>
            </thead>
            <tbody>
              {significators.map((sig, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 transition-colors">{sig.planet}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 transition-colors">{getPlanetNature(sig.planet)}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 transition-colors">
                    House {sig.occupiedHouse}
                    <p className="text-xs text-gray-500 dark:text-gray-500 transition-colors">{getHouseMeaning(sig.occupiedHouse)}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 transition-colors">{sig.starLord}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300 transition-colors">{sig.subLord}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {sig.significations.map((house, hidx) => (
                        <span key={hidx} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs font-medium transition-colors" title={getHouseMeaning(house)}>
                          House {house}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize transition-colors ${getStrengthColor(sig.strength)}`}>
                      {sig.strength}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 transition-colors">
                      {sig.strength === 'strong' ? 'Delivers results powerfully' :
                        sig.strength === 'moderate' ? 'Average influence' : 'Weak influence'}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ruling Planets */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
              <Activity className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              Ruling Planets - {activeName}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
              Planets ruling the exact moment of this reading - used for timing predictions
            </p>
          </div>
          <button
            onClick={() => setShowHelp(showHelp === 'ruling' ? null : 'ruling')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {showHelp === 'ruling' && (
          <HelpBox title="What are Ruling Planets?">
            Ruling Planets are the 5 planets that "rule" the exact moment when this analysis was generated.
            In KP astrology, when a person asks a question or when we analyze a chart, the ruling planets
            at that moment should match the significators in the birth chart for accurate predictions.
            They're also used for birth time rectification and finding auspicious moments.
          </HelpBox>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-gradient-to-b from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800/30 text-center transition-colors">
            <div className="w-12 h-12 mx-auto mb-2 bg-yellow-500 dark:bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-colors">
              {rulingPlanets.dayLord.charAt(0)}
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm transition-colors">Day Lord</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">Planet ruling today</p>
            <p className="text-lg font-bold text-yellow-700 dark:text-yellow-400 transition-colors">{rulingPlanets.dayLord}</p>
          </div>

          <div className="p-4 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg border border-blue-200 dark:border-blue-800/30 text-center transition-colors">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-colors">
              {rulingPlanets.moonSignLord.charAt(0)}
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm transition-colors">Moon Sign Lord</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">Where Moon is now</p>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-400 transition-colors">{rulingPlanets.moonSignLord}</p>
          </div>

          <div className="p-4 bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg border border-purple-200 dark:border-purple-800/30 text-center transition-colors">
            <div className="w-12 h-12 mx-auto mb-2 bg-purple-500 dark:bg-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-colors">
              {rulingPlanets.moonStarLord.charAt(0)}
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm transition-colors">Moon Star Lord</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">Moon&apos;s nakshatra lord</p>
            <p className="text-lg font-bold text-purple-700 dark:text-purple-400 transition-colors">{rulingPlanets.moonStarLord}</p>
          </div>

          <div className="p-4 bg-gradient-to-b from-green-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 rounded-lg border border-green-200 dark:border-green-800/30 text-center transition-colors">
            <div className="w-12 h-12 mx-auto mb-2 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-colors">
              {rulingPlanets.lagnaSignLord.charAt(0)}
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm transition-colors">Lagna Sign Lord</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">Rising sign now</p>
            <p className="text-lg font-bold text-green-700 dark:text-green-400 transition-colors">{rulingPlanets.lagnaSignLord}</p>
          </div>

          <div className="p-4 bg-gradient-to-b from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 rounded-lg border border-red-200 dark:border-red-800/30 text-center transition-colors">
            <div className="w-12 h-12 mx-auto mb-2 bg-red-500 dark:bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-colors">
              {rulingPlanets.lagnaStarLord.charAt(0)}
            </div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm transition-colors">Lagna Star Lord</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">Ascendant nakshatra</p>
            <p className="text-lg font-bold text-red-700 dark:text-red-400 transition-colors">{rulingPlanets.lagnaStarLord}</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/50 transition-colors">
          <p className="text-sm text-indigo-800 dark:text-indigo-200 transition-colors">
            <strong>How to Use This:</strong> For accurate predictions, the ruling planets at the moment of
            judgment should match the significators in your birth chart. If your birth chart shows Jupiter
            as a significator for marriage, and Jupiter is also a ruling planet now, it confirms the timing
            is right for marriage-related matters.
          </p>
        </div>
      </div>

      {/* P2: 5th Cusp Affair Formula (5-8-12) */}
      {fifthCuspAffairFormula && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
                <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                5th Cusp Romance Analysis - {activeName}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
                KP formula: Does the 5th cusp sub-lord connect to houses 5, 8, and 12?
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${fifthCuspAffairFormula.severity === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
              fifthCuspAffairFormula.severity === 'moderate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              }`}>
              {fifthCuspAffairFormula.severity} risk
            </span>
          </div>

          <div className={`p-4 rounded-xl border ${fifthCuspAffairFormula.isActive
            ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
            : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30'
            } transition-colors`}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${fifthCuspAffairFormula.isActive ? 'bg-red-200 dark:bg-red-800/40 text-red-700 dark:text-red-300' : 'bg-green-200 dark:bg-green-800/40 text-green-700 dark:text-green-300'
                }`}>
                {fifthCuspAffairFormula.fifthCuspSubLord.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">5th CSL: {fifthCuspAffairFormula.fifthCuspSubLord}</span>
                  {fifthCuspAffairFormula.has5_8_12 && (
                    <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full">5-8-12 ACTIVE</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {fifthCuspAffairFormula.significations.map((h, i) => (
                    <span key={i} className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${[5, 8, 12].includes(h)
                      ? 'bg-red-200 dark:bg-red-800/40 text-red-800 dark:text-red-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}>
                      H{h}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-colors">{fifthCuspAffairFormula.interpretation}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* P2: Cuspal Interlinks (6-8-12 Breakdown) */}
      {cuspalInterlinks && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
                <Link2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                Cuspal Interlinks — Marriage Stability - {activeName}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
                Cross-signification among 6th, 8th, and 12th cusp sub-lords
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${cuspalInterlinks.breakdownGrouping.severity === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
              cuspalInterlinks.breakdownGrouping.severity === 'moderate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              }`}>
              {cuspalInterlinks.breakdownGrouping.severity}
            </span>
          </div>

          {/* 6-8-12 House Cards */}
          <div className="grid md:grid-cols-3 gap-3 mb-4">
            {cuspalInterlinks.breakdownGrouping.houses6_8_12.map((entry, i) => (
              <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200 transition-colors">House {entry.house}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{getHouseMeaning(entry.house)}</span>
                </div>
                <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-1 transition-colors">CSL: {entry.subLord}</div>
                <div className="flex flex-wrap gap-1">
                  {entry.significations.map((h, j) => (
                    <span key={j} className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${[6, 8, 12].includes(h)
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                      H{h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={`p-4 rounded-lg border transition-colors ${cuspalInterlinks.breakdownGrouping.isActive
            ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/30'
            : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30'
            }`}>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-colors">{cuspalInterlinks.breakdownGrouping.interpretation}</p>
          </div>

          {/* Sub-Lord Chain */}
          {cuspalInterlinks.subLordChain.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 transition-colors">Planets connected to breakdown houses:</h4>
              <div className="space-y-1">
                {cuspalInterlinks.subLordChain.map((chain, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs p-2 bg-gray-50 dark:bg-gray-900/30 rounded transition-colors">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 transition-colors">{chain.planet}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-gray-600 dark:text-gray-400 transition-colors">{chain.connectionPath}</span>
                    <span className="ml-auto flex gap-1">
                      {chain.houses.map(h => (
                        <span key={h} className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-[10px] font-bold transition-colors">H{h}</span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* P2: Workplace Affair Grouping (2-6-10) */}
      {workplaceAffairGrouping && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Workplace Relationship Pattern - {activeName}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
                Do work-related houses (2-6-10) connect to romance (5th) or partnerships (7th)?
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${workplaceAffairGrouping.severity === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
              workplaceAffairGrouping.severity === 'moderate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              }`}>
              {workplaceAffairGrouping.severity}
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-3 mb-4">
            {workplaceAffairGrouping.houses2_6_10.map((entry, i) => (
              <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200 transition-colors">House {entry.house}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{getHouseMeaning(entry.house)}</span>
                </div>
                <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-1 transition-colors">CSL: {entry.subLord}</div>
                <div className="flex flex-wrap gap-1">
                  {entry.significations.map((h, j) => (
                    <span key={j} className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${[5, 7].includes(h)
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                      H{h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {workplaceAffairGrouping.connectedPlanets.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-400 dark:text-gray-500 transition-colors">Connected Planets:</span>
              {workplaceAffairGrouping.connectedPlanets.map(p => (
                <span key={p} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium transition-colors">{p}</span>
              ))}
            </div>
          )}

          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-colors">{workplaceAffairGrouping.interpretation}</p>

          {/* Precision Alert: Workplace Context (NEW) */}
          {workplaceAffairGrouping.isActive && (
            <div className="mt-4 p-4 bg-blue-600 dark:bg-blue-500 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 text-white">
                <Briefcase className="w-8 h-8 opacity-80" />
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tighter">Precision Alert: Workplace Dynamic</h4>
                  <p className="text-xs font-medium text-blue-100">Hidden 2-6-10 linkage detected. High potential for professional boundary blurring.</p>
                </div>
              </div>
            </div>
          )}

          {/* Precision Alert: Hidden Linkages (NEW) */}
          {fifthCuspAffairFormula?.has5_8_12 && (
            <div className="mt-4 p-4 bg-rose-600 dark:bg-rose-500 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3 text-white">
                <ShieldAlert className="w-8 h-8 opacity-80" />
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tighter">Precision Alert: Hidden Linkages</h4>
                  <p className="text-xs font-medium text-rose-100">Deep 5-8-12 karmic pattern active. Relationship dynamics may remain private or unconventional.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper functions for descriptions
function getHouseMeaning(house: number): string {
  const meanings: Record<number, string> = {
    1: 'Self, body, personality',
    2: 'Family, wealth, speech',
    3: 'Siblings, courage, communication',
    4: 'Home, mother, happiness',
    5: 'Children, romance, intelligence',
    6: 'Obstacles, health, enemies',
    7: 'Marriage, partnerships',
    8: 'Transformation, longevity',
    9: 'Fortune, father, dharma',
    10: 'Career, status, father',
    11: 'Gains, friends, fulfillment',
    12: 'Loss, spirituality, foreign'
  };
  return meanings[house] || 'General';
}

function getPlanetNature(planet: string): string {
  const natures: Record<string, string> = {
    'Sun': 'Soul, authority, ego',
    'Moon': 'Mind, emotions, mother',
    'Mars': 'Energy, courage, aggression',
    'Mercury': 'Intelligence, communication',
    'Jupiter': 'Wisdom, expansion, fortune',
    'Venus': 'Love, beauty, relationships',
    'Saturn': 'Discipline, delays, karma',
    'Rahu': 'Obsession, foreign, sudden',
    'Ketu': 'Spirituality, detachment, past'
  };
  return natures[planet] || 'General influence';
}

export default KPAnalysisWidget;
