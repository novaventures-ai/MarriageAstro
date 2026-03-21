/**
 * Comprehensive AI Matchmaking Engine
 * 
 * This AI analyzes ALL partners across:
 * - All 13+ widgets (Ashtakoot, Synastry, Risk, Sexual Health, etc.)
 * - Every micro-element (planetary positions, aspects, house overlays)
 * - All data types (scores, interpretations, descriptions)
 * - Extended analysis (KP, Jaimini, Chara, Divisional charts)
 * 
 * It provides holistic match selection with detailed explanation generation.
 */

import {
  Chart,
  CompatibilityReport,
  AshtakootResult,
  SynastryData,
  RiskAssessment,
  SexualCompatibility,
  SexualHealthAnalysis,
  DivisionalChartAnalysis,
  SpousePrediction,
  TimingAnalysis,
  PlanetaryPosition,
  Planet,
  Sign,
  House,
  Yoga,
  DashaPeriod,
} from '@types';
import { calculateComparisonScore, ComparisonScore, CategoryScore } from '../comparisonScoring';
import { calculateAshtakootMilan } from '../compatibilityCalculations';
import { generateCompatibilityReport } from '../reportGenerator';

// ============================================================================
// TYPES
// ============================================================================

export interface AIMatchAnalysis {
  partnerId: string;
  partnerName: string;
  overallScore: number;
  rawScore: number;
  categoryScores: CategoryScore;
  rankingFactors: RankingFactor[];
  strengthAreas: StrengthArea[];
  challengeAreas: ChallengeArea[];
  uniqueAdvantages: string[];
  riskFactors: RiskFactor[];
  compatibilitySignature: CompatibilitySignature;
  explanationData: ExplanationData;
  recommendation: RecommendationLevel;
  confidence: number;
}

export interface RankingFactor {
  name: string;
  weight: number;
  score: number;
  impact: 'high' | 'medium' | 'low';
  description: string;
  dataPoints: DataPoint[];
}

export interface DataPoint {
  source: string;
  value: string | number;
  significance: string;
}

export interface StrengthArea {
  category: string;
  title: string;
  description: string;
  evidence: string[];
  astrologicalBasis: string;
  impactScore: number;
}

export interface ChallengeArea {
  category: string;
  title: string;
  description: string;
  severity: 'critical' | 'moderate' | 'minor';
  mitigationStrategies: string[];
  astrologicalBasis: string;
}

export interface RiskFactor {
  type: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  indicators: string[];
  mitigationAvailable: boolean;
}

export interface CompatibilitySignature {
  emotionalProfile: string;
  mentalProfile: string;
  sexualSynergy: string;
  socialProfile: string;
  karmicWeight: string;
}

export interface ExplanationData {
  executiveSummary: string;
  detailedAnalysis: DetailedAnalysisSection[];
  keyHighlights: KeyHighlight[];
  comparisonWithOthers: ComparisonPoint[];
  astrologicalEvidence: AstrologicalEvidence[];
}

export interface DetailedAnalysisSection {
  title: string;
  content: string;
  subsections?: SubSection[];
}

export interface SubSection {
  title: string;
  content: string;
  data?: Record<string, string | number>;
}

export interface KeyHighlight {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  importance: number;
}

export interface ComparisonPoint {
  factor: string;
  thisMatch: string;
  averageOfOthers: string;
  percentile: number;
}

export interface AstrologicalEvidence {
  category: string;
  evidence: string;
  technicalDetails: string;
  interpretation: string;
}

export type RecommendationLevel =
  | 'highly_recommended'
  | 'recommended'
  | 'conditional'
  | 'caution_advised'
  | 'not_recommended';

export interface AIMatchResult {
  bestMatch: AIMatchAnalysis;
  allMatches: AIMatchAnalysis[];
  comparisonSummary: string;
  aiInsights: string[];
  selectionRationale: string;
}

// ============================================================================
// WEIGHT CONFIGURATION - Comprehensive Factor Weighting
// ============================================================================

// PRIORITY CONFIGURATION
// User priorities (in order of importance):
// 1. Nadi Dosha: MUST avoid same Nadi (critical for health/progeny)
// 2. Divorce Risk: Must be very low (relationship stability)
// 3. Infidelity Risk: Must be very low (trust/loyalty)

const FACTOR_WEIGHTS = {
  // CRITICAL PRIORITY: Dosha Analysis (Increased from 6% to 20%)
  // Nadi Dosha is now the HIGHEST priority factor
  doshaAnalysis: {
    weight: 0.20, // Increased from 0.06
    subFactors: {
      nadiDosha: 0.70, // Increased from 0.40 - HIGHEST priority
      bhakootDosha: 0.20, // Reduced from 0.35
      ganaDosha: 0.10, // Reduced from 0.25
    }
  },

  // HIGH PRIORITY: Risk Assessment (Increased from 25% to 35%)
  // Divorce and Infidelity risks are the most critical factors
  riskProfile: {
    weight: 0.35, // Increased from 0.25 — risks MUST significantly impact score
    subFactors: {
      divorceRisk: 0.50, // CRITICAL priority
      infidelityRisk: 0.35, // HIGH priority
      manglikCompatibility: 0.10,
      multipleMarriageIndicators: 0.05,
    }
  },

  // Traditional Compatibility (Reduced from 25% to 20%)
  ashtakoot: {
    weight: 0.12, // Reduced from 0.15
    subFactors: {
      totalScore: 0.40,
      nadiMatch: 0.30, // Still important but checked in doshaAnalysis
      bhakootMatch: 0.15,
      grahaMaitri: 0.10,
      ganaMatch: 0.05,
    }
  },
  navamsa: {
    weight: 0.08, // Reduced from 0.10
    subFactors: {
      d9Compatibility: 0.40,
      vargottamaStrength: 0.30,
      pushkarNavamsa: 0.30,
    }
  },

  // Relationship Dynamics (Reduced from 20% to 15%)
  synastry: {
    weight: 0.10, // Reduced from 0.12
    subFactors: {
      soulmateConnections: 0.25,
      karmicBonds: 0.20,
      houseOverlays: 0.20,
      planetaryConjunctions: 0.20,
      d9Overlays: 0.15,
    }
  },
  emotionalCompatibility: {
    weight: 0.05, // Reduced from 0.08
    subFactors: {
      moonHarmony: 0.40,
      venusJupiterConnection: 0.35,
      emotionalSupportIndicators: 0.25,
    }
  },

  // Intimacy & Physical (12%)
  sexualCompatibility: {
    weight: 0.08,
    subFactors: {
      yoniMatch: 0.35,
      nakshatraMatch: 0.25,
      chemistryScore: 0.25,
      healthCompatibility: 0.15,
    }
  },
  physicalAttraction: {
    weight: 0.04,
    subFactors: {
      marsVenusAspects: 0.50,
      ascendantCompatibility: 0.30,
      physicalIndicators: 0.20,
    }
  },

  // Practical Factors (10%)
  timing: {
    weight: 0.05,
    subFactors: {
      dashaAlignment: 0.40,
      favorablePeriods: 0.35,
      transitSupport: 0.25,
    }
  },
  inLawCompatibility: {
    weight: 0.05,
    subFactors: {
      secondHouseScore: 0.50,
      tenthHouseScore: 0.30,
      familyIntegration: 0.20,
    }
  },

  // Advanced Indicators (8%)
  kpAnalysis: {
    weight: 0.03,
    subFactors: {
      cslConnection: 0.35,
      significatorHarmony: 0.35,
      rulingPlanetAlignment: 0.30,
    }
  },
  jaimini: {
    weight: 0.03,
    subFactors: {
      darakarakaContact: 0.40,
      soulLink: 0.30,
      charaKarakasAlignment: 0.30,
    }
  },
  divisionalCharts: {
    weight: 0.02,
    subFactors: {
      d7Fertility: 0.35,
      d60Karma: 0.35,
      vargaStrength: 0.30,
    }
  },

  // Mental & Lifestyle (7%)
  mentalHealth: {
    weight: 0.03,
    subFactors: {
      stabilityIndicators: 0.40,
      stressHandling: 0.30,
      communicationStyle: 0.30,
    }
  },
  lifestyle: {
    weight: 0.04,
    subFactors: {
      careerAlignment: 0.35,
      modernChallenges: 0.35,
      valueCompatibility: 0.30,
    }
  },
} as const;

// ============================================================================
// MAIN AI MATCHMAKING ENGINE
// ============================================================================

export class AIMatchmakingEngine {
  private selfChart: Chart;
  private partners: Array<{ id: string; name: string; chart: Chart }>;
  private reports: Map<string, CompatibilityReport> = new Map();
  private analyses: Map<string, AIMatchAnalysis> = new Map();

  constructor(selfChart: Chart, partners: Array<{ id: string; name: string; chart: Chart }>) {
    this.selfChart = selfChart;
    this.partners = partners;
  }

  /**
   * Execute complete AI matchmaking analysis
   */
  async analyzeAllMatches(): Promise<AIMatchResult> {
    // Step 1: Generate full reports for all partners
    await this.generateAllReports();

    // Step 2: Analyze each partner comprehensively
    for (const partner of this.partners) {
      try {
        const analysis = await this.analyzePartner(partner);
        this.analyses.set(partner.id, analysis);
      } catch (error) {
        console.error('Analysis failed for partner:', error instanceof Error ? error.message : 'Unknown error');
        // We could create a minimal "failed" analysis here if we want to avoid skipping the partner entirely
      }
    }

    // Step 3: Rank and select best match
    const allMatches = Array.from(this.analyses.values())
      .sort((a, b) => b.overallScore - a.overallScore);

    const bestMatch = allMatches[0];

    // Step 4: Generate comprehensive insights
    const result: AIMatchResult = {
      bestMatch,
      allMatches,
      comparisonSummary: this.generateComparisonSummary(allMatches),
      aiInsights: this.generateAIInsights(allMatches),
      selectionRationale: this.generateSelectionRationale(bestMatch, allMatches),
    };

    return result;
  }

