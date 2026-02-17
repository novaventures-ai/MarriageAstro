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
    const [expandedPatterns, setExpandedPatterns] = useState<Set<number>>(new Set());

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
            case 'pre_marital': return 'bg-pink-50 dark:bg-pink-900/10 border-pink-200 dark:border-pink-800/30';
            case 'affair_context': return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30';
            case 'spouse_longevity': return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30';
            default: return 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800/30';
        }
    };

    const getCategoryLabel = (cat: string) => {
        switch (cat) {
            case 'pre_marital': return 'Pre-Marital';
            case 'affair_context': return 'Affair Context';
            case 'spouse_longevity': return 'Spouse Longevity';
            default: return 'Style';
        }
    };

    const getCategoryLabelColor = (cat: string) => {
        switch (cat) {
            case 'pre_marital': return 'bg-pink-500';
            case 'affair_context': return 'bg-red-500';
            case 'spouse_longevity': return 'bg-blue-500';
            default: return 'bg-indigo-500';
        }
    };

    const getCategoryDescription = (cat: string) => {
        switch (cat) {
            case 'pre_marital': return '5th House analysis covering romantic history, intense attractions, and soul-level pre-marital connections.';
            case 'affair_context': return '7th/12th House interlinks identifying environmental or psychological triggers for external attractions.';
            case 'spouse_longevity': return '8th house and Mangalya Bhava assessment focusing on the long-term health and vitality of the spouse.';
            default: return '2nd House (Family Boundaries), Family Taboos, and Subconscious Relationship Orientations.';
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
                            Analyzes historical romantic patterns, affair vulnerabilities by context, and
                            relationship style tendencies from the birth chart.
                        </p>
                    </div>
                </div>
            </div>

            {/* Partner Toggle */}
            {nameB && (
                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => { setActivePartner('A'); setExpandedPatterns(new Set()); }}
                        className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activePartner === 'A'
                            ? 'bg-white dark:bg-gray-600 text-rose-600 dark:text-rose-300 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                    >
                        {nameA}
                    </button>
                    <button
                        onClick={() => { setActivePartner('B'); setExpandedPatterns(new Set()); }}
                        className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activePartner === 'B'
                            ? 'bg-white dark:bg-gray-600 text-rose-600 dark:text-rose-300 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                    >
                        {nameB}
                    </button>
                </div>
            )}

            {/* Overall Risk */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors">{name}'s Pattern Overview</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase text-white ${data.overallRiskLevel === 'high' ? 'bg-red-500' :
                        data.overallRiskLevel === 'elevated' ? 'bg-amber-500' :
                            data.overallRiskLevel === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}>{data.overallRiskLevel} risk</span>
                </div>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div className="group relative p-3 bg-pink-50 dark:bg-pink-900/10 rounded-lg transition-colors cursor-help">
                        <div className="flex items-center gap-1.5 mb-1">
                            <p className="font-medium text-pink-800 dark:text-pink-200">Pre-Marital</p>
                            <Info className="w-3 h-3 text-pink-400" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">{data.preMaritalSummary}</p>
                        <div className="absolute z-10 bottom-full left-0 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {getCategoryDescription('pre_marital')}
                        </div>
                    </div>
                    <div className="group relative p-3 bg-red-50 dark:bg-red-900/10 rounded-lg transition-colors cursor-help">
                        <div className="flex items-center gap-1.5 mb-1">
                            <p className="font-medium text-red-800 dark:text-red-200">Affair Context</p>
                            <Info className="w-3 h-3 text-red-400" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">{data.affairContextSummary}</p>
                        <div className="absolute z-10 bottom-full left-0 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {getCategoryDescription('affair_context')}
                        </div>
                    </div>
                    <div className="group relative p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg transition-colors cursor-help">
                        <div className="flex items-center gap-1.5 mb-1">
                            <p className="font-medium text-indigo-800 dark:text-indigo-200">Style</p>
                            <Info className="w-3 h-3 text-indigo-400" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">{data.relationshipStyleSummary}</p>
                        <div className="absolute z-10 bottom-full left-0 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {getCategoryDescription('style')}
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
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border-l-4 border-emerald-400 transition-colors">
                                        <p className="text-xs text-emerald-800 dark:text-emerald-200 transition-colors">
                                            <strong>Guidance:</strong> {pat.advice}
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
        </div>
    );
};
