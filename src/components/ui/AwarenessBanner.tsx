/**
 * AwarenessBanner
 * Shown at the top of sensitive sections (risk, sexual health, mental health).
 * Reframes the content from "scary diagnosis" to "empowering awareness".
 */

import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface Props {
  sectionName: string;
}

const MESSAGES: Record<string, string> = {
  risk: 'These are astrological tendency patterns — not predictions or diagnoses. Awareness of potential friction areas helps you build a stronger, more conscious relationship.',
  sexual: 'Sexual compatibility patterns reflect energetic and temperamental tendencies from the Vedic system. They describe natural rhythms — not limitations.',
  mental: 'These insights reflect emotional and psychological tendencies seen in the birth chart. They are areas for self-awareness and growth, not clinical diagnoses.',
  addiction: 'Addiction vulnerability patterns indicate areas of unconscious escapism tendencies. Awareness is the first step toward conscious choice.',
  default: 'These insights are astrological tendency patterns designed to build self-awareness and conscious decision-making — not definitive predictions.',
};

export const AwarenessBanner: React.FC<Props> = ({ sectionName }) => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const key = Object.keys(MESSAGES).find(k => sectionName.toLowerCase().includes(k)) ?? 'default';
  const message = MESSAGES[key];

  return (
    <div className="flex items-start gap-3 px-4 py-3 mb-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/40 text-sm">
      <Info className="w-4 h-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
      <p className="text-indigo-700 dark:text-indigo-300 flex-1 leading-relaxed">
        <span className="font-semibold">Knowledge, not judgment — </span>
        {message}
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200 flex-shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
