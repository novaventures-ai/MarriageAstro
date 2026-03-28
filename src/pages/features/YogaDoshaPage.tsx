import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';

const relatedFeatures = [
  { slug: 'divorce-risk', title: 'Divorce Risk Radar' },
  { slug: 'remedies', title: 'Personalized Remedies' },
  { slug: 'kp-analysis', title: 'KP Analysis' },
];

const yogasDetected = [
  {
    name: 'Kalatra Yoga',
    type: 'yoga',
    severity: 'mild',
    present: true,
    description: '7th lord Venus in the 9th house aspected by Jupiter — indicates a spouse of good moral character, philosophical nature, and foreign connection or long-distance meeting.',
    effect: 'Positive: attracts a learned, virtuous spouse. Marriage brings social respect.',
    icon: '✨',
  },
  {
    name: 'Dharma-Karmadhipati Yoga',
    type: 'yoga',
    severity: 'moderate',
    present: true,
    description: 'Exchange of 9th and 10th house lords — creates a powerful yoga for dharmic living. When present in both partners, it aligns their life-purpose trajectories.',
    effect: 'Positive: marriage accelerates both partners\' career and spiritual growth simultaneously.',
    icon: '⚖️',
  },
];

const doshasDetected = [
  {
    name: 'Mangal Dosha',
    type: 'dosha',
    severity: 'cancelled',
    present: false,
    description: 'Mars is placed in the 4th house (a Dosha-triggering position), BUT Jupiter aspects Mars exactly — this is a recognised cancellation rule in classical Vedic astrology.',
    effect: 'Cancelled: Mangal Dosha is nullified. No need for Kumbh Vivah or same-dosha matching requirement.',
    icon: '🔴',
    cancelled: true,
  },
  {
    name: 'Nadi Dosha',
    type: 'dosha',
    severity: 'absent',
    present: false,
    description: 'Bride and Groom have different Nadis (Ananya: Adi Nadi, Vikram: Madhya Nadi). Different Nadis = no Nadi Dosha.',
    effect: 'Clear: Nadi compatibility confirmed. This is the most serious dosha in Ashtakoot — absence is excellent news.',
    icon: '💧',
    cancelled: false,
  },
  {
    name: 'Bhakoot Dosha',
    type: 'dosha',
    severity: 'present',
    present: true,
    description: 'Moon signs are in a 6-8 relationship (Ananya in Aries, Vikram in Scorpio). The 6-8 position is the most challenging Bhakoot configuration.',
    effect: 'Caution: financial tensions and health challenges possible. Partially mitigated by strong Jupiter in both charts.',
    icon: '🌙',
    cancelled: false,
  },
  {
    name: 'Grahan Yoga',
    type: 'dosha',
    severity: 'absent',
    present: false,
    description: 'Sun or Moon conjunct Rahu or Ketu within 12° would create Grahan Yoga. No such conjunction found in either chart.',
    effect: 'Clear: No solar or lunar eclipse yoga in either chart.',
    icon: '🌑',
    cancelled: false,
  },
];

const summaryStats = [
  { label: 'Yogas Found', value: '2', sub: 'Both auspicious', color: 'text-green-600 dark:text-green-400' },
  { label: 'Doshas Present', value: '1', sub: 'Bhakoot Dosha (partial)', color: 'text-amber-600 dark:text-amber-400' },
  { label: 'Doshas Cancelled', value: '1', sub: 'Mangal Dosha nullified', color: 'text-blue-600 dark:text-blue-400' },
  { label: 'Overall Verdict', value: 'Favourable', sub: 'Net positive combination', color: 'text-purple-600 dark:text-purple-400' },
];

