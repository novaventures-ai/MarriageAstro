/**
 * Complete Compatibility Report Generator
 * Orchestrates all calculation modules to produce final report
 */

import { Chart, CompatibilityReport, BirthDataInput, Gender } from '@types';
import {
  Remedies,
  TimingAnalysis,
  PlanetaryPosition,
  Planet,
  Sign,
  House,
  ChartData,
  KPCusp,
  KPSignificator,
  InLawAnalysis,
  SynastryData,
  ExtendedTimingAnalysis,
  DestinySyncItem
} from '@types';
import {
  generateFullChartData,
  BirthData,
  PlanetPosition as AstroPlanetPosition,
  calculateKPCusps as calculateKPHouseCusps,
  ZODIAC_SIGNS,
  getSignLord
} from '@/lib/astro/calculations';
import { SwissEphemeris } from '@/lib/astro/sweph';
import {
  calculateKPCusps as mapKPLords,
  calculateSignificators
} from './kpCalculations';
import {
  calculateAshtakootMilan,
  calculateNavamsaMatching,
  calculateSexualCompatibility,
  predictSpouseCharacteristics,
  analyzeDivisionalCharts
} from './compatibilityCalculations';
import {
  analyzeSexualHealth
} from './sexualHealthCalculations';
import {
  calculatePorutham
} from './poruthamCalculations';
import {
  assessRisk,
  analyzeModernPlanets,
  analyzeModernChallenges
} from './riskCalculations';
import { analyzeYogaDoshas } from './yogaDoshaCalculations';
import { analyzeAddictionRisk } from './addictionCalculations';
import { analyzeModernInsightsEnhanced } from './modernInsightsCalculations';
import { analyzeMentalHealth } from './mentalHealthCalculations';
import { calculateRelationshipPatterns } from './relationshipPatternCalculations';
import { findVulnerablePeriods } from './dashaCalculations';
import {
  calculateHouseOverlays,
  calculatePlanetaryConjunctions,
  HouseOverlay,
  PlanetaryConjunction
} from '@lib/synastryCalculations';
import {
  calculateD9Synastry,
  calculateKPSynastry,
  calculateJaiminiSynastry
} from './advancedSynastry';
import {
  calculateKPAnalysis,
  calculateCharaKarakas,
  calculateCharaDasha,
  calculateUpapadaLagna,
  calculateVivahSaham,
  calculateExtendedSpousePrediction,
  calculateExtendedSexualCompatibility,
  calculateExtendedRemedies,
  calculateExtendedDivisionalAnalysis,
  calculateTransitAnalysis
} from './extendedCalculations';

// ============================================================================
// CHART GENERATION
// ============================================================================

// Helper to map Calc Planet Position to UI PlanetaryPosition
function mapPlanetPosition(p: AstroPlanetPosition): PlanetaryPosition {
  return {
    planet: p.planet as Planet,
    longitude: p.longitude,
    latitude: 0, // Not calculated in simplified model yet
    speed: p.speed,
    house: p.house,
    sign: p.sign as Sign,
    signDegree: p.degree + p.minute / 60,
    nakshatra: p.nakshatra as any,
    nakshatraPada: p.nakshatraPada,
    isRetrograde: p.isRetrograde,
    isCombust: false, // Placeholder
    dignity: p.dignity as any || 'neutral'
  };
}

// Helper to map Calc Houses to UI Houses
function mapHouses(data: { houses: any[], planets: any[] }): House[] {
  return data.houses.map(h => {
    const housePlanets = data.planets
      .filter(p => p.house === h.house)
      .map(p => p.planet as Planet);

    return {
      houseNumber: h.house,
      sign: h.sign as Sign,
      cuspLongitude: h.signIndex * 30 + h.degree,
      planets: housePlanets,
      lord: h.lord as Planet
    };
  });
}

// Helper to map Varga data
function mapVargaData(varga: any): ChartData {
  if (!varga) {
    return {
      ascendant: 'Aries',
      houses: [],
      planetaryPositions: []
    };
  }
  const mappedPlanets = varga.planets.map(mapPlanetPosition);

  // Generate Whole Sign houses based on Ascendant
  const ascSignIndex = varga.ascendant.signIndex;
  const houses: House[] = Array.from({ length: 12 }, (_, i) => {
    const houseNumber = i + 1;
    const signIndex = (ascSignIndex + i) % 12;
    const sign = ZODIAC_SIGNS[signIndex] as Sign;

    // Find planets in this house (varga house is already assigned in calculations.ts)
    const housePlanets = mappedPlanets
      .filter((p: PlanetaryPosition) => p.house === houseNumber)
      .map((p: PlanetaryPosition) => p.planet);

    return {
      houseNumber,
      sign,
      cuspLongitude: signIndex * 30, // Using start of sign for Whole Sign cusps
      planets: housePlanets,
      lord: getSignLord(signIndex) as Planet
    };
  });

  return {
    ascendant: varga.ascendant.sign as Sign,
    houses: houses,
    planetaryPositions: mappedPlanets
  };
}

// Helper to map Dasha periods
function mapDashaPeriod(d: any, currentDashaPlanets: string[] = []): any {
  return {
    planet: d.planet as Planet,
    startDate: d.startDate,
    endDate: d.endDate,
    durationYears: d.years,
    isCurrent: currentDashaPlanets.includes(d.planet),
    subPeriods: d.subPeriods?.map((s: any) => mapDashaPeriod(s, currentDashaPlanets))
  };
}

