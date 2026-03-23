/**
 * Self Report Generator
 * Generates comprehensive marriage analysis for a single person
 */

import { Chart, BirthDataInput, PlanetaryPosition, House, Sign, Planet, DivisionalChartAnalysis, PsychologicalProfile } from '../src/types';
import {
  SelfAnalysisReport,
  MarriagePotential,
  SpouseDetailedProfile,
  TimingForecast,
  SelfSexualProfile,
  SelfRemedies,
  SelfExecutiveSummary,
  FavorablePeriod,
  CautionaryPeriod
} from '../src/types/selfAnalysis';
import { v4 as uuidv4 } from 'uuid';
import { calculateTimingAnalysis } from './timingCalculations';
import { calculateSpousePrediction } from './spouseCalculations';
import { analyzeYogaDoshas } from './yogaDoshaCalculations';
import { analyzeMentalHealth } from './mentalHealthCalculations';
import { analyzeAddictionRisk } from './addictionCalculations';
import { calculateRelationshipPatterns } from './relationshipPatternCalculations';
import { calculateVimshottariDasha, getCurrentDasha } from './dashaCalculations';
import {
  analyzeMaleSexualHealth,
  analyzeFemaleSexualHealth,
  analyzeLibido,
  analyzeSexualOrientation,
  analyzeMutualSatisfaction
} from './sexualHealthCalculations';
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
import {
  calculateAshtakootMilan,
  calculateNavamsaMatching,
  calculateSexualCompatibility,
  predictSpouseCharacteristics,
  analyzeDivisionalCharts
} from './compatibilityCalculations';
import { ExtendedDivisionalAnalysis, ExtendedTimingAnalysis, DestinySyncItem } from '../src/types/extendedTypes';

function getCurrentDashaFromChart(chart: Chart): { planet: string; mahadasha: string } | null {
  const now = new Date();

  // Prioritize existing dashas in chart
  if (chart.dashas && chart.dashas.length > 0) {
    const current = chart.dashas.find((d: any) => now >= new Date(d.startDate) && now < new Date(d.endDate));
    if (current) {
      const antardasha = current.subPeriods?.find((sd: any) => now >= new Date(sd.startDate) && now < new Date(sd.endDate));
      return {
        planet: current.planet,
        mahadasha: `${current.planet} - ${antardasha?.planet || 'Unknown'}`
      };
    }
  }

  // Fallback to calculation if not present
  const moon = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Moon');
  if (!moon) return null;

  try {
    const dasha = calculateVimshottariDasha(moon.nakshatra, moon.longitude, chart.dateOfBirth);
    const current = getCurrentDasha(dasha);

    if (current.mahaDasha) {
      return {
        planet: current.mahaDasha.planet,
        mahadasha: `${current.mahaDasha.planet} - ${current.antardasha?.planet || 'Unknown'}`
      };
    }
  } catch (e) {
    // Dasha calculation failed - using fallback
  }

  return null;
}

/**
 * Generate complete self analysis report
 */
