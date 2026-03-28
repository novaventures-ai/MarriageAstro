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

// GEO Content Pages
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));
const AshtakootMilanGuide = lazy(() => import('./pages/guides/AshtakootMilanGuide').then(m => ({ default: m.AshtakootMilanGuide })));
const MarriageTimingGuide = lazy(() => import('./pages/guides/MarriageTimingGuide').then(m => ({ default: m.MarriageTimingGuide })));
const MangalDoshaGuide = lazy(() => import('./pages/guides/MangalDoshaGuide').then(m => ({ default: m.MangalDoshaGuide })));

// Feature Explanation Pages
const SpousePredictionPage = lazy(() => import('./pages/features/SpousePredictionPage').then(m => ({ default: m.SpousePredictionPage })));
const PsychologicalProfilePage = lazy(() => import('./pages/features/PsychologicalProfilePage').then(m => ({ default: m.PsychologicalProfilePage })));
const ConflictZonesPage = lazy(() => import('./pages/features/ConflictZonesPage').then(m => ({ default: m.ConflictZonesPage })));
const SynastryPage = lazy(() => import('./pages/features/SynastryPage').then(m => ({ default: m.SynastryPage })));

// Admin, Pricing, Demo & Affiliate
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const DemoPage = lazy(() => import('./pages/DemoPage').then(m => ({ default: m.DemoPage })));
const AffiliatePage = lazy(() => import('./pages/AffiliatePage').then(m => ({ default: m.AffiliatePage })));

// 404
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

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

              {/* GEO Content Pages (static, crawlable by AI engines) */}
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/guides/ashtakoot-milan" element={<AshtakootMilanGuide />} />
              <Route path="/guides/marriage-timing" element={<MarriageTimingGuide />} />
              <Route path="/guides/mangal-dosha" element={<MangalDoshaGuide />} />

              {/* Feature Explanation Pages */}
              <Route path="/features/spouse-prediction" element={<SpousePredictionPage />} />
              <Route path="/features/psychological-profile" element={<PsychologicalProfilePage />} />
              <Route path="/features/conflict-zones" element={<ConflictZonesPage />} />
              <Route path="/features/synastry" element={<SynastryPage />} />

              {/* Admin, Pricing, Demo & Affiliate */}
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/affiliate" element={<AffiliatePage />} />

              {/* Auth */}
              <Route path="/auth/callback" element={<AuthCallbackPage />} />

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
