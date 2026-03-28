import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';

const relatedFeatures = [
  { slug: 'mental-health', title: 'Mental Health Profile' },
  { slug: 'psychological-profile', title: 'Psychological Profile' },
  { slug: 'divorce-risk', title: 'Divorce Risk Radar' },
];

const riskCards = [
  {
    label: 'Alcohol Risk',
    value: 'Low',
    icon: '🍷',
    color: 'green',
    detail: 'Moon in Cancer unafflicted. No Saturn–Moon conjunction. Emotional regulation is strong.',
  },
  {
    label: 'Substance Risk',
    value: 'Very Low',
    icon: '💊',
    color: 'green',
    detail: 'No Ketu in 1st or 12th. Venus is dignified. 12th house lord Saturn well-placed in 10th.',
  },
  {
    label: 'Compulsive Behavior',
    value: 'Moderate',
    icon: '🌀',
    color: 'amber',
    detail: 'Rahu in 5th house creates intensity around pleasurable activities. Requires conscious moderation.',
  },
  {
    label: 'Protective Factors',
    value: '2 Strong',
    icon: '🛡️',
    color: 'blue',
    detail: 'Jupiter aspects both Rahu and Moon — strong spiritual buffer. Saturn in 10th provides discipline framework.',
  },
];

const indicators = [
  {
    category: 'Alcohol Tendency',
    level: 'Low',
    icon: '🌊',
    planets: ['Moon', 'Saturn', 'Jupiter'],
    note: 'Moon–Saturn conjunction is the primary alcohol indicator — not present here. Jupiter\'s 5th-house trine to Moon adds resilience.',
  },
  {
    category: 'Substance Vulnerability',
    level: 'Very Low',
    icon: '🔮',
    planets: ['Venus', 'Ketu', '12th House'],
    note: 'Venus–Ketu combination (escapism through sensory pleasure) not present. 12th house lord is strong and well-placed.',
  },
  {
    category: 'Compulsive Behavior',
    level: 'Moderate',
    icon: '🌀',
    planets: ['Rahu', '5th House'],
    note: 'Rahu in 5th house: intensifies desire for pleasurable experiences. Can manifest as compulsive scrolling, gambling, or overindulgence. Moderate concern.',
  },
  {
    category: 'Escapism Tendency',
    level: 'Low',
    icon: '🌁',
    planets: ['Venus', 'Neptune (Western)', '12th House'],
    note: 'No Venus–Ketu conjunction or 12th house emphasis. Escapism risk is minimal.',
  },
];

const protectiveFactors = [
  {
    name: 'Jupiter Aspect on Rahu',
    strength: 'Strong',
    desc: 'Jupiter\'s 9th-house aspect on Rahu in the 5th dilutes Rahu\'s compulsive quality with wisdom and restraint.',
  },
  {
    name: 'Saturn in 10th House',
    strength: 'Strong',
    desc: 'Saturn in the 10th creates a strong sense of professional identity and responsibility — a natural deterrent to addictive behaviors.',
  },
];

const colorMap: Record<string, string> = {
  green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200',
  amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200',
  blue:  'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200',
};

const levelBadge: Record<string, string> = {
  'Very Low': 'bg-green-500',
  'Low':      'bg-green-400',
  'Moderate': 'bg-amber-500',
  'High':     'bg-orange-500',
  'Very High':'bg-red-500',
};

