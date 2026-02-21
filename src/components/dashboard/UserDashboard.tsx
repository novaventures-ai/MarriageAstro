/**
 * User Dashboard Component
 * Shows self profile and saved partners
 */

import { useNavigate } from 'react-router-dom';
import { useUserProfileStore } from '../../store/useUserProfileStore';
import { User, Plus, Trash2, Edit2, Scale, ChevronRight, Star, Sparkles } from 'lucide-react';
import { calculateAshtakootMilan } from '../../../lib/compatibilityCalculations';
import { generateChartFromBirthData } from '../../../lib/reportGenerator';
import { CosmicMatchWidget } from './CosmicMatchWidget';
import { generateMatchInsight } from '../../../lib/ai/matchInsight';
import React, { useState, useEffect } from 'react';

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    selfChart,
    selfBirthData,
    partners,
    selectedPartnerId,
    isLoadingPartners,
    removePartner,
    removeAllPartners,
    selectPartner,
    loadFromCloud,
    isHydrated,
    clearSelfProfile
  } = useUserProfileStore();

  const [partnerScores, setPartnerScores] = useState<Record<string, { score: number, verdict: string }>>({});
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [partnersWithCharts, setPartnersWithCharts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PARTNERS_PER_PAGE = 10;

  // Load profile and partners on mount
  useEffect(() => {
    if (isHydrated) {
      loadFromCloud();
    }
  }, [isHydrated, loadFromCloud]);

  // Calculate scores on the fly
  useEffect(() => {
    const calculateScores = async () => {
      if (!selfChart || partners.length === 0) return;

      const newScores: Record<string, { score: number, verdict: string }> = {};
      const updatedPartners: any[] = [];

      for (const partner of partners) {
        try {
          let partnerChart = partner.chart;

          // Generate chart if missing
          if (!partnerChart) {
            const birthData = {
              name: partner.name,
              gender: partner.gender,
              dateOfBirth: partner.dateOfBirth,
              timeOfBirth: partner.timeOfBirth,
              location: partner.location,
              latitude: partner.latitude,
              longitude: partner.longitude,
              timezone: partner.timezone
            };
            // Helper logic to ensure Date object
            try {
              partnerChart = await generateChartFromBirthData(birthData);
            } catch (e) {
              console.error("Error generating chart for", partner.name, e);
              continue;
            }
          }

          if (partnerChart) {
            updatedPartners.push({ ...partner, chart: partnerChart });


            try {
              // Use unified Logic for Consistent Scoring
              const insight = await generateMatchInsight(selfChart, partnerChart, partner.name, partner.id);

              newScores[partner.id] = {
                score: insight.score,
                verdict: insight.verdict
              };
            } catch (e) {
              console.error("Error calculating score for", partner.name, e);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
      setPartnerScores(newScores);
      setPartnersWithCharts(updatedPartners);
    };

    calculateScores();
  }, [selfChart, partners]);


  const handleRemovePartner = async (partnerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this partner?')) {
      await removePartner(partnerId);
    }
  };

  const handleCompare = (partnerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/quick-compare/${partnerId}`);
  };

  const handleRemoveSelfProfile = () => {
    if (window.confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
      clearSelfProfile();
    }
  };

  return (
    <section className="py-12 px-4 bg-gray-50/50 dark:bg-gray-800/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8 flex items-center gap-2">
          <User className="w-6 h-6 text-purple-600" />
          Your Cosmic Dashboard
        </h2>

        {/* AI Insight Widget */}
        <CosmicMatchWidget
          selfChart={selfChart}
          selfBirthData={selfBirthData}
          partners={partners}
        />

        {/* Self Profile Card */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Your Profile
          </h3>

          {selfChart ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">
                      {selfChart.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      {selfChart.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {selfBirthData?.dateOfBirth ?
                        new Date(selfBirthData.dateOfBirth).toLocaleDateString() : ''
                      } • {selfChart.ascendant} Ascendant
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      {selfChart.gender} • {calculateAge(selfBirthData?.dateOfBirth)} years
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/self-report')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    View Analysis
                  </button>
                  <button
                    onClick={() => navigate('/self-calculator')}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRemoveSelfProfile}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Remove Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => navigate('/self-calculator')}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-purple-500 transition-colors text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Create Your Profile
              </h4>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Discover your marriage timing and spouse characteristics
              </p>
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Partners Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Saved Partners ({partners.length})
            </h3>
            <div className="flex items-center gap-2">
              {partners.length > 0 && (
                confirmDeleteAll ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-400 font-medium">Delete all {partners.length} partners?</span>
                    <button
                      onClick={async () => {
                        await removeAllPartners();
                        setConfirmDeleteAll(false);
                      }}
                      className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDeleteAll(false)}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteAll(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete All
                  </button>
                )
              )}
              <button
                onClick={() => navigate('/add-partner')}
                className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Partner
              </button>
            </div>
          </div>

          {isLoadingPartners ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Loading partners...</p>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-pink-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Partners Added Yet
              </h4>
              <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                Add potential partners to quickly check compatibility and compare charts
              </p>
              <button
                onClick={() => navigate('/add-partner')}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Add Your First Partner
              </button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partners
                  .slice()
                  .sort((a, b) => {
                    const scoreA = partnerScores[a.id]?.score ?? -1;
                    const scoreB = partnerScores[b.id]?.score ?? -1;
                    return scoreB - scoreA;
                  })
                  .slice((currentPage - 1) * PARTNERS_PER_PAGE, currentPage * PARTNERS_PER_PAGE)
                  .map((partner) => (
                    <div
                      key={partner.id}
                      onClick={() => selectPartner(partner.id)}
                      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 cursor-pointer transition-all hover:shadow-md ${selectedPartnerId === partner.id
                        ? 'ring-2 ring-pink-500'
                        : ''
                        }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                            <span className="text-lg font-bold text-pink-600">
                              {partner.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                              {partner.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {partner.gender} • {calculateAge(new Date(partner.dateOfBirth))} years
                            </p>

                            {partnerScores[partner.id] && (
                              <div className="mt-1 flex items-center gap-2">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">
                                  {partnerScores[partner.id].score}/100
                                </span>
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${partnerScores[partner.id].verdict === 'Excellent' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                  partnerScores[partner.id].verdict === 'Good' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                    partnerScores[partner.id].verdict === 'Average' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  }`}>
                                  {partnerScores[partner.id].verdict}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleRemovePartner(partner.id, e)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Remove partner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Added {new Date(partner.createdAt).toLocaleDateString()}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleCompare(partner.id, e)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-lg text-sm font-medium hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
                        >
                          <Scale className="w-4 h-4" />
                          Compare
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/partner/${partner.id}`);
                          }}
                          className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                {/* Add Partner Card */}
                {currentPage === 1 && partners.length < PARTNERS_PER_PAGE && (
                  <button
                    onClick={() => navigate('/add-partner')}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-pink-500 transition-colors flex flex-col items-center justify-center min-h-[180px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      Add Partner
                    </span>
                  </button>
                )}
              </div>

              {/* Pagination Controls */}
              {partners.length > PARTNERS_PER_PAGE && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Page {currentPage} of {Math.ceil(partners.length / PARTNERS_PER_PAGE)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(partners.length / PARTNERS_PER_PAGE), prev + 1))}
                    disabled={currentPage === Math.ceil(partners.length / PARTNERS_PER_PAGE)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div >
    </section >
  );
};

// Helper function
function calculateAge(dateOfBirth: Date | string | undefined): number {
  if (!dateOfBirth) return 0;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export default UserDashboard;
