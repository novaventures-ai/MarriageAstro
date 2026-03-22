/**
 * usePremium Hook
 * Provides premium state checks for gating features.
 */

import { useUserProfileStore } from '../store/useUserProfileStore';
import { UnlockableSection } from '../types';

export const usePremium = () => {
  const planTier = useUserProfileStore((s) => s.planTier);
  const unlockedSections = useUserProfileStore((s) => s.unlockedSections);
  const aiCreditsRemaining = useUserProfileStore((s) => s.aiCreditsRemaining);
  const isAdmin = useUserProfileStore((s) => s.isAdmin);

  const isPremium = isAdmin || planTier === 'premium' || planTier === 'astrologer';

  const isSectionUnlocked = (section: UnlockableSection): boolean =>
    isPremium || unlockedSections.includes(section);

  const canUseAI = isPremium || aiCreditsRemaining > 0;

  return {
    isPremium,
    isAdmin,
    planTier,
    isSectionUnlocked,
    canUseAI,
    aiCreditsRemaining,
  };
};
