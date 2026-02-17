import { Chart, BirthDataInput, Planet } from '@types';
import { findMarriageWindows } from './dashaCalculations';

export async function calculateTimingAnalysis(birthData: BirthDataInput, chart: Chart): Promise<any> {
  const now = new Date();

  // Find current Mahadasha and Antardasha from chart.dashas
  const currentMahaDasha = (chart.dashas || []).find((d: any) => now >= new Date(d.startDate) && now < new Date(d.endDate));
  const currentAntardasha = currentMahaDasha?.subPeriods?.find((sd: any) => now >= new Date(sd.startDate) && now < new Date(sd.endDate));

  // Prepare chart data for logic
  const seventhLord = chart.houses.find(h => h.houseNumber === 7)?.lord || 'Venus' as Planet;
  const secondLord = chart.houses.find(h => h.houseNumber === 2)?.lord;
  const eleventhLord = chart.houses.find(h => h.houseNumber === 11)?.lord;

  const venusPosition = chart.planetaryPositions.find((p: any) => p.planet === 'Venus') || { house: 7 };
  const jupiterPosition = chart.planetaryPositions.find((p: any) => p.planet === 'Jupiter') || { house: 1 };

  // Generate favorable windows using actual dasha engine
  const favorablePeriods = findMarriageWindows(
    { moonNakshatra: chart.nakshatra as any, mahaDashas: chart.dashas || [] },
    [], // Chara dasha handled separately in generator
    {
      seventhLord,
      secondLord,
      eleventhLord,
      venusPosition: { house: venusPosition.house },
      jupiterPosition: { house: jupiterPosition.house }
    },
    now
  );

  return {
    currentDasha: {
      planet: currentMahaDasha?.planet || 'Unknown',
      mahadasha: `${currentMahaDasha?.planet || 'Unknown'} - ${currentAntardasha?.planet || 'Unknown'}`,
      startDate: currentMahaDasha?.startDate || now,
      endDate: currentMahaDasha?.endDate || now
    },
    favorablePeriods: favorablePeriods.map(p => ({
      startDate: p.startDate,
      endDate: p.endDate,
      confidence: p.confidence,
      description: p.description
    })),
    transitNotes: []
  };
}
