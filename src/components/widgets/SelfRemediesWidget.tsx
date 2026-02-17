/**
 * Self Remedies Widget
 * Shows personalized remedies for self analysis
 */

import React from 'react';
import { Sparkles, Gem, BookOpen, Heart, Activity } from 'lucide-react';

interface SelfRemediesWidgetProps {
  remedies: any;
  doshaAnalysis?: any;
}

export const SelfRemediesWidget: React.FC<SelfRemediesWidgetProps> = ({ 
  remedies,
  doshaAnalysis
}) => {
  if (!remedies) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
        <p className="text-gray-500 dark:text-gray-400">Remedies not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Personalized Remedies</h2>
            <p className="text-purple-100">
              Recommended actions to improve your marriage prospects
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Actions */}
      {remedies.prioritizedActions && remedies.prioritizedActions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Top Priority Actions
          </h3>
          <div className="space-y-4">
            {remedies.prioritizedActions.map((action: any, index: number) => (
              <div 
                key={index}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-l-4 border-purple-500"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {action.description}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-500 space-y-1">
                      <p><span className="font-medium">When:</span> {action.whenToStart}</p>
                      <p><span className="font-medium">Duration:</span> {action.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gemstone Recommendation */}
      {remedies.gemstone && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Gem className="w-5 h-5 text-blue-600" />
            Gemstone Recommendation
          </h3>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Stone</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{remedies.gemstone.stone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Metal</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{remedies.gemstone.metal}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Finger</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{remedies.gemstone.finger}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Day</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{remedies.gemstone.day}</p>
              </div>
            </div>
            {remedies.gemstone.mantra && (
              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800/30">
                <p className="text-sm text-gray-500 dark:text-gray-400">Mantra</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">{remedies.gemstone.mantra}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mantra Practice */}
      {remedies.mantras && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            Mantra Practice
          </h3>
          <div className="space-y-4">
            {remedies.mantras.primary && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                  Primary Mantra
                </h4>
                <p className="text-lg text-gray-800 dark:text-gray-100 font-medium">
                  {remedies.mantras.primary.mantra}
                </p>
                <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p><span className="font-medium">Count:</span> {remedies.mantras.primary.count} times</p>
                  <p><span className="font-medium">Best Time:</span> {remedies.mantras.primary.bestTime}</p>
                  <p><span className="font-medium">Duration:</span> {remedies.mantras.primary.duration}</p>
                </div>
              </div>
            )}
            {remedies.mantras.supporting && remedies.mantras.supporting.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Supporting Mantras
                </h4>
                <ul className="space-y-2">
                  {remedies.mantras.supporting.map((mantra: string, index: number) => (
                    <li 
                      key={index}
                      className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-sm text-gray-700 dark:text-gray-300"
                    >
                      {mantra}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lifestyle */}
      {remedies.lifestyle && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-600" />
            Lifestyle Recommendations
          </h3>
          <div className="space-y-4">
            {remedies.lifestyle.dos && remedies.lifestyle.dos.length > 0 && (
              <div>
                <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Do's</h4>
                <ul className="space-y-2">
                  {remedies.lifestyle.dos.map((item: string, index: number) => (
                    <li 
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-green-500 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {remedies.lifestyle.donts && remedies.lifestyle.donts.length > 0 && (
              <div>
                <h4 className="font-medium text-red-700 dark:text-red-400 mb-2">Don'ts</h4>
                <ul className="space-y-2">
                  {remedies.lifestyle.donts.map((item: string, index: number) => (
                    <li 
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-red-500 mt-0.5">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfRemediesWidget;
