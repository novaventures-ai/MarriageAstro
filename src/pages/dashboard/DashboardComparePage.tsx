/**
 * Dashboard Compare Page
 * Entry point for multi-partner comparison
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, ArrowRight, Users } from 'lucide-react';
import { useUserProfileStore } from '../../store/useUserProfileStore';

export const DashboardComparePage: React.FC = () => {
  const navigate = useNavigate();
  const { selfChart, partners } = useUserProfileStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Scale className="w-6 h-6 text-indigo-600" />
          Compare Partners
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Side-by-side partner comparison analysis
        </p>
      </div>

      {!selfChart ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Create your profile first to compare partners</p>
          <button
            onClick={() => navigate('/self-calculator')}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Create Profile
          </button>
        </div>
      ) : partners.length < 2 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Need at least 2 partners
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
            You have {partners.length} partner{partners.length !== 1 ? 's' : ''}. Add more to unlock comparison.
          </p>
          <button
            onClick={() => navigate('/add-partner')}
            className="px-6 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
          >
            Add Partner
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Multi-Partner Comparison
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Compare {partners.length} partners side-by-side with detailed compatibility scores, strengths, and areas of concern.
            </p>
            <button
              onClick={() => navigate('/comparison')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm inline-flex items-center gap-2"
            >
              Open Comparison Tool <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Partner list for quick compare */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Compare</h3>
            <div className="space-y-2">
              {partners.map((partner) => (
                <button
                  key={partner.id}
                  onClick={() => navigate(`/quick-compare/${partner.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-pink-600">{partner.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">{partner.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{partner.gender}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardComparePage;
