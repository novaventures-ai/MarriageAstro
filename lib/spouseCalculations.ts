/**
 * Spouse Calculations
 * Calculates spouse prediction from chart
 */

import { Chart, Planet, Sign, SpousePrediction } from '@types';

export function calculateSpousePrediction(chart: Chart): SpousePrediction {
  const seventhHouse = chart.houses.find(h => h.houseNumber === 7);
  const seventhSign = seventhHouse?.sign || 'Libra' as Sign;
  const seventhLord = seventhHouse?.lord || 'Venus' as Planet;
  const planetsIn7th = (seventhHouse?.planets || []) as Planet[];

  const d9 = chart.vargaCharts?.D9;
  const d9SeventhHouse = d9?.houses?.find((h: any) => h.houseNumber === 7);

  // Logic for profession
  // Dominant planet: Planet in 7th House (especially closest to cusp) > 7th Lord
  const dominantPlanet = planetsIn7th.length > 0 ? planetsIn7th[0] : seventhLord;
  const profession = analyzeProfession(dominantPlanet);

  return {
    profileName: chart.name || 'You',
    seventhHouse: {
      sign: seventhSign,
      lord: seventhLord,
      planets: planetsIn7th,
      spouseNature: getSpouseNature(seventhSign, planetsIn7th),
      spouseAppearance: getSpouseAppearance(seventhLord, planetsIn7th),
      spouseTraits: getSpouseTraits(seventhSign, planetsIn7th),
      element: getElementFromSign(seventhSign),
      seventhLordDetails: {
        d1: {
          sign: chart.planetaryPositions.find(p => p.planet === seventhLord)?.sign || 'Unknown',
          house: chart.planetaryPositions.find(p => p.planet === seventhLord)?.house || 0,
          description: getSeventhLordPlacementInterpretation(
            seventhLord,
            chart.planetaryPositions.find(p => p.planet === seventhLord)?.house || 0
          ).description,
          interpretation: getSeventhLordPlacementInterpretation(
            seventhLord,
            chart.planetaryPositions.find(p => p.planet === seventhLord)?.house || 0
          )
        },
        d9: {
          sign: d9?.planetaryPositions.find((p: any) => p.planet === seventhLord)?.sign || 'Unknown',
          house: d9?.planetaryPositions.find((p: any) => p.planet === seventhLord)?.house || 0,
          description: `7th Lord ${seventhLord} in D9 is placed in ${(d9?.planetaryPositions.find((p: any) => p.planet === seventhLord)?.sign) || 'Unknown'}`,
          interpretation: d9 ? getSeventhLordPlacementInterpretation(
            seventhLord,
            d9.planetaryPositions.find((p: any) => p.planet === seventhLord)?.house || 0
          ) : undefined
        }
      }
    },
    darakaraka: {
      planet: (chart.specialPoints?.darakaraka as Planet) || 'Venus',
      sign: (chart.planetaryPositions.find(p => p.planet === chart.specialPoints?.darakaraka)?.sign as Sign) || 'Libra',
      house: chart.planetaryPositions.find(p => p.planet === chart.specialPoints?.darakaraka)?.house || 7,
      spouseCharacteristics: 'Brings specific karmic lessons and traits based on the Darakaraka planet.'
    },
    navamsaSeventh: {
      sign: d9SeventhHouse?.sign || 'Libra',
      planets: (d9SeventhHouse?.planets || []) as Planet[],
      marriageQuality: 'Navamsa indicates the underlying strength and sustenance of marriage.'
    },
    upapadaLagna: {
      sign: (chart.specialPoints?.upapadaLagna as Sign) || 'Libra',
      planets: [], // Placeholder
      timing: 'Upapada Lagna helps in determining the timing and nature of spouse.'
    },
    predictions: generatePredictions(seventhHouse?.sign || 'Libra', planetsIn7th, seventhLord),
    physique: getSpousePhysique(seventhLord, planetsIn7th, seventhHouse?.sign || 'Libra'),
    profession
  };
}

