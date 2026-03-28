import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { BookOpen, ChevronRight, Clock, Calendar, ArrowRight, Globe } from 'lucide-react';

const Callout: React.FC<{ type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }> = ({ type = 'info', children }) => {
  const styles = {
    info: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200',
    tip: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200',
  };
  return <div className={`border-l-4 rounded-r-xl px-5 py-4 my-6 text-sm leading-relaxed ${styles[type]}`}>{children}</div>;
};

export const VedicVsWesternPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const comparisons = [
    { aspect: 'Zodiac System', vedic: 'Sidereal — based on actual star positions (currently ~23° behind tropical)', western: 'Tropical — based on seasons; fixed to the spring equinox point' },
    { aspect: 'Primary Reference', vedic: 'Moon sign (Rashi) and Nakshatra — changes every 2.5 days', western: 'Sun sign — changes every 30 days' },
    { aspect: 'Compatibility Method', vedic: 'Ashtakoot Milan (8 factors, 36 points) + synastry + KP + Jaimini', western: 'Synastry (cross-chart aspects), composite chart, Davison chart' },
    { aspect: 'Timing Prediction', vedic: 'Dasha systems (Vimshottari, Jaimini Chara Dasha) — highly specific event timing', western: 'Progressions and transits — more psychological, less event-specific' },
    { aspect: 'Houses', vedic: 'Whole sign houses (primarily) or equal houses; bhava chart', western: 'Placidus, Koch, or Equal house system' },
    { aspect: 'Predictive Focus', vedic: 'Event prediction — marriage, career, health events with timing', western: 'Psychological insight — character, tendencies, growth areas' },
    { aspect: 'Outer Planets', vedic: 'Traditionally uses 9 Grahas only (Sun through Ketu); modern Vedic includes Uranus/Neptune/Pluto as secondary', western: 'Uranus, Neptune, Pluto are primary chart elements' },
  ];

  const faqs = [
    { q: 'Which system is more accurate for marriage prediction?', a: 'For event-based prediction (will they marry, when), Vedic astrology\'s Dasha systems are generally considered more precise. For understanding relationship dynamics and psychological compatibility, Western synastry offers complementary depth.' },
    { q: 'Why is my Vedic sun sign different from my Western sun sign?', a: 'Because Vedic astrology uses the sidereal zodiac (aligned to actual star constellations), while Western uses the tropical zodiac (aligned to seasons). The difference is currently about 23° — meaning most people\'s sun sign shifts back one sign in Vedic astrology.' },
    { q: 'Can I use both systems together?', a: 'Yes — many modern astrologers use Vedic methods for event timing and marriage promise analysis, while using Western synastry for psychological compatibility depth. Astro Marriage incorporates both by including outer planet synastry alongside traditional Vedic analysis.' },
    { q: 'Is Kundali matching used in Western astrology?', a: 'No — Ashtakoot Milan is unique to Vedic (Hindu) astrology. Western astrology has no equivalent system. The closest Western concept is synastry chart overlays, which Vedic astrology also uses (called graha drishti and Parashari synastry).' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOHead
        title="Vedic vs Western Astrology for Marriage Compatibility — Key Differences | Astro Marriage"
        description="How Vedic and Western astrology differ in marriage compatibility analysis. Sidereal vs tropical zodiac, Kundali matching vs synastry, Dasha timing vs progressions."
        path="/blog/vedic-vs-western-astrology-marriage"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Vedic vs Western Astrology for Marriage Compatibility',
          author: { '@type': 'Organization', name: 'NovaVentures AI' },
          publisher: { '@type': 'Organization', name: 'Astro Marriage', url: 'https://marriage-astro.vercel.app' },
          datePublished: '2026-03-05',
          url: 'https://marriage-astro.vercel.app/blog/vedic-vs-western-astrology-marriage',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-700 dark:text-gray-200 truncate">Vedic vs Western Astrology</span>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-10">
          <span className="inline-block bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">Astrology Basics</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 leading-tight mb-4">
            Vedic vs Western Astrology for Marriage Compatibility — Key Differences Explained
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Both traditions analyze marriage compatibility — but using fundamentally different frameworks. Here's a side-by-side breakdown of the methods, zodiacs, and philosophies.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> March 5, 2026</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 9 min read</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> By NovaVentures AI</span>
          </div>
        </div>

        <div className="space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">The Fundamental Difference</h2>
            <p className="mb-4">Vedic astrology (Jyotish) and Western astrology share the same ancient roots — both descended from Mesopotamian astronomy. But around 285 CE, they diverged on a critical question: should the zodiac be fixed to the stars (sidereal) or to the seasons (tropical)?</p>
            <p className="mb-4">Western astrology chose the tropical zodiac: Aries begins at the spring equinox, regardless of where the actual Aries constellation is in the sky. Vedic astrology uses the sidereal zodiac: signs are aligned to the actual star constellations. Due to the "precession of the equinoxes," these two zodiacs are currently about 23° apart — meaning most people's sun sign shifts back one sign in Vedic astrology.</p>
            <p>This single difference cascades into entirely different chart structures, house systems, and predictive methods — making the two traditions genuinely distinct despite their shared origin.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Side-by-Side Comparison</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 w-1/4">Aspect</th>
                    <th className="text-left px-4 py-3 font-semibold text-indigo-700 dark:text-indigo-300 w-3/8">Vedic (Jyotish)</th>
                    <th className="text-left px-4 py-3 font-semibold text-purple-700 dark:text-purple-300 w-3/8">Western</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {comparisons.map((row, i) => (
                    <tr key={i} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{row.aspect}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{row.vedic}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{row.western}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why Vedic is Preferred for Marriage Matching in India</h2>
            <p className="mb-4">Vedic astrology's dominance in Indian marriage matching comes from two practical strengths:</p>
            <p className="mb-4"><strong>1. Nakshatra precision:</strong> The Moon moves through a different Nakshatra every 24 hours. This granularity allows extremely precise compatibility scoring — two people born in the same month can have completely different Yoni, Nadi, and Tara scores based solely on their birth time.</p>
            <p className="mb-4"><strong>2. Dasha-based event timing:</strong> Vedic Dasha systems allow astrologers to say "your marriage window is 2026-2028" with reasonable confidence. Western progressions and transits are more useful for psychological timing ("you're in a period of relationship deepening") than for specific event prediction.</p>
            <Callout type="tip">
              <strong>Best of both worlds:</strong> Astro Marriage uses Vedic methods for compatibility scoring and event timing, while also including Western synastry elements (outer planet aspects: Uranus, Neptune, Pluto) in the Modern Psychology section for deeper relationship insight.
            </Callout>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{faq.q}</span>
                    <span className="text-indigo-500 ml-4 flex-shrink-0">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-300">{faq.a}</div>}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <Globe className="w-10 h-10 mx-auto mb-3 opacity-80" />
          <h3 className="text-2xl font-bold mb-2">Try Vedic Compatibility Analysis Free</h3>
          <p className="text-blue-100 mb-6">19+ Vedic analysis modules plus modern psychology synastry — no signup needed.</p>
          <Link to="/calculator" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
            Start Free Analysis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Related Articles</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { to: '/blog/kundali-matching-complete-guide', title: 'Kundali Matching Complete Guide', tag: 'Kundali Matching' },
              { to: '/blog/when-will-i-get-married-astrology', title: 'When Will I Get Married?', tag: 'Marriage Timing' },
            ].map(r => (
              <Link key={r.to} to={r.to} className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{r.tag}</span>
                <p className="font-semibold text-gray-900 dark:text-gray-100 mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{r.title} →</p>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default VedicVsWesternPage;
