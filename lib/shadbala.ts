/**
 * Shadbala — six-fold planetary strength (Sthana, Dig, Kala, Cheshta,
 * Naisargika, Drik), measured in virupas (60 virupas = 1 rupa).
 * ---------------------------------------------------------------------------
 * IMPORTANT — scope. A fully classical Shadbala needs data this engine does
 * not expose (planetary DECLINATION for Ayana Bala; precise LOCAL SUNRISE for
 * the day/night Kala components; planetary-war geometry for Yuddha Bala). So
 * this implementation computes the components that ARE well-determined from
 * the available chart and clearly marks what is approximated or omitted via
 * the `completeness` field. The reported total is therefore a documented
 * LOWER BOUND, not a complete classical Shadbala — treat it as indicative.
 */
import { Chart, Planet, Sign } from '../src/types/index.js';
import { SIGNS } from './coreCalculations.js';

const GRAHAS: Planet[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

/** Naisargika (natural) bala in virupas — fixed constants. */
const NAISARGIKA: Record<string, number> = {
  Sun: 60, Moon: 51.43, Venus: 42.85, Jupiter: 34.28, Mercury: 25.70, Mars: 17.14, Saturn: 8.57,
};

/** Deep-exaltation longitude (degrees 0..360) for Uccha Bala. */
const DEEP_EXALTATION: Record<string, number> = {
  Sun: 10, Moon: 33, Mars: 298, Mercury: 165, Jupiter: 95, Venus: 357, Saturn: 200,
};

/** House (from Lagna) where each planet has ZERO directional strength. */
const DIG_POWERLESS_HOUSE: Record<string, number> = {
  Sun: 4, Mars: 4, Moon: 10, Venus: 10, Jupiter: 7, Mercury: 7, Saturn: 1,
};

/** Minimum Shadbala (rupas) a planet should have to be judged strong. */
const REQUIRED_RUPAS: Record<string, number> = {
  Sun: 5, Moon: 6, Mars: 5, Mercury: 7, Jupiter: 6.5, Venus: 5.5, Saturn: 5,
};

const BENEFICS = new Set<Planet>(['Jupiter', 'Venus', 'Mercury', 'Moon']);
const MALE = new Set<Planet>(['Sun', 'Mars', 'Jupiter']);
const FEMALE = new Set<Planet>(['Moon', 'Venus']);
// The seven vargas used for Saptavargaja bala.
const SAPTAVARGA: Array<'D1' | 'D2' | 'D3' | 'D7' | 'D9' | 'D12' | 'D30'> = ['D1', 'D2', 'D3', 'D7', 'D9', 'D12', 'D30'];

const norm180 = (deg: number): number => {
  let a = ((deg % 360) + 360) % 360;
  if (a > 180) a = 360 - a;
  return a;
};

const lonOf = (chart: Chart, p: Planet): number =>
  chart.planetaryPositions.find(pp => pp.planet === p)?.longitude ?? 0;

const houseOf = (chart: Chart, p: Planet): number =>
  chart.planetaryPositions.find(pp => pp.planet === p)?.house ?? 1;

/** Approximate Saptavargaja from each varga's dignity (no temporal friendship). */
function saptavargajaVirupas(chart: Chart, planet: Planet): number {
  const dignityVirupa = (d?: string): number => {
    switch (d) {
      case 'exalted': return 45;
      case 'moolatrikona': return 45;
      case 'own': case 'own_house': return 30;
      case 'friendly': return 15;
      case 'neutral': return 7.5;
      case 'enemy': return 3.75;
      case 'debilitated': return 1.875;
      default: return 7.5; // treat unknown as neutral
    }
  };
  let sum = 0;
  for (const v of SAPTAVARGA) {
    const pos = (chart.vargaCharts as any)?.[v]?.planetaryPositions?.find((pp: any) => pp.planet === planet);
    sum += dignityVirupa(pos?.dignity);
  }
  return Math.round(sum * 100) / 100;
}

export interface ShadbalaPlanet {
  sthana: { uccha: number; saptavargaja: number; ojayugma: number; kendradi: number; drekkana: number; total: number };
  dig: number;
  kala: { paksha: number; nathonnatha: number; total: number };
  cheshta: number;
  naisargika: number;
  totalVirupas: number;
  totalRupas: number;
  requiredRupas: number;
  ratio: number;
  meetsRequirement: boolean;
}

export interface ShadbalaResult {
  planets: Record<string, ShadbalaPlanet>;
  completeness: {
    fullyComputed: string[];
    approximated: string[];
    omitted: string[];
    note: string;
  };
}

export function calculateShadbala(chart: Chart): ShadbalaResult {
  const ascDeg = chart.ascendantDegree ?? 0;
  const sunLon = lonOf(chart, 'Sun');
  const moonLon = lonOf(chart, 'Moon');
  const elong = norm180(moonLon - sunLon); // 0..180 Sun–Moon separation

  // Rough day/night from birth hour (true Nathonnatha needs local sunrise).
  const hour = Number(String(chart.timeOfBirth || '12:00').split(':')[0]) || 12;
  const isDay = hour >= 6 && hour < 18;

  const planets: Record<string, ShadbalaPlanet> = {};

  for (const p of GRAHAS) {
    const lon = lonOf(chart, p);
    const house = houseOf(chart, p);

    // ── Sthana Bala ──
    const uccha = Math.round((norm180(lon - ((DEEP_EXALTATION[p] + 180) % 360)) / 3) * 100) / 100; // 0..60
    const saptavargaja = saptavargajaVirupas(chart, p);
    // Ojayugma: Moon & Venus want even (yugma) signs; others odd (oja); in D1 and D9.
    const wantsEven = p === 'Moon' || p === 'Venus';
    const oddEven = (signIndex: number) => (signIndex % 2 === 0); // 0-based even index = odd sign (Aries...)
    const d1SignIdx = Math.floor(lon / 30);
    const d9SignIdx = SIGNS.indexOf((chart.vargaCharts as any)?.D9?.planetaryPositions?.find((pp: any) => pp.planet === p)?.sign as Sign);
    const ojaD1 = oddEven(d1SignIdx) === !wantsEven ? 15 : 0;
    const ojaD9 = d9SignIdx >= 0 && (oddEven(d9SignIdx) === !wantsEven) ? 15 : 0;
    const ojayugma = ojaD1 + ojaD9;
    const kendradi = [1, 4, 7, 10].includes(house) ? 60 : [2, 5, 8, 11].includes(house) ? 30 : 15;
    const degInSign = lon % 30;
    const drekIdx = Math.floor(degInSign / 10); // 0,1,2
    const drekkana = ((MALE.has(p) && drekIdx === 0) || (FEMALE.has(p) && drekIdx === 2) ||
      (!MALE.has(p) && !FEMALE.has(p) && drekIdx === 1)) ? 15 : 0;
    const sthanaTotal = Math.round((uccha + saptavargaja + ojayugma + kendradi + drekkana) * 100) / 100;

    // ── Dig Bala ── distance from the planet's powerless house-cusp / 3.
    const powerlessCusp = (ascDeg + (DIG_POWERLESS_HOUSE[p] - 1) * 30) % 360;
    const dig = Math.round((norm180(lon - powerlessCusp) / 3) * 100) / 100; // 0..60

    // ── Kala Bala (partial) ──
    const beneficPaksha = (elong / 180) * 60;
    let paksha = BENEFICS.has(p) ? beneficPaksha : 60 - beneficPaksha;
    if (p === 'Moon') paksha *= 2; // Moon's paksha bala is doubled
    paksha = Math.round(paksha * 100) / 100;
    // Nathonnatha: Moon/Mars/Saturn strong at night; Sun/Jupiter/Venus by day; Mercury always full.
    const nightStrong = p === 'Moon' || p === 'Mars' || p === 'Saturn';
    const nathonnatha = p === 'Mercury' ? 60 : (isDay !== nightStrong ? 60 : 0);
    const kalaTotal = Math.round((paksha + nathonnatha) * 100) / 100;

    // ── Cheshta Bala (approx from motion) ── Sun uses ayana≈paksha proxy, Moon uses paksha.
    const posRec = chart.planetaryPositions.find(pp => pp.planet === p);
    let cheshta: number;
    if (p === 'Sun') cheshta = Math.round((norm180(lon - ((DEEP_EXALTATION.Sun + 180) % 360)) / 3) * 100) / 100;
    else if (p === 'Moon') cheshta = paksha / (1); // Moon's cheshta = its paksha bala
    else cheshta = posRec?.isRetrograde ? 60 : 30; // retrograde strong; direct = mid (true value needs cheshta-kendra)
    cheshta = Math.round(cheshta * 100) / 100;

    const naisargika = NAISARGIKA[p];

    const totalVirupas = Math.round((sthanaTotal + dig + kalaTotal + cheshta + naisargika) * 100) / 100;
    const totalRupas = Math.round((totalVirupas / 60) * 100) / 100;
    const requiredRupas = REQUIRED_RUPAS[p];

    planets[p] = {
      sthana: { uccha, saptavargaja, ojayugma, kendradi, drekkana, total: sthanaTotal },
      dig,
      kala: { paksha, nathonnatha, total: kalaTotal },
      cheshta,
      naisargika,
      totalVirupas,
      totalRupas,
      requiredRupas,
      ratio: Math.round((totalRupas / requiredRupas) * 100) / 100,
      meetsRequirement: totalRupas >= requiredRupas,
    };
  }

  return {
    planets,
    completeness: {
      fullyComputed: [
        'Sthana Bala (Uccha, Ojayugma, Kendradi, Drekkana)',
        'Dig Bala',
        'Naisargika Bala',
      ],
      approximated: [
        'Sthana → Saptavargaja Bala (from each varga\'s dignity; no temporal friendship table)',
        'Kala → Paksha Bala',
        'Kala → Nathonnatha Bala (day/night inferred from birth hour, not local sunrise)',
        'Cheshta Bala (from retrograde/motion state, not the exact cheshta-kendra arc)',
      ],
      omitted: [
        'Kala → Ayana Bala (needs planetary declination)',
        'Kala → Tribhaga / Varsha / Masa / Dina / Hora / Yuddha Bala',
        'Drik Bala (aspectual)',
      ],
      note: 'This is a scoped Shadbala: the total is a documented lower bound, not a complete classical six-fold strength. Components needing declination, precise sunrise, or full aspect geometry are omitted or approximated and listed above. Use the per-component virupas rather than treating the total as authoritative.',
    },
  };
}
