/**
 * Comparison Store — Zustand slice for Multi-Partner Comparison System
 * 
 * Manages comparison profiles, partner lists, parallel report generation
 * with Promise.allSettled, and Supabase persistence for logged-in users.
 */

import { create } from 'zustand';
import { BirthDataInput, CompatibilityReport } from '@types';
import { generateFullCompatibilityReport } from '@lib/reportGenerator';
import {
    calculateComparisonScore,
    ComparisonProfile,
    PartnerComparisonEntry,
    ComparisonScore,
} from '@lib/comparisonScoring';
import {
    saveComparison,
    updateComparison,
    saveReport,
} from '../lib/supabaseService';
import { supabase } from '../lib/supabase';

// ============================================================================
// TYPES
// ============================================================================

interface ComparisonProgress {
    current: number;
    total: number;
    currentPartnerName: string;
}

interface ComparisonState {
    // State
    comparisonProfile: ComparisonProfile | null;
    comparisonProgress: ComparisonProgress | null;
    comparisonError: string | null;
    isComparing: boolean;

    // Reports cache (keyed by partner ID)
    partnerReports: Record<string, CompatibilityReport>;

    // Actions
    initComparison: (profileBirthData: BirthDataInput) => void;
    loadComparison: (profile: ComparisonProfile) => void;
    addPartner: (birthData: BirthDataInput) => void;
    removePartner: (partnerId: string) => void;
    runAllComparisons: () => Promise<void>;
    clearComparison: () => void;
    getPartnerReport: (partnerId: string) => CompatibilityReport | null;
}

// ============================================================================
// HELPERS
// ============================================================================

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

async function getLoggedInUserId(): Promise<string | null> {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.user?.id ?? null;
    } catch {
        return null;
    }
}

// ============================================================================
// STORE
// ============================================================================

