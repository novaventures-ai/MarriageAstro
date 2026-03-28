import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';

const relatedFeatures = [
  { slug: 'ashtakoot-milan', title: 'Ashtakoot Milan' },
  { slug: 'sexual-compatibility', title: 'Sexual Compatibility' },
  { slug: 'yoga-dosha', title: 'Yoga & Dosha Analysis' },
];

const poruthamData = [
  {
    name: 'Dina Porutham',
    tamil: 'தின பொருத்தம்',
    aspect: 'Health & Longevity',
    result: 'Good',
    score: '3/3',
    note: 'Counted from bride\'s star — 3rd, 5th, 7th stars from bride\'s are auspicious. Vikram\'s nakshatra falls in the good tier.',
    critical: false,
  },
  {
    name: 'Gana Porutham',
    tamil: 'கண பொருத்தம்',
    aspect: 'Temperament Match',
    result: 'Partial',
    score: '1/3',
    note: 'Ananya is Deva Gana (divine temperament), Vikram is Manushya Gana (human). Deva–Manushya is tolerated but not ideal.',
    critical: false,
  },
  {
    name: 'Mahendra Porutham',
    tamil: 'மகேந்திர பொருத்தம்',
    aspect: 'Prosperity & Children',
    result: 'Good',
    score: '3/3',
    note: 'Groom\'s star falls in the 4th, 7th, 10th, or 13th position from bride\'s star — both confirmed.',
    critical: false,
  },
  {
    name: 'Stree Deergha Porutham',
    tamil: 'ஸ்திரீ தீர்க்க பொருத்தம்',
    aspect: 'Long Married Life',
    result: 'Good',
    score: '3/3',
    note: 'Groom\'s star is more than 9 stars away from bride\'s — long, prosperous married life indicated.',
    critical: false,
  },
  {
    name: 'Yoni Porutham',
    tamil: 'யோனி பொருத்தம்',
    aspect: 'Physical/Sexual Harmony',
    result: 'Good',
    score: '3/3',
    note: 'Ananya: Horse Yoni (Ashwini). Vikram: Horse Yoni (Shatabhisha). Same Yoni = excellent physical compatibility.',
    critical: false,
  },
  {
    name: 'Rashi Porutham',
    tamil: 'ராசி பொருத்தம்',
    aspect: 'Emotional Compatibility',
    result: 'Good',
    score: '2/3',
    note: 'Moon signs are in a 7–7 (kendra) relationship — emotional reciprocity. Minor tension from different sign lords.',
    critical: false,
  },
  {
    name: 'Rasiyathipathi Porutham',
    tamil: 'ராசியாதிபதி பொருத்தம்',
    aspect: 'Sign Lord Compatibility',
    result: 'Good',
    score: '3/3',
    note: 'Venus and Jupiter rule the respective Moon signs — natural friends. Excellent sign lord compatibility.',
    critical: false,
  },
  {
    name: 'Vasya Porutham',
    tamil: 'வஸ்ய பொருத்தம்',
    aspect: 'Attraction & Influence',
    result: 'Partial',
    score: '1/3',
    note: 'Partial attraction — bride\'s sign has some vasya pull over groom\'s, but not mutual. Manageable.',
    critical: false,
  },
  {
    name: 'Rajju Porutham',
    tamil: 'ரஜ்ஜு பொருத்தம்',
    aspect: 'Longevity (Most Critical)',
    result: 'Good',
    score: '3/3',
    note: 'Different Rajju groups confirmed: Ananya in Shiro Rajju, Vikram in Kati Rajju. No Rajju Dosha — marriage safe to proceed.',
    critical: true,
  },
  {
    name: 'Vedha Porutham',
    tamil: 'வேத பொருத்தம்',
    aspect: 'Absence of Obstacles',
    result: 'Good',
    score: '3/3',
    note: 'Nakshatras are not in a Vedha (affliction) pair. No mutual obstruction between the stars.',
    critical: false,
  },
];

const totalScore = poruthamData.reduce((acc, r) => {
  const [num, den] = r.score.split('/').map(Number);
  return { num: acc.num + num, den: acc.den + den };
}, { num: 0, den: 0 });

