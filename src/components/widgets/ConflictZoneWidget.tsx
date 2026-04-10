import React, { useState } from 'react';
import { CompatibilityReport, ConflictTrigger } from '../../types';
import { Users, Coins, Brain, Zap, AlertCircle, Info, ShieldAlert, User, Lightbulb } from 'lucide-react';
import { JargonTooltip } from '../ui/JargonTooltip';

// ─── Inline remedy generator ─────────────────────────────────────────────────
function getInlineRemedy(trigger: ConflictTrigger, categoryId: string): string {
  const combo = `${trigger.title} ${trigger.description}`.toLowerCase();

  if (categoryId === 'people') {
    if (combo.includes('in-law') || combo.includes('inlaw') || combo.includes('family'))
      return 'Establish a "partner first" rule for household decisions before moving in together. Visit extended family on a fixed schedule — it removes ambiguity.';
    if (combo.includes('friend') || combo.includes('social'))
      return 'Reserve one fixed evening per week exclusively for each other. Discuss how much social exposure each of you needs — introvert/extrovert gaps widen over time.';
    return 'Agree upfront: external opinions can inform but never override joint decisions. A single clear agreement here removes most external friction.';
  }

  if (categoryId === 'things') {
    if (combo.includes('money') || combo.includes('financ') || combo.includes('spend') || combo.includes('debt'))
      return 'Set up a joint account for shared expenses + separate accounts for personal spending. A monthly 30-min "money date" to review together — no judgment, just facts — removes 80% of finance arguments.';
    if (combo.includes('asset') || combo.includes('property') || combo.includes('possession'))
      return 'Transparency before marriage: list assets, liabilities, and expectations openly. A simple shared understanding prevents resentment that builds silently over years.';
    return 'Monthly check-in on shared finances. What\'s working, what isn\'t. Short, factual, no blame.';
  }

  if (categoryId === 'ideology') {
    if (combo.includes('religio') || combo.includes('faith') || combo.includes('spiritual') || combo.includes('god'))
      return 'Agree on which spiritual traditions you\'ll maintain as a couple and which remain personal. Document this — especially how children will be raised. One honest conversation now prevents a decade of friction.';
    if (combo.includes('politic') || combo.includes('belief') || combo.includes('value'))
      return 'Identify 3-5 non-negotiable values each. Build shared life around those overlaps. Let the differences remain personal — not every value needs to be shared.';
    return 'Hold a "values audit" conversation: What do you each believe about [this area]? Where do you naturally align? Where do you need to agree-to-disagree?';
  }

  if (categoryId === 'behavior') {
    if (combo.includes('anger') || combo.includes('temper') || combo.includes('reacti') || combo.includes('rage'))
      return 'Agree on a pause signal — a word or gesture either partner uses to pause heated conversations for 20 minutes. Practice it before you need it. It works best when rehearsed calmly.';
    if (combo.includes('communicat') || combo.includes('express') || combo.includes('silent') || combo.includes('avoidanc'))
      return 'Weekly 30-min check-in: "What was good this week? What was hard?" No problem-solving during check-ins — only listening. This builds the safety needed for hard conversations.';
    if (combo.includes('habit') || combo.includes('routine') || combo.includes('daily') || combo.includes('sleep'))
      return 'Discuss non-negotiable daily habits (sleep time, food, cleanliness, social media use) before living together. Small habit mismatches cause the most daily friction.';
    return 'For this pattern: name it together without blame, track when it triggers, and agree on one small adjustment per month. Gradual beats dramatic.';
  }

  // Generic by intensity
  if (trigger.intensity === 'High')
    return 'This is a high-intensity zone — consider pre-marriage counseling covering this specific area. One guided session is worth more than a year of unmanaged friction.';
  if (trigger.intensity === 'Medium')
    return 'One honest conversation about this before marriage can defuse most of it. Don\'t wait for it to surface under stress.';
  return 'Awareness is the primary remedy here. Simply knowing this pattern exists helps you catch it early and respond instead of react.';
}

interface ConflictZoneWidgetProps {
    report: CompatibilityReport;
}

