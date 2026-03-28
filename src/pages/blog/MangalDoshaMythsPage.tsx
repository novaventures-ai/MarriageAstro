import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { BookOpen, ChevronRight, Clock, Calendar, ArrowRight, CheckCircle, X, Heart, AlertTriangle } from 'lucide-react';

const Callout: React.FC<{ type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }> = ({ type = 'info', children }) => {
  const styles = {
    info: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200',
    tip: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200',
  };
  return <div className={`border-l-4 rounded-r-xl px-5 py-4 my-6 text-sm leading-relaxed ${styles[type]}`}>{children}</div>;
};

export const MangalDoshaMythsPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const myths = [
    {
      myth: 'Mangal Dosha always leads to spouse\'s death',
      fact: 'This is the most feared and most exaggerated claim in popular astrology. Classical texts associate severe Mangal Dosha with marital disharmony, conflict, or separation — not literal death. Modern astrologers categorically reject the fatalistic interpretation.',
    },
    {
      myth: 'Everyone with Mars in the 7th house is Manglik',
      fact: 'There are 6 houses that cause Mangal Dosha (1, 2, 4, 7, 8, 12 — calculated from Lagna, Moon, and Venus). Not all astrologers agree on which houses to include. The severity varies enormously based on Mars\'s sign, aspect, and conjunction.',
    },
    {
      myth: 'Two Mangliks can always marry each other safely',
      fact: 'Manglik + Manglik pairing is one cancellation rule, but it\'s not automatic. The nature and intensity of both Mars placements must be comparable. A severe Manglik with a mild Manglik isn\'t always a clean cancellation.',
    },
    {
      myth: 'Mangal Dosha has no cancellation rules',
      fact: 'There are 15+ classical cancellation rules. Mars in its own sign (Aries/Scorpio), exaltation (Capricorn), or in benefic company can neutralize or significantly reduce the dosha. Most people diagnosed as Manglik actually have a cancelled or weakened dosha.',
    },
    {
      myth: 'You can never have a happy marriage with Mangal Dosha',
      fact: 'Approximately 40% of the population has some form of Mangal Dosha. If this claim were true, 40% of marriages would end in disaster — which is statistically false. Uncancelled, severe Mangal Dosha in all three positions (Lagna, Moon, Venus) is actually rare.',
    },
    {
      myth: 'Online Manglik calculators are always accurate',
      fact: 'Most basic calculators only check Mars from the Lagna (ascendant). A proper assessment requires checking from Lagna, Moon sign, AND Venus — each giving different weight. Missing any of these gives an incomplete picture.',
    },
    {
      myth: 'Remedies like Kumbh Vivah fully neutralize Mangal Dosha',
      fact: 'Kumbh Vivah (marrying a banana tree or idol) is a folk remedy without classical textual basis. Legitimate Vedic remedies include Mars-related pujas, mantras, and lifestyle adjustments — but no remedy "fully removes" a natal planetary placement.',
    },
  ];

  const faqs = [
    { q: 'What percentage of people are Manglik?', a: 'Approximately 40-50% of the population has Mars in one of the dosha-causing houses from at least one reference point (Lagna, Moon, or Venus). However, only about 10-15% have uncancelled, significant Mangal Dosha from all three reference points.' },
    { q: 'What are the most powerful cancellation rules?', a: 'The strongest cancellations are: (1) Both partners are Manglik, (2) Mars is in its own sign (Aries/Scorpio) or exalted (Capricorn), (3) Mars is with benefic Jupiter or Venus, (4) Mars is in the 7th house for Makara (Capricorn) or Simha (Leo) Lagna, (5) The 7th lord is also Mars (same planet).' },
    { q: 'Should I reject a Manglik match outright?', a: 'No. First check for cancellations — many "Manglik" charts actually have a neutralized dosha. Then look at the full synastry: a match with uncancelled mild Mangal Dosha but excellent overall compatibility often outperforms a Dosha-free match with poor synastry.' },
    { q: 'Can Mangal Dosha develop after marriage?', a: 'No. Natal chart placements are fixed at birth and don\'t change. However, Mars transits and dashas can activate dormant Mangal Dosha effects temporarily — this is different from the natal dosha itself.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOHead
        title="Mangal Dosha: 7 Myths vs Facts — Complete Truth About Being Manglik | Astro Marriage"
        description="The 7 biggest Mangal Dosha myths debunked with facts. Learn the real effects of Mars affliction, 15+ cancellation rules, and what modern astrologers actually say."
        path="/blog/mangal-dosha-myths-facts"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Mangal Dosha: 7 Myths vs Facts — Complete Truth About Being Manglik',
          author: { '@type': 'Organization', name: 'NovaVentures AI' },
          publisher: { '@type': 'Organization', name: 'Astro Marriage', url: 'https://marriage-astro.vercel.app' },
          datePublished: '2026-03-15',
          url: 'https://marriage-astro.vercel.app/blog/mangal-dosha-myths-facts',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-700 dark:text-gray-200 truncate">Mangal Dosha Myths vs Facts</span>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-10">
          <span className="inline-block bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">Doshas</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 leading-tight mb-4">
            Mangal Dosha: 7 Myths vs Facts — The Complete Truth About Being Manglik
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Mangal Dosha is the most misunderstood concept in Vedic marriage astrology. From death prophecies to fake remedies, we separate the ancient wisdom from modern superstition.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> March 15, 2026</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 8 min read</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> By NovaVentures AI</span>
          </div>
        </div>

        <Callout type="info">
          <strong>Quick check:</strong> Astro Marriage does a triple-check Mangal Dosha assessment from Lagna, Moon, and Venus — and automatically applies all 15+ cancellation rules. <Link to="/calculator" className="underline">Check your chart free →</Link>
        </Callout>

        <div className="space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Is Mangal Dosha?</h2>
            <p className="mb-4">Mangal Dosha (also called Kuja Dosha or Chevvai Dosham in South India) occurs when Mars (Mangal) is placed in specific houses of the birth chart. Traditionally, these are houses 1, 2, 4, 7, 8, and 12 — though astrologers debate the inclusion of the 2nd house.</p>
            <p>Mars is a planet of energy, aggression, and drive. When placed in houses related to marriage (7th), longevity (8th), or domestic life (4th), it is said to introduce friction, dominance, and conflict into the marital sphere. The effect varies enormously based on Mars's sign, strength, conjunctions, and aspects.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">The 7 Biggest Myths — Debunked</h2>
            <div className="space-y-5">
              {myths.map((item, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-red-50 dark:bg-red-900/20 px-5 py-3 flex items-start gap-3">
                    <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="font-semibold text-red-700 dark:text-red-300 text-sm">Myth #{i + 1}: {item.myth}</p>
                  </div>
                  <div className="px-5 py-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm"><strong className="text-emerald-700 dark:text-emerald-400">Fact:</strong> {item.fact}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">The 15+ Cancellation Rules</h2>
            <p className="mb-4">Classical Vedic texts list numerous conditions that cancel or significantly reduce Mangal Dosha. The most important are:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Both partners have Mangal Dosha (mutual cancellation)',
                'Mars is in its own sign — Aries or Scorpio',
                'Mars is exalted — in Capricorn',
                'Mars is in the 7th for Capricorn or Leo ascendant',
                'Mars is with or aspected by benefic Jupiter',
                'Mars is with Venus — softening its aggression',
                'The 7th lord is also Mars (no conflict of signification)',
                'Mars is in a water sign (Cancer, Scorpio, Pisces) — reduced intensity',
                'Rahu-Mars conjunction in certain houses cancels each other',
                'Marriage after age 28 — Saturn\'s maturation reduces Mars intensity',
              ].map(r => (
                <div key={r} className="flex items-start gap-2 text-sm bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 px-3 py-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  {r}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Should You Worry About Mangal Dosha?</h2>
            <p className="mb-4">In most cases, no. Here's why:</p>
            <p className="mb-4">About 40% of people have Mars in a dosha-causing house from the Lagna alone. When you add Moon and Venus reference points, the percentage rises further. If Mangal Dosha were as catastrophic as feared, roughly half of all marriages would be disasters — which is simply not true in practice.</p>
            <p>The cases where Mangal Dosha genuinely warrants attention are: uncancelled Mars in the 7th or 8th house from ALL three reference points (Lagna, Moon, Venus) simultaneously, with Mars additionally afflicted by Saturn, Rahu, or in its enemy sign, with no benefic aspects. This configuration is rare.</p>
            <Callout type="tip">
              <strong>Modern perspective:</strong> Experienced Vedic astrologers treat Mangal Dosha as one input among many — not a veto. The overall strength of the 7th house, the 7th lord, Venus, and the synastry between charts carries far more weight than the presence or absence of Mangal Dosha alone.
            </Callout>
          </section>

          <section id="faq">
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

        <div className="mt-14 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-center text-white">
          <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-80" />
          <h3 className="text-2xl font-bold mb-2">Check Your Mangal Dosha — Free</h3>
          <p className="text-red-100 mb-6">Triple-check from Lagna, Moon & Venus with all 15+ cancellation rules applied automatically.</p>
          <Link to="/calculator" className="inline-flex items-center gap-2 bg-white text-red-600 font-semibold px-8 py-3 rounded-xl hover:bg-red-50 transition-colors">
            Check Free Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Related Articles</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { to: '/blog/kundali-matching-complete-guide', title: 'Kundali Matching Complete Guide', tag: 'Kundali Matching' },
              { to: '/blog/nadi-dosha-complete-guide', title: 'Nadi Dosha — Complete Guide', tag: 'Doshas' },
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

export default MangalDoshaMythsPage;
