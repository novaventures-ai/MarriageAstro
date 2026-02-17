/**
 * ComparisonProgressBar — animated progress indicator during parallel report gen
 */

import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface ComparisonProgressBarProps {
    current: number;
    total: number;
    currentPartnerName: string;
}

export const ComparisonProgressBar: React.FC<ComparisonProgressBarProps> = ({
    current,
    total,
    currentPartnerName,
}) => {
    const percentage = Math.round((current / total) * 100);

    return (
        <div className="w-full max-w-2xl mx-auto py-8 px-4">
            <div className="flex items-center justify-center gap-3 mb-4">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                <span className="text-lg font-medium text-gray-700 dark:text-gray-200 transition-colors">
                    Analyzing compatibility...
                </span>
            </div>

            {/* Progress bar */}
            <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3 transition-colors">
                <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>

            {/* Status text */}
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400 transition-colors">
                    <Sparkles className="w-4 h-4 inline-block mr-1 text-purple-500" />
                    Partner {current} of {total}
                    {currentPartnerName && (
                        <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                            — {currentPartnerName}
                        </span>
                    )}
                </span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 transition-colors">
                    {percentage}%
                </span>
            </div>
        </div>
    );
};

export default ComparisonProgressBar;