export const ConflictZoneWidget: React.FC<ConflictZoneWidgetProps> = ({ report }) => {
    const { conflictZone } = report;
    const [viewMode, setViewMode] = useState<'both' | 'partnerA' | 'partnerB'>('both');

    if (!conflictZone) return null;

    const nameA = report.chartA.name;
    const nameB = report.chartB.name;

    const categories = [
        {
            id: 'people',
            label: 'People & Family',
            icon: Users,
            data: conflictZone.people,
            color: 'indigo',
            description: 'Friction arising from external influences, in-laws, or social circles.'
        },
        {
            id: 'things',
            label: 'Things & Finance',
            icon: Coins,
            data: conflictZone.things,
            color: 'emerald',
            description: 'Conflicts regarding shared assets, money management, or physical possessions.'
        },
        {
            id: 'ideology',
            label: 'Ideology & Values',
            icon: Brain,
            data: conflictZone.ideology,
            color: 'purple',
            description: 'Divergence in core beliefs, life philosophy, or long-term vision.'
        },
        {
            id: 'behavior',
            label: 'Behavior & Habits',
            icon: Zap,
            data: conflictZone.behavior,
            color: 'rose',
            description: 'Friction due to communication styles, temperamental triggers, or daily habits.'
        }
    ];

    const getIntensityColor = (intensity: string) => {
        switch (intensity) {
            case 'High': return 'text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase';
            case 'Medium': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase';
            case 'Low': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase';
            default: return 'text-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase';
        }
    };

    const getCategoryTheme = (color: string) => {
        const themes: Record<string, string> = {
            indigo: 'border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10',
            emerald: 'border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10',
            purple: 'border-purple-100 dark:border-purple-900/30 bg-purple-50/30 dark:bg-purple-900/10',
            rose: 'border-rose-100 dark:border-rose-900/30 bg-rose-50/30 dark:bg-rose-900/10',
        };
        return themes[color] || 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30';
    };

    const getIconColor = (color: string) => {
        const colors: Record<string, string> = {
            indigo: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/50',
            emerald: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/50',
            purple: 'text-purple-500 bg-purple-100 dark:bg-purple-900/50',
            rose: 'text-rose-500 bg-rose-100 dark:bg-rose-900/50',
        };
        return colors[color] || 'text-gray-500 bg-gray-100';
    };

    // Source-based filtering using actual trigger.source field
    const filterTriggers = (triggers: ConflictTrigger[]): ConflictTrigger[] => {
        if (viewMode === 'both') return triggers;
        const targetSource = viewMode; // 'partnerA' or 'partnerB'
        return triggers.filter(t => t.source === targetSource || t.source === 'mutual');
    };

    // Get source badge for each trigger
    const getSourceBadge = (source: ConflictTrigger['source']) => {
        if (source === 'partnerA') {
            return (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 text-[9px] font-bold uppercase tracking-wider">
                    <User className="w-2.5 h-2.5" /> {nameA}
                </span>
            );
        }
        if (source === 'partnerB') {
            return (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-900/30 text-purple-500 text-[9px] font-bold uppercase tracking-wider">
                    <User className="w-2.5 h-2.5" /> {nameB}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-50 dark:bg-gray-800/50 text-gray-400 text-[9px] font-bold uppercase tracking-wider">
                <Users className="w-2.5 h-2.5" /> Mutual
            </span>
        );
    };

    const toggleOptions = [
        { id: 'partnerA' as const, label: nameA },
        { id: 'both' as const, label: 'Both' },
        { id: 'partnerB' as const, label: nameB },
    ];

    // Compute total trigger count for the current view
    const totalTriggers = categories.reduce((sum, cat) => sum + filterTriggers(cat.data).length, 0);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Awareness Banner with Toggle */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-500 ${conflictZone.overallSeverity === 'High'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/40 text-red-900 dark:text-red-200 shadow-sm'
                : conflictZone.overallSeverity === 'Medium'
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/40 text-amber-900 dark:text-amber-200'
                    : 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/40 text-green-900 dark:text-green-200'
                }`}>
                <div className="flex items-start gap-4 flex-1">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${conflictZone.overallSeverity === 'High' ? 'bg-red-200 dark:bg-red-800' :
                        conflictZone.overallSeverity === 'Medium' ? 'bg-amber-200 dark:bg-amber-800' : 'bg-green-200 dark:bg-green-800'
                        }`}>
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-lg leading-tight uppercase tracking-tight">
                            Conflict Zone <JargonTooltip term="Conflict Zone" className="ml-1" />: {conflictZone.overallSeverity} Intensity
                        </h3>
                        <p className="text-sm font-medium opacity-90 leading-relaxed max-w-2xl">
                            {viewMode !== 'both'
                                ? `Showing ${viewMode === 'partnerA' ? nameA : nameB}'s chart-driven triggers + mutual conflicts. ${totalTriggers} trigger(s) visible.`
                                : conflictZone.awarenessNote
                            }
                        </p>
                    </div>
                </div>

                {/* Segmented Toggle */}
                <div className="flex bg-black/5 dark:bg-white/5 rounded-xl p-1 gap-0.5 self-start sm:self-auto flex-shrink-0">
                    {toggleOptions.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => setViewMode(opt.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${viewMode === opt.id
                                    ? opt.id === 'partnerA'
                                        ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/25'
                                        : opt.id === 'partnerB'
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md shadow-purple-500/25'
                                            : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                                    : 'text-current opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                                }`}
                        >
                            {opt.id === 'both' ? (
                                <span className="flex items-center gap-1.5">
                                    <Users className="w-3 h-3" />
                                    Both
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5">
                                    <User className="w-3 h-3" />
                                    {opt.label}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat, idx) => {
                    const filteredData = filterTriggers(cat.data);
                    return (
                        <div
                            key={cat.id}
                            className={`rounded-2xl border p-6 transition-all hover:shadow-md hover:scale-[1.01] duration-300 ${getCategoryTheme(cat.color)} animate-in slide-in-from-bottom-4`}
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 rounded-xl shadow-sm ${getIconColor(cat.color)}`}>
                                    <cat.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 dark:text-gray-100 transition-colors uppercase text-sm tracking-wider">{cat.label}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{filteredData.length} TRIGGER(S)</span>
                                        {filteredData.length === 0 && (
                                            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                                <AlertCircle className="w-2.5 h-2.5" /> Clear
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 italic font-medium leading-relaxed">
                                {cat.description}
                            </p>

                            {filteredData.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredData.map((trigger: ConflictTrigger, tIdx: number) => (
                                        <div key={tIdx} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-black/5 dark:border-white/5 space-y-2 group transition-all hover:border-black/10">
                                            <div className="flex justify-between items-start gap-3">
                                                <h5 className="font-bold text-sm text-gray-800 dark:text-gray-200 group-hover:text-indigo-500 transition-colors leading-tight">
                                                    {trigger.title}
                                                </h5>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {getSourceBadge(trigger.source)}
                                                    <span className={getIntensityColor(trigger.intensity)}>{trigger.intensity}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                                {trigger.description}
                                            </p>
                                            <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50 flex items-start gap-2">
                                                <Info className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5" />
                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-tight">
                                                    <span className="uppercase text-[8px] font-black mr-1 opacity-60">Astrology:</span>
                                                    {trigger.technicalBasis}
                                                </p>
                                            </div>
                                            {/* Inline remedy */}
                                            <div className="mt-2 flex items-start gap-2 p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                                                <Lightbulb className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                                                <p className="text-[11px] text-indigo-700 dark:text-indigo-300 leading-relaxed">
                                                    <span className="font-bold uppercase text-[9px] tracking-wider mr-1">What helps:</span>
                                                    {getInlineRemedy(trigger, cat.id)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-32 flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-black/5 dark:border-white/5 rounded-xl">
                                    <AlertCircle className="w-8 h-8 text-gray-200 dark:text-gray-700 mb-2" />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {viewMode !== 'both'
                                            ? `No triggers from ${viewMode === 'partnerA' ? nameA : nameB}'s chart`
                                            : 'Nurture Focus In Other Areas'
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Advisory Note */}
            <div className="bg-indigo-500 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />
                <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 opacity-80" />
                        <h4 className="font-black uppercase tracking-tighter text-lg">Relationship Growth Strategy</h4>
                    </div>
                    <p className="text-xs font-medium opacity-90 leading-relaxed">
                        Conflicts are not failures; they are signposts for growth. Use this breakdown to proactively discuss
                        boundaries and needs before pressure builds. High-intensity areas represent karmic lessons that,
                        when handled with empathy, become the strongest pillars of your union.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConflictZoneWidget;
