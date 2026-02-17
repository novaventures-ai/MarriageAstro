/**
 * App Component
 * Main application with all routes including Self Mode
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { ReportPage } from './pages/ReportPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';

// Self Mode Pages
import { SelfCalculatorPage } from './pages/SelfCalculatorPage';
import { SelfReportPage } from './pages/SelfReportPage';
import { AddPartnerPage } from './pages/AddPartnerPage';
import { QuickComparePage } from './pages/QuickComparePage';
import { PartnerDetailsPage } from './pages/PartnerDetailsPage';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />

              {/* Compatibility Mode (Existing) */}
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/comparison" element={<ComparisonPage />} />

              {/* Self Mode (New) */}
              <Route path="/self-calculator" element={<SelfCalculatorPage />} />
              <Route path="/self-report" element={<SelfReportPage />} />
              <Route path="/add-partner" element={<AddPartnerPage />} />
              <Route path="/quick-compare/:partnerId" element={<QuickComparePage />} />
              <Route path="/partner/:partnerId" element={<PartnerDetailsPage />} />

              {/* Auth */}
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
