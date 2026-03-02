/**
 * Core TypeScript Types for Astro_Marriage Application
 * Phase 1.2: Type Definitions
 */

// ============================================================================
// ENUMERATIONS
// ============================================================================

export type Planet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu' | 'Uranus' | 'Neptune' | 'Pluto';

export type Sign = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type Nakshatra = 'Ashwini' | 'Bharani' | 'Krittika' | 'Rohini' | 'Mrigashirsha' | 'Ardra' | 'Punarvasu' | 'Pushya' | 'Ashlesha' | 'Magha' | 'Purva Phalguni' | 'Uttara Phalguni' | 'Hasta' | 'Chitra' | 'Swati' | 'Vishakha' | 'Anuradha' | 'Jyeshta' | 'Mula' | 'Purva Ashadha' | 'Uttara Ashadha' | 'Shravana' | 'Dhanishta' | 'Shatabhisha' | 'Purva Bhadrapada' | 'Uttara Bhadrapada' | 'Revati';

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';

export type Gana = 'Deva' | 'Manushya' | 'Rakshasa';

export type Nadi = 'Vata' | 'Pitta' | 'Kapha';

export type Gender = 'male' | 'female' | 'other';

export type PlanTier = 'free' | 'premium' | 'astrologer';

export type ReportStatus = 'saved' | 'archived';

// ============================================================================
// CORE ASTROLOGICAL TYPES
// ============================================================================

// ============================================================================
// CORE ASTROLOGICAL TYPES
// ============================================================================

export interface PlanetaryPosition {
  planet: Planet;
  longitude: number; // 0-360 degrees
  latitude: number;
  speed: number;
  house: number; // 1-12
  sign: Sign;
  signDegree: number; // 0-30 degrees within sign
  nakshatra: Nakshatra;
  nakshatraPada: number; // 1-4
  isRetrograde: boolean;
  isCombust: boolean;
  dignity: 'exalted' | 'moolatrikona' | 'own_house' | 'friendly' | 'neutral' | 'enemy' | 'debilitated';
}

export interface House {
  houseNumber: number;
  sign: Sign;
  cuspLongitude: number;
  planets: Planet[];
  lord: Planet;
}

export interface Yoga {
  name: string;
  description: string;
  planetsInvolved: Planet[];
  effects: string;
  strength: 'weak' | 'medium' | 'strong';
}

export interface Chart {
  id: string;
  name: string;
  gender: Gender;
  dateOfBirth: Date;
  timeOfBirth: string;
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
  ayanamsha: string;

  // Core chart data
  ascendant: Sign;
  ascendantDegree?: number; // Precise longitude of Ascendant (0-360)
  planetaryPositions: PlanetaryPosition[];
  houses: House[];

  // Divisional charts
  vargaCharts: {
    D1: ChartData; // Rashi
    D2?: ChartData; // Hora
    D3?: ChartData; // Drekkana
    D4?: ChartData; // Chaturthamsa
    D7?: ChartData; // Saptamsa
    D9: ChartData; // Navamsa
    D10?: ChartData; // Dasamsa
    D12?: ChartData; // Dwadasamsa
    D16?: ChartData; // Shodashamsa
    D20?: ChartData; // Vimsamsa
    D24?: ChartData; // Chaturvimshamsha
    D27?: ChartData; // Saptavimsamsa
    D30?: ChartData; // Trimsamsa
    D40?: ChartData; // Khavedamsa
    D45?: ChartData; // Akshavedamsa
    D60?: ChartData; // Shashtiamsa
    [key: string]: ChartData | undefined;
  };

  // Extended Features
  yogas: Yoga[];
  kp: {
    cusps: KPCusp[];
    significators: KPSignificator[];
  };

  // Dasha System
  dashas: DashaPeriod[];

  // Special points
  specialPoints: {
    atmakaraka: Planet;
    darakaraka: Planet;
    upapadaLagna: Sign;
    vivahSaham: number;
  };

  // Birth Star information
  nakshatra: string;
  nakshatraLord: Planet;
  pada: number;