export async function generateChartFromBirthData(birthData: BirthDataInput): Promise<Chart> {
  // 1. Prepare input for calculation engine
  // Convert Date to string format YYYY-MM-DD
  const dateStr = (birthData.dateOfBirth as any) instanceof Date
    ? (birthData.dateOfBirth as any).toISOString().split('T')[0]
    : String(birthData.dateOfBirth).split('T')[0];

  const calcInput: BirthData = {
    date: dateStr,
    time: birthData.timeOfBirth,
    latitude: birthData.latitude,
    longitude: birthData.longitude,
    timezone: Number(birthData.timezone) || 5.5,
    ayanamsa: 'lahiri'
  };

  // 2. Run High-Precision Calculations (Vedic)
  console.log('Generating chart with high-precision engine...');
  const fullChartData = await generateFullChartData(calcInput);
  const d1 = fullChartData.d1;

  // 2.1 Calculate Chara Karakas from planetary degrees
  // Jaimini system: sort by degree WITHIN sign (0-30°), NOT absolute longitude
  // Standard 7-karaka system: Exclude Rahu & Ketu (matching traditional tradition)
  // Atmakaraka = planet with highest degree within sign, Darakaraka = lowest of top 7
  const karakaPlanets = d1.planets
    .filter((p: any) => ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.planet))
    .map((p: any) => ({ ...p, signDegree: p.degree + p.minute / 60 + (p.second || 0) / 3600 }))
    .sort((a: any, b: any) => b.signDegree - a.signDegree);

  const atmakaraka = karakaPlanets[0]?.planet as Planet || 'Sun';
  const darakaraka = karakaPlanets[6]?.planet as Planet || 'Saturn';

  // 2.2 Calculate Upapada Lagna (12th from Ascendant + degrees to its lord)
  const ascendantSignIndex = d1.ascendant.signIndex;
  const twelfthSignIndex = (ascendantSignIndex + 11) % 12;
  const twelfthLordIndex = [4, 3, 2, 1, 0, 2, 3, 4, 5, 6, 6, 5][twelfthSignIndex]; // Lord of each sign
  const upapadaSignIndex = (twelfthSignIndex + Math.floor(twelfthLordIndex / 30)) % 12;
  const upapadaLagna = ZODIAC_SIGNS[upapadaSignIndex] as Sign;

  // 2.3 Calculate Vivah Saham (Marriage Point)
  // Formula: If Ascendant lord is in 1-6 houses: Lagna - Venus + 7th lord
  //          If Ascendant lord is in 7-12 houses: Lagna - 7th lord + Venus

  const seventhSignIndex = (ascendantSignIndex + 6) % 12;
  const seventhLordIndex = [4, 3, 2, 1, 0, 2, 3, 4, 5, 6, 6, 5][seventhSignIndex];
  const venusIndex = 3; // Venus is always index 3

  let vivahSaham: number;
  if (ascendantSignIndex <= 5) {
    vivahSaham = (ascendantSignIndex - venusIndex + seventhLordIndex + 12) % 12;
  } else {
    vivahSaham = (ascendantSignIndex - seventhLordIndex + venusIndex + 12) % 12;
  }

  // 3. Map to UI types (Vedic)
  const planetaryPositions = d1.planets.map(mapPlanetPosition);
  const houses = mapHouses(d1);

  // Map all Vargas
  const vargaCharts: any = {
    D1: {
      ascendant: d1.ascendant.sign as Sign,
      houses: houses,
      planetaryPositions: planetaryPositions
    }
  };

  // Map standard vargas
  if (fullChartData.d2) vargaCharts.D2 = mapVargaData(fullChartData.d2);
  if (fullChartData.d3) vargaCharts.D3 = mapVargaData(fullChartData.d3);
  if (fullChartData.d4) vargaCharts.D4 = mapVargaData(fullChartData.d4);
  if (fullChartData.d5) vargaCharts.D5 = mapVargaData(fullChartData.d5);
  if (fullChartData.d7) vargaCharts.D7 = mapVargaData(fullChartData.d7);
  if (fullChartData.d8) vargaCharts.D8 = mapVargaData(fullChartData.d8);
  if (fullChartData.d9) vargaCharts.D9 = mapVargaData(fullChartData.d9);
  if (fullChartData.d10) vargaCharts.D10 = mapVargaData(fullChartData.d10);
  if (fullChartData.d12) vargaCharts.D12 = mapVargaData(fullChartData.d12);
  if (fullChartData.d16) vargaCharts.D16 = mapVargaData(fullChartData.d16);
  if (fullChartData.d20) vargaCharts.D20 = mapVargaData(fullChartData.d20);
  if (fullChartData.d24) vargaCharts.D24 = mapVargaData(fullChartData.d24);
  if (fullChartData.d27) vargaCharts.D27 = mapVargaData(fullChartData.d27);
  if (fullChartData.d30) vargaCharts.D30 = mapVargaData(fullChartData.d30);
  if (fullChartData.d40) vargaCharts.D40 = mapVargaData(fullChartData.d40);
  if (fullChartData.d45) vargaCharts.D45 = mapVargaData(fullChartData.d45);
  if (fullChartData.d60) vargaCharts.D60 = mapVargaData(fullChartData.d60);

  // 4. KP System Calculations
  let kpData: { cusps: KPCusp[]; significators: KPSignificator[] } = { cusps: [], significators: [] };
  try {
    console.log('Starting KP calculation...');
    const birthDate = new Date(`${dateStr}T${birthData.timeOfBirth}`);
    console.log('Birth date:', birthDate);

    const jd = await SwissEphemeris.getJulianDay(birthDate);
    console.log('Julian day:', jd);

    // 4.1 Get House Cusps in Placidus
    console.log('Calling calculateKPHouseCusps with lat/lon:', birthData.latitude, birthData.longitude);
    const houseCuspsRaw = await calculateKPHouseCusps(jd, birthData.latitude, birthData.longitude);
    console.log('House cusps raw:', houseCuspsRaw);

    const houseCuspsLongitudes = houseCuspsRaw.map((h: any) => (h.signIndex * 30) + h.degree + h.minute / 60 + h.second / 3600);
    console.log('House cusps longitudes:', houseCuspsLongitudes);

    // 4.2 Map lords and significators
    const kpCusps = mapKPLords(houseCuspsLongitudes, planetaryPositions);
    console.log('KP Cusps:', kpCusps);

    const kpSignificators = (planetaryPositions.slice(0, 9) as any[]).map(p =>
      calculateSignificators(p.planet, planetaryPositions, houseCuspsLongitudes)
    );
    console.log('KP Significators:', kpSignificators);

    kpData = {
      cusps: kpCusps,
      significators: kpSignificators
    };
    console.log('KP Data successfully generated:', kpData);
  } catch (e) {
    console.error("KP Calculation failed with error:", e);
    console.error("Error stack:", e instanceof Error ? e.stack : 'No stack');
  }

  // 5. Construct Final Chart Object
  return {
    id: `${Date.now()} -${Math.random().toString(36).substr(2, 9)} `,
    name: birthData.name,
    gender: birthData.gender,
    dateOfBirth: new Date(`${dateStr}T${birthData.timeOfBirth}`),
    timeOfBirth: birthData.timeOfBirth,
    location: birthData.location,
    latitude: birthData.latitude,
    longitude: birthData.longitude,
    timezone: birthData.timezone.toString(),
    ayanamsha: `Lahiri(${d1.ayanamsaValue.toFixed(4)}°)`,

    ascendant: d1.ascendant.sign as Sign,
    ascendantDegree: (d1.ascendant.signIndex * 30) + d1.ascendant.degree + (d1.ascendant.minute / 60) + (d1.ascendant.second / 3600),
    planetaryPositions: planetaryPositions,
    houses: houses,

    vargaCharts: vargaCharts,

    yogas: fullChartData.yogas?.map((y: any) => ({
      name: y.name,
      description: y.description,
      planetsInvolved: [], // simple string parsing or update logic if needed
      effects: y.effects,
      strength: y.strength
    })) || [],

    kp: kpData,
    dashas: fullChartData.dashas?.map(d => mapDashaPeriod(d, [
      fullChartData.currentDasha.mahadasha,
      fullChartData.currentDasha.antardasha,
      fullChartData.currentDasha.pratyantardasha
    ])) || [],

    specialPoints: {
      atmakaraka: atmakaraka,
      darakaraka: darakaraka,
      upapadaLagna: upapadaLagna,
      vivahSaham: vivahSaham
    },

    // Moon nakshatra information for compatibility analysis
    nakshatra: planetaryPositions.find(p => p.planet === 'Moon')?.nakshatra || 'Ashwini',
    nakshatraLord: 'Ketu', // Calculated from nakshatra
    pada: planetaryPositions.find(p => p.planet === 'Moon')?.nakshatraPada || 1,

    createdAt: new Date()
  };
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

