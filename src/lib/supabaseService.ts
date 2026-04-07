/**
 * Supabase Data Service
 * CRUD operations for birth charts and compatibility reports.
 * All functions require an authenticated user (userId).
 */

import { supabase } from './supabase';
import { Chart, CompatibilityReport, BirthDataInput } from '../types';
import type { ComparisonProfile } from '../../lib/comparisonScoring';

// ============================================================================
// TYPES
// ============================================================================

export interface SavedReportSummary {
    id: string;
    chart_a_name: string;
    chart_b_name: string;
    overall_score: number;
    overall_verdict: string;
    created_at: string;
}

export interface SavedChart {
    id: string;
    name_label: string;
    birth_date: string;
    birth_time: string;
    birth_place: string | null;
    lat: number | null;
    lon: number | null;
    chart_data: Record<string, unknown>;
    created_at: string;
}

export interface SavedComparisonSummary {
    id: string;
    profile_name: string;
    partner_count: number;
    created_at: string;
    updated_at: string;
}

// ============================================================================
// BIRTH CHARTS
// ============================================================================

/**
 * Save a birth chart for the logged-in user.
 */
export async function saveChart(
    userId: string,
    birthData: BirthDataInput,
    chartData: Chart
): Promise<{ id: string } | null> {
    const { data, error } = await supabase
        .from('birth_charts')
        .insert({
            user_id: userId,
            name_label: birthData.name,
            birth_date: birthData.dateOfBirth,
            birth_time: birthData.timeOfBirth,
            birth_place: birthData.location,
            lat: birthData.latitude,
            lon: birthData.longitude,
            chart_data: chartData as unknown as Record<string, unknown>,
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error saving chart:', error.message);
        return null;
    }

    return data;
}

/**
 * Load all saved charts for a user.
 */
export async function loadCharts(userId: string): Promise<SavedChart[]> {
    const { data, error } = await supabase
        .from('birth_charts')
        .select('id, name_label, birth_date, birth_time, birth_place, lat, lon, chart_data, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading charts:', error.message);
        return [];
    }

    return data || [];
}

// ============================================================================
// COMPATIBILITY REPORTS
// ============================================================================

/**
 * Save a compatibility report for the logged-in user.
 */
export async function saveReport(
    userId: string,
    report: CompatibilityReport
): Promise<{ id: string } | null> {

    // 1. Check if a report for this pair already exists
    const { data: existing } = await supabase
        .from('compatibility_reports')
        .select('id')
        .eq('user_id', userId)
        .eq('chart_a_name', report.chartA.name)
        .eq('chart_b_name', report.chartB.name)
        .maybeSingle();

    if (existing) {
        // 2. If it exists, update the existing report
        const { data, error } = await supabase
            .from('compatibility_reports')
            .update({
                overall_score: report.overallScore,
                overall_verdict: report.overallVerdict,
                report_data: report as unknown as Record<string, unknown>,
            })
            .eq('id', existing.id)
            .select('id')
            .maybeSingle();

        if (error) {
            console.error('Error updating existing report:', error.message);
            return null;
        }

        return data;
    }

    // 3. Otherwise, insert a new report
    const { data, error } = await supabase
        .from('compatibility_reports')
        .insert({
            user_id: userId,
            chart_a_name: report.chartA.name,
            chart_b_name: report.chartB.name,
            overall_score: report.overallScore,
            overall_verdict: report.overallVerdict,
            report_data: report as unknown as Record<string, unknown>,
        })
        .select('id')
        .maybeSingle();

    if (error) {
        console.error('Error saving report:', error.message);
        return null;
    }

    return data;
}

/**
 * Load summary list of all saved reports for a user (for the panel).
 */
export async function loadReportSummaries(userId: string): Promise<SavedReportSummary[]> {
    const { data, error } = await supabase
        .from('compatibility_reports')
        .select('id, chart_a_name, chart_b_name, overall_score, overall_verdict, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading report summaries:', error.message);
        return [];
    }

    return data || [];
}

/**
 * Load a single full report by ID.
 */
