/**
 * POST /api/v1/[endpoint]
 * Single router for all 22 Vedic Astrology API endpoints.
 * Consolidates into one Vercel function to stay within Hobby plan limits.
 */
import birthChart from './_birth-chart.js';
import compatibility from './_compatibility.js';
import doshaCheck from './_dosha-check.js';
import fullReport from './_full-report.js';
import marriageTiming from './_marriage-timing.js';
import synastry from './_synastry.js';
import navamsa from './_navamsa.js';
import kpAnalysis from './_kp-analysis.js';
import jaiminiDasha from './_jaimini-dasha.js';
import selfAnalysis from './_self-analysis.js';
import divorceRisk from './_divorce-risk.js';
import infidelityRisk from './_infidelity-risk.js';
import sexualCompatibility from './_sexual-compatibility.js';
import sexualHealth from './_sexual-health.js';
import mentalHealth from './_mental-health.js';
import psychologicalProfile from './_psychological-profile.js';
import conflictZones from './_conflict-zones.js';
import vulnerabilityWindows from './_vulnerability-windows.js';
import inlawAnalysis from './_inlaw-analysis.js';
import spousePrediction from './_spouse-prediction.js';
import modernChallenges from './_modern-challenges.js';
import remedies from './_remedies.js';

const handlers: Record<string, (req: any, res: any) => Promise<any>> = {
  'birth-chart': birthChart,
  'compatibility': compatibility,
  'dosha-check': doshaCheck,
  'full-report': fullReport,
  'marriage-timing': marriageTiming,
  'synastry': synastry,
  'navamsa': navamsa,
  'kp-analysis': kpAnalysis,
  'jaimini-dasha': jaiminiDasha,
  'self-analysis': selfAnalysis,
  'divorce-risk': divorceRisk,
  'infidelity-risk': infidelityRisk,
  'sexual-compatibility': sexualCompatibility,
  'sexual-health': sexualHealth,
  'mental-health': mentalHealth,
  'psychological-profile': psychologicalProfile,
  'conflict-zones': conflictZones,
  'vulnerability-windows': vulnerabilityWindows,
  'inlaw-analysis': inlawAnalysis,
  'spouse-prediction': spousePrediction,
  'modern-challenges': modernChallenges,
  'remedies': remedies,
};

export default async function handler(req: any, res: any) {
  const endpoint = Array.isArray(req.query.endpoint)
    ? req.query.endpoint[0]
    : req.query.endpoint as string;

  const h = handlers[endpoint];
  if (!h) {
    return res.status(404).json({
      error: `Unknown endpoint: ${endpoint}`,
      available: Object.keys(handlers),
    });
  }

  return h(req, res);
}
