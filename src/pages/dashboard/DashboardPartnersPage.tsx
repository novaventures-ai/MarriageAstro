/**
 * Dashboard Partners Page
 * Full partner management within the dashboard layout
 * Reuses logic from UserDashboard but in a full-page format
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Scale,
  ChevronRight,
  Star,
  Users,
  Search
} from 'lucide-react';
import { useUserProfileStore } from '../../store/useUserProfileStore';
import { generateMatchInsight } from '../../../lib/ai/matchInsight';
import { SEOHead } from '../../components/SEOHead';

export const DashboardPartnersPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selfChart,
    partners,
    selectedPartnerId,
    isLoadingPartners,
    removePartner,
    removeAllPartners,
    selectPartner,
    loadFromCloud,
    isHydrated,
    isDemoMode
  } = useUserProfileStore();

  const [partnerScores, setPartnerScores] = useState<Record<string, { score: number; verdict: string }>>({});
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PARTNERS_PER_PAGE = 12;

  useEffect(() => {
    if (isHydrated && !isDemoMode) {
      loadFromCloud();
    }
  }, [isHydrated, isDemoMode, loadFromCloud]);

  useEffect(() => {
    const calculateScores = async () => {
      if (!selfChart || partners.length === 0) return;
      const newScores: Record<string, { score: number; verdict: string }> = {};

      for (const partner of partners) {
        if (partner.chart) {
          try {
            const insight = await generateMatchInsight(selfChart, partner.chart, partner.name, partner.id);
            newScores[partner.id] = { score: insight.score, verdict: insight.verdict };
          } catch (e) {
            console.error('Score calc error:', e instanceof Error ? e.message : 'Unknown');
          }
        }
      }
      setPartnerScores(newScores);
    };
    calculateScores();
  }, [selfChart, partners]);

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPartners = filteredPartners.slice().sort((a, b) => {
    const scoreA = partnerScores[a.id]?.score ?? -1;
    const scoreB = partnerScores[b.id]?.score ?? -1;
    return scoreB - scoreA;
  });

  const paginatedPartners = sortedPartners.slice(
    (currentPage - 1) * PARTNERS_PER_PAGE,
    currentPage * PARTNERS_PER_PAGE
  );

  const totalPages = Math.ceil(sortedPartners.length / PARTNERS_PER_PAGE);

  const handleRemovePartner = async (partnerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Remove this partner?')) {
      await removePartner(partnerId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <SEOHead
        title="Your Partners - Manage Saved Profiles"
        description="Manage your saved partner profiles for quick compatibility checks and marriage analysis comparisons."
        path="/dashboard/partners"
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-pink-600" />
            Partners
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and compare your saved partners
          </p>
        </div>
        <div className="flex gap-2">
          {partners.length > 0 && (
            confirmDeleteAll ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400 font-medium">Delete all?</span>
                <button
                  onClick={async () => { await removeAllPartners(); setConfirmDeleteAll(false); }}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmDeleteAll(false)}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDeleteAll(true)}
                className="px-3 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-600/30 text-sm font-medium flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete All
              </button>
            )
          )}
          <button
            onClick={() => navigate('/add-partner')}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Partner
          </button>
        </div>
      </div>

      {/* Search */}
      {partners.length > 3 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search partners..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      )}

      {/* Partners Grid */}
      {isLoadingPartners ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400">Loading partners...</p>
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-pink-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Partners Added Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto text-sm">
            Add potential partners to check compatibility and compare charts
          </p>
          <button
            onClick={() => navigate('/add-partner')}
            className="px-6 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
          >
            Add Your First Partner
          </button>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedPartners.map((partner) => (
              <div
                key={partner.id}
                onClick={() => selectPartner(partner.id)}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-5 cursor-pointer transition-all hover:shadow-md ${
                  selectedPartnerId === partner.id
                    ? 'ring-2 ring-pink-500 border-pink-300 dark:border-pink-700'
                    : 'border-gray-200 dark:border-gray-700'
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
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100">{partner.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{partner.gender}</p>
                      {partnerScores[partner.id] && (
                        <div className="mt-1 flex items-center gap-2">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">
                            {partnerScores[partner.id].score}/100
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                            partnerScores[partner.id].verdict === 'Excellent' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
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
                    onClick={(e) => { e.stopPropagation(); navigate(`/quick-compare/${partner.id}`); }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-lg text-sm font-medium hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
                  >
                    <Scale className="w-4 h-4" /> Compare
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/partner/${partner.id}`); }}
                    className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add partner card */}
            <button
              onClick={() => navigate('/add-partner')}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600 p-5 hover:border-pink-500 transition-colors flex flex-col items-center justify-center min-h-[180px]"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Add Partner</span>
            </button>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Previous
              </button>
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPartnersPage;