export async function generateSelfAnalysisReport(
  birthData: BirthDataInput,
  chart: Chart
): Promise<SelfAnalysisReport> {
  try {
    // Generate all analysis components in parallel
    const [
      marriagePotential,
      spousePrediction,
      timingAnalysis,
      sexualProfile,
      psychologicalProfile,
      doshaAnalysis,
      mentalHealth,
      addictionRisk,
      relationshipPatterns,
      extendedDivisional,
      kpAnalysis,
      charaKarakas,
      charaDasha,
      ul,
      vivahSaham,
      transitAnalysis,
      sexualHealth,
      extendedSexualCompatibility
    ] = await Promise.all([
      calculateMarriagePotential(chart),
      calculateSpousePrediction(chart),
      calculateTimingAnalysis(birthData, chart),
      // 4. Sexual Profile (Self) - Dynamic calculation based on chart
      Promise.resolve(calculateSelfSexualProfile(chart)),
      calculatePsychologicalProfile(chart),
      analyzeYogaDoshas(chart),
      Promise.resolve(analyzeMentalHealth(chart)).catch(() => null),
      Promise.resolve(analyzeAddictionRisk(chart)).catch(() => null),
      Promise.resolve(calculateRelationshipPatterns(chart, chart.name || 'You')).catch(() => null),
      calculateExtendedDivisionalAnalysis(chart),
      Promise.resolve(calculateKPAnalysis(chart)).catch((err) => {
        console.error('KP Analysis calculation failed:', err instanceof Error ? err.message : 'Unknown error');
        return null;
      }),
      Promise.resolve(calculateCharaKarakas(chart)).catch(() => null),
      Promise.resolve(calculateCharaDasha(chart)).catch(() => null),
      Promise.resolve(calculateUpapadaLagna(chart)).catch(() => null),
      Promise.resolve(calculateVivahSaham(chart)).catch(() => null),
      Promise.resolve(calculateTransitAnalysis(chart)).catch(() => null),
      // 17. Sexual Health Analysis (New)
      Promise.resolve().then(() => {
        const genderLower = (chart.gender || '').toLowerCase();
        const maleHealth = genderLower === 'male' ? analyzeMaleSexualHealth(chart) : { pmeRisk: 'Low' as const, edRisk: 'Low' as const, indicators: [], recommendations: [] };
        const femaleHealth = genderLower === 'female' ? analyzeFemaleSexualHealth(chart) : { frigidityRisk: 'Low' as const, physicalPainRisk: 'Low' as const, indicators: [], recommendations: [] };

        const libido = analyzeLibido(chart);
        const orientation = analyzeSexualOrientation(chart);

        return {
          maleHealth,
          femaleHealth,
          mutualSatisfaction: { score: 0, vibeMatch: 'N/A', elementCompatibility: 'N/A', description: 'Self Analysis' },
          libidoA: libido,
          libidoB: { level: 'Low' as const, description: '' },
          orientationA: orientation,
          orientationB: { pattern: '', indicators: [], description: '' }
        };
      }),
      // 18. Extended Sexual Compatibility (Self-version)
      Promise.resolve(calculateExtendedSexualCompatibility(chart, chart)).catch(() => null)
    ]);

    // Transform divisional analysis
    const divisionalAnalysis = transformDivisionalAnalysis(extendedDivisional, chart);



    // Generate timing forecast from timing analysis
    const timingForecast = generateTimingForecast(chart, timingAnalysis, charaDasha, ul, vivahSaham, transitAnalysis);

    // Refine expected marriage age based on timing forecast
    if (timingForecast?.nextMarriageWindow?.yearRange) {
      try {
        const yearRange = timingForecast.nextMarriageWindow.yearRange; // "2027-2029"
        const startYear = parseInt(yearRange.split('-')[0].trim());
        const endYear = parseInt(yearRange.split('-')[1]?.trim()) || startYear + 2;

        if (!isNaN(startYear)) {
          const dobYear = new Date(birthData.dateOfBirth).getFullYear();
          const pMinAge = startYear - dobYear;
          const pMaxAge = endYear - dobYear;

          // Only update if the calculated age is reasonable (>= 18)
          if (pMinAge >= 18) {
            marriagePotential.expectedMarriageAge = {
              min: pMinAge,
              max: pMaxAge,
              confidence: timingForecast.nextMarriageWindow.confidence || marriagePotential.expectedMarriageAge.confidence
            };
          }
        }
      } catch (e) {
        // Marriage age refinement failed - using default
      }
    }

    // Enrich timing analysis for single person report
    const enrichedTiming = {
      ...timingAnalysis,
      partnerA: {
        name: chart.name || 'You',
        currentDasha: (timingAnalysis as any)?.currentDasha?.mahadasha || 'Unknown',
        favourability: 'neutral' as const,
        analysis: 'Timing analysis for single person report.'
      },
      partnerB: {
        name: 'N/A',
        currentDasha: '',
        favourability: 'neutral' as const,
        analysis: ''
      }
    };

    // Generate detailed spouse profile
    const spouseDetailedProfile = generateDetailedSpouseProfile(chart, spousePrediction);

    // Generate remedies
    const remedies = generateSelfRemedies(chart, doshaAnalysis, marriagePotential);

    // Generate executive summary
    const executiveSummary = generateExecutiveSummary(
      marriagePotential,
      spousePrediction,
      timingForecast,
      doshaAnalysis
    );

    return {
      id: uuidv4(),
      generatedAt: new Date(),
      chart,
      marriagePotential,
      spousePrediction,
      spouseDetailedProfile,
      timing: enrichedTiming,
      timingForecast,
      sexualProfile,
      psychologicalProfile,
      mentalHealth: mentalHealth || undefined,
      addictionRisk: addictionRisk || undefined,
      relationshipPatterns: relationshipPatterns || undefined,
      doshaAnalysis,
      divisionalAnalysis,
      remedies,
      kpAnalysis: kpAnalysis ? {
        partnerA: kpAnalysis,
        partnerB: kpAnalysis, // In self analysis, both partners are the same person
        nameA: chart.name || 'You',
        nameB: chart.name || 'You'
      } : undefined,
      jaiminiAnalysis: {
        charaKarakas: charaKarakas || undefined,
        charaDasha: charaDasha || undefined,
        ul: ul || undefined,
        vivahSaham: vivahSaham || undefined
      } as any,
      sexualHealth: sexualHealth || undefined,
      extendedSexualCompatibility: extendedSexualCompatibility || undefined,
      executiveSummary
    };
  } catch (error) {
    console.error('Error generating self analysis report:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function transformDivisionalAnalysis(extended: ExtendedDivisionalAnalysis, chart: Chart): DivisionalChartAnalysis {
  const d9Chart = chart.vargaCharts?.D9;
  const d9SeventhHouse = d9Chart?.houses.find((h: any) => h.houseNumber === 7);
  const d7Chart = chart.vargaCharts?.D7;

  // Use data from the extended analysis if available
  const d9 = {
    ascendant: extended.d9Full?.ascendant || d9Chart?.ascendant || 'Aries',
    seventhLord: extended.d9Full?.seventhLord || d9SeventhHouse?.lord || 'Mars',
    seventhHouse: {
      sign: extended.d9Full?.seventhHouse.sign || d9SeventhHouse?.sign || 'Libra',
      planets: extended.d9Full?.seventhHouse.planets || d9SeventhHouse?.planets || []
    },
    vargottamaPlanets: extended.d9Full?.vargottamaPlanets || [],
    pushkarNavamsa: extended.d9Full?.pushkarNavamsa || [],
    marriageIndications: extended.d9Full?.marriageIndications || [
      'Evaluation of inner marriage quality based on Navamsa placement.',
      'Analysis of 7th lord of D1 in the D9 chart.'
    ]
  };

  const d7 = {
    childrenIndications: extended.d7Full?.childrenIndications || [
      'Saptamsa analysis for progeny and legacy.',
      'Strength of the 5th lord in D7 chart.'
    ],
    fertility: extended.d7Full?.fertility || 'moderate'
  };

  const d60 = {
    pastLifeKarma: extended.d60Deities?.[0]?.interpretation || 'Karmic influences from past lives affecting present relationships.',
    marriageDestiny: 'Calculated from Shashtiamsa strength.'
  };

  // Construct a comprehensive overall summary
  const overall = (extended as any).overallSynthesis ||
    `Comprehensive divisional analysis shows ${d9.vargottamaPlanets.length > 0 ? d9.vargottamaPlanets.join(', ') + ' are vargottama, providing great strength.' : 'the inner marriage potential.'} ` +
    `The D9 Navamsa indicates a ${d9.ascendant} ascendant, influencing the inner relationship core.`;

  return {
    d9,
    d7,
    d60,
    overall,
    extended: {
      partnerA: extended,
      partnerB: extended
    }
  };
}

/**
 * Calculate marriage potential score and assessment
 */
function calculateMarriagePotential(chart: Chart): MarriagePotential {
  const seventhHouse = chart.houses.find((h: House) => h.houseNumber === 7);
  const seventhLord = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === seventhHouse?.lord);

  // Calculate 7th house strength
  let seventhHouseStrength = 50;
  if (seventhHouse) {
    // Benefic planets in 7th house increase strength
    const benefics = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
    const malefics = ['Saturn', 'Mars', 'Rahu', 'Ketu'];

    seventhHouse.planets.forEach((planet: string) => {
      if (benefics.includes(planet)) seventhHouseStrength += 10;
      if (malefics.includes(planet)) seventhHouseStrength -= 10;
    });

    // Lord's dignity affects strength
    if (seventhLord) {
      switch (seventhLord.dignity) {
        case 'exalted': seventhHouseStrength += 20; break;
        case 'moolatrikona': seventhHouseStrength += 15; break;
        case 'own_house': seventhHouseStrength += 10; break;
        case 'friendly': seventhHouseStrength += 5; break;
        case 'enemy': seventhHouseStrength -= 5; break;
        case 'debilitated': seventhHouseStrength -= 15; break;
      }
    }
  }

  seventhHouseStrength = Math.max(0, Math.min(100, seventhHouseStrength));

  // Calculate Navamsa quality (D9 chart)
  const d9Chart = chart.vargaCharts?.D9;
  let navamsaQuality = 50;

  if (d9Chart) {
    const d9SeventhHouse = d9Chart.houses?.find((h: House) => h.houseNumber === 7);
    if (d9SeventhHouse) {
      // Check if 7th lord of D1 is well placed in D9
      const d9Planets = d9SeventhHouse.planets || [];
      if (d9Planets.length > 0) {
        navamsaQuality += 10;
      }

      // Vargottama planets (same sign in D1 and D9) are strong
      const vargottamaPlanets = chart.planetaryPositions.filter((p: PlanetaryPosition) => {
        const d9Planet = d9Chart.planetaryPositions?.find((dp: PlanetaryPosition) => dp.planet === p.planet);
        return d9Planet && d9Planet.sign === p.sign;
      });

      navamsaQuality += vargottamaPlanets.length * 5;
    }
  }

  navamsaQuality = Math.max(0, Math.min(100, navamsaQuality));

  // Calculate Dasha support
  const currentDasha = getCurrentDashaFromChart(chart);
  let dashaSupport = 50;

  if (currentDasha) {
    // Benefic dasha lords support marriage
    const beneficDashaPlanets = ['Jupiter', 'Venus', 'Mercury'];
    if (beneficDashaPlanets.includes(currentDasha.planet)) {
      dashaSupport += 20;
    }

    // 7th lord dasha is very good for marriage
    if (currentDasha.planet === seventhHouse?.lord) {
      dashaSupport += 25;
    }

    // Saturn dasha can delay
    if (currentDasha.planet === 'Saturn') {
      dashaSupport -= 10;
    }
  }

  dashaSupport = Math.max(0, Math.min(100, dashaSupport));

  // Calculate raw weighted score
  const rawScore = (seventhHouseStrength * 0.4) +
    (navamsaQuality * 0.3) +
    (dashaSupport * 0.3);

  // Apply curve to boost numbers (Square root curve)
  // This makes 50 -> 70, 65 -> 80, etc. to align better with user expectations
  const overallScore = Math.round(Math.sqrt(rawScore) * 10);

  // Determine verdict with updated thresholds
  let verdict: MarriagePotential['verdict'];
  let trafficLightStatus: MarriagePotential['trafficLightStatus'];

  if (overallScore >= 85) {
    verdict = 'excellent';
    trafficLightStatus = 'green';
  } else if (overallScore >= 75) {
    verdict = 'very_good';
    trafficLightStatus = 'green';
  } else if (overallScore >= 65) {
    verdict = 'good';
    trafficLightStatus = 'green';
  } else if (overallScore >= 50) {
    verdict = 'fair';
    trafficLightStatus = 'yellow';
  } else if (overallScore >= 35) {
    verdict = 'challenging';
    trafficLightStatus = 'yellow';
  } else {
    verdict = 'poor';
    trafficLightStatus = 'red';
  }

  // Calculate expected marriage age
  const currentAge = calculateCurrentAge(chart.dateOfBirth);
  const delayIndicators = identifyDelayIndicators(chart);

  let expectedMinAge = Math.max(21, currentAge + 2);
  let expectedMaxAge = Math.max(24, currentAge + 5);

  if (delayIndicators.length > 0) {
    expectedMinAge += 2;
    expectedMaxAge += 3;
  }

  // Refined Logic based on Minimum Marriageable Age
  // If current age < 21, project into realistic future (24-28)
  if (currentAge < 20) {
    expectedMinAge = 24
    expectedMaxAge = 28
  }

  // Number of marriages
  const rahuKetuIn7th = chart.planetaryPositions.filter(
    (p: PlanetaryPosition) => (p.planet === 'Rahu' || p.planet === 'Ketu') && p.house === 7
  );

  const numberOfMarriages: MarriagePotential['numberOfMarriages'] =
    rahuKetuIn7th.length > 0 ? 'multiple' : 'single';

  // Marriage quality
  const marriageQuality: MarriagePotential['marriageQuality'] =
    overallScore >= 60 ? 'high' : overallScore >= 40 ? 'medium' : 'low';

  // Strengths and challenges
  const strengths: string[] = [];
  const challenges: string[] = [];

  if (seventhHouseStrength >= 70) strengths.push('Strong 7th house indicates stable marriage');
  if (navamsaQuality >= 70) strengths.push('Excellent Navamsa chart support');
  if (dashaSupport >= 70) strengths.push('Favorable dasha periods ahead');
  if (!isManglik(chart)) strengths.push('No Manglik dosha');

  if (seventhHouseStrength < 40) challenges.push('7th house needs strengthening');
  if (delayIndicators.length > 0) challenges.push('Some delay indicators present');
  if (isManglik(chart)) challenges.push('Manglik dosha present - remedies recommended');

  return {
    score: overallScore,
    verdict,
    trafficLightStatus,
    seventhHouseStrength,
    navamsaQuality,
    dashaSupport,
    expectedMarriageAge: {
      min: expectedMinAge,
      max: expectedMaxAge,
      confidence: overallScore
    },
    numberOfMarriages,
    marriageQuality,
    strengths,
    challenges,
    delayIndicators
  };
}

/**
 * Generate detailed spouse profile
 */
function generateDetailedSpouseProfile(
  chart: Chart,
  basicPrediction: any
): SpouseDetailedProfile {
  const seventhHouse = chart.houses.find((h: House) => h.houseNumber === 7);
  const seventhLord = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === seventhHouse?.lord);
  const darakaraka = chart.specialPoints?.darakaraka;

  // Physical appearance based on already calculated physique data
  const physicalAppearance: SpouseDetailedProfile['physicalAppearance'] = {
    height: basicPrediction.physique?.height || 'average',
    build: basicPrediction.physique?.build || 'average',
    complexion: basicPrediction.physique?.complexion || 'fair',
    distinguishingFeatures: basicPrediction.physique?.notableFeatures || [],
    styleOfDressing: 'modern and professional',
    firstImpression: 'confident and approachable'
  };

  // Career prediction
  const career: SpouseDetailedProfile['career'] = {
    field: 'Professional sector',
    archetype: 'Working Professional',
    incomeLevel: 'medium',
    workPersonality: 'Dedicated and hardworking',
    ambitionLevel: 'medium'
  };

  if (seventhLord) {
    switch (seventhLord.planet) {
      case 'Sun':
        career.field = 'Government, Administration, or Leadership';
        career.archetype = 'Leader or Authority Figure';
        career.incomeLevel = 'high';
        career.workPersonality = 'Authoritative and commanding';
        career.ambitionLevel = 'high';
        break;
      case 'Moon':
        career.field = 'Healthcare, Hospitality, or Public Relations';
        career.archetype = 'Caregiver or Nurturer';
        career.incomeLevel = 'medium';
        career.workPersonality = 'Empathetic and caring';
        career.ambitionLevel = 'medium';
        break;
      case 'Mars':
        career.field = 'Engineering, Military, Sports, or Real Estate';
        career.archetype = 'Warrior or Builder';
        career.incomeLevel = 'high';
        career.workPersonality = 'Energetic and competitive';
        career.ambitionLevel = 'high';
        break;
      case 'Mercury':
        career.field = 'IT, Communication, Writing, or Commerce';
        career.archetype = 'Intellectual or Communicator';
        career.incomeLevel = 'medium';
        career.workPersonality = 'Intellectual and adaptable';
        career.ambitionLevel = 'medium';
        break;
      case 'Jupiter':
        career.field = 'Teaching, Law, Finance, or Spirituality';
        career.archetype = 'Teacher or Guide';
        career.incomeLevel = 'high';
        career.workPersonality = 'Wise and ethical';
        career.ambitionLevel = 'high';
        break;
      case 'Venus':
        career.field = 'Arts, Fashion, Beauty, or Design';
        career.archetype = 'Artist or Creator';
        career.incomeLevel = 'medium';
        career.workPersonality = 'Creative and aesthetic';
        career.ambitionLevel = 'medium';
        break;
      case 'Saturn':
        career.field = 'Engineering, Manufacturing, or Traditional Business';
        career.archetype = 'Builder or Administrator';
        career.incomeLevel = 'high';
        career.workPersonality = 'Disciplined and persistent';
        career.ambitionLevel = 'high';
        break;
    }
  }

  // Personality traits
  const personality: SpouseDetailedProfile['personality'] = {
    keyTraits: ['Caring', 'Supportive', 'Understanding'],
    communicationStyle: 'Open and honest communication',
    emotionalNature: 'Balanced and stable emotions',
    valuesAndPriorities: ['Family', 'Stability', 'Growth']
  };

  if (seventhLord) {
    switch (seventhLord.planet) {
      case 'Sun':
        personality.keyTraits = ['Confident', 'Leadership', 'Generous', 'Proud', 'Warm-hearted'];
        personality.communicationStyle = 'Direct and authoritative';
        personality.emotionalNature = 'Strong-willed with high self-respect';
        break;
      case 'Moon':
        personality.keyTraits = ['Caring', 'Nurturing', 'Emotional', 'Intuitive', 'Adaptable'];
        personality.communicationStyle = 'Gentle and empathetic';
        personality.emotionalNature = 'Deeply emotional and sensitive';
        break;
      case 'Mars':
        personality.keyTraits = ['Energetic', 'Passionate', 'Courageous', 'Independent', 'Assertive'];
        personality.communicationStyle = 'Direct and sometimes blunt';
        personality.emotionalNature = 'Intense and passionate';
        break;
      case 'Mercury':
        personality.keyTraits = ['Intelligent', 'Witty', 'Communicative', 'Adaptable', 'Youthful'];
        personality.communicationStyle = 'Articulate and engaging';
        personality.emotionalNature = 'Mental rather than emotional';
        break;
      case 'Jupiter':
        personality.keyTraits = ['Wise', 'Generous', 'Spiritual', 'Optimistic', 'Ethical'];
        personality.communicationStyle = 'Thoughtful and philosophical';
        personality.emotionalNature = 'Balanced and forgiving';
        break;
      case 'Venus':
        personality.keyTraits = ['Romantic', 'Charming', 'Artistic', 'Diplomatic', 'Loving'];
        personality.communicationStyle = 'Diplomatic and pleasing';
        personality.emotionalNature = 'Romantic and affectionate';
        break;
      case 'Saturn':
        personality.keyTraits = ['Responsible', 'Mature', 'Loyal', 'Practical', 'Serious'];
        personality.communicationStyle = 'Reserved but meaningful';
        personality.emotionalNature = 'Stable but reserved';
        break;
    }
  }

  // Meeting circumstances
  const upapadaLagna = chart.specialPoints?.upapadaLagna;
  const meetingCircumstances: SpouseDetailedProfile['meetingCircumstances'] = {
    how: 'Through mutual connections or social events',
    direction: 'east',
    location: 'Within your country',
    timingClues: 'During a favorable dasha period',
    firstInteractionVibe: 'Comfortable and natural connection'
  };

  // Determine direction from Upapada Lagna
  if (upapadaLagna) {
    const eastSigns = ['Aries', 'Leo', 'Sagittarius'];
    const southSigns = ['Taurus', 'Virgo', 'Capricorn'];
    const westSigns = ['Gemini', 'Libra', 'Aquarius'];
    const northSigns = ['Cancer', 'Scorpio', 'Pisces'];

    if (eastSigns.includes(upapadaLagna)) meetingCircumstances.direction = 'east';
    else if (southSigns.includes(upapadaLagna)) meetingCircumstances.direction = 'south';
    else if (westSigns.includes(upapadaLagna)) meetingCircumstances.direction = 'west';
    else meetingCircumstances.direction = 'north';
  }

  // Meeting circumstances based on planets
  if (seventhHouse?.planets.includes('Jupiter')) {
    meetingCircumstances.how = 'Through educational or religious/spiritual settings';
  } else if (seventhHouse?.planets.includes('Venus')) {
    meetingCircumstances.how = 'Through social gatherings, arts, or entertainment';
  } else if (seventhHouse?.planets.includes('Mars')) {
    meetingCircumstances.how = 'Through sports, gym, or competitive environments';
  } else if (seventhHouse?.planets.includes('Mercury')) {
    meetingCircumstances.how = 'Through work, communication, or online';
  }

  // Relationship dynamic
  const relationshipDynamic: SpouseDetailedProfile['relationshipDynamic'] = {
    whoPursues: 'mutual',
    courtshipStyle: 'Gradual development of relationship',
    theirExpectations: ['Loyalty', 'Respect', 'Emotional connection'],
    whatAttractsThem: ['Your authenticity', 'Stability', 'Sense of humor']
  };

  if (seventhLord?.planet === 'Mars' || seventhLord?.planet === 'Sun') {
    relationshipDynamic.whoPursues = 'them';
    relationshipDynamic.courtshipStyle = 'Passionate and direct pursuit';
  } else if (seventhLord?.planet === 'Venus' || seventhLord?.planet === 'Moon') {
    relationshipDynamic.whoPursues = 'mutual';
    relationshipDynamic.courtshipStyle = 'Romantic and emotional connection';
  }

  return {
    physicalAppearance,
    career,
    personality,
    meetingCircumstances,
    relationshipDynamic
  };
}


