/**
 * App Component
 * Main application with lazy-loaded routes for bundle optimization
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Lazy-loaded pages (code-split per route)
const CalculatorPage = lazy(() => import('./pages/CalculatorPage').then(m => ({ default: m.CalculatorPage })));
const ReportPage = lazy(() => import('./pages/ReportPage').then(m => ({ default: m.ReportPage })));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage').then(m => ({ default: m.ComparisonPage })));
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage').then(m => ({ default: m.AuthCallbackPage })));

// Self Mode Pages
const SelfCalculatorPage = lazy(() => import('./pages/SelfCalculatorPage').then(m => ({ default: m.SelfCalculatorPage })));
const SelfReportPage = lazy(() => import('./pages/SelfReportPage').then(m => ({ default: m.SelfReportPage })));
const AddPartnerPage = lazy(() => import('./pages/AddPartnerPage').then(m => ({ default: m.AddPartnerPage })));
const QuickComparePage = lazy(() => import('./pages/QuickComparePage').then(m => ({ default: m.QuickComparePage })));
const PartnerDetailsPage = lazy(() => import('./pages/PartnerDetailsPage').then(m => ({ default: m.PartnerDetailsPage })));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-indigo-600 dark:text-indigo-400 text-lg font-medium">
        Loading...
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />

                {/* Compatibility Mode */}
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="/comparison" element={<ComparisonPage />} />

                {/* Self Mode */}
                <Route path="/self-calculator" element={<SelfCalculatorPage />} />
                <Route path="/self-report" element={<SelfReportPage />} />
                <Route path="/add-partner" element={<AddPartnerPage />} />
                <Route path="/quick-compare/:partnerId" element={<QuickComparePage />} />
                <Route path="/partner/:partnerId" element={<PartnerDetailsPage />} />

                {/* Auth */}
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
