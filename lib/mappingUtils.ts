import {
  PlanetaryPosition,
  Planet,
  Sign,
  House,
  ChartData,
  DashaPeriod
} from '../src/types';
import {
  PlanetPosition as AstroPlanetPosition,
  ZODIAC_SIGNS,
  getSignLord
} from '../src/lib/astro/calculations';

/**
 * Robust mapping of raw planet data to UI types with high precision.
 */
export function mapPlanetPosition(p: AstroPlanetPosition): PlanetaryPosition {
  return {
    planet: p.planet as Planet,
    longitude: p.longitude,
    latitude: 0, // Not calculated in simplified model yet
    speed: p.speed,
    house: p.house,
    sign: p.sign as Sign,
    signDegree: p.degree + p.minute / 60 + (p.second || 0) / 3600,
    nakshatra: p.nakshatra as any,
    nakshatraPada: p.nakshatraPada,
    isRetrograde: p.isRetrograde,
    isCombust: false, // Placeholder
    dignity: p.dignity as any || 'neutral'
  };
}

/**
 * Consistent house mapping.
 */
export function mapHouses(data: { houses: any[], planets: any[] }): House[] {
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

/**
 * Standardized varga chart mapping.
 */
export function mapVargaData(varga: any): ChartData {
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

/**
 * Unified dasha period mapping.
 */
export function mapDashaPeriod(d: any, currentDashaPlanets: string[] = []): DashaPeriod {
  return {
    planet: d.planet as Planet,
    startDate: d.startDate,
    endDate: d.endDate,
    durationYears: d.years,
    isCurrent: currentDashaPlanets.includes(d.planet),
    subPeriods: d.subPeriods?.map((s: any) => mapDashaPeriod(s, currentDashaPlanets))
  };
}