/**
 * Jaimini Rashi Drishti (Sign Aspects)
 * Movable aspects Fixed (except adjacent)
 * Fixed aspects Movable (except adjacent)
 * Dual aspects Dual
 */
function isSignAspecting(signA: Sign, signB: Sign): boolean {
  const signs: Sign[] = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const idxA = signs.indexOf(signA);
  const idxB = signs.indexOf(signB);

  if (idxA === -1 || idxB === -1) return false;

  const typeA = idxA % 3; // 0: Movable, 1: Fixed, 2: Dual
  const typeB = idxB % 3;

  if (typeA === 2) return typeB === 2 && idxA !== idxB; // Dual aspects other Dual signs

  if (typeA === 0) { // Movable aspects Fixed
    if (typeB !== 1) return false;
    // Except adjacent (right neighbor for Movable in this counting)
    // Rule: Movable aspects Fixed EXCEPT adjacent.
    // Aries (0) aspects Le (4), Sc (7), Aq (10). Taurus (1) is adjacent.
    const adjacentIdx = (idxA + 1) % 12;
    return idxB !== adjacentIdx;
  }

  if (typeA === 1) { // Fixed aspects Movable
    if (typeB !== 0) return false;
    // Except adjacent (left neighbor for Fixed)
    // Rule: Fixed aspects Movable EXCEPT adjacent.
    // Taurus (1) aspects Cn (3), Li (6), Cp (9). Aries (0) is adjacent.
    const adjacentIdx = (idxA - 1 + 12) % 12;
    return idxB !== adjacentIdx;
  }

  return false;
}

/**
 * Generate timing forecast
 */