export function analyzeProfession(planet: Planet): NonNullable<SpousePrediction['profession']> {
  const professionMap: Record<string, any> = {
    'Sun': {
      field: 'Government or Administration',
      description: 'The spouse is likely to hold a position of authority or work in a prominent public role.',
      careerNature: 'Government'
    },
    'Moon': {
      field: 'Social Services or Arts',
      description: 'A career involving public care, hospitality, emotional intelligence, or creative fields.',
      careerNature: 'Service'
    },
    'Mars': {
      field: 'Engineering, Technical or Uniformed Services',
      description: 'Physical or technical work requiring energy, leadership, and discipline.',
      careerNature: 'Service'
    },
    'Mercury': {
      field: 'Business, IT or Communication',
      description: 'Intellectual career involving numbers, logic, trade, or tech-enabled services.',
      careerNature: 'Business'
    },
    'Jupiter': {
      field: 'Law, Finance, Education or Advisory',
      description: 'Respected role involving wisdom, ethics, law, or high-level financial planning.',
      careerNature: 'Self-Employed'
    },
    'Venus': {
      field: 'Creative Arts, Fashion or Finance',
      description: 'Profession related to aesthetics, luxury, arts, or high-end hospitality.',
      careerNature: 'Creative'
    },
    'Saturn': {
      field: 'Technical, Corporate or Large-scale Manufacturing',
      description: 'Stable, long-term career requiring persistence, possibly in infrastructure or traditional industries.',
      careerNature: 'Service'
    },
    'Rahu': {
      field: 'Technology, Innovation or Foreign Trade',
      description: 'Unconventional career working with modern technology or global markets.',
      careerNature: 'Self-Employed'
    },
    'Ketu': {
      field: 'Spiritual, Research or Detail-oriented Science',
      description: 'Career focused on deep research, healing, coding, or metaphysical fields.',
      careerNature: 'Service'
    },
    'Neptune': {
      field: 'Spiritual, Creative Arts or Psychic/Intuitive',
      description: 'Highly creative and visionary career, often in films, photography, healing, or spiritual domains.',
      careerNature: 'Creative'
    },
    'Uranus': {
      field: 'Modern Tech, Space or Humanitarian Innovation',
      description: 'Breakthrough career working with advanced technology, astrology, or unique scientific fields.',
      careerNature: 'Self-Employed'
    },
    'Pluto': {
      field: 'Research, Investigation or Transformation',
      description: 'Career involving deep transformation, intense research, secret services, or power dynamics.',
      careerNature: 'Business'
    }
  };

  const data = professionMap[planet] || {
    field: 'General Professional',
    description: 'Working in a stable and respectable professional capacity.',
    careerNature: 'Service'
  };

  return {
    ...data,
    relatedPlanets: [planet]
  };
}

function getSpouseNature(sign: Sign, planets: Planet[]): string {
  const signNature = {
    'Aries': 'Active and energetic',
    'Taurus': 'Stable and reliable',
    'Gemini': 'Communicative and youthful',
    'Cancer': 'Nurturing and sensitive',
    'Leo': 'Confident and generous',
    'Virgo': 'Practical and detail-oriented',
    'Libra': 'Balanced and social',
    'Scorpio': 'Deep and intense',
    'Sagittarius': 'Optimistic and philosophical',
    'Capricorn': 'Disciplined and traditional',
    'Aquarius': 'Original and humanitarian',
    'Pisces': 'Compassionate and spiritual'
  }[sign] || 'Balanced';

  if (planets.length > 0) {
    return `${signNature} with a ${planets[0]} influence.`;
  }
  return `${signNature} personality.`;
}

function getSpouseAppearance(lord: Planet, planets: Planet[]): string {
  if (planets.includes('Neptune')) return 'Mystical aura with dreamy, expressive eyes and a glamorous look.';
  if (planets.includes('Venus')) return 'Attractive personality with a charming smile and refined features.';
  if (planets.includes('Jupiter')) return 'Dignified and graceful appearance with a broad forehead.';
  return 'Pleasant and balanced physical appearance.';
}

