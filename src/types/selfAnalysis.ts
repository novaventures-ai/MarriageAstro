/**
 * Self Analysis Types
 * Types for single-person marriage potential analysis
 */

import { Chart, BirthDataInput, TimingAnalysis, SpousePrediction, DashaPeriod, PlanetaryPosition, House, Sign, Planet, Nakshatra, CompatibilityReport, DivisionalChartAnalysis, PsychologicalProfile } from './index';
import { MentalHealthAnalysis } from '../../lib/mentalHealthCalculations';
import { AddictionRiskAnalysis } from '../../lib/addictionCalculations';
import { RelationshipPatternAnalysis } from '../../lib/relationshipPatternCalculations';
import { YogaDoshaAnalysis } from '../../lib/yogaDoshaCalculations';
import { KPAnalysis, CharaKarakas, CharaDashaAnalysis, UpapadaLagnaAnalysis } from './extendedTypes';

/**
 * Complete Self Analysis Report
 * Contains all analysis for a single person's marriage potential
 */
export interface SelfAnalysisReport {
  id: string;
  userId?: string;
  generatedAt: Date;

  // Core chart data
  chart: Chart;

  // Marriage potential assessment
  marriagePotential: MarriagePotential;

  // Spouse prediction (enhanced)
  spousePrediction: SpousePrediction;
  spouseDetailedProfile?: SpouseDetailedProfile;

  // Timing analysis
  timing: TimingAnalysis;
  timingForecast?: TimingForecast;

  // Sexual profile (single person version)
  sexualProfile: SelfSexualProfile;
  sexualHealth?: import('./index').SexualHealthAnalysis;
  extendedSexualCompatibility?: import('./extendedTypes').ExtendedSexualCompatibility;

  // Psychological analysis
  psychologicalProfile: PsychologicalProfile;
  mentalHealth?: MentalHealthAnalysis;

  // Health & wellness
  addictionRisk?: AddictionRiskAnalysis;
  relationshipPatterns?: RelationshipPatternAnalysis;

  // Dosha analysis
  doshaAnalysis: YogaDoshaAnalysis;

  // Divisional analysis
  divisionalAnalysis: DivisionalChartAnalysis;

  // Remedies
  remedies: SelfRemedies;

  // Executive summary
  executiveSummary: SelfExecutiveSummary;

  // Additional Analysis Components
  kpAnalysis?: {
    partnerA: KPAnalysis;
    partnerB?: KPAnalysis;
    nameA: string;
    nameB?: string;
  };
  jaiminiAnalysis?: {
    charaKarakas: CharaKarakas;
    charaDasha: CharaDashaAnalysis;
    ul: UpapadaLagnaAnalysis;
    vivahSaham?: import('./extendedTypes').VivahSahamAnalysis;
  };
}

/**
 * Marriage Potential Assessment
 */
export interface MarriagePotential {
  score: number; // 0-100
  verdict: 'excellent' | 'very_good' | 'good' | 'fair' | 'challenging' | 'poor';
  trafficLightStatus: 'green' | 'yellow' | 'red';

  // Key indicators
  seventhHouseStrength: number; // 0-100
  navamsaQuality: number; // 0-100
  dashaSupport: number; // 0-100

  // Predictions
  expectedMarriageAge: {
    min: number;
    max: number;
    confidence: number;
  };

  numberOfMarriages: 'single' | 'multiple' | 'unclear';
  marriageQuality: 'high' | 'medium' | 'low';

  // Strengths and challenges
  strengths: string[];
  challenges: string[];
  delayIndicators: string[];
}

/**
 * Detailed Spouse Profile
 */
export interface SpouseDetailedProfile {
  // Physical characteristics
  physicalAppearance: {
    height: 'short' | 'average' | 'tall' | 'very_tall';
    build: 'slim' | 'average' | 'athletic' | 'heavy';
    complexion: string;
    distinguishingFeatures: string[];
    styleOfDressing: string;
    firstImpression: string;
  };

  // Career and status
  career: {
    field: string; // Specific field like "IT Professional", "Doctor"
    archetype: string; // e.g., "Corporate Leader", "Creative Artist"
    incomeLevel: 'low' | 'medium' | 'high' | 'very_high';
    workPersonality: string;
    ambitionLevel: 'low' | 'medium' | 'high';
  };

  // Personality traits
  personality: {
    keyTraits: string[]; // 5 key characteristics
    communicationStyle: string;
    emotionalNature: string;
    valuesAndPriorities: string[];
  };

  // Meeting circumstances
  meetingCircumstances: {
    how: string; // "Through work", "Mutual friend", "Online", etc.
    direction: 'north' | 'south' | 'east' | 'west' | 'local';
    location: string;
    timingClues: string;
    firstInteractionVibe: string;
  };

  // Relationship dynamic
  relationshipDynamic: {
    whoPursues: 'you' | 'them' | 'mutual';
    courtshipStyle: string;
    theirExpectations: string[];
    whatAttractsThem: string[];
  };
}

/**
 * Timing Forecast
 */
export interface TimingForecast {
  currentPhase: {
    name: string;
    description: string;
    preparationNeeded: boolean;
  };

  nextMarriageWindow: {
    yearRange: string; // e.g., "2026-2028"
    favorableMonths: string[];
    confidence: number;
  };

