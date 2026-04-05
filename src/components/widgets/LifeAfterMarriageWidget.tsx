import React, { useState } from 'react';
import {
  Heart, TrendingUp, Baby, Shield, AlertTriangle,
  Sparkles, Clock, ChevronDown, ChevronUp, Star,
  Activity, Users, Sun, CloudRain
} from 'lucide-react';
import { CompatibilityReport } from '../../types';

interface Props {
  report: CompatibilityReport;
}

// ── Signal chip types ───────────────────────────────────────────────────────

interface SignalChip {
  label: string;
  status: 'good' | 'mixed' | 'weak';
}

interface Domain {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  score: number;
  signals: SignalChip[];
  detail: string;
}

// ── Utility helpers ─────────────────────────────────────────────────────────

function chip(label: string, pts: number, max: number): SignalChip {
  const ratio = max > 0 ? pts / max : 0.5;
  return { label, status: ratio >= 0.7 ? 'good' : ratio >= 0.4 ? 'mixed' : 'weak' };
}

function statusChip(label: string, status: 'positive' | 'neutral' | 'challenging'): SignalChip {
  return { label, status: status === 'positive' ? 'good' : status === 'neutral' ? 'mixed' : 'weak' };
}

function kpPromise(report: CompatibilityReport): 'promised' | 'complicated' | 'denied' | null {
  return report.kpAnalysis?.partnerA.seventhCuspSubLord.marriagePromise ?? null;
}

function getMangalStatus(report: CompatibilityReport): 'neither' | 'both_or_cancelled' | 'one_uncancelled' {
  const m = report.ashtakoot.manglikAnalysis ?? report.riskAssessment.manglikAnalysis;
  if (!m) return 'neither';
  const aM = m.partnerA.isManglik;
  const bM = m.partnerB.isManglik;
  if (!aM && !bM) return 'neither';
  if (aM && bM) return 'both_or_cancelled';
  if ((aM && m.partnerA.isCancelled) || (bM && m.partnerB.isCancelled)) return 'both_or_cancelled';
  return 'one_uncancelled';
}

function wellbeingPts(w: string | undefined, max: number): number {
  if (!w) return max * 0.5;
  if (w === 'strong') return max;
  if (w === 'moderate') return max * 0.6;
  if (w === 'needs_attention') return max * 0.2;
  return 0;
}

function addictionInverted(report: CompatibilityReport, max: number): number {
  const rA = report.addictionRiskAnalysis?.partnerA.overallRisk;
  const rB = report.addictionRiskAnalysis?.partnerB.overallRisk;
  if (!rA && !rB) return max * 0.7;
  if (rA === 'high' || rB === 'high') return 0;
  if (rA === 'moderate' || rB === 'moderate') return max * 0.5;
  return max;
}

function positiveText(text: string | undefined, keywords = ['positive', 'good', 'harmony', 'support', 'bless', 'happy', 'warm', 'loving', 'excellent', 'strong', 'deep']): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  return keywords.some(k => t.includes(k));
}

function riskLevelPts(lvl: string | undefined, max: number): number {
  if (!lvl) return max * 0.5;
  if (lvl === 'low') return max;
  if (lvl === 'moderate') return max * 0.6;
  if (lvl === 'elevated') return max * 0.2;
  return 0;
}

// ── Domain 1: Emotional Happiness (100pts) ──────────────────────────────────

