import { CompatibilityReport, Chart, PlanetaryPosition, ChartData } from '@types';
import { calculateAshtakavarga } from '../ashtakavarga.js';

/**
 * Context builder for the AstroMind chat.
 *
 * This used to emit a ~30-line summary: two ascendants, two Moon signs, four
 * scores and three bullet points. The assistant could therefore only paraphrase
 * the verdict — asked "why is my Saturn a problem?" it had no Saturn to look at,
 * so it either refused or invented one.
 *
 * It now receives the actual chart: every planet with sign, house, degree,
 * nakshatra, pada, dignity and motion; the divisional charts that matter for
 * marriage; Ashtakavarga bindus per house; yogas; the running dasha; and the
 * Jaimini/KP marriage significators — for BOTH people. That is what lets it
 * reason from placements instead of restating the score.
 */

const SHORT_SIGN: Record<string, string> = {
  Aries: 'Ar', Taurus: 'Ta', Gemini: 'Ge', Cancer: 'Cn', Leo: 'Le', Virgo: 'Vi',
  Libra: 'Li', Scorpio: 'Sc', Sagittarius: 'Sg', Capricorn: 'Cp', Aquarius: 'Aq', Pisces: 'Pi',
};

const SHORT_PLANET: Record<string, string> = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju',
  Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
};

/**
 * The nine grahas. The engine also tracks Uranus, Neptune and Pluto, but they
 * have no place in a Parashari reading — leaving them in the context invited
 * the assistant to build classical-sounding arguments on planets that carry no
 * classical rulership, dignity or aspect.
 */
const GRAHAS = new Set(Object.keys(SHORT_PLANET));
const isGraha = (p: { planet: string }) => GRAHAS.has(p.planet);

/** "Su Li-7 12°04' Swati-3 own R" — one planet, everything that matters. */
function planetLine(p: PlanetaryPosition): string {
  const deg = Math.floor(p.signDegree ?? 0);
  const min = Math.round((((p.signDegree ?? 0) - deg) * 60));
  const flags = [
    p.isRetrograde ? 'retrograde' : '',
    p.isCombust ? 'combust' : '',
  ].filter(Boolean).join(', ');
  return `- ${p.planet}: ${p.sign} (house ${p.house}) ${deg}°${String(min).padStart(2, '0')}'` +
    ` | ${p.nakshatra} pada ${p.nakshatraPada} | dignity: ${p.dignity}` +
    (flags ? ` | ${flags}` : '');
}

/** "Su:Li Mo:Ta Ma:Cp …" — a whole divisional chart on one line. */
function vargaLine(data: ChartData | undefined): string {
  if (!data?.planetaryPositions?.length) return 'not available';
  return data.planetaryPositions
    .filter(isGraha)
    .map(p => `${SHORT_PLANET[p.planet] ?? p.planet}:${SHORT_SIGN[p.sign] ?? p.sign}`)
    .join(' ') + ` | Lagna ${SHORT_SIGN[data.ascendant] ?? data.ascendant}`;
}

function ashtakavargaLine(chart: Chart): string {
  try {
    const av = calculateAshtakavarga(chart);
    const perHouse = av.sarva.byHouse.map((b, i) => `H${i + 1}:${b}`).join(' ');
    return `${perHouse} (average is 28; 30+ is strong, under 25 needs care)`;
  } catch {
    return 'not available';
  }
}

function currentDasha(chart: Chart): string {
  const dashas: any[] = (chart as any).dashas || [];
  const maha = dashas.find((d: any) => d.isCurrent);
  if (!maha) return 'not available';
  const antar = (maha.subPeriods || []).find((d: any) => d.isCurrent);
  const praty = antar ? (antar.subPeriods || []).find((d: any) => d.isCurrent) : null;
  const parts = [`${maha.planet} mahadasha`];
  if (antar) parts.push(`${antar.planet} antardasha`);
  if (praty) parts.push(`${praty.planet} pratyantardasha`);
  const end = maha.endDate ? new Date(maha.endDate).getFullYear() : null;
  return parts.join(' → ') + (end ? ` (mahadasha runs to ${end})` : '');
}