  /**
   * Generate compatibility reports for all partners
   */
  private async generateAllReports(): Promise<void> {
    const promises = this.partners.map(async (partner) => {
      try {
        const report = await generateCompatibilityReport(this.selfChart, partner.chart);
        this.reports.set(partner.id, report);
      } catch (error) {
        console.error('Failed to generate report:', error instanceof Error ? error.message : 'Unknown error');
      }
    });

    await Promise.all(promises);
  }

  /**
   * Comprehensive single partner analysis
   */
  private async analyzePartner(partner: { id: string; name: string; chart: Chart }): Promise<AIMatchAnalysis> {
    const report = this.reports.get(partner.id);
    if (!report) {
      throw new Error(`No report found for partner ${partner.name}`);
    }

    // Get comparison scoring
    const comparisonScore = calculateComparisonScore(report);

    // Analyze all ranking factors
    const rankingFactors = this.analyzeRankingFactors(report, partner.chart);

    // Calculate weighted overall score (Use the comprehensive report score directly for UI consistency)
    const overallScore = report.overallScore;

    // Identify strengths
    const strengthAreas = this.identifyStrengthAreas(report, partner.chart);

    // Identify challenges
    const challengeAreas = this.identifyChallengeAreas(report, partner.chart, overallScore);

    // Analyze risks
    const riskFactors = this.analyzeRiskFactors(report);

    // Create compatibility signature
    const compatibilitySignature = this.createCompatibilitySignature(report, partner.chart);

    // Generate explanation data
    const explanationData = this.generateExplanationData(report, partner, comparisonScore, rankingFactors);

    // Determine recommendation
    const recommendation = this.determineRecommendation(overallScore, riskFactors, challengeAreas, report);

    // Calculate confidence
    const confidence = this.calculateConfidence(rankingFactors, report);

    return {
      partnerId: partner.id,
      partnerName: partner.name,
      overallScore,
      rawScore: report.ashtakoot.totalScore,
      categoryScores: comparisonScore?.categories || {},
      rankingFactors,
      strengthAreas,
      challengeAreas,
      uniqueAdvantages: this.identifyUniqueAdvantages(strengthAreas, report),
      riskFactors,
      compatibilitySignature,
      explanationData,
      recommendation,
      confidence,
    };
  }

  // ============================================================================
  // RANKING FACTOR ANALYSIS
  // ============================================================================

  private analyzeRankingFactors(report: CompatibilityReport, partnerChart: Chart): RankingFactor[] {
    const factors: RankingFactor[] = [];

    // 1. Ashtakoot Analysis
    factors.push(this.analyzeAshtakootFactor(report.ashtakoot));

    // 2. Navamsa Analysis
    factors.push(this.analyzeNavamsaFactor(report.navamsaMatching, report.divisionalAnalysis));

    // 3. Synastry Analysis
    factors.push(this.analyzeSynastryFactor(report.synastry));

    // 4. Emotional Compatibility
    factors.push(this.analyzeEmotionalCompatibility(report, partnerChart));

    // 5. Risk Profile
    factors.push(this.analyzeRiskProfile(report.riskAssessment));

    // 6. Dosha Analysis
    factors.push(this.analyzeDoshaFactor(report.ashtakoot));

    // 7. Sexual Compatibility
    factors.push(this.analyzeSexualCompatibilityFactor(report.sexualCompatibility));

    // 8. Physical Attraction
    factors.push(this.analyzePhysicalAttraction(report.synastry, this.selfChart, partnerChart));

    // 9. Timing Analysis
    factors.push(this.analyzeTimingFactor(report.timing));

    // 10. In-Law Compatibility
    factors.push(this.analyzeInLawFactor(report.inLawAnalysis, report.partnerInLawAnalysis));

    // 11. KP Analysis
    if (report.kpAnalysis) {
      factors.push(this.analyzeKPFactor(report.kpAnalysis, report.synastry?.kpCompatibility));
    }

    // 12. Jaimini Analysis
    if (report.synastry?.jaiminiCompatibility) {
      factors.push(this.analyzeJaiminiFactor(report.synastry.jaiminiCompatibility));
    }

    // 13. Divisional Charts
    factors.push(this.analyzeDivisionalFactor(report.divisionalAnalysis));

    // 14. Mental Health
    if (report.mentalHealthAnalysis) {
      factors.push(this.analyzeMentalHealthFactor(report.mentalHealthAnalysis));
    }

    // 15. Lifestyle Compatibility
    factors.push(this.analyzeLifestyleFactor(report.modernChallenges, report));

    return factors;
  }

  private analyzeAshtakootFactor(ashtakoot: AshtakootResult): RankingFactor {
    const dataPoints: DataPoint[] = [
      {
        source: 'Total Score',
        value: `${ashtakoot.totalScore}/${ashtakoot.maxScore}`,
        significance: 'Primary compatibility metric'
      },
      {
        source: 'Nadi',
        value: `${ashtakoot.parameters.nadi.pointsObtained}/8`,
        significance: ashtakoot.doshas.nadiDosha ? 'Dosha present' : 'Healthy match'
      },
      {
        source: 'Bhakoot',
        value: `${ashtakoot.parameters.bhakoot.pointsObtained}/7`,
        significance: ashtakoot.doshas.bhakootDosha ? 'Emotional challenge' : 'Emotional harmony'
      },
      {
        source: 'Graha Maitri',
        value: `${ashtakoot.parameters.grahaMaitri.pointsObtained}/5`,
        significance: 'Mental friendship level'
      },
      {
        source: 'Gana',
        value: `${ashtakoot.parameters.gana.pointsObtained}/6`,
        significance: 'Temperament compatibility'
      }
    ];

    // Calculate weighted sub-score
    let subScore = 0;
    subScore += (ashtakoot.totalScore / 36) * FACTOR_WEIGHTS.ashtakoot.subFactors.totalScore * 100;
    subScore += (ashtakoot.parameters.nadi.pointsObtained / 8) * FACTOR_WEIGHTS.ashtakoot.subFactors.nadiMatch * 100;
    subScore += (ashtakoot.parameters.bhakoot.pointsObtained / 7) * FACTOR_WEIGHTS.ashtakoot.subFactors.bhakootMatch * 100;
    subScore += (ashtakoot.parameters.grahaMaitri.pointsObtained / 5) * FACTOR_WEIGHTS.ashtakoot.subFactors.grahaMaitri * 100;
    subScore += (ashtakoot.parameters.gana.pointsObtained / 6) * FACTOR_WEIGHTS.ashtakoot.subFactors.ganaMatch * 100;

    // Apply dosha penalties
    if (ashtakoot.doshas.nadiDosha) subScore *= 0.7;
    if (ashtakoot.doshas.bhakootDosha) subScore *= 0.8;
    if (ashtakoot.doshas.ganaDosha) subScore *= 0.9;

    return {
      name: 'Traditional Compatibility (Ashtakoot)',
      weight: FACTOR_WEIGHTS.ashtakoot.weight,
      score: Math.round(subScore),
      impact: subScore >= 70 ? 'high' : subScore >= 50 ? 'medium' : 'low',
      description: `Traditional Vedic compatibility scoring ${ashtakoot.totalScore}/36 points`,
      dataPoints
    };
  }

  private analyzeNavamsaFactor(navamsa: any, divisional: DivisionalChartAnalysis): RankingFactor {
    const dataPoints: DataPoint[] = [
      {
        source: 'D9 Score',
        value: navamsa?.score || 'N/A',
        significance: 'Soul-level compatibility'
      },
      {
        source: 'Vargottama Planets',
        value: divisional.d9.vargottamaPlanets.length,
        significance: 'Planetary strength indicators'
      },
      {
        source: 'Pushkar Navamsa',
        value: divisional.d9.pushkarNavamsa.length,
        significance: 'Auspicious placements'
      }
    ];

    let subScore = (navamsa?.score || 50);
    subScore += Math.min(divisional.d9.vargottamaPlanets.length * 5, 20);
    subScore += Math.min(divisional.d9.pushkarNavamsa.length * 8, 16);

    return {
      name: 'Navamsa (D9) Compatibility',
      weight: FACTOR_WEIGHTS.navamsa.weight,
      score: Math.min(subScore, 100),
      impact: subScore >= 70 ? 'high' : subScore >= 50 ? 'medium' : 'low',
      description: 'Soul-level and marital happiness compatibility',
      dataPoints
    };
  }

  private analyzeSynastryFactor(synastry: SynastryData): RankingFactor {
    const dataPoints: DataPoint[] = [
      {
        source: 'Soulmate Connections',
        value: synastry.soulmateConnections.length,
        significance: 'Natural affinity indicators'
      },
      {
        source: 'Karmic Bonds',
        value: synastry.karmicBonds.length,
        significance: 'Past-life connections'
      },
      {
        source: 'House Overlays',
        value: synastry.houseOverlays.length,
        significance: 'Life area activations'
      },
      {
        source: 'Planetary Conjunctions',
        value: synastry.planetaryConjunctions.length,
        significance: 'Merged energies'
      }
    ];

    let subScore = 50;
    subScore += Math.min(synastry.soulmateConnections.length * 8, 30);
    subScore += Math.min(synastry.karmicBonds.filter(k => k.nature === 'harmonious').length * 5, 15);
    subScore += Math.min(synastry.houseOverlays.length * 2, 15);
    subScore += Math.min(synastry.planetaryConjunctions.length * 3, 15);

    return {
      name: 'Synastry (Chart Interactions)',
      weight: FACTOR_WEIGHTS.synastry.weight,
      score: Math.min(subScore, 100),
      impact: subScore >= 70 ? 'high' : subScore >= 50 ? 'medium' : 'low',
      description: 'How planets interact between charts',
      dataPoints
    };
  }

