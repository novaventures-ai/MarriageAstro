import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';

const relatedFeatures = [
  { slug: 'yoga-dosha', title: 'Yoga & Dosha Analysis' },
  { slug: 'kp-analysis', title: 'KP Analysis' },
  { slug: 'mental-health', title: 'Mental Health Profile' },
];

const gemstoneRemedies = [
  {
    stone: 'Blue Sapphire',
    planet: 'Saturn',
    metal: 'Silver',
    finger: 'Middle finger',
    day: 'Saturday',
    mantra: 'Om Sham Shanaischaraya Namah',
    purpose: 'Mitigates Saturn affliction in 7th house causing delay',
    color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700',
    badge: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300',
  },
  {
    stone: 'Yellow Sapphire',
    planet: 'Jupiter',
    metal: 'Gold',
    finger: 'Index finger',
    day: 'Thursday',
    mantra: 'Om Brim Brihaspataye Namah',
    purpose: 'Strengthens Jupiter for marriage blessings and prosperity',
    color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700',
    badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300',
  },
  {
    stone: 'Diamond / White Zircon',
    planet: 'Venus',
    metal: 'Platinum or White Gold',
    finger: 'Ring finger',
    day: 'Friday',
    mantra: 'Om Shum Shukraya Namah',
    purpose: 'Enhances Venus — the primary significator of love and marriage',
    color: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-700',
    badge: 'bg-pink-100 dark:bg-pink-900/40 text-pink-800 dark:text-pink-300',
  },
];

const lalKitabRemedies = [
  { planet: 'Rahu', remedy: 'Feed black dogs on Saturdays; donate blue clothes', effect: 'Reduces Rahu-driven obsession and compulsive attraction patterns' },
  { planet: 'Saturn', remedy: 'Offer mustard oil at a Shani temple on Saturday mornings', effect: 'Eases Saturn delays in marriage and relationship responsibilities' },
  { planet: 'Mars', remedy: 'Donate red lentils (masoor dal) on Tuesdays', effect: 'Channels Mars energy constructively, reduces Mangal Dosha intensity' },
];

const modernRemedies = [
  { icon: '\u{1F9D8}', title: 'Morning Mindfulness', desc: 'A 10-minute morning meditation anchors the restless Mercury\u2013Rahu mind before the day begins.' },
  { icon: '\u{1F4FF}', title: 'Mantra Repetition', desc: "Chanting the Venus mantra 108 times on Fridays activates Venus's protective aspect in the chart." },
  { icon: '\u{1F33F}', title: 'Nature Immersion', desc: 'Regular time in nature is prescribed for 4th-house afflictions \u2014 it rebuilds emotional security grounding.' },
  { icon: '\u{1F3A8}', title: 'Creative Expression', desc: 'For 5th-house anxiety, structured creative practice (music, art, writing) releases pent-up energy productively.' },
];

