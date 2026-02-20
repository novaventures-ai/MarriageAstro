import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useAppStore } from '../store/useAppStore';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { BirthDataInput } from '@types';

export const QuickComparePage: React.FC = () => {
    const { partnerId } = useParams<{ partnerId: string }>();
    const navigate = useNavigate();

    const {
        partners,
        selfBirthData,
        isHydrated,
        loadPartners
    } = useUserProfileStore();

    const { generateReport, isLoading: isGenerating, error: reportError } = useAppStore();

    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Wait for hydration
        if (!isHydrated) return;

        const processComparison = async () => {
            try {
                setIsProcessing(true);
                setError(null);

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
                    // Redirect to self-calculator if profile incomplete
                    // But let's show error for now
                    throw new Error('Your profile is incomplete. Please complete your profile first.');
                }

                // 3. Find Partner
                // We need to re-fetch from store to get latest partners list after loadPartners
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

                // 6. Navigate to Report
                const state = useAppStore.getState();
                if (!state.error) {
                    navigate('/report');
                } else {
                    setError(state.error);
                }

            } catch (err: any) {
                console.error('Quick Compare Error:', err);
                setError(err.message || 'Failed to generate comparison');
            } finally {
                setIsProcessing(false);
            }
        };

        processComparison();
    }, [partnerId, isHydrated, navigate, generateReport, selfBirthData]); // Depend on primary stable references


    if (error || reportError) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Comparison Failed</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error || reportError}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors">
            <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-indigo-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Analyzing Compatibility</h2>
                <p className="text-gray-600 dark:text-gray-400 animate-pulse">
                    Aligning planetary positions...
                </p>
            </div>
        </div>
    );
};

export default QuickComparePage;
