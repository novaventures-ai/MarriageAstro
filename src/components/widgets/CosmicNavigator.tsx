import React from 'react';
import { PremiumBadge } from '../premium/PremiumBadge';

export type ThemeId = 'match' | 'partner' | 'risks' | 'chemistry' | 'timing';

export interface ThemeConfig {
    id: ThemeId;
    icon: string;
    title: string;
    question: string;
    color: string;
    gradient: string;
    widgets: { id: string; label: string }[];
    premiumRequired?: boolean;
    dynamicData?: {
        badge?: string;
        status?: 'good' | 'warning' | 'danger' | 'neutral';
        highlight?: string;
    };
}

interface CosmicNavigatorProps {
    themes: ThemeConfig[];
    activeTheme: ThemeId;
    onSelectTheme: (themeId: ThemeId) => void;
    onScrollToWidget: (widgetId: string) => void;
}

const statusColors = {
    good: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
    neutral: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
};

export const CosmicNavigator: React.FC<CosmicNavigatorProps> = ({
    themes,
    activeTheme,
    onSelectTheme,
    onScrollToWidget,
}) => {
    return (
        <div className="w-full mb-8">
            {/* Navigator Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                    Cosmic Navigator
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
                    Select a theme below to explore the detailed analysis sections of your report.
                </p>
            </div>

            {/* Theme Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {themes.map((theme) => {
                    const isActive = activeTheme === theme.id;

                    return (
                        <div
                            key={theme.id}
                            onClick={() => onSelectTheme(theme.id)}
                            className={`
                relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 group
                border-2 flex flex-col h-full
                ${isActive
                                    ? `border-${theme.color}-500 shadow-lg shadow-${theme.color}-500/20 dark:shadow-${theme.color}-900/30 ring-2 ring-${theme.color}-500/20 scale-[1.02]`
                                    : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur hover:bg-white dark:hover:bg-gray-800 shadow-sm hover:shadow-md'
                                }
              `}
                        >
                            {/* Card Header Background Gradient */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.gradient} opacity-80`} />

                            {isActive && (
                                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${theme.gradient} rounded-full blur-3xl opacity-20 dark:opacity-40 pointer-events-none`} />
                            )}

                            <div className="p-5 flex-grow flex flex-col relative z-10">
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`text-3xl p-2 rounded-xl bg-${theme.color}-50 dark:bg-${theme.color}-900/20 text-${theme.color}-600 dark:text-${theme.color}-400 mb-1`}>
                                        {theme.icon}
                                    </div>

                                    {/* Dynamic Badge */}
                                    {theme.dynamicData?.badge && (
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[theme.dynamicData.status || 'neutral']}`}>
                                            {theme.dynamicData.badge}
                                        </span>
                                    )}
                                </div>

                                <h3 className={`text-lg sm:text-xl font-bold mb-1 flex items-center gap-2 ${isActive ? `text-${theme.color}-700 dark:text-${theme.color}-300` : 'text-gray-800 dark:text-white'}`}>
                                    {theme.title}
                                    {theme.premiumRequired && <PremiumBadge />}
                                </h3>

                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium italic">
                                    "{theme.question}"
                                </p>

                                {theme.dynamicData?.highlight && (
                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-4 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                        {theme.dynamicData.highlight}
                                    </p>
                                )}

                                <div className="flex-grow" />

                                {/* Sub-widgets list */}
                                <div className="space-y-1.5 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                    {theme.widgets.map((widget) => (
                                        <div
                                            key={widget.id}
                                            onClick={(e) => {
                                                e.stopPropagation(); // prevent card click
                                                onSelectTheme(theme.id);
                                                // small delay to allow react to render the widgets if changing theme
                                                setTimeout(() => onScrollToWidget(widget.id), 50);
                                            }}
                                            className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 py-1 px-2 -mx-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors group/item"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover/item:bg-indigo-400"></div>
                                            <span className="truncate">{widget.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
