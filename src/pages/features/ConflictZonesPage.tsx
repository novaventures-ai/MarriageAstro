/**
 * Conflict Zones Feature Page
 * Explains the ConflictZoneWidget with live demo data.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Swords, Users, Coins, Brain, Zap, Shield } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import { ConflictZoneWidget } from '../../components/widgets/ConflictZoneWidget';
import { demoConflictZone, DEMO_NAME_A, DEMO_NAME_B } from '../../lib/featureDemoData';
import type { CompatibilityReport } from '../../types';

// ── Minimal demo report object ────────────────────────────────────────────────
// The widget only reads report.conflictZone and report.chartA/B.name.
const demoReport = {
  conflictZone: demoConflictZone,
  chartA: { name: DEMO_NAME_A, gender: 'female' },
  chartB: { name: DEMO_NAME_B, gender: 'male' },
} as unknown as CompatibilityReport;

export const ConflictZonesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <SEOHead
        title="Conflict Zone Prediction — Where Every Couple Will Fight | Astro Marriage"
        description="Astro Marriage identifies specific friction areas across People (in-laws), Things (money), Ideology (values), and Behavior (lifestyle) — with each conflict attributed to the partner who drives it."
        path="/features/conflict-zones"
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/features"
            className="inline-flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:underline text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> All Features
          </Link>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 transition-colors"
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
          <span className="text-gray-800 dark:text-gray-200">Conflict Zones</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-500 to-orange-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Swords className="w-4 h-4" /> Conflict Zone Prediction
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            Know Where You'll Fight Before You Fight
          </h1>
          <p className="text-lg text-rose-100 max-w-2xl mx-auto mb-8">
            Every couple has predictable friction zones wired into their charts. Knowing yours transforms conflict from a crisis into a calendar item you can prepare for.
          </p>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 bg-white text-rose-700 font-semibold px-8 py-3 rounded-xl hover:bg-rose-50 transition-colors"
          >
            Map Our Conflict Zones <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">

        {/* What Is It */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            What Are Conflict Zones?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            The Conflict Zone module categorises every potential friction area in a relationship into four universal buckets: <strong>People</strong> (in-laws, social circles, family dynamics), <strong>Things</strong> (money, assets, spending habits), <strong>Ideology</strong> (values, beliefs, life goals), and <strong>Behavior</strong> (communication styles, temperament, daily habits). These categories map directly to the astrological houses that govern each domain — the 4th house for family, the 2nd and 8th for wealth, the 9th for philosophy, and the 3rd and 6th for behavior and communication.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Critically, each conflict trigger carries a <strong>source attribution</strong> — whether the friction originates from Partner A's chart, Partner B's chart, or is mutual. This moves the analysis beyond "this couple will fight about money" to "Partner B's Jupiter-Rahu in the 2nd house creates expansive spending patterns that will clash with Partner A's security-first Venus in Taurus." Awareness, not prediction of doom, is the goal. No couple is conflict-free; the question is whether you're aware of the terrain.
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
                icon: Users,
                color: 'rose',
                title: 'Conflict sourced to the right partner',
                desc: "Each trigger shows who drives it — Partner A's chart, Partner B's chart, or both. This prevents the destructive 'you always start it' dynamic. When both partners can see a conflict attributed to their own planetary pattern, accountability becomes possible.",
              },
              {
                icon: Shield,
                color: 'orange',
                title: 'Intensity levels guide prioritisation',
                desc: 'High-intensity triggers (red) require active pre-emptive discussion and possibly structured agreements. Medium triggers (amber) are manageable with awareness. Low triggers (blue) are background noise that rarely escalates unless other pressures are active.',
              },
              {
                icon: Brain,
                color: 'rose',
                title: 'The technical basis is visible',
                desc: "Every trigger lists its astrological source — a specific planetary aspect, house placement, or sign opposition. This makes it falsifiable: you can disagree with an interpretation by pointing to the astrology, rather than feeling judged by a black-box personality test.",
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

        {/* The 4 Categories */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            The Four Conflict Categories
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: Users,
                color: 'indigo',
                label: 'People & Family',
                house: '4th house, Moon, Saturn',
                desc: 'In-law expectations, parental attachment, social obligation conflicts. Saturn or Rahu in the 4th from both charts in opposing modes creates the classic "your mother vs our life" scenario.',
              },
              {
                icon: Coins,
                color: 'emerald',
                label: 'Things & Finance',
                house: '2nd & 8th house, Venus, Jupiter',
                desc: 'Spending vs saving philosophies, shared asset management, financial risk tolerance. Venus in earth signs (Taurus, Virgo, Capricorn) and Jupiter-Rahu combinations are the most common sources.',
              },
              {
                icon: Brain,
                color: 'purple',
                label: 'Ideology & Values',
                house: '9th house, Jupiter, Sun',
                desc: 'Religious practice gaps, political divergence, long-term vision mismatches, child-rearing philosophy. The Pisces-Virgo axis and Sun-Jupiter hard aspects are common indicators.',
              },
              {
                icon: Zap,
                color: 'rose',
                label: 'Behavior & Habits',
                house: '3rd & 6th house, Mercury, Mars',
                desc: 'Communication style clashes, emotional processing speed gaps, daily routine friction. Mercury sign polarity (Pisces vs Gemini, for example) is a particularly reliable predictor of this category.',
              },
            ].map(({ icon: Icon, color, label, house, desc }) => (
              <div
                key={label}
                className={`p-5 rounded-xl border border-${color}-100 dark:border-${color}-900/30 bg-${color}-50/50 dark:bg-${color}-900/10`}
              >
                <div className={`inline-flex items-center gap-2 p-2.5 rounded-lg bg-${color}-100 dark:bg-${color}-900/40 mb-3`}>
                  <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">{label}</h3>
                <p className={`text-[11px] font-bold uppercase tracking-widest text-${color}-500 mb-2`}>{house}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Live Demo */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400 px-3">
              Live Demo — {DEMO_NAME_A} & {DEMO_NAME_B}
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
            Sample output for Ananya (Pune, 1997) and Vikram (Mumbai, 1995). Interactive controls are disabled in preview mode.
          </p>
          <div className="pointer-events-none select-none rounded-2xl overflow-hidden ring-2 ring-rose-200 dark:ring-rose-900/40 shadow-xl">
            <ConflictZoneWidget report={demoReport} />
          </div>
        </section>

        {/* How To Read It */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            How To Read the Conflict Zone Widget
          </h2>
          <ol className="space-y-5">
            {[
              {
                n: 1,
                title: 'Check the Overall Severity Banner',
                desc: 'The top banner shows the combined conflict severity (High / Medium / Low) and the awareness note from the analysis. Low severity means most triggers are manageable; High severity warrants proactive couples dialogue.',
              },
              {
                n: 2,
                title: 'Use the Partner Toggle',
                desc: "Switch between Partner A, Both, and Partner B views. In 'Both' mode you see all triggers. In individual mode, you see only the triggers sourced from that partner's chart plus mutual triggers — useful for personal reflection without pointing fingers.",
              },
              {
                n: 3,
                title: 'Scan the Four Category Cards',
                desc: 'Each category card shows the number of triggers found. A card showing 0 triggers is a strength area. Cards with 2+ High-intensity triggers deserve the most attention.',
              },
              {
                n: 4,
                title: 'Read Each Trigger Card',
                desc: 'Each trigger has a title, an intensity badge (High/Medium/Low), a source badge (Partner A / Partner B / Mutual), a plain-language description of the conflict scenario, and a technical basis showing the specific planetary/house combination responsible.',
              },
              {
                n: 5,
                title: 'Interpret Source Attribution',
                desc: "When a trigger is attributed to Partner A, it means Partner A's chart creates this dynamic — not that Partner A is to blame. The chart describes tendencies, not choices. Use it to open a conversation: 'My chart says I have a tendency toward X. Let's agree on how to handle it.'",
              },
            ].map(({ n, title, desc }) => (
              <li key={n} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-bold flex items-center justify-center text-sm">
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
          <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl p-8 text-white text-center shadow-xl shadow-rose-500/20">
            <Swords className="w-10 h-10 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-2">Map Your Relationship's Fault Lines</h3>
            <p className="text-rose-100 mb-6 max-w-md mx-auto">
              Enter both birth details and get a complete Conflict Zone analysis — all four categories, source attribution, and intensity levels — instantly.
            </p>
            <Link
              to="/calculator"
              className="inline-flex items-center gap-2 bg-white text-rose-700 font-semibold px-8 py-3 rounded-xl hover:bg-rose-50 transition-colors"
            >
              Run Our Analysis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Related Features */}
        <section>
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Related Features</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Psychological Profile', to: '/features/psychological-profile' },
              { label: 'Deep Synastry', to: '/features/synastry' },
              { label: 'Divorce Risk Radar', to: '/features/divorce-risk' },
              { label: 'All Features', to: '/features' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
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

export default ConflictZonesPage;
