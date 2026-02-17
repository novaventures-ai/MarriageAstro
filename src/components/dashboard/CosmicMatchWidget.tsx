import React, { useMemo } from 'react';
import { Chart } from '@types';
import { analyzeBestMatch } from '@lib/ai/matchInsight';
import { Sparkles, Heart, Trophy, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CosmicMatchWidgetProps {
    selfChart: Chart | null;
    partners: { id: string; name: string; chart?: Chart }[];
}

export const CosmicMatchWidget: React.FC<CosmicMatchWidgetProps> = ({ selfChart, partners }) => {
    const navigate = useNavigate();

    const bestMatch = useMemo(() => {
        if (!selfChart || partners.length === 0) return null;
        return analyzeBestMatch(selfChart, partners);
    }, [selfChart, partners]);

    if (!bestMatch) return null;

    return (
        <div className="mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg p-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 h-full backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                        Cosmic Insight
                    </h3>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            Best Match: {bestMatch.partnerName}
                        </h4>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold text-sm">
                                {bestMatch.score}% Match
                                <span className="text-xs font-normal opacity-75 ml-1">({bestMatch.rawScore}/36 Gunas)</span>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium text-sm">
                                {bestMatch.verdict}
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                            {bestMatch.reason}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {bestMatch.strengths.map((strength, i) => (
                                <span key={i} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs rounded border border-indigo-100 dark:border-indigo-800">
                                    {strength}
                                </span>
                            ))}
                            {bestMatch.challenges.map((challenge, i) => (
                                <span key={i} className="px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded border border-red-100 dark:border-red-800">
                                    {challenge}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(`/quick-compare/${bestMatch.partnerId}`)}
                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 group"
                    >
                        View Full Analysis
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};
