/**
 * AI Matchmaking Module - Comprehensive Partner Analysis
 * 
 * This module provides AI-powered matchmaking capabilities:
 * - Multi-factor analysis across all compatibility widgets
 * - Holistic scoring with weighted factors
 * - Detailed explanation generation
 * - Risk assessment and mitigation strategies
 * 
 * Usage:
 *   import { analyzeAllPartners, generateComprehensiveMatchInsight } from '@lib/ai';
 *   
 *   // Full analysis
 *   const result = await analyzeAllPartners(selfChart, partners);
 *   
 *   // Single match detailed analysis
 *   const { insight, fullAnalysis } = await generateComprehensiveMatchInsight(
 *     selfChart, partnerChart, partnerName, partnerId
 *   );
 */

// Core Matchmaking Engine
export { 
  AIMatchmakingEngine,
  analyzeAllPartners,
  generateQuickMatchInsight,
  generateDetailedExplanation
} from './matchmakingEngine.js';

export type {
  AIMatchAnalysis,
  AIMatchResult,
  RankingFactor,
  DataPoint,
  StrengthArea,
  ChallengeArea,
  RiskFactor,
  CompatibilitySignature,
  ExplanationData,
  DetailedAnalysisSection,
  SubSection,
  KeyHighlight,
  ComparisonPoint,
  AstrologicalEvidence,
  RecommendationLevel
} from './matchmakingEngine.js';

// Match Insight Functions
export {
  generateComprehensiveMatchInsight,
  generateMatchInsight,
  analyzeBestMatch,
  analyzeBestMatchSync
} from './matchInsight.js';

export type { MatchInsight } from './matchInsight.js';

// Client Selector
export { getAIModel } from './clientSelector.js';