function generateTimingForecast(
  chart: Chart,
  timingAnalysis: any,
  charaDasha?: any,
  upapadaLagna?: any,
  vivahSaham?: any,
  transitAnalysis?: any
): TimingForecast & { extended?: ExtendedTimingAnalysis } {
  const currentDasha = getCurrentDashaFromChart(chart);
  const currentAge = calculateCurrentAge(chart.dateOfBirth);

  // 1. Initialize Fallback Data
  const nextFavorableYears = calculateNextFavorableYears(chart, 3);
  let yearRange = nextFavorableYears.length > 0
    ? `${nextFavorableYears[0]}-${nextFavorableYears[nextFavorableYears.length - 1]}`
    : `${currentAge + 2}-${currentAge + 5}`;
  let confidence = 65;

  let favorablePeriods: FavorablePeriod[] = nextFavorableYears.map((year, index) => ({
    period: `Period ${index + 1}`,
    dates: `${year} (Full Year)`,
    dashaPeriod: currentDasha?.planet || 'Unknown',
    transitInfo: 'Jupiter favorable transit',
    confidence: 70 + (index * 5)
  }));

  // Determine current phase (Default)
  let currentPhase: TimingForecast['currentPhase'] = {
    name: 'Preparation Phase',
    description: 'Focus on personal readiness and clarifying your relationship goals.',
    preparationNeeded: true
  };

  const now = new Date();
  const sixMonthsFromNow = new Date(now);
  sixMonthsFromNow.setMonth(now.getMonth() + 6);
  const oneYearFromNow = new Date(now);
  oneYearFromNow.setFullYear(now.getFullYear() + 1);

  // 2. High Priority Override: Use actual timing analysis
  if (timingAnalysis?.favorablePeriods?.length > 0) {
    // A. Update Phase based on the earliest window
    const sortedByDate = [...timingAnalysis.favorablePeriods].sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    const firstWindowDate = new Date(sortedByDate[0].startDate);

    if (firstWindowDate <= sixMonthsFromNow) {
      currentPhase = {
        name: 'High Intensity Window',
        description: 'The celestial alignments are currently at their most supportive. Take proactive steps.',
        preparationNeeded: false
      };
    } else if (firstWindowDate <= oneYearFromNow) {
      currentPhase = {
        name: 'Approaching Favoured Period',
        description: 'A positive window is opening soon. This is the time for final preparations.',
        preparationNeeded: false
      };
    }

    // B. Update Favorable Periods (Display first 4 chronological windows)
    // We strictly sort by date to ensure the user sees the timeline from "Now" onwards
    const topWindows = [...timingAnalysis.favorablePeriods]
      .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 4);

    favorablePeriods = topWindows.map((p: any, index: number) => ({
      period: `Window ${index + 1}`,
      dates: `${new Date(p.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - ${new Date(p.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`,
      dashaPeriod: p.description?.split(':')[0] || currentDasha?.planet || 'Unknown',
      transitInfo: 'Favorable Planetary Alignment',
      confidence: p.confidence
    }));

    // C. Update Year Range & Confidence
    const firstWindow = topWindows[0];
    const lastWindow = topWindows[topWindows.length - 1];
    if (firstWindow && lastWindow) {
      yearRange = `${new Date(firstWindow.startDate).getFullYear()} - ${new Date(lastWindow.endDate).getFullYear()}`;
      confidence = firstWindow.confidence;
    }

  } else if (currentDasha) {
    // Fallback Phase Logic if no windows found but Dasha exists
    const delayPlanets = ['Saturn', 'Rahu'];
    if (delayPlanets.includes(currentDasha.planet)) {
      currentPhase = {
        name: 'Building & Growth Phase',
        description: 'Focus on internal stability. A period of maturing before meaningful union.',
        preparationNeeded: true
      };
    }
  }

  // 3. Generate Cautionary Periods
  const cautionaryPeriods: CautionaryPeriod[] = [];
  if (currentDasha?.planet === 'Saturn') {
    cautionaryPeriods.push({
      period: 'Current Period',
      dates: 'Until Saturn dasha ends',
      reason: 'Saturn dasha may delay marriage decisions',
      advice: 'Focus on career and personal growth. Don\'t rush.'
    });
  }

  // 4. Check for Delays
  const delayIndicators = identifyDelayIndicators(chart);
  const delayAnalysis = delayIndicators.length > 0 ? {
    hasDelays: true,
    cause: delayIndicators[0],
    remedies: [
      'Strengthen 7th house through remedies',
      'Perform Saturn pacification if applicable',
      'Regular worship of marriage deities'
    ]
  } : undefined;

  return {
    currentPhase,
    nextMarriageWindow: {
      yearRange,
      favorableMonths: ['February-March', 'June-July', 'November-December'],
      confidence
    },
    keyMilestones: {
      whenYouMeet: `Within ${yearRange}`,
      whenYouDecide: '6-12 months after meeting',
      weddingWindow: 'Favorable months in the same year'
    },
    delayAnalysis,
    favorablePeriods,
    cautionaryPeriods,
    extended: {
      charaDasha: charaDasha || {
        currentPeriod: { sign: 'Aries', lord: 'Mars', durationYears: 7, direction: 'direct' },
        allPeriods: []
      },
      upapadaLagna: upapadaLagna || {
        sign: 'Libra',
        planets: [],
        timing: 'General timing analysis'
      },
      vivahSaham: vivahSaham || {
        longitude: 0,
        sign: 'Aries',
        degree: 0,
        interpretation: 'General interpretation',
        activationPeriods: []
      },
      transitAnalysis: transitAnalysis || {
        jupiterTransits: [],
        saturnTransits: [],
      },
      destinySync: favorablePeriods.map(p => {
        // Parse year from Period string (e.g. "2026 (Full Year)" or "Jan 2026 - Dec 2026")
        const yearStr = p.dates.match(/\d{4}/)?.[0] || String(new Date().getFullYear());
        const year = parseInt(yearStr);

        // 1. Chara Dasha Check
        // Use marriageTiming.favorableSigns (which now includes multiple signs)
        let charaDashaActive = false;
        if (charaDasha && charaDasha.allPeriods) {
          const activePeriod = charaDasha.allPeriods.find((ap: any) =>
            year >= new Date(ap.startDate).getFullYear() &&
            year <= new Date(ap.endDate).getFullYear()
          );
          if (activePeriod && charaDasha.marriageTiming?.favorableSigns) {
            // Check if active period sign is favorable OR aspects a favorable sign
            charaDashaActive = charaDasha.marriageTiming.favorableSigns.some((favSign: Sign) =>
              activePeriod.sign === favSign || isSignAspecting(activePeriod.sign, favSign)
            );
          }
        }

        // 2. Vivah Saham Check
        let vivahSahamActive = false;
        if (vivahSaham) {
          const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
          const vsSignIndex = signs.indexOf(vivahSaham.sign);
          const vsSeventhSign = signs[(vsSignIndex + 6) % 12];
          const vsFifthSign = signs[(vsSignIndex + 4) % 12];
          const vsNinthSign = signs[(vsSignIndex + 8) % 12];

          const relevantSigns = [vivahSaham.sign, vsSeventhSign, vsFifthSign, vsNinthSign];

          // Check real transit data if available
          if (transitAnalysis?.jupiterTransits?.length > 0) {
            const relevantTransit = transitAnalysis.jupiterTransits.find((t: any) =>
              relevantSigns.includes(t.toSign)
            );
            if (relevantTransit) {
              const transitYear = new Date(relevantTransit.date).getFullYear();
              if (Math.abs(transitYear - year) <= 1) vivahSahamActive = true;
            }
          }

          // Fallback check
          if (!vivahSahamActive) {
            const jupiterSign = year === 2024 ? 'Taurus' : year === 2025 ? 'Gemini' : year === 2026 ? 'Cancer' : year === 2027 ? 'Leo' : 'Virgo';
            if (relevantSigns.includes(jupiterSign)) {
              vivahSahamActive = true;
            }
          }
        }

        // 3. Determine Destiny Window
        // Limit to "Excellent" periods (confidence > 80) + at least one other system support
        const isDestinyWindow = p.confidence >= 75 && (charaDashaActive || vivahSahamActive);

        // Boost confidence further if 3-way match
        if (charaDashaActive && vivahSahamActive) {
          p.confidence = Math.min(98, p.confidence + 10);
          p.transitInfo = "✨ GRAND DESTINY ALIGNMENT";
        } else if (isDestinyWindow) {
          p.confidence = Math.min(95, p.confidence + 5);
          p.transitInfo = "Multi-System Convergence";
        }

        return {
          startDate: year.toString(),
          endDate: (year + 1).toString(),
          periodName: p.period,
          vimshottariConfidence: p.confidence,
          charaDashaActive,
          vivahSahamActive,
          isDestinyWindow,
          description: isDestinyWindow
            ? "Highly significant period where Vimshottari Dasha aligns with " + (charaDashaActive && vivahSahamActive ? "both Chara Dasha and Vivah Saham." : charaDashaActive ? "Chara Dasha." : "Vivah Saham.")
            : "Standard favorable period based on Dasha."
        } as DestinySyncItem;
      })
    }
  };
}

function getSeventhSign(sign: any): any {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const index = signs.indexOf(sign);
  if (index === -1) return sign; // Fallback
  return signs[(index + 6) % 12];
}

/**
 * Calculate sexual profile
 */
function calculateSexualProfile(chart: Chart): SelfSexualProfile {
  const mars = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Mars');
  const venus = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Venus');
  const moon = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Moon');
  const eighthHouse = chart.houses.find((h: House) => h.houseNumber === 8);

  // Get nakshatra for yoni type
  const moonNakshatra = moon?.nakshatra || 'Ashwini';
  const yoniInfo = getYoniInfo(moonNakshatra);

  // Libido analysis based on Mars
  let libidoScore = 50;
  let libidoLevel: SelfSexualProfile['libido']['level'] = 'moderate';

  if (mars) {
    // Mars in fire signs = high libido
    const fireSigns = ['Aries', 'Leo', 'Sagittarius'];
    if (fireSigns.includes(mars.sign)) {
      libidoScore += 25;
    }

    // Mars in water signs = emotional
    const waterSigns = ['Cancer', 'Scorpio', 'Pisces'];
    if (waterSigns.includes(mars.sign)) {
      libidoScore += 15;
    }

    // Mars strength
    if (mars.dignity === 'exalted' || mars.dignity === 'moolatrikona') {
      libidoScore += 15;
    } else if (mars.dignity === 'debilitated') {
      libidoScore -= 20;
    }

    // Mars house placement
    if (mars.house === 1 || mars.house === 5 || mars.house === 8 || mars.house === 12) {
      libidoScore += 10;
    }
  }

  libidoScore = Math.max(0, Math.min(100, libidoScore));

  if (libidoScore >= 70) libidoLevel = 'high';
  else if (libidoScore >= 40) libidoLevel = 'moderate';
  else libidoLevel = 'low';

  // Romantic style
  let romanticStyle = 'Balanced';
  if (venus) {
    if (['Aries', 'Leo', 'Sagittarius'].includes(venus.sign)) {
      romanticStyle = 'Passionate';
    } else if (['Taurus', 'Cancer', 'Pisces'].includes(venus.sign)) {
      romanticStyle = 'Gentle and nurturing';
    } else if (['Gemini', 'Libra', 'Aquarius'].includes(venus.sign)) {
      romanticStyle = 'Intellectual and communicative';
    }
  }

  // Potential issues
  const potentialIssues: string[] = [];
  if (mars?.dignity === 'debilitated') {
    potentialIssues.push('May experience low energy or vitality');
  }
  if (eighthHouse?.planets.includes('Saturn')) {
    potentialIssues.push('Saturn in 8th house - take care of sexual health');
  }

  // Best match yoni
  const bestMatchYoni = getCompatibleYonis(yoniInfo.animal);

  return {
    yoniType: {
      animal: yoniInfo.animal,
      characteristics: yoniInfo.characteristics,
      nature: yoniInfo.nature
    },
    nakshatraInfluence: {
      name: moonNakshatra,
      sexualNature: yoniInfo.nature,
      tendencies: yoniInfo.tendencies
    },
    libido: {
      score: libidoScore,
      level: libidoLevel,
      description: getLibidoDescription(libidoLevel)
    },
    romanticStyle,
    marsAnalysis: {
      house: mars?.house || 1,
      strength: mars?.dignity === 'exalted' || mars?.dignity === 'own_house' ? 'strong' : 'moderate',
      influence: getMarsInfluenceDescription(mars)
    },
    venusAnalysis: {
      sign: venus?.sign || 'Libra',
      dignity: venus?.dignity || 'neutral',
      influence: getVenusInfluenceDescription(venus)
    },
    emotionalNeeds: {
      primaryNeed: moon ? getEmotionalNeedFromMoon(moon.sign) : 'Emotional security',
      description: 'You need deep emotional connection for fulfilling intimacy'
    },
    potentialIssues,
    bestMatchYoni,
    sexualHealth: {
      vitality: libidoLevel,
      risks: potentialIssues,
      strengths: libidoLevel === 'high' ? ['High vitality', 'Passionate nature'] : ['Stable energy', 'Endurance'],
      balancingTips: [
        'Maintain regular exercise routine',
        'Practice stress management',
        'Follow a balanced diet suitable for your dosha'
      ]
    }
  };
}

