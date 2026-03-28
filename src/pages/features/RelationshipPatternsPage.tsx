import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';

const relatedFeatures = [
  { slug: 'psychological-profile', title: 'Psychological Profile' },
  { slug: 'mental-health', title: 'Mental Health Profile' },
  { slug: 'spouse-prediction', title: 'Spouse Prediction' },
];

const patterns = [
  {
    title: 'Attracting Emotionally Unavailable Partners',
    severity: 'Primary Pattern',
    source: 'Ketu in 5th House',
    sourcePlanets: ['Ketu', '5th House', 'Venus'],
    desc: 'Ketu in the 5th house indicates past-life romantic karma. The soul has experienced intense love that ended in loss or renunciation. In this life, there\'s an unconscious attraction to partners who mirror that dynamic — unavailable, distant, or unable to commit fully.',
    howToBreak: 'Choose consistency over intensity. When a new partner feels explosively magnetic but emotionally guarded, that\'s the pattern activating. Deliberately invest in partners who show up consistently, even if the initial spark feels less intense.',
    color: 'border-l-4 border-l-purple-400',
    badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200',
    icon: '💜',
  },
  {
    title: 'Cycle of Rescuer-Rescuee Dynamics',
    severity: 'Secondary Pattern',
    source: 'Moon–Neptune in 6th House (Western overlay)',
    sourcePlanets: ['Moon', '6th House', 'Jupiter'],
    desc: 'Strong Moon in the 6th house (service) with Jupiter aspecting it creates a caregiving orientation. Over time, this attracts partners who need "fixing" — creating a helper-helpee dynamic that eventually breeds resentment when the rescuer\'s own needs go unmet.',
    howToBreak: 'Choose a partner who doesn\'t need saving. Notice if you feel most needed early in the relationship — that feeling itself may be the pattern activating rather than love.',
    color: 'border-l-4 border-l-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200',
    icon: '💙',
  },
];

const karmaIndicators = [
  { label: 'Past-Life Relationship Karma', value: 'Present', icon: '♾️', note: 'Ketu in 5th with Venus in Scorpio — unresolved romantic soul contracts from previous incarnations.' },
  { label: 'Pre-Marital Relationship Count', value: '2–3 indicated', icon: '🌹', note: '5th house activity and Jupiter\'s 3rd-house aspect suggest 2–3 significant relationships before marriage.' },
  { label: 'Venus Cycle Pattern', value: 'Idealism → Disillusionment', icon: '💫', note: 'Venus in Scorpio opposite Rahu: initial intense idealization, followed by disappointment when reality sets in.' },
  { label: 'Pattern Break Potential', value: 'High (After Saturn Return)', icon: '🌟', note: 'Saturn transiting through the 7th house (age 28–30) creates a natural pattern-break window.' },
];

