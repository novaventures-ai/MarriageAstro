/**
 * UserModeOnboarding
 * Full-screen modal shown once when a user first visits the dashboard.
 * Lets them pick their journey context: Searcher / Decider / Navigator.
 */

import React from 'react';
import { UserMode } from '../../store/useUserProfileStore';

interface ModeOption {
  mode: UserMode;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  borderColor: string;
  examples: string[];
}

const OPTIONS: ModeOption[] = [
  {
    mode: 'searcher',
    icon: '🔭',
    title: 'Still Searching',
    subtitle: 'Single & exploring',
    description: 'You want to know when marriage is likely, what your future spouse will be like, and what to do to attract the right person.',
    gradient: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-400',
    examples: ['When will I marry?', 'What will my spouse be like?', 'What are my marriage timing windows?'],
  },
  {
    mode: 'decider',
    icon: '⚖️',
    title: 'Evaluating Someone',
    subtitle: 'Have a person in mind',
    description: 'You are considering a specific person for marriage and want the real, honest analysis — including what most people are afraid to ask.',
    gradient: 'from-rose-500 to-pink-600',
    borderColor: 'border-rose-400',
    examples: ['Is this person right for me?', 'What are the hidden risks?', 'Are we truly compatible?'],
  },
  {
    mode: 'navigator',
    icon: '🧭',
    title: 'Already Together',
    subtitle: 'Married or in a committed relationship',
    description: 'You and your partner want to understand each other better, navigate upcoming challenges, and build a stronger foundation.',
    gradient: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-400',
    examples: ['Why do we keep clashing?', "What's coming this year?", 'How do we strengthen our bond?'],
  },
];

interface Props {
  onSelect: (mode: UserMode) => void;
}

export const UserModeOnboarding: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            What brings you here?
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto">
            Your dashboard adapts to your journey. Choose what fits you best — you can always change it later.
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {OPTIONS.map((opt) => (
            <button
              key={opt.mode}
              onClick={() => onSelect(opt.mode)}
              className={`
                relative text-left rounded-2xl border-2 ${opt.borderColor} bg-white/10 backdrop-blur-md
                hover:bg-white/20 transition-all duration-300 overflow-hidden
                group hover:scale-[1.02] hover:shadow-2xl p-6
              `}
            >
              {/* Gradient top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${opt.gradient}`} />

              {/* Icon */}
              <div className="text-4xl mb-4">{opt.icon}</div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-1">{opt.title}</h3>
              <p className="text-sm text-gray-300 font-medium mb-3">{opt.subtitle}</p>

              {/* Description */}
              <p className="text-sm text-gray-300 leading-relaxed mb-4">{opt.description}</p>

              {/* Example questions */}
              <ul className="space-y-1.5">
                {opt.examples.map((ex, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="text-gray-500 mt-0.5">›</span>
                    <span className="italic">"{ex}"</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className={`mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r ${opt.gradient} text-white text-sm font-semibold text-center group-hover:opacity-90 transition-opacity`}>
                This is me →
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          You can switch your mode anytime from the dashboard sidebar.
        </p>
      </div>
    </div>
  );
};