  private analyzeEmotionalCompatibility(report: CompatibilityReport, partnerChart: Chart): RankingFactor {
    const selfMoon = this.selfChart.planetaryPositions.find(p => p.planet === 'Moon');
    const partnerMoon = partnerChart.planetaryPositions.find(p => p.planet === 'Moon');

    const dataPoints: DataPoint[] = [
      {
        source: 'Moon Signs',
        value: `${selfMoon?.sign} & ${partnerMoon?.sign}`,
        significance: 'Emotional nature compatibility'
      },
      {
        source: 'Moon Nakshatras',
        value: `${selfMoon?.nakshatra} & ${partnerMoon?.nakshatra}`,
        significance: 'Deep emotional patterns'
      }
    ];

    // Check for emotional harmony indicators
    let subScore = 50;
    if (report.ashtakoot.parameters.bhakoot.pointsObtained >= 7) {
      subScore += 25;
      dataPoints.push({
        source: 'Bhakoot Match',
        value: 'Excellent',
        significance: 'Moon positions are harmonious'
      });
    }

    return {
      name: 'Emotional Compatibility',
      weight: FACTOR_WEIGHTS.emotionalCompatibility.weight,
      score: Math.min(subScore, 100),
      impact: subScore >= 70 ? 'high' : subScore >= 50 ? 'medium' : 'low',
      description: 'Emotional understanding and support capacity',
      dataPoints
    };
  }

  private analyzeRiskProfile(risk: RiskAssessment): RankingFactor {
    // Calculate RAW risk scores (without protective buffer)
    // AI analyzes based on raw astrological risk, not mitigated risk
    const rawDivorceScore = this.calculateRawDivorceScore(risk);
    const rawInfidelityScore = this.calculateRawInfidelityScore(risk);

    const dataPoints: DataPoint[] = [
      {
        source: 'Divorce Probability (Raw)',
        value: `${rawDivorceScore}/100`,
        significance: rawDivorceScore >= 70 ? 'Very High' : rawDivorceScore >= 45 ? 'High' : rawDivorceScore >= 20 ? 'Medium' : 'Low'
      },
      {
        source: 'Infidelity Risk (Raw)',
        value: `${rawInfidelityScore}/100`,
        significance: rawInfidelityScore >= 60 ? 'High' : rawInfidelityScore >= 30 ? 'Medium' : 'Low'
      },
      {
        source: 'Multiple Marriage Indicators',
        value: risk.multipleMarriageIndicators.length,
        significance: 'Destabilizing factors'
      }
    ];

    // Add protective buffer info for transparency
    if (risk.protectiveFactors && risk.protectiveFactors.length > 0) {
      dataPoints.push({
        source: 'Protective Factors (Ignored by AI)',
        value: risk.protectiveFactors.length,
        significance: 'Buffer not applied in AI analysis for conservative assessment'
      });
    }

    // STRONG PENALTIES for critical risk factors - using RAW scores
    let subScore = 100;

    // Divorce Risk: HEAVY penalty - user wants very low risk
    // Using RAW score (without protective buffer)
    if (rawDivorceScore <= 20) {
      subScore -= rawDivorceScore * 0.3; // Light penalty for low risk
    } else if (rawDivorceScore <= 35) {
      subScore -= 6 + (rawDivorceScore - 20) * 1.0; // Moderate penalty
    } else if (rawDivorceScore <= 50) {
      subScore -= 21 + (rawDivorceScore - 35) * 2.0; // Heavy penalty for medium risk
    } else if (rawDivorceScore <= 70) {
      subScore -= 51 + (rawDivorceScore - 50) * 2.5; // Very heavy penalty
    } else {
      subScore -= 101 + (rawDivorceScore - 70) * 3.0; // Critical penalty
    }

    // Infidelity Risk: STRONG penalty - user wants very low risk
    // Using RAW score (without protective buffer)
    if (rawInfidelityScore <= 20) {
      subScore -= rawInfidelityScore * 0.2; // Light penalty for low risk
    } else if (rawInfidelityScore <= 35) {
      subScore -= 4 + (rawInfidelityScore - 20) * 0.9; // Moderate penalty
    } else if (rawInfidelityScore <= 50) {
      subScore -= 17.5 + (rawInfidelityScore - 35) * 1.8; // Heavy penalty for medium risk
    } else if (rawInfidelityScore <= 70) {
      subScore -= 44.5 + (rawInfidelityScore - 50) * 2.2; // Very heavy penalty
    } else {
      subScore -= 88.5 + (rawInfidelityScore - 70) * 2.8; // Critical penalty
    }

    subScore -= risk.multipleMarriageIndicators.length * 3;

    return {
      name: 'Risk Profile (Raw Scores - Buffer OFF)',
      weight: FACTOR_WEIGHTS.riskProfile.weight,
      score: Math.max(0, Math.round(subScore)),
      impact: subScore >= 70 ? 'high' : subScore >= 50 ? 'medium' : 'low',
      description: 'AI analyzes raw astrological risk without protective buffers for conservative assessment',
      dataPoints
    };
  }

  // Return raw divorce score from assessment
  private calculateRawDivorceScore(risk: RiskAssessment): number {
    return risk.divorceProbability.rawScore;
  }

  // Return raw infidelity score from assessment
  private calculateRawInfidelityScore(risk: RiskAssessment): number {
    return risk.infidelityRisk.rawScore;
  }

  private analyzeDoshaFactor(ashtakoot: AshtakootResult): RankingFactor {
    const dataPoints: DataPoint[] = [];
    let subScore = 100;

    // CRITICAL: Nadi Dosha - User priority #1: Same Nadi should NOT be there
    if (ashtakoot.doshas.nadiDosha) {
      // Check if there's cancellation
      const hasNadiCancellation = ashtakoot.exceptions.some(e =>
        e.toLowerCase().includes('nadi')
      );

      if (hasNadiCancellation) {
        // Even with cancellation, it's still a concern
        subScore -= 35;
        dataPoints.push({
          source: 'Nadi Dosha',
          value: 'Present (Partially Cancelled)',
          significance: 'CRITICAL: Same Nadi detected - major health/progeny concerns despite cancellation'
        });
      } else {
        // No cancellation - SEVERE penalty
        subScore -= 70; // Massive penalty for uncancelled Nadi Dosha
        dataPoints.push({
          source: 'Nadi Dosha',
          value: 'Present (No Cancellation)',
          significance: 'CRITICAL ALERT: Same Nadi without cancellation - strongly advised against'
        });
      }
    } else {
      // No Nadi Dosha - excellent!
      subScore += 10; // Bonus for no Nadi Dosha
      dataPoints.push({
        source: 'Nadi Dosha',
        value: 'Absent (Excellent)',
        significance: '✓ Different Nadi - compatible for health and progeny'
      });
    }

    // Bhakoot Dosha - moderate importance
    if (ashtakoot.doshas.bhakootDosha) {
      const hasBhakootCancellation = ashtakoot.exceptions.some(e =>
        e.toLowerCase().includes('bhakoot')
      );

      if (hasBhakootCancellation) {
        subScore -= 10;
        dataPoints.push({
          source: 'Bhakoot Dosha',
          value: 'Present (Cancelled)',
          significance: 'Emotional differences mitigated'
        });
      } else {
        subScore -= 20;
        dataPoints.push({
          source: 'Bhakoot Dosha',
          value: 'Present',
          significance: 'Emotional disconnect risk - requires attention'
        });
      }
    }

    // Gana Dosha - lower importance
    if (ashtakoot.doshas.ganaDosha) {
      const hasGanaCancellation = ashtakoot.exceptions.some(e =>
        e.toLowerCase().includes('gana')
      );

      if (hasGanaCancellation) {
        subScore -= 5;
      } else {
        subScore -= 10;
        dataPoints.push({
          source: 'Gana Dosha',
          value: 'Present',
          significance: 'Temperament differences'
        });
      }
    }

    return {
      name: 'Dosha Analysis (Nadi Priority)',
      weight: FACTOR_WEIGHTS.doshaAnalysis.weight,
      score: Math.max(0, Math.min(100, subScore)),
      impact: subScore >= 70 ? 'high' : subScore >= 50 ? 'medium' : 'low',
      description: 'Challenging astrological combinations and their mitigation',
      dataPoints
    };
  }

  private analyzeSexualCompatibilityFactor(sexual: SexualCompatibility): RankingFactor {
    const dataPoints: DataPoint[] = [
      {
        source: 'Yoni Match',
        value: `${sexual.yoniMatch.yoniA} & ${sexual.yoniMatch.yoniB}`,
        significance: `${sexual.yoniMatch.score}% compatible`
      },
      {
        source: 'Nakshatra Match',
        value: `${sexual.nakshatraMatch.score}%`,
        significance: 'Psychological compatibility'
      },
      {
        source: 'Overall Score',
        value: `${sexual.overallScore}%`,
        significance: 'Physical intimacy potential'
      }
    ];

    const subScore = sexual.overallScore;

    return {
      name: 'Sexual Compatibility',
      weight: FACTOR_WEIGHTS.sexualCompatibility.weight,
      score: subScore,
      impact: subScore >= 70 ? 'high' : subScore >= 50 ? 'medium' : 'low',
      description: 'Physical and sexual harmony indicators',
      dataPoints
    };
  }

