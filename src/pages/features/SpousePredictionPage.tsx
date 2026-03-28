/**
 * Spouse Prediction Feature Page
 * Explains the SpousePredictionWidget with live demo data.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Users, Heart, Compass, Briefcase, MapPin, CheckCircle2 } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import { SpousePredictionWidget } from '../../components/widgets/SpousePredictionWidget';
import { demoSpousePrediction, DEMO_NAME_A } from '../../lib/featureDemoData';

export const SpousePredictionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <SEOHead
        title="Spouse Prediction — Physical Traits, Personality & Meeting Circumstances | Astro Marriage"
        description="Vedic astrology predicts your spouse's appearance, personality, profession, and how you'll meet — using 7th house, Darakaraka (Jaimini), and Upapada Lagna."
        path="/features/spouse-prediction"
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/features"
            className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:underline text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> All Features
          </Link>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors"
          >
            Try Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:underline">Home</Link>
          {' > '}
          <Link to="/features" className="hover:underline">Features</Link>
          {' > '}
          <span className="text-gray-800 dark:text-gray-200">Spouse Prediction</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Users className="w-4 h-4" /> Spouse Prediction
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            Who Will You Marry?
          </h1>
          <p className="text-lg text-pink-100 max-w-2xl mx-auto mb-8">
            Vedic astrology describes your future spouse's appearance, personality, profession, and even where and how you'll meet — centuries before modern dating apps existed.
          </p>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 bg-white text-pink-700 font-semibold px-8 py-3 rounded-xl hover:bg-pink-50 transition-colors"
          >
            See My Spouse Prediction <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">

        {/* What Is It */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            What Is Spouse Prediction?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            In Vedic astrology, the <strong>7th house</strong> is the primary mirror of marriage. Its ruling sign and any planets positioned within it reveal your spouse's nature, physical appearance, and general personality. The <strong>7th lord's placement</strong> — which house and sign it occupies — adds a second layer of nuance, describing the circumstances under which marriage manifests and how the spouse will relate to you day-to-day.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Beyond the 7th house, Jaimini astrology introduces two powerful tools: the <strong>Darakaraka</strong> (the planet with the lowest degree in your chart) acts as the soul-significator of your spouse, revealing their core nature at a karmic level. The <strong>Upapada Lagna</strong> (derived from the 12th house) shows the quality and stability of the marital bond itself. The <strong>Navamsa (D9) 7th house</strong> then completes the picture, revealing how the marriage will evolve over time and what deeper qualities the spouse carries.
          </p>
        </section>

        {/* Why It Matters */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Why It Matters
          </h2>
          <div className="space-y-4">
            {[
              {
                icon: Heart,
                color: 'pink',
                title: 'Multi-layered personality portrait',
                desc: 'The 7th house lord gives the surface personality (how they act in relationships), the Darakaraka reveals the soul-level spouse archetype, and the Navamsa 7th unlocks the deeper, post-marriage character. Together they form a 360° view.',
              },
              {
                icon: MapPin,
                color: 'rose',
                title: 'Direction, medium & circumstances of meeting',
                desc: 'KP astrology and classical rules allow prediction of the compass direction from which the spouse will arrive, whether the meeting occurs through work, education, family, or digital channels, and the general atmosphere of the first encounter.',
              },
              {
                icon: Briefcase,
                color: 'pink',
                title: 'Profession and material life',
                desc: "Mercury ruling the 7th suggests analytical or communication-based careers. Jupiter adds advisory, teaching, or spiritual roles. Saturn indicates government, engineering, or disciplined fields. These overlapping signatures narrow down the spouse's professional world.",
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div
                key={title}
                className={`flex gap-4 p-5 rounded-xl border bg-${color}-50 dark:bg-${color}-900/10 border-${color}-100 dark:border-${color}-900/30`}
              >
                <div className={`flex-shrink-0 p-2.5 rounded-lg bg-${color}-100 dark:bg-${color}-900/40`}>
                  <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Demo */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400 px-3">
              Live Demo — {DEMO_NAME_A}'s Prediction
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
            Sample output for a female chart born March 15, 1997, Pune. Interactive controls are disabled in preview mode.
          </p>
          <div className="pointer-events-none select-none rounded-2xl overflow-hidden ring-2 ring-pink-200 dark:ring-pink-900/40 shadow-xl">
            <SpousePredictionWidget
              prediction={demoSpousePrediction}
              gender="female"
              userName={DEMO_NAME_A}
            />
          </div>
        </section>

        {/* How To Read It */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            How To Read the Spouse Prediction Widget
          </h2>
          <ol className="space-y-5">
            {[
              {
                n: 1,
                title: '7th House Panel',
                desc: 'The sign on the 7th house cusp and planets within it form the spouse\'s first impression — look here for appearance (height, build, complexion) and the dominant personality trait cluster.',
              },
              {
                n: 2,
                title: 'Darakaraka Panel',
                desc: 'Find your Darakaraka planet (lowest degree in D1). Its natural significations — Venus for beauty and art, Jupiter for wisdom and piety, Saturn for seriousness and age — overlay your spouse\'s soul character.',
              },
              {
                n: 3,
                title: 'Navamsa 7th House',
                desc: 'This section reveals the deeper, evolving qualities of your spouse that surface after marriage begins. A Sagittarius Navamsa 7th, for example, indicates a philosophically expansive, growth-oriented partner.',
              },
              {
                n: 4,
                title: 'Upapada Lagna (Stability)',
                desc: 'The Upapada sign and any planets conjunct it tell you about marriage stability and the material conditions of the union. Venus here implies comfort and beauty; Saturn here implies delayed but durable bonding.',
              },
              {
                n: 5,
                title: 'Meeting Prediction',
                desc: 'Scroll to the Meeting section to read the compass direction, distance level (same city / different state / foreign), primary meeting medium (professional, educational, social, digital), and the overall marriage type (love / arranged / mixed).',
              },
              {
                n: 6,
                title: 'Profession & Physique',
                desc: 'Use the Profession tab for career-related indications and the Physique tab for granular physical description derived from the planetary and sign combinations.',
              },
            ].map(({ n, title, desc }) => (
              <li key={n} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 font-bold flex items-center justify-center text-sm">
                  {n}
                </div>
                <div className="pt-0.5">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">{title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section>
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white text-center shadow-xl shadow-pink-500/20">
            <Compass className="w-10 h-10 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-2">Discover Your Spouse's Signature</h3>
            <p className="text-pink-100 mb-6 max-w-md mx-auto">
              Enter your birth details and get a full Spouse Prediction report in seconds — free, private, no sign-up required.
            </p>
            <Link
              to="/calculator"
              className="inline-flex items-center gap-2 bg-white text-pink-700 font-semibold px-8 py-3 rounded-xl hover:bg-pink-50 transition-colors"
            >
              Run My Analysis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Related Features */}
        <section>
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Related Features</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Marriage Timing', to: '/features/marriage-timing' },
              { label: 'Psychological Profile', to: '/features/psychological-profile' },
              { label: 'Deep Synastry', to: '/features/synastry' },
              { label: 'All Features', to: '/features' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-sm font-medium hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
              >
                {label} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default SpousePredictionPage;
