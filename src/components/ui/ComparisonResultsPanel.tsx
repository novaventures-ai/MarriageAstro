/**
 * ComparisonResultsPanel — displays ranked partner cards with category scores
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Trophy,
    Star,
    TrendingUp,
    TrendingDown,
    ChevronDown,
    ChevronUp,
    Eye,
    Trash2,
    AlertCircle,
} from 'lucide-react';
import { useComparisonStore } from '../../store/useComparisonStore';
import { useAppStore } from '../../store/useAppStore';
import type { PartnerComparisonEntry, CategoryScore, ComparisonLabel } from '../../../lib/comparisonScoring';

// ============================================================================
// LABEL COLORS
// ============================================================================

const LABEL_COLORS: Record<ComparisonLabel, string> = {
    'Excellent': 'from-emerald-500 to-green-500',
    'Strong': 'from-blue-500 to-indigo-500',
    'Moderate': 'from-amber-500 to-yellow-500',
    'Needs Attention': 'from-orange-500 to-red-400',
    'Challenging': 'from-red-500 to-rose-600',
};

const LABEL_BG: Record<ComparisonLabel, string> = {
    'Excellent': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    'Strong': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Moderate': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    'Needs Attention': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    'Challenging': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const CATEGORY_LABELS: Record<keyof CategoryScore, { label: string; icon: string }> = {
    traditional: { label: 'Traditional', icon: '📿' },
    relationship: { label: 'Relationship', icon: '💝' },
    risk: { label: 'Low Risk', icon: '🛡️' },
    intimacy: { label: 'Intimacy', icon: '🔥' },
    advanced: { label: 'Advanced', icon: '🔮' },
    timing: { label: 'Timing', icon: '⏰' },
};

// ============================================================================
// COMPONENT
// ============================================================================

export const ComparisonResultsPanel: React.FC = () => {
    const { comparisonProfile, comparisonError, removePartner, getPartnerReport } = useComparisonStore();
    const { setCurrentReport } = useAppStore();
    const navigate = useNavigate();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (!comparisonProfile) return null;

    const completedPartners = comparisonProfile.partners.filter((p) => p.status === 'complete');
    const failedPartners = comparisonProfile.partners.filter((p) => p.status === 'failed');

    if (completedPartners.length === 0 && failedPartners.length === 0) return null;

    const handleViewReport = (partner: PartnerComparisonEntry) => {
        const report = getPartnerReport(partner.id);
        if (report) {
            setCurrentReport(report);
            navigate('/report');
        }
    };

    const handleRemovePartner = (partnerId: string) => {
        removePartner(partnerId);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">
                    <Trophy className="w-6 h-6 inline-block mr-2 text-amber-500" />
                    Comparison Results
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                    {completedPartners.length} partner{completedPartners.length !== 1 ? 's' : ''} analyzed
                </span>
            </div>

            {/* Error banner */}
            {comparisonError && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl flex items-start gap-3 transition-colors">
                    <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-orange-700 dark:text-orange-300">{comparisonError}</p>
                </div>
            )}

            {/* Partner cards */}
            <div className="space-y-4">
                {comparisonProfile.partners.map((partner, index) => (
                    <PartnerCard
                        key={partner.id}
                        partner={partner}
                        rank={index + 1}
                        isExpanded={expandedId === partner.id}
                        onToggleExpand={() =>
                            setExpandedId(expandedId === partner.id ? null : partner.id)
                        }
                        onViewReport={() => handleViewReport(partner)}
                        onRemove={() => handleRemovePartner(partner.id)}
                        isTop={index === 0 && completedPartners.length > 1}
                    />
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// PARTNER CARD
// ============================================================================

interface PartnerCardProps {
    partner: PartnerComparisonEntry;
    rank: number;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onViewReport: () => void;
    onRemove: () => void;
    isTop: boolean;
}

const PartnerCard: React.FC<PartnerCardProps> = ({
    partner,
    rank,
    isExpanded,
    onToggleExpand,
    onViewReport,
    onRemove,
    isTop,
}) => {
    if (partner.status === 'failed') {
        return (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div>
                        <span className="font-medium text-red-700 dark:text-red-300">{partner.name}</span>
                        <p className="text-xs text-red-500 dark:text-red-400">{partner.error || 'Analysis failed'}</p>
                    </div>
                </div>
                <button
                    onClick={onRemove}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    title="Remove"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        );
    }

    if (partner.status !== 'complete' || !partner.score) return null;

    const { score } = partner;
    const labelColor = LABEL_COLORS[score.label];
    const labelBg = LABEL_BG[score.label];

    return (
        <div
            className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${isTop
                    ? 'border-amber-300 dark:border-amber-600 shadow-lg shadow-amber-100 dark:shadow-amber-900/20'
                    : 'border-gray-200 dark:border-gray-700 shadow-sm'
                } bg-white dark:bg-gray-800`}
        >
            {/* Top partner badge */}
            {isTop && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 text-xs font-bold rounded-bl-xl">
                    ⭐ TOP MATCH
                </div>
            )}

            {/* Main row */}
            <div className="p-5">
                <div className="flex items-center justify-between">
                    {/* Left: Rank + Name + Label */}
                    <div className="flex items-center gap-4">
                        {/* Rank circle */}
                        <div
                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${labelColor} flex items-center justify-center text-white font-bold text-lg shadow-md`}
                        >
                            {rank}
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors">
                                {partner.name}
                            </h3>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${labelBg} transition-colors`}>
                                {score.label} — {score.overall}%
                            </span>
                        </div>
                    </div>

                    {/* Right: Score + Actions */}
                    <div className="flex items-center gap-3">
                        {/* Overall score circle */}
                        <div className="relative w-16 h-16">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle
                                    cx="18" cy="18" r="15"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    className="text-gray-200 dark:text-gray-700"
                                />
                                <circle
                                    cx="18" cy="18" r="15"
                                    fill="none"
                                    strokeWidth="3"
                                    strokeDasharray={`${score.overall * 0.942} 100`}
                                    strokeLinecap="round"
                                    className={`${score.overall >= 65 ? 'text-emerald-500' :
                                            score.overall >= 50 ? 'text-amber-500' : 'text-red-500'
                                        }`}
                                    stroke="currentColor"
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800 dark:text-gray-100">
                                {score.overall}
                            </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={onViewReport}
                                className="p-1.5 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                title="View full report"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onRemove}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Remove"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Expand toggle */}
                        <button
                            onClick={onToggleExpand}
                            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        >
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Strengths / Weaknesses preview */}
                <div className="mt-3 flex flex-wrap gap-3">
                    {score.strengths.slice(0, 1).map((s, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                            <TrendingUp className="w-3 h-3" /> {s}
                        </span>
                    ))}
                    {score.weaknesses.slice(0, 1).map((w, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xs text-orange-500 dark:text-orange-400">
                            <TrendingDown className="w-3 h-3" /> {w}
                        </span>
                    ))}
                </div>
            </div>

            {/* Expanded category breakdown */}
            {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4 transition-colors">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 transition-colors">
                        Category Breakdown
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {(Object.entries(score.categories) as [keyof CategoryScore, number][]).map(
                            ([key, value]) => (
                                <CategoryBar key={key} category={key} value={value} />
                            )
                        )}
                    </div>

                    {/* All strengths & weaknesses */}
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                        <div>
                            <h5 className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                                <Star className="w-3 h-3" /> Strengths
                            </h5>
                            {score.strengths.map((s, i) => (
                                <p key={i} className="text-sm text-gray-600 dark:text-gray-400 transition-colors">• {s}</p>
                            ))}
                        </div>
                        <div>
                            <h5 className="text-xs font-medium text-orange-500 mb-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Areas to Watch
                            </h5>
                            {score.weaknesses.map((w, i) => (
                                <p key={i} className="text-sm text-gray-600 dark:text-gray-400 transition-colors">• {w}</p>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// CATEGORY BAR
// ============================================================================

const CategoryBar: React.FC<{ category: keyof CategoryScore; value: number }> = ({ category, value }) => {
    const info = CATEGORY_LABELS[category];
    const barColor =
        value >= 65 ? 'bg-emerald-500' :
            value >= 50 ? 'bg-amber-500' : 'bg-red-400';

    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400 transition-colors">
                    {info.icon} {info.label}
                </span>
                <span className="text-xs font-mono font-medium text-gray-700 dark:text-gray-300 transition-colors">
                    {value}%
                </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors">
                <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
};

export default ComparisonResultsPanel;
