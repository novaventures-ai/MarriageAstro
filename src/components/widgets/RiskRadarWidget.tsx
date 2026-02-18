import React, { useState } from 'react';
import { RiskAssessment } from '../../types';
import { Shield, Users, Heart, AlertTriangle, CheckCircle, Briefcase, Home, Globe, Wifi, Sparkles, ShieldCheck, ChevronDown, ChevronUp, User, RefreshCw, AlertCircle, MapPin, Plane, BookOpen, DollarSign } from 'lucide-react';
import { useGeminiInsight } from '../../hooks/useGeminiInsight';
import ReactMarkdown from 'react-markdown';

interface RiskRadarWidgetProps {
  riskAssessment: RiskAssessment;
  partnerAName?: string;
  partnerBName?: string;
}

export const RiskRadarWidget: React.FC<RiskRadarWidgetProps> = ({
  riskAssessment,
  partnerAName = 'Partner A',
  partnerBName = 'Partner B'
}) => {
  const { divorceProbability, infidelityRisk, multipleMarriageIndicators, spouseLongevity } = riskAssessment;
  const [activePartner, setActivePartner] = useState<'overall' | 'A' | 'B'>('overall');
  const [showDivorceLogic, setShowDivorceLogic] = useState(false);
  const [showInfidelityLogic, setShowInfidelityLogic] = useState(false);
  const [showLongevityLogic, setShowLongevityLogic] = useState(false);

  const { loading, insight, error, triggerAnalysis } = useGeminiInsight();
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  const handleAnalyzeRisk = (type: string, data: any) => {
    setActiveAnalysis(type);
    triggerAnalysis('RISK_MITIGATION', {
      risk: type,
      severity: data.level,
      partner: activePartner === 'overall' ? 'Both' : activePartner === 'A' ? partnerAName : partnerBName,
      indicators: data.indicators
    });
  };

  // Helper to switch data based on active partner
  const getDisplayData = (combined: any, partA: any, partB: any) => {
    if (activePartner === 'A' && partA) return partA;
    if (activePartner === 'B' && partB) return partB;
    return combined;
  };

  const displayDivorce = getDisplayData(divorceProbability, divorceProbability.partnerA, divorceProbability.partnerB);
  const displayInfidelity = getDisplayData(infidelityRisk, infidelityRisk.partnerA, infidelityRisk.partnerB);
  const displayLongevity = getDisplayData(spouseLongevity, spouseLongevity?.partnerA, spouseLongevity?.partnerB);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/50';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/50';
      case 'very_high': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getRiskMeterColor = (score: number) => {
    if (score < 25) return 'bg-green-500';
    if (score < 50) return 'bg-yellow-500';
    if (score < 75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/50';
      case 'moderate': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/50';
      case 'severe': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getContextIcon = (context: string) => {
    switch (context) {
      case 'workplace': return <Briefcase className="w-4 h-4" />;
      case 'neighbor': return <MapPin className="w-4 h-4" />;
      case 'family': return <Home className="w-4 h-4" />;
      case 'social_circle': return <Globe className="w-4 h-4" />;
      case 'online': return <Wifi className="w-4 h-4" />;
      case 'foreign_isolated': return <Globe className="w-4 h-4" />;
      case 'travel': return <Plane className="w-4 h-4" />;
      case 'spiritual': return <BookOpen className="w-4 h-4" />;
      case 'financial': return <DollarSign className="w-4 h-4" />;
      case 'family_taboo': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Header & Global Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
            <Shield className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Risk Assessment Breakdown
          </h2>

          <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1 rounded-lg self-start">
            <button
              onClick={() => setActivePartner('overall')}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${activePartner === 'overall'
                ? 'bg-white dark:bg-gray-700 shadow-md text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              Overall
            </button>
            <button
              onClick={() => setActivePartner('A')}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all flex items-center gap-2 ${activePartner === 'A'
                ? 'bg-white dark:bg-gray-700 shadow-md text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <User className="w-4 h-4" /> {partnerAName}
            </button>
            <button
              onClick={() => setActivePartner('B')}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all flex items-center gap-2 ${activePartner === 'B'
                ? 'bg-white dark:bg-gray-700 shadow-md text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <User className="w-4 h-4" /> {partnerBName}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Divorce Risk Card */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800/30 transition-colors flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 transition-colors text-sm uppercase tracking-wide">Divorce Probability</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getRiskColor(displayDivorce.level)}`}>
                {displayDivorce.level.replace('_', ' ')}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1 transition-colors font-medium">
                <span>Risk Score</span>
                <span>{displayDivorce.score}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 transition-colors">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${getRiskMeterColor(displayDivorce.score)}`}
                  style={{ width: `${displayDivorce.score}%` }}
                />
              </div>
            </div>

            {displayDivorce.indicators.length > 0 && (
              <div className="space-y-3 flex-grow">
                <h4 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Key Indicators:</h4>
                <div className="space-y-2">
                  {displayDivorce.indicators.map((indicator: { text: string; profileName: string }, index: number) => (
                    <div key={index} className="flex flex-col gap-1 p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:border-indigo-100 dark:hover:border-indigo-900/30 group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 dark:bg-amber-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                      {activePartner === 'overall' && (
                        <span className="text-[9px] font-black uppercase tracking-tighter text-amber-600 dark:text-amber-500 opacity-50">
                          {indicator.profileName}
                        </span>
                      )}
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {indicator.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Neutralizing Influences (Paired UI) */}
            {riskAssessment.protectiveFactors && riskAssessment.protectiveFactors.length > 0 && (
              <div className="mt-4 p-3 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800/20 transition-all hover:border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  <span className="text-[10px] font-black text-green-700 dark:text-green-300 uppercase tracking-widest">Neutralizing Shields</span>
                </div>
                <div className="space-y-1.5">
                  {riskAssessment.protectiveFactors
                    .filter(f => activePartner === 'overall' || f.profileName === (activePartner === 'A' ? partnerAName : partnerBName))
                    .map((factor, idx) => (
                      <div key={idx} className="flex items-start gap-2 group/shield">
                        <CheckCircle className="w-2.5 h-2.5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-[10px] text-green-800 dark:text-green-200 leading-tight font-medium">
                          {factor.text}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowDivorceLogic(!showDivorceLogic)}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-indigo-500 transition-colors"
                >
                  {showDivorceLogic ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  Technical Calculation Logic
                </button>

                {(displayDivorce.level === 'high' || displayDivorce.level === 'very_high' || displayDivorce.score > 40) && (
                  <button
                    onClick={() => handleAnalyzeRisk('Divorce Risk', displayDivorce)}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading && activeAnalysis === 'Divorce Risk' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    {insight && activeAnalysis === 'Divorce Risk' ? 'Regenerate Plan' : 'Get Mitigation Strategy'}
                  </button>
                )}
              </div>

              {showDivorceLogic && (
                <div className="mt-3 p-3 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed animate-in fade-in slide-in-from-top-1 transition-all">
                  <p className="mb-2"><strong className="text-gray-700 dark:text-gray-200">7th Lord in Dusthana:</strong> Analyzes if the ruler of marriage sits in houses 6, 8, or 12, indicating obstacles or separation.</p>
                  <p><strong className="text-gray-700 dark:text-gray-200">Afflictions:</strong> Impact of Saturn/Rahu/Mars on the 7th house and its lord across both Rashi and Navamsa charts.</p>
                </div>
              )}

              {/* AI Insight for Divorce */}
              {error && activeAnalysis === 'Divorce Risk' && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}
              {insight && activeAnalysis === 'Divorce Risk' && (
                <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-xl relative overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-100 text-xs uppercase tracking-wider">The Therapist's Strategy</h4>
                  </div>
                  <div className="prose prose-xs dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                    <ReactMarkdown>{insight}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Infidelity Risk Card */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800/30 transition-colors flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 transition-colors text-sm uppercase tracking-wide">Infidelity & Passion</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getRiskColor(displayInfidelity.level)}`}>
                {displayInfidelity.level.replace('_', ' ')}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1 transition-colors font-medium">
                <span>Risk Score</span>
                <span>{displayInfidelity.score}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 transition-colors">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${getRiskMeterColor(displayInfidelity.score)}`}
                  style={{ width: `${displayInfidelity.score}%` }}
                />
              </div>
            </div>

            {displayInfidelity.indicators.length > 0 && (
              <div className="space-y-3 flex-grow">
                <h4 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Key Indicators:</h4>
                <div className="space-y-2">
                  {displayInfidelity.indicators.map((indicator: { text: string; profileName: string }, index: number) => (
                    <div key={index} className="flex flex-col gap-1 p-2.5 bg-white dark:bg-gray-800 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:border-indigo-100 dark:hover:border-indigo-900/30 group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 dark:bg-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                      {activePartner === 'overall' && (
                        <span className="text-[9px] font-black uppercase tracking-tighter text-indigo-600 dark:text-indigo-500 opacity-50">
                          {indicator.profileName}
                        </span>
                      )}
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {indicator.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Neutralizing Influences (Paired UI) */}
            {riskAssessment.protectiveFactors && riskAssessment.protectiveFactors.length > 0 && (
              <div className="mt-4 p-3 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800/20 transition-all hover:border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  <span className="text-[10px] font-black text-green-700 dark:text-green-300 uppercase tracking-widest">Neutralizing Shields</span>
                </div>
                <div className="space-y-1.5">
                  {riskAssessment.protectiveFactors
                    .filter(f => activePartner === 'overall' || f.profileName === (activePartner === 'A' ? partnerAName : partnerBName))
                    .map((factor, idx) => (
                      <div key={idx} className="flex items-start gap-2 group/shield">
                        <CheckCircle className="w-2.5 h-2.5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-[10px] text-green-800 dark:text-green-200 leading-tight font-medium">
                          {factor.text}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowInfidelityLogic(!showInfidelityLogic)}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-indigo-500 transition-colors"
                >
                  {showInfidelityLogic ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  Technical Calculation Logic
                </button>

                {(displayInfidelity.level === 'high' || displayInfidelity.level === 'medium' || displayInfidelity.score > 30) && (
                  <button
                    onClick={() => handleAnalyzeRisk('Infidelity Risk', displayInfidelity)}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading && activeAnalysis === 'Infidelity Risk' ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    {insight && activeAnalysis === 'Infidelity Risk' ? 'Regenerate Plan' : 'Get Mitigation Strategy'}
                  </button>
                )}
              </div>

              {showInfidelityLogic && (
                <div className="mt-3 p-3 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed animate-in fade-in slide-in-from-top-1 transition-all">
                  <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <strong className="text-gray-700 dark:text-gray-200 block mb-1 uppercase tracking-tighter">Passion Centers:</strong>
                      <p>Mars (Drive), Venus (Attraction), and Rahu (Obsession) influence the desire nature.</p>
                    </div>
                    <div>
                      <strong className="text-gray-700 dark:text-gray-200 block mb-1 uppercase tracking-tighter">KP House Guide:</strong>
                      <ul className="space-y-0.5">
                        <li>• <span className="font-bold">5th:</span> Romance & Self-expression</li>
                        <li>• <span className="font-bold">7th:</span> Primary Commitment</li>
                        <li>• <span className="font-bold">11th:</span> Fulfillment of Desires</li>
                      </ul>
                    </div>
                  </div>
                  <p><strong className="text-gray-700 dark:text-gray-200">Significance:</strong> Risk increases when the ruler of the 7th (Marriage) connects to the 5th or 11th through passion-oriented planets.</p>
                </div>
              )}

              {/* AI Insight for Infidelity */}
              {error && activeAnalysis === 'Infidelity Risk' && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}
              {insight && activeAnalysis === 'Infidelity Risk' && (
                <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-xl relative overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-100 text-xs uppercase tracking-wider">The Therapist's Strategy</h4>
                  </div>
                  <div className="prose prose-xs dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                    <ReactMarkdown>{insight}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div >

      {/* Manglik Analysis Section */}
      {
        riskAssessment.manglikAnalysis && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-red-50 dark:border-red-900/20 transition-colors">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3 transition-colors">
              <Heart className="w-6 h-6 text-red-500 dark:text-red-400" />
              Manglik Dosha Analysis
              <span className={`ml-auto text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-colors ${riskAssessment.manglikAnalysis.compatibility.includes('High')
                ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                }`}>
                {riskAssessment.manglikAnalysis.compatibility}
              </span>
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Partner A */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{partnerAName}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded transition-colors ${riskAssessment.manglikAnalysis.partnerA.isManglik
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                    : 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
                    }`}>
                    {riskAssessment.manglikAnalysis.partnerA.isManglik ? 'MANGLIK' : 'NON-MANGLIK'}
                  </span>
                </div>

                {riskAssessment.manglikAnalysis.partnerA.isManglik && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                      <span>Dosha Intensity</span>
                      <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={`w-3 h-1.5 rounded-sm transition-colors ${i <= (riskAssessment.manglikAnalysis!.partnerA.score * 3) ? 'bg-red-400 dark:bg-red-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        ))}
                      </div>
                    </div>

                    {riskAssessment.manglikAnalysis.partnerA.isCancelled && (
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30 transition-colors">
                        <p className="text-[10px] font-bold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> DOSHA CANCELLED
                        </p>
                        <ul className="text-[10px] text-green-600 dark:text-green-500 space-y-0.5 list-disc pl-3">
                          {riskAssessment.manglikAnalysis.partnerA.cancellationReasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Partner B */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{partnerBName}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded transition-colors ${riskAssessment.manglikAnalysis.partnerB.isManglik
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                    : 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
                    }`}>
                    {riskAssessment.manglikAnalysis.partnerB.isManglik ? 'MANGLIK' : 'NON-MANGLIK'}
                  </span>
                </div>

                {riskAssessment.manglikAnalysis.partnerB.isManglik && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter transition-colors">
                      <span>Dosha Intensity</span>
                      <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={`w-3 h-1.5 rounded-sm transition-colors ${i <= (riskAssessment.manglikAnalysis!.partnerB.score * 3) ? 'bg-red-400 dark:bg-red-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        ))}
                      </div>
                    </div>

                    {riskAssessment.manglikAnalysis.partnerB.isCancelled && (
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30 transition-colors">
                        <p className="text-[10px] font-bold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1 transition-colors">
                          <ShieldCheck className="w-3 h-3" /> DOSHA CANCELLED
                        </p>
                        <ul className="text-[10px] text-green-600 dark:text-green-500 space-y-0.5 list-disc pl-3 transition-colors">
                          {riskAssessment.manglikAnalysis.partnerB.cancellationReasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }

      {/* Multiple Marriage Indicators */}
      {
        multipleMarriageIndicators && multipleMarriageIndicators.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Multiple Marriage Indicators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {multipleMarriageIndicators.map((indicator: { text: string; profileName: string }, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30 transition-all hover:bg-purple-100 dark:hover:bg-purple-900/30">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-[10px] font-black text-purple-600 dark:text-purple-300 transition-colors">
                    {indicator.profileName.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-purple-400 dark:text-purple-500 transition-colors">
                      {indicator.profileName}
                    </span>
                    <span className="text-sm text-purple-900 dark:text-purple-200 font-bold transition-colors">
                      {indicator.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }

      {/* Detected Yogas/Doshas */}
      {
        riskAssessment.detectedYogas && riskAssessment.detectedYogas.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Detected Risk Yogas & Doshas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskAssessment.detectedYogas.map((yoga: { name: string; severity: string; description: string; profileName: string }, index: number) => (
                <div key={index} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/30 transition-all hover:border-amber-200 dark:hover:border-amber-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800 dark:text-gray-100 text-sm transition-colors">{yoga.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${getSeverityColor(yoga.severity)}`}>
                      {yoga.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">{yoga.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-600/60 dark:text-amber-500/60">{yoga.profileName}</span>
                    <Shield className="w-3 h-3 text-amber-500 opacity-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }


      {/* Affair Context Indicators */}
      {
        riskAssessment.affairContextIndicators && riskAssessment.affairContextIndicators.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
              <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              Social & Environmental Triggers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskAssessment.affairContextIndicators.map((indicator: { context: string; text: string; profileName: string }, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-violet-50 dark:bg-violet-900/15 rounded-xl border border-violet-100 dark:border-violet-800/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-300 flex-shrink-0 transition-colors">
                    {getContextIcon(indicator.context)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-violet-500 dark:text-violet-400 transition-colors">
                      {indicator.context.replace('_', ' ')} • {indicator.profileName}
                    </span>
                    <span className="text-sm text-violet-900 dark:text-violet-200 font-bold tracking-tight transition-colors">{indicator.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }

      {/* Navamsa Confirmations */}
      {
        riskAssessment.navamsaConfirmations && riskAssessment.navamsaConfirmations.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
              <Shield className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              Navamsa (D-9) Confirmation
            </h3>
            <div className="space-y-3">
              {riskAssessment.navamsaConfirmations.map((conf: { text: string; confirmed: boolean; profileName: string }, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-sky-50 dark:bg-sky-900/15 rounded-xl border border-sky-100 dark:border-sky-800/30 transition-colors">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${conf.confirmed ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'}`}>
                    {conf.confirmed ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-sky-900 dark:text-sky-200 font-bold transition-colors">{conf.text}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-sky-400 dark:text-sky-500 mt-1 transition-colors">{conf.profileName} (Soul Level)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }

      {/* Spouse Longevity Section */}
      {
        spouseLongevity && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 transition-colors">
                <Heart className="w-5 h-5 text-emerald-500" />
                Spouse Longevity & Life-Span Analysis
              </h3>

              <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded transition-colors">
                Perspective: {activePartner === 'overall' ? 'Combined Path' : activePartner === 'A' ? partnerAName : partnerBName}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-1 border-r border-gray-100 dark:border-gray-700 pr-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block transition-colors">
                  {activePartner === 'overall' ? 'Shared Longevity Score' : `${activePartner === 'A' ? partnerAName : partnerBName} 's Impact Rating`}
                </span >
                <div className="flex items-end gap-1">
                  <span className={`text-3xl font-black ${displayLongevity!.score >= 70 ? 'text-emerald-600 dark:text-emerald-400' :
                    displayLongevity!.score >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                    {displayLongevity!.score}
                  </span>
                  <span className="text-sm text-gray-400 mb-1">/100</span>
                </div>
                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${displayLongevity!.level === 'stable' ? 'bg-green-100 text-green-700' :
                  displayLongevity!.level === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                  {displayLongevity!.level}
                </span>

                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-100 dark:border-gray-800 transition-colors">
                  <p className="text-[10px] leading-relaxed text-gray-500 dark:text-gray-400 font-medium">
                    {activePartner === 'overall'
                      ? "Combined analysis of both charts determining the shared longevity path."
                      : `Analysis of ${activePartner === 'A' ? partnerAName : partnerBName}'s chart predicting the longevity of the partner.`}
                  </p>
                </div>
              </div >

              <div className="md:col-span-2">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors">{displayLongevity!.description}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-4 italic transition-colors">
                  *Indicators extracted from {activePartner === 'overall' ? 'both birth charts' : `${activePartner === 'A' ? partnerAName : partnerBName}'s birth chart`}.
                </p>

                <div className="space-y-3">
                  {displayLongevity!.indicators?.map((ind: { text: string; profileName: string }, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 bg-gray-50/50 dark:bg-gray-900/20 rounded-lg border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-all group">
                      <span className="text-emerald-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                      <div className="flex flex-col">
                        {activePartner === 'overall' && (
                          <span className="font-black text-[9px] uppercase tracking-tighter text-emerald-600 dark:text-emerald-500 opacity-60">
                            {ind.profileName}
                          </span>
                        )}
                        <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-bold">
                          {ind.text}
                        </span>
                      </div>
                    </div>
                  ))}

                  {(!displayLongevity!.indicators || displayLongevity!.indicators.length === 0) && (
                    <p className="text-xs text-gray-400 italic py-2">No specific risk patterns detected for this perspective.</p>
                  )}
                </div>
              </div>
            </div >

            {/* Longevity Logic Dropdown */}
            < div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-4" >
              <button
                onClick={() => setShowLongevityLogic(!showLongevityLogic)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-500 transition-colors"
              >
                {showLongevityLogic ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Spouse Longevity Calculation Logic
              </button>

              {
                showLongevityLogic && (
                  <div className="mt-4 grid md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-300 transition-all">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Vedic Methodology
                      </h4>
                      <ul className="space-y-2">
                        <li className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-200 uppercase tracking-tighter">Mangalya Bhava (2nd):</strong> In relationship charts, the 2nd house represents the longevity of the marital bond.
                        </li>
                        <li className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-200 uppercase tracking-tighter">8th House Analysis:</strong> Represents transformations. Patterns here can project onto the partner's wellbeing.
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-3 h-3" /> Key Factors
                      </h4>
                      <ul className="space-y-2">
                        <li className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-200 uppercase tracking-tighter">7th Lord Impact:</strong> Placement in Dusthana (6/8/12) is evaluated for "Maraka" (death-inflicting) influences.
                        </li>
                        <li className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                          <strong className="text-gray-800 dark:text-gray-200 uppercase tracking-tighter">Planetary Strength:</strong> Jupiter/Venus aspects are counted as protective life-extending influences.
                        </li>
                      </ul>
                    </div>
                  </div>
                )
              }
            </div >
          </div >
        )
      }
    </div >
  );
};

export default RiskRadarWidget;