/**
 * Dashboard Reports Page
 * Shows saved compatibility reports, wrapping SavedReportsPanel
 */

import React from 'react';
import { FileText } from 'lucide-react';
import { SavedReportsPanel } from '../../components/ui/SavedReportsPanel';

export const DashboardReportsPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-600" />
          Saved Reports
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Your previously generated compatibility reports
        </p>
      </div>

      <SavedReportsPanel />
    </div>
  );
};

export default DashboardReportsPage;