function buildEmotional(report: CompatibilityReport): { score: number; signals: SignalChip[]; detail: string } {
  const signals: SignalChip[] = [];

  const navPts = (report.navamsaMatching.score ?? 50) / 100 * 20;
  signals.push(chip('D9 Navamsa', navPts, 20));

  const gm = report.ashtakoot.parameters.grahaMaitri.pointsObtained;
  const ga = report.ashtakoot.parameters.gana.pointsObtained;
  const ta = report.ashtakoot.parameters.tara.pointsObtained;
  const emotKootPts = (gm / 5 + ga / 6 + ta / 3) / 3 * 20;
  signals.push(chip('Ashtakoot', emotKootPts, 20));

  const kp = kpPromise(report);
  const kpPts = kp === null ? 7.5 : kp === 'promised' ? 15 : kp === 'complicated' ? 8 : 0;
  signals.push(chip('KP Promise', kpPts, 15));

  const soul = report.advancedBreakdown?.soul;
  const soulPts = !soul ? 7.5 : soul.status === 'positive' ? 15 : soul.status === 'neutral' ? 8 : 3;
  signals.push(soul ? statusChip('Jaimini Soul', soul.status) : chip('Jaimini Soul', soulPts, 15));

  const depth = (report.synastry.soulmateConnections?.length ?? 0) + (report.synastry.karmicBonds?.length ?? 0);
  const synPts = depth >= 3 ? 10 : depth === 2 ? 7 : depth === 1 ? 4 : 1;
  signals.push(chip('Synastry', synPts, 10));

  const pA = report.psychologicalProfileA?.attachmentStyle.type;
  const pB = report.psychologicalProfileB?.attachmentStyle.type;
  let attachPts = 5;
  if (pA && pB) {
    if (pA === 'secure' && pB === 'secure') attachPts = 10;
    else if ((pA === 'avoidant' && pB === 'anxious') || (pA === 'anxious' && pB === 'avoidant')) attachPts = 2;
    else attachPts = 6;
  }
  signals.push(chip('Psychology', attachPts, 10));

  const mhA = wellbeingPts(report.mentalHealthAnalysis?.partnerA.overallWellbeing, 5);
  const mhB = wellbeingPts(report.mentalHealthAnalysis?.partnerB.overallWellbeing, 5);
  const mhPts = (mhA + mhB) / 2;
  signals.push(chip('Mental Health', mhPts, 5));

  const rpA = report.relationshipPatternAnalysis?.partnerA.overallRiskLevel;
  const rpB = report.relationshipPatternAnalysis?.partnerB.overallRiskLevel;
  const rpPts = (riskLevelPts(rpA, 5) + riskLevelPts(rpB, 5)) / 2;
  signals.push(chip('Rel. Patterns', rpPts, 5));

  const score = Math.round(Math.min(100, navPts + emotKootPts + kpPts + soulPts + synPts + attachPts + mhPts + rpPts));

  const primary = report.navamsaMatching.maritalHappiness || `Navamsa score ${report.navamsaMatching.score}/100`;
  const supporting: string[] = [];
  if (kp === 'promised') supporting.push('KP 7th cusp confirms marriage promise');
  else if (kp === 'denied') supporting.push('KP 7th cusp raises doubt on fulfillment');
  if (soul?.status === 'positive') supporting.push('Jaimini soul link harmonious');
  else if (soul?.status === 'challenging') supporting.push('Jaimini soul dimension needs work');
  if (pA && pB && (pA !== 'secure' || pB !== 'secure')) supporting.push(`Attachment: ${pA} + ${pB}`);
  const detail = [primary, supporting.join(' · ') || null, `Net emotional strength: ${score}/100`].filter(Boolean).join('\n');

  return { score, signals, detail };
}

// ── Domain 2: Financial Prosperity (100pts) ─────────────────────────────────