  createdAt: Date;
  userId?: string;
}

export interface ChartData {
  ascendant: Sign;
  houses: House[];
  planetaryPositions: PlanetaryPosition[];
}

// ============================================================================
// DASHA SYSTEM TYPES
// ============================================================================

export interface DashaPeriod {
  planet: Planet;
  startDate: Date;
  endDate: Date;
  durationYears: number;
  isCurrent: boolean;
  subPeriods?: DashaPeriod[]; // Antardasha
}

export interface VimshottariDasha {
  moonNakshatra: Nakshatra;
  mahaDashas: DashaPeriod[];
}

export interface CharaDashaPeriod {
  sign: Sign;
  startDate: Date;
  endDate: Date;
  durationYears: number;
  isCurrent: boolean;
}

// ============================================================================
// KP ASTROLOGY TYPES
// ============================================================================

export interface KPSubLord {
  planet: Planet;
  startDegree: number;
  endDegree: number;
}

export interface KPCusp {
  cuspNumber: number;
  longitude: number;
  sign: Sign;
  signLord: Planet;
  starLord: Planet;
  subLord: Planet;
  subSubLord: Planet;
}

export interface KPSignificator {
  planet: Planet;
  occupiedHouse: number;
  starLord: Planet;
  housesOwnedByStarLord: number[];
  subLord: Planet;
  housesOwnedBySubLord: number[];
  significations: number[];
  strength: 'strong' | 'moderate' | 'weak';
}

export interface RulingPlanet {
  dayLord: Planet;
  moonSignLord: Planet;
  moonStarLord: Planet;
  lagnaSignLord: Planet;
  lagnaStarLord: Planet;
}

// ============================================================================
// VARGA STRENGTH TYPES
// ============================================================================

export interface VargaStrength {
  planet: Planet;
  vargaScores: {
    D1: number;
    D9: number;
    D7?: number;
    D60?: number;
    [key: string]: number | undefined;
  };
  weightedScore: number;
  strength: 'very_strong' | 'strong' | 'moderate' | 'weak';
}

// ============================================================================
// COMPATIBILITY TYPES
// ============================================================================

export interface AshtakootParameter {
  name: string;
  boyValue: string;
  girlValue: string;
  pointsObtained: number;
  maxPoints: number;
  interpretation: string;
}

export interface AshtakootResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  parameters: {
    varna: AshtakootParameter;
    vashya: AshtakootParameter;
    tara: AshtakootParameter;
    yoni: AshtakootParameter;
    grahaMaitri: AshtakootParameter;
    gana: AshtakootParameter;
    bhakoot: AshtakootParameter;
    nadi: AshtakootParameter;
  };
  exceptions: string[];
  doshas: {
    nadiDosha: boolean;
    bhakootDosha: boolean;
    ganaDosha: boolean;
  };
  manglikAnalysis?: {
    partnerA: {
      isManglik: boolean;
      score: number;
      isCancelled: boolean;
      cancellationReasons: string[];
    };
    partnerB: {
      isManglik: boolean;
      score: number;
      isCancelled: boolean;
      cancellationReasons: string[];
    };
    compatibility: string;
  };
}

export interface NavamsaMatching {
  score: number;
  mutualRespect: string;
  maritalHappiness: string;
  familyRelations: string;
  suitability: string;
}

export interface HouseOverlay {
  planet: Planet;
  house: number;
  description: string;
  direction: 'A_in_B' | 'B_in_A';
}

export interface PlanetaryConjunction {
  planetA: Planet;
  planetB: Planet;
  orb: number;
  description: string;
}

export interface SynastryAspect {
  planet1: Planet | string;
  planet2: Planet | string;
  aspectType: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
  orb: number;
  interpretation: string;
  nature: 'harmonious' | 'challenging' | 'neutral';
}

export interface KPCompatibility {
  cslConnection: {
    hasConnection: boolean;
    description: string;
  };
  rulingPlanetConnection: {
    score: number;
    description: string;
  };
  significatorHarmony: {
    score: number;
    description: string;
  };
}

