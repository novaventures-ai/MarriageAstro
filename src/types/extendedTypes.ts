/**
 * Extended Types for Missing Features
 * Add these to types/index.ts
 */

import { Planet, Sign } from './index';

// ============================================================================
// KP ASTROLOGY ANALYSIS TYPES
// ============================================================================

export interface KPAnalysis {
  seventhCuspSubLord: {
    planet: Planet;
    significations: number[];
    marriagePromise: 'promised' | 'denied' | 'complicated';
    interpretation: string;
  };
  significators: KPSignificatorDetailed[];
  rulingPlanets: {
    dayLord: Planet;
    moonSignLord: Planet;
    moonStarLord: Planet;
    lagnaSignLord: Planet;
    lagnaStarLord: Planet;
  };
  fourFoldAnalysis: {
    level1: string[]; // Planet in Star of Occupant
    level2: string[]; // Occupant of House
    level3: string[]; // Planet in Star of Lord
    level4: string[]; // Lord of House
  };

  // KP Risk Analysis (P2 Enhancement)
  fifthCuspAffairFormula?: {
    isActive: boolean;
    fifthCuspSubLord: Planet;
    significations: number[];
    has5_8_12: boolean;
    interpretation: string;
    severity: 'low' | 'moderate' | 'high';
  };
  cuspalInterlinks?: {
    breakdownGrouping: {
      isActive: boolean;
      houses6_8_12: { house: number; subLord: Planet; significations: number[] }[];
      interpretation: string;
      severity: 'low' | 'moderate' | 'high';
    };
    subLordChain: {
      planet: Planet;
      connectionPath: string;
      houses: number[];
    }[];
  };
  workplaceAffairGrouping?: {
    isActive: boolean;
    houses2_6_10: { house: number; subLord: Planet; significations: number[] }[];
    connectedPlanets: Planet[];
    interpretation: string;
    severity: 'low' | 'moderate' | 'high';
  };
  protectionFormula?: {
    isActive: boolean;
    houses: number[];
    interpretation: string;
    strength: 'low' | 'moderate' | 'high';
  };
}

export interface KPSignificatorDetailed {
  planet: Planet;
  occupiedHouse: number;
  starLord: Planet;
  starLordHouses: number[];
  subLord: Planet;
  subLordHouses: number[];
  significations: number[];
  strength: 'strong' | 'moderate' | 'weak';
  level: 1 | 2 | 3 | 4;
}

// ============================================================================
// CHARA KARAKAS TYPES
// ============================================================================

export interface CharaKarakas {
  atmakaraka: CharaKarakaDetail; // AK - Self
  amatyakaraka: CharaKarakaDetail; // AmK - Advisor/Career
  bhratrukaraka: CharaKarakaDetail; // BK - Siblings
  matrukaraka: CharaKarakaDetail; // MK - Mother
  pitrukaraka: CharaKarakaDetail; // PK - Father
  putrakaraka: CharaKarakaDetail; // PiK - Children
  darakaraka: CharaKarakaDetail; // DK - Spouse
}

export interface CharaKarakaDetail {
  planet: Planet;
  degree: number;
  sign: Sign;
  house: number;
  interpretation: string;
  marriageSignificance?: string;
}

// ============================================================================
// CHARA DASHA TYPES
// ============================================================================

export interface CharaDashaAnalysis {
  currentPeriod: CharaDashaPeriod;
  upcomingPeriods: CharaDashaPeriod[];
  marriageTiming: {
    favorableSigns: Sign[];
    darakarakaSign: Sign;
    seventhFromDK: Sign;
    upapadaSign: Sign;
    interpretation: string;
  };
}

export interface CharaDashaPeriod {
  sign: Sign;
  startDate: Date;
  endDate: Date;
  durationYears: number;
  isCurrent: boolean;
  direction: 'direct' | 'reverse';
  lord: Planet;
}

// ============================================================================
// UPAPADA LAGNA TYPES
// ============================================================================

export interface UpapadaLagnaAnalysis {
  ul: UpapadaDetail;
  ul2?: UpapadaDetail; // Second marriage
  ul3?: UpapadaDetail; // Third marriage
  calculation: {
    twelfthHouse: number;
    twelfthLord: Planet;
    lordPlacement: number;
    housesCounted: number;
  };
  multipleMarriageIndication: boolean;
  interpretation: string;
}

export interface UpapadaDetail {
  sign: Sign;
  planets: Planet[];
  interpretation: string;
}

// ============================================================================
// VIVAH SAHAM TYPES
// ============================================================================

