import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { BookOpen, ChevronRight, Clock, Calendar, ArrowRight, Star } from 'lucide-react';

const Callout: React.FC<{ type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }> = ({ type = 'info', children }) => {
  const styles = {
    info: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200',
    tip: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200',
  };
  return <div className={`border-l-4 rounded-r-xl px-5 py-4 my-6 text-sm leading-relaxed ${styles[type]}`}>{children}</div>;
};

const methods = [
  {
    num: '01',
    name: 'Vimshottari Dasha',
    color: 'indigo',
    desc: 'The primary timing system in Vedic astrology. A 120-year planetary period cycle where each planet rules for a fixed duration. Marriage is predicted when the ruling Mahadasha or Antardasha planet is the 7th lord, Venus (for men), Jupiter (for women), or the Darakaraka.',
    detail: 'For example, if Venus Mahadasha runs from age 24-44, the Venus-Venus or Venus-Jupiter sub-period are peak marriage windows. The chart must also show a "marriage promise" (Vivah Yoga) for the dasha to trigger the event.',
  },
  {
    num: '02',
    name: 'Jupiter & Saturn Transits',
    color: 'purple',
    desc: 'The two "social planets" — Jupiter and Saturn — play a key role in triggering marriage. Jupiter transiting the 7th house, 7th lord, or natal Venus is a classic marriage trigger. Saturn\'s transit through the 7th house often coincides with marriage for earth-sign ascendants.',
    detail: 'The strongest trigger is when Jupiter and Saturn transits BOTH activate marriage houses simultaneously — this creates a "double transit" effect that classical astrologers consider highly reliable for marriage timing.',
  },
  {
    num: '03',
    name: 'KP 2-7-11 Rule',
    color: 'blue',
    desc: 'Krishnamurti Paddhati (KP) uses the sub-lord of the 7th house cusp to determine marriage promise. If the 7th sub-lord signifies houses 2, 7, and 11 — marriage is promised. The timing is then pinpointed using KP Ruling Planets at the time of prediction.',
    detail: 'The 2nd house represents family (entering a new family), 7th is marriage itself, and 11th is fulfillment of desires. This three-house signification is the KP gold standard for marriage prediction.',
  },
  {
    num: '04',
    name: 'Jaimini Chara Dasha',
    color: 'rose',
    desc: 'A sign-based dasha system unique to Jaimini astrology. Marriage is triggered when the Chara Dasha activates the sign containing the Darakaraka (the planet with the lowest degree — significator of spouse), the 7th house, or Upapada Lagna.',
    detail: 'Jaimini Chara Dasha is particularly useful for confirming results from Vimshottari — when both dashas point to the same period, confidence in the prediction is very high.',
  },
  {
    num: '05',
    name: 'Navamsa (D9) Confirmation',
    color: 'amber',
    desc: 'The D9 chart is the primary divisional chart for marriage. When dasha planets also activate favorable positions in the D9 — especially the 7th house of the D9 — it provides a final confirmation layer for marriage timing.',
    detail: 'Astrologers look for the dasha lord to be strong in the D9, not debilitated or in the 6th/8th/12th of the D9. A planet may appear powerful in D1 but weak in D9, which can delay marriage even in a favorable dasha.',
  },
];