export interface JaiminiCompatibility {
  darakarakaContact: {
    type: 'trine' | 'kendra' | 'mutual' | 'opposition' | 'none';
    description: string;
  };
  soulLink: {
    hasLink: boolean;
    description: string;
  };
}

export interface SynastryData {
  soulmateConnections: SynastryAspect[];
  karmicBonds: SynastryAspect[];
  sexualChemistry: SynastryAspect[];

  allAspects: SynastryAspect[];
  houseOverlays: HouseOverlay[];
  d9Overlays: HouseOverlay[];
  planetaryConjunctions: PlanetaryConjunction[];
  kpCompatibility?: KPCompatibility;
  jaiminiCompatibility?: JaiminiCompatibility;

}

export interface InLawAnalysis {
  secondHouseScore: number;
  tenthHouseScore: number;
  navamsaConfirmation: boolean;
  interpretation: string;
  recommendations: string[];
}

export interface SexualHealthAnalysis {
  maleHealth: {
    pmeRisk: 'Low' | 'Medium' | 'High';
    edRisk: 'Low' | 'Medium' | 'High';
    indicators: string[];
    recommendations: string[];
  };
  femaleHealth: {
    frigidityRisk: 'Low' | 'Medium' | 'High';
    physicalPainRisk: 'Low' | 'Medium' | 'High';
    indicators: string[];
    recommendations: string[];
  };
  mutualSatisfaction: {
    score: number;
    vibeMatch: string;
    elementCompatibility: string;
    description: string;
  };
  libidoA: {
    level: 'Low' | 'Medium' | 'High';
    description: string;
  };
  libidoB: {
    level: 'Low' | 'Medium' | 'High';
    description: string;
  };
  orientationA?: {
    pattern: string;
    indicators: string[];
    description: string;
  };
  orientationB?: {
    pattern: string;
    indicators: string[];
    description: string;
  };
}

export interface SexualCompatibility {
  yoniMatch: {
    yoniA: string;
    yoniB: string;
    score: number;
    nature: string;
    description: string;
  };
  nakshatraMatch: {
    nakshatraA: string;
    nakshatraB: string;
    score: number;
    description: string;
    psychologicalProfile: string;
  };
  sexualNature: {
    partnerA: {
      nature: string;
      preferences: string[];
      compatibility: string;
    };
    partnerB: {
      nature: string;
      preferences: string[];
      compatibility: string;
    };
  };
  overallScore: number;
  recommendations: string[];
  yoniDepth?: {
    drive: string;
    stamina: string;
    sessionDuration: string;
    bodyElement: string;
    characteristics: string[];
    anatomy: {
      opening?: string;
      passage?: string;
      base?: string;
      foreskin?: string;
      girth?: string;
      glans?: string;
    };
  };
  d9NavamsaInsights?: string;
  kpSublords?: string;
  yogas?: string;
}

export interface SpousePrediction {
  profileName: string;
  seventhHouse: {
    sign: Sign;
    lord: Planet;
    planets: Planet[];
    spouseNature: string;
    spouseAppearance: string;
    spouseTraits: string[];
    element?: 'Fire' | 'Earth' | 'Air' | 'Water';
    seventhLordDetails?: {
      d1: {
        sign: string;
        house: number;
        description: string;
        interpretation?: {
          description: string;
          impactScore: number;
          riskFactors: string[];
        };
      };
      d9: {
        sign: string;
        house: number;
        description: string;
        interpretation?: {
          description: string;
          impactScore: number;
          riskFactors: string[];
        };
      };
    };
  };
  darakaraka: {
    planet: Planet;
    sign: Sign;
    house: number;
    spouseCharacteristics: string;
  };
  navamsaSeventh: {
    sign: Sign;
    planets: Planet[];
    marriageQuality: string;
  };
  upapadaLagna: {
    sign: Sign;
    planets: Planet[];
    timing: string;
  };
  predictions: string[];
  physique?: {
    height: 'short' | 'average' | 'tall';
    build: 'slim' | 'average' | 'heavy' | 'athletic';
    complexion: string;
    eyeColor: string;
    hairType: string;
    notableFeatures: string[];
    appearance: string[];
    gait?: string;
    voice?: string;
    fashionStyle?: string;
    faceShape?: string;
    skinTexture?: string;
    breastInfo?: string;
  };
  profession?: {
    field: string;
    description: string;
    relatedPlanets: Planet[];
    careerNature: 'Business' | 'Service' | 'Self-Employed' | 'Government' | 'Creative';
  };
  advancedAnalysis?: {
    genderAnalysis: string;
    complexRules: {
      upapada: string;
      navamsa7th: string;
      darakarakaD9: string;
    };
  };
  meetingPrediction?: SpouseMeetingPrediction;
}