export interface VivahSahamAnalysis {
  longitude: number;
  sign: Sign;
  degree: number;
  house?: number;
  interpretation: string;
  activationPeriods: string[];
}

// ============================================================================
// EXTENDED SYNASTRY TYPES
// ============================================================================

export interface ExtendedSynastry {
  houseOverlays: HouseOverlay[];
  compositeIndicators: CompositeIndicator[];
}

export interface HouseOverlay {
  house: number;
  partnerPlanet: Planet;
  interpretation: string;
  strength: 'strong' | 'moderate' | 'weak';
}

export interface CompositeIndicator {
  planet: Planet;
  compositeLongitude: number;
  sign: Sign;
  interpretation: string;
}

// ============================================================================
// EXTENDED RISK ASSESSMENT TYPES
// ============================================================================

export interface ExtendedRiskAssessment {
  separativePlanets: SeparativePlanet[];
  riskMatrix: RiskMatrix;
  kpInfidelityFormula: {
    result: boolean;
    formula: string;
    indicators: string[];
  };
}

export interface SeparativePlanet {
  planet: Planet;
  house: number;
  effect: string;
  severity: 'low' | 'medium' | 'high';
}

export interface RiskMatrix {
  divorce: {
    score: number;
    probability: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
    description: string;
  };
  separation: {
    score: number;
    probability: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
    description: string;
  };
  infidelity: {
    score: number;
    probability: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
    description: string;
  };
}

// ============================================================================
// EXTENDED SPOUSE PREDICTION TYPES
// ============================================================================

