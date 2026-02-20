/**
 * Global State Management - Zustand Store
 * Manages two chart states, report generation, and Supabase persistence.
 */

import { create } from 'zustand';
import { Chart, CompatibilityReport, BirthDataInput } from '@types';
import { generateFullCompatibilityReport } from '@lib/reportGenerator';
import { saveReport } from '../lib/supabaseService';
import { supabase } from '../lib/supabase';

interface AppState {
  // Chart states
  chartA: Chart | null;
  chartB: Chart | null;
  currentReport: CompatibilityReport | null;

  // UI states
  isLoading: boolean;
  error: string | null;
  activeTab: 'charts' | 'overview' | 'ashtakoot' | 'porutham' | 'synastry' | 'risks' | 'timing' | 'remedies' | 'sexual' | 'spouse' | 'divisional' | 'kp' | 'chara' | 'yogas' | 'addiction' | 'mental' | 'patterns' | 'psychology' | 'conflicts';
  viewMode: 'executive' | 'detailed';

  // Actions
  setChartA: (chart: Chart | null) => void;
  setChartB: (chart: Chart | null) => void;
  setCurrentReport: (report: CompatibilityReport) => void;
  generateReport: (birthDataA: BirthDataInput, birthDataB: BirthDataInput) => Promise<void>;
  clearReport: () => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  setViewMode: (mode: AppState['viewMode']) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial states
  chartA: null,
  chartB: null,
  currentReport: null,
  isLoading: false,
  error: null,
  activeTab: 'overview',
  viewMode: 'detailed',

  // Actions
  setChartA: (chart) => set({ chartA: chart }),

  setChartB: (chart) => set({ chartB: chart }),

  setCurrentReport: (report) => set({
    currentReport: report,
    chartA: report.chartA,
    chartB: report.chartB,
  }),

  generateReport: async (birthDataA, birthDataB) => {
    set({ isLoading: true, error: null });

    try {
      const report = await generateFullCompatibilityReport(birthDataA, birthDataB);
      set({
        currentReport: report,
        isLoading: false,
        chartA: report.chartA,
        chartB: report.chartB
      });

      // Auto-save to Supabase if user is logged in
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          await saveReport(session.user.id, report);
        }
      } catch (saveError) {
        // Don't fail the report generation if save fails
        console.warn('Auto-save to Supabase failed:', saveError);
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to generate report',
        isLoading: false
      });
    }
  },

  clearReport: () => set({
    currentReport: null,
    chartA: null,
    chartB: null
  }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setViewMode: (mode) => set({ viewMode: mode }),

  clearError: () => set({ error: null }),
}));