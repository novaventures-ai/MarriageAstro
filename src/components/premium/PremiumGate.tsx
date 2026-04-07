/**
 * PremiumGate Component
 * Wraps content that should be gated behind premium.
 * Shows blurred preview with unlock CTA for free users.
 */

import React, { useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { usePremium } from '../../hooks/usePremium';
import { UnlockableSection } from '../../types';
import { PricingModal } from './PricingModal';

interface PremiumGateProps {
  section: UnlockableSection;
  children: React.ReactNode;
  /** Optional unblurred preview shown above the blurred content */
  previewContent?: React.ReactNode;
  /** Custom label for what's being locked */
  label?: string;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({
  section,
  children,
  previewContent,
  label,
}) => {
  const { isSectionUnlocked } = usePremium();
  const [showPricing, setShowPricing] = useState(false);

  // If unlocked, render normally
  if (isSectionUnlocked(section)) {
    return <>{children}</>;
  }

  const sectionLabel = label || section.replace(/_/g, ' ');

  return (
    <>
      <div className="relative">
        {/* Preview content (not blurred) */}
        {previewContent && (
          <div className="mb-0">
            {previewContent}
          </div>
        )}

        {/* Blurred content with gradient fade */}
        <div className="relative overflow-hidden">
          <div className="blur-[6px] opacity-50 pointer-events-none select-none max-h-72">
            {/* Render a realistic static placeholder instead of children to prevent crashes
                when child widgets access undefined data */}
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">In-Depth Synthesis</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Advanced Vedic Insights & AI Analysis</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Based on the comprehensive principles of deep Vedic Astrology, this analysis explores hidden karmic ties, subtle doshas, and intricate planetary interlinks between both charts. The alignment indicates powerful focal points that govern the longevity, harmony, and deeper purpose of this union.
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  Specific planetary periods (Dashas) combined with divisional chart insights reveal exact timelines of vulnerability and peak resonance. Custom remedies are generated to harmonize conflicting energies and amplify the relationship's natural strengths.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                  <h5 className="font-semibold text-emerald-800 dark:text-emerald-400 mb-2 text-sm border-b border-emerald-200 dark:border-emerald-800/50 pb-1">Key Strengths</h5>
                  <ul className="text-xs text-emerald-700 dark:text-emerald-500 space-y-1.5 font-medium">
                    <li>• Natural Magnetic Pull</li>
                    <li>• Financial Prosperity Alignment</li>
                    <li>• Strong Interpersonal Empathy</li>
                  </ul>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-800/30">
                  <h5 className="font-semibold text-rose-800 dark:text-rose-400 mb-2 text-sm border-b border-rose-200 dark:border-rose-800/50 pb-1">Vulnerability Areas</h5>
                  <ul className="text-xs text-rose-700 dark:text-rose-500 space-y-1.5 font-medium">
                    <li>• Intermittent Communication Gaps</li>
                    <li>• Latent Ego Clashes</li>
                    <li>• External Family Dynamics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/95 dark:to-gray-900/95" />

          {/* Unlock CTA */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6 max-w-sm">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 capitalize">
                {sectionLabel}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Unlock detailed analysis, planetary breakdowns, and actionable remedies.
              </p>
              <button
                onClick={() => setShowPricing(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-4 h-4" />
                Unlock Full Analysis
              </button>
              <p className="text-xs text-gray-400 mt-2">₹49 / section • ₹169 full report</p>
            </div>
          </div>
        </div>
      </div>

      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        sectionId={section}
        sectionLabel={sectionLabel}
      />
    </>
  );
};
