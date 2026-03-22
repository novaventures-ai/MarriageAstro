/**
 * Demo Page
 * Loads pre-configured demo profiles, generates reports, and redirects to dashboard.
 * Grants full astrologer-tier access so all premium sections are visible.
 */

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useAppStore } from '../store/useAppStore';
import { DEMO_SELF, DEMO_PARTNERS } from '../lib/demoData';
import { Sparkles, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { PlanTier } from '../types';

interface StepStatus {
  label: string;
  status: 'pending' | 'loading' | 'done' | 'error';
  detail?: string;
}

export const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  const hasStarted = useRef(false);
  const [steps, setSteps] = useState<StepStatus[]>([
    { label: 'Setting up demo profile', status: 'pending' },
    { label: 'Generating birth chart', status: 'pending' },
    { label: 'Analyzing marriage potential', status: 'pending' },
    { label: 'Adding partner profiles', status: 'pending' },
    { label: 'Generating compatibility report', status: 'pending' },
    { label: 'Unlocking all premium sections', status: 'pending' },
  ]);
  const [error, setError] = useState<string | null>(null);

  const updateStep = (index: number, update: Partial<StepStatus>) => {
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, ...update } : s));
  };

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const runDemo = async () => {
      const profileStore = useUserProfileStore.getState();
      const appStore = useAppStore.getState();

      try {
        // Step 0: Save real user state before entering demo mode
        const { selfChart, selfBirthData, selfReport, partners } = profileStore;
        useUserProfileStore.setState({
          _preDemoState: { selfChart, selfBirthData, selfReport, partners },
          partners: [],
          selectedPartnerId: null,
          selfChart: null,
          selfBirthData: {
            name: '', gender: 'male', dateOfBirth: '', timeOfBirth: '',
            location: '', latitude: 0, longitude: 0, timezone: '',
          },
          selfReport: null,
          quickCompareResult: null,
          isDemoMode: true,
        });
        useAppStore.setState({ currentReport: null, chartA: null, chartB: null });

        // Step 1: Set self birth data (auto-generates chart)
        updateStep(0, { status: 'loading' });
        await profileStore.setSelfBirthData(DEMO_SELF);
        updateStep(0, { status: 'done', detail: DEMO_SELF.name });

        // Step 2: Chart generated (happens inside setSelfBirthData)
        updateStep(1, { status: 'loading' });
        // Verify chart was generated
        const chartCheck = useUserProfileStore.getState().selfChart;
        if (!chartCheck) {
          throw new Error('Chart generation failed');
        }
        updateStep(1, { status: 'done', detail: `${chartCheck.ascendant} Ascendant` });

        // Step 3: Generate self analysis report
        updateStep(2, { status: 'loading' });
        await useUserProfileStore.getState().generateSelfReport();
        const reportCheck = useUserProfileStore.getState().selfReport;
        if (!reportCheck) {
          const genError = useUserProfileStore.getState().generationError;
          throw new Error(genError || 'Self report generation failed');
        }
        updateStep(2, { status: 'done', detail: 'Self analysis complete' });

        // Step 4: Add 3 partner profiles
        updateStep(3, { status: 'loading' });
        for (const partner of DEMO_PARTNERS) {
          await useUserProfileStore.getState().addPartner(partner);
        }
        updateStep(3, { status: 'done', detail: `${DEMO_PARTNERS.length} partners added` });

        // Step 5: Generate one compatibility report (self vs first partner)
        updateStep(4, { status: 'loading' });
        await appStore.generateReport(DEMO_SELF, DEMO_PARTNERS[0]);
        const compatCheck = useAppStore.getState().currentReport;
        if (!compatCheck) {
          const appError = useAppStore.getState().error;
          throw new Error(appError || 'Compatibility report generation failed');
        }
        updateStep(4, { status: 'done', detail: `${DEMO_SELF.name} × ${DEMO_PARTNERS[0].name}` });

        // Step 6: Grant full premium access
        updateStep(5, { status: 'loading' });
        useUserProfileStore.setState({
          planTier: 'astrologer' as PlanTier,
          planExpiresAt: null,
          aiCreditsRemaining: 999,
          isAdmin: false, // not admin, but astrologer tier for full access
        });
        updateStep(5, { status: 'done', detail: 'All sections unlocked' });

        // Brief pause to show completion, then redirect
        await new Promise(r => setTimeout(r, 800));
        navigate('/dashboard');

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        setError(message);
        // Mark current loading step as error
        setSteps(prev => prev.map(s => s.status === 'loading' ? { ...s, status: 'error' } : s));
      }
    };

    runDemo();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" showText={false} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-2">
            Setting Up Demo Mode
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Generating real astrological charts & reports for you to explore
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {step.status === 'done' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
                {step.status === 'loading' && (
                  <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                )}
                {step.status === 'pending' && (
                  <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                )}
                {step.status === 'error' && (
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">!</div>
                )}
              </div>

              {/* Label & Detail */}
              <div className="flex-grow min-w-0">
                <p className={`text-sm font-medium ${
                  step.status === 'done' ? 'text-gray-800 dark:text-gray-200' :
                  step.status === 'loading' ? 'text-indigo-600 dark:text-indigo-400' :
                  step.status === 'error' ? 'text-red-600 dark:text-red-400' :
                  'text-gray-400 dark:text-gray-500'
                }`}>
                  {step.label}
                </p>
                {step.detail && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {step.detail}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          <Sparkles className="w-3 h-3 inline mr-1" />
          All charts are calculated in real-time using Swiss Ephemeris
        </p>
      </div>
    </div>
  );
};

export default DemoPage;
