import React, { useState } from 'react';
import { YogaDoshaAnalysis, YogaDosha } from '../../../lib/yogaDoshaCalculations';
import { Shield, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Sparkles, Pill, Star } from 'lucide-react';
import { JargonTooltip } from '../ui/JargonTooltip';

interface YogaDoshaWidgetProps {
    partnerA: YogaDoshaAnalysis;
    partnerB: YogaDoshaAnalysis;
    nameA: string;
    nameB: string;
}

export const YogaDoshaWidget: React.FC<YogaDoshaWidgetProps> = ({
    partnerA, partnerB, nameA, nameB
}) => {
    const [activeProfile, setActiveProfile] = useState<'A' | 'B'>('A');
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const active = activeProfile === 'A' ? partnerA : partnerB;
    const activeName = activeProfile === 'A' ? nameA : nameB;

    const allItems = [...active.doshas, ...active.yogas];
    const presentItems = allItems.filter(i => i.present);
    const absentItems = allItems.filter(i => !i.present);
    const presentAuspicious = (active.auspiciousYogas || []).filter(y => y.present);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'mild': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
            case 'moderate': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700';
            case 'severe': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700';
        }
    };

    const getOverallColor = (sev: string) => {
        switch (sev) {
            case 'low': return 'text-green-600 dark:text-green-400';
            case 'moderate': return 'text-orange-600 dark:text-orange-400';
            case 'high': return 'text-red-600 dark:text-red-400';
            default: return 'text-gray-600 dark:text-gray-400';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'marriage': return <Shield className="w-4 h-4" />;
            case 'character': return <Star className="w-4 h-4" />;
            case 'health': return <Pill className="w-4 h-4" />;
            case 'karmic': return <Sparkles className="w-4 h-4" />;
            default: return <Shield className="w-4 h-4" />;
        }
    };

    const toggleCard = (name: string) => {
        setExpandedCard(expandedCard === name ? null : name);
    };

    const renderAuspiciousCard = (item: YogaDosha) => {
        const isExpanded = expandedCard === item.name;
        return (
            <div key={item.name} className="rounded-xl border border-amber-200 dark:border-amber-800/40 bg-white dark:bg-gray-800 overflow-hidden">
                <button
                    onClick={() => toggleCard(item.name)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                            <Star className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{item.name}</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                                    {item.severity}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                    {getTypeIcon(item.type)} {item.type}
                                </span>
                                <span className="text-[10px] font-bold uppercase text-amber-500">AUSPICIOUS</span>
                            </div>
                        </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-amber-100 dark:border-amber-800/30 pt-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item.description}</p>
                        {item.effects && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800/30">
                                <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                                    ✨ {item.effects}
                                </p>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Planets:</span>
                            {item.involvedPlanets.map(p => (
                                <span key={p} className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded text-xs font-medium">{p}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderCard = (item: YogaDosha) => {
        const isExpanded = expandedCard === item.name;

        return (
            <div
                key={item.name}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${item.present
                    ? 'border-red-200 dark:border-red-800/40 bg-white dark:bg-gray-800'
                    : 'border-green-200 dark:border-green-800/40 bg-white dark:bg-gray-800'
                    }`}
            >
                {/* Header */}
                <button
                    onClick={() => toggleCard(item.name)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.present
                            ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                            : 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
                            }`}>
                            {item.present ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm transition-colors">{item.name}</span>
                                {item.present && (
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getSeverityColor(item.severity)}`}>
                                        {item.severity}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    {getTypeIcon(item.type)} {item.type}
                                </span>
                                <span className={`text-[10px] font-bold uppercase ${item.present ? 'text-red-500' : 'text-green-500'}`}>
                                    {item.present ? 'DETECTED' : 'ABSENT'}
                                </span>
                            </div>
                        </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-gray-100 dark:border-gray-700 pt-3 transition-colors">
                        {/* Description */}
                        <div>
                            <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 transition-colors">Description</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-colors">{item.description}</p>
                        </div>

                        {/* Effects */}
                        {item.effects && (
                            <div>
                                <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 transition-colors">Effects on Marriage</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">{item.effects}</p>
                            </div>
                        )}

                        {/* Involved Planets */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 dark:text-gray-500 transition-colors">Planets:</span>
                            {item.involvedPlanets.map(p => (
                                <span key={p} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs font-medium transition-colors">{p}</span>
                            ))}
                        </div>

                        {/* Remedies */}
                        {item.remedies.length > 0 && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/15 rounded-lg border border-amber-100 dark:border-amber-800/30 transition-colors">
                                <h5 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2 transition-colors">Recommended Remedies</h5>
                                <ul className="space-y-1">
                                    {item.remedies.map((r, i) => (
                                        <li key={i} className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2 transition-colors">
                                            <span className="text-amber-500 mt-0.5">•</span> {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
                        <Sparkles className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                        Yoga & Dosha Analysis <JargonTooltip term="Yoga" className="ml-1" />
                    </h2>
                    <div className={`text-sm font-semibold capitalize ${getOverallColor(active.overallSeverity)}`}>
                        Overall: {active.overallSeverity} concern
                    </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors">{active.summary}</p>

                {/* Profile Toggle */}
                {nameB && (
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => setActiveProfile('A')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeProfile === 'A'
                                ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {nameA}
                        </button>
                        <button
                            onClick={() => setActiveProfile('B')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeProfile === 'B'
                                ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {nameB}
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Summary Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{presentItems.length}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Detected</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{absentItems.length}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Clear</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="text-2xl font-bold text-amber-500">{(active.auspiciousYogas || []).filter(y => y.present).length}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Auspicious</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{active.doshas.filter(d => d.present).length}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Doshas</div>
                </div>
            </div>

            {/* Auspicious Yogas Section */}
            {active.auspiciousYogas && active.auspiciousYogas.some(y => y.present) && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        Auspicious Yogas Detected
                    </h3>
                    <div className="space-y-3">
                        {active.auspiciousYogas.filter(y => y.present).map(item => renderAuspiciousCard(item))}
                    </div>
                </div>
            )}

            {/* Detected Items */}
            {presentItems.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2 transition-colors">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Detected in {activeName}'s Chart
                    </h3>
                    <div className="space-y-3">
                        {presentItems.map(item => renderCard(item))}
                    </div>
                </div>
            )}

            {/* Clear Items */}
            {absentItems.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2 transition-colors">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Clear in {activeName}'s Chart
                    </h3>
                    <div className="space-y-3">
                        {absentItems.map(item => renderCard(item))}
                    </div>
                </div>
            )}

            {/* Disclaimer */}
            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-colors">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed transition-colors">
                    <strong>Disclaimer:</strong> Yoga and dosha analysis provides pattern-based indications, not definitive predictions.
                    Multiple factors including free will, conscious effort, and remedial measures can significantly alter outcomes.
                    Always consult a qualified astrologer for personalized interpretation.
                </p>
            </div>
        </div>
    );
};

export default YogaDoshaWidget;