export interface ExtendedSpousePrediction {
  typeOfMarriage: 'arranged' | 'love' | 'both' | 'unclear';
  familyBackground: {
    economicStatus: 'lower' | 'middle' | 'upper' | 'wealthy';
    culturalBackground: string;
    familyValues: string;
  };
  samskaarScale: {
    score: number; // 1-5
    rating: 'poor' | 'below_average' | 'average' | 'good' | 'excellent';
    description: string;
  };
  physique: {
    height: 'short' | 'average' | 'tall';
    build: string;
    complexion: string;
    eyeColor: string;
    hairType: string;
    notableFeatures: string[];
    appearance: string[];
    gait: string;
    voice: string;
    fashionStyle: string;
    faceShape: string;
    skinTexture: string;
    breastInfo?: string;
    lingamInfo?: string;
  };
  profession: {
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
  rti: {
    rashiTulyaNavamsa: Sign;
    navamsaTulyaRashi: Sign;
    interpretation: string;
  };
  seventhAmsaLord: {
    planet: Planet;
    interpretation: string;
  };
  compoundCharacteristics: string[];
}

// ============================================================================
// EXTENDED DIVISIONAL CHART TYPES
// ============================================================================

export interface ExtendedDivisionalAnalysis {
  vimshopakaScores: VimshopakaScore[];
  d60Deities: D60Deity[];
  navamsaHouseMeanings: NavamsaHouseMeaning[];
  vargaLinkage: VargaLinkage[];
  bhavottama: Bhavottama[];
  arudhaPadas?: {
    a7: { sign: Sign; meaning: string };
    ul: { sign: Sign; meaning: string };
    dynamicRange: string;
  };
  jaiminiD9Analysis?: {
    secondHouseSign: Sign;
    secondHousePlanets: Planet[];
    interpretation: string;
    familyRisk: 'low' | 'moderate' | 'high';
  };
  d7Full: D7FullAnalysis;
  d9Full: {
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
  shodashvarga: ShodashvargaItem[];
}

export interface ShodashvargaItem {
  varga: string;
  name: string;
  sign: Sign;
  lord: Planet;
  interpretation: string;
  strength: number;
  area: string;
}

export interface VimshopakaScore {
  planet: Planet;
  d1Score: number;
  d9Score: number;
  d7Score?: number;
  d60Score?: number;
  total: number;
  strength: 'very_strong' | 'strong' | 'moderate' | 'weak' | 'very_weak';
}

export interface D60Deity {
  planet: Planet;
  deity: string;
  nature: 'benefic' | 'malefic' | 'neutral';
  interpretation: string;
}

export interface NavamsaHouseMeaning {
  house: number;
  sign: Sign;
  meaning: string;
  planets: Planet[];
}

export interface VargaLinkage {
  planet: Planet;
  conjunctions: {
    varga: string;
    conjunctPlanet: Planet;
    effect: string;
  }[];
}

export interface Bhavottama {
  planet: Planet;
  house: number;
  varga: string;
  strength: 'excellent' | 'good' | 'moderate';
}

export interface D7FullAnalysis {
  ascendant: Sign;
  childrenIndications: string[];
  ancestralConnection: string;
  lineage: string;
  fertility: string;
}

// ============================================================================
// EXTENDED ASHTAKOOT TYPES
// ============================================================================

export interface ExtendedAshtakoot {
  ganaCancellationRules: GanaCancellationRule[];
  nakshatraBestMatches: NakshatraMatch[];
  nakshatraWorstMatches: NakshatraMatch[];
}

export interface GanaCancellationRule {
  rule: string;
  condition: string;
  effect: string;
}

export interface NakshatraMatch {
  nakshatra: string;
  partnerNakshatra: string;
  score: number;
  description: string;
}

// ============================================================================
// EXTENDED SEXUAL COMPATIBILITY TYPES
// ============================================================================

export interface ExtendedSexualCompatibility {
  allYoniAnimals: YoniAnimal[];
  yoniPhysicalCharacteristics: {
    partnerA: YoniPhysicalCharacteristics;
    partnerB: YoniPhysicalCharacteristics;
  };
  yoniDepth?: {
    partnerA: YoniDepthDetail;
    partnerB: YoniDepthDetail;
  };
  d9NavamsaInsights?: string;
  kpSublords?: string;
  yogas?: string;
}

export interface YoniDepthDetail {
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
    lingamType?: string; // New for male anatomy
  };
}

export interface YoniAnimal {
  animal: string;
  gender: 'male' | 'female';
  nakshatras: string[];
  nature: string;
  score: number;
  bestMatches: string[];
  worstMatches: string[];
}

export interface YoniPhysicalCharacteristics {
  height: string;
  bodyType: string;
  features: string[];
  sexualTemperament: string;
}

// ============================================================================
// EXTENDED REMEDIES TYPES
// ============================================================================

export interface ExtendedRemedies {
  planetSpecific: PlanetSpecificRemedy[];
  afflictionBased: AfflictionRemedy[];
  relationshipSpecific: RelationshipCondition[];
  issueSpecific?: {
    category: 'infidelity' | 'separation' | 'discord' | 'stability';
    remedies: string[];
    modernAdvice: string[];
  }[];
  psychologicalRemedies?: {
    trait: string;
    behavioralChange: string;
    mantra?: string;
  }[];
}

export interface PlanetSpecificRemedy {
  planet: Planet;
  affliction: string;
  remedies: string[];
  mantra: string;
}

export interface AfflictionRemedy {
  condition: string;
  planets: Planet[];
  remedies: string[];
}

export interface RelationshipCondition {
  condition: string;
  description: string;
  remedies: string[];
}

// ============================================================================
// EXTENDED TIMING TYPES
// ============================================================================

export interface ExtendedTimingAnalysis {
  charaDasha: CharaDashaAnalysis;
  upapadaLagna: UpapadaLagnaAnalysis;
  vivahSaham: VivahSahamAnalysis;
  transitAnalysis: TransitAnalysis;
  partnerB?: {
    charaDasha: CharaDashaAnalysis;
    upapadaLagna: UpapadaLagnaAnalysis;
    vivahSaham: VivahSahamAnalysis;
    transitAnalysis: TransitAnalysis;
  };
  destinySync?: DestinySyncItem[];
}

export interface DestinySyncItem {
  startDate: string;
  endDate: string;
  periodName: string;
  vimshottariConfidence: number;
  charaDashaActive: boolean;
  vivahSahamActive: boolean;
  isDestinyWindow: boolean;
  description: string;
}


export interface TransitAnalysis {
  jupiterTransits: TransitEvent[];
  saturnTransits: TransitEvent[];
  favorableWindows: TransitWindow[];
}

export interface TransitEvent {
  planet: Planet;
  fromSign: Sign;
  toSign: Sign;
  date: Date;
  effect: string;
}

export interface TransitWindow {
  startDate: Date;
  endDate: Date;
  planets: Planet[];
  description: string;
  confidence: number;
}
// ============================================================================
// ADVANCED SCORE BREAKDOWN TYPES
// ============================================================================

export interface SubScore {
  score: number;
  label: string;
  explanation: string;
  status: 'positive' | 'neutral' | 'challenging';
}

export interface AdvancedScoreBreakdown {
  tradition: SubScore;   // Ashtakoot/Porutham
  promise: SubScore;     // KP Analysis
  soul: SubScore;        // Jaimini/Divisional
  interaction: SubScore; // Synastry/Sexual
  stability: SubScore;   // Risks/In-laws
}
