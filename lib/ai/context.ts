import { CompatibilityReport } from '@types';

export const getReportContext = (report: CompatibilityReport): string => {
  const getDasha = (dashas: any[]) => dashas.find((d: any) => d.isCurrent)?.planet || 'Unknown';

  return `
### 📜 ASTROLOGICAL REPORT SUMMARY

**COUPLE:**
- ${report.chartA.name} (${report.chartA.gender})
  - Ascendant: ${report.chartA.ascendant}
  - Moon Sign: ${report.ashtakoot.parameters.nadi.boyValue || 'Unknown'}
  - Current Dasha: ${getDasha(report.chartA.dashas)}
- ${report.chartB.name} (${report.chartB.gender})
  - Ascendant: ${report.chartB.ascendant}
  - Moon Sign: ${report.ashtakoot.parameters.nadi.girlValue || 'Unknown'}
  - Current Dasha: ${getDasha(report.chartB.dashas)}

**CORE SCORES:**
- Overall Compatibility: ${report.overallScore}/100 (${report.overallVerdict})
- Ashtakoot (Vedic): ${report.ashtakoot.totalScore}/36
- Risk Level: ${report.riskAssessment.divorceProbability.level.toUpperCase()}
- Sexual Chemistry: ${report.sexualCompatibility.overallScore}/100

**KEY DOSHAS & RISKS:**
- Manglik: ${report.riskAssessment.manglikAnalysis?.compatibility || 'Neutral'}
- Nadi Dosha: ${report.ashtakoot.doshas.nadiDosha ? 'PRESENT' : 'Absent'}
- Bhakoot Dosha: ${report.ashtakoot.doshas.bhakootDosha ? 'PRESENT' : 'Absent'}
- Divorce Risk: ${report.riskAssessment.divorceProbability.level} (Score: ${report.riskAssessment.divorceProbability.score})

**STRENGTHS:**
${report.executiveSummary.strengths.slice(0, 3).map((s: string) => `- ${s}`).join('\n')}

**CHALLENGES:**
${report.executiveSummary.challenges.slice(0, 3).map((c: string) => `- ${c}`).join('\n')}
`;
};
