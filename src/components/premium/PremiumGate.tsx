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
            {children}
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
        highlightSection={sectionLabel}
      />
    </>
  );
};
