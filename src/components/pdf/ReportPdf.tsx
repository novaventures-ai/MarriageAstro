/**
 * ReportPdf — @react-pdf/renderer document
 * Generates a structured PDF of the compatibility report.
 * Designed for A4 portrait, dark-section headers with amber accents.
 */

import React from 'react';
import {
  Document, Page, View, Text, StyleSheet,
} from '@react-pdf/renderer';

// ─── Styles ─────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: { padding: 36, fontFamily: 'Helvetica', backgroundColor: '#ffffff', fontSize: 10, color: '#1e293b' },
  // Cover
  coverBg: { backgroundColor: '#0f0d1a', padding: 40, borderRadius: 8, marginBottom: 24 },
  coverTitle: { fontSize: 28, fontWeight: 'bold', color: '#f59e0b', marginBottom: 6 },
  coverSub: { fontSize: 13, color: '#94a3b8', marginBottom: 4 },
  coverDate: { fontSize: 9, color: '#64748b', marginTop: 12 },
  // Sections
  sectionHeader: { backgroundColor: '#1e1b4b', borderRadius: 6, padding: '10 14', marginTop: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#e0e7ff' },
  sectionSub: { fontSize: 8, color: '#a5b4fc', marginTop: 2 },
  // Cards
  card: { backgroundColor: '#f8fafc', borderRadius: 6, padding: '10 12', marginBottom: 8, borderLeft: '3px solid #6366f1' },
  cardHighlight: { backgroundColor: '#fef3c7', borderRadius: 6, padding: '10 12', marginBottom: 8, borderLeft: '3px solid #f59e0b' },
  cardDanger: { backgroundColor: '#fef2f2', borderRadius: 6, padding: '10 12', marginBottom: 8, borderLeft: '3px solid #ef4444' },
  // Typography
  label: { fontSize: 8, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
  value: { fontSize: 11, fontWeight: 'bold', color: '#1e293b' },
  body: { fontSize: 9, color: '#475569', lineHeight: 1.6 },
  bodyBold: { fontSize: 9, fontWeight: 'bold', color: '#1e293b' },
  // Grid
  row: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  col2: { flex: 1 },
  // Score badge
  scoreBig: { fontSize: 32, fontWeight: 'bold', color: '#f59e0b' },
  scoreLabel: { fontSize: 9, color: '#92400e' },
  // Divider
  divider: { borderBottom: '1px solid #e2e8f0', marginVertical: 8 },
  // Footer
  footer: { position: 'absolute', bottom: 20, left: 36, right: 36, textAlign: 'center', fontSize: 8, color: '#94a3b8' },
  // Aha Moment
  ahaBg: { borderRadius: 8, padding: '14 16', marginBottom: 12 },
  ahaVerdict: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  ahaSummary: { fontSize: 9, color: '#ffffff', lineHeight: 1.6, marginBottom: 8 },
  ahaBadge: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  ahaBadgeText: { fontSize: 8, fontWeight: 'bold' },
  // Quick Glance
  statBox: { flex: 1, borderRadius: 6, padding: '10 12', alignItems: 'center' },
  statLabel: { fontSize: 7, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  statValue: { fontSize: 16, fontWeight: 'bold' },
  statSub: { fontSize: 7, marginTop: 2 },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ScoreBar({ score, max, color = '#6366f1' }: { score: number; max: number; color?: string }) {
  const pct = Math.min((score / max) * 100, 100);
  return (
    <View style={{ height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, marginTop: 4, marginBottom: 2 }}>
      <View style={{ height: 6, width: `${pct}%`, backgroundColor: color, borderRadius: 3 }} />
    </View>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={S.sectionHeader}>
      <Text style={S.sectionTitle}>{title}</Text>
      {subtitle && <Text style={S.sectionSub}>{subtitle}</Text>}
    </View>
  );
}

function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 6 }}>
      <Text style={S.label}>{label}</Text>
      <Text style={S.value}>{value}</Text>
    </View>
  );
}

// ─── Aha Moment helpers ───────────────────────────────────────────────────────

function getVerdictInfo(score: number): { label: string; bgColor: string } {
  if (score >= 28) return { label: 'Exceptional Match', bgColor: '#059669' };
  if (score >= 22) return { label: 'Strong Match',      bgColor: '#16a34a' };
  if (score >= 18) return { label: 'Good Match',        bgColor: '#2563eb' };
  if (score >= 14) return { label: 'Average Match',     bgColor: '#d97706' };
  return                  { label: 'Challenging Match', bgColor: '#e11d48' };
}