export const RemediesPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SEOHead
      title="Personalized Remedies — Vedic Solutions for Your Specific Chart | Astro Marriage"
      description="Get chart-specific Vedic remedies: gemstone recommendations with metal, finger and mantra, Lal Kitab remedies, and modern lifestyle adjustments tailored to your planetary placements."
      path="/features/remedies"
    />

    {/* Breadcrumb */}
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Home</Link>
      <span>/</span>
      <Link to="/features" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Features</Link>
      <span>/</span>
      <span className="text-gray-700 dark:text-gray-200">Personalized Remedies</span>
    </div>

    {/* Hero */}
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Vedic Solutions
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Personalized Remedies — Vedic Solutions for Your Specific Chart
        </h1>
        <p className="text-xl text-white/90 max-w-2xl">
          Unlike generic advice, every remedy here is derived from the exact planetary placements in your birth chart — gemstones, Lal Kitab rituals, mantras, and modern lifestyle adjustments, all personalised.
        </p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      {/* What Is It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Are Vedic Remedies?</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Vedic remedies are practical interventions designed to mitigate the negative influence of afflicted planets or strengthen weak benefic planets in your birth chart. They operate on the principle of resonance: a gemstone worn against the skin continuously amplifies the vibrational frequency of its associated planet, while rituals performed on specific days (linked to planetary rulership) engage the same energy at regular intervals. Lal Kitab remedies — from the 19th-century North Indian astrological compendium — are often simpler daily actions that achieve similar results through symbolic correspondence rather than gemstone amplification.
          </p>
          <p>
            This module generates three tiers of remedies for your chart: gemstone recommendations (including stone type, metal setting, finger, and daily mantra), Lal Kitab rituals targeting specific planetary afflictions, and modern lifestyle adjustments that align with the same planetary principles but require no special materials. All recommendations are derived from the actual planetary positions, house placements, and dosha patterns found in your chart — not from Sun sign or Moon sign alone.
          </p>
        </div>
      </section>

      {/* Why It Matters */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why It Matters</h2>
        <ul className="space-y-4">
          {[
            {
              icon: '💎',
              heading: 'Chart-specific, not generic',
              body: 'Every remedies platform recommends gemstones based on your Sun or Moon sign. This system reads your actual chart — which planets are afflicted, in which houses, by which aspect — and prescribes accordingly.',
            },
            {
              icon: '📅',
              heading: 'Tiered approach for every lifestyle',
              body: 'Not everyone can wear a gemstone or perform daily rituals. The three-tier system — gems, Lal Kitab rituals, and modern adjustments — ensures actionable options regardless of your lifestyle constraints.',
            },
            {
              icon: '🔗',
              heading: 'Linked to specific doshas and delays',
              body: 'Each remedy is tagged to the exact planetary problem it addresses (e.g., Saturn in 7th = marriage delay → Blue Sapphire + mustard oil offering). You always know WHY you\'re doing each remedy.',
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

      {/* Sample Output — Gemstones */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sample Output</h2>
          <span className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200 dark:border-amber-700">
            📊 Sample Chart Data
          </span>
        </div>

        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Gemstone Recommendations</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {gemstoneRemedies.map(gem => (
            <div key={gem.stone} className={`rounded-2xl border p-5 ${gem.color}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{gem.stone}</div>
                  <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${gem.badge}`}>{gem.planet} Remedy</span>
                </div>
                <span className="text-2xl">💎</span>
              </div>
              <div className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                <div><span className="font-medium">Metal:</span> {gem.metal}</div>
                <div><span className="font-medium">Finger:</span> {gem.finger}</div>
                <div><span className="font-medium">Day:</span> {gem.day}</div>
                <div className="pt-1">
                  <span className="font-medium block mb-0.5">Mantra:</span>
                  <span className="font-mono text-xs bg-white/60 dark:bg-black/20 px-2 py-1 rounded block">{gem.mantra}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">{gem.purpose}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lal Kitab */}
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Lal Kitab Remedies</h3>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 mb-8">
          {lalKitabRemedies.map(r => (
            <div key={r.planet} className="px-6 py-4 flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 flex items-center justify-center text-sm font-bold">
                {r.planet[0]}
              </span>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-0.5">{r.planet} — {r.remedy}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{r.effect}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modern adjustments */}
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Modern Lifestyle Adjustments</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {modernRemedies.map(m => (
            <div key={m.title} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-start gap-3">
              <span className="text-2xl">{m.icon}</span>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">{m.title}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How To Read It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How To Use Your Remedies</h2>
        <ol className="space-y-4">
          {[
            { step: 1, title: 'Prioritise by urgency', detail: 'Remedies are listed in priority order. The first gemstone listed targets the most impactful planetary affliction. Start there before adding more.' },
            { step: 2, title: 'Get gems tested before purchase', detail: 'Always have gemstones certified by a gemological lab. The remedy requires a natural, unheated stone of at least 2–3 carats to be effective.' },
            { step: 3, title: 'Perform activation rituals', detail: 'Before wearing a gem, it must be energised using the specified mantra on the correct day and time window (Shubh Muhurta). The app shows the next activation window.' },
            { step: 4, title: 'Track results over 40 days', detail: 'Vedic tradition holds that a remedy requires 40 days to integrate into a chart. Note changes in your emotional and relational patterns over this period.' },
          ].map(({ step, title, detail }) => (
            <li key={step} className="flex gap-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
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
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Get Your Personalised Remedies</h2>
        <p className="text-white/85 mb-6 max-w-md mx-auto">
          Enter your birth details for a complete remedies report — gemstones, Lal Kitab rituals, and lifestyle adjustments matched to your chart.
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-white text-amber-700 font-bold px-8 py-3 rounded-xl hover:bg-amber-50 transition-colors shadow-lg"
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
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-amber-400 dark:hover:border-amber-500 transition-colors"
            >
              {f.title} →
            </Link>
          ))}
        </div>
      </section>

    </div>
  </div>
);

export default RemediesPage;