  keyMilestones: {
    whenYouMeet: string;
    whenYouDecide: string;
    weddingWindow: string;
  };

  delayAnalysis?: {
    hasDelays: boolean;
    cause?: string; // Which planet causes delay
    remedies: string[];
  };

  favorablePeriods: FavorablePeriod[];
  cautionaryPeriods: CautionaryPeriod[];
}

export interface FavorablePeriod {
  period: string;
  dates: string;
  dashaPeriod: string;
  transitInfo: string;
  confidence: number;
}

export interface CautionaryPeriod {
  period: string;
  dates: string;
  reason: string;
  advice: string;
}

/**
 * Sexual Profile (Single Person)
 */
export interface SelfSexualProfile {
  yoniType: {
    animal: string; // Tiger, Deer, etc.
    characteristics: string;
    nature: string; // "Aggressive", "Gentle", etc.
  };

  nakshatraInfluence: {
    name: string;
    sexualNature: string;
    tendencies: string[];
  };

  libido: {
    score: number; // 0-100
    level: 'high' | 'moderate' | 'low';
    description: string;
  };

  romanticStyle: string; // "Passionate", "Gentle", "Intellectual"

  marsAnalysis: {
    house: number;
    strength: 'strong' | 'moderate' | 'weak';
    influence: string;
  };

  venusAnalysis: {
    sign: Sign;
    dignity: string;
    influence: string;
  };

  emotionalNeeds: {
    primaryNeed: string;
    description: string;
  };

  potentialIssues: string[];

  bestMatchYoni: string[];

  sexualHealth: {
    vitality: 'high' | 'moderate' | 'low';
    risks: string[];
    strengths: string[];
    balancingTips: string[];
  };
}


/**
 * Self Remedies
 */
export interface SelfRemedies {
  prioritizedActions: {
    rank: number;
    title: string;
    description: string;
    astrologicalReason: string;
    whenToStart: string;
    duration: string;
    howToDoIt: string;
  }[];

  gemstone: {
    stone: string;
    metal: string;
    finger: string;
    hand: 'left' | 'right';
    day: string;
    mantra: string;
    wearingProcedure: string;
  };

  mantras: {
    primary: {
      mantra: string;
      meaning: string;
      count: number;
      bestTime: string;
      duration: string;
    };
    supporting: string[];
  };

  lifestyle: {
    dos: string[];
    donts: string[];
    dailyRoutine: string[];
  };

  donations: {
    item: string;
    day: string;
    toWhom: string;
    benefits: string;
  }[];
}

/**
 * Executive Summary
 */
export interface SelfExecutiveSummary {
  verdict: string;
  oneLineSummary: string;

  keyStrengths: string[];
  keyChallenges: string[];

  timingOutlook: {
    bestPeriod: string;
    preparationTime: string;
  };

  spouseOutlook: {
    quality: string;
    meetingTimeline: string;
  };

  actionItems: string[];

  overallAdvice: string;
}

/**
 * User Profile Types
 */
export interface PartnerProfile {
  id: string;
  userId?: string;

  // Basic info
  name: string;
  gender: 'male' | 'female' | 'other';

  // Birth data
  dateOfBirth: Date | string;
  timeOfBirth: string;
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;

  // Generated chart (cached)
  chart?: Chart;

  // Notes
  notes?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Quick Compare Result
 */
export interface QuickCompareResult {
  partnerId: string;
  partnerName: string;

  // Quick scores
  overallVibe: 'excellent' | 'good' | 'neutral' | 'challenging' | 'poor';
  score: number; // 0-100

  // Key compatibility indicators
  moonCompatibility: 'high' | 'medium' | 'low';
  venusCompatibility: 'high' | 'medium' | 'low';
  manglikMatch: 'match' | 'neutral' | 'mismatch';

  // Quick insights
  strengths: string[];
  challenges: string[];

  // Recommendation
  recommendation: string;

  // Full report available
  fullReportAvailable: boolean;
}

/**
 * AI Conversation Types
 */
export interface SelfAIConversation {
  id: string;
  messages: SelfAIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SelfAIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: string; // Which part of report was referenced
}

/**
 * Type Guards
 */
export function isSelfReport(report: any): report is SelfAnalysisReport {
  return report &&
    typeof report === 'object' &&
    'marriagePotential' in report &&
    'spousePrediction' in report &&
    'sexualProfile' in report &&
    !('chartA' in report); // Distinguishes from CompatibilityReport
}

export function isCompatibilityReport(report: any): report is CompatibilityReport {
  return report &&
    typeof report === 'object' &&
    'chartA' in report &&
    'chartB' in report &&
    'overallScore' in report;
}

export function validateChart(chart: any): chart is Chart {
  return (
    chart &&
    typeof chart === 'object' &&
    'planetaryPositions' in chart &&
    Array.isArray(chart.planetaryPositions) &&
    'houses' in chart &&
    Array.isArray(chart.houses) &&
    'ascendant' in chart
  );
}

export interface PaymentHistoryEntry {
  id: string;
  planType: string;
  sectionId?: string | null;
  amount: number;
  status: string;
  createdAt: string;
}

// Re-export for convenience
export type { Chart, BirthDataInput, TimingAnalysis, SpousePrediction };