export const useComparisonStore = create<ComparisonState>((set, get) => ({
    // Initial state
    comparisonProfile: null,
    comparisonProgress: null,
    comparisonError: null,
    isComparing: false,
    partnerReports: {},

    /**
     * Initialize a new comparison with the user's own birth data.
     */
    initComparison: (profileBirthData) => {
        const profile: ComparisonProfile = {
            id: generateId(),
            profileName: `${profileBirthData.name}'s Comparison`,
            profileBirthData: {
                name: profileBirthData.name,
                dateOfBirth: typeof profileBirthData.dateOfBirth === 'string' ? profileBirthData.dateOfBirth : profileBirthData.dateOfBirth.toISOString().split('T')[0],
                timeOfBirth: profileBirthData.timeOfBirth,
                location: profileBirthData.location,
                latitude: profileBirthData.latitude,
                longitude: profileBirthData.longitude,
                timezone: profileBirthData.timezone,
                gender: profileBirthData.gender,
            },
            partners: [],
            createdAt: new Date().toISOString(),
        };

        set({
            comparisonProfile: profile,
            comparisonError: null,
            partnerReports: {},
        });
    },

    /**
     * Load an existing comparison from Supabase.
     */
    loadComparison: (profile) => {
        set({
            comparisonProfile: profile,
            comparisonError: null,
            partnerReports: {},
        });
    },

    /**
     * Add a partner to the comparison (pending analysis).
     */
    addPartner: (birthData) => {
        const { comparisonProfile } = get();
        if (!comparisonProfile) return;

        const partner: PartnerComparisonEntry = {
            id: generateId(),
            name: birthData.name,
            birthData: {
                dateOfBirth: typeof birthData.dateOfBirth === 'string' ? birthData.dateOfBirth : birthData.dateOfBirth.toISOString().split('T')[0],
                timeOfBirth: birthData.timeOfBirth,
                location: birthData.location,
                gender: birthData.gender,
            },
            reportId: null,
            score: null,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        set({
            comparisonProfile: {
                ...comparisonProfile,
                partners: [...comparisonProfile.partners, partner],
            },
        });
    },

    /**
     * Remove a partner from the comparison.
     */
    removePartner: (partnerId) => {
        const { comparisonProfile, partnerReports } = get();
        if (!comparisonProfile) return;

        const updated = { ...partnerReports };
        delete updated[partnerId];

        set({
            comparisonProfile: {
                ...comparisonProfile,
                partners: comparisonProfile.partners.filter((p) => p.id !== partnerId),
            },
            partnerReports: updated,
        });
    },

    /**
     * Run all pending comparisons in parallel using Promise.allSettled().
     * Each partner gets a full compatibility report generated against the profile.
     * Partial failures are handled — successful reports still show.
     */
    runAllComparisons: async () => {
        const { comparisonProfile } = get();
        if (!comparisonProfile) return;

        const pendingPartners = comparisonProfile.partners.filter(
            (p) => p.status === 'pending' || p.status === 'failed'
        );

        if (pendingPartners.length === 0) return;

        set({
            isComparing: true,
            comparisonError: null,
            comparisonProgress: { current: 0, total: pendingPartners.length, currentPartnerName: '' },
        });

        // Mark all pending partners as 'analyzing'
        const updatedPartners = comparisonProfile.partners.map((p) =>
            pendingPartners.find((pp) => pp.id === p.id)
                ? { ...p, status: 'analyzing' as const }
                : p
        );
        set({
            comparisonProfile: { ...comparisonProfile, partners: updatedPartners },
        });

        // Build birth data for the profile owner
        const profileBirthData: BirthDataInput = {
            name: comparisonProfile.profileBirthData.name,
            gender: comparisonProfile.profileBirthData.gender as 'male' | 'female',
            dateOfBirth: comparisonProfile.profileBirthData.dateOfBirth,
            timeOfBirth: comparisonProfile.profileBirthData.timeOfBirth,
            location: comparisonProfile.profileBirthData.location,
            latitude: comparisonProfile.profileBirthData.latitude,
            longitude: comparisonProfile.profileBirthData.longitude,
            timezone: comparisonProfile.profileBirthData.timezone,
        };

        // Generate all reports in parallel
        const results = await Promise.allSettled(
            pendingPartners.map(async (partner, index) => {
                // Update progress
                set({
                    comparisonProgress: {
                        current: index + 1,
                        total: pendingPartners.length,
                        currentPartnerName: partner.name,
                    },
                });

                const partnerBirthData: BirthDataInput = {
                    name: partner.name,
                    gender: partner.birthData.gender as 'male' | 'female',
                    dateOfBirth: partner.birthData.dateOfBirth,
                    timeOfBirth: partner.birthData.timeOfBirth,
                    location: partner.birthData.location,
                    latitude: 0, // Will be geocoded in report generator
                    longitude: 0,
                    timezone: 'Asia/Kolkata', // Default; can be enhanced
                };

                const report = await generateFullCompatibilityReport(profileBirthData, partnerBirthData);
                const score = calculateComparisonScore(report);

                return { partnerId: partner.id, report, score };
            })
        );

        // Process results — handle both successes and failures
        const userId = await getLoggedInUserId();
        const newReports: Record<string, CompatibilityReport> = { ...get().partnerReports };
        const finalPartners = [...get().comparisonProfile!.partners];

        let successCount = 0;
        let failCount = 0;

        for (const result of results) {
            if (result.status === 'fulfilled') {
                const { partnerId, report, score } = result.value;
                newReports[partnerId] = report;

                // Update partner entry with score
                const partnerIdx = finalPartners.findIndex((p) => p.id === partnerId);
                if (partnerIdx >= 0) {
                    let reportId: string | null = null;

                    // Auto-save report to Supabase if logged in
                    if (userId) {
                        try {
                            const saved = await saveReport(userId, report);
                            reportId = saved?.id ?? null;
                        } catch (e) {
                            console.warn('Failed to save partner report:', e);
                        }
                    }

                    finalPartners[partnerIdx] = {
                        ...finalPartners[partnerIdx],
                        status: 'complete',
                        score,
                        reportId,
                    };
                }
                successCount++;
            } else {
                // Find which partner failed (by index in pendingPartners)
                const failedIdx = results.indexOf(result);
                const failedPartner = pendingPartners[failedIdx];
                if (failedPartner) {
                    const partnerIdx = finalPartners.findIndex((p) => p.id === failedPartner.id);
                    if (partnerIdx >= 0) {
                        finalPartners[partnerIdx] = {
                            ...finalPartners[partnerIdx],
                            status: 'failed',
                            error: result.reason?.message || 'Analysis failed',
                        };
                    }
                }
                failCount++;
            }
        }

        // Sort partners by score (completed first, by overall descending)
        finalPartners.sort((a, b) => {
            if (a.status === 'complete' && b.status !== 'complete') return -1;
            if (a.status !== 'complete' && b.status === 'complete') return 1;
            if (a.score && b.score) return b.score.overall - a.score.overall;
            return 0;
        });

        const updatedProfile: ComparisonProfile = {
            ...get().comparisonProfile!,
            partners: finalPartners,
        };

        // Save to Supabase if logged in
        if (userId) {
            try {
                if (updatedProfile.id.includes('-')) {
                    // Local ID — create new in Supabase
                    const saved = await saveComparison(userId, updatedProfile);
                    if (saved?.id) {
                        updatedProfile.id = saved.id;
                    }
                } else {
                    // Already has Supabase ID — update
                    await updateComparison(updatedProfile.id, { partners: finalPartners });
                }
            } catch (e) {
                console.warn('Failed to save comparison to Supabase:', e);
            }
        }

        set({
            comparisonProfile: updatedProfile,
            partnerReports: newReports,
            isComparing: false,
            comparisonProgress: null,
            comparisonError: failCount > 0
                ? `${failCount} of ${pendingPartners.length} analyses failed. ${successCount} completed successfully.`
                : null,
        });
    },

    /**
     * Clear the current comparison session.
     */
    clearComparison: () => {
        set({
            comparisonProfile: null,
            comparisonProgress: null,
            comparisonError: null,
            isComparing: false,
            partnerReports: {},
        });
    },

    /**
     * Get a cached report for a specific partner.
     */
    getPartnerReport: (partnerId) => {
        return get().partnerReports[partnerId] || null;
    },
}));
