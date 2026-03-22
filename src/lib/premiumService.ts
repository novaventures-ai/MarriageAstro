/**
 * Premium Service
 * Supabase CRUD for plan tier management and section unlocking.
 */

import { supabase } from './supabase';
import { PlanTier, UnlockableSection } from '../types';

export interface PlanData {
  planTier: PlanTier;
  planExpiresAt: string | null;
  unlockedSections: UnlockableSection[];
  aiCreditsRemaining: number;
  aiCreditsResetAt: string | null;
}

const DEFAULT_PLAN: PlanData = {
  planTier: 'free',
  planExpiresAt: null,
  unlockedSections: [],
  aiCreditsRemaining: 3,
  aiCreditsResetAt: null,
};

export async function loadPlanTier(userId: string): Promise<PlanData> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('plan_tier, plan_expires_at, unlocked_sections, ai_credits_remaining, ai_credits_reset_at')
      .eq('id', userId)
      .single();

    if (error || !data) return DEFAULT_PLAN;

    // Check if plan has expired
    const tier = data.plan_tier as PlanTier || 'free';
    const expiresAt = data.plan_expires_at;
    const isExpired = expiresAt && new Date(expiresAt) < new Date();

    return {
      planTier: isExpired ? 'free' : tier,
      planExpiresAt: isExpired ? null : expiresAt,
      unlockedSections: (data.unlocked_sections as UnlockableSection[]) || [],
      aiCreditsRemaining: data.ai_credits_remaining ?? 3,
      aiCreditsResetAt: data.ai_credits_reset_at,
    };
  } catch {
    return DEFAULT_PLAN;
  }
}

export async function updatePlanTier(
  userId: string,
  tier: PlanTier,
  expiresAt?: string | null
): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update({
      plan_tier: tier,
      plan_expires_at: expiresAt ?? null,
    })
    .eq('id', userId);

  return !error;
}

export async function addUnlockedSection(
  userId: string,
  section: UnlockableSection
): Promise<boolean> {
  // Fetch current sections, append, save
  const { data } = await supabase
    .from('profiles')
    .select('unlocked_sections')
    .eq('id', userId)
    .single();

  const current: UnlockableSection[] = (data?.unlocked_sections as UnlockableSection[]) || [];
  if (current.includes(section)) return true;

  const updated = [...current, section];
  const { error } = await supabase
    .from('profiles')
    .update({ unlocked_sections: updated })
    .eq('id', userId);

  return !error;
}

export async function updateAiCredits(
  userId: string,
  credits: number,
  resetAt: string | null
): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update({
      ai_credits_remaining: credits,
      ai_credits_reset_at: resetAt,
    })
    .eq('id', userId);

  return !error;
}