export interface SpouseMeetingPrediction {
  direction: {
    primary: string;
    secondary?: string;
    confidence: 'high' | 'medium' | 'low';
    sources: { system: string; direction: string; basis: string }[];
  };
  distance: {
    level: 'very_near' | 'near' | 'nearby' | 'hometown' | 'same_region' | 'moderate' | 'familiar' | 'unpredictable' | 'far' | 'career_linked' | 'social_network' | 'very_far';
    label: string;
    description: string;
    foreignIndicators: { name: string; strength: string; interpretation: string }[];
    confidence: 'high' | 'medium' | 'low';
  };
  meetingMedium: {
    primary: string;
    alternatives: string[];
    through: string;
    modernInterpretation: string;
  };
  circumstances: {
    setting: string;
    atmosphere: string;
    examples: string[];
    nakshatraFlavor?: string;
    nakshatraEnergy?: string;
  };
  marriageType: {
    type: 'love' | 'arranged' | 'mixed';
    confidence: 'high' | 'medium' | 'low';
    yogas: { name: string; present: boolean; description: string }[];
    description: string;
  };
  spouseAttraction?: {
    qualities: { trait: string; source: string; icon: string }[];
    physicalAttraction: string;
    emotionalAttraction: string;
    genderSpecific: string;
  };
}

export interface DivisionalChartAnalysis {
  d9: {
    ascendant: Sign;
    seventhLord: string;
    seventhHouse: {
      sign: Sign;
      planets: string[];
    };
    vargottamaPlanets: string[];
    pushkarNavamsa: string[];
    marriageIndications: string[];
  };
  d7: {
    childrenIndications: string[];
    fertility: string;
  };
  d60: {
    pastLifeKarma: string;
    marriageDestiny: string;
  };
  shodasavarga?: {
    chart: string;
    sign: Sign;
    interpretation: string;
  }[];
  overall: string;
  extended?: {
    partnerA: import('./extendedTypes').ExtendedDivisionalAnalysis;
    partnerB: import('./extendedTypes').ExtendedDivisionalAnalysis;
  };
}