export async function generateCompatibilityReport(
  chartA: Chart,
  chartB: Chart,
  userId: string = 'anonymous'
): Promise<CompatibilityReport> {
  // Calculate Ashtakoot Milan
  const ashtakoot = calculateAshtakootMilan(chartA, chartB);

  // Calculate Navamsa Matching
  const navamsaMatching = calculateNavamsaMatching(chartA, chartB);

  // Calculate Sexual Compatibility
  const sexualCompatibility = calculateSexualCompatibility(chartA, chartB);

  // Calculate Porutham (South Indian Matching)
  const poruthamAnalysis = calculatePorutham(chartA, chartB);

  // Predict Spouse Characteristics (for both to show perspective)
  const basicSpousePredictionA = predictSpouseCharacteristics(chartA);
  const extendedSpousePredictionA = calculateExtendedSpousePrediction(chartA);
  const spousePredictionA = {
    ...basicSpousePredictionA,
    ...extendedSpousePredictionA,
    physique: {
      ...basicSpousePredictionA.physique,
      ...(extendedSpousePredictionA as any).physique
    },
    predictions: [...new Set([...basicSpousePredictionA.predictions, ...(extendedSpousePredictionA as any).predictions || []])]
  } as any;

  const basicSpousePredictionB = predictSpouseCharacteristics(chartB);
  const extendedSpousePredictionB = calculateExtendedSpousePrediction(chartB);
  const spousePredictionB = {
    ...basicSpousePredictionB,
    ...extendedSpousePredictionB,
    physique: {
      ...basicSpousePredictionB.physique,
      ...(extendedSpousePredictionB as any).physique
    },
    predictions: [...new Set([...basicSpousePredictionB.predictions, ...(extendedSpousePredictionB as any).predictions || []])]
  } as any;

  // Analyze Divisional Charts
  const basicDivisionalAnalysis = analyzeDivisionalCharts(chartA, chartB);
  const extendedDivisionalA = calculateExtendedDivisionalAnalysis(chartA);
  const extendedDivisionalB = calculateExtendedDivisionalAnalysis(chartB);

  const divisionalAnalysis = {
    ...basicDivisionalAnalysis,
    extended: {
      partnerA: extendedDivisionalA,
      partnerB: extendedDivisionalB
    }
  };

  // Calculate Synastry (Pass D60 info)
  const synastryData = calculateSynastry(chartA, chartB, divisionalAnalysis.d60);

  // Analyze In-Laws
  const inLawAnalysis = analyzeInLaws(chartA, chartB);
  const partnerInLawAnalysis = analyzeInLaws(chartB, chartA);

  // Analyze Sexual Health
  const sexualHealth = analyzeSexualHealth(
    chartA,
    chartB,
    chartA.gender === 'male' ? 'male' : 'female',
    chartB.gender === 'male' ? 'male' : 'female'
  );

  // Assess Risk
  const riskAssessment = assessRisk(chartA, chartB);
  riskAssessment.manglikAnalysis = ashtakoot.manglikAnalysis;

  // Analyze Modern Planets
  const modernPlanetsA = analyzeModernPlanets(chartA);
  const modernPlanetsB = analyzeModernPlanets(chartB);
  // Helper to combine interpretations without semicolons
  const combineInterpretations = (interpA: string, interpB: string): string => {
    const cleanA = interpA?.trim() || '';
    const cleanB = interpB?.trim() || '';
    if (cleanA && cleanB) {
      return `${cleanA} ${cleanB}`;
    }
    return cleanA || cleanB || 'This planetary influence affects your relationship in subtle ways.';
  };

  const modernPlanets = {
    uranus: {
      house: Math.round((modernPlanetsA.uranus.house + modernPlanetsB.uranus.house) / 2),
      aspects: [...new Set([...modernPlanetsA.uranus.aspects, ...modernPlanetsB.uranus.aspects])],
      interpretation: combineInterpretations(modernPlanetsA.uranus.interpretation, modernPlanetsB.uranus.interpretation),
      challenges: [...new Set([...modernPlanetsA.uranus.challenges, ...modernPlanetsB.uranus.challenges])]
    },
    neptune: {
      house: Math.round((modernPlanetsA.neptune.house + modernPlanetsB.neptune.house) / 2),
      aspects: [...new Set([...modernPlanetsA.neptune.aspects, ...modernPlanetsB.neptune.aspects])],
      interpretation: combineInterpretations(modernPlanetsA.neptune.interpretation, modernPlanetsB.neptune.interpretation),
      challenges: [...new Set([...modernPlanetsA.neptune.challenges, ...modernPlanetsB.neptune.challenges])]
    },
    pluto: {
      house: Math.round((modernPlanetsA.pluto.house + modernPlanetsB.pluto.house) / 2),
      aspects: [...new Set([...modernPlanetsA.pluto.aspects, ...modernPlanetsB.pluto.aspects])],
      interpretation: combineInterpretations(modernPlanetsA.pluto.interpretation, modernPlanetsB.pluto.interpretation),
      challenges: [...new Set([...modernPlanetsA.pluto.challenges, ...modernPlanetsB.pluto.challenges])]
    }
  };

  // Analyze Modern Challenges
  const challengesA = analyzeModernChallenges(chartA);
  const challengesB = analyzeModernChallenges(chartB);
  const modernChallenges = {
    digitalAge: [...new Set([...challengesA.digitalAge, ...challengesB.digitalAge])],
    careerStress: [...new Set([...challengesA.careerStress, ...challengesB.careerStress])],
    mentalHealth: [...new Set([...challengesA.mentalHealth, ...challengesB.mentalHealth])],
    communicationIssues: [...new Set([...challengesA.communicationIssues, ...challengesB.communicationIssues])]
  };

  // Calculate Timing
  const timing = calculateTiming(chartA, chartB);

  // Extended Calculations (new widgets)
  let kpAnalysisA: any = { seventhCuspSubLord: { planet: 'Sun', significations: [], marriagePromise: 'complicated', interpretation: 'Not available' }, significators: [], rulingPlanets: { dayLord: 'Sun', moonSignLord: 'Sun', moonStarLord: 'Sun', lagnaSignLord: 'Sun', lagnaStarLord: 'Sun' }, fourFoldAnalysis: { level1: [], level2: [], level3: [], level4: [] } };
  let kpAnalysisB: any = { ...kpAnalysisA };

  let charaKarakasA: any = {};
  let charaKarakasB: any = {};

  let charaDashaA: any = { currentPeriod: { sign: 'Aries', startDate: new Date(), endDate: new Date(), durationYears: 0, isCurrent: true, direction: 'direct', lord: 'Sun' }, upcomingPeriods: [], marriageTiming: { favorableSigns: [], darakarakaSign: 'Aries', seventhFromDK: 'Libra', upapadaSign: 'Aries', interpretation: 'Not available' } };
  let charaDashaB: any = { ...charaDashaA };

  let upapadaLagnaA: any = { ul: { sign: 'Aries', planets: [], interpretation: 'Not available' }, calculation: { twelfthHouse: 12, twelfthLord: 'Sun', lordPlacement: 1, housesCounted: 1 }, multipleMarriageIndication: false, interpretation: 'Not available' };
  let upapadaLagnaB: any = { ...upapadaLagnaA };

  let vivahSahamA: any = { longitude: 0, sign: 'Aries', degree: 0, interpretation: 'Not available', activationPeriods: [] };
  let vivahSahamB: any = { ...vivahSahamA };

  let extendedSexualCompatibility: any = { allYoniAnimals: [], yoniPhysicalCharacteristics: { partnerA: { height: 'average', bodyType: 'average', features: [], sexualTemperament: 'average' }, partnerB: { height: 'average', bodyType: 'average', features: [], sexualTemperament: 'average' } } };
  let extendedRemediesA: any = { planetSpecific: [], afflictionBased: [], relationshipSpecific: [] };
  let extendedRemediesB: any = { planetSpecific: [], afflictionBased: [], relationshipSpecific: [] };

  try { kpAnalysisA = calculateKPAnalysis(chartA); } catch (e) { console.error('KP A failed', e); }
  try { kpAnalysisB = calculateKPAnalysis(chartB); } catch (e) { console.error('KP B failed', e); }

  try { charaKarakasA = calculateCharaKarakas(chartA); } catch (e) { console.error('Chara Karakas A failed', e); }
  try { charaKarakasB = calculateCharaKarakas(chartB); } catch (e) { console.error('Chara Karakas B failed', e); }

  try { charaDashaA = calculateCharaDasha(chartA); } catch (e) { console.error('Chara Dasha A failed', e); }
  try { charaDashaB = calculateCharaDasha(chartB); } catch (e) { console.error('Chara Dasha B failed', e); }

  try { upapadaLagnaA = calculateUpapadaLagna(chartA); } catch (e) { console.error('UL A failed', e); }
  try { upapadaLagnaB = calculateUpapadaLagna(chartB); } catch (e) { console.error('UL B failed', e); }

  try { vivahSahamA = calculateVivahSaham(chartA); } catch (e) { console.error('Vivah Saham A failed', e); }
  try { vivahSahamB = calculateVivahSaham(chartB); } catch (e) { console.error('Vivah Saham B failed', e); }

  // Advanced Astrological Features (New)
  try { extendedSexualCompatibility = calculateExtendedSexualCompatibility(chartA, chartB); } catch (e) { console.error('Ext Sexual Compat failed', e); }
  try { extendedRemediesA = calculateExtendedRemedies(chartA); } catch (e) { console.error('Ext Remedies A failed', e); }
  try { extendedRemediesB = calculateExtendedRemedies(chartB); } catch (e) { console.error('Ext Remedies B failed', e); }

  // Yoga & Dosha Analysis
  let yogaDoshaA = analyzeYogaDoshas(chartA);
  let yogaDoshaB = analyzeYogaDoshas(chartB);
  try { yogaDoshaA = analyzeYogaDoshas(chartA); } catch (e) { console.error('YogaDosha A failed', e); }
  try { yogaDoshaB = analyzeYogaDoshas(chartB); } catch (e) { console.error('YogaDosha B failed', e); }

  // Calculate Transit Analysis
  let transitAnalysisA: any = { jupiterTransits: [], saturnTransits: [], favorableWindows: [] };
  let transitAnalysisB: any = { jupiterTransits: [], saturnTransits: [], favorableWindows: [] };
  try { transitAnalysisA = calculateTransitAnalysis(chartA); } catch (e) { console.error('Transit A failed', e); }
  try { transitAnalysisB = calculateTransitAnalysis(chartB); } catch (e) { console.error('Transit B failed', e); }

  // Calculate Joint Destiny Sync
  const jointDestinySync = calculateJointDestinySync(timing.favorablePeriods, charaDashaA, charaDashaB, vivahSahamA, vivahSahamB);

  // Extend Timing Analysis
  timing.extended = {
    charaDasha: charaDashaA,
    upapadaLagna: upapadaLagnaA,
    vivahSaham: vivahSahamA,
    transitAnalysis: transitAnalysisA,
    partnerB: {
      charaDasha: charaDashaB,
      upapadaLagna: upapadaLagnaB,
      vivahSaham: vivahSahamB,
      transitAnalysis: transitAnalysisB
    },
    destinySync: jointDestinySync
  };


  // Generate Remedies (Classic)
  const remedies = generateRemedies(chartA, chartB, ashtakoot.doshas);

  // Calculate Advanced Score Breakdown
  const mentalHealthA = analyzeMentalHealth(chartA);
  const mentalHealthB = analyzeMentalHealth(chartB);
  const addictionRiskA = analyzeAddictionRisk(chartA);
  const addictionRiskB = analyzeAddictionRisk(chartB);

  const advancedBreakdown = calculateAdvancedBreakdown({
    ashtakoot,
    kpAnalysis: { partnerA: kpAnalysisA, partnerB: kpAnalysisB },
    charaKarakas: { partnerA: charaKarakasA, partnerB: charaKarakasB },
    synastry: synastryData,
    riskAssessment,
    mentalHealth: { partnerA: mentalHealthA, partnerB: mentalHealthB },
    addictionRisk: { partnerA: addictionRiskA, partnerB: addictionRiskB },
    inLaws: { partnerA: inLawAnalysis, partnerB: partnerInLawAnalysis },
    modernChallenges,
    sexualHealth,
    yogaDosha: { partnerA: yogaDoshaA, partnerB: yogaDoshaB },
    poruthamAnalysis
  });

  // Calculate Overall Score (Weighted modular synthesis)
  const overallScore = calculateOverallScore({
    stability: advancedBreakdown.stability.score,
    interaction: advancedBreakdown.interaction.score,
    soul: advancedBreakdown.soul.score,
    tradition: advancedBreakdown.tradition.score,
    promise: advancedBreakdown.promise.score
  }, {
    ashtakootScore: ashtakoot.totalScore,
    riskAssessment: riskAssessment,
    kpAnalysis: { partnerA: kpAnalysisA, partnerB: kpAnalysisB },
    mentalHealth: { partnerA: mentalHealthA, partnerB: mentalHealthB },
    addictionRisk: { partnerA: addictionRiskA, partnerB: addictionRiskB }
  });

  // Determine Verdict
  const overallVerdict = determineVerdict(overallScore, ashtakoot.totalScore, riskAssessment);

  // Generate Executive Summary
  const executiveSummary = generateExecutiveSummary(
    overallScore,
    ashtakoot,
    riskAssessment,
    sexualHealth,
    { kpAnalysis: { partnerA: kpAnalysisA, partnerB: kpAnalysisB }, synastry: synastryData }
  );

  return {
    id: `report - ${Date.now()} `,
    userId,
    chartA,
    chartB,
    overallScore,
    overallVerdict,
    ashtakoot,
    navamsaMatching,
    sexualCompatibility,
    spousePrediction: spousePredictionA,
    partnerSpousePrediction: spousePredictionB,
    divisionalAnalysis,
    riskAssessment,
    modernPlanets,
    modernChallenges,
    timing,
    synastry: synastryData,
    inLawAnalysis,
    partnerInLawAnalysis,
    sexualHealth,
    remedies,
    executiveSummary,
    // Extended analysis data
    kpAnalysis: {
      partnerA: kpAnalysisA,
      partnerB: kpAnalysisB
    },
    charaKarakas: {
      partnerA: charaKarakasA,
      partnerB: charaKarakasB
    },
    charaDasha: {
      partnerA: charaDashaA,
      partnerB: charaDashaB
    },
    upapadaLagna: {
      partnerA: upapadaLagnaA,
      partnerB: upapadaLagnaB
    },
    vivahSaham: {
      partnerA: vivahSahamA,
      partnerB: vivahSahamB
    },
    extendedSexualCompatibility,
    extendedRemedies: {
      partnerA: extendedRemediesA,
      partnerB: extendedRemediesB
    },
    advancedBreakdown,
    poruthamAnalysis,
    yogaDoshaAnalysis: {
      partnerA: yogaDoshaA,
      partnerB: yogaDoshaB
    },
    addictionRiskAnalysis: {
      partnerA: analyzeAddictionRisk(chartA),
      partnerB: analyzeAddictionRisk(chartB)
    },
    modernInsightsEnhanced: analyzeModernInsightsEnhanced(chartA, chartB, chartA.name, chartB.name),
    mentalHealthAnalysis: {
      partnerA: analyzeMentalHealth(chartA),
      partnerB: analyzeMentalHealth(chartB)
    },
    relationshipPatternAnalysis: {
      partnerA: calculateRelationshipPatterns(chartA, chartA.name),
      partnerB: calculateRelationshipPatterns(chartB, chartB.name)
    },
    createdAt: new Date(),
    status: 'saved'
  };
}