export const PoruthamPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SEOHead
      title="10 Porutham — South Indian Tamil/Kerala Compatibility System | Astro Marriage"
      description="The 10 Porutham system used in Tamil Nadu and Kerala checks 10 compatibility factors including the critical Rajju Porutham for marriage longevity. Learn how each factor works."
      path="/features/porutham"
    />

    {/* Breadcrumb */}
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Home</Link>
      <span>/</span>
      <Link to="/features" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Features</Link>
      <span>/</span>
      <span className="text-gray-700 dark:text-gray-200">10 Porutham</span>
    </div>

    {/* Hero */}
    <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          South Indian System
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          10 Porutham — South Indian Tamil/Kerala Compatibility System
        </h1>
        <p className="text-xl text-white/90 max-w-2xl">
          Used for centuries in Tamil Nadu and Kerala, the 10 Porutham (Tamil: பொருத்தம்) assesses marriage compatibility across 10 life dimensions — from temperament and health to longevity and attraction.
        </p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      {/* What Is It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Is 10 Porutham?</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Porutham (பொருத்தம்) is the Tamil and Malayalam tradition of nakshatra-based compatibility matching, used predominantly in Tamil Nadu and Kerala. While North India uses the Ashtakoot system (8 factors, 36 points), South India employs 10 different Poruthams — each examining a specific life dimension. Compatibility is assessed by comparing the Janma Nakshatra (birth star) of the bride and groom according to rules passed down in ancient Tamil texts including the Hora Sara and Muhurtha Chintamani.
          </p>
          <p>
            Not all 10 factors carry equal weight. Rajju Porutham is considered the most critical — if the bride and groom share the same Rajju group (Shiro/Head, Kanta/Neck, Udara/Stomach, Kati/Hip, or Pada/Feet), marriage is strongly discouraged regardless of other scores. This is because same-Rajju marriage is believed to threaten the longevity of the marriage or one partner's life. After Rajju, Vedha and Yoni Poruthams are the next most significant. A match scoring 7+ out of 10 Poruthams with Rajju satisfied is considered excellent.
          </p>
        </div>
      </section>

      {/* Why It Matters */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why It Matters</h2>
        <ul className="space-y-4">
          {[
            {
              icon: '🏛️',
              heading: 'Cultural completeness for South Indian families',
              body: 'Tamil and Malayalam families routinely require a jyotishi to check all 10 Poruthams before confirming a marriage alliance. Missing even one factor — especially Rajju — is considered a serious oversight.',
            },
            {
              icon: '⚠️',
              heading: 'Rajju is a non-negotiable gate',
              body: 'Same-Rajju couples face a hard gate — no number of other good Poruthams compensates. This feature explicitly checks Rajju first and prominently flags any same-Rajju issue, preventing a critical oversight.',
            },
            {
              icon: '🔄',
              heading: 'Complements Ashtakoot for North-South couples',
              body: 'For inter-regional matches, both Ashtakoot (North Indian) and 10 Porutham (South Indian) analyses are provided. A strong match on both systems provides the highest cross-traditional confidence.',
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

      {/* 10-Row Table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sample 10 Porutham Results</h2>
          <span className="inline-flex items-center gap-1.5 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 text-xs font-semibold px-3 py-1 rounded-full border border-pink-200 dark:border-pink-700">
            📊 Ananya (Ashwini) × Vikram (Shatabhisha)
          </span>
        </div>

        {/* Score summary */}
        <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-2xl p-5 text-white mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold opacity-80 mb-1">Overall Porutham Score</div>
            <div className="text-4xl font-bold">8 / 10</div>
            <div className="text-sm opacity-80 mt-1">Rajju: ✓ Passed — Marriage Recommended</div>
          </div>
          <div className="text-7xl opacity-20">💫</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  {['Porutham', 'Tamil Name', 'Aspect', 'Score', 'Result'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {poruthamData.map(row => (
                  <tr
                    key={row.name}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${row.critical ? 'bg-pink-50 dark:bg-pink-900/10' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{row.name}</div>
                      {row.critical && (
                        <span className="inline-block mt-0.5 text-[9px] font-bold uppercase bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded">Most Critical</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{row.tamil}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{row.aspect}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-gray-900 dark:text-gray-100 text-sm">{row.score}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          row.result === 'Good' ? 'bg-green-500' : row.result === 'Bad' ? 'bg-red-500' : 'bg-amber-500'
                        }`} />
                        <span className={`text-sm font-semibold ${
                          row.result === 'Good' ? 'text-green-700 dark:text-green-400' : row.result === 'Bad' ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'
                        }`}>{row.result}</span>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-tight">{row.note}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How To Read */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How To Read the 10 Porutham Report</h2>
        <ol className="space-y-4">
          {[
            { step: 1, title: 'Check Rajju Porutham first', detail: 'Regardless of overall score, Rajju must show "Good". Same-Rajju marriage is the only hard stop in this system. If Rajju passes, continue to the overall score.' },
            { step: 2, title: 'Review the overall score (out of 10)', detail: 'A score of 7 or above with Rajju passing is considered an excellent match. 5–6 is acceptable. Below 5 with a poor Rajju is strongly discouraged.' },
            { step: 3, title: 'Examine "Partial" results in context', detail: 'Partial scores are not failures — they indicate areas requiring conscious effort. A Partial in Gana Porutham means the couple has different temperaments and will need to manage communication style gaps.' },
            { step: 4, title: 'Read the detailed note for each factor', detail: 'Each Porutham includes a plain-English explanation of exactly why it passed, partially passed, or failed — based on your actual nakshatra combination, not a generic rule.' },
          ].map(({ step, title, detail }) => (
            <li key={step} className="flex gap-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 flex items-center justify-center font-bold text-sm">
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
      <section className="bg-gradient-to-r from-pink-500 to-fuchsia-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Check Your 10 Porutham Compatibility</h2>
        <p className="text-white/85 mb-6 max-w-md mx-auto">
          Enter both partners' birth details to get the full 10-factor Porutham report with Rajju check and detailed nakshatra explanations.
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-white text-pink-700 font-bold px-8 py-3 rounded-xl hover:bg-pink-50 transition-colors shadow-lg"
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
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-pink-400 dark:hover:border-pink-500 transition-colors"
            >
              {f.title} →
            </Link>
          ))}
        </div>
      </section>

    </div>
  </div>
);

export default PoruthamPage;
