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
import { QueryParamHandler } from './components/QueryParamHandler';

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
const FeaturesIndexPage = lazy(() => import('./pages/features/FeaturesIndexPage').then(m => ({ default: m.FeaturesIndexPage })));
const DivorceRiskPage = lazy(() => import('./pages/features/DivorceRiskPage').then(m => ({ default: m.DivorceRiskPage })));
const AshtakootPage = lazy(() => import('./pages/features/AshtakootPage').then(m => ({ default: m.AshtakootPage })));
const MarriageTimingPage = lazy(() => import('./pages/features/MarriageTimingPage').then(m => ({ default: m.MarriageTimingPage })));
const VulnerabilityTimelinePage = lazy(() => import('./pages/features/VulnerabilityTimelinePage').then(m => ({ default: m.VulnerabilityTimelinePage })));
const SpousePredictionPage = lazy(() => import('./pages/features/SpousePredictionPage').then(m => ({ default: m.SpousePredictionPage })));
const PsychologicalProfilePage = lazy(() => import('./pages/features/PsychologicalProfilePage').then(m => ({ default: m.PsychologicalProfilePage })));
const ConflictZonesPage = lazy(() => import('./pages/features/ConflictZonesPage').then(m => ({ default: m.ConflictZonesPage })));
const SynastryPage = lazy(() => import('./pages/features/SynastryPage').then(m => ({ default: m.SynastryPage })));
const KPAnalysisPage = lazy(() => import('./pages/features/KPAnalysisPage').then(m => ({ default: m.KPAnalysisPage })));
const MentalHealthPage = lazy(() => import('./pages/features/MentalHealthPage').then(m => ({ default: m.MentalHealthPage })));
const RemediesPage = lazy(() => import('./pages/features/RemediesPage').then(m => ({ default: m.RemediesPage })));
const CharaDashaPage = lazy(() => import('./pages/features/CharaDashaPage').then(m => ({ default: m.CharaDashaPage })));
const PoruthamPage = lazy(() => import('./pages/features/PoruthamPage').then(m => ({ default: m.PoruthamPage })));
const YogaDoshaPage = lazy(() => import('./pages/features/YogaDoshaPage').then(m => ({ default: m.YogaDoshaPage })));
const AddictionRiskPage = lazy(() => import('./pages/features/AddictionRiskPage').then(m => ({ default: m.AddictionRiskPage })));
const RelationshipPatternsPage = lazy(() => import('./pages/features/RelationshipPatternsPage').then(m => ({ default: m.RelationshipPatternsPage })));
const DivisionalChartsPage = lazy(() => import('./pages/features/DivisionalChartsPage').then(m => ({ default: m.DivisionalChartsPage })));
const SexualCompatibilityPage = lazy(() => import('./pages/features/SexualCompatibilityPage').then(m => ({ default: m.SexualCompatibilityPage })));

// Blog Pages
const BlogIndexPage = lazy(() => import('./pages/blog/BlogIndexPage').then(m => ({ default: m.BlogIndexPage })));
const KundaliMatchingGuidePage = lazy(() => import('./pages/blog/KundaliMatchingGuidePage').then(m => ({ default: m.KundaliMatchingGuidePage })));
const MangalDoshaMythsPage = lazy(() => import('./pages/blog/MangalDoshaMythsPage').then(m => ({ default: m.MangalDoshaMythsPage })));
const MarriageTimingBlogPage = lazy(() => import('./pages/blog/MarriageTimingBlogPage').then(m => ({ default: m.MarriageTimingBlogPage })));
const VedicVsWesternPage = lazy(() => import('./pages/blog/VedicVsWesternPage').then(m => ({ default: m.VedicVsWesternPage })));
const NadiDoshaPage = lazy(() => import('./pages/blog/NadiDoshaPage').then(m => ({ default: m.NadiDoshaPage })));

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
          <QueryParamHandler />
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
              <Route path="/features" element={<FeaturesIndexPage />} />
              <Route path="/features/divorce-risk" element={<DivorceRiskPage />} />
              <Route path="/features/ashtakoot-milan" element={<AshtakootPage />} />
              <Route path="/features/marriage-timing" element={<MarriageTimingPage />} />
              <Route path="/features/vulnerability-timeline" element={<VulnerabilityTimelinePage />} />
              <Route path="/features/spouse-prediction" element={<SpousePredictionPage />} />
              <Route path="/features/psychological-profile" element={<PsychologicalProfilePage />} />
              <Route path="/features/conflict-zones" element={<ConflictZonesPage />} />
              <Route path="/features/synastry" element={<SynastryPage />} />
              <Route path="/features/kp-analysis" element={<KPAnalysisPage />} />
              <Route path="/features/mental-health" element={<MentalHealthPage />} />
              <Route path="/features/remedies" element={<RemediesPage />} />
              <Route path="/features/chara-dasha" element={<CharaDashaPage />} />
              <Route path="/features/porutham" element={<PoruthamPage />} />
              <Route path="/features/yoga-dosha" element={<YogaDoshaPage />} />
              <Route path="/features/addiction-risk" element={<AddictionRiskPage />} />
              <Route path="/features/relationship-patterns" element={<RelationshipPatternsPage />} />
              <Route path="/features/divisional-charts" element={<DivisionalChartsPage />} />
              <Route path="/features/sexual-compatibility" element={<SexualCompatibilityPage />} />

              {/* Blog Pages */}
              <Route path="/blog" element={<BlogIndexPage />} />
              <Route path="/blog/kundali-matching-complete-guide" element={<KundaliMatchingGuidePage />} />
              <Route path="/blog/mangal-dosha-myths-facts" element={<MangalDoshaMythsPage />} />
              <Route path="/blog/when-will-i-get-married-astrology" element={<MarriageTimingBlogPage />} />
              <Route path="/blog/vedic-vs-western-astrology-marriage" element={<VedicVsWesternPage />} />
              <Route path="/blog/nadi-dosha-complete-guide" element={<NadiDoshaPage />} />

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