export interface RiskAssessment {
  divorceProbability: {
    score: number; // 0-100 (Buffered)
    rawScore: number; // 0-100 (Unbuffered)
    level: 'low' | 'medium' | 'high' | 'very_high';
    indicators: { text: string; profileName: string }[];
    mitigation: string[];
    partnerA?: {
      score: number;
      rawScore: number;
      level: 'low' | 'medium' | 'high' | 'very_high';
      indicators: { text: string; profileName: string }[];
    };
    partnerB?: {
      score: number;
      rawScore: number;
      level: 'low' | 'medium' | 'high' | 'very_high';
      indicators: { text: string; profileName: string }[];
    };
  };
  infidelityRisk: {
    score: number; // Buffered
    rawScore: number; // Unbuffered
    level: 'low' | 'medium' | 'high';
    indicators: { text: string; profileName: string }[];
    warning: string[];
    partnerA?: {
      score: number;
      rawScore: number;
      level: 'low' | 'medium' | 'high';
      indicators: { text: string; profileName: string }[];
    };
    partnerB?: {
      score: number;
      rawScore: number;
      level: 'low' | 'medium' | 'high';
      indicators: { text: string; profileName: string }[];
    };
  };
  multipleMarriageIndicators: { text: string; profileName: string }[];
  manglikAnalysis?: {
    partnerA: {
      isManglik: boolean;
      score: number;
      isCancelled: boolean;
      cancellationReasons: string[];
    };
    partnerB: {
      isManglik: boolean;
      score: number;
      isCancelled: boolean;
      cancellationReasons: string[];
    };
    compatibility: string;
  };
  // Enhanced Risk_kn.md fields
  detectedYogas?: {
    name: string;
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
    profileName: string;
  }[];
  protectiveFactors?: {
    text: string;
    strength: 'strong' | 'moderate' | 'weak';
    profileName: string;
  }[];
  infidelityProtections?: {
    text: string;
    strength: 'strong' | 'moderate' | 'weak';
    profileName: string;
  }[];
  affairContextIndicators?: {
    context: 'workplace' | 'neighbor' | 'social_circle' | 'online' | 'family' | 'foreign_isolated' | 'travel' | 'spiritual' | 'financial' | 'family_taboo' | 'general';
    text: string;
    profileName: string;
    confidence?: 'high' | 'medium' | 'low';
  }[];
  navamsaConfirmations?: {
    text: string;
    confirmed: boolean;
    profileName: string;
  }[];
  spouseLongevity?: {
    score: number;
    level: 'vulnerable' | 'moderate' | 'stable';
    indicators: { text: string; profileName: string }[];
    description: string;
    partnerA?: {
      score: number;
      level: 'vulnerable' | 'moderate' | 'stable';
      indicators: { text: string; profileName: string }[];
      description: string;
    };
    partnerB?: {
      score: number;
      level: 'vulnerable' | 'moderate' | 'stable';
      indicators: { text: string; profileName: string }[];
      description: string;
    };
  };
}

export interface ModernPlanetAnalysis {
  uranus: {
    house: number;
    aspects: string[];
    interpretation: string;
    challenges: string[];
  };
  neptune: {
    house: number;
    aspects: string[];
    interpretation: string;
    challenges: string[];
  };
  pluto: {
    house: number;
    aspects: string[];
    interpretation: string;
    challenges: string[];
  };
}

export interface ModernChallenges {
  digitalAge: string[];
  careerStress: string[];
  mentalHealth: string[];
  communicationIssues: string[];
}

export interface TimingAnalysis {
  currentDasha?: DashaPeriod;
  favorablePeriods: {
    startDate: Date;
    endDate: Date;
    description: string;
    confidence: number;
  }[];
  vulnerablePeriods?: {
    startDate: Date;
    endDate: Date;
    description: string;
    riskLevel: 'moderate' | 'high';
    profileName: string;
  }[];
  partnerA: {
    name: string;
    currentDasha: string;
    favourability: 'positive' | 'neutral' | 'challenging';
    analysis: string;
  };
  partnerB: {
    name: string;
    currentDasha: string;
    favourability: 'positive' | 'neutral' | 'challenging';
    analysis: string;
  };
  timeline: {
    partnerA: { date: Date; status: 'harmonious' | 'caution' | 'high_awareness'; description: string }[];
    partnerB: { date: Date; status: 'harmonious' | 'caution' | 'high_awareness'; description: string }[];
  };
  transitNotes: string[];
  extended?: import('./extendedTypes').ExtendedTimingAnalysis;
}

export interface Remedies {
  lalKitab: {
    general: string[];
    specific: string[];
  };
  gemstones: {
    stone: string;
    metal: string;
    finger: string;
    mantra: string;
  }[];
  modernAdjustments: string[];
}

// ============================================================================
// MAIN COMPATIBILITY REPORT
// ============================================================================

/**
 * Psychological Profile
 */
export interface PsychologicalProfile {
  attachmentStyle: {
    type: 'secure' | 'anxious' | 'avoidant' | 'fearful';
    description: string;
    moonSign: Sign;
    fourthHouseAnalysis: string;
  };

