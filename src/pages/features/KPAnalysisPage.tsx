import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';

const relatedFeatures = [
  { slug: 'marriage-timing', title: 'Marriage Timing' },
  { slug: 'chara-dasha', title: 'Chara Dasha' },
  { slug: 'divisional-charts', title: 'Divisional Charts' },
];

const kpTableRows = [
  { planet: 'Venus', starLord: 'Venus', subLord: 'Jupiter', signLord: 'Libra', houses: '2nd, 7th, 11th', verdict: 'promised', note: 'Strong marriage promise' },
  { planet: 'Jupiter', starLord: 'Moon', subLord: 'Venus', signLord: 'Pisces', houses: '2nd, 9th, 11th', verdict: 'promised', note: 'Supportive second promise' },
  { planet: 'Mars', starLord: 'Saturn', subLord: 'Mars', signLord: 'Scorpio', houses: '3rd, 8th, 12th', verdict: 'denied', note: 'Separative — not a timing planet' },
  { planet: 'Moon', starLord: 'Jupiter', subLord: 'Mercury', signLord: 'Cancer', houses: '4th, 7th', verdict: 'partial', note: 'Partial: 7th house only' },
];

const significatorChain = [
  { label: 'Planet', value: 'Venus', color: 'bg-pink-100 dark:bg-pink-900/40 text-pink-800 dark:text-pink-200' },
  { label: 'Star Lord', value: 'Venus → Jupiter', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200' },
  { label: 'Sub Lord', value: 'Jupiter → Moon', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200' },
  { label: 'Sign Lord', value: 'Moon → Libra', color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200' },
];

export const KPAnalysisPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SEOHead
      title="KP Analysis — 249-Point Sub-Lord Precision System | Astro Marriage"
      description="Krishnamurti Paddhati (KP) uses 249 sub-lords to deliver pin-point marriage timing. Learn how the 7th Cuspal Sub Lord, 4-fold significator chain, and 2-7-11 house signification work."
      path="/features/kp-analysis"
    />

    {/* Breadcrumb */}
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Home</Link>
      <span>/</span>
      <Link to="/features" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Features</Link>
      <span>/</span>
      <span className="text-gray-700 dark:text-gray-200">KP Analysis</span>
    </div>

    {/* Hero */}
    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Precision Timing
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          KP Analysis — 249-Point Sub-Lord Precision System
        </h1>
        <p className="text-xl text-white/90 max-w-2xl">
          Krishnamurti Paddhati divides the zodiac into 249 sub-lords for surgical-precision marriage timing — far beyond traditional sign-based systems.
        </p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      {/* What Is It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Is KP Astrology?</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Krishnamurti Paddhati (KP) is a refined system of Vedic astrology developed by Prof. K.S. Krishnamurti. Instead of dividing the zodiac into 12 signs alone, KP subdivides each nakshatra (star) into 9 further sub-divisions — creating 249 unique "sub-lords" across the 360° zodiac. Every degree of every house cusp falls in the territory of a specific planet (sign lord), within a nakshatra (star lord), within a sub-division (sub-lord). This three-layer precision identifies the exact nature of a cusp's result far more accurately than sign placement alone.
          </p>
          <p>
            For marriage, the 7th house Cuspal Sub Lord (CSL) is the master key. If the 7th CSL is itself a significator of houses 2, 7, and 11 — through its own star lord and sub lord — marriage is "promised" in the chart. The 4-fold significator chain traces the connection: Planet → its Star Lord → its Sub Lord → Sign Lord. Houses 2 (family), 7 (spouse), and 11 (fulfilment of desires) must all appear in this chain for a marriage promise to be confirmed.
          </p>
        </div>
      </section>

      {/* Why It Matters */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why It Matters</h2>
        <ul className="space-y-4">
          {[
            {
              icon: '🎯',
              heading: 'Pin-point timing precision',
              body: 'Traditional Vimshottari gives windows of months or years. KP narrows marriage windows to specific months using ruling planets active at the time of query, cross-referenced with the 7th CSL chain.',
            },
            {
              icon: '🔗',
              heading: 'Chain-level attribution',
              body: 'The 4-fold significator chain reveals exactly which planet is the ultimate trigger for marriage — not just "Venus is strong". You can see that Venus triggers via Jupiter\'s star and Moon\'s sub, making Jupiter and Moon the actual activating layers.',
            },
            {
              icon: '✅',
              heading: 'Binary marriage promise check',
              body: 'Unlike interpretive systems, KP delivers a clear verdict: marriage is "promised", "denied", or "complicated" — based purely on whether houses 2-7-11 appear in the 7th CSL significator chain. No ambiguity.',
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

      {/* Example Output */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Example Output</h2>
          <span className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700">
            📊 Sample Data
          </span>
        </div>

        {/* 4-fold chain visual */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">7th Cuspal Sub Lord Analysis</h3>
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-bold px-4 py-2 rounded-full border border-green-300 dark:border-green-700 mb-5">
            ✓ Marriage Promised — 7th CSL signifies 2nd, 7th & 11th houses
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-mono">7th CSL: Venus · Houses signified: 2nd ✓ · 7th ✓ · 11th ✓</p>

          {/* Chain diagram */}
          <div className="flex flex-wrap items-center gap-2">
            {significatorChain.map((step, i) => (
              <React.Fragment key={step.label}>
                <div className={`flex flex-col items-center rounded-xl px-4 py-3 ${step.color}`}>
                  <span className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">{step.label}</span>
                  <span className="font-bold text-sm">{step.value}</span>
                </div>
                {i < significatorChain.length - 1 && (
                  <span className="text-gray-400 dark:text-gray-500 font-bold">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Significators table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Significator Chain — All Planets</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Only planets signifying 2-7-11 can time marriage</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {['Planet', 'Star Lord', 'Sub Lord', 'Sign', 'Houses Signified', 'Verdict'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {kpTableRows.map(row => (
                  <tr key={row.planet} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{row.planet}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{row.starLord}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{row.subLord}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{row.signLord}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">{row.houses}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                        row.verdict === 'promised' ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300' :
                        row.verdict === 'denied'   ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300' :
                                                     'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                      }`}>
                        {row.verdict === 'promised' ? '✓ Promised' : row.verdict === 'denied' ? '✗ Denied' : '~ Partial'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How To Read It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How To Read the KP Analysis</h2>
        <ol className="space-y-4">
          {[
            { step: 1, title: 'Check the 7th CSL verdict', detail: 'The top card shows "Promised", "Denied", or "Complicated". This is the binary marriage promise from KP. Promised = the chart allows marriage.' },
            { step: 2, title: 'Trace the 4-fold chain', detail: 'Each planet flows through Star Lord → Sub Lord → Sign Lord. If all three layers lead back to houses 2, 7, or 11 — that planet can time your marriage.' },
            { step: 3, title: 'Identify timing planets', detail: 'Only planets marked "Promised" in the significator table are eligible to trigger marriage. These become your Dasha/Antardasha candidates.' },
            { step: 4, title: 'Cross-reference with ruling planets', detail: 'The planets ruling the current moment (ascendant lord, Moon nakshatra lord, day lord) confirm when a timing planet is most activated.' },
          ].map(({ step, title, detail }) => (
            <li key={step} className="flex gap-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
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
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Run Your KP Analysis</h2>
        <p className="text-white/85 mb-6 max-w-md mx-auto">
          Enter your birth details to get a full 249-sub-lord analysis with 7th CSL verdict, 4-fold significator chain, and marriage timing planets.
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
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
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              {f.title} →
            </Link>
          ))}
        </div>
      </section>

    </div>
  </div>
);

export default KPAnalysisPage;