function personBlock(chart: Chart, label: string): string {
  const dob = chart.dateOfBirth instanceof Date ? chart.dateOfBirth : new Date(chart.dateOfBirth);
  const yogas = (chart.yogas || []).map((y: any) => y.name).filter(Boolean);
  const sp = chart.specialPoints || ({} as any);
  const v = chart.vargaCharts || ({} as any);

  // The 7th cusp sub-lord is THE KP marriage significator — worth naming.
  const cusp7 = (chart.kp?.cusps || []).find((c: any) => c.cusp === 7 || c.house === 7) as any;

  return `
### ${label}: ${chart.name} (${chart.gender})
Born ${dob.toISOString().split('T')[0]} at ${chart.timeOfBirth}, ${chart.location}
Ascendant: ${chart.ascendant}${chart.ascendantDegree != null ? ` (${chart.ascendantDegree.toFixed(2)}°)` : ''} | Birth star: ${chart.nakshatra || 'unknown'}

PLANETS (D1 Rashi):
${(chart.planetaryPositions || []).filter(isGraha).map(planetLine).join('\n')}

DIVISIONAL CHARTS:
- D9 Navamsa (marriage, inner strength): ${vargaLine(v.D9)}
- D7 Saptamsa (children): ${vargaLine(v.D7)}
- D10 Dasamsa (career): ${vargaLine(v.D10)}
- D6 Shashtamsa (health): ${vargaLine(v.D6)}
- D30 Trimsamsa (misfortune): ${vargaLine(v.D30)}
- D60 Shashtiamsa (karmic depth): ${vargaLine(v.D60)}

SARVASHTAKAVARGA (bindus per house): ${ashtakavargaLine(chart)}

CURRENT DASHA: ${currentDasha(chart)}

YOGAS PRESENT: ${yogas.length ? yogas.join(', ') : 'none detected'}

JAIMINI / KP MARRIAGE POINTS:
- Atmakaraka (soul): ${sp.atmakaraka || 'unknown'}
- Darakaraka (spouse): ${sp.darakaraka || 'unknown'}
- Upapada Lagna (marriage): ${sp.upapadaLagna || 'unknown'}
- 7th cusp sub-lord: ${cusp7?.subLord || 'unknown'}`;
}

export const getReportContext = (report: CompatibilityReport): string => {
  const a = report.chartA as unknown as Chart;
  const b = report.chartB as unknown as Chart;

  const koot = report.ashtakoot?.parameters || ({} as any);
  const kootLines = Object.keys(koot).length
    ? Object.entries(koot)
        .map(([name, k]: [string, any]) =>
          `- ${name}: ${k?.obtainedPoints ?? '?'}/${k?.maxPoints ?? '?'}` +
          (k?.boyValue || k?.girlValue ? ` (${k.boyValue} × ${k.girlValue})` : ''))
        .join('\n')
    : 'not available';

  return `
# COMPLETE CHART DATA — you may reason from any of this.

${personBlock(a, 'PERSON A')}

${personBlock(b, 'PERSON B')}

---

## MATCH RESULT

Overall: ${report.overallScore}/100 (${report.overallVerdict})
Ashtakoot: ${report.ashtakoot?.totalScore}/36
Sexual chemistry: ${report.sexualCompatibility?.overallScore}/100
Divorce risk: ${report.riskAssessment?.divorceProbability?.level} (score ${report.riskAssessment?.divorceProbability?.score})

ASHTAKOOT BREAKDOWN (the eight kootas):
${kootLines}

DOSHAS:
- Manglik: ${report.riskAssessment?.manglikAnalysis?.compatibility || 'neutral'}
- Nadi dosha: ${report.ashtakoot?.doshas?.nadiDosha ? 'PRESENT' : 'absent'}
- Bhakoot dosha: ${report.ashtakoot?.doshas?.bhakootDosha ? 'PRESENT' : 'absent'}

STRENGTHS:
${(report.executiveSummary?.strengths || []).map((s: string) => `- ${s}`).join('\n') || '- none listed'}

CHALLENGES:
${(report.executiveSummary?.challenges || []).map((c: string) => `- ${c}`).join('\n') || '- none listed'}
`;
};
