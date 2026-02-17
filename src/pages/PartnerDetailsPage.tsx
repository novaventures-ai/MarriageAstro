import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { PartnerProfile } from '../types/selfAnalysis';
import { User, Calendar, MapPin, Clock, Scale, ArrowLeft, Trash2, Heart, Sparkles, Activity } from 'lucide-react';

export const PartnerDetailsPage: React.FC = () => {
    const { partnerId } = useParams<{ partnerId: string }>();
    const navigate = useNavigate();
    const { partners, removePartner, isHydrated, loadPartners } = useUserProfileStore();
    const [partner, setPartner] = useState<PartnerProfile | null>(null);

    useEffect(() => {
        if (!isHydrated) return;

        const found = partners.find(p => p.id === partnerId);
        if (found) {
            setPartner(found);
        } else if (partnerId) {
            // Try loading from cloud if not found in local store
            loadPartners();
        }
    }, [partnerId, partners, isHydrated, loadPartners]);

    const handleDelete = async () => {
        if (!partnerId) return;
        if (window.confirm('Are you sure you want to remove this partner?')) {
            await removePartner(partnerId);
            navigate('/');
        }
    };

    if (!partner) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading partner details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 transition-colors">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Dashboard</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove Partner"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Hero */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-700">
                    <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-3xl font-bold text-pink-600 shadow-lg">
                                {partner.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                    <div className="pt-16 pb-8 px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                        {partner.name}
                                    </h1>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${partner.gender === 'male' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                                        }`}>
                                        {partner.gender}
                                    </span>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-purple-500" />
                                    Active Profile • Added {new Date(partner.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <button
                                onClick={() => navigate(`/quick-compare/${partner.id}`)}
                                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <Scale className="w-5 h-5" />
                                Run Compatibility Analysis
                            </button>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Birth Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                            Birth Details
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                                        {new Date(partner.dateOfBirth).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Time of Birth</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">{partner.timeOfBirth}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Birth Location</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">{partner.location}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {partner.latitude.toFixed(4)}°N, {partner.longitude.toFixed(4)}°E (TZ: {partner.timezone})
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats or Notes */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-pink-500" />
                            Personal Notes
                        </h3>

                        <div className="flex-1 flex flex-col">
                            {partner.notes ? (
                                <p className="text-gray-600 dark:text-gray-300 italic">
                                    "{partner.notes}"
                                </p>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                                        <Edit2 className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No notes added for this partner yet.</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800/50">
                            <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <strong>Pro Tip:</strong> Compare this profile with your own to see soulmate indicators and potential challenges.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Internal icon for missing Edit2 import
const Edit2 = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);

export default PartnerDetailsPage;
