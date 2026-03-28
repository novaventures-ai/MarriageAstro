/**
 * Synastry Feature Page
 * Visual explanation page with static example cards.
 * The actual SynastryWidget requires complex full chart objects;
 * this page uses hand-crafted cards to illustrate the concept clearly.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, GitBranch, Star, Heart, Zap, AlertTriangle, Layers, ArrowLeftRight } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';

// ── Static synastry overlay examples ─────────────────────────────────────────
const overlayExamples = [
  {
    planet: 'Venus',
    partner: 'A',
    house: 7,
    nature: 'harmonious' as const,
    partnerLabel: 'Ananya',
    targetLabel: "Vikram's chart",
    headline: "Ananya's Venus lands in Vikram's 7th House",
    explanation: "This is one of the most potent synastry overlays for marriage. Ananya's Venus directly activates Vikram's house of partnership — she naturally embodies the qualities he seeks in a spouse. He experiences her as ideally suited for marriage, often from the very first meeting.",
    keywords: ['Attraction', 'Marriage indicator', 'Long-term pull'],
  },
  {
    planet: 'Mars',
    partner: 'B',
    house: 5,
    nature: 'harmonious' as const,
    partnerLabel: 'Vikram',
    targetLabel: "Ananya's chart",
    headline: "Vikram's Mars lands in Ananya's 5th House",
    explanation: "Mars in the 5th creates a playful, creatively electric, and physically magnetic dynamic. Vikram's assertive energy directly stimulates Ananya's house of romance and joy. This overlay is associated with strong physical attraction and a relationship that never loses its spark.",
    keywords: ['Physical chemistry', 'Romance', 'Creative activation'],
  },
  {
    planet: 'Saturn',
    partner: 'B',
    house: 1,
    nature: 'challenging' as const,
    partnerLabel: 'Vikram',
    targetLabel: "Ananya's chart",
    headline: "Vikram's Saturn lands in Ananya's 1st House",
    explanation: "Saturn in the 1st can feel like a steady, stabilising presence — or like a weight on self-expression. Vikram may unconsciously project Saturn's qualities (structure, criticism, seriousness) onto Ananya's sense of self. With awareness, this overlay builds discipline and longevity; without it, Ananya may feel subtly restricted.",
    keywords: ['Longevity', 'Karmic weight', 'Requires awareness'],
  },
  {
    planet: 'Jupiter',
    partner: 'A',
    house: 11,
    nature: 'harmonious' as const,
    partnerLabel: 'Ananya',
    targetLabel: "Vikram's chart",
    headline: "Ananya's Jupiter lands in Vikram's 11th House",
    explanation: "Jupiter in the 11th is a 'social expander' overlay. Ananya naturally helps Vikram grow his network, friendships, and achieve his long-term goals. This overlay correlates with Vikram's material gains and career expanding through or during the relationship.",
    keywords: ['Growth', 'Shared goals', 'Social expansion'],
  },
];

const natureConfig = {
  harmonious: {
    icon: Star,
    color: 'amber',
    label: 'Harmonious',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-700',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  challenging: {
    icon: AlertTriangle,
    color: 'rose',
    label: 'Challenging',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    border: 'border-rose-200 dark:border-rose-700',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  },
};

// ── How Cross-Chart Overlay Works (diagram) ───────────────────────────────────
const DiagramSection: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Chart A */}
      <div className="flex-1 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <span className="text-white font-black text-2xl">A</span>
        </div>
        <p className="mt-3 font-bold text-gray-800 dark:text-gray-200 text-sm">Chart A</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">9 planets</p>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {['Su','Mo','Ma','Me','Ju','Ve','Sa','Ra','Ke'].map(p => (
            <span key={p} className="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded text-[10px] font-bold">{p}</span>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex flex-col items-center gap-2">
        <ArrowLeftRight className="w-8 h-8 text-teal-500" />
        <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest text-center">Cross-chart<br/>overlay</span>
        <div className="text-[10px] text-gray-400 text-center max-w-[100px]">
          Each planet mapped into the other's 12 houses
        </div>
      </div>

      {/* Chart B */}
      <div className="flex-1 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mx-auto flex items-center justify-center shadow-lg shadow-purple-500/30">
          <span className="text-white font-black text-2xl">B</span>
        </div>
        <p className="mt-3 font-bold text-gray-800 dark:text-gray-200 text-sm">Chart B</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">9 planets</p>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {['Su','Mo','Ma','Me','Ju','Ve','Sa','Ra','Ke'].map(p => (
            <span key={p} className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded text-[10px] font-bold">{p}</span>
          ))}
        </div>
      </div>
    </div>

    {/* Stats row */}
    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-4 text-center">
      {[
        { value: '9 × 12', label: 'Overlays per direction' },
        { value: '× 2', label: 'Bi-directional (A→B + B→A)' },
        { value: '+ D9', label: 'Navamsa synastry overlays' },
      ].map(({ value, label }) => (
        <div key={label}>
          <p className="text-xl font-black text-teal-600 dark:text-teal-400">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">{label}</p>
        </div>
      ))}
    </div>
  </div>
);

