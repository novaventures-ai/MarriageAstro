
import React, { useState } from 'react';
import { SexualHealthAnalysis } from '../../types';
import { Heart, Activity, AlertCircle, CheckCircle, Stethoscope, RefreshCw, Sparkles, HelpCircle, Eye, EyeOff, Star, BookOpen, Zap, Clock, Shield } from 'lucide-react';
import { useGeminiInsight } from '../../hooks/useGeminiInsight';
import { Chart } from '../../types';
import ReactMarkdown from 'react-markdown';
import { ExtendedSexualCompatibility } from '../../types/extendedTypes';
import { resolveYoniKey, getFullYoniData, FullYoniData } from './sexualCompatHelpers';

import nakshatraCompatData from '../../../knowledge/nakshatra_compatibility.json';
import yoniCompatData from '../../../knowledge/yoni_sexual_compatibility.json';

interface SelfSexualProfileWidgetProps {
    sexualHealth: SexualHealthAnalysis;
    chart: Chart;
    extendedCompatibility?: ExtendedSexualCompatibility;
}

export const SelfSexualProfileWidget: React.FC<SelfSexualProfileWidgetProps> = ({
    sexualHealth,
    chart,
    extendedCompatibility
}) => {
    const { maleHealth, femaleHealth } = sexualHealth;
    const { loading, insight, error, triggerAnalysis } = useGeminiInsight();
    const [showSensitive, setShowSensitive] = useState(false);
    const [showHelp, setShowHelp] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'yoni' | 'nakshatra'>('overview');

    const gender = chart.gender.toLowerCase();
    const isMale = gender === 'male';

    // Select relevant health data based on gender
    const healthData = isMale ? maleHealth : femaleHealth;

    // Use extended yoni depth if available, otherwise fallback
    const yoniDepth = extendedCompatibility?.yoniDepth?.partnerA
        || (sexualHealth as any).yoniDepth;

    const moonNakshatra = chart.planetaryPositions.find(p => p.planet === 'Moon')?.nakshatra || 'Ashwini';

    // Get Yoni details from knowledge base
    const getYoniDetails = () => {
        const rawAnimalName = yoniDepth?.animal || (sexualHealth as any).yoniType?.animal;
        if (!rawAnimalName) return null;

        let animalName = rawAnimalName;
        const match = rawAnimalName.match(/\(([^)]+)\)/);
        if (match) {
            animalName = match[1];
        }

        const mapping: Record<string, string> = {
            'Deer': 'Mriga', 'Hare': 'Mriga', 'Snake': 'Sarpa', 'Goat': 'Aja',
            'Sheep': 'Aja', 'Camel': 'Ustra', 'Mongoose': 'Nakula', 'Dog': 'Shwaan',
            'Cat': 'Marjara', 'Cow': 'Gow', 'Buffalo': 'Mahisha', 'Tiger': 'Vyaghra',
            'Lion': 'Simha', 'Monkey': 'Vanar', 'Rat': 'Mushaka', 'Elephant': 'Gaja',
            'Horse': 'Ashwa'
        };

        const sanskritName = mapping[animalName] || animalName;
        const yoniInfo = (yoniCompatData as any).yoni_system.yonis[sanskritName];

        if (!yoniInfo) return null;

        return {
            sanskritName,
            animalName,
            nature: yoniInfo.sexual_nature.description.split('.')[0],
            temperament: yoniInfo.sexual_nature.characteristics[0],
            desires: yoniInfo.sexual_nature.characteristics,
            bestWith: yoniInfo.best_matches || [],
            challengingWith: yoniInfo.worst_matches || [],
            description: yoniInfo.sexual_nature.description
        };
    };

    const yoniDetails = getYoniDetails();

    // Get full yoni data using same helper as compatibility module
    const getFullYoni = (): FullYoniData | null => {
        const rawAnimalName = yoniDepth?.animal || (sexualHealth as any).yoniType?.animal;
        if (!rawAnimalName) return null;
        // Try resolving from the raw name (handles "Vyaghra (Tiger)" format etc.)
        return getFullYoniData(rawAnimalName);
    };
    const fullYoni = getFullYoni();

    // Get detailed Nakshatra details
    const getNakshatraDetails = () => {
        const data = (nakshatraCompatData as any).nakshatra_compatibility[moonNakshatra];
        return data || null;
    };

    const nakshatraDetails = getNakshatraDetails();

    const getRiskBadge = (risk: 'Low' | 'Medium' | 'High') => {
        switch (risk) {
            case 'Low':
                return <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium transition-colors">Low Risk</span>;
            case 'Medium':
                return <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium transition-colors">Medium Risk</span>;
            case 'High':
                return <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-medium transition-colors">High Risk</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Educational Header */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl shadow-lg p-8 text-white transition-colors relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                            <Heart className="w-8 h-8" />
                            Physical Profile & Vitality
                        </h2>
                        <p className="opacity-90 max-w-xl">
                            Astrological insights into your physical intimacy style, vitality, and hidden needs.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowSensitive(!showSensitive)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all no-print ${showSensitive
                            ? 'bg-red-500 text-white shadow-inner'
                            : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                            }`}
                        title={showSensitive ? 'Hide Sensitive Anatomical Details' : 'Show Sensitive Anatomical Details'}
                    >
                        {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showSensitive ? 'Sensitive: ON' : 'Show Detail'}
                    </button>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Activity className="w-32 h-32 text-white" />
                </div>
            </div>

            {/* Navigation Tabs - Hidden in Print */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-2 flex gap-2 transition-colors no-print">
                {['overview', 'yoni', 'nakshatra'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === tab
                            ? 'bg-rose-600 text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
                {activeTab === 'overview' && (
                    <div>
                        {/* Vitality Analysis Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors no-break">
                            <div className="flex items-center gap-3 mb-6">
                                <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 transition-colors">
                                    {isMale ? 'Male Vitality Analysis' : 'Female Vitality Analysis'}
                                </h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        {isMale ? (
                                            <>
                                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">Vitality Retention Risk</span>
                                                    {getRiskBadge(maleHealth.pmeRisk)}
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">Physical Strength Risk</span>
                                                    {getRiskBadge(maleHealth.edRisk)}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">Desire Level Risk</span>
                                                    {getRiskBadge(femaleHealth.frigidityRisk)}
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">Physical Comfort Risk</span>
                                                    {getRiskBadge(femaleHealth.physicalPainRisk)}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {healthData.indicators.length > 0 && (
                                        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30">
                                            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                Potential Challenges
                                            </h4>
                                            <ul className="space-y-2">
                                                {healthData.indicators.map((indicator, index) => (
                                                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                                        <span className="text-amber-500">•</span>
                                                        {indicator}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {healthData.recommendations.length > 0 && (
                                        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-800/30 h-full">
                                            <h4 className="text-sm font-bold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Wellness Recommendations
                                            </h4>
                                            <ul className="space-y-2">
                                                {healthData.recommendations.map((rec, index) => (
                                                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                                        <span className="text-green-500">•</span>
                                                        {rec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* AI Consult Section */}
                        <div className={`bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden transition-all mt-6`}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 relative z-10">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Stethoscope className="w-6 h-6 text-yellow-300" />
                                        Consult Vedic Doctor
                                    </h3>
                                    <p className="text-violet-100 text-sm mt-1">
                                        Get a discreet analysis of your vitality and physical intimacy needs.
                                    </p>
                                </div>
                                <button
                                    onClick={() => triggerAnalysis('PHYSICAL_VITALITY_ANALYSIS', {
                                        mars: 'Analyze Mars for vitality',
                                        venus: 'Analyze Venus for passion',
                                        eighthHouse: '8th House for longevity/intimacy',
                                        partnerName: chart.name
                                    })}
                                    disabled={loading}
                                    className="px-5 py-2 bg-white text-violet-700 rounded-lg font-bold shadow-lg hover:bg-violet-50 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2 text-sm no-print"
                                >
                                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Stethoscope className="w-4 h-4" />}
                                    {insight ? 'Consult Again' : 'Analyze Me'}
                                </button>
                            </div>

                            {error && (
                                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3 relative z-10">
                                    <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0" />
                                    <p className="text-sm text-white">{error}</p>
                                </div>
                            )}

                            {insight && (
                                <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20 relative z-10 backdrop-blur-sm">
                                    <div className="prose prose-sm prose-invert max-w-none">
                                        <ReactMarkdown>{insight}</ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'yoni' && (
                    <div className={`space-y-6`}>
                        {/* Yoni Detailed Profile - Enhanced like Compatibility Module */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors no-break">
                            <h3 className="text-xl font-bold text-rose-800 dark:text-rose-200 mb-6 flex items-center gap-2 transition-colors">
                                <Sparkles className="w-6 h-6 text-rose-500 dark:text-rose-400" />
                                Your Physical Nature (Yoni)
                            </h3>

                            {/* Yoni Type Header */}
                            <div className="p-6 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-800/30 transition-colors mb-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 bg-rose-600 dark:bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">
                                        {chart.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm text-rose-600 dark:text-rose-400">Your Physical Type</p>
                                        <h4 className="text-3xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight">{fullYoni?.name || yoniDepth?.animal}</h4>
                                        {fullYoni && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{fullYoni.gender} • {fullYoni.element}</p>}
                                    </div>
                                </div>
                                {(fullYoni?.description || yoniDetails?.description) && (
                                    <div className="p-3 bg-white/60 dark:bg-gray-900/40 rounded-xl">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">"{fullYoni?.description || yoniDetails?.description}"</p>
                                    </div>
                                )}
                            </div>

                            {/* 4-Column Summary Grid - Matching Compatibility Module */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    <div className="flex items-center gap-1 mb-1"><Zap className="w-4 h-4 text-yellow-500" /><span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Drive</span></div>
                                    <p className="font-bold text-rose-600 dark:text-rose-400">{fullYoni?.driveLevel || yoniDepth?.drive || 'Moderate'}</p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    <div className="flex items-center gap-1 mb-1"><Activity className="w-4 h-4 text-green-500" /><span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Stamina</span></div>
                                    <p className="font-bold text-rose-600 dark:text-rose-400">{fullYoni?.staminaLevel || yoniDepth?.stamina || 'Standard'}</p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    <div className="flex items-center gap-1 mb-1"><Clock className="w-4 h-4 text-blue-500" /><span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Session Style</span></div>
                                    <p className="font-bold text-rose-600 dark:text-rose-400">{fullYoni?.sessionLevel || yoniDepth?.sessionDuration || 'Balanced'}</p>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    <div className="flex items-center gap-1 mb-1"><Shield className="w-4 h-4 text-purple-500" /><span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Element</span></div>
                                    <p className="font-bold text-rose-600 dark:text-rose-400">{fullYoni?.element || yoniDepth?.bodyElement || 'Earth'}</p>
                                </div>
                            </div>

                            {/* Detailed Elaboration Cards - Matching Compatibility Module */}
                            {fullYoni && (
                                <div className="space-y-4 mb-6">
                                    {[
                                        { icon: <Zap className="w-5 h-5 text-yellow-500" />, label: 'Drive', text: fullYoni.driveDesc, color: 'border-yellow-400' },
                                        { icon: <Activity className="w-5 h-5 text-green-500" />, label: 'Stamina', text: fullYoni.staminaDesc, color: 'border-green-400' },
                                        { icon: <Clock className="w-5 h-5 text-blue-500" />, label: 'Session Style', text: fullYoni.sessionDesc, color: 'border-blue-400' },
                                        { icon: <Shield className="w-5 h-5 text-purple-500" />, label: `Element (${fullYoni.element})`, text: fullYoni.elementDesc, color: 'border-purple-400' },
                                    ].map(({ icon, label, text, color }) => (
                                        <div key={label} className={`p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-l-4 ${color}`}>
                                            <div className="flex items-center gap-2 mb-1">{icon}<span className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">{label}</span></div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Behavioral Signature */}
                            {fullYoni && fullYoni.characteristics.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Behavioral Signature:</p>
                                    <div className="space-y-2">
                                        {fullYoni.characteristics.map((c, i) => (
                                            <div key={i} className="flex items-start gap-2 p-2 bg-rose-50 dark:bg-rose-900/10 rounded-lg">
                                                <span className="text-rose-500 mt-0.5">&bull;</span>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{c}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Natural Affinities */}
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800/20">
                                    <h5 className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Heart className="w-3 h-3" />
                                        Best Compatibility With
                                    </h5>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(fullYoni?.bestMatches || yoniDetails?.bestWith || []).map((m: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-white dark:bg-gray-800 text-xs font-bold text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800/30 rounded shadow-sm">{m}</span>
                                        ))}
                                        {(fullYoni?.bestMatches || yoniDetails?.bestWith || []).length === 0 && <span className="text-xs text-gray-500">Various natures</span>}
                                    </div>
                                </div>
                                <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-800/20">
                                    <h5 className="text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-3 h-3" />
                                        Challenging Dynamics With
                                    </h5>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(fullYoni?.worstMatches || yoniDetails?.challengingWith || []).map((m: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-white dark:bg-gray-800 text-xs font-bold text-red-500 dark:text-red-400 border border-red-100 dark:border-red-800/30 rounded shadow-sm">{m}</span>
                                        ))}
                                        {(fullYoni?.worstMatches || yoniDetails?.challengingWith || []).length === 0 && <span className="text-xs text-gray-500">Opposing natures</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Physiological Section */}
                            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Physical Build & Traits (Sensitive)</h4>
                                    <button
                                        onClick={() => setShowHelp(showHelp === 'anatomy' ? null : 'anatomy')}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors no-print"
                                    >
                                        <HelpCircle className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>

                                {showHelp === 'anatomy' && (
                                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 text-xs text-blue-800 dark:text-blue-200 transition-colors">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><strong>Opening:</strong> Initial receptivity & sensitivity.</div>
                                            <div><strong>Foreskin:</strong> External sensitivity level.</div>
                                            <div><strong>Passage:</strong> Internal texture & flow.</div>
                                            <div><strong>Girth:</strong> Presence & expansion intensity.</div>
                                            <div><strong>Base:</strong> Depth & root stamina.</div>
                                            <div><strong>Glans:</strong> Focal point of peak sensation.</div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {(fullYoni?.anatomy || (yoniDepth && yoniDepth.anatomy)) && Object.entries(fullYoni?.anatomy || yoniDepth.anatomy).map(([key, value]) => {
                                        if (!value) return null;

                                        const isMaleTrait = ['foreskin', 'girth', 'glans'].includes(key);
                                        const isFemaleTrait = ['opening', 'passage', 'base'].includes(key);
                                        const isArchetype = key === 'lingamType' || key === 'gender';

                                        if (isMale && isFemaleTrait) return null;
                                        if (!isMale && isMaleTrait) return null;

                                        return (
                                            <div key={key} className={`flex flex-col p-4 rounded-xl border transition-all duration-300 ${!showSensitive ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 shadow-inner' : 'bg-white dark:bg-gray-800 border-indigo-100 dark:border-indigo-800/30 shadow-md'}`}>
                                                <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black mb-1 transition-colors tracking-tighter">
                                                    {isArchetype ? 'Nature Archetype' : key}
                                                </span>
                                                {showSensitive ? (
                                                    <div className="space-y-1">
                                                        <span className="text-base font-bold text-gray-800 dark:text-gray-100 capitalize transition-colors">{value as string}</span>
                                                        {isArchetype && (
                                                            <p className="text-[9px] text-indigo-500 dark:text-indigo-400 leading-tight transition-colors">
                                                                Behavioral energy of animal nature
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between mt-1">
                                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded italic transition-colors">Protected</span>
                                                        <button
                                                            onClick={() => setShowSensitive(true)}
                                                            className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold transition-colors no-print"
                                                        >
                                                            Reveal
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'nakshatra' && (
                    <div className={`space-y-6`}>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors no-break">
                            <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-200 mb-6 flex items-center gap-2 transition-colors">
                                <Star className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                                Nakshatra (Birth Star) Analysis
                            </h3>

                            {!nakshatraDetails ? (
                                <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                    <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Detailed Nakshatra characteristics not found in library for "{moonNakshatra}".</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 bg-indigo-600 dark:bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                                                <Star className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-indigo-600 dark:text-indigo-400">Your Nakshatra</p>
                                                <h4 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{moonNakshatra}</h4>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-50">
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Planetary Lord</p>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{nakshatraDetails.lord}</p>
                                                </div>
                                                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-50">
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Ruling Deity</p>
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{nakshatraDetails.deity}</p>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-white/40 dark:bg-gray-900/40 rounded-xl border border-indigo-50/50">
                                                <p className="text-[10px] text-indigo-500 uppercase font-black mb-2 tracking-widest flex items-center gap-1">
                                                    <BookOpen className="w-3 h-3" />
                                                    Psychological Profile
                                                </p>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                                                    {nakshatraDetails.characteristics || `People born under ${moonNakshatra} are known for their unique spiritual and psychological depth, influenced by ${nakshatraDetails.lord}.`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800">
                                            <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <Sparkles className="w-3 h-3 text-yellow-500" />
                                                Astrological Classifications
                                            </h5>
                                            <div className="grid grid-cols-1 gap-4 text-sm">
                                                <div className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-800">
                                                    <span className="text-gray-500">Symbol:</span>
                                                    <span className="font-bold text-gray-800 dark:text-gray-100">{nakshatraDetails.symbol}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-800">
                                                    <span className="text-gray-500">Gana (Disposition):</span>
                                                    <span className="font-bold text-gray-800 dark:text-gray-100">
                                                        {nakshatraDetails.gana}
                                                        <span className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-[10px] uppercase">
                                                            {nakshatraDetails.gana === 'Deva' ? 'Noble' : nakshatraDetails.gana === 'Manushya' ? 'Human' : 'Intense'}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between p-2">
                                                    <span className="text-gray-500">Nadi (Constitution):</span>
                                                    <span className="font-bold text-gray-800 dark:text-gray-100">
                                                        {nakshatraDetails.nadi}
                                                        <span className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-[10px] uppercase">
                                                            {nakshatraDetails.nadi === 'Vata' ? 'Air' : nakshatraDetails.nadi === 'Pitta' ? 'Fire' : 'Water'}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                                            <h5 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase mb-3">Synergy Windows</h5>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Best Emotional Harmonies</p>
                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        {nakshatraDetails.best_match.map((m: string, i: number) => (
                                                            <span key={i} className="px-2 py-1 bg-white dark:bg-gray-800 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 rounded shadow-sm hover:scale-105 transition-transform">{m}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Complex Interactions With</p>
                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        {nakshatraDetails.worst_match.map((m: string, i: number) => (
                                                            <span key={i} className="px-2 py-1 bg-white dark:bg-gray-800 text-[10px] font-bold text-red-500 dark:text-red-400 border border-red-100 rounded shadow-sm">{m}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