  private analyzePhysicalAttraction(synastry: SynastryData, chartA: Chart, chartB: Chart): RankingFactor {
    const dataPoints: DataPoint[] = [];
    let subScore = 50;

    // Mars-Venus connections
    const marsVenusConnections = synastry.sexualChemistry?.length || 0;
    subScore += marsVenusConnections * 8;
    dataPoints.push({
      source: 'Mars-Venus Chemistry',
      value: marsVenusConnections,
      significance: 'Passion and attraction'
    });

    // Ascendant compatibility
    const ascendantDiff = Math.abs(
      this.getSignIndex(chartA.ascendant) - this.getSignIndex(chartB.ascendant)
    );
    const ascendantHarmony = [0, 4, 5, 8].includes(ascendantDiff);
    if (ascendantHarmony) {
      subScore += 20;
      dataPoints.push({
        source: 'Ascendant Compatibility',
        value: 'Harmonious',
        significance: 'Natural physical attraction'
      });
    }

    return {
      name: 'Physical Attraction',
      weight: FACTOR_WEIGHTS.physicalAttraction.weight,
      score: Math.min(subScore, 100),
      impact: subScore >= 70 ? 'high' : subScore >= 50 ? 'medium' : 'low',
      description: 'Physical chemistry and attraction indicators',
      dataPoints
    };
  }

  private analyzeTimingFactor(timing: TimingAnalysis): RankingFactor {
    const dataPoints: DataPoint[] = [
      {
        source: 'Favorable Periods',
        value: timing.favorablePeriods.length,
        significance: 'Windows of opportunity'
      },
      {
        source: 'Partner A Dasha',
        value: timing.partnerA.favourability,
        significance: 'Current life phase'
      },
      {
        source: 'Partner B Dasha',
        value: timing.partnerB.favourability,
        significance: 'Current life phase'
      }
    ];

    let subScore = 50;
    subScore += timing.favorablePeriods.length * 10;
    if (timing.partnerA.favourability === 'positive') subScore += 15;
    if (timing.partnerB.favourability === 'positive') subScore += 15;

    return {
      name: 'Timing & Dasha Alignment',
      weight: FACTOR_WEIGHTS.timing.weight,
      score: Math.min(subScore, 100),
      impact: subScore >= 70 ? 'high' : subScore >= 50 ? 'medium' : 'low',
      description: 'Astrological timing for relationship success',
      dataPoints
    };
  }

  private analyzeInLawFactor(inLawA?: any, inLawB?: any): RankingFactor {
    const dataPoints: DataPoint[] = [];
    let subScore = 50;

    if (inLawA) {
      const avgA = (inLawA.secondHouseScore + inLawA.tenthHouseScore) / 2;
      subScore += avgA * 0.4;
      dataPoints.push({
        source: 'Your In-Law Score',
        value: Math.round(avgA),
        significance: 'Family integration potential'
      });
    }

    if (inLawB) {
      const avgB = (inLawB.secondHouseScore + inLawB.tenthHouseScore) / 2;
      subScore += avgB * 0.4;
      dataPoints.push({
        source: 'Partner In-Law Score',
        value: Math.round(avgB),
        significance: 'Their family integration'
      });
    }

    return {
      name: 'In-Law Compatibility',
      weight: FACTOR_WEIGHTS.inLawCompatibility.weight,
      score: Math.min(Math.round(subScore), 100),
      impact: subScore >= 70 ? 'high' : subScore >= 50 ? 'medium' : 'low',
      description: 'Family relationship and integration potential',
      dataPoints
    };
  }

  private analyzeKPFactor(kpAnalysis: any, kpCompatibility?: any): RankingFactor {
    const dataPoints: DataPoint[] = [];
    let subScore = 50;

    if (kpCompatibility) {
      if (kpCompatibility.cslConnection?.hasConnection) {
        subScore += 15;
        dataPoints.push({
          source: 'CSL Connection',
          value: 'Present',
          significance: 'Cusp sub-lord harmony'
        });
      }
      if (kpCompatibility.rulingPlanetConnection?.score) {
        subScore += kpCompatibility.rulingPlanetConnection.score * 10;
        dataPoints.push({
          source: 'Ruling Planet Alignment',
          value: kpCompatibility.rulingPlanetConnection.score,
          significance: 'Timing compatibility'
        });
      }
    }

    return {
      name: 'KP Astrology Indicators',
      weight: FACTOR_WEIGHTS.kpAnalysis.weight,
      score: Math.min(subScore, 100),
      impact: subScore >= 70 ? 'high' : subScore >= 50 ? 'medium' : 'low',
      description: 'Krishnamurti Paddhati precision indicators',
      dataPoints
    };
  }

  private analyzeJaiminiFactor(jaimini: any): RankingFactor {
    const dataPoints: DataPoint[] = [];
    let subScore = 50;

    if (jaimini.soulLink?.hasLink) {
      subScore += 20;
      dataPoints.push({
        source: 'Soul Link',
        value: 'Present',
        significance: 'Deep spiritual connection'
      });
    }

    if (jaimini.darakarakaContact) {
      const typeScores: Record<string, number> = {
        'trine': 20,
        'kendra': 15,
        'mutual': 10,
        'opposition': -10,
        'none': -15
      };
      subScore += typeScores[jaimini.darakarakaContact.type] || 0;
      dataPoints.push({
        source: 'Darakaraka Contact',
        value: jaimini.darakarakaContact.type,
        significance: 'Spouse indicator connection'
      });
    }

    return {
      name: 'Jaimini Indicators',
      weight: FACTOR_WEIGHTS.jaimini.weight,
      score: Math.max(0, Math.min(100, subScore)),
      impact: subScore >= 70 ? 'high' : subScore >= 50 ? 'medium' : 'low',
      description: 'Jaimini astrology soul connection indicators',
      dataPoints
    };
  }

  private analyzeDivisionalFactor(divisional: DivisionalChartAnalysis): RankingFactor {
    const dataPoints: DataPoint[] = [];
    let subScore = 50;

    // D7 Children analysis
    if (divisional.d7?.fertility) {
      subScore += 10;
      dataPoints.push({
        source: 'Progeny Potential',
        value: 'Indicated',
        significance: 'Family expansion compatibility'
      });
    }

    // D60 Karma
    if (divisional.d60?.marriageDestiny) {
      const destinyPositive = !divisional.d60.marriageDestiny.includes('testing') &&
        !divisional.d60.marriageDestiny.includes('difficult');
      if (destinyPositive) subScore += 15;
      dataPoints.push({
        source: 'Karmic Destiny',
        value: destinyPositive ? 'Favorable' : 'Challenging',
        significance: 'Past-life relationship patterns'
      });
    }

    return {
      name: 'Divisional Charts Analysis',
      weight: FACTOR_WEIGHTS.divisionalCharts.weight,
      score: Math.min(subScore, 100),
      impact: subScore >= 70 ? 'high' : subScore >= 50 ? 'medium' : 'low',
      description: 'Varga charts for specific life areas',
      dataPoints
    };
  }

  private analyzeMentalHealthFactor(mentalHealth: any): RankingFactor {
    const dataPoints: DataPoint[] = [];
    let subScore = 70;

    const partnerA = mentalHealth.partnerA;
    const partnerB = mentalHealth.partnerB;

    // Stability indicators
    if (partnerA?.stabilityScore) {
      subScore += (partnerA.stabilityScore - 50) * 0.3;
      dataPoints.push({
        source: 'Your Mental Stability',
        value: partnerA.stabilityScore,
        significance: 'Emotional resilience'
      });
    }

    if (partnerB?.stabilityScore) {
      subScore += (partnerB.stabilityScore - 50) * 0.3;
      dataPoints.push({
        source: 'Partner Mental Stability',
        value: partnerB.stabilityScore,
        significance: 'Their emotional resilience'
      });
    }

    return {
      name: 'Mental Health Compatibility',
      weight: FACTOR_WEIGHTS.mentalHealth.weight,
      score: Math.max(0, Math.min(100, Math.round(subScore))),
      impact: subScore >= 70 ? 'high' : subScore >= 50 ? 'medium' : 'low',
      description: 'Emotional and psychological wellness indicators',
      dataPoints
    };
  }

  private analyzeLifestyleFactor(modernChallenges: any, report: CompatibilityReport): RankingFactor {
    const dataPoints: DataPoint[] = [];
    let subScore = 70;

    // Modern challenges
    const totalChallenges =
      (modernChallenges?.digitalAge?.length || 0) +
      (modernChallenges?.careerStress?.length || 0) +
      (modernChallenges?.mentalHealth?.length || 0) +
      (modernChallenges?.communicationIssues?.length || 0);

    subScore -= totalChallenges * 3;
    dataPoints.push({
      source: 'Modern Challenges',
      value: totalChallenges,
      significance: 'Contemporary relationship stressors'
    });

    // Career alignment (from spouse prediction)
    const careerA = report.spousePrediction?.profession?.field;
    const careerB = report.partnerSpousePrediction?.profession?.field;
    if (careerA && careerB) {
      dataPoints.push({
        source: 'Career Fields',
        value: `${careerA} / ${careerB}`,
        significance: 'Professional life compatibility'
      });
    }

    return {
      name: 'Lifestyle & Modern Factors',
      weight: FACTOR_WEIGHTS.lifestyle.weight,
      score: Math.max(0, Math.min(100, Math.round(subScore))),
      impact: subScore >= 70 ? 'high' : subScore >= 50 ? 'medium' : 'low',
      description: 'Contemporary lifestyle and value compatibility',
      dataPoints
    };
  }

  // ============================================================================
  // SCORING & CALCULATION
  // ============================================================================

  private calculateWeightedScore(factors: RankingFactor[]): number {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const factor of factors) {
      weightedSum += factor.score * factor.weight;
      totalWeight += factor.weight;
    }

