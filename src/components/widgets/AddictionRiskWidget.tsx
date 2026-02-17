import React, { useState } from 'react';
import { AddictionRiskAnalysis, AddictionCategory, AddictionIndicator, AddictionProtectiveFactor } from '../../../lib/addictionCalculations';
import { ShieldAlert, ChevronDown, ChevronUp, Shield, AlertTriangle, Info } from 'lucide-react';

interface AddictionRiskWidgetProps {
    partnerA: AddictionRiskAnalysis;
    partnerB: AddictionRiskAnalysis;
    nameA?: string;
    nameB?: string;
}

export const AddictionRiskWidget: React.FC<AddictionRiskWidgetProps> = ({
    partnerA,
    partnerB,
    nameA = 'Partner A',
    nameB = 'Partner B'
}) => {
    const [selectedPartner, setSelectedPartner] = useState<'A' | 'B'>('A');
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const analysis = selectedPartner === 'A' ? partnerA : partnerB;
    const activeName = selectedPartner === 'A' ? nameA : nameB;

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'very_high': return 'text-red-600 dark:text-red-400';
            case 'high': return 'text-orange-600 dark:text-orange-400';
            case 'moderate': return 'text-amber-600 dark:text-amber-400';
            case 'low': return 'text-green-600 dark:text-green-400';
            case 'very_low': return 'text-emerald-600 dark:text-emerald-400';
            default: return 'text-gray-600 dark:text-gray-400';
        }
    };

    const getRiskBg = (level: string) => {
        switch (level) {
            case 'very_high': return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30';
            case 'high': return 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/30';
            case 'moderate': return 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30';
            case 'low': return 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30';
            case 'very_low': return 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30';
            default: return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
        }
    };

    const getBarColor = (score: number) => {
        if (score >= 70) return 'bg-red-500';
        if (score >= 50) return 'bg-orange-500';
        if (score >= 30) return 'bg-amber-500';
        if (score >= 10) return 'bg-green-500';
        return 'bg-emerald-400';
    };

    const getOverallBadge = (risk: string) => {
        switch (risk) {
            case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/50';
            case 'moderate': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50';
            default: return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/50';
        }
    };

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'high': return 'bg-red-500 text-white';
            case 'moderate': return 'bg-amber-500 text-white';
            default: return 'bg-green-500 text-white';
        }
    };

    const getCategoryDescription = (cat: string) => {
        switch (cat) {
            case 'sex_addiction': return 'Analyzes Venus-Mars-Rahu connections affecting the 8th (Secrecy) and 12th (Bed Pleasures) houses.';
            case 'alcohol_substance': return 'Checks Moon (Mind) afflictions from Rahu/Ketu and associations with the 6th or 8th house lords.';
            case 'drug_addiction': return 'Scans for severe Neptune/Rahu impacts on the 2nd house (Food/Intake) and 12th house (Escape).';
            case 'compulsive_behavior': return 'Monitors Mercury (Neural stability) and Rahu (Obsession) for repetitive behavioral patterns.';
            case 'neptune_western': return 'Evaluates Western Neptune-Moon-Sun aspects for tendencies toward emotional escapism.';
            default: return 'Astrological risk pattern analysis.';
        }
    };

    const renderIndicator = (indicator: AddictionIndicator, idx: number) => (
        <div key={idx} className={`p-3 rounded-lg border transition-colors ${indicator.present
            ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30'
            : 'bg-gray-50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-800/30'
            }`}>
            <div className="flex items-start justify-between gap-2 mb-1">
                <span className={`text-sm font-medium transition-colors ${indicator.present ? 'text-red-800 dark:text-red-200' : 'text-gray-600 dark:text-gray-400'}`}>
                    {indicator.present ? '⚠️' : '✅'} {indicator.name}
                </span>
                {indicator.present && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getSeverityBadge(indicator.severity)}`}>
                        {indicator.severity}
                    </span>
                )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 transition-colors">{indicator.description}</p>
            {indicator.present && indicator.contributingFactors.length > 0 && (
                <div className="mt-2 space-y-0.5">
                    {indicator.contributingFactors.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-red-700 dark:text-red-300 transition-colors">
                            <span className="w-1 h-1 bg-red-400 rounded-full flex-shrink-0"></span>
                            {f}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderCategory = (cat: AddictionCategory) => {
        const isExpanded = expandedCategory === cat.category;
        const activeIndicators = cat.indicators.filter(i => i.present);

        return (
            <div key={cat.category} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors">
                <button
                    onClick={() => setExpandedCategory(isExpanded ? null : cat.category)}
                    className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                    <span className="text-2xl">{cat.icon}</span>
                    <div className="flex-1 text-left">
                        <div className="group relative flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100 transition-colors uppercase tracking-tight text-sm">{cat.label}</h4>
                            <Info className="w-3 h-3 text-gray-400 group-hover:text-rose-500 transition-colors cursor-help" />
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getRiskColor(cat.riskLevel)}`}>
                                {cat.riskLevel.replace('_', ' ')}
                            </span>
                            <div className="absolute z-10 bottom-full left-0 mb-2 w-56 p-2 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {getCategoryDescription(cat.category)}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(cat.riskScore)}`}
                                    style={{ width: `${cat.riskScore}%` }}
                                ></div>
                            </div>
                            <span className={`text-xs font-bold min-w-[32px] text-right transition-colors ${getRiskColor(cat.riskLevel)}`}>
                                {cat.riskScore}%
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {activeIndicators.length > 0 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                                {activeIndicators.length}/{cat.indicators.length}
                            </span>
                        )}
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                </button>

                {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-gray-100 dark:border-gray-700 pt-3 transition-colors">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 transition-colors">{cat.interpretation}</p>
                        {cat.indicators.map((ind, idx) => renderIndicator(ind, idx))}
                    </div>
                )}
            </div>
        );
    };

    const renderProtectiveFactor = (factor: AddictionProtectiveFactor, idx: number) => (
        <div key={idx} className={`p-3 rounded-lg border transition-colors ${factor.present
            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30'
            : 'bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700'
            }`}>
            <div className="flex items-center gap-2 mb-1">
                <Shield className={`w-4 h-4 ${factor.present ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                <span className={`text-sm font-medium transition-colors ${factor.present ? 'text-green-800 dark:text-green-200' : 'text-gray-500 dark:text-gray-400'}`}>
                    {factor.name}
                </span>
                {factor.present && (
                    <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold uppercase ${factor.strength === 'strong' ? 'bg-green-500 text-white' :
                        factor.strength === 'moderate' ? 'bg-green-400 text-white' :
                            'bg-green-300 text-green-800'
                        }`}>
                        {factor.strength}
                    </span>
                )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 ml-6 transition-colors">{factor.description}</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Addiction & Compulsion Risk Analysis</h2>
                        <p className="text-rose-100 leading-relaxed">
                            Astrological analysis of planetary patterns associated with addictive tendencies and compulsive behaviors.
                            This analysis covers both Vedic and Western indicators across multiple categories.
                        </p>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 transition-colors">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-800 dark:text-amber-200 transition-colors">{analysis.disclaimer}</p>
                </div>
            </div>

            {/* Partner Toggle */}
            <div className="flex justify-center">
                <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center gap-1 transition-colors">
                    <button
                        onClick={() => setSelectedPartner('A')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedPartner === 'A' ? 'bg-white dark:bg-gray-700 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        {nameA}
                    </button>
                    <button
                        onClick={() => setSelectedPartner('B')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedPartner === 'B' ? 'bg-white dark:bg-gray-700 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                        {nameB}
                    </button>
                </div>
            </div>

            {/* Overall Risk Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
                        <Info className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        Overall Assessment — {activeName}
                    </h3>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase border transition-colors ${getOverallBadge(analysis.overallRisk)}`}>
                        {analysis.overallRisk} risk
                    </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors">
                        <div
                            className={`h-full rounded-full transition-all duration-700 ${getBarColor(analysis.overallScore)}`}
                            style={{ width: `${analysis.overallScore}%` }}
                        ></div>
                    </div>
                    <span className={`text-lg font-bold transition-colors ${getRiskColor(analysis.overallRisk === 'high' ? 'high' : analysis.overallRisk === 'moderate' ? 'moderate' : 'low')}`}>
                        {analysis.overallScore}%
                    </span>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">{analysis.summary}</p>
            </div>

            {/* Risk Categories */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors">
                    Risk Categories — {activeName}
                </h3>
                {analysis.categories.map(cat => renderCategory(cat))}
            </div>

            {/* Protective Factors */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 mb-4 transition-colors">
                    <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                    Protective Factors — {activeName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors">
                    These planetary placements provide natural resistance against addictive patterns.
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                    {analysis.protectiveFactors.map((f, idx) => renderProtectiveFactor(f, idx))}
                </div>

                {/* Protective Summary Bar */}
                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-800/30 transition-colors">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-indigo-700 dark:text-indigo-300 transition-colors">
                            <strong>Protection Level:</strong>{' '}
                            {analysis.protectiveFactors.filter(f => f.present).length}/{analysis.protectiveFactors.length} factors active
                        </span>
                        <div className="flex gap-1 ml-auto">
                            {analysis.protectiveFactors.map((f, i) => (
                                <div key={i} className={`w-3 h-3 rounded-full transition-colors ${f.present ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddictionRiskWidget;