function buildProsperity(report: CompatibilityReport): { score: number; signals: SignalChip[]; detail: string } {
  const signals: SignalChip[] = [];

  const secPts = (report.inLawAnalysis.secondHouseScore ?? 5) / 10 * 25;
  signals.push(chip('2nd House', secPts, 25));

  const tenPts = (report.inLawAnalysis.tenthHouseScore ?? 5) / 10 * 15;
  signals.push(chip('10th House', tenPts, 15));

  const bhakoot = report.ashtakoot.parameters.bhakoot;
  const bhkPts = bhakoot.pointsObtained / (bhakoot.maxPoints || 7) * 15;
  signals.push(chip('Bhakoot', bhkPts, 15));

  const stab = report.advancedBreakdown?.stability;
  const stabPts = !stab ? 7.5 : stab.status === 'positive' ? 15 : stab.status === 'neutral' ? 8 : 3;
  signals.push(stab ? statusChip('Stability', stab.status) : chip('Stability', stabPts, 15));

  const career = report.spousePrediction.profession?.careerNature;
  const carMap: Record<string, number> = { Government: 10, Business: 8, Service: 7, 'Self-Employed': 6, Creative: 5 };
  const carPts = career ? (carMap[career] ?? 7) : 7;
  signals.push(chip('Career Type', carPts, 10));

  const addPts = addictionInverted(report, 10);
  signals.push(chip('Addiction Risk', addPts, 10));

  const famPts = positiveText(report.navamsaMatching.familyRelations) ? 5 : 2.5;
  signals.push(chip('D9 Family', famPts, 5));

  const overlays = report.synastry.houseOverlays ?? [];
  const wealthCount = overlays.filter(o => o.house === 2 || o.house === 11).length;
  const overPts = wealthCount >= 3 ? 5 : wealthCount >= 2 ? 4 : wealthCount >= 1 ? 2 : 1;
  signals.push(chip('Synastry Wealth', overPts, 5));

  const score = Math.round(Math.min(100, secPts + tenPts + bhkPts + stabPts + carPts + addPts + famPts + overPts));

  const detail = [
    report.inLawAnalysis.interpretation || `2nd house: ${report.inLawAnalysis.secondHouseScore}/10 · 10th house: ${report.inLawAnalysis.tenthHouseScore}/10`,
    report.ashtakoot.doshas.bhakootDosha ? 'Bhakoot dosha detected — financial tensions possible' : 'No Bhakoot dosha — financial flow supported',
    `Overall prosperity strength: ${score}/100`,
  ].join('\n');

  return { score, signals, detail };
}

// ── Domain 3: Health & Longevity (100pts) ───────────────────────────────────

function buildHealth(report: CompatibilityReport): { score: number; signals: SignalChip[]; detail: string } {
  const signals: SignalChip[] = [];

  const nadiDosha = report.ashtakoot.doshas.nadiDosha;
  const nadiParam = report.ashtakoot.parameters.nadi;
  const nadiPts = nadiDosha ? 0 : nadiParam.pointsObtained / (nadiParam.maxPoints || 8) * 30;
  signals.push(chip('Nadi Koot', nadiPts, 30));

  const mangal = getMangalStatus(report);
  const mangalPts = mangal === 'neither' ? 20 : mangal === 'both_or_cancelled' ? 15 : 4;
  signals.push(chip('Mangal', mangalPts, 20));

  const longevity = report.riskAssessment.spouseLongevity;
  const longevityPts = !longevity ? 7.5 : longevity.score / 100 * 15;
  signals.push(chip('Longevity', longevityPts, 15));

  const mhA = wellbeingPts(report.mentalHealthAnalysis?.partnerA.overallWellbeing, 15);
  const mhB = wellbeingPts(report.mentalHealthAnalysis?.partnerB.overallWellbeing, 15);
  const mhPts = (mhA + mhB) / 2;
  signals.push(chip('Mental Health', mhPts, 15));

  const addPts = addictionInverted(report, 10);
  signals.push(chip('Addiction Risk', addPts, 10));

  const ganaParam = report.ashtakoot.parameters.gana;
  const ganaPts = ganaParam.pointsObtained / (ganaParam.maxPoints || 6) * 5;
  signals.push(chip('Gana Koot', ganaPts, 5));

  const mhChallenges = report.modernChallenges.mentalHealth?.length ?? 0;
  const mhChallPts = mhChallenges === 0 ? 5 : mhChallenges <= 2 ? 3 : 0;
  signals.push(chip('Modern Factors', mhChallPts, 5));

  const score = Math.round(Math.min(100, nadiPts + mangalPts + longevityPts + mhPts + addPts + ganaPts + mhChallPts));

  const detail = [
    nadiDosha
      ? 'Nadi dosha present — genetic incompatibility risk; health attention advised'
      : `Nadi compatible (${nadiParam.pointsObtained}/${nadiParam.maxPoints} pts)`,
    [
      mangal === 'one_uncancelled' ? 'Uncancelled Mangal — health/energy friction possible' : null,
      longevity ? `Partner longevity: ${longevity.level}` : null,
    ].filter(Boolean).join(' · ') || 'Mangal and longevity within normal range',
    `Overall health & longevity strength: ${score}/100`,
  ].join('\n');

  return { score, signals, detail };
}