function getMatchSummary(score: number, riskLevel: string): string {
  const highRisk = riskLevel === 'High' || riskLevel === 'Critical';
  const lowRisk  = riskLevel === 'Low';
  if (score >= 24 && lowRisk)  return `A score of ${score}/36 with low risk indicators suggests strong Vedic alignment. This match carries positive astrological foundations for a lasting union.`;
  if (score >= 18 && !highRisk) return `With ${score}/36, this pairing shows solid Vedic compatibility and no major red flags. Explore the detailed sections to understand the nuances.`;
  if (score >= 14 || !highRisk) return `${score}/36 falls in the mid range — workable, but dependent on both partners' self-awareness. Study the risk and psychology sections carefully.`;
  return `${score}/36 combined with ${riskLevel.toLowerCase()} risk flags real compatibility friction. This match can work, but only with full information and conscious effort.`;
}

function getRiskBadgeStyle(riskLevel: string): { bg: string; fg: string } {
  if (riskLevel === 'Low')                               return { bg: '#dcfce7', fg: '#166534' };
  if (riskLevel === 'High' || riskLevel === 'Critical')  return { bg: '#fee2e2', fg: '#991b1b' };
  return                                                        { bg: '#fef3c7', fg: '#92400e' };
}

// ─── Main Document ────────────────────────────────────────────────────────────

interface ReportPdfProps {
  report: any; // Full CompatibilityReport
}