/**
 * Calculate psychological profile
 */
export function calculatePsychologicalProfile(chart: Chart): PsychologicalProfile {
  const moon = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Moon');
  const sun = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Sun');
  const mercury = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Mercury');
  const venus = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Venus');
  const rahu = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Rahu');
  const ketu = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Ketu');
  const fourthHouse = chart.houses.find((h: House) => h.houseNumber === 4);
  const fifthHouse = chart.houses.find((h: House) => h.houseNumber === 5);

  // Attachment style from Moon
  let attachmentType: PsychologicalProfile['attachmentStyle']['type'] = 'secure';
  let attachmentDescription = 'You generally feel secure in relationships';

  if (moon) {
    if (['Cancer', 'Scorpio', 'Pisces'].includes(moon.sign)) {
      if (moon.dignity === 'debilitated' || fourthHouse?.planets.includes('Saturn')) {
        attachmentType = 'anxious';
        attachmentDescription = 'You may worry about abandonment and seek constant reassurance';
      } else {
        attachmentType = 'secure';
        attachmentDescription = 'Deeply emotional but generally secure in attachments';
      }
    } else if (['Aquarius', 'Capricorn'].includes(moon.sign)) {
      attachmentType = 'avoidant';
      attachmentDescription = 'You value independence and may keep emotional distance';
    }
  }

  // Communication style from Mercury
  let communicationStyle = 'Balanced communicator';
  if (mercury) {
    if (['Gemini', 'Virgo'].includes(mercury.sign)) {
      communicationStyle = 'Articulate and analytical';
    } else if (['Cancer', 'Pisces'].includes(mercury.sign)) {
      communicationStyle = 'Intuitive and emotional';
    } else if (['Aries', 'Leo'].includes(mercury.sign)) {
      communicationStyle = 'Direct and assertive';
    }
  }

  // Love language from Venus
  let loveLanguage = {
    primary: 'Quality Time',
    secondary: 'Words of Affirmation'
  };

  if (venus) {
    switch (venus.sign) {
      case 'Taurus':
      case 'Libra':
        loveLanguage = { primary: 'Physical Touch', secondary: 'Quality Time' };
        break;
      case 'Gemini':
      case 'Virgo':
        loveLanguage = { primary: 'Words of Affirmation', secondary: 'Acts of Service' };
        break;
      case 'Cancer':
        loveLanguage = { primary: 'Acts of Service', secondary: 'Quality Time' };
        break;
      case 'Leo':
        loveLanguage = { primary: 'Words of Affirmation', secondary: 'Gifts' };
        break;
    }
  }

  return {
    attachmentStyle: {
      type: attachmentType,
      description: attachmentDescription,
      moonSign: moon?.sign || 'Cancer',
      fourthHouseAnalysis: getFourthHouseAnalysis(fourthHouse)
    },
    communicationStyle: {
      style: communicationStyle,
      mercuryPlacement: mercury ? `${mercury.planet} in ${mercury.sign}` : 'Unknown',
      expressionMethod: getExpressionMethod(mercury),
      conflictResolution: getConflictResolutionStyle(mercury, moon),
      triggers: getCommunicationTriggers(mercury, moon)
    },
    loveLanguage: {
      primary: loveLanguage.primary,
      secondary: loveLanguage.secondary,
      venusSign: venus?.sign || 'Libra',
      description: `You primarily feel loved through ${loveLanguage.primary.toLowerCase()}`
    },
    coreFears: {
      primaryFear: getCoreFear(rahu, moon),
      rahuInfluence: rahu ? `Rahu in ${rahu.sign} creates obsessions around ${getRahuObsession(rahu)}` : 'Minimal',
      howItManifests: getFearManifestation(rahu, moon)
    },
    defenseMechanisms: {
      mechanism: getDefenseMechanism(ketu),
      ketuInfluence: ketu ? `Ketu in ${ketu.sign} creates detachment` : 'Minimal',
      impactOnRelationships: getKetuImpact(ketu)
    },
    repeatingPatterns: {
      pattern: getRepeatingPattern(fifthHouse, venus),
      fifthHouseInfluence: getFifthHouseInfluence(fifthHouse),
      venusCycles: getVenusCycleInfluence(venus),
      howToBreakIt: 'Practice self-awareness and conscious relationship choices'
    },
    mentalLandscape: {
      coreFear: getCoreFear(rahu, moon),
      defenseMechanism: getDefenseMechanism(ketu),
      blindSpot: getBlindSpot(venus, mercury),
      growthArea: getGrowthArea(moon, sun)
    }
  };
}

/**
 * Generate self remedies
 */
function generateSelfRemedies(
  chart: Chart,
  doshaAnalysis: any,
  marriagePotential: MarriagePotential
): SelfRemedies {
  const seventhHouse = chart.houses.find((h: House) => h.houseNumber === 7);
  const seventhLord = seventhHouse?.lord || 'Venus';
  const venus = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Venus');

  // Prioritized actions
  const prioritizedActions: SelfRemedies['prioritizedActions'] = [];

  // Action 1: Strengthen 7th house
  prioritizedActions.push({
    rank: 1,
    title: 'Strengthen Your 7th House',
    description: 'Perform remedies to strengthen the planet ruling your 7th house',
    astrologicalReason: `${seventhLord} rules your 7th house of marriage and needs support`,
    whenToStart: 'Friday or the day of your 7th lord',
    duration: 'Continuous practice',
    howToDoIt: `Chant ${seventhLord} mantra daily. Wear ${getGemstoneForPlanet(seventhLord)} if advised.`
  });

  // Action 2: Venus remedies for relationships
  prioritizedActions.push({
    rank: 2,
    title: 'Enhance Venus Energy',
    description: 'Strengthen Venus for better relationship harmony',
    astrologicalReason: 'Venus governs love, relationships, and marriage happiness',
    whenToStart: 'Friday (Venus day)',
    duration: 'Minimum 43 days',
    howToDoIt: 'Wear white clothes on Fridays, offer white flowers to Goddess Lakshmi, chant Venus mantra'
  });

  // Action 3: Based on doshas
  if (doshaAnalysis?.overallSeverity === 'high') {
    prioritizedActions.push({
      rank: 3,
      title: 'Address Present Doshas',
      description: 'Perform specific remedies for identified doshas',
      astrologicalReason: 'Clearing doshas removes obstacles to marriage',
      whenToStart: 'As soon as possible',
      duration: 'Until marriage',
      howToDoIt: 'Consult the remedies section for specific dosha remedies'
    });
  } else {
    prioritizedActions.push({
      rank: 3,
      title: 'Maintain Positive Energy',
      description: 'Continue spiritual practices to maintain favorable conditions',
      astrologicalReason: 'Prevention is better than cure',
      whenToStart: 'Ongoing',
      duration: 'Continuous',
      howToDoIt: 'Regular meditation, gratitude practice, and positive affirmations'
    });
  }

  // Gemstone recommendation
  const gemstone: SelfRemedies['gemstone'] = {
    stone: getGemstoneForPlanet(seventhLord),
    metal: getMetalForPlanet(seventhLord),
    finger: getFingerForPlanet(seventhLord),
    hand: ['Ruby', 'Pearl', 'Red Coral'].includes(getGemstoneForPlanet(seventhLord)) ? 'right' : 'left',
    day: getDayForPlanet(seventhLord),
    mantra: getMantraForPlanet(seventhLord),
    wearingProcedure: `Cleanse the stone in Ganga water or raw milk on ${getDayForPlanet(seventhLord)}. Chant the mantra 108 times before wearing.`
  };

  // Mantras
  const mantras: SelfRemedies['mantras'] = {
    primary: {
      mantra: getPrimaryMarriageMantra(),
      meaning: 'This mantra invokes blessings for a happy and timely marriage',
      count: 108,
      bestTime: 'Early morning after bath',
      duration: 'Minimum 40 days, preferably until marriage'
    },
    supporting: [
      getMantraForPlanet('Venus'),
      getMantraForPlanet(seventhLord),
      'Om Namah Shivaya (for overall relationship harmony)'
    ]
  };

  // Lifestyle recommendations
  const lifestyle: SelfRemedies['lifestyle'] = {
    dos: [
      'Maintain personal hygiene and dress well',
      'Practice kindness and respect towards elders',
      'Keep your living space clean and organized',
      'Engage in spiritual practices regularly',
      'Be open to meeting new people'
    ],
    donts: [
      'Avoid harsh speech and arguments',
      'Don\'t be overly critical of potential partners',
      'Avoid wearing black on Tuesdays and Saturdays if Manglik',
      'Don\'t delay marriage without valid reasons'
    ],
    dailyRoutine: [
      'Wake up early (Brahma muhurta if possible)',
      'Meditate for 10-15 minutes',
      'Chant marriage mantra 108 times',
      'Practice gratitude',
      'Read or listen to positive content'
    ]
  };

  // Donations
  const donations: SelfRemedies['donations'] = [
    {
      item: 'White clothes or items',
      day: 'Friday',
      toWhom: 'Young girls or women in need',
      benefits: 'Strengthens Venus, brings relationship harmony'
    },
    {
      item: 'Food items',
      day: 'Thursday',
      toWhom: 'Brahmins or religious people',
      benefits: 'Strengthens Jupiter, brings wisdom and growth'
    }
  ];

  return {
    prioritizedActions,
    gemstone,
    mantras,
    lifestyle,
    donations
  };
}

