/**
 * Self Dosha Widget
 * Shows dosha analysis for single person (no duplicates)
 */

import React from 'react';
import { Shield, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';

interface SelfDoshaWidgetProps {
  doshaAnalysis: any;
  name?: string;
}

export const SelfDoshaWidget: React.FC<SelfDoshaWidgetProps> = ({ 
  doshaAnalysis,
  name = 'You'
}) => {
  if (!doshaAnalysis) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
        <p className="text-gray-500 dark:text-gray-400">Dosha analysis not available</p>
      </div>
    );
  }

  const presentDoshas = doshaAnalysis.doshas?.filter((d: any) => d.present) || [];
  const absentDoshas = doshaAnalysis.doshas?.filter((d: any) => !d.present) || [];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Dosha Analysis</h2>
            <p className="text-amber-100">
              {presentDoshas.length === 0 
                ? 'No significant doshas detected - favorable for marriage' 
                : `${presentDoshas.length} dosha(s) present - remedies recommended`}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">
            {presentDoshas.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Present</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {absentDoshas.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Clear</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {doshaAnalysis.yogas?.length || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Yogas</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {doshaAnalysis.manglik?.status === 'present' ? 'Yes' : 'No'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Manglik</div>
        </div>
      </div>

      {/* Present Doshas */}
      {presentDoshas.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Doshas Present in {name}'s Chart
          </h3>
          <div className="space-y-3">
            {presentDoshas.map((dosha: any, index: number) => (
              <div 
                key={index}
                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200">
                      {dosha.name}
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {dosha.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        dosha.severity === 'high' 
                          ? 'bg-red-200 text-red-800' 
                          : dosha.severity === 'medium'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-blue-200 text-blue-800'
                      }`}>
                        {dosha.severity} severity
                      </span>
                    </div>
                  </div>
                </div>
                {dosha.remedy && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Remedy:</span> {dosha.remedy}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clear Doshas */}
      {absentDoshas.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Clear in {name}'s Chart
          </h3>
          <div className="space-y-2">
            {absentDoshas.slice(0, 5).map((dosha: any, index: number) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
              >
                <span className="text-gray-700 dark:text-gray-300">{dosha.name}</span>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  ABSENT
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manglik Analysis */}
      {doshaAnalysis.manglik && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Manglik Dosha Analysis
          </h3>
          <div className={`p-4 rounded-lg ${
            doshaAnalysis.manglik.status === 'present'
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'
              : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30'
          }`}>
            <div className="flex items-center gap-3">
              {doshaAnalysis.manglik.status === 'present' ? (
                <AlertTriangle className="w-6 h-6 text-red-500" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              <div>
                <p className={`font-semibold ${
                  doshaAnalysis.manglik.status === 'present'
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-green-800 dark:text-green-200'
                }`}>
                  {doshaAnalysis.manglik.status === 'present' 
                    ? 'Manglik Dosha Present' 
                    : 'No Manglik Dosha'}
                </p>
                {doshaAnalysis.manglik.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {doshaAnalysis.manglik.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfDoshaWidget;
