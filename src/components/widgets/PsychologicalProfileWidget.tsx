import React, { useState } from 'react';
import { CompatibilityReport, PsychologicalProfile } from '../../types';
import { Brain, Heart, MessageCircle, Shield, Eye, RefreshCw, Compass, ChevronDown, Users } from 'lucide-react';

interface PsychologicalProfileWidgetProps {
    report: CompatibilityReport;
}

const attachmentColors: Record<string, string> = {
    secure: 'bg-green-500',
    anxious: 'bg-amber-500',
    avoidant: 'bg-blue-500',
    fearful: 'bg-red-500',
};

const attachmentBg: Record<string, string> = {
    secure: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    anxious: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    avoidant: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    fearful: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
};

function ProfileCard({ profile, name, color }: { profile: PsychologicalProfile; name: string; color: string }) {
    const [expanded, setExpanded] = useState<string | null>(null);

    const toggle = (id: string) => setExpanded(expanded === id ? null : id);

    const sections = [
        {
            id: 'attachment',
            icon: Heart,
            label: 'Attachment Style',
            accent: 'rose',
            content: (
                <div className="space-y-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${attachmentBg[profile.attachmentStyle.type]}`}>
                        <span className={`w-2.5 h-2.5 rounded-full ${attachmentColors[profile.attachmentStyle.type]}`} />
                        <span className="text-sm font-bold capitalize">{profile.attachmentStyle.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{profile.attachmentStyle.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Moon Sign</span>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">{profile.attachmentStyle.moonSign}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">4th House</span>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">{profile.attachmentStyle.fourthHouseAnalysis}</p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'communication',
            icon: MessageCircle,
            label: 'Communication Style',
            accent: 'indigo',
            content: (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Style</span>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">{profile.communicationStyle.style}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mercury</span>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">{profile.communicationStyle.mercuryPlacement}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Expression Method</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{profile.communicationStyle.expressionMethod}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Conflict Resolution</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{profile.communicationStyle.conflictResolution}</p>
                    </div>
                    {profile.communicationStyle.triggers.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {profile.communicationStyle.triggers.map((t, i) => (
                                <span key={i} className="px-2 py-1 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full uppercase tracking-wider">{t}</span>
                            ))}
                        </div>
                    )}
                </div>
            ),
        },
        {
            id: 'love',
            icon: Heart,
            label: 'Love Language',
            accent: 'pink',
            content: (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Primary</span>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">{profile.loveLanguage.primary}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Secondary</span>
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">{profile.loveLanguage.secondary}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Venus in {profile.loveLanguage.venusSign}</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{profile.loveLanguage.description}</p>
                    </div>
                </div>
            ),
        },
        {
            id: 'fears',
            icon: Eye,
            label: 'Core Fears',
            accent: 'amber',
            content: (
                <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Primary Fear</span>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">{profile.coreFears.primaryFear}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Rahu's Influence</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{profile.coreFears.rahuInfluence}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Manifestation</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{profile.coreFears.howItManifests}</p>
                    </div>
                </div>
            ),
        },
        {
            id: 'defense',
            icon: Shield,
            label: 'Defense Mechanisms',
            accent: 'slate',
            content: (
                <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mechanism</span>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">{profile.defenseMechanisms.mechanism}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Ketu's Influence</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{profile.defenseMechanisms.ketuInfluence}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Impact on Relationships</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{profile.defenseMechanisms.impactOnRelationships}</p>
                    </div>
                </div>
            ),
        },
        {
            id: 'patterns',
            icon: RefreshCw,
            label: 'Repeating Patterns',
            accent: 'purple',
            content: (
                <div className="space-y-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pattern</span>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">{profile.repeatingPatterns.pattern}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">5th House</span>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{profile.repeatingPatterns.fifthHouseInfluence}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Venus Cycles</span>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{profile.repeatingPatterns.venusCycles}</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-lg p-3 border border-purple-100 dark:border-purple-800/30">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500">How To Break It</span>
                        <p className="text-xs text-purple-700 dark:text-purple-300 mt-1 font-medium">{profile.repeatingPatterns.howToBreakIt}</p>
                    </div>
                </div>
            ),
        },
        {
            id: 'landscape',
            icon: Compass,
            label: 'Mental Landscape',
            accent: 'teal',
            content: (
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'Core Fear', value: profile.mentalLandscape.coreFear, color: 'red' },
                        { label: 'Defense', value: profile.mentalLandscape.defenseMechanism, color: 'amber' },
                        { label: 'Blind Spot', value: profile.mentalLandscape.blindSpot, color: 'orange' },
                        { label: 'Growth Area', value: profile.mentalLandscape.growthArea, color: 'green' },
                    ].map((item) => (
                        <div key={item.label} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.label}</span>
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">{item.value}</p>
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-3">
            {/* Name Header */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r ${color}`}>
                <Brain className="w-5 h-5 text-white" />
                <h3 className="text-white font-black text-sm uppercase tracking-wider">{name}</h3>
            </div>

            {/* Accordion Sections */}
            {sections.map((section) => {
                const isOpen = expanded === section.id;
                return (
                    <div
                        key={section.id}
                        className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all"
                    >
                        <button
                            onClick={() => toggle(section.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <section.icon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 flex-1 text-left">{section.label}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                            <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                {section.content}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export const PsychologicalProfileWidget: React.FC<PsychologicalProfileWidgetProps> = ({ report }) => {
    const profileA = report.psychologicalProfileA;
    const profileB = report.psychologicalProfileB;
    const [viewMode, setViewMode] = useState<'both' | 'partnerA' | 'partnerB'>('both');

    if (!profileA && !profileB) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                <Brain className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Psychological profile data not available for this report.</p>
            </div>
        );
    }

    const nameA = report.chartA.name;
    const nameB = report.chartB.name;

    // Compatibility insights (only shown in "both" mode)
    const attachmentMatch = profileA && profileB
        ? profileA.attachmentStyle.type === profileB.attachmentStyle.type
            ? 'Mirrored - both share the same attachment style, amplifying strengths and blind spots.'
            : profileA.attachmentStyle.type === 'secure' || profileB.attachmentStyle.type === 'secure'
                ? 'Stabilized - one partner\'s secure attachment anchors the dynamic.'
                : 'Complementary - different styles create growth opportunities but require conscious effort.'
        : null;

    const loveLanguageMatch = profileA && profileB
        ? profileA.loveLanguage.primary === profileB.loveLanguage.primary
            ? 'Naturally synced - you both speak the same primary love language.'
            : `Learning curve - ${nameA} gives love through "${profileA.loveLanguage.primary}" while ${nameB} prefers "${profileB.loveLanguage.primary}".`
        : null;

    const toggleOptions = [
        { id: 'partnerA' as const, label: nameA, available: !!profileA },
        { id: 'both' as const, label: 'Both', available: !!profileA && !!profileB },
        { id: 'partnerB' as const, label: nameB, available: !!profileB },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header Card with Toggle */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors border border-indigo-100 dark:border-indigo-900/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                            <Brain className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 dark:text-gray-100 tracking-tight">Psychological Profile</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Moon, Mercury, Venus & Shadow Planet Analysis</p>
                        </div>
                    </div>

                    {/* Segmented Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 gap-0.5 self-start sm:self-auto">
                        {toggleOptions.filter(o => o.available).map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setViewMode(opt.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${viewMode === opt.id
                                        ? opt.id === 'partnerA'
                                            ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/25'
                                            : opt.id === 'partnerB'
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/25'
                                                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-600/50'
                                    }`}
                            >
                                {opt.id === 'both' ? (
                                    <span className="flex items-center gap-1.5">
                                        <Users className="w-3 h-3" />
                                        Both
                                    </span>
                                ) : opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dynamic Insights Banner — only in "both" mode */}
            {viewMode === 'both' && attachmentMatch && loveLanguageMatch && (
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 opacity-80" />
                            <h4 className="font-black uppercase tracking-tight text-sm">Couple Dynamic Insights</h4>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Attachment Dynamic</span>
                                <p className="text-xs font-medium mt-1 leading-relaxed opacity-90">{attachmentMatch}</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Love Language</span>
                                <p className="text-xs font-medium mt-1 leading-relaxed opacity-90">{loveLanguageMatch}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Profiles */}
            {viewMode === 'both' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {profileA && (
                        <ProfileCard
                            profile={profileA}
                            name={nameA}
                            color="from-indigo-500 to-blue-600"
                        />
                    )}
                    {profileB && (
                        <ProfileCard
                            profile={profileB}
                            name={nameB}
                            color="from-purple-500 to-pink-600"
                        />
                    )}
                </div>
            ) : viewMode === 'partnerA' && profileA ? (
                <div className="max-w-2xl mx-auto">
                    <ProfileCard
                        profile={profileA}
                        name={nameA}
                        color="from-indigo-500 to-blue-600"
                    />
                </div>
            ) : viewMode === 'partnerB' && profileB ? (
                <div className="max-w-2xl mx-auto">
                    <ProfileCard
                        profile={profileB}
                        name={nameB}
                        color="from-purple-500 to-pink-600"
                    />
                </div>
            ) : null}
        </div>
    );
};

export default PsychologicalProfileWidget;