// ── Domain 4: Children & Legacy (100pts) ────────────────────────────────────

function buildChildren(report: CompatibilityReport): { score: number; signals: SignalChip[]; detail: string } {
  const signals: SignalChip[] = [];

  const nadiDosha = report.ashtakoot.doshas.nadiDosha;
  const nadiParam = report.ashtakoot.parameters.nadi;
  const nadiPts = nadiDosha ? 0 : nadiParam.pointsObtained / (nadiParam.maxPoints || 8) * 30;
  signals.push(chip('Nadi Koot', nadiPts, 30));

  const fertility = report.divisionalAnalysis.d7.fertility?.toLowerCase() ?? '';
  const d7Pts = fertility.includes('excellent') || fertility.includes('high') ? 25
    : fertility.includes('good') || fertility.includes('favour') ? 20
    : fertility.includes('moderate') || fertility.includes('average') ? 13
    : fertility.includes('low') || fertility.includes('difficult') ? 5
    : 13;
  signals.push(chip('D7 Saptamsa', d7Pts, 25));

  const yoniParam = report.ashtakoot.parameters.yoni;
  const yoniPts = yoniParam.pointsObtained / (yoniParam.maxPoints || 4) * 15;
  signals.push(chip('Yoni Koot', yoniPts, 15));

  const kp = kpPromise(report);
  const kpPts = kp === null ? 5 : kp === 'promised' ? 10 : kp === 'complicated' ? 5 : 2;
  signals.push(chip('KP Promise', kpPts, 10));

  const ul2A = report.upapadaLagna?.partnerA.ul2;
  const ul2B = report.upapadaLagna?.partnerB.ul2;
  const ulPts = !report.upapadaLagna ? 6.5 : (ul2A || ul2B) ? 3 : 10;
  signals.push(chip('Upapada', ulPts, 10));

  const navPts = (report.navamsaMatching.score ?? 50) / 100 * 10;
  signals.push(chip('D9 Navamsa', navPts, 10));

  const score = Math.round(Math.min(100, nadiPts + d7Pts + yoniPts + kpPts + ulPts + navPts));

  const detail = [
    report.divisionalAnalysis.d7.fertility
      ? `D7 Saptamsa fertility: ${report.divisionalAnalysis.d7.fertility}`
      : 'D7 fertility data pending detailed chart',
    nadiDosha ? 'Nadi dosha — fertility and child health require careful attention' : (report.divisionalAnalysis.d7.childrenIndications?.[0] ?? null),
    `Overall children & legacy strength: ${score}/100`,
  ].filter(Boolean).join('\n');

  return { score, signals, detail };
}

// ── Domain 5: Social Status & Career (100pts) ──────────────────────────────

