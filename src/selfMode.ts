/**
 * Self Mode Exports
 * Central export file for all Self Mode modules
 */

// Types
export * from './types/selfAnalysis';

// Store
export { useUserProfileStore } from './store/useUserProfileStore';

// Pages
export { SelfCalculatorPage } from './pages/SelfCalculatorPage';
export { SelfReportPage } from './pages/SelfReportPage';
export { AddPartnerPage } from './pages/AddPartnerPage';

// Components
export { SelfOverviewWidget } from './components/widgets/SelfOverviewWidget';
export { UserDashboard } from './components/dashboard/UserDashboard';
export { SelfAstroMindWidget } from './components/ai/SelfAstroMindWidget';
export { ErrorBoundary } from './components/ErrorBoundary';

// Hooks
export { useSelfAI } from './hooks/useSelfAI';

// Services
export {
  saveUserProfile,
  getUserProfile,
  savePartner,
  getUserPartners,
  deletePartner,
  updatePartner
} from './lib/userProfileService';

// AI
export { SELF_SYSTEM_PROMPTS, generateSelfPrompt } from '@lib/ai/selfPrompts';

// Report Generator
export { generateSelfAnalysisReport } from '../lib/selfReportGenerator';
