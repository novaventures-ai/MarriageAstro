import React, { useState } from 'react';
import {
    Heart,
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

    const getCategoryDescription = (cat: string) => {
        switch (cat) {
            case 'narrative_history': return 'Indicates romantic capacity and past relationship experiences (The Journey).';
            case 'opportunity_triggers': return 'Specific environments where emotional connections are most likely to form (The Road).';
            case 'spouse_longevity': return '8th house and Mangalya Bhava assessment focusing on long-term health.';
            case 'capacity_approach': return 'Psychological approach to commitment, stability, and intensity (The Driver).';
            default: return 'Core relationship pattern and psychological profile.';
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

    // Left border color per severity
    const getSeverityBorderColor = (severity: string) => {
        switch (severity) {
            case 'severe': return 'border-l-4 border-l-red-400';
            case 'moderate': return 'border-l-4 border-l-amber-400';
            default: return 'border-l-4 border-l-green-400';
        }
    };

    // Badge color for PRIMARY/SECONDARY
    const getPatternBadge = (idx: number, severity: string) => {
        if (idx === 0 || severity === 'severe') {
            return { label: 'Primary Pattern', cls: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200' };
        }
        if (idx === 1 || severity === 'moderate') {
            return { label: 'Secondary Pattern', cls: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200' };
        }
        return { label: 'Mild Pattern', cls: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' };
    };

    // Heart emoji per category
    const getCategoryEmoji = (cat: string) => {
        switch (cat) {
            case 'narrative_history': return '💜';
            case 'opportunity_triggers': return '🔴';
            case 'spouse_longevity': return '💙';
            case 'capacity_approach': return '💛';
            default: return '💗';
        }
    };

    // Extract source planet tags from indicators
    const extractSourcePlanets = (indicators: string[]): string[] => {
        const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
        const houseRegex = /(\d+)(?:st|nd|rd|th)/g;
        const tags: string[] = [];
        indicators.forEach(ind => {
            planets.forEach(p => { if (ind.includes(p) && !tags.includes(p)) tags.push(p); });
            const matches = ind.match(houseRegex);
            if (matches) matches.forEach(m => { const tag = `${m} House`; if (!tags.includes(tag)) tags.push(tag); });
        });
        return tags.slice(0, 4);
    };

    const karmaIndicators = data.karmaIndicators || [];

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

            {/* Karma Indicator Cards (2x2 grid matching feature page) */}
            {karmaIndicators.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-3">
                    {karmaIndicators.map(k => {
                        const severityBorder = k.severity === 'high'
                            ? 'border-l-4 border-l-red-400'
                            : k.severity === 'moderate'
                                ? 'border-l-4 border-l-amber-400'
                                : 'border-l-4 border-l-green-400';
                        const severityBadge = k.severity === 'high'
                            ? { label: 'HIGH', cls: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' }
                            : k.severity === 'moderate'
                                ? { label: 'MODERATE', cls: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' }
                                : { label: 'LOW', cls: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' };
                        // For Pattern Break Potential, severity is inverted: high score = low severity = GOOD
                        const isBreakCard = k.label === 'Pattern Break Potential';
                        const displayBadge = isBreakCard
                            ? k.severity === 'low'
                                ? { label: 'HIGH POTENTIAL', cls: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' }
                                : k.severity === 'moderate'
                                    ? { label: 'MODERATE', cls: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' }
                                    : { label: 'NEEDS WORK', cls: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' }
                            : severityBadge;
                        return (
                            <div key={k.label} className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 ${severityBorder}`}>
                                <div className="flex items-start gap-3">
                                    <span className="text-xl flex-shrink-0">{k.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                            <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{k.label}</div>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${displayBadge.cls}`}>
                                                {displayBadge.label}
                                            </span>
                                        </div>
                                        <div className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">{k.value}</div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{k.note}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

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

            {/* Pattern Cards — feature-page demo style */}
            {data.patterns.length > 0 ? (
                <div className="space-y-4">
                    {data.patterns.map((pat, i) => {
                        const badge = getPatternBadge(i, pat.severity);
                        const sourcePlanets = extractSourcePlanets(pat.indicators);
                        const emoji = getCategoryEmoji(pat.category);
                        const borderColor = getSeverityBorderColor(pat.severity);
                        return (
                            <div key={i} className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 ${borderColor} transition-colors`}>
                                <button onClick={() => togglePattern(i)} className="w-full p-6 text-left">
                                    <div className="flex items-start gap-3 mb-2">
                                        <span className="text-2xl flex-shrink-0">{emoji}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="font-bold text-gray-900 dark:text-gray-100">{pat.name}</span>
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">Source:</span>
                                                {sourcePlanets.length > 0
                                                    ? sourcePlanets.map(p => (
                                                        <span key={p} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded">{p}</span>
                                                    ))
                                                    : <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 rounded capitalize">{getCategoryLabel(pat.category)}</span>
                                                }
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{pat.description}</p>
                                        </div>
                                        <div className="flex-shrink-0 mt-1">
                                            {expandedPatterns.has(i) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                        </div>
                                    </div>
                                </button>

                                {expandedPatterns.has(i) && (
                                    <div className="px-6 pb-6 space-y-3">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{pat.description}</p>
                                        <div className="space-y-1">
                                            {pat.indicators.map((ind, j) => (
                                                <div key={j} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></span>
                                                    {ind}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4">
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">How To Break This Pattern</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{pat.advice}</p>
                                        </div>
                                        {/* Stabilizing Influence */}
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
                        );
                    })}
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