    // Normalize to 0-100
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50;
  }

  // ============================================================================
  // STRENGTH & CHALLENGE IDENTIFICATION
  // ============================================================================

  private identifyStrengthAreas(report: CompatibilityReport, partnerChart: Chart): StrengthArea[] {
    const strengths: StrengthArea[] = [];

    // Ashtakoot strengths
    const ashtakoot = report.ashtakoot;
    if (ashtakoot.totalScore >= 28) {
      strengths.push({
        category: 'Traditional',
        title: 'Excellent Ashtakoot Match',
        description: `Scoring ${ashtakoot.totalScore}/36 gunas, this is an exceptional traditional match`,
        evidence: [
          `Total Score: ${ashtakoot.totalScore}/36`,
          `Percentage: ${Math.round(ashtakoot.percentage)}%`,
          `Verdict: ${ashtakoot.percentage >= 75 ? 'Excellent' : 'Good'}`
        ],
        astrologicalBasis: 'Vedic Ashtakoot Milan system analyzing 8 compatibility factors',
        impactScore: 95
      });
    }

    // Synastry strengths
    if (report.synastry.soulmateConnections.length > 0) {
      const topConnections = report.synastry.soulmateConnections.slice(0, 3);
      strengths.push({
        category: 'Soul Connection',
        title: `${topConnections.length} Soulmate Indicators`,
        description: 'Multiple harmonious planetary connections indicate natural affinity',
        evidence: topConnections.map(c => `${c.planet1} - ${c.planet2} (${c.aspectType})`),
        astrologicalBasis: 'Synastry aspects between personal planets (Sun, Moon, Venus, Jupiter)',
        impactScore: 90
      });
    }

    // Emotional harmony
    if (ashtakoot.parameters.bhakoot.pointsObtained >= 7) {
      const moonA = this.selfChart.planetaryPositions.find(p => p.planet === 'Moon');
      const moonB = partnerChart.planetaryPositions.find(p => p.planet === 'Moon');
      strengths.push({
        category: 'Emotional',
        title: 'Deep Emotional Bond',
        description: `Your Moon signs (${moonA?.sign} & ${moonB?.sign}) create natural emotional understanding`,
        evidence: [
          `Bhakoot Score: ${ashtakoot.parameters.bhakoot.pointsObtained}/7`,
          `Moon Signs: ${moonA?.sign} & ${moonB?.sign}`,
          `Nakshatras: ${moonA?.nakshatra} & ${moonB?.nakshatra}`
        ],
        astrologicalBasis: 'Moon sign compatibility indicates emotional resonance and mutual support',
        impactScore: 85
      });
    }

    // Sexual compatibility
    if (report.sexualCompatibility.overallScore >= 75) {
      strengths.push({
        category: 'Physical',
        title: 'Strong Physical Chemistry',
        description: `Yoni match (${report.sexualCompatibility.yoniMatch.yoniA} & ${report.sexualCompatibility.yoniMatch.yoniB}) indicates excellent physical harmony`,
        evidence: [
          `Overall Score: ${report.sexualCompatibility.overallScore}%`,
          `Yoni Score: ${report.sexualCompatibility.yoniMatch.score}%`,
          `Nature: ${report.sexualCompatibility.yoniMatch.nature}`
        ],
        astrologicalBasis: 'Yoni and Nakshatra compatibility analysis',
        impactScore: 80
      });
    }

    // Mental friendship
    if (ashtakoot.parameters.grahaMaitri.pointsObtained >= 4) {
      strengths.push({
        category: 'Mental',
        title: 'Natural Mental Rapport',
        description: 'Your Moon sign lords are friendly, creating easy communication and understanding',
        evidence: [
          `Graha Maitri Score: ${ashtakoot.parameters.grahaMaitri.pointsObtained}/5`,
          `Relationship: ${ashtakoot.parameters.grahaMaitri.interpretation}`,
          `Lords: ${ashtakoot.parameters.grahaMaitri.boyValue} & ${ashtakoot.parameters.grahaMaitri.girlValue}`
        ],
        astrologicalBasis: 'Planetary friendship between Moon sign lords',
        impactScore: 75
      });
    }

    // Timing
    if (report.timing.favorablePeriods.length > 0) {
      strengths.push({
        category: 'Timing',
        title: 'Favorable Timing Windows',
        description: `${report.timing.favorablePeriods.length} favorable periods identified for relationship development`,
        evidence: report.timing.favorablePeriods.slice(0, 3).map(p =>
          `${p.startDate.toLocaleDateString()} - ${p.endDate.toLocaleDateString()}`
        ),
        astrologicalBasis: 'Dasha and transit analysis showing supportive planetary periods',
        impactScore: 70
      });
    }

    // Sort by impact
    return strengths.sort((a, b) => b.impactScore - a.impactScore);
  }

  private identifyChallengeAreas(report: CompatibilityReport, partnerChart: Chart, overallScore: number): ChallengeArea[] {
    const challenges: ChallengeArea[] = [];
    const ashtakoot = report.ashtakoot;

    // Nadi Dosha
    if (ashtakoot.doshas.nadiDosha) {
      const cancelled = ashtakoot.exceptions.some(e => e.includes('Nadi'));
      challenges.push({
        category: 'Health',
        title: 'Nadi Dosha Present',
        description: cancelled
          ? 'Nadi Dosha exists but has cancellation factors, reducing its impact'
          : 'Same Nadi may indicate health and progeny challenges',
        severity: cancelled ? 'minor' : 'moderate',
        mitigationStrategies: [
          'Donate grains equivalent to your weight (Tula Dana)',
          'Chant Mahamrityunjaya mantra regularly',
          'Strengthen Jupiter through remedies',
          'Consult with a knowledgeable astrologer'
        ],
        astrologicalBasis: 'Same Ayurvedic constitution (Vata/Pitta/Kapha) may cause health imbalances'
      });
    }

    // Bhakoot Dosha
    if (ashtakoot.doshas.bhakootDosha) {
      const cancelled = ashtakoot.exceptions.some(e => e.includes('Bhakoot'));
      challenges.push({
        category: 'Emotional',
        title: 'Bhakoot Dosha (Emotional Distance)',
        description: cancelled
          ? 'Moon position challenge exists but is mitigated by cancellation factors'
          : 'Different emotional needs may require conscious understanding',
        severity: cancelled ? 'minor' : 'moderate',
        mitigationStrategies: [
          'Practice active listening and emotional validation',
          'Gift silver items to each other',
          'Keep water by bedside overnight',
          'Regular meditation together'
        ],
        astrologicalBasis: 'Moon sign positions in challenging relative houses (2/12, 5/9, 6/8)'
      });
    }

    // Gana Dosha
    if (ashtakoot.doshas.ganaDosha) {
      const cancelled = ashtakoot.exceptions.some(e => e.includes('Gana'));
      challenges.push({
        category: 'Temperament',
        title: 'Gana Dosha (Temperament Difference)',
        description: cancelled
          ? 'Temperament differences present but manageable with effort'
          : 'Different natures (Deva/Manushya/Rakshasa) require patience and compromise',
        severity: cancelled ? 'minor' : 'moderate',
        mitigationStrategies: [
          'Worship Lord Ganesha together',
          'Practice patience during disagreements',
          'Offer Durva grass on Wednesdays',
          'Focus on common spiritual practices'
        ],
        astrologicalBasis: 'Nakshatra gana types create different energy levels and reactions'
      });
    }

    // Risk factors
    if (report.riskAssessment.divorceProbability.score > 35) {
      challenges.push({
        category: 'Risk',
        title: 'Relationship Stability Concerns',
        description: `Divorce probability indicators show ${report.riskAssessment.divorceProbability.level} risk level`,
        severity: report.riskAssessment.divorceProbability.score > 70 ? 'critical' : 'moderate',
        mitigationStrategies: [
          ...report.riskAssessment.divorceProbability.mitigation,
          'Regular relationship check-ins',
          'Pre-marital counseling recommended',
          'Focus on communication skills'
        ],
        astrologicalBasis: 'Separative planets in 7th house, afflicted Venus/Jupiter indicators'
      });
    }

    // Manglik mismatch
    if (ashtakoot.manglikAnalysis?.compatibility === 'Low') {
      challenges.push({
        category: 'Energy',
        title: 'Mars Energy Mismatch',
        description: 'Different Mars placements may create energy level conflicts',
        severity: 'moderate',
        mitigationStrategies: [
          'Both should perform Manglik remedies',
          'Channel Mars energy into physical activities together',
          'Practice patience during conflicts',
          'Consider Kumbh Vivah remedy if appropriate'
        ],
        astrologicalBasis: 'One partner is Manglik while other is not, creating energy imbalance'
      });
    }

    // General score-based friction (if no other major challenges)
    if (challenges.length === 0 && overallScore < 65) {
      challenges.push({
        category: 'Synergy',
        title: 'Moderate Dynamic Friction',
        description: 'While no major doshas are present, the overall planetary synergy suggests a need for conscious adjustment.',
        severity: 'moderate',
        mitigationStrategies: [
          'Focus on shared goal-setting',
          'Practice open communication about expectations',
          'Give each other space for individual growth'
        ],
        astrologicalBasis: 'Average overall compatibility score indicates mixed planetary interactions'
      });
    }

    return challenges;
  }

  private identifyUniqueAdvantages(strengths: StrengthArea[], report: CompatibilityReport): string[] {
    const advantages: string[] = [];

    // Find top 3 unique strengths
    const topStrengths = strengths.slice(0, 3);

    topStrengths.forEach(strength => {
      advantages.push(`${strength.title}: ${strength.description}`);
    });

    // Add special indicators
    if (report.synastry.karmicBonds.length > 0) {
      advantages.push(`Karmic Connection: ${report.synastry.karmicBonds.length} past-life indicators suggest deep soul-level bond`);
    }

    if (report.divisionalAnalysis.d60?.marriageDestiny?.includes('Destined')) {
      advantages.push('Destined Union: D60 chart indicates this relationship is part of your karmic path');
    }

    return advantages;
  }

  private analyzeRiskFactors(report: CompatibilityReport): RiskFactor[] {
    const risks: RiskFactor[] = [];

    // CRITICAL: Use RAW scores (without protective buffer) for risk factor detection
    // The report stores buffered scores which can be misleadingly low
    const rawDivorceScore = this.calculateRawDivorceScore(report.riskAssessment);
    const rawInfidelityScore = this.calculateRawInfidelityScore(report.riskAssessment);

    // Divorce risk - using RAW score
    if (rawDivorceScore > 25) {
      risks.push({
        type: 'Relationship Stability',
        level: rawDivorceScore > 60 ? 'high' : rawDivorceScore > 40 ? 'medium' : 'medium',
        description: `${report.riskAssessment.divorceProbability.level} probability of separation (Raw: ${rawDivorceScore}%)`,
        indicators: report.riskAssessment.divorceProbability.indicators.map(i => i.text),
        mitigationAvailable: report.riskAssessment.divorceProbability.mitigation.length > 0
      });
    }

    // Infidelity risk - using RAW score
    if (rawInfidelityScore > 25) {
      risks.push({
        type: 'Trust & Loyalty',
        level: rawInfidelityScore > 60 ? 'high' : rawInfidelityScore > 35 ? 'medium' : 'medium',
        description: `${report.riskAssessment.infidelityRisk.level} risk of trust issues (Raw: ${rawInfidelityScore}%)`,
        indicators: report.riskAssessment.infidelityRisk.indicators.map(i => i.text),
        mitigationAvailable: true
      });
    }

    // Multiple marriage
    if (report.riskAssessment.multipleMarriageIndicators.length > 0) {
      risks.push({
        type: 'Longevity',
        level: report.riskAssessment.multipleMarriageIndicators.length > 2 ? 'high' : 'medium',
        description: `${report.riskAssessment.multipleMarriageIndicators.length} indicators suggest potential for multiple marriages`,
        indicators: report.riskAssessment.multipleMarriageIndicators.map(i => i.text),
        mitigationAvailable: true
      });
    }

    // Dosha risks
    if (report.ashtakoot.doshas.nadiDosha) {
      risks.push({
        type: 'Health & Progeny',
        level: 'medium',
        description: 'Nadi Dosha may affect health compatibility and progeny matters',
        indicators: ['Same Nadi type in Ashtakoot analysis'],
        mitigationAvailable: report.ashtakoot.exceptions.some(e => e.includes('Nadi'))
      });
    }

    return risks;
  }

  // ============================================================================
  // COMPATIBILITY SIGNATURE
  // ============================================================================

  private createCompatibilitySignature(report: CompatibilityReport, partnerChart: Chart): CompatibilitySignature {
    const ashtakoot = report.ashtakoot;
    const synastry = report.synastry;

    const psychA = report.psychologicalProfileA;
    const psychB = report.psychologicalProfileB;

    let emotionalSign = ashtakoot.parameters.bhakoot.pointsObtained >= 7
      ? 'Deeply Harmonious'
      : ashtakoot.parameters.bhakoot.pointsObtained >= 4
        ? 'Moderately Connected'
        : 'Requires Conscious Effort';

    // Enhance with attachment styles
    if (psychA && psychB) {
      if (psychA.attachmentStyle.type === 'secure' && psychB.attachmentStyle.type === 'secure') {
        emotionalSign += ' (High Emotional Safety)';
      } else if (psychA.attachmentStyle.type !== 'secure' || psychB.attachmentStyle.type !== 'secure') {
        emotionalSign += ' (Dynamic Emotional Work Needed)';
      }
    }

    let mentalSign = ashtakoot.parameters.grahaMaitri.pointsObtained >= 4
      ? 'Strong Synergy'
      : ashtakoot.parameters.grahaMaitri.pointsObtained >= 2
        ? 'Fair Alignment'
        : 'Conflicting Viewpoints';

    // Enhance with communication styles
    if (psychA && psychB) {
      if (psychA.communicationStyle.style.includes('Direct') && psychB.communicationStyle.style.includes('Direct')) {
        mentalSign += ' (Direct & Honest Exchange)';
      } else if (psychA.communicationStyle.style !== psychB.communicationStyle.style) {
        mentalSign += ' (Differing Communication Needs)';
      }
    }

    return {
      emotionalProfile: emotionalSign,
      mentalProfile: mentalSign,
      sexualSynergy: ashtakoot.parameters.yoni.pointsObtained >= 3
        ? 'High Compatibility'
        : ashtakoot.parameters.yoni.pointsObtained >= 2
          ? 'Normal'
          : 'Low/Conflicting',
      socialProfile: ashtakoot.parameters.gana.pointsObtained >= 4
        ? 'Public Power Couple'
        : 'Private/Internal Focus',
      karmicWeight: (synastry.karmicBonds.length > 2 || report.navamsaMatching.score > 80)
        ? 'Heavily Destined'
        : 'Modern/Choice-Based'
    };
  }

  // ============================================================================
  // EXPLANATION GENERATION
  // ============================================================================

  private generateExplanationData(
    report: CompatibilityReport,
    partner: { id: string; name: string; chart?: Chart },
    comparisonScore: ComparisonScore,
    rankingFactors: RankingFactor[]
  ): ExplanationData {
    const sections: DetailedAnalysisSection[] = [];

    // Section 1: Overview
    sections.push({
      title: 'Match Overview',
      content: this.generateOverviewContent(report, partner.name),
      subsections: [
        {
          title: 'Overall Score',
          content: `This match scores ${comparisonScore.overall}/100 overall, rated as "${comparisonScore.label}" compatibility.`,
          data: {
            'Overall Score': comparisonScore.overall,
            'Category': comparisonScore.label,
            'Ashtakoot Points': `${report.ashtakoot.totalScore}/36`
          }
        },
        {
          title: 'Category Breakdown',
          content: 'Detailed scoring across six major compatibility categories:',
          data: {
            'Traditional': `${comparisonScore.categories.traditional}%`,
            'Relationship': `${comparisonScore.categories.relationship}%`,
            'Risk Profile': `${comparisonScore.categories.risk}%`,
            'Intimacy': `${comparisonScore.categories.intimacy}%`,
            'Advanced': `${comparisonScore.categories.advanced}%`,
            'Timing': `${comparisonScore.categories.timing}%`
          }
        }
      ]
    });

    // Section 2: Traditional Analysis
    sections.push({
      title: 'Traditional Vedic Analysis (Ashtakoot)',
      content: this.generateAshtakootContent(report.ashtakoot),
      subsections: [
        {
          title: '8-Factor Breakdown',
          content: 'Detailed scoring for each Ashtakoot parameter:',
          data: {
            'Varna': `${report.ashtakoot.parameters.varna.pointsObtained}/1`,
            'Vashya': `${report.ashtakoot.parameters.vashya.pointsObtained}/2`,
            'Tara': `${report.ashtakoot.parameters.tara.pointsObtained}/3`,
            'Yoni': `${report.ashtakoot.parameters.yoni.pointsObtained}/4`,
            'Graha Maitri': `${report.ashtakoot.parameters.grahaMaitri.pointsObtained}/5`,
            'Gana': `${report.ashtakoot.parameters.gana.pointsObtained}/6`,
            'Bhakoot': `${report.ashtakoot.parameters.bhakoot.pointsObtained}/7`,
            'Nadi': `${report.ashtakoot.parameters.nadi.pointsObtained}/8`
          }
        },
        {
          title: 'Dosha Analysis',
          content: this.generateDoshaContent(report.ashtakoot)
        }
      ]
    });

    // Section 3: Synastry Analysis
    sections.push({
      title: 'Synastry (Chart Interactions)',
      content: this.generateSynastryContent(report.synastry)
    });

    // Section 4: Risk Assessment
    sections.push({
      title: 'Risk Assessment',
      content: this.generateRiskContent(report.riskAssessment)
    });

    // Section 5: Psychological Dynamic
    if (report.psychologicalProfileA && report.psychologicalProfileB) {
      const pA = report.psychologicalProfileA;
      const pB = report.psychologicalProfileB;

      sections.push({
        title: 'Psychological Dynamic',
        content: 'Analysis of how your individual psychological patterns interact:',
        subsections: [
          {
            title: 'Attachment & Safety',
            content: `Interaction between ${pA.attachmentStyle.type} and ${pB.attachmentStyle.type} attachment styles.`,
            data: {
              'Your Style': pA.attachmentStyle.type,
              'Partner Style': pB.attachmentStyle.type,
              'Dynamic': this.getAttachmentDynamic(pA.attachmentStyle.type, pB.attachmentStyle.type)
            }
          },
          {
            title: 'Communication & Expression',
            content: `How you exchange ideas and handle conflicts:`,
            data: {
              'Your Method': pA.communicationStyle.style,
              'Partner Method': pB.communicationStyle.style,
              'Resolution': `${pA.communicationStyle.conflictResolution} meets ${pB.communicationStyle.conflictResolution}`
            }
          },
          {
            title: 'Love Languages (Venusian Flow)',
            content: `Alignment in how you give and receive affection:`,
            data: {
              'Your Primary': pA.loveLanguage.primary,
              'Partner Primary': pB.loveLanguage.primary,
              'Harmony': pA.loveLanguage.primary === pB.loveLanguage.primary ? 'Highly Synced' : 'Requires Learning Each Other'
            }
          }
        ]
      });
    }

    // Section 6: Conflict Zones
    if (report.conflictZone) {
      const cz = report.conflictZone;
      sections.push({
        title: 'Conflict Zones & Friction Areas',
        content: cz.awarenessNote,
        subsections: [
          {
            title: 'Primary Categories',
            content: 'Analysis of specific areas where friction is most likely to surface:',
            data: {
              'People/Family': cz.people.length > 0 ? `${cz.people.length} Trigger(s)` : 'Clear',
              'Finance/Things': cz.things.length > 0 ? `${cz.things.length} Trigger(s)` : 'Clear',
              'Ideology/Values': cz.ideology.length > 0 ? `${cz.ideology.length} Trigger(s)` : 'Clear',
              'Behavior/Habits': cz.behavior.length > 0 ? `${cz.behavior.length} Trigger(s)` : 'Clear'
            }
          },
          {
            title: 'Overall Severity',
            content: `Categorized as ${cz.overallSeverity} Intensity. ${cz.awarenessNote}`
          }
        ]
      });
    }

    // Generate highlights
    const highlights: KeyHighlight[] = [];

    // Top strengths
    const topStrengths = rankingFactors
      .filter(f => f.score >= 70)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    topStrengths.forEach(factor => {
      highlights.push({
        type: 'positive',
        title: factor.name,
        description: factor.description,
        importance: factor.weight * 100
      });
    });

    // Key challenges
    const challenges = rankingFactors
      .filter(f => f.score < 50)
      .slice(0, 2);

    challenges.forEach(factor => {
      highlights.push({
        type: 'negative',
        title: `${factor.name} - Attention Needed`,
        description: factor.description,
        importance: factor.weight * 100
      });
    });

    // Astrological evidence
    const evidence: AstrologicalEvidence[] = [];

    // Moon positions
    const moonA = this.selfChart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Moon');
    const moonB = partner.chart?.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Moon');
    if (moonA && moonB) {
      evidence.push({
        category: 'Emotional Foundation',
        evidence: `Your Moon is in ${moonA.sign} (${moonA.nakshatra}), partner's Moon in ${moonB.sign} (${moonB.nakshatra})`,
        technicalDetails: `Longitude: ${moonA.longitude.toFixed(2)}° vs ${moonB.longitude.toFixed(2)}°`,
        interpretation: report.ashtakoot.parameters.bhakoot.interpretation
      });
    }

    // Venus positions
    const venusA = this.selfChart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Venus');
    const venusB = partner.chart?.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Venus');
    if (venusA && venusB) {
      evidence.push({
        category: 'Love & Romance',
        evidence: `Venus positions: ${venusA.sign} (House ${venusA.house}) & ${venusB.sign} (House ${venusB.house})`,
        technicalDetails: `Relationship indicator planets placement`,
        interpretation: 'Venus positions indicate love expression styles'
      });
    }

    return {
      executiveSummary: this.generateExecutiveSummary(report, partner.name),
      detailedAnalysis: sections,
      keyHighlights: highlights,
      comparisonWithOthers: [], // Will be filled after all analyses
      astrologicalEvidence: evidence
    };
  }

  private generateOverviewContent(report: CompatibilityReport, partnerName: string): string {
    const score = report.overallScore;
    let content = `Based on comprehensive analysis of your charts with ${partnerName}, `;

    if (score >= 80) {
      content += `this is an **excellent match** with ${score}% compatibility. `;
      content += `The astrological indicators strongly support a harmonious, lasting relationship.`;
    } else if (score >= 65) {
      content += `this is a **strong match** with ${score}% compatibility. `;
      content += `While there may be some areas requiring attention, the foundation is solid for a successful relationship.`;
    } else if (score >= 50) {
      content += `this shows **moderate compatibility** at ${score}%. `;
      content += `With conscious effort and understanding, this relationship can work, but challenges should be addressed proactively.`;
    } else {
      content += `this match shows **significant challenges** with ${score}% compatibility. `;
      content += `Careful consideration and possibly remedial measures are recommended before proceeding.`;
    }

    return content;
  }

  private generateAshtakootContent(ashtakoot: AshtakootResult): string {
    let content = `The Ashtakoot Milan system analyzes 8 key compatibility factors, awarding up to 36 points. `;
    content += `Your match scored **${ashtakoot.totalScore}/${ashtakoot.maxScore}** points (${Math.round(ashtakoot.percentage)}%).\n\n`;

    // Strong areas
    const strongParams = Object.entries(ashtakoot.parameters)
      .filter(([_, p]) => (p.pointsObtained / p.maxPoints) >= 0.8)
      .map(([name, _]) => name);

    if (strongParams.length > 0) {
      content += `**Strong Areas**: ${strongParams.join(', ')} show excellent compatibility. `;
    }

    // Challenge areas
    const weakParams = Object.entries(ashtakoot.parameters)
      .filter(([_, p]) => (p.pointsObtained / p.maxPoints) <= 0.4)
      .map(([name, _]) => name);

    if (weakParams.length > 0) {
      content += `**Areas Needing Attention**: ${weakParams.join(', ')} require conscious effort.`;
    }

    return content;
  }

  private getAttachmentDynamic(typeA: string, typeB: string): string {
    if (typeA === 'secure' && typeB === 'secure') return 'Stable & Emotionally Safe';
    if (typeA === 'secure' || typeB === 'secure') return 'Secure Foundation with Growth Potential';
    if (typeA === 'anxious' && typeB === 'avoidant') return 'Anxious-Avoidant Trap (High Friction)';
    if (typeA === 'avoidant' && typeB === 'anxious') return 'Avoidant-Anxious Trap (High Friction)';
    if (typeA === 'anxious' && typeB === 'anxious') return 'High Sensitivity & Need for Reassurance';
    if (typeA === 'avoidant' && typeB === 'avoidant') return 'Emotional Distance & Self-Reliance';
    return 'Complex Interaction Dynamics';
  }

  private generateDoshaContent(ashtakoot: AshtakootResult): string {
    let content = '';

    if (ashtakoot.doshas.nadiDosha) {
      content += '**Nadi Dosha**: Present - may affect health/progeny. ';
      if (ashtakoot.exceptions.some(e => e.includes('Nadi'))) {
        content += 'However, cancellation factors are present.\n\n';
      } else {
        content += 'Remedial measures recommended.\n\n';
      }
    }

    if (ashtakoot.doshas.bhakootDosha) {
      content += '**Bhakoot Dosha**: Present - emotional understanding may require effort. ';
      if (ashtakoot.exceptions.some(e => e.includes('Bhakoot'))) {
        content += 'Partial cancellation exists.\n\n';
      } else {
        content += 'Patience and communication are key.\n\n';
      }
    }

    if (ashtakoot.doshas.ganaDosha) {
      content += '**Gana Dosha**: Present - different temperaments require compromise.';
    }

    if (!ashtakoot.doshas.nadiDosha && !ashtakoot.doshas.bhakootDosha && !ashtakoot.doshas.ganaDosha) {
      content = '**No Major Doshas**: All primary dosha indicators are clear, which is highly favorable.';
    }

    return content;
  }

  private generateSynastryContent(synastry: SynastryData): string {
    let content = `Synastry analysis examines how planets in both charts interact. `;

    content += `**Soulmate Connections**: ${synastry.soulmateConnections.length} harmonious aspects found. `;
    content += `These indicate natural affinity in key areas.\n\n`;

    if (synastry.karmicBonds.length > 0) {
      content += `**Karmic Bonds**: ${synastry.karmicBonds.length} past-life connections identified. `;
      content += `These suggest a deep soul-level relationship with lessons to learn together.\n\n`;
    }

    content += `**House Overlays**: ${synastry.houseOverlays.length} planetary activations. `;
    content += `This shows where each partner energizes the other's life areas.\n\n`;

    content += `**Planetary Conjunctions**: ${synastry.planetaryConjunctions.length} merged energies. `;
    content += `Conjunctions create powerful shared experiences and understanding.`;

    return content;
  }

  private generateRiskContent(risk: RiskAssessment): string {
    let content = `Risk assessment evaluates potential challenges to relationship longevity.\n\n`;

    content += `**Divorce Probability**: ${risk.divorceProbability.level} (${risk.divorceProbability.score}/100). `;
    if (risk.divorceProbability.mitigation.length > 0) {
      content += `Mitigation strategies available.\n\n`;
    } else {
      content += `\n\n`;
    }

    content += `**Infidelity Risk**: ${risk.infidelityRisk.level} (${risk.infidelityRisk.score}/100). `;
    content += `Trust-building practices recommended.\n\n`;

    if (risk.multipleMarriageIndicators.length > 0) {
      content += `**Multiple Marriage Indicators**: ${risk.multipleMarriageIndicators.length} factors present. `;
      content += `This may indicate karmic lessons around commitment.`;
    }

    return content;
  }

  private generateExecutiveSummary(report: CompatibilityReport, partnerName: string): string {
    return report.executiveSummary.verdict;
  }

  // ============================================================================
  // RECOMMENDATION & CONFIDENCE
  // ============================================================================

  private determineRecommendation(
    score: number,
    risks: RiskFactor[],
    challenges: ChallengeArea[],
    report?: CompatibilityReport
  ): RecommendationLevel {
    // Check for CRITICAL factors that override score-based recommendations

    // CRITICAL 1: Nadi Dosha without cancellation (User Priority #1)
    const hasNadiDosha = report?.ashtakoot?.doshas?.nadiDosha;
    const hasNadiCancellation = report?.ashtakoot?.exceptions?.some(e =>
      e.toLowerCase().includes('nadi')
    );

    if (hasNadiDosha && !hasNadiCancellation) {
      // Nadi Dosha without cancellation is a dealbreaker per user requirements
      return 'not_recommended';
    }

    // CRITICAL 2: High Divorce Risk (RAW score - User Priority #2)
    // Calculate raw divorce score by adding back protective buffer
    const divorceRisk = report?.riskAssessment?.divorceProbability;
    const divorceProtectiveFactors = report?.riskAssessment?.protectiveFactors || [];
    const rawDivorceScore = divorceRisk ?
      Math.min(100, divorceRisk.score + Math.min(25, divorceProtectiveFactors.length * 8)) :
      0;

    if (rawDivorceScore > 50) {
      // High raw divorce risk overrides good scores
      return rawDivorceScore > 70 ? 'not_recommended' : 'caution_advised';
    }

    // CRITICAL 3: High Infidelity Risk (RAW score - User Priority #3)
    // Calculate raw infidelity score by adding back protective buffer
    const infidelityRisk = report?.riskAssessment?.infidelityRisk;
    const infidelityProtectiveFactors = report?.riskAssessment?.infidelityProtections || [];
    const rawInfidelityScore = infidelityRisk ?
      Math.min(100, infidelityRisk.score + Math.min(20, infidelityProtectiveFactors.length * 6)) :
      0;

    if (rawInfidelityScore > 60) {
      // High raw infidelity risk is concerning
      return rawInfidelityScore > 80 ? 'not_recommended' : 'caution_advised';
    }

    // Standard recommendation logic (adjusted for stricter requirements)
    const criticalRisks = risks.filter(r => r.level === 'high').length;
    const criticalChallenges = challenges.filter(c => c.severity === 'critical').length;

    // Stricter thresholds due to user priorities
    if (score >= 85 && criticalRisks === 0 && criticalChallenges === 0 && !hasNadiDosha) {
      return 'highly_recommended';
    } else if (score >= 70 && criticalRisks === 0 && criticalChallenges === 0) {
      return 'recommended';
    } else if (score >= 55 && criticalRisks <= 1 && !hasNadiDosha) {
      return 'conditional';
    } else if (score >= 40) {
      return 'caution_advised';
    } else {
      return 'not_recommended';
    }
  }

  private calculateConfidence(rankingFactors: RankingFactor[], report: CompatibilityReport): number {
    // Confidence based on data completeness
    let confidence = 70; // Base confidence

    // Increase for more factors analyzed
    confidence += Math.min(rankingFactors.length * 2, 20);

    // Increase for clear indicators (high or low scores, not middle)
    const clearIndicators = rankingFactors.filter(f => f.score >= 70 || f.score <= 40).length;
    confidence += Math.min(clearIndicators * 2, 10);

    return Math.min(confidence, 95);
  }

  // ============================================================================
  // SUMMARY GENERATION
  // ============================================================================

  private generateComparisonSummary(allMatches: AIMatchAnalysis[]): string {
    if (allMatches.length === 0) return 'No matches to compare.';
    if (allMatches.length === 1) return 'Only one match available for analysis.';

    const best = allMatches[0];
    const second = allMatches[1];
    const scoreDiff = best.overallScore - second.overallScore;

    let summary = `Analyzed ${allMatches.length} potential matches. `;
    summary += `${best.partnerName} emerged as the top choice with ${best.overallScore}% compatibility. `;

    if (scoreDiff >= 15) {
      summary += `This is a significantly stronger match than alternatives (by ${scoreDiff} points).`;
    } else if (scoreDiff >= 8) {
      summary += `This shows a clear advantage over other options (by ${scoreDiff} points).`;
    } else {
      summary += `The scores are close (only ${scoreDiff} points difference), so personal preference matters.`;
    }

    return summary;
  }

  private generateAIInsights(allMatches: AIMatchAnalysis[]): string[] {
    const insights: string[] = [];
    const best = allMatches[0];

    // Pattern insights
    const topCategories = Object.entries(best.categoryScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);

    insights.push(`This match excels in ${topCategories.map(c => c[0]).join(' and ')}, which are foundational for long-term success.`);

    // Risk insight
    const riskLevel = best.riskFactors.filter(r => r.level === 'high').length;
    if (riskLevel === 0) {
      insights.push('Low risk profile across all measured factors indicates relationship stability.');
    } else {
      insights.push(`${riskLevel} risk factors identified, but all have mitigation strategies available.`);
    }

    // Unique advantages
    if (best.uniqueAdvantages.length > 0) {
      insights.push(`Unique strength: ${best.uniqueAdvantages[0]}`);
    }

    // Comparison insight
    if (allMatches.length > 1) {
      const scoreDiff = best.overallScore - allMatches[1].overallScore;
      if (scoreDiff < 10) {
        insights.push('Multiple compatible matches found - consider personal preferences alongside astrological data.');
      }
    }

    return insights;
  }

  private generateSelectionRationale(bestMatch: AIMatchAnalysis, allMatches: AIMatchAnalysis[]): string {
    const factors = bestMatch.rankingFactors
      .filter(f => f.impact === 'high')
      .slice(0, 3);

    let rationale = `${bestMatch.partnerName} was selected as the best match based on:\n\n`;

    factors.forEach((factor, index) => {
      rationale += `${index + 1}. **${factor.name}** (${factor.score}%): ${factor.description}\n`;
    });

    rationale += `\nThis combination creates a ${bestMatch.compatibilitySignature.emotionalProfile} relationship `;
    rationale += `with ${bestMatch.compatibilitySignature.sexualSynergy.toLowerCase()}. `;
    rationale += `The overall compatibility score of ${bestMatch.overallScore}% `;
    rationale += `rates as "${bestMatch.recommendation.replace('_', ' ')}" with ${bestMatch.confidence}% confidence.`;

    return rationale;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private getSignIndex(sign: Sign): number {
    const signs: Sign[] = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return signs.indexOf(sign);
  }
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

/**
 * Main entry point: Analyze all partners and find best match
 */
export async function analyzeAllPartners(
  selfChart: Chart,
  partners: Array<{ id: string; name: string; chart: Chart }>
): Promise<AIMatchResult> {
  const engine = new AIMatchmakingEngine(selfChart, partners);
  return await engine.analyzeAllMatches();
}

/**
 * Quick analysis for dashboard widget
 */
export function generateQuickMatchInsight(
  selfChart: Chart,
  partnerChart: Chart,
  partnerName: string,
  partnerId: string
): Partial<AIMatchAnalysis> {
  const ashtakoot = calculateAshtakootMilan(selfChart, partnerChart);

  // Quick holistic score calculation
  let score = Math.round((ashtakoot.totalScore / 36) * 100);

  // Apply penalties - PRIORITY FACTORS (User Requirements)
  // CRITICAL: Nadi Dosha without cancellation (User Priority #1)
  if (ashtakoot.doshas.nadiDosha) {
    if (ashtakoot.exceptions.some(e => e.includes('Nadi'))) {
      // Even with cancellation, still a concern
      score -= 30;
    } else {
      // Without cancellation - SEVERE penalty (User priority: same Nadi should not be there)
      score -= 60;
    }
  }

  // Bhakoot Dosha
  if (ashtakoot.doshas.bhakootDosha) {
    if (ashtakoot.exceptions.some(e => e.includes('Bhakoot'))) {
      score -= 10;
    } else {
      score -= 20;
    }
  }

  // Manglik incompatibility
  if (ashtakoot.manglikAnalysis?.compatibility === 'Low') {
    score -= 15;
  }

  const strengths: string[] = [];
  const challenges: string[] = [];

  if (ashtakoot.parameters.bhakoot.pointsObtained >= 7) {
    strengths.push('Emotional Harmony');
  } else if (ashtakoot.doshas.bhakootDosha) {
    challenges.push('Different Mindsets');
  }

  if (ashtakoot.parameters.grahaMaitri.pointsObtained >= 4) {
    strengths.push('Mental Friendship');
  } else if (ashtakoot.parameters.grahaMaitri.pointsObtained <= 1) {
    challenges.push('Different Mindsets');
  }

  if (ashtakoot.doshas.nadiDosha) {
    if (ashtakoot.exceptions.some(e => e.includes('Nadi'))) {
      strengths.push('Nadi Dosha Cancelled');
    } else {
      challenges.push('Nadi Dosha');
    }
  }

  const moonA = selfChart.planetaryPositions.find(p => p.planet === 'Moon');
  const moonB = partnerChart.planetaryPositions.find(p => p.planet === 'Moon');

  let reason = '';
  if (challenges.includes('Nadi Dosha')) {
    reason = 'There is Nadi Dosha present which may affect health or progeny matters.';
  } else if (challenges.includes('Manglik Mismatch')) {
    reason = 'Mars energy mismatch requires detailed analysis.';
  } else if (strengths.includes('Emotional Harmony') && moonA && moonB) {
    reason = `Your Moon signs (${moonA.sign} & ${moonB.sign}) are in harmony, creating a deep emotional bond.`;
  } else {
    reason = 'Overall compatibility is being analyzed across multiple factors.';
  }

  // Determine verdict with priority consideration
  let verdict = 'Neutral';
  let recommendation: RecommendationLevel = 'conditional';

  // Check for Nadi Dosha without cancellation - CRITICAL
  const hasUncancelledNadiDosha = ashtakoot.doshas.nadiDosha &&
    !ashtakoot.exceptions.some(e => e.includes('Nadi'));

  if (hasUncancelledNadiDosha) {
    verdict = 'Not Recommended';
    recommendation = 'not_recommended';
  } else if (score >= 80) {
    verdict = 'Excellent';
    recommendation = 'highly_recommended';
  } else if (score >= 60) {
    verdict = 'Good';
    recommendation = 'recommended';
  } else if (score >= 40) {
    verdict = 'Average';
    recommendation = 'conditional';
  } else {
    verdict = 'Challenging';
    recommendation = 'caution_advised';
  }

  return {
    partnerId,
    partnerName,
    overallScore: Math.max(0, Math.min(100, score)),
    strengthAreas: strengths.map(s => ({
      category: 'General',
      title: s,
      description: s,
      evidence: [],
      astrologicalBasis: '',
      impactScore: 70
    })),
    challengeAreas: challenges.map(c => ({
      category: 'General',
      title: c,
      description: c,
      severity: 'moderate' as const,
      mitigationStrategies: [],
      astrologicalBasis: ''
    })),
    explanationData: {
      executiveSummary: reason,
      detailedAnalysis: [],
      keyHighlights: [],
      comparisonWithOthers: [],
      astrologicalEvidence: []
    },
    recommendation,
    confidence: 75
  };
}

/**
 * Generate detailed explanation for a specific match
 */
export function generateDetailedExplanation(analysis: AIMatchAnalysis): ExplanationData {
  return analysis.explanationData;
}

export default AIMatchmakingEngine;
