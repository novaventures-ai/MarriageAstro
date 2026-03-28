import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { TimingWidget } from '../../components/widgets/TimingWidget';
import { demoTiming } from '../../lib/featureDemoData';

export const MarriageTimingPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SEOHead
      title="Marriage Timing Prediction — 5-Method Vedic Analysis Explained | Astro Marriage"
      description="How Astro Marriage predicts marriage timing using 5 convergent Vedic methods: Vimshottari Dasha, Jupiter-Saturn transits, KP 2-7-11 rule, Jaimini Chara Dasha, and Navamsa confirmation."
      path="/features/marriage-timing"
    />

    {/* Breadcrumb */}
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Home</Link>
      <span>/</span>
      <Link to="/features" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Features</Link>
      <span>/</span>
      <span className="text-gray-700 dark:text-gray-200">Marriage Timing</span>
    </div>

    {/* Hero */}
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Predictive Timing
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Marriage Timing Prediction
        </h1>
        <p className="text-xl text-white/90 max-w-2xl">
          Five independent Vedic timing methods cross-validated against each other — convergence between methods raises the confidence score, giving you a probability-weighted marriage window.
        </p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      {/* What Is It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Is Marriage Timing Analysis?</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Marriage timing analysis identifies the specific year — and ideally the season — when planetary conditions most strongly favour a marriage event. A single method can suggest a window, but Vedic astrology's predictive accuracy multiplies when several independent systems point to the same period simultaneously. Astro Marriage runs five parallel analyses and computes a composite confidence percentage for each candidate window: the more methods that agree, the higher the confidence shown on screen.
          </p>
          <p>
            The five methods are: (1) Vimshottari Dasha — the dominant 120-year Mahadasha/Antardasha system based on Moon Nakshatra; (2) Jupiter and Saturn transits — Jupiter crossing the 1st, 7th, or 11th from natal Moon is classically the strongest external marriage trigger; (3) KP 2-7-11 Cuspal Sub-Lord rule — marriage is promised and activated when significators of houses 2, 7, and 11 operate simultaneously in both Dasha and transit; (4) Jaimini Chara Dasha — sign-based periods focused on the Darakaraka and Upapada Lagna; and (5) Navamsa (D9) confirmation — whether the current Dasha lord is strong in the D9 chart. Each method is run separately per partner, then the partner timelines are overlapped to find joint windows.
          </p>
        </div>
      </section>

      {/* 5 Methods */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">The 5 Methods Explained</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              num: '01',
              title: 'Vimshottari Dasha',
              body: 'The 120-year planetary period system keyed to birth Nakshatra. Marriage typically fires during the Dasha of the 7th lord, Venus, or a planet posited in the 7th house.',
            },
            {
              num: '02',
              title: 'Jupiter & Saturn Transits',
              body: 'Jupiter transiting the 7th house from natal Moon is the single strongest marriage transit. Saturn\'s aspect to the 7th can delay or solidify — the direction matters.',
            },
            {
              num: '03',
              title: 'KP 2-7-11 Rule',
              body: 'Krishnamurti Paddhati requires significators of houses 2 (family), 7 (spouse), and 11 (fulfilment) to be simultaneously active in Dasha, Bhukti, and transit for marriage to occur.',
            },
            {
              num: '04',
              title: 'Jaimini Chara Dasha',
              body: 'Sign-based periods highlight years when the Darakaraka sign or Upapada Lagna sign is active — both are primary marriage indicators in the Jaimini system.',
            },
            {
              num: '05',
              title: 'Navamsa D9 Confirmation',
              body: 'The D9 divisional chart governs the quality and timing of marriage. If the current Dasha lord is well-placed in D9, the period is doubly activated for marriage events.',
            },
          ].map(({ num, title, body }) => (
            <div key={num} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="text-3xl font-black text-purple-200 dark:text-purple-900 leading-none block mb-2">{num}</span>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{body}</p>
            </div>
          ))}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-5 flex items-center">
            <p className="text-purple-800 dark:text-purple-200 text-sm font-medium">
              The confidence percentage shown on each favorable period reflects how many of the 5 methods agree on that window — 90%+ means 4-5 methods converge.
            </p>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why It Matters</h2>
        <ul className="space-y-4">
          {[
            {
              heading: 'Convergence creates confidence',
              body: 'A window supported by all five methods — Dasha, transit, KP, Chara Dasha, and Navamsa — is far more reliable than any single method alone. Astro Marriage quantifies that convergence rather than hiding it.',
            },
            {
              heading: 'Both partners must have active windows simultaneously',
              body: 'Even a strong Dasha for Partner A is not sufficient if Partner B is in a period of delays. The widget overlaps both timelines and highlights joint favorable windows explicitly.',
            },
            {
              heading: 'Vulnerable periods are shown too',
              body: 'Years when marriage is unlikely or when external pressure will be high are flagged as Vulnerable Periods — critical information for planning and for setting realistic expectations.',
            },
          ].map(({ heading, body }) => (
            <li key={heading} className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="mt-1 flex-shrink-0 w-3 h-3 rounded-full bg-purple-500" />
              <div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{heading}: </span>
                <span className="text-gray-700 dark:text-gray-300">{body}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Live Demo */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Live Demo</h2>
          <span className="inline-flex items-center gap-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-semibold px-3 py-1 rounded-full border border-purple-200 dark:border-purple-700">
            <span>📊</span> Live Demo — Sample Data
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Ananya Sharma &amp; Vikram Deshmukh — fictional demo couple with a prime window in 2026-2027.
        </p>
        <div className="pointer-events-none select-none overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <TimingWidget timing={demoTiming} />
        </div>
      </section>

      {/* How To Read It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How To Read the Timing Widget</h2>
        <ol className="space-y-4">
          {[
            {
              step: 1,
              title: 'Check Favorable Periods with confidence %',
              detail: 'Each favorable window shows a start date, end date, description, and a confidence percentage. Prioritise windows above 80% confidence — these have the highest method convergence.',
            },
            {
              step: 2,
              title: 'Read partner-specific Dasha analysis',
              detail: 'The widget shows each partner\'s current Mahadasha-Antardasha and its favourability. Both partners should ideally be in positive-rated Dashas for the period to be truly auspicious.',
            },
            {
              step: 3,
              title: 'Note the transit overlaps',
              detail: 'Transit notes at the bottom highlight key Jupiter and Saturn movements that amplify or dampen the Dasha findings. A Jupiter transit over the 7th house is the single most reliable external trigger.',
            },
            {
              step: 4,
              title: 'Watch for Vulnerable Periods',
              detail: 'Red-flagged vulnerable periods are years to avoid for marriage initiation. They may indicate Sade Sati, Rahu/Ketu transit pressure, or a Dasha of a highly malefic planet for marriage.',
            },
          ].map(({ step, title, detail }) => (
            <li key={step} className="flex gap-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-sm">
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
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Find Your Marriage Window</h2>
        <p className="text-white/85 mb-6 max-w-md mx-auto">
          Enter both birth details and get a personalised 5-method timing analysis with confidence percentages — free.
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-white text-purple-600 font-bold px-8 py-3 rounded-xl hover:bg-purple-50 transition-colors shadow-lg"
        >
          Calculate Now
        </Link>
      </section>

    </div>
  </div>
);

export default MarriageTimingPage;
