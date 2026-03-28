import React, { useState } from 'react';
import {
    Heart,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Shield,
    Info
} from 'lucide-react';
import { RelationshipPatternAnalysis } from '../../../lib/relationshipPatternCalculations';
import { AIPatternAnalyzer } from '../ai/AIPatternAnalyzer';

interface RelationshipPatternWidgetProps {
    patternA?: RelationshipPatternAnalysis;
    patternB?: RelationshipPatternAnalysis;
    nameA?: string;
    nameB?: string;
}

export const RelationshipPatternWidget: React.FC<RelationshipPatternWidgetProps> = ({
    patternA,
    patternB,
    nameA = 'Partner A',
    nameB
}) => {
    const [activePartner, setActivePartner] = useState<'A' | 'B'>('A');
    const [expandedPatterns, setExpandedPatterns] = useState<Set<number>>(new Set([0, 1]));

    const data = activePartner === 'A' ? patternA : patternB;
    const name = activePartner === 'A' ? nameA : nameB;

    if (!data) return null;

    const togglePattern = (idx: number) => {
        setExpandedPatterns(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx); else next.add(idx);
            return next;
        });
    };

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'narrative_history': return 'bg-pink-50 dark:bg-pink-900/10 border-pink-200 dark:border-pink-800/30';
            case 'opportunity_triggers': return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30';
            case 'spouse_longevity': return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30';
            case 'capacity_approach': return 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800/30';
            default: return 'bg-gray-50 dark:bg-gray-900/10 border-gray-200 dark:border-gray-800/30';
        }
    };

    const getCategoryLabel = (cat: string) => {
        switch (cat) {
            case 'narrative_history': return 'Narrative History';
            case 'opportunity_triggers': return 'Vulnerability Triggers';
            case 'spouse_longevity': return 'Spouse Longevity';
            case 'capacity_approach': return 'Capacity & Approach';
            default: return 'Rel. Pattern';
        }
    };

    const getCategoryLabelColor = (cat: string) => {
        switch (cat) {
            case 'narrative_history': return 'bg-pink-500';
            case 'opportunity_triggers': return 'bg-red-500';
            case 'spouse_longevity': return 'bg-blue-500';
            case 'capacity_approach': return 'bg-indigo-500';
            default: return 'bg-gray-500';
        }
    };

    const getCategoryDescription = (cat: string) => {
        switch (cat) {
            case 'narrative_history': return 'Indicates romantic capacity and past relationship experiences (The Journey).';
            case 'opportunity_triggers': return 'Specific environments where emotional connections are most likely to form (The Road).';
            case 'spouse_longevity': return '8th house and Mangalya Bhava assessment focusing on long-term health.';
            case 'capacity_approach': return 'Psychological approach to commitment, stability, and intensity (The Driver).';
            default: return 'Core relationship pattern and psychological profile.';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                        <Heart className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Relationship Pattern Analyzer</h2>
                        <p className="text-rose-100 leading-relaxed">
                            Analyzes historical romantic capacity, specific environmental triggers, and
                            psychological approach to commitment.
                        </p>
                    </div>
                </div>
            </div>

            {/* Partner Toggle */}
            {nameB && (
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => { setActivePartner('A'); setExpandedPatterns(new Set([0, 1])); }}
                        className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activePartner === 'A'
                            ? 'bg-white dark:bg-gray-600 text-rose-600 dark:text-rose-300 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                    >
                        {nameA}
                    </button>
                    <button
                        onClick={() => { setActivePartner('B'); setExpandedPatterns(new Set([0, 1])); }}
                        className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activePartner === 'B'
                            ? 'bg-white dark:bg-gray-600 text-rose-600 dark:text-rose-300 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                    >
                        {nameB}
                    </button>
                </div>
            )}

            {/* Karma Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Pattern Count</p>
                    <p className="text-2xl font-bold text-rose-500">{data.patterns.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {data.patterns.filter(p => p.severity === 'severe').length > 0 ? `${data.patterns.filter(p => p.severity === 'severe').length} severe` : 'No severe patterns'}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Risk Level</p>
                    <p className={`text-2xl font-bold capitalize ${data.overallRiskLevel === 'high' ? 'text-red-500' : data.overallRiskLevel === 'elevated' ? 'text-amber-500' : data.overallRiskLevel === 'moderate' ? 'text-yellow-500' : 'text-green-500'}`}>
                        {data.overallRiskLevel}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Overall assessment</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Primary Driver</p>
                    <p className="text-sm font-bold text-pink-600 dark:text-pink-400 leading-tight">
                        {data.patterns.find(p => p.severity === 'severe' || p.severity === 'moderate')?.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Balanced'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Dominant pattern type</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Stabilizers</p>
                    <p className="text-2xl font-bold text-indigo-500">{data.patterns.filter(p => p.counterBalance).length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Patterns with counter</p>
                </div>
            </div>

            {/* Overall Risk & Narrative */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors">{name}'s Pattern Profile</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase text-white ${data.overallRiskLevel === 'high' ? 'bg-red-500' :
                        data.overallRiskLevel === 'elevated' ? 'bg-amber-500' :
                            data.overallRiskLevel === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}>{data.overallRiskLevel} Risk</span>
                </div>

                {/* Narrative Synthesis */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                        <span className="font-semibold not-italic text-pink-600 dark:text-pink-400">Narrative: </span>
                        {data.narrativeHistorySummary}
                        <span className="mx-2">•</span>
                        <span className="font-semibold not-italic text-indigo-600 dark:text-indigo-400">Capacity: </span>
                        {data.capacityApproachSummary}
                        <span className="mx-2">•</span>
                        <span className="font-semibold not-italic text-red-600 dark:text-red-400">Opportunity: </span>
                        {data.opportunityTriggersSummary}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div className="group relative p-3 bg-pink-50 dark:bg-pink-900/10 rounded-lg transition-colors cursor-help border border-pink-100 dark:border-pink-900/30">
                        <div className="flex items-center gap-1.5 mb-1">
                            <p className="font-bold text-pink-800 dark:text-pink-200">Narrative History</p>
                            <Info className="w-3 h-3 text-pink-400" />
                        </div>
                        <p className="text-[10px] text-pink-600/70 dark:text-pink-400/70 font-semibold mb-2 uppercase tracking-wider">Internal Experiences</p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">{data.narrativeHistorySummary}</p>
                        <div className="absolute z-10 bottom-full left-0 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {getCategoryDescription('narrative_history')}
                        </div>
                    </div>
                    <div className="group relative p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg transition-colors cursor-help border border-indigo-100 dark:border-indigo-900/30">
                        <div className="flex items-center gap-1.5 mb-1">
                            <p className="font-bold text-indigo-800 dark:text-indigo-200">Capacity & Approach</p>
                            <Info className="w-3 h-3 text-indigo-400" />
                        </div>
                        <p className="text-[10px] text-indigo-600/70 dark:text-indigo-400/70 font-semibold mb-2 uppercase tracking-wider">Psychological Driver</p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">{data.capacityApproachSummary}</p>
                        <div className="absolute z-10 bottom-full left-0 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {getCategoryDescription('capacity_approach')}
                        </div>
                    </div>
                    <div className="group relative p-3 bg-red-50 dark:bg-red-900/10 rounded-lg transition-colors cursor-help border border-red-100 dark:border-red-900/30">
                        <div className="flex items-center gap-1.5 mb-1">
                            <p className="font-bold text-red-800 dark:text-red-200">Opportunity Triggers</p>
                            <Info className="w-3 h-3 text-red-400" />
                        </div>
                        <p className="text-[10px] text-red-600/70 dark:text-red-400/70 font-semibold mb-2 uppercase tracking-wider">External Context</p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">{data.opportunityTriggersSummary}</p>
                        <div className="absolute z-10 bottom-full left-0 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {getCategoryDescription('opportunity_triggers')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pattern Cards */}
            {data.patterns.length > 0 ? (
                <div className="space-y-3">
                    {data.patterns.map((pat, i) => (
                        <div key={i} className={`rounded-xl border transition-colors ${getCategoryColor(pat.category)}`}>
                            <button onClick={() => togglePattern(i)} className="w-full p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="text-left">
                                        <p className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">{pat.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase text-white ${getCategoryLabelColor(pat.category)}`}>
                                                {getCategoryLabel(pat.category)}
                                            </span>
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase text-white ${pat.severity === 'severe' ? 'bg-red-500' : pat.severity === 'moderate' ? 'bg-amber-500' : 'bg-green-500'
                                                }`}>{pat.severity}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-left leading-snug line-clamp-1">{pat.description}</p>
                                    </div>
                                </div>
                                {expandedPatterns.has(i) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </button>
                            {expandedPatterns.has(i) && (
                                <div className="px-4 pb-4 space-y-3">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">{pat.description}</p>
                                    <div className="space-y-1">
                                        {pat.indicators.map((ind, j) => (
                                            <div key={j} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 transition-colors">
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></span>
                                                {ind}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800/30 transition-colors">
                                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">💡 How to Break This Pattern</p>
                                        <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed transition-colors">{pat.advice}</p>
                                    </div>

                                    {/* Stabilizing Influence Section (Always Visible) */}
                                    <div className={`p-3 rounded-lg border-l-4 transition-colors ${pat.counterBalance ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-400' : 'bg-slate-50 dark:bg-slate-900/10 border-slate-300 dark:border-slate-700'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Shield className={`w-3 h-3 ${pat.counterBalance ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                                            <p className={`text-xs font-bold uppercase tracking-tighter ${pat.counterBalance ? 'text-indigo-800 dark:text-indigo-200' : 'text-slate-500 dark:text-slate-400'}`}>
                                                Stabilizing Influence: {pat.counterBalance ? pat.counterBalance.title : 'No Direct Counter Detected'}
                                            </p>
                                        </div>
                                        <p className={`text-[11px] leading-tight ${pat.counterBalance ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400 italic'}`}>
                                            {pat.counterBalance ? pat.counterBalance.text : 'No specific astrological neutralizer found for this pattern. The latent risk depends on personal values and environmental filters.'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-8 text-center border border-green-200 dark:border-green-800/30 transition-colors">
                    <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-green-800 dark:text-green-200 font-semibold transition-colors">No Significant Patterns Detected</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors">The chart shows a balanced approach to relationships.</p>
                </div>
            )}
            {/* AI Deep Dive */}
            <AIPatternAnalyzer patterns={data.patterns} profileName={name || (activePartner === 'A' ? 'Partner A' : 'Partner B')} />
        </div>
    );
};
