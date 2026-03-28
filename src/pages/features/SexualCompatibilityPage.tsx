import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';

const relatedFeatures = [
  { slug: 'ashtakoot-milan', title: 'Ashtakoot Milan' },
  { slug: 'porutham', title: '10 Porutham' },
  { slug: 'psychological-profile', title: 'Psychological Profile' },
];

// 4×4 sample of the 14×14 Yoni compatibility matrix
// Score is out of 4. Color-coded by score.
const yoniMatrixSample: Array<{ animal: string; symbol: string; scores: Array<{ animal: string; score: number }> }> = [
  {
    animal: 'Horse',
    symbol: '🐴',
    scores: [
      { animal: 'Horse', score: 4 },
      { animal: 'Mare', score: 3 },
      { animal: 'Elephant', score: 2 },
      { animal: 'Cat', score: 1 },
    ],
  },
  {
    animal: 'Mare',
    symbol: '🐎',
    scores: [
      { animal: 'Horse', score: 3 },
      { animal: 'Mare', score: 4 },
      { animal: 'Elephant', score: 1 },
      { animal: 'Cat', score: 2 },
    ],
  },
  {
    animal: 'Elephant',
    symbol: '🐘',
    scores: [
      { animal: 'Horse', score: 2 },
      { animal: 'Mare', score: 1 },
      { animal: 'Elephant', score: 4 },
      { animal: 'Cat', score: 3 },
    ],
  },
  {
    animal: 'Cat',
    symbol: '🐱',
    scores: [
      { animal: 'Horse', score: 1 },
      { animal: 'Mare', score: 2 },
      { animal: 'Elephant', score: 3 },
      { animal: 'Cat', score: 4 },
    ],
  },
];

function scoreColor(score: number): string {
  if (score === 4) return 'bg-green-200 dark:bg-green-800/60 text-green-900 dark:text-green-100';
  if (score === 3) return 'bg-lime-100 dark:bg-lime-800/40 text-lime-900 dark:text-lime-100';
  if (score === 2) return 'bg-amber-100 dark:bg-amber-800/40 text-amber-900 dark:text-amber-100';
  return 'bg-red-100 dark:bg-red-800/40 text-red-900 dark:text-red-100';
}

function scoreLegend(score: number): string {
  if (score === 4) return 'Excellent';
  if (score === 3) return 'Good';
  if (score === 2) return 'Neutral';
  return 'Hostile';
}

const sampleResult = {
  yoniA: 'Horse (Ashwini)',
  yoniB: 'Horse (Shatabhisha)',
  yoniScore: '4/4',
  verdict: 'Excellent',
  driveA: 'High',
  driveB: 'Moderate-High',
  intimacyDepth: 'Very High',
  overallScore: '82/100',
};

const nakshatraYoniMap = [
  { nakshatra: 'Ashwini, Shatabhisha', yoni: 'Horse', element: 'Air' },
  { nakshatra: 'Bharani, Revati', yoni: 'Elephant', element: 'Water' },
  { nakshatra: 'Pushya, Krittika', yoni: 'Goat/Sheep', element: 'Fire' },
  { nakshatra: 'Rohini, Mrigashira', yoni: 'Serpent', element: 'Earth' },
  { nakshatra: 'Ardra, Mula', yoni: 'Dog', element: 'Fire' },
  { nakshatra: 'Punarvasu, Ashlesha', yoni: 'Cat', element: 'Water' },
  { nakshatra: 'Magha, Purva Phalguni', yoni: 'Rat', element: 'Air' },
  { nakshatra: 'Uttara Phalguni, Uttara Bhadrapada', yoni: 'Cow', element: 'Earth' },
];