export const SynastryPage: React.FC = () => {
  const [activeDir, setActiveDir] = useState<'A_in_B' | 'B_in_A'>('A_in_B');

  const filteredExamples = overlayExamples.filter(e =>
    activeDir === 'A_in_B' ? e.partner === 'A' : e.partner === 'B'
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <SEOHead
        title="Deep Synastry Analysis — Cross-Chart Vedic Compatibility Explained | Astro Marriage"
        description="Deep synastry in Vedic astrology maps every planet from both charts across each other's houses — revealing soul-level compatibility beyond Ashtakoot Milan."
        path="/features/synastry"
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/features"
            className="inline-flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:underline text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> All Features
          </Link>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
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
          <span className="text-gray-800 dark:text-gray-200">Deep Synastry</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <GitBranch className="w-4 h-4" /> Deep Synastry
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            Every Planet, Every House, Both Directions
          </h1>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto mb-8">
            Deep synastry goes far beyond the 36-point score — it maps how your planets activate each other's life areas, revealing the invisible architecture of attraction, friction, and growth.
          </p>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-8 py-3 rounded-xl hover:bg-teal-50 transition-colors"
          >
            Run Deep Synastry Analysis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">

        {/* What Is It */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            What Is Deep Synastry?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Synastry is the practice of overlaying one person's birth chart directly onto another's. Where traditional Vedic matching (Ashtakoot Milan) compares only the Moon's Nakshatra position on 8 dimensions, deep synastry places <strong>all 9 classical planets</strong> from Chart A into Chart B's 12 houses — and then reverses the process, placing Chart B's planets into Chart A's houses. This produces up to 216 unique planet-in-house interactions, each carrying a distinct meaning.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            The core insight of synastry is directional: when your Venus falls in your partner's 7th house, <em>you</em> are activating <em>their</em> marriage house — you feel like their ideal partner to them. When the reverse isn't true, you see an asymmetry in attachment depth. Astro Marriage also runs the <strong>D9 Navamsa synastry</strong>, which reveals the soul-contract layer that governs the long-term marriage dynamic beyond the initial attraction. <strong>KP compatibility</strong> (sub-lord analysis) and <strong>Jaimini compatibility</strong> (Darakaraka resonance) are additionally computed and displayed in the Advanced tab.
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
                color: 'teal',
                title: 'Soulmate connections have a specific signature',
                desc: "Venus-Mars mutual overlays in each other's 7th/8th houses, Sun-Moon conjunctions across charts, and Rahu activating the 7th house of another — these are the classic soulmate patterns. Synastry makes them visible and specific rather than a feeling you can't explain.",
              },
              {
                icon: Layers,
                color: 'cyan',
                title: "Karmic bonds show up as Saturn and Ketu overlays",
                desc: "When someone's Saturn lands on your natal Moon, you feel it as discipline, heaviness, or a sense of being 'taught' by the relationship. Ketu overlays on Venus create inexplicable familiarity — a sense you've known this person before. These are karmic bond signatures.",
              },
              {
                icon: Zap,
                color: 'teal',
                title: 'House overlays explain "why I act differently in this relationship"',
                desc: "If your partner's Rahu falls in your 3rd house, you'll talk more, risk more in communication, and feel intellectually restless around them specifically. If their Saturn falls in your 12th, you'll feel subtly drained or spiritually pressured. The house overlay explains the behavioural change.",
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

        {/* Diagram */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            How Cross-Chart Overlay Works
          </h2>
          <DiagramSection />
        </section>

        {/* Example Output */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400 px-3">
              Example Output — Ananya & Vikram
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Direction toggle */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 gap-0.5">
              {([
                { id: 'A_in_B' as const, label: "Ananya's planets → Vikram's houses" },
                { id: 'B_in_A' as const, label: "Vikram's planets → Ananya's houses" },
              ]).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setActiveDir(opt.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                    activeDir === opt.id
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredExamples.length > 0 ? filteredExamples.map((ex) => {
              const cfg = natureConfig[ex.nature];
              const Icon = cfg.icon;
              return (
                <div
                  key={ex.headline}
                  className={`rounded-xl border p-5 ${cfg.bg} ${cfg.border} transition-all`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 text-${cfg.color}-500`} />
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm leading-tight">
                        {ex.headline}
                      </h3>
                    </div>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    {ex.explanation}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {ex.keywords.map(kw => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 bg-white/70 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 text-[10px] font-bold rounded-full border border-gray-200 dark:border-gray-600 uppercase tracking-wider"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-10 text-gray-400 text-sm">
                Select a direction above to view example overlays.
              </div>
            )}
          </div>

          <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
            These are illustrative examples. Your actual report computes all 9 planets × 12 houses in both directions.
          </p>
        </section>

        {/* How To Read It */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            How To Read the Deep Synastry Widget
          </h2>
          <ol className="space-y-5">
            {[
              {
                n: 1,
                title: 'Start with the Vedic tab',
                desc: 'The default view shows House Overlays and Planetary Conjunctions. Use the direction toggle (A in B / B in A) to see both perspectives. The asymmetry between directions often reveals who is more pulled toward the other.',
              },
              {
                n: 2,
                title: 'Identify the high-impact overlays',
                desc: "Planets landing in the 1st, 5th, 7th, 8th, and 12th houses of a partner carry the most romantic and karmic weight. 7th house overlays = marriage pull; 8th house = deep transformation and obsession; 12th house = spiritual dissolution of ego boundaries.",
              },
              {
                n: 3,
                title: 'Check Soulmate Connections and Karmic Bonds sections',
                desc: "These are pre-filtered shortlists of the most significant aspects. Soulmate Connections (harmonious aspects with tight orbs) and Karmic Bonds (Saturn, Ketu, and Rahu aspects with tight orbs) are the most emotionally resonant findings in the report.",
              },
              {
                n: 4,
                title: 'Switch to the Navamsa tab',
                desc: 'D9 Navamsa overlays show the soul-contract level of compatibility — how the relationship will feel 10 years in, beyond initial chemistry. A good D1 synastry with weak D9 overlays can indicate strong initial attraction that struggles to deepen.',
              },
              {
                n: 5,
                title: 'Review the Advanced tab',
                desc: 'KP Compatibility (sub-lord significations for the 7th house) and Jaimini Darakaraka resonance provide a technical third and fourth validation layer. Strong KP alignment plus good D9 overlays is the gold standard.',
              },
            ].map(({ n, title, desc }) => (
              <li key={n} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-sm">
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
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-8 text-white text-center shadow-xl shadow-teal-500/20">
            <GitBranch className="w-10 h-10 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-2">Run Your Full Deep Synastry</h3>
            <p className="text-teal-100 mb-6 max-w-md mx-auto">
              Enter both birth details and get all 216 cross-chart overlays, D9 Navamsa synastry, KP compatibility, and Jaimini Darakaraka analysis — free and instant.
            </p>
            <Link
              to="/calculator"
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-8 py-3 rounded-xl hover:bg-teal-50 transition-colors"
            >
              Start Analysis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Related Features */}
        <section>
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Related Features</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Ashtakoot Milan', to: '/features/ashtakoot-milan' },
              { label: 'Psychological Profile', to: '/features/psychological-profile' },
              { label: 'Conflict Zones', to: '/features/conflict-zones' },
              { label: 'All Features', to: '/features' },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-sm font-medium hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
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

export default SynastryPage;
