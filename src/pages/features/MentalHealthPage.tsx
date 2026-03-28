import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';

const relatedFeatures = [
  { slug: 'psychological-profile', title: 'Psychological Profile' },
  { slug: 'addiction-risk', title: 'Addiction Risk' },
  { slug: 'relationship-patterns', title: 'Relationship Patterns' },
];

const metricCards = [
  { label: 'Depression Risk', value: 'Low', color: 'green', icon: '😌', detail: 'Moon in Cancer trine Jupiter — strong emotional resilience foundation.' },
  { label: 'Anxiety Tendency', value: 'Moderate', color: 'amber', icon: '🌀', detail: 'Mercury conjunct Rahu creates intermittent restlessness. Manageable with awareness.' },
  { label: 'Emotional Stability', value: 'High', color: 'green', icon: '⚖️', detail: 'Sun-Moon mutual aspect provides a stable inner core under pressure.' },
  { label: 'Stress Resilience', value: 'Strong', color: 'blue', icon: '🛡️', detail: 'Saturn\'s aspect on the 4th house builds long-term coping strength through discipline.' },
];

const indicators = [
  { category: 'Depression', level: 'Low', icon: '💙', planets: ['Moon', 'Jupiter'], note: 'Moon dignified in Cancer; Jupiter\'s 5th-house trine buffers emotional lows.' },
  { category: 'Anxiety', level: 'Moderate', icon: '🌊', planets: ['Mercury', 'Rahu'], note: 'Mercury–Rahu conjunction in 3rd house: rapid thinking, mental scatter under pressure.' },
  { category: 'Emotional Stability', level: 'High', icon: '🌟', planets: ['Sun', 'Moon'], note: 'Sun and Moon in mutual 7th aspect create a stable emotional baseline.' },
  { category: 'Personality Duality', level: 'Low', icon: '🎭', planets: ['Lagna', 'Navamsa Lagna'], note: 'Lagna and Navamsa Lagna both fire signs — consistent self-expression.' },
  { category: 'Psychotic Tendencies', level: 'Very Low', icon: '🔮', planets: ['Ketu', 'Moon'], note: 'Ketu is in 9th house, away from Moon — no dissociative indicators found.' },
];

const colorMap: Record<string, string> = {
  green: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700',
  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-700',
  blue:  'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700',
  red:   'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700',
};

const levelColor: Record<string, string> = {
  'Very Low': 'bg-green-500',
  'Low':      'bg-green-400',
  'Moderate': 'bg-amber-500',
  'High':     'bg-blue-500',
  'Very High':'bg-red-500',
};

export const MentalHealthPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SEOHead
      title="Mental Health Profile — Emotional Resilience from Your Birth Chart | Astro Marriage"
      description="Discover how your Moon sign, Mercury, 4th and 5th houses reveal depression risk, anxiety tendency, emotional stability, and stress resilience in your Vedic birth chart."
      path="/features/mental-health"
    />

    {/* Breadcrumb */}
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Home</Link>
      <span>/</span>
      <Link to="/features" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Features</Link>
      <span>/</span>
      <span className="text-gray-700 dark:text-gray-200">Mental Health Profile</span>
    </div>

    {/* Hero */}
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Emotional Wellness
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Mental Health Profile — Emotional Resilience from Your Birth Chart
        </h1>
        <p className="text-xl text-white/90 max-w-2xl">
          Moon, Mercury, and house placements reveal your emotional baseline, anxiety patterns, and psychological strengths before they become relationship challenges.
        </p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      {/* What Is It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Is the Mental Health Profile?</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            In Vedic astrology, the Moon is the planet of mind and emotional nature — its sign, nakshatra, and aspects define your emotional baseline. A Moon in Cancer or Taurus, strong by sign and unafflicted, produces emotional groundedness. A Moon conjunct Rahu or Saturn, or debilitated in Scorpio, introduces anxiety, mood volatility, or emotional numbing tendencies. Similarly, Mercury — planet of intellect and the nervous system — under Rahu's influence generates racing thoughts and over-analysis, while a well-placed Mercury in Gemini or Virgo produces clear, calm reasoning under pressure.
          </p>
          <p>
            The 4th house represents emotional security and one's inner home. Malefics in the 4th (Saturn, Mars, Rahu) can create a restless inner world even when life appears stable. The 5th house governs creative expression and, when afflicted, becomes a source of anxiety and overthinking about the future. This module synthesises all these signals into five scored categories — depression risk, anxiety tendency, personality duality, psychotic tendencies, and emotional stability — and also surfaces your chart's protective factors.
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
              heading: 'Partners understand each other better',
              body: 'Knowing that your partner\'s Mercury–Rahu conjunction causes periodic anxiety spells — rather than attributing it to mood swings or relationship problems — fundamentally changes how you support each other.',
            },
            {
              icon: '🌱',
              heading: 'Targeted remedies for root causes',
              body: 'Rather than generic "meditate more" advice, the profile pinpoints the exact planet and house driving each tendency, enabling precise remedies — specific mantras, gemstones, or routines — to address the root.',
            },
            {
              icon: '🔮',
              heading: 'Pre-marriage awareness prevents surprises',
              body: 'Understanding each other\'s emotional architecture before marriage avoids the shock of discovering post-wedding that a partner has deep anxiety patterns or requires significant emotional space.',
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
          <span className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full border border-green-200 dark:border-green-700">
            📊 Sample Data — Ananya's Chart
          </span>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {metricCards.map(card => (
            <div key={card.label} className={`rounded-2xl border p-5 ${colorMap[card.color]}`}>
              <div className="text-3xl mb-2">{card.icon}</div>
              <div className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">{card.label}</div>
              <div className="text-xl font-bold">{card.value}</div>
              <p className="text-xs mt-2 opacity-80 leading-tight">{card.detail}</p>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Category-by-Category Breakdown</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {indicators.map(ind => (
              <div key={ind.category} className="px-6 py-4 flex items-start gap-4">
                <span className="text-xl flex-shrink-0">{ind.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{ind.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${levelColor[ind.level] ?? 'bg-gray-500'}`}>{ind.level}</span>
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
        </div>
      </section>

      {/* How To Read It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How To Read the Mental Health Profile</h2>
        <ol className="space-y-4">
          {[
            { step: 1, title: 'Start with Overall Wellbeing', detail: 'The headline status (Strong / Moderate / Needs Attention / Vulnerable) gives you an at-a-glance picture. Most charts fall in the Moderate range — this is normal, not alarming.' },
            { step: 2, title: 'Check the four metric cards', detail: 'Depression Risk, Anxiety Tendency, Emotional Stability, and Stress Resilience each come from different planetary sources. A high score in one category does not affect others.' },
            { step: 3, title: 'Expand category cards for detail', detail: 'Each category lists specific planetary indicators — the exact planet, aspect, or house placement responsible. This is the root cause, not a generic description.' },
            { step: 4, title: 'Read Emotional Strengths section', detail: 'Protective factors from Jupiter aspects, dignified Moon, or strong Saturn offset risk scores. A person can have moderate anxiety risk AND strong resilience — context matters.' },
          ].map(({ step, title, detail }) => (
            <li key={step} className="flex gap-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
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
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">See Your Mental Health Profile</h2>
        <p className="text-white/85 mb-6 max-w-md mx-auto">
          Enter your birth details to receive a full emotional resilience report including per-partner comparison and protective factor analysis.
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-lg"
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
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-green-400 dark:hover:border-green-500 transition-colors"
            >
              {f.title} →
            </Link>
          ))}
        </div>
      </section>

    </div>
  </div>
);

export default MentalHealthPage;
