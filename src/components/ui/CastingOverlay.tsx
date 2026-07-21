import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Full-screen "casting your chart" ritual shown while a report generates.
 *
 * The Swiss Ephemeris WASM engine returns almost instantly, which makes a
 * weighty question ("will my marriage work?") feel cheaply answered. Pairing a
 * minimum generation duration (see MIN_CASTING_MS in useUserProfileStore) with
 * these staged messages raises perceived value (labor-illusion effect) and
 * gives the moment appropriate gravity.
 */
const STAGES = [
  'Casting your birth chart…',
  'Mapping the planets & houses…',
  'Reading your Navamsa (D9)…',
  'Weaving your story…',
];

export const CastingOverlay: React.FC<{ show: boolean }> = ({ show }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!show) {
      setStage(0);
      return;
    }
    const id = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 550);
    return () => clearInterval(id);
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-50/95 via-purple-50/95 to-pink-50/95 dark:from-gray-900/95 dark:via-gray-900/95 dark:to-indigo-950/95 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="text-center px-6">
        <div className="relative mx-auto mb-6 w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-200 dark:border-indigo-800 border-t-indigo-500 dark:border-t-indigo-400 animate-spin" />
          <Sparkles className="absolute inset-0 m-auto w-7 h-7 text-indigo-500 dark:text-indigo-400" />
        </div>
        <p key={stage} className="text-lg font-semibold text-gray-800 dark:text-gray-100 animate-in fade-in duration-300">
          {STAGES[stage]}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Casting with Swiss Ephemeris precision
        </p>
      </div>
    </div>
  );
};

export default CastingOverlay;