function buildStatus(report: CompatibilityReport): { score: number; signals: SignalChip[]; detail: string } {
  const signals: SignalChip[] = [];

  const tenPts = (report.inLawAnalysis.tenthHouseScore ?? 5) / 10 * 25;
  signals.push(chip('10th House', tenPts, 25));

  const trad = report.advancedBreakdown?.tradition;
  const tradPts = !trad ? 12 : trad.status === 'positive' ? 20 : trad.status === 'neutral' ? 12 : 5;
  signals.push(trad ? statusChip('Tradition', trad.status) : chip('Tradition', tradPts, 20));

  const secPts = (report.inLawAnalysis.secondHouseScore ?? 5) / 10 * 15;
  signals.push(chip('2nd House', secPts, 15));

  const career = report.spousePrediction.profession?.careerNature;
  const carMap: Record<string, number> = { Government: 15, Business: 11, Service: 9, 'Self-Employed': 8, Creative: 6 };
  const carPts = career ? (carMap[career] ?? 10) : 10;
  signals.push(chip('Career Type', carPts, 15));

  const respPts = positiveText(report.navamsaMatching.mutualRespect, ['high', 'strong', 'good', 'positive', 'mutual', 'deep', 'excellent', 'respect']) ? 10 : 5;
  signals.push(chip('D9 Respect', respPts, 10));

  const vashyaParam = report.ashtakoot.parameters.vashya;
  const vashyaPts = vashyaParam.pointsObtained / (vashyaParam.maxPoints || 2) * 8;
  signals.push(chip('Vashya Koot', vashyaPts, 8));

  const carChallenges = report.modernChallenges.careerStress?.length ?? 0;
  const carChallPts = carChallenges === 0 ? 7 : carChallenges <= 2 ? 4 : 0;
  signals.push(chip('Modern Factors', carChallPts, 7));

  const score = Math.round(Math.min(100, tenPts + tradPts + secPts + carPts + respPts + vashyaPts + carChallPts));

  const detail = [
    `10th house strength: ${report.inLawAnalysis.tenthHouseScore}/10${career ? ` · Spouse career: ${career}` : ''}`,
    report.navamsaMatching.mutualRespect || 'Mutual respect data from Navamsa pending',
    `Overall social status & career strength: ${score}/100`,
  ].join('\n');

  return { score, signals, detail };
}

// ── Domain 6: Conflict & Stability (100pts — inverted metrics) ──────────────

function buildConflict(report: CompatibilityReport): { score: number; signals: SignalChip[]; detail: string } {
  const signals: SignalChip[] = [];

  const divPts = (100 - (report.riskAssessment.divorceProbability.score ?? 50)) / 100 * 25;
  signals.push(chip('Divorce Risk', divPts, 25));

  const infPts = (100 - (report.riskAssessment.infidelityRisk.score ?? 50)) / 100 * 15;
  signals.push(chip('Fidelity', infPts, 15));

  const severity = report.conflictZone.overallSeverity;
  const sevPts = severity === 'Low' ? 15 : severity === 'Medium' ? 8 : 2;
  signals.push(chip('Conflict Zone', sevPts, 15));

  const ganaParam = report.ashtakoot.parameters.gana;
  const ganaPts = ganaParam.pointsObtained / (ganaParam.maxPoints || 6) * 10;
  signals.push(chip('Gana Koot', ganaPts, 10));

  const bhakootDosha = report.ashtakoot.doshas.bhakootDosha;
  const bhkPts = bhakootDosha ? 2 : 10;
  signals.push(chip('Bhakoot', bhkPts, 10));

  const mangal = getMangalStatus(report);
  const mangalPts = mangal === 'neither' ? 10 : mangal === 'both_or_cancelled' ? 8 : 2;
  signals.push(chip('Mangal', mangalPts, 10));

  const strongFactors = (report.riskAssessment.protectiveFactors ?? []).filter(f => f.strength === 'strong').length;
  const protPts = strongFactors >= 3 ? 10 : strongFactors === 2 ? 7 : strongFactors === 1 ? 4 : 1;
  signals.push(chip('Protections', protPts, 10));

  const yogas = report.riskAssessment.detectedYogas ?? [];
  const hasSevere = yogas.some(y => y.severity === 'severe');
  const hasModerate = yogas.some(y => y.severity === 'moderate');
  const yogaPts = hasSevere ? 0 : hasModerate ? 3 : 5;
  signals.push(chip('Yogas/Doshas', yogaPts, 5));

  const score = Math.round(Math.min(100, divPts + infPts + sevPts + ganaPts + bhkPts + mangalPts + protPts + yogaPts));

  const detail = [
    `Conflict severity: ${severity} · Divorce risk: ${report.riskAssessment.divorceProbability.level} · Infidelity risk: ${report.riskAssessment.infidelityRisk.level}`,
    strongFactors > 0 ? `${strongFactors} strong protective factor${strongFactors > 1 ? 's' : ''} detected` : 'Limited protective factors — awareness recommended',
    `Overall conflict & stability strength: ${score}/100`,
  ].join('\n');

  return { score, signals, detail };
}