export async function loadFullReport(reportId: string): Promise<CompatibilityReport | null> {
    const { data, error } = await supabase
        .from('compatibility_reports')
        .select('report_data')
        .eq('id', reportId)
        .maybeSingle();

    if (error) {
        console.error('Error loading full report:', error.message);
        return null;
    }

    return data?.report_data as unknown as CompatibilityReport ?? null;
}

/**
 * Delete a saved report.
 */
export async function deleteReport(reportId: string): Promise<boolean> {
    const { error } = await supabase
        .from('compatibility_reports')
        .delete()
        .eq('id', reportId);

    if (error) {
        console.error('Error deleting report:', error.message);
        return false;
    }

    return true;
}

/**
 * Delete all saved reports for a user.
 */
export async function deleteAllReports(userId: string): Promise<boolean> {
    const { error } = await supabase
        .from('compatibility_reports')
        .delete()
        .eq('user_id', userId);

    if (error) {
        console.error('Error deleting all reports:', error.message);
        return false;
    }

    return true;
}

// ============================================================================
// PARTNER COMPARISONS
// ============================================================================

/**
 * Save a new comparison profile.
 */
export async function saveComparison(
    userId: string,
    comparison: ComparisonProfile
): Promise<{ id: string } | null> {
    const { data, error } = await supabase
        .from('partner_comparisons')
        .insert({
            user_id: userId,
            profile_name: comparison.profileName,
            profile_birth_data: comparison.profileBirthData as unknown as Record<string, unknown>,
            partners: comparison.partners as unknown as Record<string, unknown>[],
        })
        .select('id')
        .maybeSingle();

    if (error) {
        console.error('Error saving comparison:', error.message);
        return null;
    }

    return data;
}

/**
 * Update an existing comparison (e.g., after adding/removing partners or scores).
 */
export async function updateComparison(
    comparisonId: string,
    updates: {
        profile_name?: string;
        partners?: ComparisonProfile['partners'];
    }
): Promise<boolean> {
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.profile_name) updateData.profile_name = updates.profile_name;
    if (updates.partners) updateData.partners = updates.partners as unknown as Record<string, unknown>[];

    const { error } = await supabase
        .from('partner_comparisons')
        .update(updateData)
        .eq('id', comparisonId);

    if (error) {
        console.error('Error updating comparison:', error.message);
        return false;
    }

    return true;
}

/**
 * Load all comparisons for a user (summary list).
 */
export async function loadComparisons(userId: string): Promise<SavedComparisonSummary[]> {
    const { data, error } = await supabase
        .from('partner_comparisons')
        .select('id, profile_name, partners, created_at, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error loading comparisons:', error.message);
        return [];
    }

    return (data || []).map((row: { id: string; profile_name: string; partners: unknown[]; created_at: string; updated_at: string }) => ({
        id: row.id,
        profile_name: row.profile_name,
        partner_count: Array.isArray(row.partners) ? row.partners.length : 0,
        created_at: row.created_at,
        updated_at: row.updated_at,
    }));
}

/**
 * Load a single full comparison by ID.
 */
export async function loadFullComparison(comparisonId: string): Promise<ComparisonProfile | null> {
    const { data, error } = await supabase
        .from('partner_comparisons')
        .select('id, profile_name, profile_birth_data, partners, created_at')
        .eq('id', comparisonId)
        .maybeSingle();

    if (error) {
        console.error('Error loading comparison:', error.message);
        return null;
    }

    if (!data) return null;

    return {
        id: data.id,
        profileName: data.profile_name,
        profileBirthData: data.profile_birth_data as unknown as ComparisonProfile['profileBirthData'],
        partners: (data.partners || []) as unknown as ComparisonProfile['partners'],
        createdAt: data.created_at,
    };
}

/**
 * Delete a comparison.
 */
export async function deleteComparison(comparisonId: string): Promise<boolean> {
    const { error } = await supabase
        .from('partner_comparisons')
        .delete()
        .eq('id', comparisonId);

    if (error) {
        console.error('Error deleting comparison:', error.message);
        return false;
    }

    return true;
}