/**
 * Generate executive summary
 */
function generateExecutiveSummary(
  marriagePotential: MarriagePotential,
  spousePrediction: any,
  timingForecast: TimingForecast,
  doshaAnalysis: any
): SelfExecutiveSummary {
  const verdict = `Your marriage potential is ${marriagePotential.verdict.replace('_', ' ')} with a score of ${marriagePotential.score}/100.`;

  let oneLineSummary = '';
  if (marriagePotential.score >= 70) {
    oneLineSummary = 'Excellent prospects for a happy and fulfilling marriage.';
  } else if (marriagePotential.score >= 50) {
    oneLineSummary = 'Good potential with some areas for improvement through remedies.';
  } else {
    oneLineSummary = 'Challenging indicators present, but remedies can significantly improve prospects.';
  }

  return {
    verdict,
    oneLineSummary,
    keyStrengths: marriagePotential.strengths.slice(0, 3),
    keyChallenges: marriagePotential.challenges.slice(0, 3),
    timingOutlook: {
      bestPeriod: timingForecast.nextMarriageWindow.yearRange,
      preparationTime: timingForecast.currentPhase.preparationNeeded
        ? 'Use this time for personal growth and remedies'
        : 'Actively seek opportunities'
    },
    spouseOutlook: {
      quality: marriagePotential.marriageQuality === 'high' ? 'Excellent match' : 'Good potential',
      meetingTimeline: timingForecast.keyMilestones.whenYouMeet
    },
    actionItems: [
      'Follow the prioritized remedies',
      'Be open to meeting people in ' + timingForecast.nextMarriageWindow.yearRange,
      'Work on personal growth areas identified'
    ],
    overallAdvice: marriagePotential.score >= 60
      ? 'Your chart shows good marriage potential. Stay positive and follow remedies for best results.'
      : 'While there are challenges, dedicated remedy practice can significantly improve your prospects. Stay hopeful and work on yourself.'
  };
}

// Helper functions

function calculateCurrentAge(dateOfBirth: Date | string | number): number {
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return Math.max(0, age);
}

function identifyDelayIndicators(chart: Chart): string[] {
  const indicators: string[] = [];
  const seventhHouse = chart.houses.find((h: House) => h.houseNumber === 7);

  // Saturn in or aspecting 7th house
  const saturn = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Saturn');
  if (saturn && (saturn.house === 7 || Math.abs(saturn.house - 7) === 4)) {
    indicators.push('Saturn influence on 7th house may cause delays');
  }

  // Rahu in 7th house
  const rahu = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Rahu');
  if (rahu?.house === 7) {
    indicators.push('Rahu in 7th house may create delays or unconventional matches');
  }

  // 7th lord in 6th, 8th, or 12th
  if (seventhHouse?.lord) {
    const seventhLordPlanet = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === seventhHouse.lord);
    if (seventhLordPlanet && [6, 8, 12].includes(seventhLordPlanet.house)) {
      indicators.push(`7th lord in ${getHouseName(seventhLordPlanet.house)} may delay marriage`);
    }
  }

  return indicators;
}

function isManglik(chart: Chart): boolean {
  const mars = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Mars');
  if (!mars) return false;

  const manglikHouses = [1, 2, 4, 7, 8, 12];
  return manglikHouses.includes(mars.house);
}

function calculateNextFavorableYears(chart: Chart, count: number): number[] {
  const currentYear = new Date().getFullYear();
  const currentAge = calculateCurrentAge(chart.dateOfBirth);
  const years: number[] = [];

  // Start from next year to show near-term future
  for (let i = 1; i <= count + 5; i++) { // Check further to find enough years
    const potentialYear = currentYear + i;
    if (currentAge + i >= 21) {
      years.push(potentialYear);
    }
    if (years.length >= count) break;
  }

  return years;
}

function getYoniInfo(nakshatra: string) {
  const yoniMap: Record<string, { animal: string; characteristics: string; nature: string; tendencies: string[] }> = {
    'Ashwini': { animal: 'Horse', characteristics: 'Energetic and passionate', nature: 'Aggressive', tendencies: ['Quick to act', 'Independent'] },
    'Bharani': { animal: 'Male Elephant', characteristics: 'Strong and determined', nature: 'Balanced', tendencies: ['Responsible', 'Enduring'] },
    'Krittika': { animal: 'Sheep', characteristics: 'Gentle but firm', nature: 'Moderate', tendencies: ['Nurturing', 'Protective'] },
    'Rohini': { animal: 'Serpent', characteristics: 'Sensual and magnetic', nature: 'Gentle', tendencies: ['Attractive', 'Creative'] },
    'Mrigashira': { animal: 'Serpent', characteristics: 'Curious and seeking', nature: 'Moderate', tendencies: ['Inquisitive', 'Restless'] },
    'Ardra': { animal: 'Dog', characteristics: 'Loyal and intense', nature: 'Aggressive', tendencies: ['Emotional', 'Transformative'] },
    'Punarvasu': { animal: 'Cat', characteristics: 'Nurturing and cyclical', nature: 'Gentle', tendencies: ['Renewing', 'Caring'] },
    'Pushya': { animal: 'Sheep', characteristics: 'Nurturing and supportive', nature: 'Gentle', tendencies: ['Giving', 'Supportive'] },
    'Ashlesha': { animal: 'Cat', characteristics: 'Mysterious and intense', nature: 'Aggressive', tendencies: ['Secretive', 'Powerful'] },
    'Magha': { animal: 'Rat', characteristics: 'Regal and traditional', nature: 'Balanced', tendencies: ['Authoritative', 'Proud'] },
    'Purva Phalguni': { animal: 'Rat', characteristics: 'Romantic and creative', nature: 'Gentle', tendencies: ['Artistic', 'Loving'] },
    'Uttara Phalguni': { animal: 'Cow', characteristics: 'Stable and giving', nature: 'Gentle', tendencies: ['Reliable', 'Generous'] },
    'Hasta': { animal: 'Buffalo', characteristics: 'Skilled and practical', nature: 'Moderate', tendencies: ['Skilled', 'Methodical'] },
    'Chitra': { animal: 'Tiger', characteristics: 'Beautiful and dramatic', nature: 'Aggressive', tendencies: ['Creative', 'Perfectionist'] },
    'Swati': { animal: 'Buffalo', characteristics: 'Independent and adaptable', nature: 'Moderate', tendencies: ['Independent', 'Flexible'] },
    'Vishakha': { animal: 'Tiger', characteristics: 'Ambitious and intense', nature: 'Aggressive', tendencies: ['Determined', 'Focused'] },
    'Anuradha': { animal: 'Deer', characteristics: 'Devoted and friendly', nature: 'Gentle', tendencies: ['Loyal', 'Social'] },
    'Jyeshtha': { animal: 'Deer', characteristics: 'Powerful and protective', nature: 'Aggressive', tendencies: ['Authoritative', 'Protective'] },
    'Mula': { animal: 'Dog', characteristics: 'Deep and transformative', nature: 'Aggressive', tendencies: ['Investigative', 'Intense'] },
    'Purva Ashadha': { animal: 'Monkey', characteristics: 'Charming and persuasive', nature: 'Moderate', tendencies: ['Charismatic', 'Adaptable'] },
    'Uttara Ashadha': { animal: 'Mongoose', characteristics: 'Noble and victorious', nature: 'Moderate', tendencies: ['Principled', 'Achieving'] },
    'Shravana': { animal: 'Monkey', characteristics: 'Listening and learning', nature: 'Gentle', tendencies: ['Receptive', 'Knowledgeable'] },
    'Dhanishta': { animal: 'Lion', characteristics: 'Musical and wealthy', nature: 'Aggressive', tendencies: ['Talented', 'Prosperous'] },
    'Shatabhisha': { animal: 'Horse', characteristics: 'Healing and mysterious', nature: 'Moderate', tendencies: ['Healing', 'Secretive'] },
    'Purva Bhadrapada': { animal: 'Lion', characteristics: 'Passionate and spiritual', nature: 'Aggressive', tendencies: ['Fiery', 'Spiritual'] },
    'Uttara Bhadrapada': { animal: 'Cow', characteristics: 'Wise and stable', nature: 'Gentle', tendencies: ['Wise', 'Patient'] },
    'Revati': { animal: 'Elephant', characteristics: 'Nurturing and complete', nature: 'Gentle', tendencies: ['Compassionate', 'Complete'] }
  };

  return yoniMap[nakshatra] || {
    animal: 'Unknown',
    characteristics: 'Balanced nature',
    nature: 'Moderate',
    tendencies: ['Adaptable', 'Balanced']
  };
}

function getCompatibleYonis(yoniAnimal: string): string[] {
  const compatibilityMap: Record<string, string[]> = {
    'Horse': ['Horse', 'Monkey', 'Lion'],
    'Elephant': ['Elephant', 'Sheep', 'Snake'],
    'Sheep': ['Elephant', 'Sheep', 'Monkey'],
    'Serpent': ['Elephant', 'Serpent', 'Mongoose'],
    'Dog': ['Dog', 'Deer', 'Monkey'],
    'Cat': ['Cat', 'Sheep', 'Buffalo'],
    'Rat': ['Rat', 'Snake', 'Cat'],
    'Cow': ['Cow', 'Elephant', 'Deer'],
    'Buffalo': ['Buffalo', 'Cat', 'Horse'],
    'Tiger': ['Tiger', 'Horse', 'Dog'],
    'Deer': ['Deer', 'Dog', 'Cow'],
    'Monkey': ['Monkey', 'Horse', 'Goat'],
    'Mongoose': ['Mongoose', 'Serpent', 'Deer'],
    'Lion': ['Lion', 'Horse', 'Tiger']
  };

  return compatibilityMap[yoniAnimal] || ['Various compatible types'];
}

