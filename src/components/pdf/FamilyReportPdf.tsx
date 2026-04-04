/**
 * FamilyReportPdf — @react-pdf/renderer document
 * Parent/family-safe export: Ashtakoot + Dosha + Marriage Summary only.
 * Excludes: Sexual Compatibility, Risk Assessment, Mental Health, KP Analysis.
 * Framing: traditional Kundali Milan for family review.
 */

import React from 'react';
import {
  Document, Page, View, Text, StyleSheet,
} from '@react-pdf/renderer';

// ─── Styles ─────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: { padding: 36, fontFamily: 'Helvetica', backgroundColor: '#ffffff', fontSize: 10, color: '#1e293b' },
  // Cover
  coverBg: { backgroundColor: '#1e1b4b', padding: 40, borderRadius: 8, marginBottom: 24 },
  coverTitle: { fontSize: 26, fontWeight: 'bold', color: '#f59e0b', marginBottom: 6 },
  coverSub: { fontSize: 12, color: '#c7d2fe', marginBottom: 4 },
  coverNames: { fontSize: 20, color: '#ffffff', fontWeight: 'bold', marginTop: 8 },
  coverDate: { fontSize: 9, color: '#818cf8', marginTop: 12 },
  coverDisclaimer: { fontSize: 8, color: '#a5b4fc', marginTop: 8, lineHeight: 1.5 },
  // Section headers
  sectionHeader: { backgroundColor: '#312e81', borderRadius: 6, padding: '10 14', marginTop: 18, marginBottom: 10 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#e0e7ff' },
  sectionSub: { fontSize: 8, color: '#a5b4fc', marginTop: 2 },
  // Cards
  card: { backgroundColor: '#f8fafc', borderRadius: 6, padding: '10 12', marginBottom: 8, borderLeft: '3px solid #6366f1' },
  cardGood: { backgroundColor: '#f0fdf4', borderRadius: 6, padding: '10 12', marginBottom: 8, borderLeft: '3px solid #16a34a' },
  cardWarn: { backgroundColor: '#fffbeb', borderRadius: 6, padding: '10 12', marginBottom: 8, borderLeft: '3px solid #d97706' },
  // Typography
  label: { fontSize: 8, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
  value: { fontSize: 11, fontWeight: 'bold', color: '#1e293b' },
  body: { fontSize: 9, color: '#475569', lineHeight: 1.6 },
  bodyBold: { fontSize: 9, fontWeight: 'bold', color: '#1e293b' },
  // Grid
  row: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  col2: { flex: 1 },
  // Score
  scoreBig: { fontSize: 36, fontWeight: 'bold', color: '#f59e0b' },
  scoreLabel: { fontSize: 9, color: '#92400e' },
  // Score bar
  divider: { borderBottom: '1px solid #e2e8f0', marginVertical: 8 },
  // Verdict band
  verdictBg: { borderRadius: 8, padding: '12 16', marginBottom: 14 },
  verdictTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 3 },
  verdictBody: { fontSize: 9, color: '#ffffff', lineHeight: 1.6 },
  // Stat box
  statBox: { flex: 1, borderRadius: 6, padding: '10 12', alignItems: 'center' },
  statLabel: { fontSize: 7, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  statValue: { fontSize: 16, fontWeight: 'bold' },
  statSub: { fontSize: 7, marginTop: 2 },
  // Dosha badge
  doshaBadge: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  // Footer
  footer: { position: 'absolute', bottom: 20, left: 36, right: 36, textAlign: 'center', fontSize: 8, color: '#94a3b8' },
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

function getVerdictInfo(score: number): { label: string; bgColor: string; summary: string } {
  if (score >= 28) return {
    label: 'Highly Auspicious Match',
    bgColor: '#059669',
    summary: `An Ashtakoot score of ${score}/36 is considered excellent in Vedic astrology. The planetary alignments indicate strong compatibility across all eight categories of Guna Milan.`,
  };
  if (score >= 22) return {
    label: 'Auspicious Match',
    bgColor: '#16a34a',
    summary: `A score of ${score}/36 reflects good Vedic alignment. The couple shows compatibility in most key areas. This is a positive result for consideration.`,
  };
  if (score >= 18) return {
    label: 'Acceptable Match',
    bgColor: '#2563eb',
    summary: `${score}/36 meets the traditional threshold of 18 points considered acceptable for marriage. The match has solid foundational compatibility.`,
  };
  if (score >= 14) return {
    label: 'Moderate Compatibility',
    bgColor: '#d97706',
    summary: `${score}/36 is in the moderate range. Some areas show compatibility, while others may require attention. A more detailed analysis is recommended.`,
  };
  return {
    label: 'Requires Careful Consideration',
    bgColor: '#9333ea',
    summary: `${score}/36 falls below the traditional minimum threshold. A detailed analysis with a qualified astrologer is strongly recommended before proceeding.`,
  };
}

// ─── Main Document ────────────────────────────────────────────────────────────

interface FamilyReportPdfProps {
  report: any;
}

export function FamilyReportPdf({ report }: FamilyReportPdfProps) {
  const nameA = report.chartA?.name || 'Partner A';
  const nameB = report.chartB?.name || 'Partner B';
  const ashtakootScore = report.ashtakoot?.totalScore ?? 0;
  const generated = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const verdict = getVerdictInfo(ashtakootScore);

  const manglikA = report.chartA?.isManglik ?? null;
  const manglikB = report.chartB?.isManglik ?? null;
  const manglikMatch = manglikA === null ? null : (manglikA === manglikB);

  // Dosha info from yoga/dosha analysis
  const doshaList: any[] = (report.yogaDoshaAnalysis as any)?.doshas || [];
  const mangalDosha = doshaList.find((d: any) => d.name?.toLowerCase().includes('mangal') || d.name?.toLowerCase().includes('kuja'));

  // Marriage timing (keep — family wants to know when)
  const timingWindows: any[] = report.timing?.marriageWindows || [];

  // Remedies (keep — family appreciates suggestions)
  const remedies: any[] = report.remedies?.topRemedies || [];
  // Filter out any remedies that mention sensitive topics
  const safeRemedies = remedies.filter((r: any) => {
    const text = `${r.title || ''} ${r.description || ''}`.toLowerCase();
    return !text.includes('sexual') && !text.includes('libido') && !text.includes('addiction');
  });

  return (
    <Document title={`Kundali Milan — ${nameA} & ${nameB}`} author="Astro Marriage">

      {/* ── PAGE 1: Cover + Summary + Birth Details ────────────────────────── */}
      <Page size="A4" style={S.page}>

        {/* Cover */}
        <View style={S.coverBg}>
          <Text style={S.coverTitle}>Kundali Milan Report</Text>
          <Text style={S.coverSub}>Family Summary — Vedic Compatibility Analysis</Text>
          <Text style={S.coverNames}>{nameA} × {nameB}</Text>
          <Text style={S.coverDate}>Prepared on {generated}</Text>
          <Text style={S.coverDisclaimer}>
            This report is prepared for family review and covers traditional Guna Milan (Ashtakoot),
            Dosha analysis, and marriage timing. A complete private report is available for the couple.
          </Text>
        </View>

        {/* Verdict Banner */}
        <View style={[S.verdictBg, { backgroundColor: verdict.bgColor }]}>
          <Text style={S.verdictTitle}>{verdict.label}</Text>
          <Text style={S.verdictBody}>{verdict.summary}</Text>
        </View>

        {/* Score Stats Row */}
        <View style={[S.row, { marginBottom: 14 }]}>
          <View style={[S.statBox, { backgroundColor: '#fef3c7' }]}>
            <Text style={[S.statLabel, { color: '#92400e' }]}>Ashtakoot Score</Text>
            <Text style={[S.statValue, { color: '#92400e' }]}>{ashtakootScore}<Text style={{ fontSize: 9 }}>/36</Text></Text>
            <Text style={[S.statSub, { color: '#b45309' }]}>
              {ashtakootScore >= 28 ? 'Excellent' : ashtakootScore >= 18 ? 'Acceptable' : 'Below Threshold'}
            </Text>
          </View>
          <View style={[S.statBox, { backgroundColor: manglikMatch === null ? '#f1f5f9' : manglikMatch ? '#f0fdf4' : '#fffbeb' }]}>
            <Text style={[S.statLabel, { color: manglikMatch ? '#166534' : '#92400e' }]}>Mangal Dosha</Text>
            <Text style={[S.statValue, { color: manglikMatch ? '#166534' : '#92400e' }]}>
              {manglikMatch === null ? 'See Below' : manglikMatch ? 'Balanced' : 'Check Needed'}
            </Text>
            <Text style={[S.statSub, { color: '#64748b' }]}>Compatibility Status</Text>
          </View>
          <View style={[S.statBox, { backgroundColor: '#ede9fe' }]}>
            <Text style={[S.statLabel, { color: '#5b21b6' }]}>Marriage Timing</Text>
            <Text style={[S.statValue, { color: '#5b21b6' }]}>{timingWindows.length > 0 ? 'Available' : 'See Report'}</Text>
            <Text style={[S.statSub, { color: '#6d28d9' }]}>Favourable Periods</Text>
          </View>
        </View>

        {/* Birth Details */}
        <SectionHeader title="Birth Details" subtitle="Charts used for this analysis" />
        <View style={S.row}>
          {[{ name: nameA, chart: report.chartA }, { name: nameB, chart: report.chartB }].map(({ name, chart }) => (
            <View key={name} style={[S.card, S.col2]}>
              <Text style={[S.bodyBold, { marginBottom: 6 }]}>{name}</Text>
              <LabelValue label="Date of Birth" value={chart?.birthData?.date ? new Date(chart.birthData.date).toLocaleDateString('en-IN') : '—'} />
              <LabelValue label="Place of Birth" value={chart?.birthData?.place || '—'} />
              <LabelValue label="Moon Sign (Rashi)" value={chart?.moonSign || '—'} />
              <LabelValue label="Ascendant (Lagna)" value={chart?.lagna || '—'} />
              <LabelValue label="Birth Nakshatra" value={chart?.moonNakshatra || '—'} />
            </View>
          ))}
        </View>

        <Text style={S.footer}>Astro Marriage · marriage-astro.vercel.app · Family Summary · Page 1</Text>
      </Page>

      {/* ── PAGE 2: Ashtakoot + Dosha + Timing + Remedies ─────────────────── */}
      <Page size="A4" style={S.page}>

        {/* Ashtakoot Guna Milan */}
        <SectionHeader title="Ashtakoot Guna Milan" subtitle="8-koota compatibility scoring (Max: 36 points)" />
        {(report.ashtakoot?.scores || report.ashtakoot?.parameters
          ? Object.entries(report.ashtakoot?.parameters || {}).map(([k, v]: [string, any]) => ({
              name: k, score: v?.score ?? 0, maxScore: v?.maxScore ?? v?.max ?? 0,
              description: v?.meaning || v?.description || '',
            }))
          : []
        ).map((koot: any, i: number) => (
          <View key={i} style={[S.card, { marginBottom: 5 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 2 }}>
                <Text style={S.bodyBold}>{koot.name}</Text>
                {koot.description ? <Text style={S.body}>{String(koot.description).slice(0, 120)}</Text> : null}
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={[S.value, { color: koot.score >= koot.maxScore * 0.6 ? '#16a34a' : '#d97706' }]}>
                  {koot.score}/{koot.maxScore}
                </Text>
                <ScoreBar score={koot.score} max={koot.maxScore || 1} color={koot.score >= koot.maxScore * 0.6 ? '#16a34a' : '#d97706'} />
              </View>
            </View>
          </View>
        ))}
        {/* Fallback: use scores array */}
        {(report.ashtakoot?.scores || []).map((koot: any, i: number) => (
          <View key={`s${i}`} style={[S.card, { marginBottom: 5 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 2 }}>
                <Text style={S.bodyBold}>{koot.name}</Text>
                {koot.description ? <Text style={S.body}>{String(koot.description).slice(0, 120)}</Text> : null}
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={[S.value, { color: koot.score >= koot.maxScore * 0.6 ? '#16a34a' : '#d97706' }]}>
                  {koot.score}/{koot.maxScore}
                </Text>
                <ScoreBar score={koot.score} max={koot.maxScore || 1} color={koot.score >= koot.maxScore * 0.6 ? '#16a34a' : '#d97706'} />
              </View>
            </View>
          </View>
        ))}

        {/* Dosha Analysis */}
        <SectionHeader title="Dosha Analysis" subtitle="Traditional planetary affliction check" />
        <View style={manglikMatch === true ? S.cardGood : S.cardWarn}>
          <Text style={S.bodyBold}>Mangal (Mars) Dosha — Compatibility Status</Text>
          <Text style={[S.value, { fontSize: 13, marginTop: 4, color: manglikMatch === true ? '#166534' : '#92400e' }]}>
            {manglikMatch === null
              ? 'Dosha status requires detailed chart review'
              : manglikMatch
                ? 'Both charts match — Dosha balanced'
                : 'Dosha mismatch — remedial measures recommended'}
          </Text>
          <Text style={[S.body, { marginTop: 4 }]}>
            {manglikMatch === true
              ? 'When both partners have matching Mangal Dosha status, the traditional concern is neutralised. This is considered an auspicious alignment.'
              : manglikMatch === false
                ? 'A mismatch in Mangal Dosha is commonly addressed through specific rituals (Kumbh Vivah, Vishnu pooja) recommended by an astrologer. This is manageable with proper guidance.'
                : 'Please consult a qualified astrologer to verify the Mangal Dosha status from the detailed birth charts.'}
          </Text>
        </View>
        {mangalDosha && (
          <View style={S.card}>
            <Text style={S.bodyBold}>Dosha Details</Text>
            <Text style={S.body}>{mangalDosha.description || mangalDosha.interpretation || ''}</Text>
          </View>
        )}

        {/* Marriage Timing */}
        {timingWindows.length > 0 && (
          <>
            <SectionHeader title="Favourable Marriage Periods" subtitle="Auspicious planetary windows for marriage" />
            {timingWindows.slice(0, 3).map((w: any, i: number) => (
              <View key={i} style={S.cardGood}>
                <Text style={S.bodyBold}>{w.period || `Period ${i + 1}`}</Text>
                <Text style={S.body}>{w.description || ''}</Text>
                {w.strength && <Text style={[S.bodyBold, { color: '#166534', marginTop: 3 }]}>Strength: {w.strength}</Text>}
              </View>
            ))}
          </>
        )}

        {/* Safe Remedies */}
        {safeRemedies.length > 0 && (
          <>
            <SectionHeader title="Recommended Measures" subtitle="Vedic remedies to strengthen the union" />
            {safeRemedies.slice(0, 4).map((r: any, i: number) => (
              <View key={i} style={S.card}>
                <Text style={S.bodyBold}>{r.title || `Remedy ${i + 1}`}</Text>
                <Text style={S.body}>{r.description || ''}</Text>
              </View>
            ))}
          </>
        )}

        <Text style={S.footer}>
          Astro Marriage · marriage-astro.vercel.app · Family Summary · Page 2 · Prepared for family review — full analysis available to the couple privately.
        </Text>
      </Page>

    </Document>
  );
}
