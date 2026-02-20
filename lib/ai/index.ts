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
} from './matchmakingEngine';

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
} from './matchmakingEngine';

// Match Insight Functions
export {
  generateComprehensiveMatchInsight,
  generateMatchInsight,
  analyzeBestMatch,
  analyzeBestMatchSync
} from './matchInsight';

export type { MatchInsight } from './matchInsight';
