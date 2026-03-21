import React, { useState } from 'react';
import { SelfAnalysisReport } from '../../types/selfAnalysis';
import { PsychologicalProfile } from '../../types';
import {
  Brain, Heart, MessageCircle, Shield, Zap, ChevronDown, ChevronUp,
  Lightbulb, Users, Compass, Star, BookOpen, Eye
} from 'lucide-react';

interface SelfPsychologicalProfileWidgetProps {
  report: SelfAnalysisReport;
}

export const SelfPsychologicalProfileWidget: React.FC<SelfPsychologicalProfileWidgetProps> = ({ report }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('traits');
  const profile = report.psychologicalProfile;

  if (!profile) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
        <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Psychological profile data not available</p>
      </div>
    );
  }

  // Map from actual PsychologicalProfile structure
  const attachmentStyle = profile.attachmentStyle;
  const communicationStyle = profile.communicationStyle;
  const loveLanguage = profile.loveLanguage;
  const coreFears = profile.coreFears;
  const defenseMechanisms = profile.defenseMechanisms;
  const repeatingPatterns = profile.repeatingPatterns;
  const mentalLandscape = profile.mentalLandscape;

  const sections = [
    {
      key: 'attachment',
      icon: <Heart className="w-5 h-5" />,
      title: 'Attachment & Love Style',
      color: 'pink',
      content: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {attachmentStyle && (
            <>
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4 border border-pink-200 dark:border-pink-800/50">
                <p className="text-xs font-medium text-pink-600 dark:text-pink-400 uppercase tracking-wide mb-1">Attachment Type</p>
                <p className="text-pink-800 dark:text-pink-200 font-medium capitalize">{attachmentStyle.type}</p>
                {attachmentStyle.description && (
                  <p className="text-sm text-pink-600 dark:text-pink-400 mt-2">{attachmentStyle.description}</p>
                )}
              </div>
              {attachmentStyle.fourthHouseAnalysis && (
                <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-xl p-4 border border-fuchsia-200 dark:border-fuchsia-800/50">
                  <p className="text-xs font-medium text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wide mb-1">4th House Influence</p>
                  <p className="text-fuchsia-800 dark:text-fuchsia-200">{attachmentStyle.fourthHouseAnalysis}</p>
                </div>
              )}
            </>
          )}
          {loveLanguage && (
            <>
              <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4 border border-rose-200 dark:border-rose-800/50">
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wide mb-1">Love Language</p>
                <p className="text-rose-800 dark:text-rose-200 font-medium">{loveLanguage.primary}</p>
                {loveLanguage.secondary && (
                  <p className="text-sm text-rose-600 dark:text-rose-400 mt-1">Secondary: {loveLanguage.secondary}</p>
                )}
              </div>
              {loveLanguage.description && (
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4 border border-rose-200 dark:border-rose-800/50 sm:col-span-2">
                  <p className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wide mb-1">Description</p>
                  <p className="text-rose-800 dark:text-rose-200">{loveLanguage.description}</p>
                </div>
              )}
            </>
          )}
          {!attachmentStyle && !loveLanguage && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Attachment & love style data not available</p>
          )}
        </div>
      )
    },
    {
      key: 'communication',
      icon: <MessageCircle className="w-5 h-5" />,
      title: 'Communication Style',
      color: 'blue',
      content: () => (
        <div className="space-y-4">
          {communicationStyle ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">Style</p>
                  <p className="text-blue-800 dark:text-blue-200 font-medium">{communicationStyle.style}</p>
                </div>
                {communicationStyle.expressionMethod && (
                  <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-4 border border-sky-200 dark:border-sky-800/50">
                    <p className="text-xs font-medium text-sky-600 dark:text-sky-400 uppercase tracking-wide mb-1">Expression Method</p>
                    <p className="text-sky-800 dark:text-sky-200">{communicationStyle.expressionMethod}</p>
                  </div>
                )}
                {communicationStyle.mercuryPlacement && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800/50">
                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-1">Mercury Placement</p>
                    <p className="text-indigo-800 dark:text-indigo-200">{communicationStyle.mercuryPlacement}</p>
                  </div>
                )}
                {communicationStyle.conflictResolution && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800/50">
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">Conflict Resolution</p>
                    <p className="text-amber-800 dark:text-amber-200">{communicationStyle.conflictResolution}</p>
                  </div>
                )}
              </div>
              {communicationStyle.triggers && communicationStyle.triggers.length > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800/50">
                  <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-2">Communication Triggers</p>
                  <div className="flex flex-wrap gap-2">
                    {communicationStyle.triggers.map((trigger: string, i: number) => (
                      <span key={i} className="bg-orange-100 dark:bg-orange-800/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-sm">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Communication style data not available</p>
          )}
        </div>
      )
    },
    {
      key: 'fears',
      icon: <Eye className="w-5 h-5" />,
      title: 'Core Fears & Defense Mechanisms',
      color: 'violet',
      content: () => (
        <div className="space-y-4">
          {coreFears && (
            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 border border-violet-200 dark:border-violet-800/50">
              <p className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wide mb-2">Primary Fear</p>
              <p className="text-violet-800 dark:text-violet-200 font-medium">{coreFears.primaryFear}</p>
              {coreFears.rahuInfluence && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wide mb-1">Rahu Influence</p>
                  <p className="text-sm text-violet-700 dark:text-violet-300">{coreFears.rahuInfluence}</p>
                </div>
              )}
              {coreFears.howItManifests && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wide mb-1">How It Manifests</p>
                  <p className="text-sm text-violet-700 dark:text-violet-300">{coreFears.howItManifests}</p>
                </div>
              )}
            </div>
          )}
          {defenseMechanisms && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800/50">
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">Defense Mechanism</p>
              <p className="text-purple-800 dark:text-purple-200 font-medium">{defenseMechanisms.mechanism}</p>
              {defenseMechanisms.ketuInfluence && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1">Ketu Influence</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">{defenseMechanisms.ketuInfluence}</p>
                </div>
              )}
              {defenseMechanisms.impactOnRelationships && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1">Impact on Relationships</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">{defenseMechanisms.impactOnRelationships}</p>
                </div>
              )}
            </div>
          )}
          {!coreFears && !defenseMechanisms && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Core fears data not available</p>
          )}
        </div>
      )
    },
    {
      key: 'patterns',
      icon: <Compass className="w-5 h-5" />,
      title: 'Repeating Patterns',
      color: 'amber',
      content: () => (
        <div>
          {repeatingPatterns ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800/50 space-y-3">
              <div>
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">Pattern</p>
                <p className="text-amber-800 dark:text-amber-200 font-medium">{repeatingPatterns.pattern}</p>
              </div>
              {repeatingPatterns.fifthHouseInfluence && (
                <div>
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">5th House Influence</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">{repeatingPatterns.fifthHouseInfluence}</p>
                </div>
              )}
              {repeatingPatterns.venusCycles && (
                <div>
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">Venus Cycles</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">{repeatingPatterns.venusCycles}</p>
                </div>
              )}
              {repeatingPatterns.howToBreakIt && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 border border-emerald-200 dark:border-emerald-800/50 mt-2">
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">How to Break the Pattern</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">{repeatingPatterns.howToBreakIt}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Pattern data not available</p>
          )}
        </div>
      )
    },
    {
      key: 'mental',
      icon: <Shield className="w-5 h-5" />,
      title: 'Mental Landscape & Growth',
      color: 'emerald',
      content: () => (
        <div>
          {mentalLandscape ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mentalLandscape.coreFear && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800/50">
                  <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide mb-1">Core Fear</p>
                  <p className="text-red-800 dark:text-red-200">{mentalLandscape.coreFear}</p>
                </div>
              )}
              {mentalLandscape.defenseMechanism && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800/50">
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">Defense Mechanism</p>
                  <p className="text-amber-800 dark:text-amber-200">{mentalLandscape.defenseMechanism}</p>
                </div>
              )}
              {mentalLandscape.blindSpot && (
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800/50">
                  <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-1">Blind Spot</p>
                  <p className="text-orange-800 dark:text-orange-200">{mentalLandscape.blindSpot}</p>
                </div>
              )}
              {mentalLandscape.growthArea && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="w-4 h-4 text-emerald-500" />
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Growth Area</p>
                  </div>
                  <p className="text-emerald-800 dark:text-emerald-200">{mentalLandscape.growthArea}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Mental landscape data not available</p>
          )}
        </div>
      )
    }
  ];

  const colorMap: Record<string, string> = {
    violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-fuchsia-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Brain className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <Brain className="w-10 h-10 text-violet-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Psychological Profile</h2>
              <p className="text-violet-200/80">Deep personality analysis from your birth chart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-3">
        {sections.map(section => (
          <div key={section.key} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colorMap[section.color]}`}>
                  {section.icon}
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{section.title}</h3>
              </div>
              {expandedSection === section.key ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedSection === section.key && (
              <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                {section.content()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
