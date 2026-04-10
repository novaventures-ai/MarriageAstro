import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useAppStore } from '../store/useAppStore';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { BirthDataInput, CompatibilityReport } from '@types';

export const QuickComparePage: React.FC = () => {
    const { partnerId } = useParams<{ partnerId: string }>();
    const navigate = useNavigate();

    const {
        partners,
        selfBirthData,
        isHydrated,
        loadPartners,
        userMode,
    } = useUserProfileStore();

    const { generateReport, isLoading: isStoreGenerating, error: reportError } = useAppStore();

    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [longWait, setLongWait] = useState(false);
    const [result, setResult] = useState<CompatibilityReport | null>(null);
    const hasProcessed = useRef(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        
        // Wait for hydration
        if (!isHydrated) return;

        // Prevent duplicate processing in Strict Mode
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        const processComparison = async () => {
            try {
                setIsProcessing(true);
                setError(null);
                setLongWait(false);

                // Start a timeout for long waits
                timeoutId = setTimeout(() => {
                    setLongWait(true);
                }, 10000); // 10 seconds

                // Ensure partners are loaded
                if (partners.length === 0) {
                    await loadPartners();
                }

                // 1. Validate Partner ID
                if (!partnerId) {
                    throw new Error('Partner ID is missing');
                }

                // 2. Validate Self Data
                if (!selfBirthData || !selfBirthData.dateOfBirth) {
                    throw new Error('Your profile is incomplete. Please complete your profile first.');
                }

                // 3. Find Partner
                const currentPartners = useUserProfileStore.getState().partners;
                const partner = currentPartners.find(p => p.id === partnerId);

                if (!partner) {
                    throw new Error('Partner not found');
                }

                // 4. Prepare Data for Report
                const personAData: BirthDataInput = {
                    name: selfBirthData.name || 'You',
                    gender: selfBirthData.gender || 'male',
                    dateOfBirth: typeof selfBirthData.dateOfBirth === 'string' ? selfBirthData.dateOfBirth : selfBirthData.dateOfBirth.toISOString().split('T')[0],
                    timeOfBirth: selfBirthData.timeOfBirth || '12:00',
                    location: selfBirthData.location || 'Unknown',
                    latitude: selfBirthData.latitude || 0,
                    longitude: selfBirthData.longitude || 0,
                    timezone: (selfBirthData.timezone || 5.5).toString()
                };

                const personBData: BirthDataInput = {
                    name: partner.name,
                    gender: partner.gender,
                    dateOfBirth: typeof partner.dateOfBirth === 'string' ? partner.dateOfBirth : partner.dateOfBirth.toISOString().split('T')[0],
                    timeOfBirth: partner.timeOfBirth,
                    location: partner.location,
                    latitude: partner.latitude,
                    longitude: partner.longitude,
                    timezone: partner.timezone.toString()
                };

                // 5. Generate Report
                await generateReport(personAData, personBData);

                // 6. Show result summary (with mode callout) before navigating
                const state = useAppStore.getState();
                if (!state.error) {
                    if (state.currentReport) {
                        setResult(state.currentReport);
                    } else {
                        navigate('/report');
                    }
                } else {
                    setError(state.error);
                }

            } catch (err: any) {
                console.error('Quick Compare Error:', err instanceof Error ? err.message : 'Unknown error');
                setError(err.message || 'Failed to generate comparison');
            } finally {
                setIsProcessing(false);
                if (timeoutId) clearTimeout(timeoutId);
            }
        };

        processComparison();
        
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [partnerId, isHydrated, navigate, generateReport, selfBirthData]); 


    if (result) {
        const partnerName = (() => {
            const currentPartners = useUserProfileStore.getState().partners;
            return currentPartners.find(p => p.id === partnerId)?.name ?? 'Partner';
        })();

        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors">
                <SEOHead
                    title="Compatibility Result"
                    description="Your compatibility result is ready."
                    path={`/quick-compare/${partnerId}`}
                />
                <div className="w-full max-w-md space-y-4">
                    {/* Score summary */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                            Compatibility with {partnerName}
                        </h2>
                        <div className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 my-4">
                            {result.overallScore}
                            <span className="text-2xl font-semibold text-gray-400">/100</span>
                        </div>
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                            {result.overallVerdict.replace('_', ' ')}
                        </span>
                    </div>

                    {/* Mode-specific interpretation callout */}
                    {userMode === 'decider' && (
                        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-5">
                            <p className="text-sm font-semibold text-rose-700 dark:text-rose-300 mb-1">
                                You&apos;re in Evaluation Mode
                            </p>
                            <p className="text-sm text-rose-600 dark:text-rose-400 mb-4">
                                This score directly answers &ldquo;should I proceed?&rdquo;
                            </p>
                            <button
                                onClick={() => navigate('/report')}
                                className="w-full px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm font-semibold"
                            >
                                Get Full Verdict &rarr;
                            </button>
                        </div>
                    )}

                    {userMode === 'navigator' && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5">
                            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
                                You&apos;re in Navigator Mode
                            </p>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                Use this report to understand your couple&apos;s ongoing dynamics.
                            </p>
                        </div>
                    )}

                    {/* Navigation actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/report')}
                            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
                        >
                            View Full Report
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 inline mr-2" />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (error || reportError) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Comparison Failed</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error || reportError}</p>
                    <div className="flex flex-col gap-3 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors">
            <SEOHead
                title="Quick Compatibility Check"
                description="Instant marriage compatibility analysis between your birth chart and a partner using Vedic astrology."
                path={`/quick-compare/${partnerId}`}
            />
            <div className="text-center max-w-sm">
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-indigo-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Analyzing Compatibility</h2>
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 animate-pulse">
                        {longWait ? "Synchronizing high-precision planetary ephemeris..." : "Aligning planetary positions..."}
                    </p>
                    
                    {longWait && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-900/30 text-left">
                            <p className="text-sm text-yellow-800 dark:text-yellow-400 font-medium mb-1 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Taking longer than usual
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-500 leading-relaxed">
                                This may happen if the calculation engine is warm-up or if the birth data is complex. Please hold on...
                            </p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                Force restart analysis
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuickComparePage;