function getSpouseTraits(sign: Sign, planets: Planet[]): string[] {
  const baseTraits: Record<string, string[]> = {
    'Aries': ['Energetic', 'Brave', 'Independent'],
    'Taurus': ['Patient', 'Stable', 'Appreciative'],
    'Gemini': ['Witty', 'Adaptable', 'Clever'],
    'Cancer': ['Caring', 'Nurturing', 'Family-oriented'],
    'Leo': ['Noble', 'Proud', 'Generous'],
    'Virgo': ['Practical', 'Dedicated', 'Helpful'],
    'Libra': ['Charming', 'Diplomatic', 'Graceful'],
    'Scorpio': ['Intuitive', 'Private', 'Resilient'],
    'Sagittarius': ['Honest', 'Adventurous', 'Philosophical'],
    'Capricorn': ['Ambitious', 'Hardworking', 'Wise'],
    'Aquarius': ['Original', 'Rebellious', 'Humanitarian'],
    'Pisces': ['Creative', 'Spiritual', 'Compassionate']
  };

  const traits = [...(baseTraits[sign] || ['Supportive', 'Kind'])];
  if (planets.includes('Neptune')) traits.push('Visionary', 'Dreamy');
  if (planets.includes('Jupiter')) traits.push('Wise', 'Ethical');
  return traits;
}

function generatePredictions(sign: Sign, planets: Planet[], lord: Planet): string[] {
  const items = [
    'Spouse will be helpful and supportive in your endeavors.',
    'Relationship will be built on the foundation of mutual respect.'
  ];
  if (planets.includes('Neptune')) items.push('There will be a deep soul-level connection between you and your spouse.');
  if (lord === 'Jupiter') items.push('Spouse will bring wisdom and growth to your life.');
  return items;
}

function getSpousePhysique(lord: Planet, planets: Planet[], sign: Sign): SpousePrediction['physique'] {
  const base: SpousePrediction['physique'] = {
    height: 'average',
    build: 'average',
    complexion: 'fair',
    eyeColor: 'brown',
    hairType: 'straight',
    notableFeatures: ['Pleasant smile'],
    appearance: ['Elegant'],
    faceShape: getFaceShape(sign),
    skinTexture: getSkinTexture(sign)
  };

  if (planets.includes('Neptune')) {
    base.notableFeatures.push('Dreamy eyes');
    base.appearance.push('Ethereal');
  }

  return base;
}

function getElementFromSign(sign: Sign): 'Fire' | 'Earth' | 'Air' | 'Water' {
  const fireSigns = ['Aries', 'Leo', 'Sagittarius'];
  const earthSigns = ['Taurus', 'Virgo', 'Capricorn'];
  const airSigns = ['Gemini', 'Libra', 'Aquarius'];
  if (fireSigns.includes(sign)) return 'Fire';
  if (earthSigns.includes(sign)) return 'Earth';
  if (airSigns.includes(sign)) return 'Air';
  return 'Water';
}

function getFaceShape(sign: Sign): string {
  const shapes: Record<string, string> = {
    'Aries': 'Diamond or Triangular',
    'Taurus': 'Round or Square',
    'Gemini': 'Oval',
    'Cancer': 'Round',
    'Leo': 'Oval or Broad forehead',
    'Virgo': 'Oval',
    'Libra': 'Oval or Heart',
    'Scorpio': 'Square or Intense',
    'Sagittarius': 'Long or Oval',
    'Capricorn': 'Square or Bony',
    'Aquarius': 'Oval or Unique',
    'Pisces': 'Round or Soft'
  };
  return shapes[sign] || 'Oval';
}
export interface LordPlacementInterpretation {
  description: string;
  impactScore: number; // -1 to 1 (Negative to Positive)
  riskFactors: string[];
}