// ── Assemble all 6 domains ──────────────────────────────────────────────────

function buildDomains(report: CompatibilityReport): Domain[] {
  const em = buildEmotional(report);
  const pr = buildProsperity(report);
  const he = buildHealth(report);
  const ch = buildChildren(report);
  const st = buildStatus(report);
  const co = buildConflict(report);

  return [
    { id: 'happiness', icon: <Heart className="w-5 h-5" />, title: 'Emotional Happiness', subtitle: 'Love, warmth & daily joy', ...em },
    { id: 'prosperity', icon: <TrendingUp className="w-5 h-5" />, title: 'Financial Prosperity', subtitle: 'Wealth, stability & resources', ...pr },
    { id: 'health', icon: <Activity className="w-5 h-5" />, title: 'Health & Longevity', subtitle: 'Vitality & physical wellbeing', ...he },
    { id: 'children', icon: <Baby className="w-5 h-5" />, title: 'Children & Legacy', subtitle: '5th house, D7 chart & Putrakaraka', ...ch },
    { id: 'status', icon: <Star className="w-5 h-5" />, title: 'Social Status & Career', subtitle: '10th house, reputation & growth', ...st },
    { id: 'conflict', icon: <Shield className="w-5 h-5" />, title: 'Conflict & Stability', subtitle: 'How much friction enters life', ...co },
  ];
}

// ── Blessings & Challenges ──────────────────────────────────────────────────

function getBlessings(report: CompatibilityReport): string[] {
  const list: string[] = [];
  const strong = (report.riskAssessment.protectiveFactors ?? [])
    .filter(f => f.strength === 'strong').map(f => f.text).slice(0, 3);
  list.push(...strong);
  const happiness = report.navamsaMatching.maritalHappiness;
  if (happiness && !list.some(l => l === happiness)) list.push(happiness);
  const preds = (report.spousePrediction.predictions ?? []).slice(0, 2);
  list.push(...preds);
  if (report.navamsaMatching.familyRelations) list.push(report.navamsaMatching.familyRelations);
  return [...new Set(list)].slice(0, 5);
}

function getChallenges(report: CompatibilityReport): string[] {
  const list: string[] = [];
  const yogas = (report.riskAssessment.detectedYogas ?? [])
    .filter(y => y.severity !== 'mild').map(y => `${y.name}: ${y.description}`).slice(0, 2);
  list.push(...yogas);
  const peopleTriggers = report.conflictZone.people.slice(0, 1).map(t => t.description);
  list.push(...peopleTriggers);
  const ideologyTriggers = report.conflictZone.ideology.slice(0, 1).map(t => t.description);
  list.push(...ideologyTriggers);
  if (report.riskAssessment.divorceProbability.level !== 'low') {
    const ind = report.riskAssessment.divorceProbability.indicators?.[0]?.text;
    if (ind) list.push(ind);
  }
  return [...new Set(list)].filter(Boolean).slice(0, 5);
}

// ── Timing ──────────────────────────────────────────────────────────────────

function getWindows(report: CompatibilityReport) {
  const favourable = (report.timing.favorablePeriods ?? []).slice(0, 2).map(p => ({
    type: 'good' as const, label: p.description, date: new Date(p.startDate).getFullYear(),
  }));
  const vulnerable = (report.timing.vulnerablePeriods ?? []).slice(0, 2).map(p => ({
    type: 'caution' as const, label: p.description, date: new Date(p.startDate).getFullYear(),
  }));
  return [...favourable, ...vulnerable].sort((a, b) => a.date - b.date);
}

// ── Overall verdict ─────────────────────────────────────────────────────────