export const SexualCompatibilityPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SEOHead
      title="Sexual Compatibility — Yoni Matching & Drive Analysis | Astro Marriage"
      description="27 Nakshatras assigned to 14 Yoni animal types. Full 14×14 compatibility matrix. Drive level, intimacy depth, and individual sexual health indicators from your birth chart."
      path="/features/sexual-compatibility"
    />

    {/* Breadcrumb */}
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Home</Link>
      <span>/</span>
      <Link to="/features" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Features</Link>
      <span>/</span>
      <span className="text-gray-700 dark:text-gray-200">Sexual Compatibility</span>
    </div>

    {/* Hero */}
    <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Intimate Compatibility
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Sexual Compatibility — Yoni Matching &amp; Drive Analysis
        </h1>
        <p className="text-xl text-white/90 max-w-2xl">
          Each of the 27 Nakshatras is assigned one of 14 animal Yoni types. Physical and intimate compatibility is assessed on a 14×14 matrix — with drive level and intimacy depth scored separately.
        </p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      {/* What Is It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Is Yoni Matching?</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            In Vedic astrology, each of the 27 Nakshatras (lunar mansions) is assigned to one of 14 animal types called Yoni. "Yoni" literally means "origin" or "source" and in this context represents the sexual nature and drive quality of a person born under that Nakshatra. The 14 Yoni types are: Horse, Elephant, Sheep/Goat, Serpent, Dog, Cat, Rat, Cow, Buffalo, Tiger, Deer/Hare, Monkey, Lion, and Mongoose. Each Nakshatra has a gender — the same Yoni animal in opposite gender nakshatras indicates natural physical compatibility.
          </p>
          <p>
            Compatibility between Yoni types is assessed on a 4-point scale using a 14×14 matrix that classifies each pair as Svayoni (same animal, maximum compatibility — 4 points), Friendly (related animals — 3 points), Neutral (2 points), or Enemy/Hostile (incompatible animal pairing — 0-1 points). The most hostile pairings include Cat–Rat, Dog–Deer, and Elephant–Lion. Beyond Yoni matching, this module also scores individual sexual drive levels from Venus placement and dignity, 7th house strength, and Mars position — providing a complete intimate compatibility picture.
          </p>
        </div>
      </section>

      {/* Why It Matters */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why It Matters</h2>
        <ul className="space-y-4">
          {[
            {
              icon: '💑',
              heading: 'Physical compatibility is a real compatibility dimension',
              body: 'Most compatibility systems focus on emotional and intellectual compatibility. Yoni matching specifically addresses physical and intimate resonance — which is a distinct and important dimension of long-term marital happiness.',
            },
            {
              icon: '🎯',
              heading: 'Mismatched drive levels create friction',
              body: 'Two people can have friendly Yoni types but very different drive levels (Venus strong vs. weak, Mars placement differences). The drive level scores reveal when this mismatch is present and how to navigate it.',
            },
            {
              icon: '🔮',
              heading: 'Past Yoni Koota score gets full context here',
              body: 'In Ashtakoot, Yoni is worth 4 points. This module provides the full picture behind that score — showing the exact animal types, their relationship (friendly vs hostile), and all the contributing factors rather than just the number.',
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
          <span className="inline-flex items-center gap-1.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-semibold px-3 py-1 rounded-full border border-red-200 dark:border-red-700">
            📊 Ananya (Ashwini) × Vikram (Shatabhisha)
          </span>
        </div>

        {/* Result summary */}
        <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl p-5 text-white mb-8 grid sm:grid-cols-4 gap-4">
          <div>
            <div className="text-xs font-semibold opacity-70 mb-0.5 uppercase">Yoni Pair</div>
            <div className="font-bold">{sampleResult.yoniA}</div>
            <div className="font-bold">{sampleResult.yoniB}</div>
          </div>
          <div>
            <div className="text-xs font-semibold opacity-70 mb-0.5 uppercase">Yoni Score</div>
            <div className="text-2xl font-black">{sampleResult.yoniScore}</div>
            <div className="text-sm">{sampleResult.verdict}</div>
          </div>
          <div>
            <div className="text-xs font-semibold opacity-70 mb-0.5 uppercase">Drive Levels</div>
            <div className="text-sm">A: {sampleResult.driveA}</div>
            <div className="text-sm">B: {sampleResult.driveB}</div>
          </div>
          <div>
            <div className="text-xs font-semibold opacity-70 mb-0.5 uppercase">Overall Score</div>
            <div className="text-2xl font-black">{sampleResult.overallScore}</div>
            <div className="text-sm">Intimacy: {sampleResult.intimacyDepth}</div>
          </div>
        </div>

        {/* Nakshatra-Yoni reference */}
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Nakshatra → Yoni Assignment (Sample)</h3>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {['Nakshatra(s)', 'Yoni Type', 'Element'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {nakshatraYoniMap.map(row => (
                  <tr key={row.nakshatra} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{row.nakshatra}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{row.yoni}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        row.element === 'Fire'  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                        row.element === 'Water' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                        row.element === 'Earth' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                                  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      }`}>{row.element}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
            Showing 8 of 27 Nakshatras. Full 27-Nakshatra table available in the calculator.
          </div>
        </div>

        {/* 4×4 mini compatibility matrix */}
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Yoni Compatibility Matrix (4×4 Sample)</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">The full matrix is 14×14. Color coding: green = excellent, yellow = good, amber = neutral, red = hostile.</p>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="text-sm border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 border-b border-r border-gray-200 dark:border-gray-700">
                    ↓ Bride · Groom →
                  </th>
                  {yoniMatrixSample.map(col => (
                    <th key={col.animal} className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 border-b border-r border-gray-200 dark:border-gray-700">
                      {col.symbol} {col.animal}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {yoniMatrixSample.map(row => (
                  <tr key={row.animal} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 text-sm bg-gray-50 dark:bg-gray-700/30 border-r border-gray-200 dark:border-gray-700 whitespace-nowrap">
                      {row.symbol} {row.animal}
                    </td>
                    {row.scores.map(cell => (
                      <td key={cell.animal} className={`px-4 py-3 text-center border-r border-gray-100 dark:border-gray-700 ${scoreColor(cell.score)}`}>
                        <div className="font-bold text-base">{cell.score}/4</div>
                        <div className="text-[10px] font-medium opacity-80">{scoreLegend(cell.score)}</div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex gap-4 flex-wrap">
            {[
              { color: 'bg-green-200 dark:bg-green-800/60', label: 'Excellent (4)' },
              { color: 'bg-lime-100 dark:bg-lime-800/40', label: 'Good (3)' },
              { color: 'bg-amber-100 dark:bg-amber-800/40', label: 'Neutral (2)' },
              { color: 'bg-red-100 dark:bg-red-800/40', label: 'Hostile (1)' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded ${l.color}`} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How To Read */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How To Read the Sexual Compatibility Report</h2>
        <ol className="space-y-4">
          {[
            { step: 1, title: 'Identify your Yoni type from your Nakshatra', detail: 'Find your Moon Nakshatra in the reference table to identify your Yoni animal type. Both partners\' Yoni types are identified from their Moon Nakshatra (Janma Nakshatra).' },
            { step: 2, title: 'Look up the matrix score for your pairing', detail: 'Cross-reference both Yoni types on the 14×14 matrix. A 4/4 score (same Yoni or friendly pair) is ideal. A 1/4 or 0/4 hostile pairing is a challenge area, but not a dealbreaker when other compatibility is strong.' },
            { step: 3, title: 'Compare drive levels', detail: 'Even a 4/4 Yoni match can produce friction if one partner\'s drive level (determined by Venus strength, Mars placement, and 7th house) is significantly higher than the other\'s. The drive level comparison surfaces this.' },
            { step: 4, title: 'Read intimacy depth indicator', detail: 'Intimacy depth (distinct from physical drive) is derived from Moon–Venus aspects, 4th house strength, and Navamsa Venus. High intimacy depth indicates capacity for emotional connection in physical intimacy — not just physical satisfaction.' },
          ].map(({ step, title, detail }) => (
            <li key={step} className="flex gap-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center font-bold text-sm">
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
      <section className="bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">See Your Full Sexual Compatibility Report</h2>
        <p className="text-white/85 mb-6 max-w-md mx-auto">
          Enter both partners' birth details for the complete Yoni match, drive level comparison, full 14×14 matrix score, and intimacy depth analysis.
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-white text-red-600 font-bold px-8 py-3 rounded-xl hover:bg-red-50 transition-colors shadow-lg"
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
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-red-400 dark:hover:border-red-500 transition-colors"
            >
              {f.title} →
            </Link>
          ))}
        </div>
      </section>

    </div>
  </div>
);

export default SexualCompatibilityPage;