export const YogaDoshaPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SEOHead
      title="Marriage Yogas & Doshas — Auspicious and Inauspicious Combinations | Astro Marriage"
      description="Discover which planetary combinations (yogas) support your marriage and which doshas (Mangal, Nadi, Bhakoot, Grahan) are present — with cancellation rules applied."
      path="/features/yoga-dosha"
    />

    {/* Breadcrumb */}
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Home</Link>
      <span>/</span>
      <Link to="/features" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Features</Link>
      <span>/</span>
      <span className="text-gray-700 dark:text-gray-200">Yoga & Dosha Analysis</span>
    </div>

    {/* Hero */}
    <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Planetary Combinations
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Marriage Yogas & Doshas — Auspicious and Inauspicious Combinations
        </h1>
        <p className="text-xl text-white/90 max-w-2xl">
          Every birth chart contains planetary combinations that either support or challenge marriage. This feature identifies both yogas and doshas — with classical cancellation rules applied before reporting.
        </p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      {/* What Is It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Are Marriage Yogas and Doshas?</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            In Vedic astrology, a Yoga is a specific planetary combination that produces a predictable effect — like a chemical formula. Marriage Yogas are combinations that strengthen the 7th house, 7th lord, or Venus (the natural significator of love and marriage) in ways that actively support a happy, stable married life. Kalatra Yoga arises when the 7th lord is strongly placed in a trine or kendra, ideally aspected by Jupiter. Dharma-Karmadhipati Yoga, created by the exchange or conjunction of the 9th and 10th lords, indicates a couple whose marriage aligns with their life's higher purpose.
          </p>
          <p>
            A Dosha (literally "fault") is a specific configuration that introduces challenge or risk. The four major marriage doshas are: Mangal Dosha (Mars in houses 1, 4, 7, 8, or 12 — causes conflict and potential separation), Nadi Dosha (both partners have the same Nadi type — the most serious, believed to affect children's health), Bhakoot Dosha (6-8 or 12-2 Moon sign placement between partners — financial and health stresses), and Grahan Yoga (Sun or Moon conjunct Rahu or Ketu — causes emotional instability). Critically, each dosha has a list of classical cancellation rules — certain planetary conditions that neutralise the dosha even when it appears technically present.
          </p>
        </div>
      </section>

      {/* Why It Matters */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why It Matters</h2>
        <ul className="space-y-4">
          {[
            {
              icon: '🔍',
              heading: 'Cancellation rules are applied',
              body: 'Most platforms simply flag "Mangal Dosha present" without checking if Jupiter\'s aspect, same dosha in the partner, or other classical exceptions cancel it. This feature applies every recognised cancellation rule — avoiding unnecessary alarm.',
            },
            {
              icon: '⚖️',
              heading: 'Net assessment balances yogas and doshas',
              body: 'A chart with two strong marriage yogas and one uncancelled dosha has a NET positive outlook. Rather than treating doshas in isolation, the overall verdict weighs all detected combinations together.',
            },
            {
              icon: '💊',
              heading: 'Remedies are linked to uncancelled doshas',
              body: 'Every uncancelled dosha comes with a specific Vedic remedy (gemstone, mantra, ritual) that addresses the exact planetary problem. Remedies are targeted, not generic.',
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
          <span className="inline-flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-700">
            📊 Ananya × Vikram Sample
          </span>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {summaryStats.map(stat => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center">
              <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{stat.label}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Yogas */}
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Auspicious Yogas Detected</h3>
        <div className="space-y-3 mb-8">
          {yogasDetected.map(yoga => (
            <div key={yoga.name} className="bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-green-800/40 p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{yoga.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{yoga.name}</span>
                    <span className="text-[10px] font-bold uppercase bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">{yoga.severity}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{yoga.description}</p>
                  <p className="text-xs text-green-700 dark:text-green-400 font-medium">{yoga.effect}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Doshas */}
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Dosha Analysis</h3>
        <div className="space-y-3">
          {doshasDetected.map(dosha => (
            <div
              key={dosha.name}
              className={`bg-white dark:bg-gray-800 rounded-xl border p-5 ${
                dosha.cancelled ? 'border-blue-200 dark:border-blue-800/40' :
                dosha.present   ? 'border-amber-200 dark:border-amber-800/40' :
                                  'border-green-200 dark:border-green-800/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{dosha.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{dosha.name}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      dosha.cancelled ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' :
                      dosha.present   ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
                                        'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                    }`}>
                      {dosha.cancelled ? '✓ Cancelled' : dosha.present ? '⚠ Present' : '✓ Absent'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{dosha.description}</p>
                  <p className={`text-xs font-medium ${
                    dosha.cancelled ? 'text-blue-600 dark:text-blue-400' :
                    dosha.present   ? 'text-amber-600 dark:text-amber-400' :
                                      'text-green-600 dark:text-green-400'
                  }`}>{dosha.effect}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How To Read */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How To Read the Yoga/Dosha Report</h2>
        <ol className="space-y-4">
          {[
            { step: 1, title: 'Start with the summary stats', detail: 'The four headline numbers give you the ratio of positive yogas to uncancelled doshas at a glance. A net-positive ratio means the chart combination leans favourable.' },
            { step: 2, title: 'Read each yoga for qualitative uplift', detail: 'Yogas don\'t just offset doshas — they add positive qualities to the marriage. Kalatra Yoga shapes the nature of the spouse. Dharma-Karmadhipati shapes the shared life purpose.' },
            { step: 3, title: 'Check dosha status badges carefully', detail: 'The blue "Cancelled" badge means the dosha appears technically but is neutralised. The amber "Present" badge means it is real and requires attention or remedy.' },
            { step: 4, title: 'Follow remedy links for uncancelled doshas', detail: 'Any dosha marked "Present" links directly to the Remedies module where the corresponding Vedic remedy is listed. Address these before the wedding if possible.' },
          ].map(({ step, title, detail }) => (
            <li key={step} className="flex gap-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
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
      <section className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Check Your Yogas & Doshas</h2>
        <p className="text-white/85 mb-6 max-w-md mx-auto">
          Enter both birth charts for a full Yoga/Dosha analysis with classical cancellation rules and linked remedies for any active doshas.
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-white text-indigo-700 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
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
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
            >
              {f.title} →
            </Link>
          ))}
        </div>
      </section>

    </div>
  </div>
);

export default YogaDoshaPage;