  communicationStyle: {
    style: string;
    mercuryPlacement: string;
    expressionMethod: string;
    conflictResolution: string;
    triggers: string[];
  };

  loveLanguage: {
    primary: string;
    secondary: string;
    venusSign: Sign;
    description: string;
  };

  coreFears: {
    primaryFear: string;
    rahuInfluence: string;
    howItManifests: string;
  };

  defenseMechanisms: {
    mechanism: string;
    ketuInfluence: string;
    impactOnRelationships: string;
  };

  repeatingPatterns: {
    pattern: string;
    fifthHouseInfluence: string;
    venusCycles: string;
    howToBreakIt: string;
  };

  mentalLandscape: {
    coreFear: string;
    defenseMechanism: string;
    blindSpot: string;
    growthArea: string;
  };
}

// ============================================================================
// CONFLICT ZONE TYPES
// ============================================================================

export interface ConflictTrigger {
  title: string;
  intensity: 'High' | 'Medium' | 'Low';
  description: string;
  technicalBasis: string;
  source: 'partnerA' | 'partnerB' | 'mutual';
}

export interface ConflictZone {
  people: ConflictTrigger[];
  things: ConflictTrigger[];
  ideology: ConflictTrigger[];
  behavior: ConflictTrigger[];
  overallSeverity: 'High' | 'Medium' | 'Low';
  awarenessNote: string;
}

export interface VulnerabilityWindow {
  startDate: Date;
  endDate: Date;
  partnerAAge: number;
  partnerBAge: number;
  riskType: 'divorce' | 'infidelity' | 'both';
  riskLevel: 'moderate' | 'high' | 'critical';
  partnerSource?: 'partnerA' | 'partnerB';
  description: string;
  astrologicalTriggers: string[];
  isCrucial?: boolean;
  activePlanets?: Planet[];
  remedy?: string;
  subPeriods?: {
    startDate: Date;
    endDate: Date;
    planet: Planet;
    triggers: string[];
    isCritical?: boolean;
  }[];
  divisitionalNote?: string;
}

export interface VulnerabilityTimeline {
  partnerAName: string;
  partnerBName: string;
  windows: VulnerabilityWindow[];
  summaryConclusion?: {
    primeDivorceRisk?: {
      year: number;
      partnerAAge: number;
      partnerBAge: number;
      intensity: 'high' | 'critical';
    };
    primeInfidelityRisk?: {
      year: number;
      partnerAAge: number;
      partnerBAge: number;
      intensity: 'high' | 'critical';
    };
  };
}

export interface CompatibilityReport {
  id: string;
  userId: string;
  chartA: Chart;
  chartB: Chart;

  // Overall scoring
  overallScore: number; // 0-100
  overallVerdict: 'excellent' | 'very_good' | 'good' | 'fair' | 'challenging' | 'poor';

  // Detailed analysis
  ashtakoot: AshtakootResult;
  navamsaMatching: NavamsaMatching;
  synastry: SynastryData;
  inLawAnalysis: InLawAnalysis;
  partnerInLawAnalysis?: InLawAnalysis;
  sexualHealth: SexualHealthAnalysis;
  sexualCompatibility: SexualCompatibility;
  riskAssessment: RiskAssessment;
  modernPlanets: ModernPlanetAnalysis;
  modernChallenges: ModernChallenges;
  timing: TimingAnalysis;
  remedies: Remedies;
  spousePrediction: SpousePrediction;
  partnerSpousePrediction: SpousePrediction;
  divisionalAnalysis: DivisionalChartAnalysis;
  conflictZone: ConflictZone;