function getOverallVerdict(domains: Domain[]): { label: string; sub: string; color: string } {
  const avg = domains.reduce((s, d) => s + d.score, 0) / domains.length;
  if (avg >= 70) return { label: 'This marriage predominantly brings growth and happiness', sub: 'Planetary energies align to support a fulfilling life together', color: 'from-emerald-500 to-teal-500' };
  if (avg >= 55) return { label: 'A balanced union — joys and trials arrive together', sub: 'Neither a bed of roses nor a field of thorns — wisdom wins here', color: 'from-amber-500 to-orange-400' };
  return { label: 'Significant life tests will accompany this marriage', sub: 'The stars call for awareness, effort, and the right remedies', color: 'from-rose-500 to-pink-500' };
}

// ── Score → display ─────────────────────────────────────────────────────────

function scoreToTier(score: number): 'strong' | 'moderate' | 'weak' {
  if (score >= 68) return 'strong';
  if (score >= 42) return 'moderate';
  return 'weak';
}

const TIER_STYLES = {
  strong:   { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300', label: 'Favourable' },
  moderate: { bar: 'bg-amber-400',   text: 'text-amber-600  dark:text-amber-400',   badge: 'bg-amber-100  dark:bg-amber-900/30  text-amber-700  dark:text-amber-300',  label: 'Mixed'      },
  weak:     { bar: 'bg-rose-500',    text: 'text-rose-600   dark:text-rose-400',    badge: 'bg-rose-100   dark:bg-rose-900/30   text-rose-700   dark:text-rose-300',   label: 'Challenging'},
};

const CHIP_STYLES = {
  good: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  mixed: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  weak: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
};

const CHIP_ICON = { good: '\u2713', mixed: '~', weak: '\u2717' };

// ── Component ───────────────────────────────────────────────────────────────

export const LifeAfterMarriageWidget: React.FC<Props> = ({ report }) => {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [showAllBlessings, setShowAllBlessings] = useState(false);
  const [showAllChallenges, setShowAllChallenges] = useState(false);

  const domains = buildDomains(report);
  const blessings = getBlessings(report);
  const challenges = getChallenges(report);
  const windows = getWindows(report);
  const verdict = getOverallVerdict(domains);

  const visibleBlessings = showAllBlessings ? blessings : blessings.slice(0, 3);
  const visibleChallenges = showAllChallenges ? challenges : challenges.slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Life After Marriage</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">What this union brings to every dimension of life</p>
          </div>
        </div>
      </div>

      {/* Systems Banner */}
      <div className="px-6 py-2 bg-indigo-50/60 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/30">
        <p className="text-[10px] text-indigo-500 dark:text-indigo-400 text-center font-medium tracking-wide uppercase">
          9-system analysis: D1 · D9 · D7 · KP · Jaimini · Ashtakoot · Synastry · Psychology · Timing
        </p>
      </div>

      <div className="p-5 space-y-6">

        {/* Overall verdict banner */}
        <div className={`bg-gradient-to-r ${verdict.color} rounded-xl p-4 text-white`}>
          <p className="font-semibold text-sm leading-snug">{verdict.label}</p>
          <p className="text-xs mt-1 text-white/80">{verdict.sub}</p>
        </div>

        {/* 6 Life Domain Cards */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            Impact Across Life Areas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {domains.map(domain => {
              const tier = scoreToTier(domain.score);
              const s = TIER_STYLES[tier];
              const isOpen = expandedDomain === domain.id;
              return (
                <button
                  key={domain.id}
                  onClick={() => setExpandedDomain(isOpen ? null : domain.id)}
                  className="text-left bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-700/50 w-full"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={s.text}>{domain.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{domain.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{domain.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                    </div>
                  </div>
                  {/* Score bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400 dark:text-gray-500">Strength</span>
                      <span className={`text-xs font-bold ${s.text}`}>{domain.score}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${s.bar} rounded-full transition-all`} style={{ width: `${domain.score}%` }} />
                    </div>
                  </div>
                  {/* Expanded detail with signal chips */}
                  {isOpen && (
                    <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3 space-y-3">
                      {/* Signal Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {domain.signals.map((sig, i) => (
                          <span
                            key={i}
                            className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${CHIP_STYLES[sig.status]}`}
                          >
                            {sig.label} {CHIP_ICON[sig.status]}
                          </span>
                        ))}
                      </div>
                      {/* Multi-line detail text */}
                      {domain.detail.split('\n').map((line, i) => (
                        <p
                          key={i}
                          className={`text-xs leading-relaxed ${
                            i === 0
                              ? 'text-gray-700 dark:text-gray-300 font-medium'
                              : i === domain.detail.split('\n').length - 1
                              ? 'text-gray-500 dark:text-gray-500 italic'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Blessings & Challenges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Blessings */}
          <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30">
            <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              What This Marriage Brings
            </h3>
            {blessings.length === 0 ? (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Consult a detailed report for specific blessings.</p>
            ) : (
              <ul className="space-y-2">
                {visibleBlessings.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">{'\u2726'}</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {blessings.length > 3 && (
              <button onClick={() => setShowAllBlessings(!showAllBlessings)} className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                {showAllBlessings ? 'Show less' : `+${blessings.length - 3} more`}
              </button>
            )}
          </div>

          {/* Challenges */}
          <div className="bg-rose-50 dark:bg-rose-950/20 rounded-xl p-4 border border-rose-100 dark:border-rose-900/30">
            <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              What to Navigate
            </h3>
            {challenges.length === 0 ? (
              <p className="text-xs text-rose-600 dark:text-rose-400">No major challenges detected in the chart data.</p>
            ) : (
              <ul className="space-y-2">
                {visibleChallenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-rose-800 dark:text-rose-300">
                    <span className="text-rose-400 mt-0.5 flex-shrink-0">{'\u25B2'}</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            )}
            {challenges.length > 3 && (
              <button onClick={() => setShowAllChallenges(!showAllChallenges)} className="mt-3 text-xs text-rose-600 dark:text-rose-400 hover:underline">
                {showAllChallenges ? 'Show less' : `+${challenges.length - 3} more`}
              </button>
            )}
          </div>
        </div>

        {/* Critical Timing Windows */}
        {windows.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Life Turning Points
            </h3>
            <div className="space-y-2">
              {windows.map((w, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-lg p-3 text-xs ${
                    w.type === 'good'
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30'
                      : 'bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30'
                  }`}
                >
                  <span className="flex-shrink-0 mt-0.5">
                    {w.type === 'good'
                      ? <Sun className="w-3.5 h-3.5 text-emerald-500" />
                      : <CloudRain className="w-3.5 h-3.5 text-amber-500" />}
                  </span>
                  <div>
                    <span className={`font-semibold ${w.type === 'good' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                      {w.date}
                    </span>
                    <span className={`ml-2 ${w.type === 'good' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                      {w.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Protective Factors Summary */}
        {(report.riskAssessment.protectiveFactors ?? []).filter(f => f.strength === 'strong').length > 0 && (
          <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/30">
            <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              What Protects This Marriage
            </h3>
            <ul className="space-y-1.5">
              {(report.riskAssessment.protectiveFactors ?? [])
                .filter(f => f.strength === 'strong')
                .slice(0, 3)
                .map((f, i) => (
                  <li key={i} className="text-xs text-indigo-700 dark:text-indigo-300 flex items-start gap-2">
                    <span className="text-indigo-400 flex-shrink-0 mt-0.5">{'\u25C6'}</span>
                    {f.text}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Navamsa Summary */}
        <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30">
          <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Navamsa (D9) — The Soul of This Marriage
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-purple-600 dark:text-purple-400 font-semibold mb-0.5">Happiness</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{report.navamsaMatching.maritalHappiness || '\u2014'}</p>
            </div>
            <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-purple-600 dark:text-purple-400 font-semibold mb-0.5">Respect</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{report.navamsaMatching.mutualRespect || '\u2014'}</p>
            </div>
            <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-purple-600 dark:text-purple-400 font-semibold mb-0.5">Family</p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{report.navamsaMatching.familyRelations || '\u2014'}</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 dark:text-gray-600 text-center leading-relaxed">
          Astrological indicators show tendencies, not certainties. Free will and conscious effort shape the final outcome.
        </p>
      </div>
    </div>
  );
};