// ============================================================================
// SYNASTRY CALCULATION
// ============================================================================

function calculateSynastry(chartA: Chart, chartB: Chart, d60Info?: any): SynastryData {
  const soulmateConnections: any[] = [];
  const karmicBonds: any[] = [];
  const sexualChemistry: any[] = [];

  // Helper to check aspects between two planets in two charts
  const checkAspect = (p1: Planet, p2: Planet, chart1: Chart, chart2: Chart) => {
    const pos1 = chart1.planetaryPositions.find(p => p.planet === p1);
    const pos2 = chart2.planetaryPositions.find(p => p.planet === p2);
    if (!pos1 || !pos2) return null;

    const diff = Math.abs(pos1.longitude - pos2.longitude);
    const orb = Math.min(diff % 360, 360 - (diff % 360));

    // Conjunction (0-8)
    if (orb < 8) return { type: 'conjunction', orb };
    // Trine (120 +/- 8)
    if (Math.abs(orb - 120) < 8) return { type: 'trine', orb: Math.abs(orb - 120) };
    // Opposition (180 +/- 8)
    if (Math.abs(orb - 180) < 8) return { type: 'opposition', orb: Math.abs(orb - 180) };
    // Sextile (60 +/- 6)
    if (Math.abs(orb - 60) < 6) return { type: 'sextile', orb: Math.abs(orb - 60) };
    // Square (90 +/- 6)
    if (Math.abs(orb - 90) < 6) return { type: 'square', orb: Math.abs(orb - 90) };

    return null;
  };

  const addConnection = (list: any[], p1: Planet | string, p2: Planet | string, aspect: any, interpretation: string, nature: 'harmonious' | 'challenging' | 'neutral') => {
    list.push({
      planet1: p1,
      planet2: p2,
      aspectType: aspect.type,
      orb: aspect.orb,
      interpretation,
      nature
    });
  };

  // 1. Soulmate Connections (Harmonious Aspects)
  const soulmatePairs: [Planet, Planet][] = [
    ['Jupiter', 'Moon'],
    ['Sun', 'Moon'],
    ['Venus', 'Jupiter'],
    ['Venus', 'Moon'],
    ['Jupiter', 'Jupiter']
  ];

  soulmatePairs.forEach(([p1, p2]) => {
    // Check A -> B
    let aspect = checkAspect(p1, p2, chartA, chartB);
    if (aspect && ['conjunction', 'trine', 'sextile', 'opposition'].includes(aspect.type)) {
      addConnection(soulmateConnections, p1, p2, aspect, `Strong ${p1}-${p2} bond indicating natural ease and spiritual affinity.`, 'harmonious');
    }
    // Check B -> A
    if (p1 !== p2 || aspect === null) { // If same planets, only check if aspect wasn't found in A->B
      aspect = checkAspect(p1, p2, chartB, chartA);
      if (aspect && ['conjunction', 'trine', 'sextile', 'opposition'].includes(aspect.type)) {
        addConnection(soulmateConnections, `Partner B's ${p1}`, `Partner A's ${p2}`, aspect, `Reciprocal ${p1}-${p2} harmony reinforcing the soul link.`, 'harmonious');
      }
    }
  });

  // 2. Karmic Bonds (Saturn / Nodes)
  const karmicPairs: [Planet, Planet][] = [
    ['Saturn', 'Sun'],
    ['Saturn', 'Moon'],
    ['Rahu', 'Sun'],
    ['Rahu', 'Moon'],
    ['Ketu', 'Sun'],
    ['Ketu', 'Moon'],
    ['Rahu', 'Venus']
  ];

  karmicPairs.forEach(([p1, p2]) => {
    let aspect = checkAspect(p1, p2, chartA, chartB);
    if (aspect && ['conjunction', 'opposition', 'square'].includes(aspect.type)) {
      const isNode = ['Rahu', 'Ketu'].includes(p1);
      const nature: 'harmonious' | 'challenging' | 'neutral' = isNode ? 'neutral' : 'challenging';
      const term = isNode ? 'Karmic soulmate link' : 'Karmic debt/lesson';
      addConnection(karmicBonds, p1, p2, aspect, `${term} involving ${p1} and ${p2}, indicating deep past-life storage.`, nature);
    }
    // Check B -> A
    aspect = checkAspect(p1, p2, chartB, chartA);
    if (aspect && ['conjunction', 'opposition', 'square'].includes(aspect.type)) {
      const isNode = ['Rahu', 'Ketu'].includes(p1);
      const nature: 'harmonious' | 'challenging' | 'neutral' = isNode ? 'neutral' : 'challenging';
      addConnection(karmicBonds, `Partner B's ${p1}`, `Partner A's ${p2}`, aspect, `Reciprocal karmic influence requiring mutual growth.`, nature);
    }
  });

  // Add D60 Karmic Link if present
  const destStr = d60Info?.marriageDestiny || '';
  const karmaStr = d60Info?.pastLifeKarma || '';

  if (destStr) {
    karmicBonds.push({
      planet1: 'Destiny (D60)',
      planet2: 'Chart nexus',
      aspectType: 'nexus',
      orb: 0,
      interpretation: destStr,
      nature: destStr.includes('Mirroring') || destStr.includes('Resonance') ? 'harmonious' : 'neutral'
    });
  }

  if (karmaStr) {
    karmicBonds.push({
      planet1: 'Karmic (D60)',
      planet2: 'Soul Link',
      aspectType: 'nexus',
      orb: 0,
      interpretation: karmaStr,
      nature: karmaStr.includes('Destined') ? 'harmonious' : 'neutral'
    });
  }

  // 3. Sexual Chemistry (Mars/Venus)
  const chemPairs: [Planet, Planet][] = [
    ['Mars', 'Venus'],
    ['Mars', 'Moon'],
    ['Venus', 'Venus']
  ];

  chemPairs.forEach(([p1, p2]) => {
    let aspect = checkAspect(p1, p2, chartA, chartB);
    if (aspect && ['conjunction', 'opposition', 'trine', 'sextile'].includes(aspect.type)) {
      addConnection(sexualChemistry, p1, p2, aspect, `Potent attraction and physical resonance between ${p1} and ${p2}.`, 'harmonious');
    }
    // Check B -> A
    if (p1 !== p2) {
      aspect = checkAspect(p1, p2, chartB, chartA);
      if (aspect && ['conjunction', 'opposition', 'trine', 'sextile'].includes(aspect.type)) {
        addConnection(sexualChemistry, `Partner B's ${p1}`, `Partner A's ${p2}`, aspect, `Balanced sexual energy flow.`, 'harmonious');
      }
    }
  });

  // Calculate House Overlays
  const houseOverlays = calculateHouseOverlays(chartA, chartB);

  // Calculate Planetary Conjunctions
  const planetaryConjunctions = calculatePlanetaryConjunctions(chartA, chartB);

  // Integrate harmonious conjunctions into Soulmate Connections if not already there
  planetaryConjunctions.forEach((conj: PlanetaryConjunction) => {
    const isPersonal = ['Sun', 'Moon', 'Venus', 'Jupiter'].includes(conj.planetA) && ['Sun', 'Moon', 'Venus', 'Jupiter'].includes(conj.planetB);
    if (isPersonal) {
      const exists = soulmateConnections.some(s => s.planet1 === conj.planetA && s.planet2 === conj.planetB);
      if (!exists) {
        soulmateConnections.push({
          planet1: conj.planetA,
          planet2: conj.planetB,
          aspectType: 'conjunction',
          orb: conj.orb,
          interpretation: conj.description,
          nature: 'harmonious'
        });
      }
    }
  });

  // Calculate Advanced Synastry
  const d9Overlays = calculateD9Synastry(chartA, chartB);
  const kpCompatibility = calculateKPSynastry(chartA, chartB);
  const jaiminiCompatibility = calculateJaiminiSynastry(chartA, chartB);

  return {
    soulmateConnections,
    karmicBonds,
    sexualChemistry,
    allAspects: [...soulmateConnections, ...karmicBonds, ...sexualChemistry],
    houseOverlays,
    planetaryConjunctions,
    d9Overlays,
    kpCompatibility,
    jaiminiCompatibility
  };
}

