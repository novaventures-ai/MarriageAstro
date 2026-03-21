import React, { useState } from 'react';
import { SelfAnalysisReport } from '../../types/selfAnalysis';
import {
  Zap, Shield, Heart, MessageCircle, ChevronDown, ChevronUp,
  Flame, Wind, Droplets, AlertTriangle, CheckCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface SelfConflictTendencyWidgetProps {
  report: SelfAnalysisReport;
}

interface ConflictDimension {
  key: string;
  label: string;
  score: number; // 0-100 (higher = more intense)
  icon: React.ReactNode;
  indicators: string[];
  advice: string;
}

export const SelfConflictTendencyWidget: React.FC<SelfConflictTendencyWidgetProps> = ({ report }) => {
  const [expandedDim, setExpandedDim] = useState<string | null>(null);
  const chart = report.chart;
  const planets = chart?.planetaryPositions || [];

  // Derive conflict dimensions from chart data
  const getMarsHouse = () => {
    const mars = planets.find((p: any) => p.planet === 'Mars');
    return mars?.house || 0;
  };

  const getMoonSign = () => {
    const moon = planets.find((p: any) => p.planet === 'Moon');
    return moon?.sign || '';
  };

  const getSaturnHouse = () => {
    const saturn = planets.find((p: any) => p.planet === 'Saturn');
    return saturn?.house || 0;
  };

  const getMercuryStrength = () => {
    const mercury = planets.find((p: any) => p.planet === 'Mercury');
    if (!mercury) return 50;
    const strong = ['Gemini', 'Virgo'].includes(mercury.sign);
    const weak = ['Sagittarius', 'Pisces'].includes(mercury.sign);
    return strong ? 30 : weak ? 75 : 50;
  };

  const marsHouse = getMarsHouse();
  const moonSign = getMoonSign();
  const saturnHouse = getSaturnHouse();

  // Anger intensity: Mars in angular houses (1,4,7,10) = high, 6,8,12 = very high
  const marsAngular = [1, 4, 7, 10].includes(marsHouse);
  const marsDusthana = [6, 8, 12].includes(marsHouse);
  const angerScore = marsDusthana ? 80 : marsAngular ? 65 : 35;

  // Stress tolerance: Saturn strong = high tolerance, Moon in water signs = emotional
  const waterMoon = ['Cancer', 'Scorpio', 'Pisces'].includes(moonSign);
  const stressScore = waterMoon ? 70 : [1, 4, 7, 10].includes(saturnHouse) ? 40 : 55;

  // Communication friction: Mercury strength
  const commScore = getMercuryStrength();

  // Compromise ability: Venus + Jupiter positions
  const venus = planets.find((p: any) => p.planet === 'Venus');
  const jupiter = planets.find((p: any) => p.planet === 'Jupiter');
  const venusStrong = venus && ['Taurus', 'Libra', 'Pisces'].includes(venus.sign);
  const jupiterStrong = jupiter && [1, 5, 9, 11].includes(jupiter.house || 0);
  const compromiseScore = venusStrong && jupiterStrong ? 25 : venusStrong || jupiterStrong ? 45 : 65;

  // Stubbornness: Fixed signs emphasis
  const fixedSigns = ['Taurus', 'Leo', 'Scorpio', 'Aquarius'];
  const fixedCount = planets.filter((p: any) => fixedSigns.includes(p.sign)).length;
  const stubbornnessScore = Math.min(fixedCount * 15, 90);

  const dimensions: ConflictDimension[] = [
    {
      key: 'anger',
      label: 'Anger Intensity',
      score: angerScore,
      icon: <Flame className="w-5 h-5" />,
      indicators: [
        `Mars in ${marsHouse}${marsHouse === 1 ? 'st' : marsHouse === 2 ? 'nd' : marsHouse === 3 ? 'rd' : 'th'} house`,
        marsDusthana ? 'Mars in dusthana house — quick temper likely' : marsAngular ? 'Mars in angular house — assertive energy' : 'Mars in calm placement',
      ],
      advice: angerScore > 60 ? 'Practice cooling pranayama (Sheetali). Avoid decisions during anger spikes.' : 'Generally calm disposition. Maintain healthy expression of frustration.'
    },
    {
      key: 'stress',
      label: 'Stress Sensitivity',
      score: stressScore,
      icon: <Wind className="w-5 h-5" />,
      indicators: [
        `Moon in ${moonSign} — ${waterMoon ? 'highly empathetic and absorptive' : 'emotionally resilient'}`,
        `Saturn in ${saturnHouse}${saturnHouse === 1 ? 'st' : saturnHouse === 2 ? 'nd' : saturnHouse === 3 ? 'rd' : 'th'} house`,
      ],
      advice: stressScore > 60 ? 'Create firm emotional boundaries. Regular meditation is essential.' : 'Good stress tolerance. Build on this with structured routines.'
    },
    {
      key: 'communication',
      label: 'Communication Friction',
      score: commScore,
      icon: <MessageCircle className="w-5 h-5" />,
      indicators: [
        `Mercury in ${(planets.find((p: any) => p.planet === 'Mercury')?.sign) || 'unknown'}`,
        commScore > 60 ? 'Tendency toward misunderstanding or bluntness' : 'Generally clear communicator',
      ],
      advice: commScore > 60 ? 'Pause before responding in heated moments. Written communication may be clearer.' : 'Leverage your communication skills to defuse conflicts early.'
    },
    {
      key: 'compromise',
      label: 'Resistance to Compromise',
      score: compromiseScore,
      icon: <Heart className="w-5 h-5" />,
      indicators: [
        venusStrong ? 'Venus well-placed — natural mediator' : 'Venus needs support for diplomacy',
        jupiterStrong ? 'Jupiter supports wisdom in decisions' : 'Jupiter placement may cause rigidity',
      ],
      advice: compromiseScore > 60 ? 'Practice the 80/20 rule — win the war, not every battle.' : 'Natural ability to find middle ground. Use this to build lasting partnerships.'
    },
    {
      key: 'stubbornness',
      label: 'Stubbornness',
      score: stubbornnessScore,
      icon: <Shield className="w-5 h-5" />,
      indicators: [
        `${fixedCount} planet(s) in fixed signs (${fixedSigns.join(', ')})`,
        stubbornnessScore > 50 ? 'Strong fixed energy — determined but inflexible' : 'Adaptable nature',
      ],
      advice: stubbornnessScore > 60 ? 'Being right matters less than being happy. Practice letting go of control.' : 'Good flexibility. Ensure you also stand firm on important values.'
    },
  ];

  // Chart data for bar visualization
  const chartData = dimensions.map(d => ({
    name: d.label,
    score: d.score,
  }));

  const getBarColor = (score: number) => {
    if (score < 30) return '#10b981';
    if (score < 50) return '#f59e0b';
    if (score < 70) return '#f97316';
    return '#ef4444';
  };

  // Overall conflict tendency
  const avgConflict = Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-900 via-red-900 to-rose-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Zap className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <Zap className="w-10 h-10 text-orange-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Conflict Tendencies</h2>
              <p className="text-orange-200/80">How you handle anger, stress, and compromise</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-rose-200/60">Overall Intensity:</span>
            <span className={`text-2xl font-bold ${avgConflict < 40 ? 'text-emerald-300' : avgConflict < 60 ? 'text-amber-300' : 'text-rose-300'}`}>
              {avgConflict}/100
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${avgConflict < 40 ? 'bg-emerald-500/20 text-emerald-200' : avgConflict < 60 ? 'bg-amber-500/20 text-amber-200' : 'bg-rose-500/20 text-rose-200'}`}>
              {avgConflict < 40 ? 'Peaceful' : avgConflict < 60 ? 'Moderate' : 'Intense'}
            </span>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">Conflict Profile</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={130} />
            <Tooltip
              formatter={(value: number) => [`${value}/100`, 'Intensity']}
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f3f4f6' }}
            />
            <Bar dataKey="score" radius={[0, 6, 6, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={getBarColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Expandable Cards */}
      <div className="space-y-3">
        {dimensions.map(dim => (
          <div key={dim.key} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setExpandedDim(expandedDim === dim.key ? null : dim.key)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${dim.score < 40 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : dim.score < 60 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'}`}>
                  {dim.icon}
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">{dim.label}</h4>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dim.score < 40 ? 'bg-emerald-500' : dim.score < 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300 min-w-[2rem] text-right">{dim.score}</span>
                {expandedDim === dim.key ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </button>

            {expandedDim === dim.key && (
              <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 space-y-3 mt-2">
                <div className="space-y-1">
                  {dim.indicators.map((ind, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{ind}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800/50">
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <span className="text-blue-800 dark:text-blue-200">{dim.advice}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