export const RelationshipPatternsPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SEOHead
      title="Relationship Patterns — Past Life Karma & Repeating Cycles | Astro Marriage"
      description="5th house Ketu reveals past-life romantic karma. Venus cycles show partner selection patterns. Rahu-Venus aspects attract unavailable partners. Learn your pattern — and how to break it."
      path="/features/relationship-patterns"
    />

    {/* Breadcrumb */}
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Home</Link>
      <span>/</span>
      <Link to="/features" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Features</Link>
      <span>/</span>
      <span className="text-gray-700 dark:text-gray-200">Relationship Patterns</span>
    </div>

    {/* Hero */}
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Karmic Patterns
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Relationship Patterns — Past Life Karma &amp; Repeating Cycles
        </h1>
        <p className="text-xl text-white/90 max-w-2xl">
          If you keep attracting the same type of partner, or relationships end in predictable ways — your birth chart holds the answer. This feature identifies the pattern AND shows how to break it.
        </p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      {/* What Is It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Are Relationship Patterns in Astrology?</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            The 5th house in Vedic astrology governs romance, pre-marital relationships, and creative self-expression. When Ketu (the south node of the Moon — representing past-life karma) is placed in the 5th house, it indicates that the soul carries unresolved romantic energy from previous incarnations. This often manifests as a pattern of intense connections that end prematurely, attraction to emotionally unavailable people, or a tendency to pull back from love at the moment of deepest connection — unconsciously recreating the past-life separation.
          </p>
          <p>
            Venus in Vedic astrology shows not just who we love, but how we love — our partner selection template. Venus conjunct or aspected by Rahu creates an attraction to unconventional, exciting, or unavailable partners; the thrill of the chase becomes more compelling than the security of commitment. Venus aspected by Saturn produces a more cautious love nature but can delay marriage significantly. This module reads the Venus placement, aspects, and 5th house indicators to identify the unconscious pattern at work — and, critically, it traces the pattern to its astrological root so that you understand why it repeats rather than simply being told it exists.
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
              heading: 'Awareness is the first step to change',
              body: 'Most people notice they keep choosing the same type of partner — but without understanding the astrological root, they can\'t see why the pattern persists. Naming the pattern (and its source) is the first step to interrupting it.',
            },
            {
              icon: '🗺️',
              heading: 'A path to break the cycle',
              body: 'Each identified pattern comes with a specific "how to break it" — not generic therapy advice, but tailored guidance based on the planetary source. Ketu in 5th requires a different strategy than Venus–Rahu.',
            },
            {
              icon: '⏰',
              heading: 'Timing windows for pattern breaks',
              body: 'Saturn transits through the natal Venus or 5th house are natural pattern-break windows. The module identifies upcoming transits that offer the best opportunity to consciously choose differently.',
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

      {/* Sample Output — Pattern Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sample Output</h2>
          <span className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700">
            📊 Ananya's Chart
          </span>
        </div>

        {/* Karma indicator row */}
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {karmaIndicators.map(k => (
            <div key={k.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">{k.icon}</span>
                <div>
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">{k.label}</div>
                  <div className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">{k.value}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{k.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pattern cards */}
        <div className="space-y-4">
          {patterns.map(pattern => (
            <div key={pattern.title} className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 ${pattern.color}`}>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{pattern.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-gray-900 dark:text-gray-100">{pattern.title}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${pattern.badge}`}>{pattern.severity}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Source:</span>
                    {pattern.sourcePlanets.map(p => (
                      <span key={p} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded">{p}</span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{pattern.desc}</p>

              <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-4">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">How To Break This Pattern</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{pattern.howToBreak}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How To Read */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How To Read the Relationship Patterns Report</h2>
        <ol className="space-y-4">
          {[
            { step: 1, title: 'Start with the karma indicators row', detail: 'These four indicators summarise your chart\'s relationship karma at a glance: past-life karma level, pre-marital relationship count, Venus cycle pattern, and pattern-break potential.' },
            { step: 2, title: 'Read the Primary Pattern first', detail: 'The primary pattern is the most energetically dominant cycle. It is sourced from the most significant planetary indicator in the chart — usually a Ketu, Rahu, or Venus aspect to the 5th or 7th house.' },
            { step: 3, title: 'Identify yourself in the description', detail: 'Each pattern description is intentionally concrete. If you recognise the described dynamic from your own relationship history, the pattern is active. If you don\'t recognise it, it may be a future tendency rather than a current one.' },
            { step: 4, title: 'Apply the "How to Break" guidance', detail: 'The breaking guidance is tied to the planetary source — not generic therapy. Apply it as a conscious relationship decision-filter, especially during Saturn transits through the 5th house or natal Venus.' },
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
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Discover Your Relationship Pattern</h2>
        <p className="text-white/85 mb-6 max-w-md mx-auto">
          Enter your birth details to see your full pattern analysis — including primary and secondary patterns, karma indicators, and pattern-break timing windows.
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
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

export default RelationshipPatternsPage;