  // Extended analysis (new widgets)
  kpAnalysis?: {
    partnerA: import('./extendedTypes').KPAnalysis;
    partnerB: import('./extendedTypes').KPAnalysis;
  };
  charaKarakas?: {
    partnerA: import('./extendedTypes').CharaKarakas;
    partnerB: import('./extendedTypes').CharaKarakas;
  };
  charaDasha?: {
    partnerA: import('./extendedTypes').CharaDashaAnalysis;
    partnerB: import('./extendedTypes').CharaDashaAnalysis;
  };
  upapadaLagna?: {
    partnerA: import('./extendedTypes').UpapadaLagnaAnalysis;
    partnerB: import('./extendedTypes').UpapadaLagnaAnalysis;
  };
  vivahSaham?: {
    partnerA: import('./extendedTypes').VivahSahamAnalysis;
    partnerB: import('./extendedTypes').VivahSahamAnalysis;
  };
  poruthamAnalysis?: import('../../lib/poruthamCalculations').PoruthamAnalysis;
  extendedSexualCompatibility?: import('./extendedTypes').ExtendedSexualCompatibility;
  extendedRemedies?: {
    partnerA: import('./extendedTypes').ExtendedRemedies;
    partnerB: import('./extendedTypes').ExtendedRemedies;
  };
  advancedBreakdown?: import('./extendedTypes').AdvancedScoreBreakdown;
  yogaDoshaAnalysis?: {
    partnerA: import('../../lib/yogaDoshaCalculations').YogaDoshaAnalysis;
    partnerB: import('../../lib/yogaDoshaCalculations').YogaDoshaAnalysis;
  };
  addictionRiskAnalysis?: {
    partnerA: import('../../lib/addictionCalculations').AddictionRiskAnalysis;
    partnerB: import('../../lib/addictionCalculations').AddictionRiskAnalysis;
  };
  modernInsightsEnhanced?: import('../../lib/modernInsightsCalculations').ModernInsightsEnhanced;
  mentalHealthAnalysis?: {
    partnerA: import('../../lib/mentalHealthCalculations').MentalHealthAnalysis;
    partnerB: import('../../lib/mentalHealthCalculations').MentalHealthAnalysis;
  };
  psychologicalProfileA?: PsychologicalProfile;
  psychologicalProfileB?: PsychologicalProfile;
  relationshipPatternAnalysis?: {
    partnerA: import('../../lib/relationshipPatternCalculations').RelationshipPatternAnalysis;
    partnerB: import('../../lib/relationshipPatternCalculations').RelationshipPatternAnalysis;
  };
  vulnerabilityTimeline?: VulnerabilityTimeline;

  // Summary for quick view
  executiveSummary: {
    verdict: string;
    strengths: string[];
    challenges: string[];
    trafficLightStatus: 'green' | 'yellow' | 'red';
  };

  createdAt: Date;
  status: ReportStatus;
}

// ============================================================================
// DATABASE TYPES
// ============================================================================

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  planTier: PlanTier;
  createdAt: Date;
}

export interface SavedChart {
  id: string;
  userId: string;
  name: string;
  gender: Gender;
  dateOfBirth: Date;
  timeOfBirth: string;
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
  ayanamsha: string;
  createdAt: Date;
}

export interface SavedReport {
  id: string;
  userId: string;
  chartAId: string;
  chartBId: string;
  score: number;
  status: ReportStatus;
  summary: {
    verdict: string;
    keyPoints: string[];
  };
  fullReportData: CompatibilityReport;
  notes?: string;
  createdAt: Date;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface BirthDataInput {
  name: string;
  gender: Gender;
  dateOfBirth: Date | string; // Date object or YYYY-MM-DD string
  timeOfBirth: string; // HH:mm
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CompatibilityRequest {
  chartA: BirthDataInput;
  chartB: BirthDataInput;
}

export interface CompatibilityResponse {
  success: boolean;
  report?: CompatibilityReport;
  error?: string;
}

// ============================================================================
// UI TYPES
// ============================================================================

export interface WidgetData {
  id: string;
  type: string;
  title: string;
  data: unknown;
}

export interface DashboardState {
  currentChart: Chart | null;
  partnerChart: Chart | null;
  currentReport: CompatibilityReport | null;
  savedCharts: SavedChart[];
  savedReports: SavedReport[];
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// EXTENDED TYPES
// ============================================================================

export * from './extendedTypes';