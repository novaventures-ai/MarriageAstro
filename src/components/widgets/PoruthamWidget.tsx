import React from 'react';
import { PoruthamAnalysis, PoruthamParameter } from '../../../lib/poruthamCalculations';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface PoruthamWidgetProps {
    data: PoruthamAnalysis;
}

const PoruthamWidget: React.FC<PoruthamWidgetProps> = ({ data }) => {
    const getResultIcon = (result: string) => {
        switch (result) {
            case 'Good':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Bad':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        }
    };

    const getResultColor = (result: string) => {
        switch (result) {
            case 'Good':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'Bad':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex justify-between items-center">
                    10/11 Porutham Matching (South Indian)
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        {data.totalScore} / {data.maxScore} Points
                    </span>
                </h3>
            </div>

            <div className="p-6">
                <div className="mb-6 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                    <div>
                        <span className="text-sm text-slate-500 dark:text-slate-400 block">Overall Verdict</span>
                        <span className={`text-lg font-bold ${data.verdict.includes('Excellent') || data.verdict.includes('Good')
                            ? 'text-green-600 dark:text-green-400'
                            : data.verdict.includes('Challenging') || data.verdict.includes('Poor')
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-yellow-600 dark:text-yellow-400'
                            }`}>
                            {data.verdict}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-sm text-slate-500 dark:text-slate-400 block">Match Percentage</span>
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            {data.percentage.toFixed(1)}%
                        </span>
                    </div>
                </div>

                {data.criticalDoshas.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <h4 className="text-red-800 dark:text-red-300 font-bold mb-2 flex items-center">
                            <XCircle className="w-5 h-5 mr-2" />
                            Critical Doshas Detected
                        </h4>
                        <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-400">
                            {data.criticalDoshas.map((dosha: string, idx: number) => (
                                <li key={idx}>{dosha}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Parameter</th>
                                <th className="px-4 py-3 font-semibold text-center">Score</th>
                                <th className="px-4 py-3 font-semibold text-center">Result</th>
                                <th className="px-4 py-3 font-semibold">Interpretation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {data.parameters.map((param: PoruthamParameter) => (
                                <tr key={param.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-800 dark:text-slate-200">{param.name}</div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="font-bold text-slate-700 dark:text-slate-300">
                                            {param.pointsObtained} / {param.maxPoints}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getResultColor(param.result)}`}>
                                                {getResultIcon(param.result)}
                                                <span className="ml-1">{param.result}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-slate-500 dark:text-slate-400 text-xs italic">
                                            {param.description}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PoruthamWidget;