function getLibidoDescription(level: string): string {
  const descriptions: Record<string, string> = {
    high: 'You have strong physical energy and passion. Your intimate nature is vibrant and enthusiastic.',
    moderate: 'You have a balanced approach to intimacy, with healthy energy levels that match your emotional state.',
    low: 'Your energy is more subtle and refined. Quality and emotional connection matter more than frequency.'
  };
  return descriptions[level] || 'Balanced intimate nature';
}

function getMarsInfluenceDescription(mars: PlanetaryPosition | undefined): string {
  if (!mars) return 'Mars influence is neutral';

  const houseInfluences: Record<number, string> = {
    1: 'Mars in 1st house gives strong personality and drive',
    5: 'Mars in 5th house adds passion to romance',
    7: 'Mars in 7th house (Manglik) - need compatible partner',
    8: 'Mars in 8th house brings intensity and transformation',
    12: 'Mars in 12th house adds spiritual dimension'
  };

  return houseInfluences[mars.house] || `Mars in ${mars.house}th house influences your drive`;
}

function getVenusInfluenceDescription(venus: PlanetaryPosition | undefined): string {
  if (!venus) return 'Venus influence is neutral';

  const dignityEffects: Record<string, string> = {
    exalted: 'Venus is exalted - exceptional romantic and artistic abilities',
    moolatrikona: 'Venus is strong - good relationship skills',
    own_house: 'Venus in own sign - natural charm and attraction',
    friendly: 'Venus in friendly sign - harmonious relationships',
    debilitated: 'Venus is debilitated - may need to work on self-worth'
  };

  return dignityEffects[venus.dignity] || `Venus in ${venus.sign} influences your romantic style`;
}

function getEmotionalNeedFromMoon(sign: Sign): string {
  const needs: Record<Sign, string> = {
    'Aries': 'Excitement and independence',
    'Taurus': 'Security and stability',
    'Gemini': 'Communication and variety',
    'Cancer': 'Nurturing and emotional safety',
    'Leo': 'Appreciation and loyalty',
    'Virgo': 'Practical support and order',
    'Libra': 'Harmony and partnership',
    'Scorpio': 'Deep emotional intimacy',
    'Sagittarius': 'Freedom and adventure',
    'Capricorn': 'Respect and achievement',
    'Aquarius': 'Friendship and independence',
    'Pisces': 'Compassion and spiritual connection'
  };

  return needs[sign] || 'Emotional connection';
}

function getFourthHouseAnalysis(fourthHouse: House | undefined): string {
  if (!fourthHouse) return 'Emotional foundation is stable';

  if (fourthHouse.planets.length === 0) {
    return '4th house is empty - emotional stability comes from within';
  }

  if (fourthHouse.planets.includes('Saturn')) {
    return 'Saturn in 4th house - emotional security may be delayed or hard-won';
  }

  if (fourthHouse.planets.includes('Moon')) {
    return 'Moon in 4th house - strong need for emotional security';
  }

  return `4th house in ${fourthHouse.sign} - emotional foundation influenced by ${fourthHouse.sign} energy`;
}

function getExpressionMethod(mercury: PlanetaryPosition | undefined): string {
  if (!mercury) return 'Balanced expression';

  const methods: Record<string, string> = {
    'Aries': 'Direct and immediate',
    'Taurus': 'Practical and steady',
    'Gemini': 'Versatile and quick',
    'Cancer': 'Emotional and intuitive',
    'Leo': 'Dramatic and confident',
    'Virgo': 'Precise and analytical',
    'Libra': 'Diplomatic and balanced',
    'Scorpio': 'Intense and probing',
    'Sagittarius': 'Expansive and philosophical',
    'Capricorn': 'Structured and authoritative',
    'Aquarius': 'Unconventional and intellectual',
    'Pisces': 'Intuitive and empathetic'
  };

  return methods[mercury.sign] || 'Balanced communication';
}

function getConflictResolutionStyle(mercury: PlanetaryPosition | undefined, moon: PlanetaryPosition | undefined): string {
  if (mercury?.sign === 'Aries' || mercury?.sign === 'Leo') {
    return 'Direct confrontation followed by quick resolution';
  } else if (moon?.sign === 'Cancer' || moon?.sign === 'Pisces') {
    return 'Withdrawal followed by emotional processing';
  } else if (mercury?.sign === 'Libra' || mercury?.sign === 'Taurus') {
    return 'Patient discussion and compromise';
  }
  return 'Balanced approach to conflict';
}

function getCommunicationTriggers(mercury: PlanetaryPosition | undefined, moon: PlanetaryPosition | undefined): string[] {
  const triggers: string[] = [];

  if (mercury?.sign === 'Gemini') triggers.push('Being bored or ignored');
  if (mercury?.sign === 'Virgo') triggers.push('Disorganization and chaos');
  if (moon?.sign === 'Cancer') triggers.push('Feeling emotionally unsafe');
  if (moon?.sign === 'Leo') triggers.push('Lack of appreciation');

  return triggers.length > 0 ? triggers : ['Dishonesty', 'Disrespect'];
}

function getCoreFear(rahu: PlanetaryPosition | undefined, moon: PlanetaryPosition | undefined): string {
  if (!rahu) return 'General fear of the unknown';

  const fears: Record<string, string> = {
    'Aries': 'Fear of losing independence',
    'Taurus': 'Fear of financial or emotional instability',
    'Gemini': 'Fear of being misunderstood',
    'Cancer': 'Fear of rejection and abandonment',
    'Leo': 'Fear of being ignored or unappreciated',
    'Virgo': 'Fear of imperfection',
    'Libra': 'Fear of conflict and disharmony',
    'Scorpio': 'Fear of betrayal',
    'Sagittarius': 'Fear of restriction',
    'Capricorn': 'Fear of failure',
    'Aquarius': 'Fear of not fitting in',
    'Pisces': 'Fear of harsh realities'
  };

  return fears[rahu.sign] || 'Fear of the unknown';
}

function getRahuObsession(rahu: PlanetaryPosition): string {
  const obsessions: Record<string, string> = {
    'Aries': 'self-assertion',
    'Taurus': 'material security',
    'Gemini': 'information and communication',
    'Cancer': 'emotional safety',
    'Leo': 'recognition',
    'Virgo': 'perfection',
    'Libra': 'relationships',
    'Scorpio': 'transformation',
    'Sagittarius': 'freedom and meaning',
    'Capricorn': 'achievement',
    'Aquarius': 'innovation',
    'Pisces': 'spiritual escape'
  };

  return obsessions[rahu.sign] || 'various obsessions';
}

function getFearManifestation(rahu: PlanetaryPosition | undefined, moon: PlanetaryPosition | undefined): string {
  if (!rahu) return 'Anxiety and restlessness';
  return `Through ${getRahuObsession(rahu)} and constant seeking`;
}

function getDefenseMechanism(ketu: PlanetaryPosition | undefined): string {
  if (!ketu) return 'Withdrawal';

  const mechanisms: Record<string, string> = {
    'Aries': 'Anger and impulsiveness',
    'Taurus': 'Stubbornness',
    'Gemini': 'Intellectualization',
    'Cancer': 'Emotional withdrawal',
    'Leo': 'Pride and arrogance',
    'Virgo': 'Perfectionism',
    'Libra': 'Indecision',
    'Scorpio': 'Secrecy',
    'Sagittarius': 'Escapism',
    'Capricorn': 'Workaholism',
    'Aquarius': 'Detachment',
    'Pisces': 'Spiritual bypassing'
  };

  return mechanisms[ketu.sign] || 'General detachment';
}

function getKetuImpact(ketu: PlanetaryPosition | undefined): string {
  if (!ketu) return 'Minimal impact on relationships';

  if (ketu.house === 7) {
    return 'May create detachment from relationships or attraction to spiritual partners';
  }

  return 'Brings a spiritual, non-materialistic approach to relationships';
}

function getRepeatingPattern(fifthHouse: House | undefined, venus: PlanetaryPosition | undefined): string {
  if (fifthHouse?.planets.includes('Saturn')) {
    return 'Delayed romance or attraction to older/mature partners';
  }

  if (venus?.dignity === 'debilitated') {
    return 'Tendency to undervalue yourself in relationships';
  }

  if (fifthHouse?.planets.includes('Rahu')) {
    return 'Attraction to unconventional or foreign partners';
  }

  return 'Balanced approach to romance';
}

function getFifthHouseInfluence(fifthHouse: House | undefined): string {
  if (!fifthHouse) return 'Neutral influence on romance';

  if (fifthHouse.planets.length === 0) {
    return `5th house in ${fifthHouse.sign} - romance influenced by ${fifthHouse.sign} qualities`;
  }

  return `5th house has ${fifthHouse.planets.join(', ')} - strong influence on romantic patterns`;
}

function getVenusCycleInfluence(venus: PlanetaryPosition | undefined): string {
  if (!venus) return 'Standard Venus cycles';

  if (venus.dignity === 'exalted') {
    return 'Venus is strong - positive romantic cycles';
  } else if (venus.dignity === 'debilitated') {
    return 'Venus is challenged - work through cycles of self-worth';
  }

  return `Venus in ${venus.sign} creates ${venus.sign}-themed relationship lessons`;
}

function getBlindSpot(venus: PlanetaryPosition | undefined, mercury: PlanetaryPosition | undefined): string {
  if (venus?.dignity === 'debilitated') {
    return 'Not recognizing your own worth in relationships';
  }

  if (mercury?.sign === 'Pisces') {
    return 'Missing practical details in relationships';
  }

  return 'Being too idealistic about partners';
}

function getGrowthArea(moon: PlanetaryPosition | undefined, sun: PlanetaryPosition | undefined): string {
  if (moon?.dignity === 'debilitated') {
    return 'Developing emotional resilience and self-nurturing';
  }

  if (sun?.house === 12) {
    return 'Building self-confidence and visibility';
  }

  return 'Balancing independence with partnership';
}