// ============================================================================
// IN-LAW ANALYSIS
// ============================================================================

function analyzeInLaws(chart: Chart, _partnerChart: Chart): InLawAnalysis {
  // 1. Analyze 2nd House (Family Harmony)
  const secondHouse = chart.houses.find(h => h.houseNumber === 2);
  const secondLord = chart.planetaryPositions.find(p => p.planet === secondHouse?.lord);
  const planetsInSecond = chart.planetaryPositions.filter(p => p.house === 2);

  let secondHouseScore = 50;
  const recommendations: string[] = [];
  let interpretation = "";

  // Lord Placement
  if (secondLord) {
    if ([6, 8, 12].includes(secondLord.house)) {
      secondHouseScore -= 15;
      recommendations.push("Family matters may require patience due to 2nd lord placement.");
    } else if ([1, 4, 5, 9, 10, 11].includes(secondLord.house)) {
      secondHouseScore += 15;
    }
  }

  // Planets in 2nd House
  const malefics = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"];
  const benefics = ["Jupiter", "Venus", "Mercury", "Moon"];

  const maleficsIn2nd = planetsInSecond.filter(p => malefics.includes(p.planet));
  const beneficsIn2nd = planetsInSecond.filter(p => benefics.includes(p.planet));

  if (maleficsIn2nd.length > 0) {
    secondHouseScore -= 10 * maleficsIn2nd.length;
    recommendations.push(`Avoid harsh speech with in-laws (${maleficsIn2nd.map(p => p.planet).join(", ")} in 2nd house).`);
  }
  if (beneficsIn2nd.length > 0) {
    secondHouseScore += 10 * beneficsIn2nd.length;
  }

  // 2. Analyze 10th House (Status/Public Image with In-laws)
  const tenthHouse = chart.houses.find(h => h.houseNumber === 10);
  const tenthLord = chart.planetaryPositions.find(p => p.planet === tenthHouse?.lord);
  const planetsIn10th = chart.planetaryPositions.filter(p => p.house === 10);

  let tenthHouseScore = 50;

  // Lord Placement
  if (tenthLord) {
    if ([6, 8, 12].includes(tenthLord.house)) {
      tenthHouseScore -= 15;
      recommendations.push("Maintain professional boundaries with extended family.");
    } else if ([1, 4, 5, 9, 10, 11].includes(tenthLord.house)) {
      tenthHouseScore += 15;
    }
  }

  // Planets in 10th House
  const maleficsIn10th = planetsIn10th.filter(p => malefics.includes(p.planet));
  const beneficsIn10th = planetsIn10th.filter(p => benefics.includes(p.planet));

  if (maleficsIn10th.length > 0) {
    tenthHouseScore -= 5 * maleficsIn10th.length; // 10th house handles pressure better
  }
  if (beneficsIn10th.length > 0) {
    tenthHouseScore += 10 * beneficsIn10th.length;
  }

  // 3. Generate Verdict
  const averageScore = (secondHouseScore + tenthHouseScore) / 2;

  if (averageScore >= 75) {
    interpretation = "Excellent in-law relationship expected. Supportive family environment.";
  } else if (averageScore >= 60) {
    interpretation = "Good in-law relationship with minor adjustments needed.";
  } else if (averageScore >= 40) {
    interpretation = "Average relationship. Requires conscious effort and patience.";
  } else {
    interpretation = "Challenging dynamics possible. Best to maintain respectful boundaries.";
    recommendations.push("Consider living separately or maintaining clear boundaries for harmony.");
  }

  // Cap scores
  secondHouseScore = Math.min(100, Math.max(0, secondHouseScore));
  tenthHouseScore = Math.min(100, Math.max(0, tenthHouseScore));

  if (recommendations.length === 0) {
    recommendations.push("Regular communication will strengthen bonds.");
  }

  return {
    secondHouseScore,
    tenthHouseScore,
    navamsaConfirmation: true, // Placeholder for deep D9 check
    interpretation,
    recommendations: [...new Set(recommendations)] // Dedupe
  };
}

// ============================================================================
// TIMING CALCULATION
// ============================================================================

function calculateTiming(chartA: Chart, chartB: Chart): TimingAnalysis {
  // Find current dasha from chart data
  const getCurrentDasha = (chart: Chart) => {
    const now = new Date();
    const current = chart.dashas?.find(d => {
      const start = new Date(d.startDate);
      const end = new Date(d.endDate);
      return now >= start && now <= end;
    });

    if (current) {
      const sub = current.subPeriods?.find(s => {
        const start = new Date(s.startDate);
        const end = new Date(s.endDate);
        return now >= start && now <= end;
      });
      return sub ? `${current.planet}/${sub.planet}` : current.planet;
    }
    return 'Unknown';
  };

  const dashaA = getCurrentDasha(chartA);
  const dashaB = getCurrentDasha(chartB);

  const findOverlappingFavorablePeriods = (tA: any[], tB: any[]) => {
    const overlaps: any[] = [];
    const now = new Date();

    // Convert segments to intervals [start, end]
    const getIntervals = (t: any[]) => {
      let start = now;
      return t.map(seg => {
        const interval = { start: new Date(start), end: new Date(seg.date), status: seg.status };
        start = seg.date;
        return interval;
      });
    };

    const intervalsA = getIntervals(tA);
    const intervalsB = getIntervals(tB);

    // Helper to calculate confidence based on Dasha planets
    const calculateConfidence = (start: Date, end: Date) => {
      // Find which Dasha periods are active during this window
      const getActiveDashas = (chart: Chart, date: Date) => {
        const dashas = chart.dashas || [];
        return dashas.filter(d => {
          const dStart = new Date(d.startDate);
          const dEnd = new Date(d.endDate);
          return date >= dStart && date <= dEnd;
        });
      };

      const midPoint = new Date((start.getTime() + end.getTime()) / 2);
      const activeA = getActiveDashas(chartA, midPoint);
      const activeB = getActiveDashas(chartB, midPoint);

      // Score based on benefic planets
      const beneficPlanets = ['Jupiter', 'Venus', 'Moon', 'Mercury'];
      const maleficPlanets = ['Saturn', 'Mars', 'Rahu', 'Ketu'];

      let score = 50; // Base score

      // Check Partner A's Dasha
      activeA.forEach(d => {
        if (beneficPlanets.includes(d.planet)) score += 15;
        if (maleficPlanets.includes(d.planet)) score -= 10;
        // Bonus for Venus or Jupiter specifically
        if (d.planet === 'Venus' || d.planet === 'Jupiter') score += 10;
      });

      // Check Partner B's Dasha
      activeB.forEach(d => {
        if (beneficPlanets.includes(d.planet)) score += 15;
        if (maleficPlanets.includes(d.planet)) score -= 10;
        if (d.planet === 'Venus' || d.planet === 'Jupiter') score += 10;
      });

      // Check if both have benefic planets (strong alignment)
      const hasBeneficA = activeA.some(d => beneficPlanets.includes(d.planet));
      const hasBeneficB = activeB.some(d => beneficPlanets.includes(d.planet));
      if (hasBeneficA && hasBeneficB) score += 15;

      // Check window duration (longer = more confidence)
      const durationMonths = (end.getTime() - start.getTime()) / (30 * 24 * 60 * 60 * 1000);
      if (durationMonths >= 6) score += 5;

      // Clamp between 40 and 95
      return Math.max(40, Math.min(95, score));
    };

    intervalsA.forEach(a => {
      if (a.status !== 'harmonious') return;

      intervalsB.forEach(b => {
        if (b.status !== 'harmonious') return;

        const start = a.start > b.start ? a.start : b.start;
        const end = a.end < b.end ? a.end : b.end;

        const minWindow = 30 * 24 * 60 * 60 * 1000;
        if (end.getTime() - start.getTime() >= minWindow) {
          const confidence = calculateConfidence(start, end);

          // Generate dynamic description based on confidence
          let description = 'Mutual harmonious planetary alignment';
          if (confidence >= 80) {
            description = 'Exceptional alignment - major marriage-benefic planets strongly support this window';
          } else if (confidence >= 65) {
            description = 'Strong favorable period with good planetary support for marriage';
          } else if (confidence >= 50) {
            description = 'Moderate alignment - favorable with some planetary considerations';
          } else {
            description = 'Basic favorable period - acceptable timing with awareness';
          }

          overlaps.push({
            startDate: start,
            endDate: end,
            description,
            confidence
          });
        }
      });
    });

    return overlaps.sort((a, b) => a.startDate.getTime() - b.startDate.getTime()).slice(0, 3);
  };

  // Vulnerable Periods
  const vimshottariA = {
    moonNakshatra: chartA.nakshatra as any,
    mahaDashas: chartA.dashas
  };
  const vulnerablePeriodsA = findVulnerablePeriods(vimshottariA, {
    separativePlanets: chartA.houses.find(h => h.houseNumber === 7)?.planets.filter(p => ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(p)) || [],
    name: chartA.name
  });

  const vimshottariB = {
    moonNakshatra: chartB.nakshatra as any,
    mahaDashas: chartB.dashas
  };
  const vulnerablePeriodsB = findVulnerablePeriods(vimshottariB, {
    separativePlanets: chartB.houses.find(h => h.houseNumber === 7)?.planets.filter(p => ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(p)) || [],
    name: chartB.name
  });

  // Generate 24-Month Timeline
  const generateTimeline = (chart: Chart) => {
    const timeline: { date: Date; status: 'harmonious' | 'caution' | 'high_awareness'; description: string }[] = [];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 24);

    let currentDate = new Date(startDate);

    // Get relevant dashas
    const relevantDashas: any[] = [];

    // Flatten dasha structure to find periods overlapping with next 24 months
    chart.dashas?.forEach(md => {
      if (new Date(md.endDate) > startDate && new Date(md.startDate) < endDate) {
        md.subPeriods?.forEach(ad => {
          if (new Date(ad.endDate) > startDate && new Date(ad.startDate) < endDate) {
            // Check for Pratyantar Dashas (3rd level)
            if (ad.subPeriods && ad.subPeriods.length > 0) {
              ad.subPeriods.forEach(pd => {
                if (new Date(pd.endDate) > startDate && new Date(pd.startDate) < endDate) {
                  relevantDashas.push({
                    planet: `${md.planet}/${ad.planet}/${pd.planet}`,
                    startDate: new Date(pd.startDate),
                    endDate: new Date(pd.endDate),
                    lord: pd.planet
                  });
                }
              });
            } else {
              // Fallback to Antardasha if no sub-periods
              relevantDashas.push({
                planet: `${md.planet}/${ad.planet}`,
                startDate: new Date(ad.startDate),
                endDate: new Date(ad.endDate),
                lord: ad.planet
              });
            }
          }
        });
      }
    });

    // Sort by date
    relevantDashas.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    // Generate timeline points (simplified to monthly resolution for widget)
    for (const dasha of relevantDashas) {
      // Determine status based on planet
      let status: 'harmonious' | 'caution' | 'high_awareness' = 'neutral' as any;
      const planet = dasha.lord;

      if (['Jupiter', 'Venus', 'Moon', 'Mercury'].includes(planet)) {
        status = 'harmonious';
      } else if (['Sun', 'Mars'].includes(planet)) {
        status = 'caution';
      } else {
        status = 'high_awareness'; // Saturn, Rahu, Ketu
      }

      // Add segment
      const segmentStart = dasha.startDate < startDate ? startDate : dasha.startDate;
      const segmentEnd = dasha.endDate > endDate ? endDate : dasha.endDate;

      if (segmentStart < segmentEnd) {
        timeline.push({
          date: segmentEnd, // Use end date to represent the span reaching this point
          status,
          description: `${dasha.planet} period: ${status === 'harmonious' ? 'Supportive for relationships' : status === 'caution' ? 'Requires patience' : 'Karmic testing period'}`
        });
      }
    }

    // Ensure the timeline reaches the full 24-month horizon
    if (timeline.length > 0) {
      const lastSegmentDate = timeline[timeline.length - 1].date;
      if (lastSegmentDate < endDate) {
        timeline.push({
          date: endDate,
          status: timeline[timeline.length - 1].status,
          description: timeline[timeline.length - 1].description
        });
      }
    } else {
      // Fallback if no dashas found (should not happen with full data)
      timeline.push({ date: endDate, status: 'harmonious', description: 'General favorable period' });
    }

    return timeline;
  };

  const timelineA = generateTimeline(chartA);
  const timelineB = generateTimeline(chartB);

  const favorablePeriods = findOverlappingFavorablePeriods(timelineA, timelineB);

  return {
    favorablePeriods,
    vulnerablePeriods: [...vulnerablePeriodsA, ...vulnerablePeriodsB],
    partnerA: {
      name: chartA.name,
      currentDasha: dashaA,
      favourability: dashaA.includes('Venus') || dashaA.includes('Jupiter') ? 'positive' : 'neutral',
      analysis: `${dashaA.split('/')[0]} Dasha is currently influencing ${chartA.name}'s life focus.`
    },
    partnerB: {
      name: chartB.name,
      currentDasha: dashaB,
      favourability: dashaB.includes('Venus') || dashaB.includes('Jupiter') ? 'positive' : 'neutral',
      analysis: `${dashaB.split('/')[0]} Dasha provides the backdrop for ${chartB.name}'s relationship timing.`
    },
    timeline: {
      partnerA: timelineA,
      partnerB: timelineB
    },
    transitNotes: ['Jupiter transit supportive', 'Check Saturn return if applicable']
  };
}