export const AddictionRiskPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SEOHead
      title="Addiction Risk Profile — Vulnerability Indicators from Your Birth Chart | Astro Marriage"
      description="Saturn-Moon combinations, Rahu placements, Venus-Ketu aspects, and 12th house emphasis reveal addiction vulnerability. Jupiter and Saturn also provide protective factors."
      path="/features/addiction-risk"
    />

    {/* Breadcrumb */}
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Home</Link>
      <span>/</span>
      <Link to="/features" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Features</Link>
      <span>/</span>
      <span className="text-gray-700 dark:text-gray-200">Addiction Risk Profile</span>
    </div>

    {/* Hero */}
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Vulnerability Analysis
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Addiction Risk Profile — Vulnerability Indicators from Birth Chart
        </h1>
        <p className="text-xl text-white/90 max-w-2xl">
          Saturn–Moon, Rahu in 5th, Venus–Ketu — specific planetary patterns reveal addiction vulnerability. Jupiter and Saturn also provide strong protective factors that offset these tendencies.
        </p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 flex gap-3">
        <span className="text-xl flex-shrink-0">⚠️</span>
        <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
          This analysis identifies astrological tendencies and vulnerability patterns — it does not diagnose addiction or any medical condition. Always consult a qualified healthcare professional for clinical assessment.
        </p>
      </div>

      {/* What Is It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Is the Addiction Risk Profile?</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Vedic astrology has long studied the relationship between planetary positions and tendencies toward addictive or compulsive behavior. The Saturn–Moon conjunction or mutual aspect is the most classical indicator of emotional numbing — a coping mechanism that, when unchecked, can escalate into substance dependency. Rahu, the north node of the Moon, represents insatiable desires and compulsive patterns: Rahu in the 1st house (self-identity), 5th house (pleasures), or 7th house (relationships) creates an intensity that can manifest as compulsive scrolling, gambling, over-eating, or substance use. The Venus–Ketu combination specifically correlates with escapism — using sensory pleasure to avoid emotional pain.
          </p>
          <p>
            The 12th house in Vedic astrology represents isolation, hidden activities, and expenditure — excessive planetary emphasis here (multiple planets in 12th, or a debilitated 12th lord) increases vulnerability to hidden addictive behaviors. However, the system also identifies protective factors: Jupiter's aspect on an afflicted Moon buffers emotional numbing; Saturn in a strong house provides the discipline and structure needed to resist compulsive patterns. The Addiction Risk Profile presents both risk indicators AND protective factors, giving a complete and balanced picture.
          </p>
        </div>
      </section>

      {/* Why It Matters */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why It Matters</h2>
        <ul className="space-y-4">
          {[
            {
              icon: '🤝',
              heading: 'Partners understand each other\'s vulnerabilities',
              body: 'Knowing a partner has Rahu in the 5th house helps you understand their tendency toward intensity — and creates compassionate awareness rather than judgement when these patterns appear in the relationship.',
            },
            {
              icon: '🛡️',
              heading: 'Protective factors are as important as risk factors',
              body: 'Jupiter\'s aspect on an addictive placement is a classical antidote. This feature surfaces every protective planetary factor — giving a balanced risk picture rather than just flagging vulnerabilities.',
            },
            {
              icon: '🎯',
              heading: 'Targeted prevention strategies',
              body: 'Rather than generic "avoid alcohol" advice, specific planetary remedies address the root cause — a Saturn–Moon conjunction requires different interventions than a Rahu in 12th placement.',
            },
          ].map(({ icon, heading, body }) => (
            <li key={heading} className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="text-2xl flex-shrink-0">{icon}</span>
              <div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{heading}: </span>
                <span className="text-gray-700 dark:text-gray-300">{body}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Sample Output */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sample Output</h2>
          <span className="inline-flex items-center gap-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs font-semibold px-3 py-1 rounded-full border border-orange-200 dark:border-orange-700">
            📊 Ananya's Chart
          </span>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {riskCards.map(card => (
            <div key={card.label} className={`rounded-2xl border p-5 ${colorMap[card.color]}`}>
              <div className="text-3xl mb-2">{card.icon}</div>
              <div className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">{card.label}</div>
              <div className="text-xl font-bold">{card.value}</div>
              <p className="text-xs mt-2 opacity-80 leading-tight">{card.detail}</p>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Risk Indicator Breakdown</h3>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 mb-6">
          {indicators.map(ind => (
            <div key={ind.category} className="px-6 py-4 flex items-start gap-4">
              <span className="text-xl flex-shrink-0">{ind.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{ind.category}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${levelBadge[ind.level] ?? 'bg-gray-500'}`}>{ind.level}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{ind.note}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {ind.planets.map(p => (
                    <span key={p} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Protective factors */}
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Protective Factors</h3>
        <div className="space-y-3">
          {protectiveFactors.map(pf => (
            <div key={pf.name} className="bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800/40 p-5 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🛡️</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-green-900 dark:text-green-100 text-sm">{pf.name}</span>
                  <span className="text-[10px] font-bold uppercase bg-green-200 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">{pf.strength}</span>
                </div>
                <p className="text-xs text-green-700 dark:text-green-400">{pf.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How To Read */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How To Read the Addiction Risk Profile</h2>
        <ol className="space-y-4">
          {[
            { step: 1, title: 'Check the four metric cards first', detail: 'Each card covers a distinct risk domain. A Low score in one area does not imply Low in another — these are independent planetary patterns.' },
            { step: 2, title: 'Read the indicator breakdown for root causes', detail: 'Each risk level comes from specific planets and house placements. The breakdown shows you the exact astrological source — not a computed average.' },
            { step: 3, title: 'Count protective factors', detail: 'Strong protective factors (2 or more) significantly offset moderate risk indicators. A chart with Moderate compulsion risk but two strong Jupiter protections has a good overall prognosis.' },
            { step: 4, title: 'Use as awareness, not diagnosis', detail: 'This profile is an awareness tool. If you or your partner identify strongly with any moderate or high risk indicator, consider it an invitation to self-inquiry or professional consultation — not a verdict.' },
          ].map(({ step, title, detail }) => (
            <li key={step} className="flex gap-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 flex items-center justify-center font-bold text-sm">
                {step}
              </span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">See Your Addiction Risk Profile</h2>
        <p className="text-white/85 mb-6 max-w-md mx-auto">
          Enter your birth details for a full vulnerability and protective-factor report — for both partners, with side-by-side comparison.
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-white text-orange-700 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
        >
          Calculate Now
        </Link>
      </section>

      {/* Related */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Related Features</h3>
        <div className="flex flex-wrap gap-3">
          {relatedFeatures.map(f => (
            <Link
              key={f.slug}
              to={`/features/${f.slug}`}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-orange-400 dark:hover:border-orange-500 transition-colors"
            >
              {f.title} →
            </Link>
          ))}
        </div>
      </section>

    </div>
  </div>
);

export default AddictionRiskPage;
