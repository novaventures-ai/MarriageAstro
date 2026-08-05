/**
 * Full Kundali aggregator
 * ---------------------------------------------------------------------------
 * Assembles the *complete* computed picture of a single chart into one payload:
 * every divisional chart (D1–D60), all yogas & doshas, KP (sub-lords /
 * significators), the full Jaimini set (Chara Karakas, Darakaraka, Upapada,
 * Vivah Saham, Chara Dasha), Vimshopaka / Shodashvarga strength, and the
 * Vimshottari dasha tree (3 levels for all time + the active branch drilled to
 * Prana, level 5).
 *
 * This is pure calculation — no AI, deterministic. It powers the `detail:full`
 * mode of the birth-chart endpoint / MCP tool.
 */
import { Chart, Planet, Nakshatra } from '../src/types/index.js';
import { calculateExtendedDivisionalAnalysis, calculateKPAnalysis } from './extendedCalculations.js';
import { analyzeYogaDoshas } from './yogaDoshaCalculations.js';
import {
  calculateCharaKarakasUnified,
  analyzeDarakaraka,
  calculateUpapadaLagna,
  calculateVivahSaham,
  calculateDetailedCharaDasha,
  checkMultipleMarriageIndicators,
} from './jaiminiCalculations.js';
import { drillActiveDashaChain } from './dashaCalculations.js';
import { calculateAshtakavarga } from './ashtakavarga.js';

const lon = (chart: Chart, planet: Planet): number =>
  chart.planetaryPositions.find(p => p.planet === planet)?.longitude ?? 0;

export function assembleFullKundali(chart: Chart) {
  // ── Extended divisional strength (Vimshopaka, D60 deities, Shodashvarga …) ──
  const extended = calculateExtendedDivisionalAnalysis(chart);

  // ── KP (Krishnamurti Paddhati) full sub-lord analysis ──
  let kpFull: unknown;
  try {
    kpFull = calculateKPAnalysis(chart);
  } catch {
    kpFull = null;
  }

  // ── Yogas & Doshas (full structured analysis) ──
  let yogaDosha: unknown;
  try {
    yogaDosha = analyzeYogaDoshas(chart);
  } catch {
    yogaDosha = null;
  }

  // ── Jaimini ──
  const karakas = calculateCharaKarakasUnified(chart.planetaryPositions as any);
  const dkPlanet = chart.specialPoints?.darakaraka as Planet | undefined;
  const dkPos = dkPlanet ? chart.planetaryPositions.find(p => p.planet === dkPlanet) : undefined;
  const darakaraka = dkPlanet
    ? analyzeDarakaraka(dkPlanet, { sign: dkPos?.sign || 'Libra', house: dkPos?.house || 7 })
    : null;

  const upapada = calculateUpapadaLagna(
    chart.ascendantDegree || 0,
    chart.houses.map(h => ({ sign: h.sign, cuspLongitude: h.cuspLongitude })),
  );

  const vivahSaham = calculateVivahSaham(lon(chart, 'Venus'), lon(chart, 'Sun'), chart.ascendantDegree || 0);

  const charaDasha = calculateDetailedCharaDasha(
    chart.ascendant,
    chart.planetaryPositions.map(p => ({ planet: p.planet, longitude: p.longitude })),
    chart.dateOfBirth,
  );

  const seventhHousePlanets = (chart.houses.find(h => h.houseNumber === 7)?.planets || []) as Planet[];
  const multipleMarriage = checkMultipleMarriageIndicators(upapada, seventhHousePlanets);

  // ── Ashtakavarga (BAV per planet + SAV), with per-house bindus ──
  let ashtakavarga: unknown;
  try {
    ashtakavarga = calculateAshtakavarga(chart);
  } catch {
    ashtakavarga = null;
  }

  // ── Vimshottari dasha: full 3-level tree + active branch drilled to Prana ──
  const activeChainDeep = drillActiveDashaChain(
    chart.nakshatra as Nakshatra,
    lon(chart, 'Moon'),
    chart.dateOfBirth,
  );

  return {
    meta: {
      name: chart.name,
      gender: chart.gender,
      dateOfBirth: chart.dateOfBirth,
      timeOfBirth: chart.timeOfBirth,
      location: chart.location,
      latitude: chart.latitude,
      longitude: chart.longitude,
      timezone: chart.timezone,
      ayanamsha: chart.ayanamsha,
    },

    // ── Core D1 chart ──
    ascendant: chart.ascendant,
    ascendantDegree: chart.ascendantDegree,
    planets: chart.planetaryPositions,
    houses: chart.houses,
    nakshatra: {
      moonNakshatra: chart.nakshatra,
      nakshatraLord: chart.nakshatraLord,
      pada: chart.pada,
    },

    // ── All 17 divisional charts (D1–D60) ──
    divisionalCharts: chart.vargaCharts,

    // ── Divisional strength & interpretation ──
    strength: {
      vimshopaka: extended.vimshopakaScores,
      shodashvarga: extended.shodashvarga,
      d60Deities: extended.d60Deities,
      navamsaHouseMeanings: extended.navamsaHouseMeanings,
      d7: extended.d7Full,
      d9: extended.d9Full,
    },

    // ── Yogas & Doshas ──
    yogas: chart.yogas,
    yogaDoshaAnalysis: yogaDosha,

    // ── Ashtakavarga (transit-strength point system; per sign and per house) ──
    ashtakavarga,

    // ── KP (Krishnamurti Paddhati) ──
    kp: {
      cusps: chart.kp?.cusps || [],
      significators: chart.kp?.significators || [],
      analysis: kpFull,
    },

    // ── Jaimini ──
    jaimini: {
      charaKarakas: karakas,
      darakaraka: { planet: dkPlanet ?? null, analysis: darakaraka },
      upapadaLagna: upapada,
      vivahSaham,
      charaDasha,
      multipleMarriageIndicators: multipleMarriage,
      d9Analysis: extended.jaiminiD9Analysis,
      arudhaPadas: extended.arudhaPadas,
      atmakaraka: chart.specialPoints?.atmakaraka ?? null,
    },

    // ── Vimshottari Dasha (major + very-minor) ──
    dashas: {
      // Full Maha → Antar → Pratyantar tree for the whole life
      vimshottariTree: chart.dashas,
      // Currently-running branch drilled Maha → Antar → Pratyantar → Sookshma → Prana,
      // with every Sookshma of the current Pratyantar and every Prana of the current Sookshma.
      activeChainToPrana: activeChainDeep,
    },

    // ── Special points ──
    specialPoints: chart.specialPoints,
  };
}
