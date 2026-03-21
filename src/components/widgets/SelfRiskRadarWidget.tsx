import React, { useState } from 'react';
import { SelfAnalysisReport } from '../../types/selfAnalysis';
import {
  Shield, AlertTriangle, ChevronDown, ChevronUp, Heart, Brain,
  Flame, Clock, Wine, Users, ShieldCheck, TrendingDown
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip
} from 'recharts';

interface SelfRiskRadarWidgetProps {
  report: SelfAnalysisReport;
}

interface RiskDimension {
  key: string;
  label: string;
  score: number;
  level: 'low' | 'medium' | 'high' | 'very_high';
  icon: React.ReactNode;
  indicators: string[];
  description: string;
}

export const SelfRiskRadarWidget: React.FC<SelfRiskRadarWidgetProps> = ({ report }) => {
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);

  const getLevel = (score: number): 'low' | 'medium' | 'high' | 'very_high' => {
    if (score >= 70) return 'very_high';
    if (score >= 45) return 'high';
    if (score >= 20) return 'medium';
    return 'low';
  };

  // Build risk dimensions from report data
  const dimensions: RiskDimension[] = [];

  // 1. Marriage Delay Risk
  const delayScore = report.marriagePotential.delayIndicators.length * 20;
  dimensions.push({
    key: 'delay',
    label: 'Marriage Delay',
    score: Math.min(delayScore, 100),
    level: getLevel(Math.min(delayScore, 100)),
    icon: <Clock className="w-5 h-5" />,
    indicators: report.marriagePotential.delayIndicators,
    description: 'Risk of delays in marriage based on planetary positions'
  });

  // 2. Relationship Instability
  const patterns = report.relationshipPatterns;
  const patternScore = patterns?.overallRiskLevel === 'high' ? 75 : patterns?.overallRiskLevel === 'moderate' ? 45 : 15;
  dimensions.push({
    key: 'instability',
    label: 'Relationship Risk',
    score: patternScore,
    level: getLevel(patternScore),
    icon: <Heart className="w-5 h-5" />,
    indicators: patterns?.patterns?.map((p: { name: string; description: string }) => p.name || p.description || String(p)) || [],
    description: 'Risk patterns in relationship behavior'
  });

  // 3. Mental Health Impact
  const mh = report.mentalHealth;
  const mhScore = mh?.totalRiskScore ?? 15;
  dimensions.push({
    key: 'mental',
    label: 'Emotional Stress',
    score: Math.min(mhScore, 100),
    level: getLevel(Math.min(mhScore, 100)),
    icon: <Brain className="w-5 h-5" />,
    indicators: mh?.categories?.filter(c => c.riskLevel !== 'low').map(c => `${c.label}: ${c.riskLevel}`) || [],
    description: 'Emotional and psychological stress indicators'
  });

  // 4. Addiction Susceptibility
  const addiction = report.addictionRisk;
  const addictionLevel = addiction?.overallRisk || 'low';
  const addictionScore = addictionLevel === 'high' ? 75 : addictionLevel === 'moderate' ? 35 : 15;
  dimensions.push({
    key: 'addiction',
    label: 'Addiction Risk',
    score: addictionScore,
    level: getLevel(addictionScore),
    icon: <Wine className="w-5 h-5" />,
    indicators: addiction?.categories?.flatMap((c: { label: string; indicators: { description: string }[] }) => c.indicators.map((i: { description: string }) => `${c.label}: ${i.description}`)) || [],
    description: 'Susceptibility to addictive behaviors'
  });

  // 5. Sexual Imbalance
  const sexScore = report.sexualProfile?.potentialIssues?.length ? report.sexualProfile.potentialIssues.length * 25 : 10;
  dimensions.push({
    key: 'sexual',
    label: 'Sexual Imbalance',
    score: Math.min(sexScore, 100),
    level: getLevel(Math.min(sexScore, 100)),
    icon: <Flame className="w-5 h-5" />,
    indicators: report.sexualProfile?.potentialIssues || [],
    description: 'Potential areas of sexual imbalance'
  });

  // 6. Dosha Severity
  const doshas = report.doshaAnalysis?.doshas || [];
  const severeDoshas = doshas.filter((d: any) => d.severity === 'severe' || d.severity === 'moderate');
  const doshaScore = severeDoshas.length * 25;
  dimensions.push({
    key: 'dosha',
    label: 'Dosha Impact',
    score: Math.min(doshaScore, 100),
    level: getLevel(Math.min(doshaScore, 100)),
    icon: <TrendingDown className="w-5 h-5" />,
    indicators: severeDoshas.map((d: any) => `${d.name}: ${d.severity}`),
    description: 'Impact of astrological doshas on marriage'
  });

  // Radar chart data
  const radarData = dimensions.map(d => ({
    subject: d.label,
    score: d.score,
    fullMark: 100
  }));

  // Overall risk score
  const avgRisk = Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length);
  const overallLevel = getLevel(avgRisk);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-600 dark:text-emerald-400';
      case 'medium': return 'text-amber-600 dark:text-amber-400';
      case 'high': return 'text-orange-600 dark:text-orange-400';
      case 'very_high': return 'text-rose-600 dark:text-rose-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'low': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50';
      case 'medium': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/50';
      case 'very_high': return 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/50';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'low': return 'Low Risk';
      case 'medium': return 'Moderate';
      case 'high': return 'High';
      case 'very_high': return 'Very High';
      default: return 'Unknown';
    }
  };

  const radarColor = overallLevel === 'low' ? '#10b981' : overallLevel === 'medium' ? '#f59e0b' : overallLevel === 'high' ? '#f97316' : '#ef4444';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 via-red-900 to-orange-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Shield className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <Shield className="w-10 h-10 text-rose-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Personal Risk Radar</h2>
              <p className="text-rose-200/80">Individual red flag assessment across 6 dimensions</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="text-sm text-rose-200/60">Overall Risk:</span>
            <span className={`text-2xl font-bold ${avgRisk < 30 ? 'text-emerald-300' : avgRisk < 50 ? 'text-amber-300' : 'text-rose-300'}`}>
              {avgRisk}/100
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${avgRisk < 30 ? 'bg-emerald-500/20 text-emerald-200' : avgRisk < 50 ? 'bg-amber-500/20 text-amber-200' : 'bg-rose-500/20 text-rose-200'}`}>
              {getLevelLabel(overallLevel)}
            </span>
          </div>
        </div>
      </div>

      {/* Spider Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">Risk Distribution</h3>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar
              name="Risk Score"
              dataKey="score"
              stroke={radarColor}
              fill={radarColor}
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip
              formatter={(value: number | string) => [`${value}/100`, 'Risk Score']}
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f3f4f6' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Cards */}
      <div className="space-y-3">
        {dimensions.map(dim => (
          <div key={dim.key} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setExpandedRisk(expandedRisk === dim.key ? null : dim.key)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getLevelBg(dim.level)}`}>
                  {dim.icon}
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">{dim.label}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{dim.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Risk meter bar */}
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${dim.score < 25 ? 'bg-emerald-500' : dim.score < 50 ? 'bg-amber-500' : dim.score < 75 ? 'bg-orange-500' : 'bg-rose-500'}`}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
                <span className={`text-sm font-bold min-w-[2rem] text-right ${getLevelColor(dim.level)}`}>{dim.score}</span>
                {expandedRisk === dim.key ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>

            {expandedRisk === dim.key && dim.indicators.length > 0 && (
              <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                <div className="mt-3 space-y-2">
                  {dim.indicators.map((indicator, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{indicator}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {expandedRisk === dim.key && dim.indicators.length === 0 && (
              <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>No significant indicators detected</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