function getHouseName(houseNumber: number): string {
  const names: Record<number, string> = {
    1: '1st house (self)',
    2: '2nd house (wealth)',
    3: '3rd house (siblings)',
    4: '4th house (home)',
    5: '5th house (children)',
    6: '6th house (enemies)',
    7: '7th house (marriage)',
    8: '8th house (transformation)',
    9: '9th house (fortune)',
    10: '10th house (career)',
    11: '11th house (gains)',
    12: '12th house (loss)'
  };

  return names[houseNumber] || `${houseNumber}th house`;
}

function getGemstoneForPlanet(planet: string): string {
  const gemstones: Record<string, string> = {
    'Sun': 'Ruby',
    'Moon': 'Pearl',
    'Mars': 'Red Coral',
    'Mercury': 'Emerald',
    'Jupiter': 'Yellow Sapphire',
    'Venus': 'Diamond or White Sapphire',
    'Saturn': 'Blue Sapphire',
    'Rahu': 'Hessonite',
    'Ketu': 'Cat\'s Eye'
  };

  return gemstones[planet] || 'Clear Quartz';
}

function getMetalForPlanet(planet: string): string {
  const metals: Record<string, string> = {
    'Sun': 'Gold',
    'Moon': 'Silver',
    'Mars': 'Gold or Copper',
    'Mercury': 'Gold',
    'Jupiter': 'Gold',
    'Venus': 'Silver or Platinum',
    'Saturn': 'Silver or Iron',
    'Rahu': 'Silver',
    'Ketu': 'Silver'
  };

  return metals[planet] || 'Gold';
}

function getFingerForPlanet(planet: string): string {
  const fingers: Record<string, string> = {
    'Sun': 'Ring finger',
    'Moon': 'Little finger',
    'Mars': 'Ring finger',
    'Mercury': 'Little finger',
    'Jupiter': 'Index finger',
    'Venus': 'Ring finger',
    'Saturn': 'Middle finger',
    'Rahu': 'Middle finger',
    'Ketu': 'Little finger'
  };

  return fingers[planet] || 'Ring finger';
}

function getDayForPlanet(planet: string): string {
  const days: Record<string, string> = {
    'Sun': 'Sunday',
    'Moon': 'Monday',
    'Mars': 'Tuesday',
    'Mercury': 'Wednesday',
    'Jupiter': 'Thursday',
    'Venus': 'Friday',
    'Saturn': 'Saturday',
    'Rahu': 'Saturday',
    'Ketu': 'Tuesday'
  };

  return days[planet] || 'Friday';
}

function getMantraForPlanet(planet: string): string {
  const mantras: Record<string, string> = {
    'Sun': 'Om Hrim Hrim Suryaya Namah',
    'Moon': 'Om Som Somaya Namah',
    'Mars': 'Om Ang Angarakaya Namah',
    'Mercury': 'Om Bum Budhaya Namah',
    'Jupiter': 'Om Gram Grim Graum Sah Guruve Namah',
    'Venus': 'Om Dram Drim Draum Sah Shukraya Namah',
    'Saturn': 'Om Sham Shanicharaya Namah',
    'Rahu': 'Om Bhram Bhrim Braum Sah Rahave Namah',
    'Ketu': 'Om Bram Brim Braum Sah Ketave Namah'
  };

  return mantras[planet] || 'Om Namah Shivaya';
}

function getPrimaryMarriageMantra(): string {
  return 'Om Namo Bhagavate Vasudevaya';
}

/**
 * Calculate Self Sexual Profile based on chart data
 * Replaces hardcoded values with dynamic calculation
 */
function calculateSelfSexualProfile(chart: Chart): SelfSexualProfile {
  // Get key planets
  const moon = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Moon');
  const mars = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Mars');
  const venus = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Venus');
  const saturn = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Saturn');

  // Get Moon nakshatra for Yoni calculation
  const moonNakshatra = moon?.nakshatra || 'Ashwini';
  const yoniData = getYoniInfo(moonNakshatra);

  // Calculate libido score based on Mars and Venus
  let libidoScore = 50; // Base score

  // Mars factors
  if (mars) {
    if (mars.dignity === 'exalted') libidoScore += 20;
    if (mars.dignity === 'own_house') libidoScore += 15;
    if (['Aries', 'Leo', 'Sagittarius'].includes(mars.sign)) libidoScore += 10;
    if (mars.house === 1 || mars.house === 5 || mars.house === 7) libidoScore += 10;
  }

  // Venus factors
  if (venus) {
    if (venus.dignity === 'exalted') libidoScore += 15;
    if (venus.dignity === 'own_house') libidoScore += 10;
    if (['Taurus', 'Libra', 'Pisces'].includes(venus.sign)) libidoScore += 5;
  }

  // Saturn restrictions
  if (saturn && mars) {
    const diff = Math.abs((saturn.longitude - mars.longitude + 360) % 360);
    if (diff < 10 || (diff > 170 && diff < 190)) libidoScore -= 20;
  }
  if (saturn && venus) {
    const diff = Math.abs((saturn.longitude - venus.longitude + 360) % 360);
    if (diff < 10 || (diff > 170 && diff < 190)) libidoScore -= 15;
  }

  // Clamp score
  libidoScore = Math.max(20, Math.min(95, libidoScore));

  // Determine libido level
  const libidoLevel: 'low' | 'moderate' | 'high' =
    libidoScore >= 70 ? 'high' : libidoScore >= 40 ? 'moderate' : 'low';

  // Get romantic style from Venus
  const romanticStyle = getRomanticStyle(venus?.sign);

  // Get Mars strength
  const marsStrength: 'weak' | 'moderate' | 'strong' =
    !mars ? 'moderate' :
      mars.dignity === 'exalted' || mars.dignity === 'own_house' ? 'strong' :
        mars.dignity === 'debilitated' ? 'weak' : 'moderate';

  // Calculate potential issues
  const potentialIssues: string[] = [];
  if (saturn && mars && Math.abs((saturn.longitude - mars.longitude + 360) % 360) < 10) {
    potentialIssues.push('Saturn-Mars conjunction may create delays or restrictions in physical expression');
  }
  if (venus?.dignity === 'debilitated') {
    potentialIssues.push('Debilitated Venus suggests challenges with self-worth in relationships');
  }
  if (mars?.house === 7) {
    potentialIssues.push('Mars in 7th house (Manglik) - need compatible partner for harmony');
  }

  // Calculate strengths
  const strengths: string[] = [];
  if (libidoScore >= 70) strengths.push('Strong physical vitality and passion');
  if (venus?.dignity === 'exalted' || venus?.dignity === 'own_house') {
    strengths.push('Natural charm and romantic abilities');
  }
  if (mars?.dignity === 'exalted') strengths.push('Exceptional drive and determination');

  // Get compatible yonis
  const compatibleYonis = getCompatibleYonis(yoniData.animal);

  return {
    yoniType: {
      animal: yoniData.animal,
      characteristics: yoniData.characteristics,
      nature: yoniData.nature
    },
    nakshatraInfluence: {
      name: moonNakshatra,
      sexualNature: yoniData.characteristics,
      tendencies: yoniData.tendencies
    },
    libido: {
      score: libidoScore,
      level: libidoLevel,
      description: getLibidoDescription(libidoLevel)
    },
    romanticStyle,
    marsAnalysis: {
      house: mars?.house || 1,
      strength: marsStrength,
      influence: getMarsInfluenceDescription(mars)
    },
    venusAnalysis: {
      sign: venus?.sign || 'Libra',
      dignity: venus?.dignity || 'neutral',
      influence: getVenusInfluenceDescription(venus)
    },
    emotionalNeeds: {
      primaryNeed: getEmotionalNeedFromMoon(moon?.sign || 'Cancer'),
      description: `Your Moon in ${moon?.sign || 'Cancer'} indicates ${getEmotionalNeedFromMoon(moon?.sign || 'Cancer')}`
    },
    potentialIssues,
    bestMatchYoni: compatibleYonis,
    sexualHealth: {
      vitality: libidoLevel,
      risks: potentialIssues,
      strengths,
      balancingTips: getBalancingTips(libidoLevel, venus, mars)
    }
  };
}

function getRomanticStyle(venusSign: Sign | undefined): string {
  if (!venusSign) return 'Balanced';

  const styles: Record<Sign, string> = {
    'Aries': 'Passionate and spontaneous',
    'Taurus': 'Sensual and devoted',
    'Gemini': 'Playful and communicative',
    'Cancer': 'Nurturing and protective',
    'Leo': 'Dramatic and generous',
    'Virgo': 'Thoughtful and service-oriented',
    'Libra': 'Romantic and harmonious',
    'Scorpio': 'Intense and transformative',
    'Sagittarius': 'Adventurous and honest',
    'Capricorn': 'Committed and traditional',
    'Aquarius': 'Unconventional and intellectual',
    'Pisces': 'Dreamy and compassionate'
  };

  return styles[venusSign] || 'Balanced';
}

function getBalancingTips(
  libidoLevel: string,
  venus: PlanetaryPosition | undefined,
  mars: PlanetaryPosition | undefined
): string[] {
  const tips: string[] = [];

  if (libidoLevel === 'high') {
    tips.push('Channel excess energy through creative pursuits');
    tips.push('Practice patience and build emotional connection before physical intimacy');
  } else if (libidoLevel === 'low') {
    tips.push('Focus on emotional intimacy and quality over quantity');
    tips.push('Create romantic settings that help you relax and connect');
  } else {
    tips.push('Maintain balance between physical and emotional connection');
  }

  if (venus?.dignity === 'debilitated') {
    tips.push('Work on self-love and confidence building');
    tips.push('Practice receiving love and compliments graciously');
  }

  if (mars?.house === 7) {
    tips.push('Look for partners who can match your energy level');
    tips.push('Channel assertiveness constructively in relationships');
  }

  return tips.length > 0 ? tips : ['Maintain healthy lifestyle for optimal vitality'];
}

// Export helper functions for use in other modules
export {
  calculateMarriagePotential,
  generateDetailedSpouseProfile,
  generateTimingForecast,
  calculateSexualProfile,
  generateSelfRemedies,
  generateExecutiveSummary
};