export const MarriageTimingBlogPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: 'Can astrology give an exact marriage date?', a: 'Astrology narrows timing to a period (typically 6-18 months), not a specific date. The more methods that converge on the same window, the higher the accuracy. Exact date prediction requires additional techniques like Prashna (horary astrology).' },
    { q: 'What planets delay marriage in Vedic astrology?', a: 'Saturn in the 7th house or aspecting Venus, Rahu-Ketu on the 7th axis, and retrograde or debilitated Venus are the main delay indicators. Running Saturn Mahadasha during peak marriage age can also postpone marriage even with a strong 7th house.' },
    { q: 'Is there a universally "correct" age for marriage in Vedic astrology?', a: 'No — the chart determines the individual\'s marriage timeline. Some charts show early marriage (22-25), others show mid-30s or later. A chart predicting late marriage is not considered bad; it reflects a different life path, not a flaw.' },
    { q: 'Can all 5 methods be wrong simultaneously?', a: 'When all 5 methods agree on a window, the confidence is very high. When they conflict, an experienced astrologer weighs them — Vimshottari Dasha and Jupiter transit typically carry the most weight, followed by KP sub-lord confirmation.' },
  ];

  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700',
    purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700',
    blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700',
    rose: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-700',
    amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOHead
        title="When Will I Get Married? 5 Vedic Astrology Methods Explained | Astro Marriage"
        description="How does Vedic astrology predict marriage timing? The 5 methods: Vimshottari Dasha, Jupiter-Saturn transits, KP 2-7-11 rule, Jaimini Chara Dasha & Navamsa confirmation."
        path="/blog/when-will-i-get-married-astrology"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'When Will I Get Married? 5 Vedic Astrology Methods Explained',
          author: { '@type': 'Organization', name: 'NovaVentures AI' },
          publisher: { '@type': 'Organization', name: 'Astro Marriage', url: 'https://marriage-astro.vercel.app' },
          datePublished: '2026-03-10',
          url: 'https://marriage-astro.vercel.app/blog/when-will-i-get-married-astrology',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-700 dark:text-gray-200 truncate">When Will I Get Married?</span>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-10">
          <span className="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">Marriage Timing</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 leading-tight mb-4">
            When Will I Get Married? The 5 Vedic Astrology Methods That Predict Marriage Timing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Vedic astrology doesn't predict a specific date — it identifies windows of high probability using five convergent timing methods. Here's how each one works and how they're used together.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> March 10, 2026</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 10 min read</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> By NovaVentures AI</span>
          </div>
        </div>

        <div className="space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How Vedic Astrology Predicts Marriage Timing</h2>
            <p className="mb-4">Unlike Western astrology, which focuses on character and personality, Vedic astrology has an elaborate predictive framework called Dasha (planetary period) systems. These time-based cycles allow astrologers to identify when specific life events — including marriage — are most likely to occur.</p>
            <p className="mb-4">The strength of Vedic timing prediction comes from using multiple methods simultaneously. When Vimshottari Dasha, Jupiter's transit, KP sub-lord analysis, Jaimini Chara Dasha, and Navamsa confirmation all point to the same 12-18 month window, the prediction carries very high confidence.</p>
            <Callout type="info">
              <strong>Important:</strong> Marriage timing prediction assumes a "marriage promise" exists in the chart. If the 7th house, its lord, and Venus are severely afflicted with no compensating factors, even favorable dashas may not trigger marriage. The promise must exist before timing methods apply.
            </Callout>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">The 5 Methods Used Together</h2>
            <div className="space-y-6">
              {methods.map(m => (
                <div key={m.num} className={`rounded-2xl border p-6 ${colorMap[m.color]}`}>
                  <div className="flex items-start gap-4">
                    <span className="text-3xl font-black opacity-30">{m.num}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{m.name}</h3>
                      <p className="text-sm mb-3 opacity-90">{m.desc}</p>
                      <p className="text-sm opacity-75 italic">{m.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Delays Marriage in Astrology</h2>
            <p className="mb-4">When clients ask "why hasn't my marriage happened yet?", astrologers look at these primary delay indicators:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { factor: 'Saturn in or aspecting 7th house', effect: 'Delays but doesn\'t deny — marriage typically after 28-30' },
                { factor: 'Rahu-Ketu on the 7th axis', effect: 'Unconventional relationship path; marriage to foreigner or unusual circumstances' },
                { factor: 'Retrograde Venus', effect: 'Hesitancy in commitment; past relationship baggage to resolve first' },
                { factor: 'Debilitated 7th lord', effect: 'Weak marriage promise; requires strong dasha to trigger' },
                { factor: 'Running Saturn Mahadasha', effect: '19-year period known for delays in all life areas including marriage' },
                { factor: 'Multiple retrograde planets in 7th', effect: 'Significant rethinking of marriage; often late or unconventional' },
              ].map(d => (
                <div key={d.factor} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">{d.factor}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{d.effect}</p>
                </div>
              ))}
            </div>
            <Callout type="tip">
              <strong>See it in action:</strong> Astro Marriage's <Link to="/features/marriage-timing" className="underline">Marriage Timing widget</Link> runs all 5 methods and shows your personalized marriage windows with specific year ranges and the methods that support each window.
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

        <div className="mt-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white">
          <Star className="w-10 h-10 mx-auto mb-3 opacity-80" />
          <h3 className="text-2xl font-bold mb-2">Find Your Marriage Window</h3>
          <p className="text-purple-100 mb-6">Get personalized marriage timing predictions using all 5 Vedic methods — free, instant, private.</p>
          <Link to="/calculator" className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold px-8 py-3 rounded-xl hover:bg-purple-50 transition-colors">
            Check Your Timing Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Related Articles</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { to: '/blog/kundali-matching-complete-guide', title: 'Kundali Matching Complete Guide', tag: 'Kundali Matching' },
              { to: '/blog/vedic-vs-western-astrology-marriage', title: 'Vedic vs Western Astrology for Marriage', tag: 'Astrology Basics' },
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

export default MarriageTimingBlogPage;
