import React, { useState } from 'react';
import { SelfAnalysisReport } from '../../types/selfAnalysis';
import { PsychologicalProfile } from '../../types';
import {
  Brain, Heart, MessageCircle, Shield, Zap, Eye, ChevronDown, ChevronUp,
  Lightbulb, Users, Compass, Star, BookOpen
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

  const traits = (profile as any).traits || [];
  const nature = (profile as any).nature || '';
  const behavior = (profile as any).behavior || '';
  const emotionalStyle = (profile as any).emotionalStyle || (profile as any).emotionalNature || '';
  const communicationStyle = (profile as any).communicationStyle || '';
  const conflictStyle = (profile as any).conflictStyle || '';
  const attachmentStyle = (profile as any).attachmentStyle || '';
  const loveLanguage = (profile as any).loveLanguage || '';
  const strengths = (profile as any).strengths || [];
  const challenges = (profile as any).challenges || (profile as any).weaknesses || [];

  const sections = [
    {
      key: 'traits',
      icon: <Star className="w-5 h-5" />,
      title: 'Core Personality Traits',
      color: 'violet',
      content: () => (
        <div className="space-y-3">
          {traits.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {traits.map((trait: any, i: number) => {
                const traitStr = typeof trait === 'string' ? trait : trait.trait || trait.name || String(trait);
                const desc = typeof trait === 'object' ? (trait.description || trait.influence || '') : '';
                return (
                  <div key={i} className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/50 rounded-xl px-4 py-3 flex-1 min-w-[200px]">
                    <p className="font-semibold text-violet-800 dark:text-violet-200">{traitStr}</p>
                    {desc && <p className="text-sm text-violet-600 dark:text-violet-400 mt-1">{desc}</p>}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No specific traits data available</p>
          )}
        </div>
      )
    },
    {
      key: 'nature',
      icon: <Compass className="w-5 h-5" />,
      title: 'Inner Nature & Behavior',
      color: 'blue',
      content: () => (
        <div className="space-y-4">
          {nature && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">Fundamental Nature</p>
              <p className="text-blue-800 dark:text-blue-200">{nature}</p>
            </div>
          )}
          {behavior && (
            <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-4 border border-sky-200 dark:border-sky-800/50">
              <p className="text-xs font-medium text-sky-600 dark:text-sky-400 uppercase tracking-wide mb-1">Behavioral Patterns</p>
              <p className="text-sky-800 dark:text-sky-200">{behavior}</p>
            </div>
          )}
          {!nature && !behavior && <p className="text-gray-500 dark:text-gray-400 text-sm">Nature data not available</p>}
        </div>
      )
    },
    {
      key: 'emotional',
      icon: <Heart className="w-5 h-5" />,
      title: 'Emotional & Love Style',
      color: 'pink',
      content: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {emotionalStyle && (
            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4 border border-pink-200 dark:border-pink-800/50">
              <p className="text-xs font-medium text-pink-600 dark:text-pink-400 uppercase tracking-wide mb-1">Emotional Style</p>
              <p className="text-pink-800 dark:text-pink-200 font-medium">{emotionalStyle}</p>
            </div>
          )}
          {loveLanguage && (
            <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4 border border-rose-200 dark:border-rose-800/50">
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wide mb-1">Love Language</p>
              <p className="text-rose-800 dark:text-rose-200 font-medium">{loveLanguage}</p>
            </div>
          )}
          {attachmentStyle && (
            <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-xl p-4 border border-fuchsia-200 dark:border-fuchsia-800/50">
              <p className="text-xs font-medium text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wide mb-1">Attachment Style</p>
              <p className="text-fuchsia-800 dark:text-fuchsia-200 font-medium">{attachmentStyle}</p>
            </div>
          )}
          {communicationStyle && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800/50">
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-1">Communication</p>
              <p className="text-purple-800 dark:text-purple-200 font-medium">{communicationStyle}</p>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'conflict',
      icon: <Zap className="w-5 h-5" />,
      title: 'Conflict & Stress Response',
      color: 'amber',
      content: () => (
        <div>
          {conflictStyle ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800/50">
              <p className="text-amber-800 dark:text-amber-200">{conflictStyle}</p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Conflict style data not available</p>
          )}
        </div>
      )
    },
    {
      key: 'strengths',
      icon: <Shield className="w-5 h-5" />,
      title: 'Strengths & Growth Areas',
      color: 'emerald',
      content: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Strengths</h4>
              <div className="space-y-2">
                {strengths.map((s: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Star className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {challenges.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">Growth Areas</h4>
              <div className="space-y-2">
                {challenges.map((c: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{c}</span>
                  </div>
                ))}
              </div>
            </div>
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
