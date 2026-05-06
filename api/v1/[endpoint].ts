/**
 * POST /api/v1/[endpoint]
 * Single router for all 22 Vedic Astrology API endpoints.
 * Consolidates into one Vercel function to stay within Hobby plan limits.
 */
import birthChart from './_birth-chart';
import compatibility from './_compatibility';
import doshaCheck from './_dosha-check';
import fullReport from './_full-report';
import marriageTiming from './_marriage-timing';
import synastry from './_synastry';
import navamsa from './_navamsa';
import kpAnalysis from './_kp-analysis';
import jaiminiDasha from './_jaimini-dasha';
import selfAnalysis from './_self-analysis';
import divorceRisk from './_divorce-risk';
import infidelityRisk from './_infidelity-risk';
import sexualCompatibility from './_sexual-compatibility';
import sexualHealth from './_sexual-health';
import mentalHealth from './_mental-health';
import psychologicalProfile from './_psychological-profile';
import conflictZones from './_conflict-zones';
import vulnerabilityWindows from './_vulnerability-windows';
import inlawAnalysis from './_inlaw-analysis';
import spousePrediction from './_spouse-prediction';
import modernChallenges from './_modern-challenges';
import remedies from './_remedies';

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
