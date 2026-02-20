import React, { useEffect, useState, useCallback } from 'react';
import { Chart } from '@types';
import { generateMatchInsight, MatchInsight, analyzeBestMatch } from '@lib/ai/matchInsight';
import { generateChartFromBirthData } from '@lib/reportGenerator';
import { generateCounselorExplanation, CounselorExplanation } from '@lib/ai/counselorExplanations';
import {
    Sparkles, Trophy, ArrowRight, Brain, AlertTriangle, CheckCircle, Info, X,
    Loader2, ChevronDown, ChevronUp, Heart, MessageCircle, Lightbulb, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CosmicMatchWidgetProps {
    selfChart: Chart | null;
    selfBirthData: any;
    partners: any[];
}

interface PartnerWithAnalysis {
    id: string;
    name: string;
    gender: string;
    dateOfBirth: string;
    timeOfBirth?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string | number;
    birthData: any;
    chart?: Chart;
    insight?: MatchInsight;
    isLoading: boolean;
    error?: string;
}

interface DetailedAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    match: MatchInsight | null;
    selfChart: Chart | null;
    partnerChart?: Chart;
    allMatches: MatchInsight[];
}

// Counselor content component
const CounselorContent: React.FC<{
    counselorData: CounselorExplanation;
    match: MatchInsight;
}> = ({ counselorData, match }) => {
    const [activeSection, setActiveSection] = useState<string>('why');

    const sections = [
        { id: 'why', label: 'Why This Match', icon: Heart },
        { id: 'counselor', label: 'AI Counselor Opinion', icon: MessageCircle },
        { id: 'risk', label: 'Risk Analysis', icon: AlertTriangle },
        { id: 'comparison', label: 'vs Others', icon: Target },
        { id: 'advice', label: 'Practical Advice', icon: Lightbulb },
    ];

    return (
        <div className="space-y-4">
            {/* Section tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {sections.map(section => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeSection === section.id
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                            }`}
                    >
                        <section.icon className="w-4 h-4" />
                        {section.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6">
                {activeSection === 'why' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                            <Heart className="w-5 h-5" />
                            Core Compatibility Rationale
                        </h3>
                        <div className="prose dark:prose-invert prose-sm max-w-none">
                            {counselorData.whyThisMatch.split('\n\n').map((paragraph, i) => (
                                <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                    {paragraph.split('**').map((part, j) =>
                                        j % 2 === 0 ? part : <strong key={j} className="text-indigo-700 dark:text-indigo-400 font-bold">{part}</strong>
                                    )}
                                </p>
                            ))}
                        </div>

                        {counselorData.successFactors.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    Pillars of Relationship Success
                                </h4>
                                <div className="space-y-3">
                                    {counselorData.successFactors.map((factor, i) => (
                                        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-2 h-2 rounded-full mt-2 ${factor.impact === 'critical' ? 'bg-red-500' :
                                                    factor.impact === 'major' ? 'bg-yellow-500' :
                                                        'bg-green-500'
                                                    }`} />
                                                <div>
                                                    <h5 className="font-bold text-gray-900 dark:text-gray-100">
                                                        {factor.factor}
                                                        <span className="ml-2 text-[10px] uppercase px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium">
                                                            {factor.impact} IMPACT
                                                        </span>
                                                    </h5>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        {factor.explanation.split('**').map((part, j) =>
                                                            j % 2 === 0 ? part : <strong key={j} className="text-gray-900 dark:text-gray-100">{part}</strong>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 italic font-medium">
                                                        {factor.astrologicalBasis}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'counselor' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            AI Counselor's Professional Verdict
                        </h3>
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border-l-4 border-purple-500">
                            <div className="prose dark:prose-invert prose-sm max-w-none">
                                {counselorData.counselorOpinion.split('\n\n').map((paragraph, i) => (
                                    <div key={i} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                                        {paragraph.startsWith('###') ? (
                                            <h4 className="text-lg font-bold text-purple-800 dark:text-purple-300 mt-6 mb-2">{paragraph.replace('### ', '')}</h4>
                                        ) : paragraph.startsWith('####') ? (
                                            <h5 className="text-base font-bold text-purple-700 dark:text-purple-400 mt-4 mb-1">{paragraph.replace('#### ', '')}</h5>
                                        ) : paragraph.startsWith('*') ? (
                                            <li className="ml-4 list-none mb-1">
                                                {paragraph.split('**').map((part, j) =>
                                                    j % 2 === 0 ? part.replace('* ', '• ') : <strong key={j} className="text-purple-700 dark:text-purple-400 font-bold">{part}</strong>
                                                )}
                                            </li>
                                        ) : (
                                            paragraph.split('**').map((part, j) =>
                                                j % 2 === 0 ? part : <strong key={j} className="text-purple-700 dark:text-purple-400 font-bold">{part}</strong>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {counselorData.longTermOutlook && (
                            <div className="mt-8">
                                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-indigo-500" />
                                    Forecasted Relationship Trajectory
                                </h4>
                                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-5 border border-indigo-100 dark:border-indigo-900/30">
                                    <div className="prose dark:prose-invert prose-sm max-w-none">
                                        {counselorData.longTermOutlook.split('\n\n').map((paragraph, i) => (
                                            <div key={i} className="mb-3">
                                                {paragraph.startsWith('###') ? (
                                                    <h5 className="font-bold text-gray-800 dark:text-gray-200">{paragraph.replace('### ', '')}</h5>
                                                ) : paragraph.startsWith('*') ? (
                                                    <div className="flex gap-2 items-start mt-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {paragraph.split('**').map((part, j) =>
                                                                j % 2 === 0 ? part.replace('* ', '') : <strong key={j} className="text-indigo-700 dark:text-indigo-400">{part}</strong>
                                                            )}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                        {paragraph.split('**').map((part, j) =>
                                                            j % 2 === 0 ? part : <strong key={j} className="text-indigo-700 dark:text-indigo-400">{part}</strong>
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'risk' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-red-900 dark:text-red-300 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Risk Assessment Analysis
                        </h3>

                        {/* Risk Priority Notice */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                <strong>Priority Factors:</strong> This analysis prioritizes Nadi Dosha (health/progeny),
                                Divorce Risk, and Infidelity Risk as the most critical compatibility factors per your requirements.
                            </p>
                        </div>

                        {/* Nadi Dosha Check */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                Nadi Dosha Analysis (Priority #1)
                            </h4>
                            <div className="space-y-3">
                                {match.challenges.some((c: string) => c.includes('Nadi')) ? (
                                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500">
                                        <p className="text-red-800 dark:text-red-300 font-medium mb-2">
                                            ⚠️ Nadi Dosha Detected
                                        </p>
                                        <p className="text-sm text-red-700 dark:text-red-400">
                                            Same Nadi type detected between partners. This is considered inauspicious
                                            for health and progeny matters according to Vedic astrology.
                                        </p>
                                        <p className="text-sm text-red-600 dark:text-red-500 mt-2">
                                            <strong>Impact:</strong> May affect physical health, vitality, and child-bearing capabilities.
                                        </p>
                                        <div className="mt-3 p-2 bg-white dark:bg-gray-900 rounded text-xs text-gray-600">
                                            <strong>Recommendation:</strong> Consider remedial measures or consult with a knowledgeable astrologer before proceeding.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-l-4 border-green-500">
                                        <p className="text-green-800 dark:text-green-300 font-medium mb-2">
                                            ✅ No Nadi Dosha
                                        </p>
                                        <p className="text-sm text-green-700 dark:text-green-400">
                                            Different Nadi types detected. This is excellent for health compatibility
                                            and progeny matters.
                                        </p>
                                        <p className="text-sm text-green-600 dark:text-green-500 mt-2">
                                            <strong>Impact:</strong> Harmonious health compatibility and good prospects for healthy offspring.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Divorce Risk Assessment */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                Divorce Risk Assessment (Priority #2)
                            </h4>
                            <div className="space-y-3">
                                {(() => {
                                    // Use actual raw risk data from engine, not match.score heuristic
                                    const divorceRisk = match.aiAnalysis?.riskFactors?.find(
                                        (r: any) => r.type?.toLowerCase().includes('stability') || r.type?.toLowerCase().includes('divorce')
                                    );
                                    // categoryScores.risk = 100 - rawDivorceScore, so rawScore = 100 - risk
                                    const rawDivorceScore = match.aiAnalysis?.categoryScores?.risk != null
                                        ? 100 - match.aiAnalysis.categoryScores.risk
                                        : null;
                                    // Determine level from engine riskFactors first, then from raw score
                                    const riskLevel = divorceRisk?.level
                                        || (rawDivorceScore != null
                                            ? (rawDivorceScore > 50 ? 'high' : rawDivorceScore > 30 ? 'medium' : 'low')
                                            : (match.score >= 70 ? 'low' : match.score >= 50 ? 'medium' : 'high'));

                                    if (riskLevel === 'low') {
                                        return (
                                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-l-4 border-green-500">
                                                <p className="text-green-800 dark:text-green-300 font-medium mb-2">
                                                    ✅ Low Divorce Risk {rawDivorceScore != null && <span className="text-xs font-normal ml-1">(Raw Score: {rawDivorceScore}%)</span>}
                                                </p>
                                                <p className="text-sm text-green-700 dark:text-green-400">
                                                    Strong compatibility indicators with minimal separation risk.
                                                    The planetary alignments support long-term stability.
                                                </p>
                                            </div>
                                        );
                                    } else if (riskLevel === 'medium') {
                                        return (
                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border-l-4 border-yellow-500">
                                                <p className="text-yellow-800 dark:text-yellow-300 font-medium mb-2">
                                                    ⚠️ Moderate Divorce Risk {rawDivorceScore != null && <span className="text-xs font-normal ml-1">(Raw Score: {rawDivorceScore}%)</span>}
                                                </p>
                                                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                                    Moderate risk indicators detected. Conscious effort in communication
                                                    and understanding will be important for long-term stability.
                                                </p>
                                                {divorceRisk?.indicators && divorceRisk.indicators.length > 0 && (
                                                    <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-500">
                                                        <strong>Key Indicators:</strong> {divorceRisk.indicators.slice(0, 3).join('; ')}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500">
                                                <p className="text-red-800 dark:text-red-300 font-medium mb-2">
                                                    🚨 Higher Divorce Risk {rawDivorceScore != null && <span className="text-xs font-normal ml-1">(Raw Score: {rawDivorceScore}%)</span>}
                                                </p>
                                                <p className="text-sm text-red-700 dark:text-red-400">
                                                    Multiple challenging factors present. Requires careful consideration
                                                    and potentially significant effort to maintain stability.
                                                </p>
                                                {divorceRisk?.indicators && divorceRisk.indicators.length > 0 && (
                                                    <div className="mt-2 text-xs text-red-600 dark:text-red-500">
                                                        <strong>Key Indicators:</strong> {divorceRisk.indicators.slice(0, 3).join('; ')}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        </div>

                        {/* Infidelity Risk Assessment */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                Trust & Loyalty Assessment (Priority #3)
                            </h4>
                            <div className="space-y-3">
                                {(() => {
                                    // Use actual risk data from engine for infidelity
                                    const infidelityRisk = match.aiAnalysis?.riskFactors?.find(
                                        (r: any) => r.type?.toLowerCase().includes('trust') || r.type?.toLowerCase().includes('loyalty') || r.type?.toLowerCase().includes('infidelity')
                                    );
                                    // Also check categoryScores for intimacy as a proxy
                                    const riskLevel = infidelityRisk?.level || 'low';
                                    // Extract raw score from description (format: "... (Raw: XX%)")
                                    const rawScoreMatch = infidelityRisk?.description?.match(/Raw:\s*(\d+)%/);
                                    const rawScore = rawScoreMatch ? rawScoreMatch[1] : null;

                                    if (riskLevel === 'high') {
                                        return (
                                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500">
                                                <p className="text-red-800 dark:text-red-300 font-medium mb-2">
                                                    🚨 Higher Infidelity Risk {rawScore && <span className="text-xs font-normal opacity-75">(Raw Score: {rawScore}%)</span>}
                                                </p>
                                                <p className="text-sm text-red-700 dark:text-red-400">
                                                    Significant trust vulnerability indicators detected. Active effort
                                                    in building and maintaining trust is critically important.
                                                </p>
                                                {infidelityRisk?.indicators && infidelityRisk.indicators.length > 0 && (
                                                    <div className="mt-2 text-xs text-red-600 dark:text-red-500">
                                                        <strong>Key Indicators:</strong> {infidelityRisk.indicators.slice(0, 3).join('; ')}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    } else if (riskLevel === 'medium') {
                                        return (
                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border-l-4 border-yellow-500">
                                                <p className="text-yellow-800 dark:text-yellow-300 font-medium mb-2">
                                                    ⚠️ Moderate Trust Concerns {rawScore && <span className="text-xs font-normal opacity-75">(Raw Score: {rawScore}%)</span>}
                                                </p>
                                                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                                    Some vulnerability indicators present. Active trust-building through
                                                    transparency and consistency will be important.
                                                </p>
                                                {infidelityRisk?.indicators && infidelityRisk.indicators.length > 0 && (
                                                    <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-500">
                                                        <strong>Key Indicators:</strong> {infidelityRisk.indicators.slice(0, 3).join('; ')}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-l-4 border-green-500">
                                                <p className="text-green-800 dark:text-green-300 font-medium mb-2">
                                                    ✅ Strong Trust Foundation
                                                </p>
                                                <p className="text-sm text-green-700 dark:text-green-400">
                                                    No significant vulnerability indicators. Partners are likely
                                                    to remain committed through challenges.
                                                </p>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        </div>

                        {/* Overall Risk Summary */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-5 border border-indigo-200 dark:border-indigo-800">
                            <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-3">
                                Overall Risk Profile
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className={`text-2xl font-bold ${match.challenges.some((c: string) => c.includes('Nadi'))
                                        ? 'text-red-600'
                                        : 'text-green-600'
                                        }`}>
                                        {match.challenges.some((c: string) => c.includes('Nadi')) ? '⚠️' : '✅'}
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Nadi Dosha</p>
                                </div>
                                {(() => {
                                    // Use engine risk data for summary grid too
                                    const divorceRisk = match.aiAnalysis?.riskFactors?.find(
                                        (r: any) => r.type?.toLowerCase().includes('stability') || r.type?.toLowerCase().includes('divorce')
                                    );
                                    const rawDivorceScore = match.aiAnalysis?.categoryScores?.risk != null
                                        ? 100 - match.aiAnalysis.categoryScores.risk
                                        : null;
                                    const divorceLevel = divorceRisk?.level
                                        || (rawDivorceScore != null
                                            ? (rawDivorceScore > 50 ? 'high' : rawDivorceScore > 30 ? 'medium' : 'low')
                                            : 'low');
                                    const label = divorceLevel === 'high' ? 'High' : divorceLevel === 'medium' ? 'Moderate' : 'Low';
                                    const color = divorceLevel === 'high' ? 'text-red-600' : divorceLevel === 'medium' ? 'text-yellow-600' : 'text-green-600';
                                    return (
                                        <div className="text-center">
                                            <div className={`text-2xl font-bold ${color}`}>{label}</div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Divorce Risk</p>
                                        </div>
                                    );
                                })()}
                                {(() => {
                                    const infidelityRisk = match.aiAnalysis?.riskFactors?.find(
                                        (r: any) => r.type?.toLowerCase().includes('trust') || r.type?.toLowerCase().includes('loyalty') || r.type?.toLowerCase().includes('infidelity')
                                    );
                                    const infidelityLevel = infidelityRisk?.level || 'low';
                                    const label = infidelityLevel === 'high' ? 'High' : infidelityLevel === 'medium' ? 'Moderate' : 'Low';
                                    const color = infidelityLevel === 'high' ? 'text-red-600' : infidelityLevel === 'medium' ? 'text-yellow-600' : 'text-green-600';
                                    return (
                                        <div className="text-center">
                                            <div className={`text-2xl font-bold ${color}`}>{label}</div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Infidelity Risk</p>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {counselorData.compatibilityStory && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    Your Compatibility Story
                                </h4>
                                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {counselorData.compatibilityStory.split('\n\n').map((paragraph, i) => (
                                        <div key={i} className="mb-3 last:mb-0">
                                            {paragraph.startsWith('###') ? (
                                                <h4 className="text-base font-bold text-purple-900 dark:text-purple-300 mb-2 mt-2">{paragraph.replace('### ', '')}</h4>
                                            ) : paragraph.startsWith('####') ? (
                                                <h5 className="text-sm font-bold text-purple-800 dark:text-purple-400 mb-1 mt-1">{paragraph.replace('#### ', '')}</h5>
                                            ) : (
                                                paragraph.split('**').map((part, j) =>
                                                    j % 2 === 0 ? part : <strong key={j} className="text-purple-700 dark:text-purple-400 font-bold">{part}</strong>
                                                )
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'comparison' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Comparison with Other Matches
                        </h3>

                        {counselorData.comparisonWithOthers.length > 0 ? (
                            <div className="space-y-3">
                                {counselorData.comparisonWithOthers.map((comparison, i) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                vs {comparison.partnerName}
                                            </span>
                                            <span className="text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                                {comparison.score}%
                                            </span>
                                        </div>
                                        <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                                            ✓ {comparison.thisMatchAdvantage}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                            Key difference: {comparison.keyDifference}
                                        </p>
                                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                            → {comparison.recommendation}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No other matches to compare</p>
                        )}

                        {counselorData.otherMatchesShortcomings.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    What Other Matches Lack
                                </h4>
                                <div className="space-y-2">
                                    {counselorData.otherMatchesShortcomings.map((shortcoming, i) => (
                                        <div key={i} className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-red-900 dark:text-red-300">
                                                    {shortcoming.partnerName}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded ${shortcoming.severity === 'dealbreaker' ? 'bg-red-200 text-red-800' :
                                                    shortcoming.severity === 'concerning' ? 'bg-yellow-200 text-yellow-800' :
                                                        'bg-orange-200 text-orange-800'
                                                    }`}>
                                                    {shortcoming.severity}
                                                </span>
                                            </div>
                                            <p className="text-sm text-red-700 dark:text-red-400">
                                                Missing: {shortcoming.lackingFactor}
                                            </p>
                                            <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                                                Impact: {shortcoming.impact}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'advice' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-300 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5" />
                            Practical Relationship Advice
                        </h3>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm">
                            <div className="space-y-4">
                                {counselorData.practicalAdvice.map((advice, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-yellow-600">{i + 1}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {advice.split('**').map((part, j) =>
                                                j % 2 === 0 ? part : <strong key={j} className="text-yellow-700 dark:text-yellow-400">{part}</strong>
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DetailedAnalysisModal: React.FC<DetailedAnalysisModalProps> = ({
    isOpen,
    onClose,
    match,
    selfChart,
    partnerChart,
    allMatches
}) => {
    if (!isOpen || !match || !selfChart || !partnerChart) return null;

    const analysis = match.aiAnalysis;
    const [activeTab, setActiveTab] = useState<'overview' | 'counselor' | 'strengths' | 'challenges' | 'evidence'>('counselor');

    // Generate counselor explanation
    const counselorData = React.useMemo(() => {
        return generateCounselorExplanation(
            selfChart,
            partnerChart,
            match.partnerName,
            match,
            allMatches,
            analysis?.rankingFactors || []
        );
    }, [selfChart, partnerChart, match, allMatches, analysis]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                                Match Analysis: {match.partnerName}
                            </h2>
                            <p className="text-white/80 text-sm">
                                AI-Powered Comprehensive Compatibility Report
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Score Display */}
                    <div className="mt-4 flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">
                            <span className="text-3xl font-bold text-white">{match.score}%</span>
                            <span className="text-white/80 text-sm ml-2">Match Score</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">
                            <span className={`text-lg font-semibold ${match.verdict === 'Excellent' ? 'text-green-300' :
                                match.verdict === 'Good' ? 'text-blue-300' :
                                    match.verdict === 'Average' ? 'text-yellow-300' :
                                        'text-red-300'
                                }`}>
                                {match.verdict}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                    {(['counselor', 'overview', 'strengths', 'challenges', 'evidence'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
                                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                }`}
                        >
                            {tab === 'counselor' ? '🤖 AI Counselor' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {activeTab === 'counselor' && (
                        <CounselorContent counselorData={counselorData} match={match} />
                    )}

                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            {/* Executive Summary */}
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                                <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
                                    <Brain className="w-5 h-5" />
                                    Executive Summary
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                    {analysis?.explanationData?.executiveSummary || match.reason}
                                </p>
                            </div>

                            {/* Category Scores */}
                            {analysis?.categoryScores && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                        Compatibility Breakdown
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(analysis.categoryScores).map(([key, score]) => (
                                            <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </span>
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                        {score}%
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${score >= 70 ? 'bg-green-500' :
                                                            score >= 50 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                            }`}
                                                        style={{ width: `${score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Compatibility Signature */}
                            {analysis?.compatibilitySignature && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                        Relationship Profile
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(analysis.compatibilitySignature).map(([key, value]) => (
                                            <div key={key} className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-500 dark:text-gray-400 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                </span>
                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'strengths' && (
                        <div className="space-y-3">
                            {match.strengths.length > 0 ? (
                                match.strengths.map((strength: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-green-900 dark:text-green-300">
                                                {strength}
                                            </h4>
                                            {analysis?.strengthAreas?.[i]?.description && (
                                                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                                                    {analysis.strengthAreas[i].description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">No major strengths identified</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'challenges' && (
                        <div className="space-y-3">
                            {match.challenges.length > 0 ? (
                                match.challenges.map((challenge: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-red-900 dark:text-red-300">
                                                {challenge}
                                            </h4>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-green-600">
                                    <CheckCircle className="w-12 h-12 mb-2" />
                                    <p>No significant challenges identified</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'evidence' && (
                        <div className="space-y-4">
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-4">
                                <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                                    Astrological Technical Evidence
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Specific technical indicators used to calculate this compatibility score.
                                </p>
                            </div>

                            {analysis?.explanationData?.astrologicalEvidence && analysis.explanationData.astrologicalEvidence.length > 0 ? (
                                <div className="space-y-3">
                                    {analysis.explanationData.astrologicalEvidence.map((ev: any, i: number) => (
                                        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-bold text-gray-900 dark:text-gray-100">{ev.category}</h5>
                                                <span className="text-[10px] uppercase tracking-wider bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">Technical Marker</span>
                                            </div>
                                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium mb-1">{ev.evidence}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-mono">{ev.technicalDetails}</p>
                                            <div className="text-xs text-purple-700 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/10 p-2 rounded italic">
                                                {ev.interpretation}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Technical evidence points are being calculated based on the full planetary dataset.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        AI Analysis based on comprehensive astrological calculations
                    </p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Rest of the CosmicMatchWidget component...
export const CosmicMatchWidget: React.FC<CosmicMatchWidgetProps> = ({ selfChart, selfBirthData, partners }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<MatchInsight | null>(null);
    const [selectedPartnerChart, setSelectedPartnerChart] = useState<Chart | undefined>(undefined);
    const [partnerAnalyses, setPartnerAnalyses] = useState<PartnerWithAnalysis[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [bestMatch, setBestMatch] = useState<PartnerWithAnalysis | null>(null);
    const [expandedPartner, setExpandedPartner] = useState<string | null>(null);

    // Automatically analyze all partners when component mounts
    useEffect(() => {
        if (!selfChart || partners.length === 0) return;

        const analyzeAllPartners = async () => {
            setIsAnalyzing(true);

            const partnersWithCharts: { id: string; name: string; chart: Chart; birthData: any }[] = [];
            const analyses: PartnerWithAnalysis[] = []; // Initial state with loading

            // 1. Prepare charts
            for (const partner of partners) {
                const partnerAnalysis: PartnerWithAnalysis = {
                    id: partner.id,
                    name: partner.name,
                    gender: partner.gender,
                    dateOfBirth: partner.dateOfBirth,
                    timeOfBirth: partner.timeOfBirth,
                    location: partner.location,
                    latitude: partner.latitude,
                    longitude: partner.longitude,
                    timezone: partner.timezone,
                    birthData: partner,
                    isLoading: true
                };

                try {
                    let partnerChart = partner.chart;

                    if (!partnerChart) {
                        let dateOfBirth = partner.dateOfBirth;
                        if (typeof dateOfBirth === 'string') {
                            dateOfBirth = new Date(dateOfBirth);
                        }

                        const birthData: any = {
                            name: partner.name,
                            gender: partner.gender,
                            dateOfBirth: dateOfBirth,
                            timeOfBirth: partner.timeOfBirth || '12:00',
                            location: partner.location || 'Unknown',
                            latitude: Number(partner.latitude) || 0,
                            longitude: Number(partner.longitude) || 0,
                            timezone: String(partner.timezone || 5.5)
                        };

                        partnerChart = await generateChartFromBirthData(birthData);
                    }

                    if (partnerChart) {
                        partnerAnalysis.chart = partnerChart;
                        partnersWithCharts.push({ id: partner.id, name: partner.name, chart: partnerChart, birthData: partner });
                    } else {
                        partnerAnalysis.error = 'Failed to generate chart';
                    }
                } catch (error) {
                    console.error(`Error generating chart for ${partner.name}:`, error);
                    partnerAnalysis.error = error instanceof Error ? error.message : 'Unknown error';
                }

                analyses.push(partnerAnalysis);
            }
            setPartnerAnalyses([...analyses]);

            try {
                // 2. Run Comprehensive Analysis (Batch)
                if (partnersWithCharts.length > 0 && selfChart) {
                    const candidates = partnersWithCharts.map(p => ({ id: p.id, name: p.name, chart: p.chart }));
                    const { bestMatch, allMatches } = await analyzeBestMatch(selfChart, candidates);

                    // 3. Map results back
                    const finalAnalyses = analyses.map(analysis => {
                        const match = allMatches.find(m => m.partnerId === analysis.id);
                        // Keep error if chart generation failed, otherwise use match result
                        if (analysis.error) return { ...analysis, isLoading: false };

                        return {
                            ...analysis,
                            insight: match,
                            isLoading: false,
                            error: match ? undefined : 'Analysis failed'
                        };
                    });

                    setPartnerAnalyses(finalAnalyses);

                    if (bestMatch) {
                        const best = finalAnalyses.find(p => p.id === bestMatch.partnerId);
                        if (best) setBestMatch(best);
                    }
                } else {
                    // No valid charts to analyze
                    setPartnerAnalyses(analyses.map(a => ({ ...a, isLoading: false })));
                }

            } catch (error) {
                console.error("Batch Analysis failed", error);
                setPartnerAnalyses(analyses.map(a => ({
                    ...a,
                    isLoading: false,
                    error: a.error || 'AI Analysis Failed'
                })));
            } finally {
                setIsAnalyzing(false);
            }
        };

        analyzeAllPartners();
    }, [selfChart, partners]);

    const handleExplainClick = (partner: PartnerWithAnalysis) => {
        if (partner.insight && partner.chart) {
            setSelectedMatch(partner.insight);
            setSelectedPartnerChart(partner.chart);
            setIsModalOpen(true);
        }
    };

    const analyzeSinglePartner = async (partnerId: string) => {
        const partner = partnerAnalyses.find(p => p.id === partnerId);
        if (!partner || !selfChart) return;

        setPartnerAnalyses(prev => prev.map(p =>
            p.id === partnerId ? { ...p, isLoading: true, error: undefined } : p
        ));

        try {
            let partnerChart = partner.chart;

            if (!partnerChart) {
                const birthData: any = {
                    name: partner.name,
                    gender: partner.gender,
                    dateOfBirth: new Date(partner.dateOfBirth),
                    timeOfBirth: partner.birthData?.timeOfBirth || partner.timeOfBirth || '12:00',
                    location: partner.birthData?.location || partner.location || 'Unknown',
                    latitude: Number(partner.birthData?.latitude || partner.latitude) || 0,
                    longitude: Number(partner.birthData?.longitude || partner.longitude) || 0,
                    timezone: String(partner.birthData?.timezone || partner.timezone || 5.5)
                };

                partnerChart = await generateChartFromBirthData(birthData);
            }

            if (partnerChart) {
                const insight = await generateMatchInsight(selfChart, partnerChart, partner.name, partner.id);

                setPartnerAnalyses(prev => {
                    const updated = prev.map(p =>
                        p.id === partnerId ? { ...p, chart: partnerChart, insight, isLoading: false } : p
                    );

                    const completed = updated.filter(p => p.insight);
                    if (completed.length > 0) {
                        const best = completed.reduce((prev, current) =>
                            (prev.insight!.score > current.insight!.score) ? prev : current
                        );
                        setBestMatch(best);
                    }

                    return updated;
                });
            } else {
                setPartnerAnalyses(prev => prev.map(p =>
                    p.id === partnerId ? { ...p, error: 'Failed to generate chart', isLoading: false } : p
                ));
            }
        } catch (error) {
            console.error(`Error analyzing partner ${partner.name}:`, error);
            setPartnerAnalyses(prev => prev.map(p =>
                p.id === partnerId ? { ...p, error: 'Analysis failed', isLoading: false } : p
            ));
        }
    };

    const togglePartnerDetails = (partnerId: string) => {
        setExpandedPartner(expandedPartner === partnerId ? null : partnerId);
    };

    if (!selfChart) {
        return (
            <div className="mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg p-1">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 h-full backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                            Cosmic Insight
                        </h3>
                    </div>
                    <div className="text-center py-8">
                        <p className="text-gray-600 dark:text-gray-300">Create your profile to see AI matchmaking analysis</p>
                    </div>
                </div>
            </div>
        );
    }

    if (partners.length === 0) {
        return (
            <div className="mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg p-1">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 h-full backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                            Cosmic Insight
                        </h3>
                    </div>

                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-purple-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                            AI Matchmaking Ready
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md mb-4">
                            Add partners to your dashboard to see AI-powered compatibility analysis and find your best match.
                        </p>
                        <button
                            onClick={() => navigate('/add-partner')}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                        >
                            Add Your First Partner
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg p-1">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 h-full backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                            Cosmic Insight
                        </h3>

                        <div className="ml-auto flex items-center gap-2">
                            {isAnalyzing && (
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Analyzing...
                                </span>
                            )}

                            {!isAnalyzing && partnerAnalyses.length > 0 && (
                                <button
                                    onClick={() => {
                                        // Clear current analyses and re-run
                                        setPartnerAnalyses([]);
                                        setBestMatch(null);
                                        // Trigger re-analysis by resetting and running again
                                        const analyzeAllPartners = async () => {
                                            setIsAnalyzing(true);
                                            const analyses: PartnerWithAnalysis[] = [];

                                            for (const partner of partners) {
                                                const partnerAnalysis: PartnerWithAnalysis = {
                                                    id: partner.id,
                                                    name: partner.name,
                                                    gender: partner.gender,
                                                    dateOfBirth: partner.dateOfBirth,
                                                    timeOfBirth: partner.timeOfBirth,
                                                    location: partner.location,
                                                    latitude: partner.latitude,
                                                    longitude: partner.longitude,
                                                    timezone: partner.timezone,
                                                    birthData: partner,
                                                    isLoading: true
                                                };

                                                analyses.push(partnerAnalysis);
                                                setPartnerAnalyses([...analyses]);

                                                try {
                                                    let partnerChart = partner.chart;

                                                    if (!partnerChart) {
                                                        let dateOfBirth = partner.dateOfBirth;
                                                        if (typeof dateOfBirth === 'string') {
                                                            dateOfBirth = new Date(dateOfBirth);
                                                        }

                                                        const birthData: any = {
                                                            name: partner.name,
                                                            gender: partner.gender,
                                                            dateOfBirth: dateOfBirth,
                                                            timeOfBirth: partner.timeOfBirth || '12:00',
                                                            location: partner.location || 'Unknown',
                                                            latitude: Number(partner.latitude) || 0,
                                                            longitude: Number(partner.longitude) || 0,
                                                            timezone: String(partner.timezone || 5.5)
                                                        };

                                                        partnerChart = await generateChartFromBirthData(birthData);
                                                    }

                                                    if (partnerChart && selfChart) {
                                                        const insight = await generateMatchInsight(selfChart, partnerChart, partner.name, partner.id);
                                                        partnerAnalysis.chart = partnerChart;
                                                        partnerAnalysis.insight = insight;
                                                    } else {
                                                        partnerAnalysis.error = 'Failed to generate chart';
                                                    }
                                                } catch (error) {
                                                    console.error(`Error analyzing partner ${partner.name}:`, error);
                                                    partnerAnalysis.error = error instanceof Error ? error.message : 'Unknown error';
                                                } finally {
                                                    partnerAnalysis.isLoading = false;
                                                }

                                                setPartnerAnalyses([...analyses]);
                                            }

                                            const completedAnalyses = analyses.filter(p => p.insight);
                                            if (completedAnalyses.length > 0) {
                                                const best = completedAnalyses.reduce((prev, current) =>
                                                    (prev.insight!.score > current.insight!.score) ? prev : current
                                                );
                                                setBestMatch(best);
                                            }

                                            setIsAnalyzing(false);
                                        };
                                        analyzeAllPartners();
                                    }}
                                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center gap-1"
                                    title="Refresh analysis after adding/removing partners"
                                >
                                    <Loader2 className="w-3 h-3" />
                                    Refresh
                                </button>
                            )}

                            {!isAnalyzing && partnerAnalyses.some(p => p.error) && (
                                <button
                                    onClick={() => {
                                        partnerAnalyses.filter(p => p.error).forEach(p => analyzeSinglePartner(p.id));
                                    }}
                                    className="px-3 py-1 text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-md transition-all flex items-center gap-1"
                                >
                                    <Brain className="w-3 h-3" />
                                    Calculate All
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Best Match Section */}
                    {bestMatch?.insight && (
                        <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">
                                    BEST MATCH
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 items-start">
                                <div className="flex-1">
                                    <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                        {bestMatch.name}
                                    </h4>

                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold text-sm">
                                            {bestMatch.insight.score}% Match
                                            <span className="text-xs font-normal opacity-75 ml-1">({bestMatch.insight.rawScore}/36 Gunas)</span>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium text-sm">
                                            {bestMatch.insight.verdict}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                                        {bestMatch.insight.reason}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {bestMatch.insight.strengths.slice(0, 3).map((strength: string, i: number) => (
                                            <span key={i} className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs rounded border border-green-100 dark:border-green-800 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                {strength}
                                            </span>
                                        ))}
                                        {bestMatch.insight.challenges.length > 0 && (
                                            <span className="px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded border border-red-100 dark:border-red-800 flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" />
                                                {bestMatch.insight.challenges.length} Challenge{bestMatch.insight.challenges.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 w-full md:w-auto">
                                    <button
                                        onClick={() => handleExplainClick(bestMatch)}
                                        className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
                                    >
                                        <Brain className="w-4 h-4" />
                                        Explain Match
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* All Partners List */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            All Partners ({partnerAnalyses.length})
                        </h4>

                        <div className="space-y-2">
                            {partnerAnalyses.map((partner) => (
                                <div
                                    key={partner.id}
                                    className={`border rounded-lg transition-all ${bestMatch?.id === partner.id
                                        ? 'border-yellow-400 bg-yellow-50/30 dark:bg-yellow-900/10'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                                        }`}
                                >
                                    <div
                                        className="p-3 flex items-center justify-between cursor-pointer"
                                        onClick={() => togglePartnerDetails(partner.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${bestMatch?.id === partner.id
                                                ? 'bg-yellow-100 text-yellow-600'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                }`}>
                                                {partner.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                                    {partner.name}
                                                    {bestMatch?.id === partner.id && (
                                                        <Trophy className="w-3 h-3 text-yellow-500" />
                                                    )}
                                                </h5>
                                                {partner.isLoading ? (
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                        Analyzing...
                                                    </span>
                                                ) : partner.insight ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                            {partner.insight.score}%
                                                        </span>
                                                        <span className={`text-xs px-1.5 py-0.5 rounded ${partner.insight.verdict === 'Excellent' ? 'bg-green-100 text-green-700' :
                                                            partner.insight.verdict === 'Good' ? 'bg-blue-100 text-blue-700' :
                                                                partner.insight.verdict === 'Average' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-red-100 text-red-700'
                                                            }`}>
                                                            {partner.insight.verdict}
                                                        </span>
                                                    </div>
                                                ) : partner.error ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-red-500 font-medium">Failed to analyze</span>
                                                        <span className="text-xs text-red-400" title={partner.error}>
                                                            {partner.error.length > 30 ? partner.error.substring(0, 30) + '...' : partner.error}
                                                        </span>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {partner.insight && partner.chart && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleExplainClick(partner);
                                                    }}
                                                    className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors flex items-center gap-1"
                                                >
                                                    <Brain className="w-3 h-3" />
                                                    Explain Match
                                                </button>
                                            )}
                                            {partner.error && !partner.isLoading && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        analyzeSinglePartner(partner.id);
                                                    }}
                                                    className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors flex items-center gap-1"
                                                >
                                                    <Loader2 className="w-3 h-3" />
                                                    Retry
                                                </button>
                                            )}
                                            {expandedPartner === partner.id ? (
                                                <ChevronUp className="w-4 h-4 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedPartner === partner.id && (
                                        <div className="px-3 pb-3 border-t border-gray-100 dark:border-gray-800 pt-3">
                                            {partner.insight ? (
                                                <>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                                        {partner.insight.reason}
                                                    </p>

                                                    <div className="flex flex-wrap gap-2">
                                                        {partner.insight.strengths.map((strength: string, i: number) => (
                                                            <span key={i} className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs rounded">
                                                                ✓ {strength}
                                                            </span>
                                                        ))}
                                                        {partner.insight.challenges.map((challenge: string, i: number) => (
                                                            <span key={i} className="px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded">
                                                                ⚠ {challenge}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="mt-3 flex gap-2">
                                                        {partner.chart && (
                                                            <button
                                                                onClick={() => handleExplainClick(partner)}
                                                                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all"
                                                            >
                                                                View Full Analysis
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => navigate(`/quick-compare/${partner.id}`)}
                                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                                                        >
                                                            Compare
                                                            <ArrowRight className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </>
                                            ) : partner.error ? (
                                                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                                                    <h6 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-2">
                                                        Error Details
                                                    </h6>
                                                    <p className="text-xs text-red-700 dark:text-red-400 mb-3 font-mono break-all">
                                                        {partner.error}
                                                    </p>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                                        <p className="font-medium mb-1">Partner Data:</p>
                                                        <ul className="space-y-1 ml-2">
                                                            <li>• Name: {partner.name}</li>
                                                            <li>• Gender: {partner.gender}</li>
                                                            <li>• DOB: {partner.dateOfBirth}</li>
                                                            <li>• Time: {partner.timeOfBirth || 'Not set'}</li>
                                                            <li>• Location: {partner.location || 'Not set'}</li>
                                                            <li>• Lat/Lng: {partner.latitude}, {partner.longitude}</li>
                                                            <li>• Timezone: {partner.timezone}</li>
                                                        </ul>
                                                    </div>
                                                    <button
                                                        onClick={() => analyzeSinglePartner(partner.id)}
                                                        disabled={partner.isLoading}
                                                        className="w-full px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
                                                    >
                                                        {partner.isLoading ? 'Retrying...' : 'Retry Analysis'}
                                                    </button>
                                                </div>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <DetailedAnalysisModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedPartnerChart(undefined);
                }}
                match={selectedMatch}
                selfChart={selfChart}
                partnerChart={selectedPartnerChart}
                allMatches={partnerAnalyses.filter(p => p.insight).map(p => p.insight!)}
            />
        </>
    );
};
