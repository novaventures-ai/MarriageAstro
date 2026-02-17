import React, { useState } from 'react';
import {
    Brain,
    AlertTriangle,
    Shield,
    ChevronDown,
    ChevronUp,
    Heart,
    Info
} from 'lucide-react';
import { MentalHealthAnalysis } from '../../../lib/mentalHealthCalculations';

interface MentalHealthWidgetProps {
    mentalHealthA?: MentalHealthAnalysis;
    mentalHealthB?: MentalHealthAnalysis;
    chartAName?: string;
    chartBName?: string;
}

export const MentalHealthWidget: React.FC<MentalHealthWidgetProps> = ({
    mentalHealthA,
    mentalHealthB,
    chartAName = 'Partner A',
    chartBName
}) => {
    const [activePartner, setActivePartner] = useState<'A' | 'B'>('A');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const data = activePartner === 'A' ? mentalHealthA : mentalHealthB;
    const name = activePartner === 'A' ? chartAName : chartBName;

    if (!data) return null;

    const toggleCategory = (cat: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(cat)) next.delete(cat); else next.add(cat);
            return next;
        });
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'high': return 'bg-red-500';
            case 'elevated': return 'bg-amber-500';
            case 'moderate': return 'bg-yellow-500';
            default: return 'bg-green-500';
        }
    };

    const getRiskBg = (level: string) => {
        switch (level) {
            case 'high': return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30';
            case 'elevated': return 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30';
            case 'moderate': return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/30';
            default: return 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30';
        }
    };

    const getWellbeingColor = (wb: string) => {
        switch (wb) {
            case 'vulnerable': return 'text-red-600 dark:text-red-400';
            case 'needs_attention': return 'text-amber-600 dark:text-amber-400';
            case 'moderate': return 'text-yellow-600 dark:text-yellow-400';
            default: return 'text-green-600 dark:text-green-400';
        }
    };

    const getWellbeingLabel = (wb: string) => {
        switch (wb) {
            case 'vulnerable': return 'Vulnerable';
            case 'needs_attention': return 'Needs Attention';
            case 'moderate': return 'Moderate';
            default: return 'Strong';
        }
    };

    const getCategoryDescription = (cat: string) => {
        switch (cat) {
            case 'depression': return 'Analyzes Moon, 4th House (Inner Happiness), and Saturnine impacts on emotional vitality.';
            case 'anxiety': return 'Checks Mercury (Nerves), Moon (Mind), and Ra/Ke axis for restlessness and fear-based patterns.';
            case 'personality': return 'Examines Rashi vs Navamsa duality and afflictions to the 1st House (Self).';
            case 'psychotic_dissociative': return 'Scans for severe Ketu/Rahu afflictions on the Moon and Mercury, indicating extreme dualities.';
            case 'emotional_stability': return 'Core assessment of Sun (Soul), Moon (Mind), and Lagna (Physical Self) strength.';
            default: return 'General psychological pattern analysis.';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                        <Brain className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Mental Health & Psychology</h2>
                        <p className="text-teal-100 leading-relaxed">
                            Astrological pattern indicators for emotional and psychological tendencies. These insights
                            help understand each partner's inner landscape and how it influences the relationship.
                        </p>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 transition-colors">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-800 dark:text-amber-200 transition-colors">{data.disclaimer}</p>
                </div>
            </div>

            {/* Partner Toggle */}
            {chartBName && (
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => { setActivePartner('A'); setExpandedCategories(new Set()); }}
                        className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activePartner === 'A'
                            ? 'bg-white dark:bg-gray-600 text-teal-600 dark:text-teal-300 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                    >
                        {chartAName}
                    </button>
                    <button
                        onClick={() => { setActivePartner('B'); setExpandedCategories(new Set()); }}
                        className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activePartner === 'B'
                            ? 'bg-white dark:bg-gray-600 text-teal-600 dark:text-teal-300 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                    >
                        {chartBName}
                    </button>
                </div>
            )}

            {/* Overall Wellbeing */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors">
                        {name}'s Overall Mental Wellbeing
                    </h3>
                    <span className={`text-2xl font-bold ${getWellbeingColor(data.overallWellbeing)}`}>
                        {getWellbeingLabel(data.overallWellbeing)}
                    </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{data.summary}</p>
            </div>

            {/* Category Cards */}
            <div className="space-y-3">
                {data.categories.map((cat) => (
                    <div key={cat.category} className={`rounded-xl border transition-colors ${getRiskBg(cat.riskLevel)}`}>
                        <button
                            onClick={() => toggleCategory(cat.category)}
                            className="w-full p-4 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{cat.icon}</span>
                                <div className="group relative text-left">
                                    <div className="flex items-center gap-1.5">
                                        <p className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">{cat.label}</p>
                                        <Info className="w-3 h-3 text-gray-400 group-hover:text-teal-500 transition-colors" />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{cat.indicators.length} indicator(s) found</p>
                                    <div className="absolute z-10 bottom-full left-0 mb-2 w-56 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        {getCategoryDescription(cat.category)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${getRiskColor(cat.riskLevel)}`}>
                                    {cat.riskLevel}
                                </span>
                                {expandedCategories.has(cat.category) ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </button>

                        {expandedCategories.has(cat.category) && (
                            <div className="px-4 pb-4 space-y-3">
                                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{cat.interpretation}</p>
                                {cat.indicators.map((ind, j) => (
                                    <div key={j} className="p-3 bg-white dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-sm text-gray-800 dark:text-gray-100 transition-colors">{ind.name}</span>
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase text-white ${ind.severity === 'severe' ? 'bg-red-500' : ind.severity === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
                                                }`}>{ind.severity}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors">{ind.description}</p>
                                        <div className="flex gap-1.5 mt-2">
                                            {ind.involvedPlanets.map((p, k) => (
                                                <span key={k} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-[10px] text-gray-600 dark:text-gray-400 rounded transition-colors">{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Emotional Strengths */}
            {data.emotionalStrengths.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors">
                            Emotional Strengths & Protective Factors
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {data.emotionalStrengths.map((s, i) => (
                            <div key={i} className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800/30 transition-colors">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm text-green-800 dark:text-green-200 transition-colors">{s.name}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase text-white ${s.strength === 'strong' ? 'bg-green-600' : s.strength === 'moderate' ? 'bg-green-500' : 'bg-green-400'
                                        }`}>{s.strength}</span>
                                </div>
                                <p className="text-xs text-green-700 dark:text-green-300 transition-colors">{s.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
