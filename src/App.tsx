/**
 * App Component
 * Main application with lazy-loaded routes for bundle optimization
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

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

// Dashboard
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const DashboardSelfAnalysisPage = lazy(() => import('./pages/dashboard/DashboardSelfAnalysisPage').then(m => ({ default: m.DashboardSelfAnalysisPage })));
const DashboardPartnersPage = lazy(() => import('./pages/dashboard/DashboardPartnersPage').then(m => ({ default: m.DashboardPartnersPage })));
const DashboardCompatibilityPage = lazy(() => import('./pages/dashboard/DashboardCompatibilityPage').then(m => ({ default: m.DashboardCompatibilityPage })));
const DashboardComparePage = lazy(() => import('./pages/dashboard/DashboardComparePage').then(m => ({ default: m.DashboardComparePage })));
const DashboardReportsPage = lazy(() => import('./pages/dashboard/DashboardReportsPage').then(m => ({ default: m.DashboardReportsPage })));

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
          <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
                  <LandingPage />
                </div>
              } />

              {/* Dashboard (own layout, no outer gradient wrapper) */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="self-analysis" element={<DashboardSelfAnalysisPage />} />
                <Route path="partners" element={<DashboardPartnersPage />} />
                <Route path="compatibility" element={<DashboardCompatibilityPage />} />
                <Route path="compare" element={<DashboardComparePage />} />
                <Route path="reports" element={<DashboardReportsPage />} />
              </Route>

              {/* Standalone pages (keep gradient wrapper) */}
              <Route path="/calculator" element={
                <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
                  <CalculatorPage />
                </div>
              } />
              <Route path="/report" element={
                <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
                  <ReportPage />
                </div>
              } />
              <Route path="/comparison" element={
                <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
                  <ComparisonPage />
                </div>
              } />

              {/* Self Mode */}
              <Route path="/self-calculator" element={
                <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
                  <SelfCalculatorPage />
                </div>
              } />
              <Route path="/self-report" element={
                <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
                  <SelfReportPage />
                </div>
              } />
              <Route path="/add-partner" element={
                <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
                  <AddPartnerPage />
                </div>
              } />
              <Route path="/quick-compare/:partnerId" element={
                <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
                  <QuickComparePage />
                </div>
              } />
              <Route path="/partner/:partnerId" element={
                <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
                  <PartnerDetailsPage />
                </div>
              } />

              {/* Auth */}
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
            </Routes>
          </Suspense>
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
