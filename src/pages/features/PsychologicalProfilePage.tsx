/**
 * Psychological Profile Feature Page
 * Explains the PsychologicalProfileWidget with live demo data.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Brain, Heart, Eye, Shield, RefreshCw } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import { PsychologicalProfileWidget } from '../../components/widgets/PsychologicalProfileWidget';
import { demoPsychProfileA, DEMO_NAME_A } from '../../lib/featureDemoData';
import type { CompatibilityReport } from '../../types';

// ── Minimal demo report object ────────────────────────────────────────────────
// The widget only reads report.psychologicalProfileA/B and report.chartA/B.name.
// All other fields are typed but not accessed during rendering for this feature.
const demoReport = {
  psychologicalProfileA: demoPsychProfileA,
  chartA: { name: DEMO_NAME_A, gender: 'female' },
  chartB: { name: 'Partner', gender: 'male' },
} as unknown as CompatibilityReport;

export const PsychologicalProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <SEOHead
        title="Psychological Profile — Attachment Style, Love Language & Core Fears | Astro Marriage"
        description="Astro Marriage maps your attachment style, love language, core fears, defense mechanisms, and relationship patterns from your Vedic birth chart — bridging ancient wisdom and modern psychology."
        path="/features/psychological-profile"
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/features"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> All Features
          </Link>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
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
          <span className="text-gray-800 dark:text-gray-200">Psychological Profile</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Brain className="w-4 h-4" /> Psychological Profile
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            Your Mind, Mapped by the Stars
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-8">
            Vedic astrology encodes attachment patterns, love languages, and core fears long before modern psychology named them. This module bridges both worlds into one actionable profile.
          </p>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            See My Psychological Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">

        {/* What Is It */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            What Is the Psychological Profile?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Every planet in your Vedic birth chart governs a distinct layer of your inner world. The <strong>Moon sign and 4th house</strong> encode your earliest emotional imprinting — the template for how safe relationships feel. In modern attachment theory, this maps precisely to whether you form secure, anxious, avoidant, or fearful-avoidant bonds. The Psychological Profile widget runs this translation automatically, labelling your attachment type and tracing it back to the specific lunar and house placements that drive it.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            The profile goes five layers deep: <strong>Venus</strong> (what you call love — words, touch, time, acts, or gifts), <strong>Rahu</strong> (the obsessive hunger that becomes your primary fear), <strong>Ketu</strong> (the defense mechanism built from past-life mastery that now creates emotional blind spots), and the <strong>5th house</strong> (relationship patterns that repeat across partners). Alongside each diagnosis, the widget shows the specific planetary positions that produced it, making the analysis verifiable rather than generic.
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
                color: 'indigo',
                title: 'Know your love language before you argue about it',
                desc: 'Venus in Taurus speaks Acts of Service; Venus in Gemini speaks Words of Affirmation. If your partner scores high on Physical Touch but you speak Quality Time, you can both adjust consciously rather than feeling perpetually misunderstood.',
              },
              {
                icon: Eye,
                color: 'violet',
                title: 'Name your fears to defuse them',
                desc: "Rahu in the 7th amplifies fear of abandonment — the exact fear that triggers jealous surveillance or pre-emptive emotional withdrawal. Seeing it named in a chart gives it a form you can work with. Fears you can name, you can interrupt.",
              },
              {
                icon: RefreshCw,
                color: 'indigo',
                title: 'Break patterns instead of repeating them',
                desc: 'Ketu in the 5th creates a karmic pull toward emotionally unavailable partners because Ketu brings detachment to romance. Once this is identified as a chart signature, not just "bad luck", the pattern becomes a conscious choice rather than fate.',
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
              Live Demo — {DEMO_NAME_A}'s Profile
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
            Sample output for a female chart born March 15, 1997, Pune. Interactive controls are disabled in preview mode.
          </p>
          <div className="pointer-events-none select-none rounded-2xl overflow-hidden ring-2 ring-indigo-200 dark:ring-indigo-900/40 shadow-xl">
            <PsychologicalProfileWidget report={demoReport} />
          </div>
        </section>

        {/* How To Read It */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            How To Read the Psychological Profile Widget
          </h2>
          <ol className="space-y-5">
            {[
              {
                n: 1,
                title: 'Toggle between Partner A, Both, and Partner B',
                desc: "The segmented toggle at the top lets you focus on one person's profile or compare both side-by-side. The 'Both' view adds a Couple Dynamic Insights banner that auto-calculates attachment compatibility and love-language match.",
              },
              {
                n: 2,
                title: 'Attachment Style',
                desc: "Expand this accordion first. The coloured badge (green = secure, amber = anxious, blue = avoidant, red = fearful) is the most actionable single piece of data in the widget. Trace it to the Moon Sign and 4th House analysis below it.",
              },
              {
                n: 3,
                title: 'Love Language',
                desc: "Shows Primary and Secondary love languages sourced from Venus's sign and house. A mis-match between two partners here is one of the most common causes of the 'I work so hard for this relationship and they don't appreciate it' feeling.",
              },
              {
                n: 4,
                title: 'Core Fears (Rahu)',
                desc: "Rahu's house and sign placement reveal the obsessive desire that, when threatened, turns into the primary relationship fear. Read both the 'Primary Fear' box and the 'How It Manifests' box together — one names the fear, the other shows the behavior.",
              },
              {
                n: 5,
                title: 'Defense Mechanisms (Ketu)',
                desc: "Ketu in a relationship house creates automatic withdrawal or detachment patterns. The 'Impact on Relationships' field describes the downstream effect this mechanism has on your partner.",
              },
              {
                n: 6,
                title: 'Repeating Patterns & How to Break Them',
                desc: "The 5th house and Venus cycles section ends with a 'How To Break It' prescription — a concrete, actionable suggestion derived from the planetary combination, not generic advice.",
              },
            ].map(({ n, title, desc }) => (
              <li key={n} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-sm">
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
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white text-center shadow-xl shadow-indigo-500/20">
            <Brain className="w-10 h-10 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-2">Understand Your Psychological Blueprint</h3>
            <p className="text-indigo-100 mb-6 max-w-md mx-auto">
              Enter your birth details to receive a complete Psychological Profile — attachment style, love language, fears, and patterns — in seconds.
            </p>
            <Link
              to="/calculator"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
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
              { label: 'Spouse Prediction', to: '/features/spouse-prediction' },
              { label: 'Conflict Zones', to: '/features/conflict-zones' },
              { label: 'Deep Synastry', to: '/features/synastry' },
              { label: 'All Features', to: '/features' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
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

export default PsychologicalProfilePage;