export function getSeventhLordPlacementInterpretation(lord: Planet, houseNumber: number): LordPlacementInterpretation {
  let description = '';
  let impactScore = 0;
  let riskFactors: string[] = [];

  switch (houseNumber) {
    case 1:
      description = `7th Lord in the 1st House indicates a strong connection between you and your partner. Relationships are a core part of your identity. You may seek a partner who reflects your own personality or ideals.`;
      impactScore = 0.8;
      break;
    case 2:
      description = `7th Lord in the 2nd House suggests wealth accumulation through marriage or a partner from a wealthy family. However, it can also indicate possessiveness or family interference in relationships.`;
      impactScore = 0.5;
      break;
    case 3:
      description = `7th Lord in the 3rd House indicates a partner who is communicative, courageous, or perhaps a neighbor/childhood friend. It can also suggest struggles or efforts required to maintain relationship harmony.`;
      impactScore = 0.4;
      break;
    case 4:
      description = `7th Lord in the 4th House brings domestic happiness and a partner who is nurturing. It connects marriage with home life, emotional security, and property. A strong placement here suggests a happy married life.`;
      impactScore = 0.9;
      break;
    case 5:
      description = `7th Lord in the 5th House is a classic indicator of love marriage or a romantic, creative partner. It suggests a strong intellectual and emotional bond, though it can sometimes delay marriage if afflicted.`;
      impactScore = 0.8;
      break;
    case 6:
      description = `7th Lord in the 6th House is challenging (Dusthana). It can indicate conflict, disagreements, or a partner with health issues. Relationships may require significant effort, service, or resolving debts/disputes.`;
      impactScore = -0.6;
      riskFactors.push('Potential for Conflict/Separation');
      break;
    case 7:
      description = `7th Lord in the 7th House (Swakshetra/Own House) is excellent (if not afflicted). It creates a "Maha Purusha Yoga" potential, indicating a strong, supportive, and stable marriage with a capable partner.`;
      impactScore = 1.0;
      break;
    case 8:
      description = `7th Lord in the 8th House is a difficult placement (Dusthana). It connects marriage with secrecy, transformation, or sudden events. It can indicate financial gains from partner but often brings emotional intensity or longevity concerns for the relationship.`;
      impactScore = -0.7;
      riskFactors.push('Secrecy/Transformation Challenges');
      break;
    case 9:
      description = `7th Lord in the 9th House is highly auspicious (Bhagya). It suggests a lucky partner, spiritual connection, or benefits from marriage. The partner may be from a different culture or bring wisdom and prosperity.`;
      impactScore = 0.95;
      break;
    case 10:
      description = `7th Lord in the 10th House specifically connects marriage with career and public status. Your partner may be career-oriented, successful, or you may meet them through work. Marriage enhances your social standing.`;
      impactScore = 0.85;
      break;
    case 11:
      description = `7th Lord in the 11th House indicates gains through marriage, fulfillment of desires, and a friendly relationship with the spouse. The partner may be from a large social circle or bring financial benefits.`;
      impactScore = 0.9;
      break;
    case 12:
      description = `7th Lord in the 12th House is a sensitive placement (Dusthana). It can indicate separation, loss, or a partner from a foreign land. On the positive side, it can show strong bed pleasures (Sayana Sukha) but requires care to avoid emotional distance.`;
      impactScore = -0.5;
      riskFactors.push('Potential for Separation/Distance');
      break;
    default:
      description = `7th Lord placement in House ${houseNumber} provides unique karmic influences.`;
      impactScore = 0;
  }

  return { description, impactScore, riskFactors };
}

function getSkinTexture(sign: Sign): string {
  const textures: Record<string, string> = {
    'Aries': 'Ruddy, may have marks',
    'Taurus': 'Soft, smooth',
    'Gemini': 'Fair, dry',
    'Cancer': 'Pale, soft',
    'Leo': 'Golden, glowing',
    'Virgo': 'Smooth, pale',
    'Libra': 'Fair, balanced',
    'Scorpio': 'Oily or intense',
    'Sagittarius': 'Glowing, healthy',
    'Capricorn': 'Dry, wrinkly',
    'Aquarius': 'Dry, electric',
    'Pisces': 'Soft, lustrous'
  };
  return textures[sign] || 'Normal';
}
