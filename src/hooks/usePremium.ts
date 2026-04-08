import { useUserProfileStore } from '../store/useUserProfileStore';
import { UnlockableSection } from '../types';

// Map individual section IDs to their Parent Categories
const SECTION_TO_CATEGORY: Record<string, string> = {
  // Who Are They Really? (cat_personality)
  'prediction': 'cat_personality',
  '7thhouse': 'cat_personality',
  'psychology': 'cat_personality',
  'patterns': 'cat_personality',
  'navamsa': 'cat_personality',
  'jaimini': 'cat_personality',
  'full_compat_report': 'cat_personality',
  'divisional_advanced': 'cat_personality',

  // What Could Go Wrong? (cat_risks)
  'radar': 'cat_risks',
  'conflict': 'cat_risks',
  'addiction': 'cat_risks',
  'mental': 'cat_risks',
  'vulnerable': 'cat_risks',
  'divorce_risk': 'cat_risks',
  'addiction_risk': 'cat_risks',
  'mental_health': 'cat_risks',
  'vulnerability_timeline': 'cat_risks',

  // Are We Deeply Compatible? (cat_chemistry)
  'sexual': 'cat_chemistry',
  'health': 'cat_chemistry',
  'synastry': 'cat_chemistry',
  'modern': 'cat_chemistry',
  'sexual_detail': 'cat_chemistry',

  // When & How to Proceed? (cat_timing)
  'timeline': 'cat_timing',
  'charadasha': 'cat_timing',
  'remedies': 'cat_timing',
  'kp_detail': 'cat_timing',
};

export const usePremium = () => {
  const planTier = useUserProfileStore((s) => s.planTier);
  const unlockedSections = useUserProfileStore((s) => s.unlockedSections);
  const aiCreditsRemaining = useUserProfileStore((s) => s.aiCreditsRemaining);
  const isAdmin = useUserProfileStore((s) => s.isAdmin);

  const isPremium = isAdmin || planTier === 'premium' || planTier === 'astrologer';

  const isSectionUnlocked = (section: UnlockableSection): boolean => {
    if (isPremium) return true;
    
    // Check if the individual section is unlocked
    if (unlockedSections.includes(section)) return true;

    // Check if the PARENT CATEGORY is unlocked
    const parentCategory = SECTION_TO_CATEGORY[section] as UnlockableSection;
    if (parentCategory && unlockedSections.includes(parentCategory)) return true;

    return false;
  };

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
