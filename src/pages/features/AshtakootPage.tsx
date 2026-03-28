import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { AshtakootWidget } from '../../components/widgets/AshtakootWidget';
import { demoAshtakoot, DEMO_NAME_A, DEMO_NAME_B } from '../../lib/featureDemoData';

export const AshtakootPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SEOHead
      title="Ashtakoot Milan Explained — How the 36-Point System Works | Astro Marriage"
      description="Understand every Koota in the 36-point Ashtakoot Milan system. Interactive demo showing how Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi are scored."
      path="/features/ashtakoot-milan"
    />

    {/* Breadcrumb */}
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Home</Link>
      <span>/</span>
      <Link to="/features" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Features</Link>
      <span>/</span>
      <span className="text-gray-700 dark:text-gray-200">Ashtakoot Milan</span>
    </div>

    {/* Hero */}
    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Compatibility Scoring
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Ashtakoot Milan — The 36-Point System
        </h1>
        <p className="text-xl text-white/90 max-w-2xl">
          The classical North Indian compatibility framework scoring 8 dimensions of partnership — from spiritual alignment to physical chemistry — each with its own weight and dosha checks.
        </p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      {/* What Is It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Is Ashtakoot Milan?</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Ashtakoot Milan ("eight-group compatibility") is the primary Vedic matchmaking system used across North India. It evaluates the Moon Nakshatra (birth star) of each partner across 8 categories — called Kootas — that together describe compatibility at spiritual, temperamental, physical, mental, and karmic levels. Each Koota carries a maximum point value, and the combined ceiling is 36 points. The 8 Kootas are: Varna (1 pt, spiritual development), Vashya (2 pts, mutual attraction), Tara (3 pts, birth star harmony), Yoni (4 pts, physical-sexual compatibility), Graha Maitri (5 pts, mental friendship), Gana (6 pts, temperament match), Bhakoot (7 pts, emotional-financial flow), and Nadi (8 pts, health and progeny).
          </p>
          <p>
            Beyond summing points, Astro Marriage checks for the three critical doshas — Nadi Dosha, Bhakoot Dosha, and Gana Dosha — that can override an otherwise good total score, and then verifies whether traditional cancellation conditions apply. A score of 18 is the classical minimum for marriage to be considered; 24 and above is good; 30 and above is excellent. Many traditional matchmakers reject matches below 18 even without any dosha, while Astro Marriage also surfaces the dosha status explicitly so users understand the full picture.
          </p>
        </div>
      </section>

      {/* The 8 Kootas quick-reference */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">The 8 Kootas at a Glance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Varna', pts: 1, focus: 'Spiritual development & ego alignment' },
            { name: 'Vashya', pts: 2, focus: 'Mutual attraction and natural influence' },
            { name: 'Tara', pts: 3, focus: 'Birth-star harmony and fortune' },
            { name: 'Yoni', pts: 4, focus: 'Physical & sexual compatibility (14 animal archetypes)' },
            { name: 'Graha Maitri', pts: 5, focus: 'Planetary friendship — mental and emotional bonding' },
            { name: 'Gana', pts: 6, focus: 'Temperament: Deva, Manushya, or Rakshasa' },
            { name: 'Bhakoot', pts: 7, focus: 'Rashi-to-rashi emotional flow and prosperity' },
            { name: 'Nadi', pts: 8, focus: 'Ayurvedic constitution — health and progeny compatibility' },
          ].map(({ name, pts, focus }) => (
            <div
              key={name}
              className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs">
                {pts}pt{pts > 1 ? 's' : ''}
              </span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{name}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{focus}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why It Matters */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why It Matters</h2>
        <ul className="space-y-4">
          {[
            {
              heading: 'Score thresholds are meaningful, not arbitrary',
              body: 'Classical texts prescribe 18 as the floor, 24 as acceptable, and 30 as excellent — thresholds Astro Marriage enforces and displays alongside the raw score so you know exactly where you stand.',
            },
            {
              heading: 'Doshas can override a high total score',
              body: 'Nadi Dosha and Bhakoot Dosha at full-deficit (both score 0) are considered serious enough to block a match even at 28/36. Astro Marriage detects all three doshas and checks classical cancellation conditions automatically.',
            },
            {
              heading: 'The highest-weight Kootas (Nadi & Bhakoot) matter most',
              body: 'Nadi and Bhakoot together represent 15 of 36 points — nearly half the total. A couple scoring 0 on either should pay close attention to those specific indicators rather than being reassured by a decent aggregate.',
            },
          ].map(({ heading, body }) => (
            <li key={heading} className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="mt-1 flex-shrink-0 w-3 h-3 rounded-full bg-amber-500" />
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
          <span className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200 dark:border-amber-700">
            <span>📊</span> Live Demo — Sample Data
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Ananya Sharma &amp; Vikram Deshmukh — fictional demo couple scoring 29/36.
        </p>
        <div className="pointer-events-none select-none overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <AshtakootWidget
            ashtakoot={demoAshtakoot}
            viewMode="detailed"
            nameA={DEMO_NAME_A}
            nameB={DEMO_NAME_B}
          />
        </div>
      </section>

      {/* How To Read It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How To Read the Ashtakoot Widget</h2>
        <ol className="space-y-4">
          {[
            {
              step: 1,
              title: 'Start with the total score',
              detail: 'The headline shows X/36. Anything below 18 is a compatibility concern by classical standards; 24+ is recommended; 30+ is considered highly auspicious.',
            },
            {
              step: 2,
              title: 'Look for red 0-score Kootas',
              detail: 'Any Koota showing 0 points should be investigated. A 0 in Nadi or Bhakoot triggers a dosha — scroll to the Dosha section to see whether a cancellation condition applies.',
            },
            {
              step: 3,
              title: 'Pay special attention to Nadi and Bhakoot',
              detail: 'These two highest-weight Kootas (8+7 pts) carry the most classical significance for long-term health, progeny, and emotional harmony. Even a partial score here should be read carefully.',
            },
            {
              step: 4,
              title: 'Check dosha cancellations',
              detail: 'Astro Marriage shows whether any detected dosha is cancelled by classical exceptions (e.g., same Nakshatra, different Nadi Pada). A cancelled dosha is not cause for concern.',
            },
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
      <section className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Check Your Ashtakoot Score</h2>
        <p className="text-white/85 mb-6 max-w-md mx-auto">
          Enter both birth details and get your full 36-point breakdown with dosha analysis and Nakshatra compatibility commentary — free.
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-white text-amber-600 font-bold px-8 py-3 rounded-xl hover:bg-amber-50 transition-colors shadow-lg"
        >
          Calculate Now
        </Link>
      </section>

    </div>
  </div>
);

export default AshtakootPage;