// ============================================================================
// REMEDIES GENERATION
// ============================================================================

function generateRemedies(
  chartA: Chart,
  chartB: Chart,
  doshas: { nadiDosha: boolean; bhakootDosha: boolean; ganaDosha: boolean }
): Remedies {
  const lalKitabGeneral: string[] = [];
  const lalKitabSpecific: string[] = [];
  const gemstones: any[] = [];
  const modernAdjustments: string[] = [];

  // General remedies - Lal Kitab Style
  lalKitabGeneral.push('Feed cows with grass/dough on Fridays to strengthen Venus');
  lalKitabGeneral.push('Offer water to the Sun daily to improve social harmony');
  lalKitabGeneral.push('Keep a silver square piece in your wallet for mental peace');

  // Chart-based Lal Kitab remedies
  const marsA = chartA.planetaryPositions.find(p => p.planet === 'Mars');
  if (marsA && [1, 4, 7, 8, 12].includes(marsA.house)) {
    lalKitabSpecific.push(`${chartA.name}: Offer sweet milk to a Banyan tree and apply Tilak of the wet soil`);
  }

  const venusB = chartB.planetaryPositions.find(p => p.planet === 'Venus');
  if (venusB && [6, 8, 12].includes(venusB.house)) {
    lalKitabSpecific.push(`${chartB.name}: Donate white sweets or curd to a temple on Fridays`);
  }

  // Specific ashtakoot dosha remedies
  if (doshas.nadiDosha) {
    lalKitabSpecific.push('Nadi Remedy: Donate grains equivalent to your weight (Tula Dana)');
    lalKitabSpecific.push('Chant Mahamrityunjaya mantra 108 times daily for health harmony');
  }

  if (doshas.bhakootDosha) {
    lalKitabSpecific.push('Bhakoot Remedy: Gift a silver item to your partner');
    lalKitabSpecific.push('Keep a bowl of water near your bed at night and pour it in a plant in the morning');
  }

  if (doshas.ganaDosha) {
    lalKitabSpecific.push('Gana Remedy: Worship Lord Ganesha and offer Durva grass on Wednesdays');
    lalKitabSpecific.push('Strengthen Jupiter by offering yellow flowers in a temple');
  }

  // Gemstones based on Darakaraka (Primary recommendation)
  const dkPlanet = chartA.specialPoints?.darakaraka;
  const gemData: Record<string, any> = {
    'Sun': { stone: 'Ruby', metal: 'Gold', finger: 'Ring finger', mantra: 'Om Suryaya Namah' },
    'Moon': { stone: 'Pearl', metal: 'Silver', finger: 'Little finger', mantra: 'Om Somaya Namah' },
    'Mars': { stone: 'Red Coral', metal: 'Gold/Copper', finger: 'Ring finger', mantra: 'Om Angarakaya Namah' },
    'Mercury': { stone: 'Emerald', metal: 'Gold', finger: 'Little finger', mantra: 'Om Budhaya Namah' },
    'Jupiter': { stone: 'Yellow Sapphire', metal: 'Gold', finger: 'Index finger', mantra: 'Om Gurave Namah' },
    'Venus': { stone: 'Diamond/Opal', metal: 'Silver/Platinum', finger: 'Middle/Ring finger', mantra: 'Om Shukraya Namah' },
    'Saturn': { stone: 'Blue Sapphire', metal: 'Panchdhatu/Steel', finger: 'Middle finger', mantra: 'Om Shanischaraya Namah' }
  };

  if (dkPlanet && gemData[dkPlanet]) {
    gemstones.push(gemData[dkPlanet]);
  }

  // Modern adjustments
  modernAdjustments.push('Practice non-violent communication during disagreements');
  modernAdjustments.push('Create a shared vision board for your future together');
  modernAdjustments.push('Dedicate 30 minutes daily for "device-free" deep conversation');

  return {
    lalKitab: {
      general: lalKitabGeneral,
      specific: lalKitabSpecific
    },
    gemstones,
    modernAdjustments
  };
}

// ============================================================================
// ADVANCED SCORE BREAKDOWN
// ============================================================================