export function ReportPdf({ report }: ReportPdfProps) {
  const nameA = report.chartA?.name || 'Partner A';
  const nameB = report.chartB?.name || 'Partner B';
  const ashtakootScore = report.ashtakoot?.totalScore ?? '—';
  const overallScore = (report as any).overallCompatibilityScore ?? '—';
  const generated = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const riskLevel = (report.riskAssessment as any)?.overallRisk?.level || 'Unknown';
  const riskColor = riskLevel === 'Low' ? '#16a34a' : riskLevel === 'High' || riskLevel === 'Critical' ? '#dc2626' : '#d97706';
  const totalScore = report.ashtakoot?.totalScore ?? 0;
  const sexScore = (report.sexualCompatibility as any)?.score ?? null;
  const verdict = getVerdictInfo(totalScore);
  const matchSummary = getMatchSummary(totalScore, riskLevel);
  const riskBadge = getRiskBadgeStyle(riskLevel);

  const currentDashaA = report.chartA?.dashas?.find((d: any) => d.isCurrent)?.planet || '—';
  const currentDashaB = report.chartB?.dashas?.find((d: any) => d.isCurrent)?.planet || '—';

  const kpPromiseA = report.kpAnalysis?.partnerA?.fourFoldAnalysis?.marriagePromise || '—';
  const kpPromiseB = report.kpAnalysis?.partnerB?.fourFoldAnalysis?.marriagePromise || '—';

  return (
    <Document title={`${nameA} & ${nameB} — Compatibility Report`} author="Astro Marriage">
      {/* ── PAGE 1: Cover + Overview ───────────────────────────────────────── */}
      <Page size="A4" style={S.page}>
        {/* Cover */}
        <View style={S.coverBg}>
          <Text style={S.coverTitle}>Astro Marriage</Text>
          <Text style={S.coverSub}>Vedic Compatibility Report</Text>
          <Text style={[S.value, { color: '#f1f5f9', fontSize: 18, marginTop: 8 }]}>{nameA} × {nameB}</Text>
          <Text style={S.coverDate}>Generated on {generated} · Confidential</Text>
        </View>

        {/* Overall Score */}
        <SectionHeader title="Overall Compatibility" subtitle="Comprehensive Vedic analysis score" />
        <View style={[S.row, { alignItems: 'center' }]}>
          <View style={[S.card, { flex: 1, alignItems: 'center', padding: 16 }]}>
            <Text style={S.label}>Ashtakoot Milan (36 Guna)</Text>
            <Text style={S.scoreBig}>{ashtakootScore}<Text style={{ fontSize: 16 }}>/36</Text></Text>
            <ScoreBar score={Number(ashtakootScore)} max={36} color="#f59e0b" />
            <Text style={[S.scoreLabel, { textAlign: 'center', marginTop: 4 }]}>
              {Number(ashtakootScore) >= 28 ? 'Excellent Match' : Number(ashtakootScore) >= 18 ? 'Acceptable' : 'Caution Advised'}
            </Text>
          </View>
          {overallScore !== '—' && (
            <View style={[S.card, { flex: 1, alignItems: 'center', padding: 16 }]}>
              <Text style={S.label}>Overall Compatibility</Text>
              <Text style={S.scoreBig}>{overallScore}<Text style={{ fontSize: 16 }}>%</Text></Text>
              <ScoreBar score={Number(overallScore)} max={100} color="#6366f1" />
            </View>
          )}
        </View>

        {/* ── Aha Moment Summary ─────────────────────────────────────────── */}
        <View style={[S.ahaBg, { backgroundColor: verdict.bgColor }]}>
          <Text style={S.ahaVerdict}>{verdict.label}</Text>
          <Text style={S.ahaSummary}>{matchSummary}</Text>
          <View style={[S.ahaBadge, { backgroundColor: riskBadge.bg }]}>
            <Text style={[S.ahaBadgeText, { color: riskBadge.fg }]}>{riskLevel} Risk</Text>
          </View>
        </View>

        {/* ── Quick Glance Row ───────────────────────────────────────────── */}
        <View style={[S.row, { marginBottom: 12 }]}>
          <View style={[S.statBox, { backgroundColor: '#fef3c7' }]}>
            <Text style={[S.statLabel, { color: '#92400e' }]}>Ashtakoot Score</Text>
            <Text style={[S.statValue, { color: '#92400e' }]}>{totalScore}<Text style={{ fontSize: 9 }}>/36</Text></Text>
            <Text style={[S.statSub, { color: '#b45309' }]}>
              {totalScore >= 28 ? 'Excellent' : totalScore >= 18 ? 'Acceptable' : 'Caution'}
            </Text>
          </View>
          <View style={[S.statBox, { backgroundColor: riskLevel === 'Low' ? '#dcfce7' : riskLevel === 'High' || riskLevel === 'Critical' ? '#fee2e2' : '#fef3c7' }]}>
            <Text style={[S.statLabel, { color: riskColor }]}>Risk Level</Text>
            <Text style={[S.statValue, { color: riskColor }]}>{riskLevel}</Text>
            <Text style={[S.statSub, { color: riskColor }]}>Overall</Text>
          </View>
          {sexScore !== null ? (
            <View style={[S.statBox, { backgroundColor: '#fdf4ff' }]}>
              <Text style={[S.statLabel, { color: '#7e22ce' }]}>Sexual Compatibility</Text>
              <Text style={[S.statValue, { color: '#7e22ce' }]}>{sexScore}<Text style={{ fontSize: 9 }}>%</Text></Text>
              <Text style={[S.statSub, { color: '#9333ea' }]}>
                {sexScore >= 75 ? 'High Chemistry' : sexScore >= 50 ? 'Moderate' : 'Low Chemistry'}
              </Text>
            </View>
          ) : (
            <View style={[S.statBox, { backgroundColor: '#f1f5f9' }]}>
              <Text style={[S.statLabel, { color: '#64748b' }]}>KP Marriage Promise</Text>
              <Text style={[S.statValue, { color: '#1e293b', fontSize: 11 }]}>{kpPromiseA}</Text>
              <Text style={[S.statSub, { color: '#64748b' }]}>{nameA}</Text>
            </View>
          )}
        </View>

        {/* Partner Details */}
        <SectionHeader title="Birth Details" />
        <View style={S.row}>
          {[{ name: nameA, chart: report.chartA }, { name: nameB, chart: report.chartB }].map(({ name, chart }) => (
            <View key={name} style={[S.card, S.col2]}>
              <Text style={[S.bodyBold, { marginBottom: 6 }]}>{name}</Text>
              <LabelValue label="Date of Birth" value={chart?.birthData?.date ? new Date(chart.birthData.date).toLocaleDateString('en-IN') : '—'} />
              <LabelValue label="Place of Birth" value={chart?.birthData?.place || '—'} />
              <LabelValue label="Moon Sign" value={chart?.moonSign || '—'} />
              <LabelValue label="Lagna (Ascendant)" value={chart?.lagna || '—'} />
              <LabelValue label="Nakshatra" value={chart?.moonNakshatra || '—'} />
              <LabelValue label="Current Dasha" value={name === nameA ? currentDashaA : currentDashaB} />
            </View>
          ))}
        </View>

        <Text style={S.footer}>Astro Marriage · marriage-astro.vercel.app · Page 1</Text>
      </Page>

      {/* ── PAGE 2: Ashtakoot + KP ─────────────────────────────────────────── */}
      <Page size="A4" style={S.page}>
        <SectionHeader title="Ashtakoot Guna Milan" subtitle="Traditional 8-koot compatibility scoring" />
        {(report.ashtakoot?.scores || []).map((koot: any) => (
          <View key={koot.name} style={[S.card, { marginBottom: 5 }]}>
            <View style={S.row}>
              <View style={{ flex: 2 }}>
                <Text style={S.bodyBold}>{koot.name}</Text>
                <Text style={S.body}>{koot.description || koot.result || ''}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={[S.value, { color: koot.score >= koot.maxScore * 0.6 ? '#16a34a' : '#dc2626' }]}>
                  {koot.score}/{koot.maxScore}
                </Text>
                <ScoreBar score={koot.score} max={koot.maxScore} color={koot.score >= koot.maxScore * 0.6 ? '#16a34a' : '#dc2626'} />
              </View>
            </View>
          </View>
        ))}

        <SectionHeader title="KP Marriage Promise" subtitle="Krishnamurti Paddhati — 7th cusp sub-lord analysis" />
        <View style={S.row}>
          {[{ name: nameA, promise: kpPromiseA }, { name: nameB, promise: kpPromiseB }].map(({ name, promise }) => (
            <View key={name} style={[
              promise === 'promised' ? S.cardHighlight : promise === 'denied' ? S.cardDanger : S.card,
              S.col2
            ]}>
              <Text style={S.bodyBold}>{name}</Text>
              <Text style={[S.value, { fontSize: 13, marginTop: 4, textTransform: 'capitalize' }]}>{promise}</Text>
              <Text style={S.body}>Based on 7th cusp sub-lord analysis</Text>
            </View>
          ))}
        </View>

        <Text style={S.footer}>Astro Marriage · marriage-astro.vercel.app · Page 2</Text>
      </Page>

      {/* ── PAGE 3: Risk + Timing ──────────────────────────────────────────── */}
      <Page size="A4" style={S.page}>
        <SectionHeader title="Risk Assessment" subtitle="Overall compatibility risk profile" />
        <View style={[S.card, { borderLeftColor: riskColor }]}>
          <View style={S.row}>
            <Text style={S.label}>Overall Risk Level</Text>
          </View>
          <Text style={[S.value, { fontSize: 18, color: riskColor, marginBottom: 4 }]}>{riskLevel}</Text>
          {(report.riskAssessment as any)?.summary && (
            <Text style={S.body}>{(report.riskAssessment as any).summary}</Text>
          )}
        </View>

        {(report.riskAssessment as any)?.specificRisks && Object.entries((report.riskAssessment as any).specificRisks).map(([key, risk]: [string, any]) => (
          <View key={key} style={S.card}>
            <Text style={S.bodyBold}>{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
            <ScoreBar score={risk.score || 50} max={100} color={risk.score > 70 ? '#dc2626' : risk.score > 40 ? '#d97706' : '#16a34a'} />
            <Text style={[S.body, { marginTop: 3 }]}>{risk.interpretation || ''}</Text>
          </View>
        ))}

        <SectionHeader title="Marriage Timing" subtitle="Favourable planetary periods for marriage" />
        {report.timing?.marriageWindows?.map((window: any, i: number) => (
          <View key={i} style={S.cardHighlight}>
            <View style={S.row}>
              <View style={{ flex: 2 }}>
                <Text style={S.bodyBold}>{window.period || `Window ${i + 1}`}</Text>
                <Text style={S.body}>{window.description || ''}</Text>
              </View>
              {window.strength && (
                <Text style={[S.value, { color: '#92400e' }]}>{window.strength}</Text>
              )}
            </View>
          </View>
        ))}

        {/* Remedies summary */}
        {report.remedies?.topRemedies && (
          <>
            <SectionHeader title="Key Remedies" subtitle="Personalised Vedic solutions" />
            {(report.remedies.topRemedies as any[]).slice(0, 5).map((remedy: any, i: number) => (
              <View key={i} style={S.card}>
                <Text style={S.bodyBold}>{remedy.title || `Remedy ${i + 1}`}</Text>
                <Text style={S.body}>{remedy.description || ''}</Text>
              </View>
            ))}
          </>
        )}

        <Text style={S.footer}>
          Astro Marriage · marriage-astro.vercel.app · Page 3 · For personal guidance only — not a substitute for professional advice.
        </Text>
      </Page>
    </Document>
  );
}
