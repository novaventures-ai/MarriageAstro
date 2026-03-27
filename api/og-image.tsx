/**
 * Dynamic OG Image Generator — Vercel Edge Function
 *
 * Generates a 1200×630 PNG card for social sharing based on report data.
 * URL: /api/og-image?nameA=Rahul&nameB=Priya&score=28&compat=78&risk=Low&moon=Rohini
 *
 * Uses @vercel/og which renders React JSX → PNG via Satori + Resvg.
 * Must run as an Edge Function (runtime: 'edge') for @vercel/og to work.
 */

import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

function getScoreLabel(score: number): string {
  if (score >= 28) return 'Excellent Match';
  if (score >= 21) return 'Good Match';
  if (score >= 18) return 'Acceptable';
  return 'Needs Caution';
}

function getScoreColor(score: number): string {
  if (score >= 28) return '#10b981'; // emerald
  if (score >= 21) return '#f59e0b'; // amber
  if (score >= 18) return '#f97316'; // orange
  return '#ef4444';                  // red
}

function getRiskColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case 'low': return '#10b981';
    case 'moderate': return '#f59e0b';
    case 'high': return '#f97316';
    case 'critical': return '#ef4444';
    default: return '#6366f1';
  }
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);

  const nameA = (searchParams.get('nameA') || 'Partner A').slice(0, 20);
  const nameB = (searchParams.get('nameB') || 'Partner B').slice(0, 20);
  const rawScore = parseInt(searchParams.get('score') || '0', 10);
  const score = Math.min(Math.max(rawScore, 0), 36);
  const compat = parseInt(searchParams.get('compat') || '0', 10);
  const risk = searchParams.get('risk') || 'Unknown';
  const moonA = searchParams.get('moonA') || '';
  const moonB = searchParams.get('moonB') || '';
  const scoreLabel = getScoreLabel(score);
  const scoreColor = getScoreColor(score);
  const riskColor = getRiskColor(risk);
  const scorePct = Math.round((score / 36) * 100);

  return new ImageResponse(
    // @ts-expect-error — JSX used directly in edge runtime
    <div
      style={{
        width: '1200px',
        height: '630px',
        background: 'linear-gradient(135deg, #0f0d1a 0%, #1a1535 50%, #0d1128 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-120px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
      }} />

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px',
        }}>✨</div>
        <span style={{ fontSize: '18px', fontWeight: '700', color: '#a5b4fc', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Astro Marriage
        </span>
      </div>

      {/* Names */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '28px' }}>
        <span style={{ fontSize: '44px', fontWeight: '800', color: '#f1f5f9' }}>{nameA}</span>
        <span style={{ fontSize: '32px', color: '#f59e0b' }}>💍</span>
        <span style={{ fontSize: '44px', fontWeight: '800', color: '#f1f5f9' }}>{nameB}</span>
      </div>

      {/* Score card */}
      <div style={{
        display: 'flex', alignItems: 'stretch', gap: '20px', marginBottom: '28px',
      }}>
        {/* Ashtakoot */}
        <div style={{
          background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px 32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          border: `2px solid ${scoreColor}40`,
        }}>
          <span style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>Ashtakoot Milan</span>
          <span style={{ fontSize: '52px', fontWeight: '900', color: scoreColor, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>/36</span>
          {/* Mini progress bar */}
          <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
            <div style={{ width: `${scorePct}%`, height: '6px', background: scoreColor, borderRadius: '3px' }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: scoreColor, marginTop: '8px' }}>{scoreLabel}</span>
        </div>

        {/* Compatibility % */}
        {compat > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px 32px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            border: '2px solid rgba(99,102,241,0.3)',
          }}>
            <span style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>Compatibility</span>
            <span style={{ fontSize: '52px', fontWeight: '900', color: '#818cf8', lineHeight: 1 }}>{compat}</span>
            <span style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>%</span>
            <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
              <div style={{ width: `${compat}%`, height: '6px', background: '#818cf8', borderRadius: '3px' }} />
            </div>
          </div>
        )}

        {/* Risk level */}
        <div style={{
          background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px 32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          border: `2px solid ${riskColor}40`,
        }}>
          <span style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>Risk Level</span>
          <span style={{ fontSize: '36px', marginBottom: '4px' }}>
            {risk.toLowerCase() === 'low' ? '🛡️' : risk.toLowerCase() === 'high' || risk.toLowerCase() === 'critical' ? '⚠️' : '📊'}
          </span>
          <span style={{ fontSize: '24px', fontWeight: '800', color: riskColor }}>{risk}</span>
        </div>
      </div>

      {/* Moon signs row */}
      {(moonA || moonB) && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          {moonA && (
            <span style={{ fontSize: '14px', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '6px 16px' }}>
              🌙 {nameA}: {moonA}
            </span>
          )}
          {moonB && (
            <span style={{ fontSize: '14px', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '6px 16px' }}>
              🌙 {nameB}: {moonB}
            </span>
          )}
        </div>
      )}

      {/* CTA */}
      <div style={{
        fontSize: '15px', color: '#64748b',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span>Check your compatibility at</span>
        <span style={{ color: '#a5b4fc', fontWeight: '600' }}>marriage-astro.vercel.app</span>
        <span>🔮</span>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