function calculateAdvancedBreakdown(data: {
  ashtakoot: any;
  kpAnalysis: any;
  charaKarakas: any;
  synastry: any;
  riskAssessment: any;
  mentalHealth: any;
  addictionRisk: any;
  inLaws: any;
  modernChallenges: any;
  sexualHealth: any;
  yogaDosha: any;
  poruthamAnalysis?: any;
}): any {
  // --- PILLAR 1: STRUCTURAL STABILITY (25%) ---
  const divorceScore = 100 - (data.riskAssessment.divorceProbability.score || 0);
  const mentalScore = Math.max(0, 100 - ((data.mentalHealth.partnerA.totalRiskScore + data.mentalHealth.partnerB.totalRiskScore) / 2));
  const addictionScore = Math.max(0, 100 - ((data.addictionRisk.partnerA.overallScore + data.addictionRisk.partnerB.overallScore) / 2));
  const inLawAvgA = (data.inLaws.partnerA.secondHouseScore + data.inLaws.partnerA.tenthHouseScore) / 2;
  const inLawAvgB = (data.inLaws.partnerB.secondHouseScore + data.inLaws.partnerB.tenthHouseScore) / 2;
  const inLawScore = (inLawAvgA + inLawAvgB) / 2;
  const modernScore = 100 - (data.modernChallenges.mentalHealth.length * 10);

  const infidelityScore = 100 - (data.riskAssessment.infidelityRisk.score || 0);

  const stabilityScore = Math.round(
    divorceScore * 0.25 +
    infidelityScore * 0.25 +
    mentalScore * 0.15 +
    addictionScore * 0.15 +
    inLawScore * 0.10 +
    modernScore * 0.10
  );

  const stability = {
    score: stabilityScore,
    label: "Stability & Foundation",
    explanation: "Synthesizes Divorce Risks, Infidelity vulnerabilities, Mental Health patterns, Addiction indicators, In-Law stress, and Modern challenges.",
    status: (stabilityScore >= 80 ? 'positive' : stabilityScore >= 50 ? 'neutral' : 'challenging') as any,
    breakdown: [
      { name: 'Divorce Risk', score: Math.round(divorceScore) },
      { name: 'Infidelity Risk', score: Math.round(infidelityScore) },
      { name: 'Mental Health', score: Math.round(mentalScore) },
      { name: 'Addiction Risk', score: Math.round(addictionScore) },
      { name: 'In-Law Support', score: Math.round(inLawScore) },
      { name: 'Modern Dynamics', score: Math.round(modernScore) }
    ]
  };

  // --- PILLAR 2: LIVING DYNAMICS (25%) ---
  const synastryScore = Math.min(100, data.synastry.soulmateConnections.length * 20 + 40);
  const overlayScore = Math.min(100, data.synastry.houseOverlays.length * 10 + 30);
  const sexualScore = data.sexualHealth.mutualSatisfaction.score;

  const dynamicsScore = Math.round(
    synastryScore * 0.50 +
    overlayScore * 0.30 +
    sexualScore * 0.20
  );

  const interaction = {
    score: dynamicsScore,
    label: "Dynamics & Interaction",
    explanation: "Analyzes Planet-to-Planet Synastry, House Overlays, and Sexual/Biological Compatibility.",
    status: (dynamicsScore >= 75 ? 'positive' : dynamicsScore >= 50 ? 'neutral' : 'challenging') as any,
    breakdown: [
      { name: 'Synastry (Aspects)', score: Math.round(synastryScore) },
      { name: 'House Overlays', score: Math.round(overlayScore) },
      { name: 'Sexual Vitality', score: Math.round(sexualScore) }
    ]
  };

  // --- PILLAR 3: PURPOSE & DESTINY (50%) ---
  const kpScoreForPromise = (promise: string, strength: string = 'neutral'): number => {
    // Dynamic scoring based on promise type and sub-lord strength
    const baseScores: Record<string, number> = {
      'promised': 85,
      'denied': 20,
      'complicated': 50
    };

    let score = baseScores[promise] || 50;

    // Adjust based on sub-lord strength indicator
    if (strength === 'strong') score += 10;
    else if (strength === 'weak') score -= 10;

    return Math.max(15, Math.min(95, score));
  };

  const kpA = kpScoreForPromise(
    data.kpAnalysis.partnerA.seventhCuspSubLord.marriagePromise,
    data.kpAnalysis.partnerA.seventhCuspSubLord.significators?.some((s: any) =>
      ['Venus', 'Jupiter', 'Moon'].includes(s.planet)
    ) ? 'strong' : 'neutral'
  );
  const kpB = kpScoreForPromise(
    data.kpAnalysis.partnerB.seventhCuspSubLord.marriagePromise,
    data.kpAnalysis.partnerB.seventhCuspSubLord.significators?.some((s: any) =>
      ['Venus', 'Jupiter', 'Moon'].includes(s.planet)
    ) ? 'strong' : 'neutral'
  );
  const kpPromise = Math.round((kpA + kpB) / 2);

  // Dynamic soul contact scoring based on Jaimini contact type and quality
  const dkContactType = data.synastry.jaiminiCompatibility?.darakarakaContact?.type;
  const dkContactQuality = data.synastry.jaiminiCompatibility?.darakarakaContact?.quality || 'neutral';

  const baseContactScores: Record<string, number> = {
    'trine': 90,
    'kendra': 85,
    'mutual': 80,
    'opposition': 60,
    'none': 40,
    'challenging': 30
  };

  let soulContact = baseContactScores[dkContactType || 'none'] || 50;

  // Adjust based on contact quality
  if (dkContactQuality === 'excellent') soulContact += 8;
  else if (dkContactQuality === 'good') soulContact += 4;
  else if (dkContactQuality === 'difficult') soulContact -= 8;
  else if (dkContactQuality === 'challenging') soulContact -= 12;

  soulContact = Math.max(20, Math.min(98, soulContact));

  const gunaScore = data.ashtakoot.percentage;

  // Dynamic Manglik scoring - not just binary
  const calculateManglikScore = (analysis: any): number => {
    if (!analysis) return 50;

    if (analysis.isCancelled) {
      // Cancelled manglik gets good score with bonus for cancellation strength
      return 75 + (analysis.cancellationReasons?.length || 0) * 5;
    }

    if (!analysis.isManglik) {
      // Neither partner is manglik - neutral
      return analysis.isCompatible ? 70 : 50;
    }

    // Both or one is manglik without cancellation
    if (!analysis.isCompatible) {
      // Incompatible manglik combinations
      const baseScore = 35;
      // Check for partial compatibility factors
      if (analysis.hasMarsInSameHouse) return baseScore + 5;
      return baseScore;
    }

    return analysis.isCompatible ? 65 : 40;
  };

  const manglikScore = calculateManglikScore(data.ashtakoot.manglikAnalysis);
  const poruthamScore = data.poruthamAnalysis ? data.poruthamAnalysis.percentage : gunaScore; // Fallback to guna if no porutham

  const traditionScore = Math.round(
    gunaScore * 0.50 +
    manglikScore * 0.25 +
    poruthamScore * 0.25
  );
  const positiveYogasA = data.yogaDosha?.partnerA?.categories
    ?.filter((c: any) => c.type === 'yoga')?.length ?? 0;
  const positiveYogasB = data.yogaDosha?.partnerB?.categories
    ?.filter((c: any) => c.type === 'yoga')?.length ?? 0;
  const negDoshasA = data.yogaDosha?.partnerA?.categories
    ?.filter((c: any) => c.type === 'dosha')?.length ?? 0;
  const negDoshasB = data.yogaDosha?.partnerB?.categories
    ?.filter((c: any) => c.type === 'dosha')?.length ?? 0;
  const yogaScore = Math.min(100, Math.max(0,
    50 + (positiveYogasA + positiveYogasB) * 5 - (negDoshasA + negDoshasB) * 8
  ));

  const destinyScore = Math.round(
    kpPromise * 0.40 +
    soulContact * 0.35 +
    yogaScore * 0.25
  );

  const soul = {
    score: destinyScore,
    label: "Soul & Destiny Bond",
    explanation: "Synthesis of KP Promise, Jaimini Soul resonance, and Yoga/Dosha strength.",
    status: (destinyScore >= 80 ? 'positive' : destinyScore >= 50 ? 'neutral' : 'challenging') as any,
    breakdown: [
      { name: 'KP Marriage Promise', score: Math.round(kpPromise) },
      { name: 'Jaimini Soul Contact', score: Math.round(soulContact) },
      { name: 'Yoga/Dosha Strength', score: Math.round(yogaScore) }
    ]
  };

  const tradition = {
    score: traditionScore,
    label: "Tradition",
    explanation: "Ashtakoot Milan & Manglik Analysis (Aushadha/Porutham vibrational matching).",
    status: (traditionScore >= 70 ? 'positive' : traditionScore >= 50 ? 'neutral' : 'challenging') as any,
    breakdown: [
      { name: 'Guna Milan (36 Points)', score: Math.round(data.ashtakoot.percentage) },
      { name: 'Manglik Compatibility', score: Math.round(manglikScore) },
      ...(data.poruthamAnalysis ? [{ name: 'Porutham (11 Params)', score: Math.round(data.poruthamAnalysis.percentage) }] : [])
    ]
  };

  const promise = {
    score: kpPromise,
    label: "Promise",
    explanation: "KP Sub-Lord analysis of the 7th Cusp determining the fixed structural success of the bond.",
    status: (kpPromise >= 80 ? 'positive' : kpPromise >= 50 ? 'neutral' : 'challenging') as any,
    breakdown: [
      { name: 'Self Promise (7th CSL)', score: kpA },
      { name: 'Partner Promise (7th CSL)', score: kpB }
    ]
  };

  return { stability, interaction, soul, tradition, promise };
}

/**
 * Advanced Holistic Scoring Calculation
 * Implements weighted pillars and conditional "Deal-Breaker" caps
 */
/**
 * Advanced Holistic Scoring Calculation
 * Implements weighted pillars and conditional "Deal-Breaker" caps
 */
