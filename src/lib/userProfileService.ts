/**
 * User Profile Service
 * Supabase CRUD operations for user profiles and partners
 */

import { supabase } from './supabase';
import { BirthDataInput, Chart } from '../types';
import { PartnerProfile, SelfAnalysisReport } from '../types/selfAnalysis';

/**
 * Save user profile (self chart)
 */
export async function saveUserProfile(
  userId: string,
  birthData: BirthDataInput,
  chart: Chart,
  report?: SelfAnalysisReport,
  email?: string
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: email || null,
      self_birth_data: {
        name: birthData.name,
        gender: birthData.gender,
        dateOfBirth: (birthData.dateOfBirth as any) instanceof Date
          ? (birthData.dateOfBirth as any).toISOString()
          : new Date(birthData.dateOfBirth).toISOString(),
        timeOfBirth: birthData.timeOfBirth,
        location: birthData.location,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone
      },
      self_chart: chart,
      self_report: report || null,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error saving user profile:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Failed to save user profile');
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<{
  birthData: BirthDataInput;
  chart: Chart;
  report?: SelfAnalysisReport;
} | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No profile found
      return null;
    }
    console.error('Error getting user profile:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Failed to get user profile');
  }

  if (!data || !data.self_birth_data || !data.self_chart) return null;

  return {
    birthData: {
      ...data.self_birth_data,
      dateOfBirth: new Date(data.self_birth_data.dateOfBirth)
    },
    chart: data.self_chart,
    report: data.self_report || undefined
  };
}

/**
 * Save partner
 */
export async function savePartner(
  userId: string,
  partner: PartnerProfile
): Promise<void> {
  const { error } = await supabase
    .from('partners')
    .upsert({
      id: partner.id,
      user_id: userId,
      name: partner.name,
      gender: partner.gender,
      date_of_birth: partner.dateOfBirth,
      time_of_birth: partner.timeOfBirth,
      location: partner.location,
      latitude: partner.latitude,
      longitude: partner.longitude,
      timezone: partner.timezone,
      chart: partner.chart || null,
      notes: partner.notes || null,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    });

  if (error) {
    console.error('Error saving partner:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Failed to save partner');
  }
}

/**
 * Get all partners for user
 */
export async function getUserPartners(userId: string): Promise<PartnerProfile[]> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getting partners:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Failed to get partners');
  }

  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    gender: item.gender,
    dateOfBirth: item.date_of_birth,
    timeOfBirth: item.time_of_birth,
    location: item.location,
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone,
    chart: item.chart || undefined,
    notes: item.notes || undefined,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at)
  }));
}

/**
 * Delete partner
 */
export async function deletePartner(partnerId: string): Promise<void> {
  const { error } = await supabase
    .from('partners')
    .delete()
    .eq('id', partnerId);

  if (error) {
    console.error('Error deleting partner:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Failed to delete partner');
  }
}

/**
 * Update partner
 */
export async function updatePartner(
  partnerId: string,
  updates: Partial<PartnerProfile>
): Promise<void> {
  const updateData: any = {
    updated_at: new Date().toISOString()
  };

  if (updates.name) updateData.name = updates.name;
  if (updates.gender) updateData.gender = updates.gender;
  if (updates.dateOfBirth) updateData.date_of_birth = updates.dateOfBirth;
  if (updates.timeOfBirth) updateData.time_of_birth = updates.timeOfBirth;
  if (updates.location) updateData.location = updates.location;
  if (updates.latitude !== undefined) updateData.latitude = updates.latitude;
  if (updates.longitude !== undefined) updateData.longitude = updates.longitude;
  if (updates.timezone) updateData.timezone = updates.timezone;
  if (updates.chart) updateData.chart = updates.chart;
  if (updates.notes !== undefined) updateData.notes = updates.notes;

  const { error } = await supabase
    .from('partners')
    .update(updateData)
    .eq('id', partnerId);

  if (error) {
    console.error('Error updating partner:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Failed to update partner');
  }
}

/**
 * Get partner by ID
 */
export async function getPartnerById(partnerId: string): Promise<PartnerProfile | null> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('id', partnerId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error getting partner:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Failed to get partner');
  }

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    gender: data.gender,
    dateOfBirth: data.date_of_birth,
    timeOfBirth: data.time_of_birth,
    location: data.location,
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    chart: data.chart || undefined,
    notes: data.notes || undefined,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
}

/**
 * Delete user profile and all partners
 */
export async function deleteUserProfile(userId: string): Promise<void> {
  // Delete partners first (cascade should handle this, but let's be explicit)
  const { error: partnersError } = await supabase
    .from('partners')
    .delete()
    .eq('user_id', userId);

  if (partnersError) {
    console.error('Error deleting partners:', partnersError instanceof Error ? partnersError.message : 'Unknown error');
    throw new Error('Failed to delete partners');
  }

  // Delete user profile
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (profileError) {
    console.error('Error deleting user profile:', profileError instanceof Error ? profileError.message : 'Unknown error');
    throw new Error('Failed to delete user profile');
  }
}

export default {
  saveUserProfile,
  getUserProfile,
  savePartner,
  getUserPartners,
  deletePartner,
  updatePartner,
  getPartnerById,
  deleteUserProfile
};
