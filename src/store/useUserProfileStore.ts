/**
 * User Profile Store
 * Manages self chart and partner profiles with persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Chart, BirthDataInput, PlanTier, UnlockableSection } from '../types';
import {
  SelfAnalysisReport,
  PartnerProfile,
  QuickCompareResult
} from '../types/selfAnalysis';
import { loadPlanTier } from '../lib/premiumService';
import { isAdminEmail } from '../lib/adminConfig';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { generateSelfAnalysisReport } from '../../lib/selfReportGenerator';
import {
  saveUserProfile,
  savePartner,
  deletePartner,
  getUserProfile,
  getUserPartners
} from '../lib/userProfileService';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface UserProfileState {
  // Self Profile
  selfChart: Chart | null;
  selfBirthData: BirthDataInput | null;
  selfReport: SelfAnalysisReport | null;
  isGeneratingReport: boolean;
  generationError: string | null;

  // Partners Management
  partners: PartnerProfile[];
  selectedPartnerId: string | null;
  isLoadingPartners: boolean;

  // Quick Compare
  quickCompareResult: QuickCompareResult | null;
  isComparing: boolean;

  // Premium
  planTier: PlanTier;
  planExpiresAt: string | null;
  unlockedSections: UnlockableSection[];
  aiCreditsRemaining: number;
  aiCreditsResetAt: string | null;
  isAdmin: boolean;

  // Hydration
  isHydrated: boolean;

  // Actions - Premium
  setPlanTier: (tier: PlanTier, expiresAt?: string | null) => void;
  unlockSection: (section: UnlockableSection) => void;
  useAiCredit: () => boolean;
  resetAiCredits: () => void;
  loadPlanFromCloud: (userId: string, email: string) => Promise<void>;

  // Actions - Self Profile
  setSelfBirthData: (data: BirthDataInput) => Promise<void>;
  generateSelfChart: () => Promise<void>;
  generateSelfReport: () => Promise<void>;
  updateSelfProfile: (data: Partial<BirthDataInput>) => void;
  clearSelfProfile: () => void;

  // Actions - Partners
  addPartner: (data: BirthDataInput) => Promise<string>;
  removePartner: (id: string) => Promise<void>;
  removeAllPartners: () => Promise<void>;
  updatePartner: (id: string, data: Partial<PartnerProfile>) => Promise<void>;
  selectPartner: (id: string | null) => void;
  loadPartners: () => Promise<void>;
  generatePartnerChart: (partnerId: string) => Promise<void>;

  // Actions - Compare
  quickCompareWithPartner: (partnerId: string) => Promise<void>;
  clearQuickCompare: () => void;

  // Actions - Persistence
  saveToCloud: () => Promise<void>;
  loadFromCloud: () => Promise<void>;

  // Hydration
  // Hydration
  setHydrated: (value: boolean) => void;

  // Reset
  reset: () => void;
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      // Reset Action
      reset: () => {
        set({
          selfChart: null,
          selfBirthData: null,
          selfReport: null,
          isGeneratingReport: false,
          generationError: null,
          partners: [],
          selectedPartnerId: null,
          isLoadingPartners: false,
          quickCompareResult: null,
          isComparing: false,
          planTier: 'free' as PlanTier,
          planExpiresAt: null,
          unlockedSections: [],
          aiCreditsRemaining: 3,
          aiCreditsResetAt: null,
          isAdmin: false,
          // keep isHydrated true to avoid hydration issues
        });
      },

      // Initial State
      selfChart: null,
      selfBirthData: null,
      selfReport: null,
      isGeneratingReport: false,
      generationError: null,

      partners: [],
      selectedPartnerId: null,
      isLoadingPartners: false,

      quickCompareResult: null,
      isComparing: false,

      // Premium State
      planTier: 'free' as PlanTier,
      planExpiresAt: null,
      unlockedSections: [] as UnlockableSection[],
      aiCreditsRemaining: 3,
      aiCreditsResetAt: null,
      isAdmin: false,

      isHydrated: false,

      // Premium Actions
      setPlanTier: (tier: PlanTier, expiresAt?: string | null) => {
        set({ planTier: tier, planExpiresAt: expiresAt ?? null });
      },

      unlockSection: (section: UnlockableSection) => {
        const current = get().unlockedSections;
        if (!current.includes(section)) {
          set({ unlockedSections: [...current, section] });
        }
      },

      useAiCredit: (): boolean => {
        const { isAdmin, planTier, aiCreditsRemaining } = get();
        // Admins and premium users have unlimited
        if (isAdmin || planTier === 'premium' || planTier === 'astrologer') return true;
        if (aiCreditsRemaining <= 0) return false;
        set({ aiCreditsRemaining: aiCreditsRemaining - 1 });
        return true;
      },

      resetAiCredits: () => {
        set({ aiCreditsRemaining: 3, aiCreditsResetAt: new Date().toISOString() });
      },

      loadPlanFromCloud: async (userId: string, email: string) => {
        // Admin emails always get full access
        if (isAdminEmail(email)) {
          set({ isAdmin: true, planTier: 'astrologer' as PlanTier, planExpiresAt: null });
          return;
        }

        try {
          const plan = await loadPlanTier(userId);

          // Reset AI credits daily
          const now = new Date();
          let credits = plan.aiCreditsRemaining;
          if (plan.aiCreditsResetAt) {
            const resetDate = new Date(plan.aiCreditsResetAt);
            if (now.getTime() - resetDate.getTime() > 24 * 60 * 60 * 1000) {
              credits = 3; // Reset to 3 free daily
            }
          }

          set({
            planTier: plan.planTier,
            planExpiresAt: plan.planExpiresAt,
            unlockedSections: plan.unlockedSections,
            aiCreditsRemaining: credits,
            aiCreditsResetAt: plan.aiCreditsResetAt,
            isAdmin: false,
          });
        } catch {
          // Default to free on error
          set({ planTier: 'free' as PlanTier, isAdmin: false });
        }
      },

      // Self Profile Actions
      setSelfBirthData: async (data: BirthDataInput) => {
        set({ selfBirthData: data });

        // Auto-generate chart
        try {
          const chart = await generateChartFromBirthData(data);
          set({ selfChart: chart });

          // Auto-save to cloud if logged in
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await saveUserProfile(session.user.id, data, chart);
          }
        } catch (error) {
          console.error('Failed to generate chart:', error instanceof Error ? error.message : 'Unknown error');
          set({ generationError: 'Failed to generate chart. Please check your birth data.' });
        }
      },

      generateSelfChart: async () => {
        const { selfBirthData } = get();
        if (!selfBirthData) {
          set({ generationError: 'No birth data available' });
          return;
        }

        try {
          const chart = await generateChartFromBirthData(selfBirthData);
          set({ selfChart: chart, generationError: null });

          // Save to cloud
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await saveUserProfile(session.user.id, selfBirthData, chart);
          }
        } catch (error) {
          console.error('Failed to generate chart:', error instanceof Error ? error.message : 'Unknown error');
          set({ generationError: 'Failed to generate chart' });
        }
      },

      generateSelfReport: async () => {
        const { selfChart, selfBirthData } = get();

        if (!selfChart || !selfBirthData) {
          set({ generationError: 'Chart or birth data missing' });
          return;
        }

        // Consume an AI credit for free users (admins/premium have unlimited)
        const creditUsed = get().useAiCredit();
        if (!creditUsed) {
          set({ generationError: 'Daily free analysis limit reached (3/day). Upgrade to Premium for unlimited reports.' });
          return;
        }

        set({ isGeneratingReport: true, generationError: null });

        try {
          const report = await generateSelfAnalysisReport(selfBirthData, selfChart);
          set({ selfReport: report, isGeneratingReport: false });

          // Save report to cloud
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await saveUserProfile(session.user.id, selfBirthData, selfChart, report);
          }
        } catch (error) {
          console.error('Failed to generate report:', error instanceof Error ? error.message : 'Unknown error');
          set({
            generationError: 'Failed to generate report. Please try again.',
            isGeneratingReport: false
          });
        }
      },

      updateSelfProfile: (data: Partial<BirthDataInput>) => {
        const { selfBirthData } = get();
        if (selfBirthData) {
          set({ selfBirthData: { ...selfBirthData, ...data } });
        }
      },

      clearSelfProfile: () => {
        set({
          selfChart: null,
          selfBirthData: null,
          selfReport: null,
          generationError: null
        });
      },

      // Partner Management Actions
      addPartner: async (data: BirthDataInput) => {
        const partnerId = uuidv4();

        const newPartner: PartnerProfile = {
          id: partnerId,
          name: data.name,
          gender: data.gender,
          dateOfBirth: (data.dateOfBirth as any) instanceof Date
            ? (data.dateOfBirth as any).toISOString()
            : new Date(data.dateOfBirth).toISOString(),
          timeOfBirth: data.timeOfBirth,
          location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Add to local state
        set(state => ({
          partners: [...state.partners, newPartner]
        }));

        // Save to cloud
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await savePartner(session.user.id, newPartner);
          }
        } catch (error) {
          console.error('Failed to save partner to cloud:', error instanceof Error ? error.message : 'Unknown error');
        }

        return partnerId;
      },

      removePartner: async (id: string) => {
        // Remove from local state
        set(state => ({
          partners: state.partners.filter(p => p.id !== id),
          selectedPartnerId: state.selectedPartnerId === id ? null : state.selectedPartnerId
        }));

        // Remove from cloud
        try {
          await deletePartner(id);
        } catch (error) {
          console.error('Failed to delete partner:', error instanceof Error ? error.message : 'Unknown error');
        }
      },

      removeAllPartners: async () => {
        const currentPartners = get().partners;

        // Clear local state immediately
        set({ partners: [], selectedPartnerId: null });

        // Delete each from cloud
        for (const partner of currentPartners) {
          try {
            await deletePartner(partner.id);
          } catch (error) {
            console.error('Failed to delete partner:', error instanceof Error ? error.message : 'Unknown error');
          }
        }
      },

      updatePartner: async (id: string, data: Partial<PartnerProfile>) => {
        set(state => ({
          partners: state.partners.map(p =>
            p.id === id ? { ...p, ...data, updatedAt: new Date() } : p
          )
        }));

        // Update in cloud
        try {
          const partner = get().partners.find(p => p.id === id);
          if (partner) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              await savePartner(session.user.id, { ...partner, ...data });
            }
          }
        } catch (error) {
          console.error('Failed to update partner:', error instanceof Error ? error.message : 'Unknown error');
        }
      },

      selectPartner: (id: string | null) => {
        set({ selectedPartnerId: id });
      },

      loadPartners: async () => {
        set({ isLoadingPartners: true });

        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const partners = await getUserPartners(session.user.id);
            set({ partners, isLoadingPartners: false });
          } else {
            set({ isLoadingPartners: false });
          }
        } catch (error) {
          console.error('Failed to load partners:', error instanceof Error ? error.message : 'Unknown error');
          set({ isLoadingPartners: false });
        }
      },

      generatePartnerChart: async (partnerId: string) => {
        const partner = get().partners.find(p => p.id === partnerId);
        if (!partner || partner.chart) return;

        try {
          const birthData: BirthDataInput = {
            name: partner.name,
            gender: partner.gender,
            dateOfBirth: new Date(partner.dateOfBirth),
            timeOfBirth: partner.timeOfBirth,
            location: partner.location,
            latitude: partner.latitude,
            longitude: partner.longitude,
            timezone: partner.timezone
          };

          const chart = await generateChartFromBirthData(birthData);

          // Update partner with chart
          await get().updatePartner(partnerId, { chart });
        } catch (error) {
          console.error('Failed to generate partner chart:', error instanceof Error ? error.message : 'Unknown error');
        }
      },

      // Quick Compare Actions
      quickCompareWithPartner: async (partnerId: string) => {
        const { selfChart, partners } = get();
        const partner = partners.find(p => p.id === partnerId);

        if (!selfChart || !partner) return;

        set({ isComparing: true, quickCompareResult: null });

        try {
          // Ensure partner has chart
          if (!partner.chart) {
            await get().generatePartnerChart(partnerId);
          }

          const updatedPartner = get().partners.find(p => p.id === partnerId);
          if (!updatedPartner?.chart) {
            throw new Error('Failed to generate partner chart');
          }

          // Perform quick comparison
          const result = await performQuickCompare(selfChart, updatedPartner);
          set({ quickCompareResult: result, isComparing: false });
        } catch (error) {
          console.error('Quick compare failed:', error instanceof Error ? error.message : 'Unknown error');
          set({ isComparing: false });
        }
      },

      clearQuickCompare: () => {
        set({ quickCompareResult: null });
      },

      // Persistence Actions
      saveToCloud: async () => {
        const { selfBirthData, selfChart, selfReport, partners } = get();

        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) return;

          // Save self profile
          if (selfBirthData && selfChart) {
            await saveUserProfile(session.user.id, selfBirthData, selfChart, selfReport || undefined);
          }

          // Save partners
          for (const partner of partners) {
            await savePartner(session.user.id, partner);
          }
        } catch (error) {
          console.error('Failed to save to cloud:', error instanceof Error ? error.message : 'Unknown error');
        }
      },

      loadFromCloud: async () => {
        set({ isLoadingPartners: true });

        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) {
            set({ isLoadingPartners: false });
            return;
          }

          const state = get();
          let mergedPartners = [...state.partners];

          // 1. Handle Self Profile robustly
          try {
            const profile = await getUserProfile(session.user.id);

            if (state.selfBirthData) {
              // Local data exists, try to push to cloud
              if (state.selfChart) {
                try {
                  await saveUserProfile(session.user.id, state.selfBirthData, state.selfChart, state.selfReport || undefined);
                } catch (saveProfileErr) {
                  console.warn('Failed to push local self profile to cloud');
                }
              }
            } else if (profile) {
              // No local data, safely load from cloud
              set({
                selfBirthData: profile.birthData,
                selfChart: profile.chart,
                selfReport: profile.report || null
              });
            }
          } catch (profileErr) {
            console.error('Error fetching user profile from cloud:', profileErr instanceof Error ? profileErr.message : 'Unknown error');
          }

          // 2. Safely push any local guest partners to cloud
          // A valid Supabase UUID check
          const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

          if (mergedPartners.length > 0) {
            let stateUpdated = false;

            for (let i = 0; i < mergedPartners.length; i++) {
              let partner = { ...mergedPartners[i] };

              // Validate and fix legacy IDs that aren't valid UUIDs
              if (!isUUID(partner.id)) {
                partner.id = uuidv4();
                mergedPartners[i] = partner;
                stateUpdated = true;
              }

              try {
                await savePartner(session.user.id, partner);
              } catch (savePartnerErr) {
                console.warn('Failed to push local partner to cloud');
              }
            }

            // If we fixed any IDs, persist the new IDs immediately so local storage is updated
            if (stateUpdated) {
              set({ partners: mergedPartners });
            }
          }

          // 3. Finally, load cloud partners and merge them safely with local ones
          try {
            const cloudPartners = await getUserPartners(session.user.id);

            // Merge logic: prefer cloud data, but keep local data if it failed to push
            const cloudIds = new Set(cloudPartners.map(p => p.id));
            const localOnlyPartners = mergedPartners.filter(p => !cloudIds.has(p.id));

            const finalPartners = [...cloudPartners, ...localOnlyPartners];
            set({ partners: finalPartners, isLoadingPartners: false });
          } catch (cloudPartnersErr) {
            console.error('Error fetching partners from cloud:', cloudPartnersErr);
            set({ isLoadingPartners: false });
          }

        } catch (error) {
          console.error('Critical failure in loadFromCloud:', error instanceof Error ? error.message : 'Unknown error');
          set({ isLoadingPartners: false });
        }
      },

      // Hydration
      setHydrated: (value: boolean) => {
        set({ isHydrated: value });
      }
    }),
    {
      name: 'user-profile-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selfBirthData: state.selfBirthData,
        selfChart: state.selfChart,
        selfReport: state.selfReport,
        partners: state.partners,
        selectedPartnerId: state.selectedPartnerId,
        planTier: state.planTier,
        planExpiresAt: state.planExpiresAt,
        unlockedSections: state.unlockedSections,
        aiCreditsRemaining: state.aiCreditsRemaining,
        aiCreditsResetAt: state.aiCreditsResetAt,
        // NOTE: isAdmin is intentionally NOT persisted to prevent
        // privilege leakage between accounts on the same browser.
        // It is always re-derived from the user's email via loadPlanFromCloud.
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      }
    }
  )
);

// Helper function for quick comparison
async function performQuickCompare(
  selfChart: Chart,
  partner: PartnerProfile
): Promise<QuickCompareResult> {
  if (!partner.chart) {
    throw new Error('Partner chart not available');
  }

  // Simple compatibility check
  const selfMoon = selfChart.planetaryPositions.find(p => p.planet === 'Moon');
  const partnerMoon = partner.chart.planetaryPositions.find(p => p.planet === 'Moon');

  const selfVenus = selfChart.planetaryPositions.find(p => p.planet === 'Venus');
  const partnerVenus = partner.chart.planetaryPositions.find(p => p.planet === 'Venus');

  // Calculate basic compatibility
  let score = 50; // Base score

  // Moon sign compatibility
  if (selfMoon && partnerMoon) {
    if (selfMoon.sign === partnerMoon.sign) score += 15;
    else if (areSignsCompatible(selfMoon.sign, partnerMoon.sign)) score += 10;
  }

  // Venus compatibility
  if (selfVenus && partnerVenus) {
    if (selfVenus.sign === partnerVenus.sign) score += 10;
    else if (areSignsCompatible(selfVenus.sign, partnerVenus.sign)) score += 5;
  }

  // Manglik check
  const selfManglik = isManglik(selfChart);
  const partnerManglik = isManglik(partner.chart);
  const manglikMatch = selfManglik === partnerManglik ? 'match' : 'mismatch';

  if (manglikMatch === 'match') score += 10;
  else score -= 10;

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine vibe
  let overallVibe: QuickCompareResult['overallVibe'];
  if (score >= 80) overallVibe = 'excellent';
  else if (score >= 60) overallVibe = 'good';
  else if (score >= 40) overallVibe = 'neutral';
  else if (score >= 20) overallVibe = 'challenging';
  else overallVibe = 'poor';

  return {
    partnerId: partner.id,
    partnerName: partner.name,
    overallVibe,
    score,
    moonCompatibility: score > 70 ? 'high' : score > 40 ? 'medium' : 'low',
    venusCompatibility: score > 60 ? 'high' : score > 30 ? 'medium' : 'low',
    manglikMatch,
    strengths: score > 60 ? ['Good basic compatibility'] : [],
    challenges: score < 40 ? ['May need more analysis'] : [],
    recommendation: score > 70
      ? 'Good potential! Consider full analysis.'
      : score > 40
        ? 'Moderate compatibility. Check full report for details.'
        : 'Challenging match. Full analysis recommended.',
    fullReportAvailable: true
  };
}

function areSignsCompatible(sign1: string, sign2: string): boolean {
  const compatibleGroups = [
    ['Aries', 'Leo', 'Sagittarius'], // Fire
    ['Taurus', 'Virgo', 'Capricorn'], // Earth
    ['Gemini', 'Libra', 'Aquarius'], // Air
    ['Cancer', 'Scorpio', 'Pisces'] // Water
  ];

  return compatibleGroups.some(group =>
    group.includes(sign1) && group.includes(sign2)
  );
}

function isManglik(chart: Chart): boolean {
  const mars = chart.planetaryPositions.find(p => p.planet === 'Mars');
  if (!mars) return false;

  // Manglik if Mars in 1, 2, 4, 7, 8, or 12th house
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  return manglikHouses.includes(mars.house);
}

export default useUserProfileStore;
