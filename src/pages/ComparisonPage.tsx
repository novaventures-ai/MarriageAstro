/**
 * ComparisonPage — Multi-Partner Comparison Dashboard
 * 
 * 3-section layout:
 * 1. Your Profile — birth data input (reuses BirthDataForm)
 * 2. Partners — add/remove partners
 * 3. Results — ranked comparison (appears after analysis)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    UserPlus,
    Users,
    Play,
    Trash2,
    Clock,
    CheckCircle2,
    AlertCircle,
    Sparkles,
} from 'lucide-react';
import { BirthDataForm } from '../components/BirthDataForm';
import { ComparisonProgressBar } from '../components/ui/ComparisonProgressBar';
import { ComparisonResultsPanel } from '../components/ui/ComparisonResultsPanel';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { AuthButton } from '../components/ui/AuthButton';
import { useComparisonStore } from '../store/useComparisonStore';
import { SEOHead } from '../components/SEOHead';
import { BirthDataInput } from '@types';

type PageStep = 'profile' | 'partners' | 'results';

export const ComparisonPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<PageStep>('profile');
    const [showAddForm, setShowAddForm] = useState(false);

    const {
        comparisonProfile,
        isComparing,
        comparisonProgress,
        initComparison,
        addPartner,
        removePartner,
        runAllComparisons,
    } = useComparisonStore();

    // ── Step 1: Profile submitted
    const handleProfileSubmit = (data: BirthDataInput) => {
        initComparison(data);
        setStep('partners');
    };

    // ── Add partner
    const handleAddPartner = (data: BirthDataInput) => {
        addPartner(data);
        setShowAddForm(false);
    };

    // ── Run comparisons
    const handleRunComparison = async () => {
        setStep('results');
        await runAllComparisons();
    };

    const pendingCount = comparisonProfile?.partners.filter(
        (p) => p.status === 'pending' || p.status === 'failed'
    ).length || 0;

    const completedCount = comparisonProfile?.partners.filter(
        (p) => p.status === 'complete'
    ).length || 0;

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-500">
            <SEOHead
                title="Partner Compatibility Comparison"
                description="Compare marriage compatibility between multiple partners using Ashtakoot Milan scoring, Mangal Dosha analysis, and Vedic astrology insights."
                path="/comparison"
            />
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur-md dark:bg-black/10 transition-colors duration-500">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Back</span>
                </button>
                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                    Partner Comparison
                </h1>
                <div className="flex items-center gap-3">
                    <AuthButton />
                    <ThemeToggle />
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Step indicator */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {[
                            { key: 'profile', label: 'Your Profile', icon: '👤' },
                            { key: 'partners', label: 'Add Partners', icon: '👥' },
                            { key: 'results', label: 'Results', icon: '🏆' },
                        ].map((s, i) => (
                            <React.Fragment key={s.key}>
                                {i > 0 && (
                                    <div className={`w-8 h-0.5 ${['profile', 'partners', 'results'].indexOf(step) >= i
                                        ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
                                        } transition-colors`} />
                                )}
                                <button
                                    onClick={() => {
                                        if (s.key === 'profile') setStep('profile');
                                        if (s.key === 'partners' && comparisonProfile) setStep('partners');
                                        if (s.key === 'results' && completedCount > 0) setStep('results');
                                    }}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${step === s.key
                                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }`}
                                >
                                    <span>{s.icon}</span>
                                    <span className="hidden sm:inline">{s.label}</span>
                                </button>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* STEP 1: Profile Setup */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    {step === 'profile' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">
                                    Your Birth Details
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 transition-colors">
                                    Enter your birth data first. All partners will be compared against your chart.
                                </p>
                            </div>
                            <BirthDataForm
                                onSubmit={handleProfileSubmit}
                                defaultValues={comparisonProfile ? {
                                    name: comparisonProfile.profileBirthData.name,
                                    gender: comparisonProfile.profileBirthData.gender as 'male' | 'female',
                                    dateOfBirth: comparisonProfile.profileBirthData.dateOfBirth,
                                    timeOfBirth: comparisonProfile.profileBirthData.timeOfBirth,
                                    location: comparisonProfile.profileBirthData.location,
                                    latitude: comparisonProfile.profileBirthData.latitude,
                                    longitude: comparisonProfile.profileBirthData.longitude,
                                    timezone: comparisonProfile.profileBirthData.timezone,
                                } : undefined}
                            />
                        </div>
                    )}

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* STEP 2: Add Partners */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    {step === 'partners' && comparisonProfile && (
                        <div className="space-y-6">
                            {/* Profile summary */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium transition-colors">Your Profile</p>
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 transition-colors">
                                            {comparisonProfile.profileBirthData.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                                            {comparisonProfile.profileBirthData.dateOfBirth} • {comparisonProfile.profileBirthData.location}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setStep('profile')}
                                        className="text-sm text-indigo-500 hover:text-indigo-700 transition-colors"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>

                            {/* Partner list */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 transition-colors">
                                        <Users className="w-5 h-5 text-purple-500" />
                                        Partners ({comparisonProfile.partners.length})
                                    </h3>
                                    {!showAddForm && (
                                        <button
                                            onClick={() => setShowAddForm(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors text-sm font-medium"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Add Partner
                                        </button>
                                    )}
                                </div>

                                {/* Empty state */}
                                {comparisonProfile.partners.length === 0 && !showAddForm && (
                                    <div className="text-center py-12">
                                        <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">
                                            No partners added yet. Add birth details to compare.
                                        </p>
                                        <button
                                            onClick={() => setShowAddForm(true)}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all"
                                        >
                                            <UserPlus className="w-5 h-5" />
                                            Add First Partner
                                        </button>
                                    </div>
                                )}

                                {/* Partner entries */}
                                {comparisonProfile.partners.length > 0 && (
                                    <div className="space-y-3 mb-4">
                                        {comparisonProfile.partners.map((partner) => (
                                            <div
                                                key={partner.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <StatusIcon status={partner.status} />
                                                    <div>
                                                        <p className="font-medium text-gray-800 dark:text-gray-100 transition-colors">
                                                            {partner.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                                                            {partner.birthData.dateOfBirth} • {partner.birthData.location}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removePartner(partner.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add form */}
                                {showAddForm && (
                                    <div className="mt-4 p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 transition-colors">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium text-gray-700 dark:text-gray-200 transition-colors">
                                                Add Partner Birth Details
                                            </h4>
                                            <button
                                                onClick={() => setShowAddForm(false)}
                                                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        <BirthDataForm onSubmit={handleAddPartner} />
                                    </div>
                                )}
                            </div>

                            {/* Run comparison button */}
                            {pendingCount > 0 && (
                                <button
                                    onClick={handleRunComparison}
                                    disabled={isComparing}
                                    className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                                >
                                    <Play className="w-6 h-6" />
                                    Compare {pendingCount} Partner{pendingCount !== 1 ? 's' : ''}
                                    <Sparkles className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* ═══════════════════════════════════════════════════════════ */}
                    {/* STEP 3: Results */}
                    {/* ═══════════════════════════════════════════════════════════ */}
                    {step === 'results' && (
                        <div className="space-y-6">
                            {/* Progress bar during analysis */}
                            {isComparing && comparisonProgress && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
                                    <ComparisonProgressBar
                                        current={comparisonProgress.current}
                                        total={comparisonProgress.total}
                                        currentPartnerName={comparisonProgress.currentPartnerName}
                                    />
                                </div>
                            )}

                            {/* Results panel */}
                            {!isComparing && <ComparisonResultsPanel />}

                            {/* Action buttons */}
                            {!isComparing && completedCount > 0 && (
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => setStep('partners')}
                                        className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:shadow-md transition-all font-medium"
                                    >
                                        Add More Partners
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// ── Status icon helper
const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
    switch (status) {
        case 'complete':
            return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
        case 'analyzing':
            return <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />;
        case 'failed':
            return <AlertCircle className="w-5 h-5 text-red-500" />;
        default:
            return <Clock className="w-5 h-5 text-gray-400" />;
    }
};

export default ComparisonPage;