function calculateOverallScore(
  pillarScores: {
    stability: number;
    interaction: number;
    soul: number;
    tradition: number;
    promise: number;
  },
  context: {
    ashtakootScore: number;
    riskAssessment: any;
    kpAnalysis: any;
    mentalHealth: any;
    addictionRisk: any;
  }
): number {
  // 1. Initial Weighted Calculation (5-Pillar Model)
  const weights = {
    soul: 0.30,
    tradition: 0.20,
    stability: 0.20,
    interaction: 0.20,
    promise: 0.10
  };

  let score = Math.round(
    pillarScores.soul * weights.soul +
    pillarScores.tradition * weights.tradition +
    pillarScores.stability * weights.stability +
    pillarScores.interaction * weights.interaction +
    pillarScores.promise * weights.promise
  );

  // 2. Apply "Hard-Stop" Deal-Breaker Caps

  // Case A: Mental Health Crisis
  if (context.mentalHealth.partnerA.totalRiskScore > 75 || context.mentalHealth.partnerB.totalRiskScore > 75) {
    score = Math.round(score * 0.7); // 30% reduction instead of hard cap
  }

  // Case B: Severe Addiction
  if (context.addictionRisk.partnerA.overallScore > 80 || context.addictionRisk.partnerB.overallScore > 80) {
    score = Math.round(score * 0.7); // 30% reduction
  }

  // Case C: Denied Marriage Promise (KP)
  const promiseA = context.kpAnalysis.partnerA.seventhCuspSubLord.marriagePromise;
  const promiseB = context.kpAnalysis.partnerB.seventhCuspSubLord.marriagePromise;
  if (promiseA === 'denied' || promiseB === 'denied') {
    score = Math.round(score * 0.75); // 25% reduction instead of hard cap at 40
  }

  // Case D: Extreme Divorce Risk
  if (context.riskAssessment.divorceProbability.level === 'very_high') {
    score = Math.round(score * 0.8); // 20% reduction
  }

  // Case E: Ashtakoot Fail
  if (context.ashtakootScore < 16) {
    score = Math.round(score * 0.9); // 10% reduction
  }

  // Case F: High Infidelity Risk (Refined)
  if (context.riskAssessment.infidelityRisk.level === 'high') {
    score = Math.round(score * 0.75); // 25% reduction for High
  } else if (context.riskAssessment.infidelityRisk.level === 'medium') {
    score = Math.round(score * 0.85); // 15% reduction for Medium
  }

  return score;
}

function determineVerdict(
  overallScore: number,
  ashtakootScore: number,
  riskAssessment: any
): 'excellent' | 'very_good' | 'good' | 'fair' | 'challenging' | 'poor' {
  if (overallScore >= 85 && ashtakootScore >= 28 && riskAssessment.divorceProbability.level === 'low') {
    return 'excellent';
  } else if (overallScore >= 75 && ashtakootScore >= 24) {
    return 'very_good';
  } else if (overallScore >= 65 && ashtakootScore >= 20) {
    return 'good';
  } else if (overallScore >= 50 && ashtakootScore >= 18) {
    return 'fair';
  } else if (overallScore >= 35) {
    return 'challenging';
  } else {
    return 'poor';
  }
}

function generateExecutiveSummary(
  overallScore: number,
  ashtakoot: any,
  riskAssessment: any,
  sexualHealth: any,
  context?: { kpAnalysis: any; synastry: any }
): any {
  const strengths: string[] = [];
  const challenges: string[] = [];
  let preservationKey = "Mutual respect and clear communication are the foundations of this bond.";

  // 1. Analyze Core Strengths
  if (ashtakoot.totalScore >= 24) {
    strengths.push(`Strong Traditional Alignment: ${ashtakoot.totalScore}/36 in Ashtakoot Milan.`);
  }

  const soulContact = context?.synastry?.jaiminiCompatibility?.darakarakaContact?.type !== 'none';
  if (soulContact) {
    strengths.push("Deep Karmic Resonance: Significant soul-level connection detected through Darakaraka.");
  }

  const kpPromisePos = context?.kpAnalysis?.partnerA?.seventhCuspSubLord?.marriagePromise === 'promised' &&
    context?.kpAnalysis?.partnerB?.seventhCuspSubLord?.marriagePromise === 'promised';
  if (kpPromisePos) {
    strengths.push("Positive Marital Promise: Precise KP indicators show a high probability of success.");
  }

  if (sexualHealth.mutualSatisfaction.score >= 70) {
    strengths.push("Physical Synergy: Strong biological and emotional harmony in physical bonding.");
  }

  if (riskAssessment.divorceProbability.level === 'low') {
    strengths.push("Structural Stability: Low baseline separation risks providing a secure foundation.");
  }

  // 2. Analyze Core Challenges & Preservation Keys
  if (riskAssessment.divorceProbability.level === 'high' || riskAssessment.divorceProbability.level === 'very_high') {
    challenges.push("Separation Stress: High planetary intensity affecting marital longevity.");
    preservationKey = "Focus on conflict resolution training and professional counseling to navigate sudden emotional storms.";
  }

  if (ashtakoot.doshas.nadiDosha) {
    challenges.push("Nadi Dosha: Potential mismatch in energy/vibration affecting longevity and progeny.");
    preservationKey = "Prioritize health-related spiritual remedies and maintain healthy physical boundaries.";
  }

  if (riskAssessment.infidelityRisk.score > 25) {
    challenges.push("Passion Management: Specific indicators suggest a high-passion nature that requires deeper emotional transparency.");
    preservationKey = "Focus on novelty and clear boundaries to channel intense desire nature into relationship growth.";
  }

  const kpDenied = context?.kpAnalysis?.partnerA?.seventhCuspSubLord?.marriagePromise === 'denied' ||
    context?.kpAnalysis?.partnerB?.seventhCuspSubLord?.marriagePromise === 'denied';
  if (kpDenied) {
    challenges.push("KP Marriage Restriction: Significant obstacles indicated at the precision cuspal level.");
    preservationKey = "Accepting delays and focusing on individual stability before final commitment will mitigate frustration.";
  }

  // 3. Status and Verdict logic
  let trafficLightStatus: 'green' | 'yellow' | 'red';
  if (overallScore >= 75 && riskAssessment.divorceProbability.level === 'low') {
    trafficLightStatus = 'green';
  } else if (overallScore >= 50 && riskAssessment.divorceProbability.level !== 'very_high') {
    trafficLightStatus = 'yellow';
  } else {
    trafficLightStatus = 'red';
  }

  let verdict = '';
  if (overallScore >= 80) {
    verdict = 'Elite Soul Connection: A rare blend of destiny, desire, and durability.';
  } else if (overallScore >= 65) {
    verdict = 'Harmonious Growth: Strong potential with manageable lessons in communication.';
  } else if (overallScore >= 50) {
    verdict = 'Conscious Partnership: Requires proactive work on specific risk areas to thrive.';
  } else {
    verdict = 'Challenging Destiny: Success depends heavily on spiritual remedies and extreme patience.';
  }

  return {
    verdict,
    strengths: strengths.slice(0, 4), // Keep top 4
    challenges: challenges.slice(0, 4), // Keep top 4
    trafficLightStatus,
    preservationKey
  };
}

// ============================================================================
// EXPORT MAIN FUNCTION
// ============================================================================

export async function generateFullCompatibilityReport(
  birthDataA: BirthDataInput,
  birthDataB: BirthDataInput,
  userId?: string
): Promise<CompatibilityReport> {
  // Generate charts
  const chartA = await generateChartFromBirthData(birthDataA);
  const chartB = await generateChartFromBirthData(birthDataB);

  // Generate report
  const report = await generateCompatibilityReport(chartA, chartB, userId);

  return report;
}

// ============================================================================
// JOINT DESTINY CALCULATION
// ============================================================================

function calculateJointDestinySync(
  favorablePeriods: any[],
  charaA: any,
  charaB: any,
  vivahA: any,
  vivahB: any
): DestinySyncItem[] {
  return favorablePeriods.map(p => {
    const yearStr = p.startDate.getFullYear().toString();
    const year = parseInt(yearStr);
    const endYear = p.endDate.getFullYear();

    // Check Chara Dasha for Partner A
    let charaActiveA = false;
    if (charaA && charaA.allPeriods) {
      const activePeriod = charaA.allPeriods.find((ap: any) =>
        year >= new Date(ap.startDate).getFullYear() &&
        year <= new Date(ap.endDate).getFullYear()
      );
      if (activePeriod && charaA.marriageTiming?.favorableSigns) {
        // Direct Check
        charaActiveA = charaA.marriageTiming.favorableSigns.includes(activePeriod.sign);

        // Relaxed Check: If current dasha is 7th from UL or DK (which should be in favorableSigns, but double checking logic)
        // Also if Dasha Sign is the sign of Venus (Natural Karaka)
      }
    }

    // Check Chara Dasha for Partner B
    let charaActiveB = false;
    if (charaB && charaB.allPeriods) {
      const activePeriod = charaB.allPeriods.find((ap: any) =>
        year >= new Date(ap.startDate).getFullYear() &&
        year <= new Date(ap.endDate).getFullYear()
      );
      if (activePeriod && charaB.marriageTiming?.favorableSigns) {
        charaActiveB = charaB.marriageTiming.favorableSigns.includes(activePeriod.sign);
      }
    }

    let vivahSahamActive = false;
    // Check B
    if (vivahB) {
      const jupiterSign = year === 2024 ? 'Taurus' : year === 2025 ? 'Gemini' : year === 2026 ? 'Cancer' : year === 2027 ? 'Leo' : 'Virgo';
      if (vivahB.sign === jupiterSign || vivahB.sign === getSeventhSign(jupiterSign)) vivahSahamActive = true;
    }

    // Aggregate for the Item Payload
    const charaDashaActive = charaActiveA || charaActiveB;

    const isDestinyWindow = p.confidence > 75 && (charaDashaActive || vivahSahamActive);

    let description = "Favorable period based on joint Dasha overlap.";
    if (isDestinyWindow) {
      description = "Powerful synchronization of Dasha, Chara periods, and Transit activation.";
    }

    return {
      startDate: yearStr,
      endDate: endYear.toString(),
      periodName: "Joint Window",
      vimshottariConfidence: p.confidence,
      charaDashaActive,
      vivahSahamActive,
      isDestinyWindow,
      description
    } as DestinySyncItem;
  });
}

function getSeventhSign(sign: any): any {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const index = signs.indexOf(sign);
  if (index === -1) return sign; // Fallback
  return signs[(index + 6) % 12];
}