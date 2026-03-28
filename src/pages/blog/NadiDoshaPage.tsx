import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { BookOpen, ChevronRight, Clock, Calendar, ArrowRight, Shield } from 'lucide-react';

const Callout: React.FC<{ type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }> = ({ type = 'info', children }) => {
  const styles = {
    info: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200',
    tip: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200',
  };
  return <div className={`border-l-4 rounded-r-xl px-5 py-4 my-6 text-sm leading-relaxed ${styles[type]}`}>{children}</div>;
};

export const NadiDoshaPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const nadis = [
    { name: 'Vata Nadi', nakshatras: 'Ashwini, Ardra, Punarvasu, Uttara Phalguni, Hasta, Jyeshta, Mula, Shatabhisha, Purva Bhadrapada', element: 'Air', traits: 'Quick, creative, restless, sensitive nervous system' },
    { name: 'Pitta Nadi', nakshatras: 'Bharani, Mrigashirsha, Pushya, Purva Phalguni, Chitra, Anuradha, Purva Ashadha, Dhanishta, Uttara Bhadrapada', element: 'Fire', traits: 'Intense, ambitious, sharp intellect, prone to inflammation' },
    { name: 'Kapha Nadi', nakshatras: 'Krittika, Rohini, Ashlesha, Magha, Swati, Vishakha, Uttara Ashadha, Shravana, Revati', element: 'Water/Earth', traits: 'Stable, nurturing, methodical, prone to congestion' },
  ];

  const cancellations = [
    'Both partners have the same Rashi (Moon sign) — same Nadi but same Rashi cancels the dosha',
    'Both partners have the same Nakshatra but different Padas (quarters) — partial cancellation',
    'The Nadi lord is the same as the 7th lord in either chart',
    'The Nadi lord is exalted or in own sign in both charts',
    'Both partners share the same Nakshatra lord — the commonality of ruler overrides the Nadi concern',
  ];

  const faqs = [
    { q: 'Is Nadi dosha the most serious dosha in Kundali matching?', a: 'Yes — Nadi carries 8 out of 36 points, the highest single Koota weight. Zero points in Nadi (same Nadi = Nadi dosha) is considered the most serious individual Koota failure. However, like all doshas, it has cancellation rules.' },
    { q: 'Can a couple with Nadi dosha have children?', a: 'Classical texts associate uncancelled Nadi dosha with child health concerns or difficulty in conception. However, this is one classical indicator among many — thousands of couples with Nadi dosha have healthy children. Other chart factors (5th house, Jupiter, Moon) carry more weight for fertility.' },
    { q: 'What if both partners are Pitta Nadi?', a: 'Same-Nadi (both Pitta, both Vata, or both Kapha) is Nadi dosha. The concern is about temperamental and biological "sameness" that classical texts associate with incompatibility. The same-Rashi cancellation rule may apply if both also share the same Moon sign.' },
    { q: 'How common is Nadi dosha?', a: 'Each Nadi covers roughly 9 Nakshatras out of 27 — so each Nadi represents about 1/3 of the population. The probability that any two random people share the same Nadi is approximately 33%. However, same Rashi often comes with same Nadi for adjacent Nakshatras, which triggers the cancellation rule.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOHead
        title="Nadi Dosha Complete Guide — Effects, Cancellation Rules & Remedies | Astro Marriage"
        description="Complete guide to Nadi Dosha in Kundali matching. What the 3 Nadis mean, why same-Nadi marriage is discouraged, 5 cancellation rules, and what modern astrologers say."
        path="/blog/nadi-dosha-complete-guide"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Nadi Dosha Complete Guide — Effects, Cancellation Rules & Remedies',
          author: { '@type': 'Organization', name: 'NovaVentures AI' },
          publisher: { '@type': 'Organization', name: 'Astro Marriage', url: 'https://marriage-astro.vercel.app' },
          datePublished: '2026-02-28',
          url: 'https://marriage-astro.vercel.app/blog/nadi-dosha-complete-guide',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-700 dark:text-gray-200 truncate">Nadi Dosha Complete Guide</span>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-10">
          <span className="inline-block bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">Doshas</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 leading-tight mb-4">
            Nadi Dosha Complete Guide — Effects, Cancellation Rules & What Modern Astrologers Say
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Nadi Dosha carries the highest weight in Kundali matching (8/36 points) and is one of the most feared — yet most misunderstood — doshas in Vedic marriage astrology.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> February 28, 2026</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 7 min read</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> By NovaVentures AI</span>
          </div>
        </div>

        <div className="space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Is Nadi Dosha?</h2>
            <p className="mb-4">Nadi Dosha occurs when both partners in a Kundali match belong to the same Nadi — the same constitutional body type in Ayurvedic medicine. The Nadi system divides all 27 Nakshatras into three groups: Vata, Pitta, and Kapha — each representing a distinct biological and temperamental type.</p>
            <p>The classical concern is that same-Nadi partners share the same constitutional "frequency," which Vedic texts associate with potential health issues for offspring, incompatibility in physical constitution, and genetic similarity that may create imbalance in the marriage. In modern biological terms, some researchers have drawn parallels to genetic compatibility studies, though no scientific validation exists.</p>
            <Callout type="warning">
              <strong>Weight in Ashtakoot:</strong> Nadi carries 8 points — the highest of all 8 Kootas. Same-Nadi = 0 points (Nadi dosha). Different Nadi = full 8 points. This makes it the single most impactful individual Koota in the 36-point system.
            </Callout>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">The Three Nadis Explained</h2>
            <div className="space-y-4">
              {nadis.map(n => (
                <div key={n.name} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {n.element[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{n.name} <span className="text-sm font-normal text-gray-500">({n.element})</span></h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2"><strong>Traits:</strong> {n.traits}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500"><strong>Nakshatras:</strong> {n.nakshatras}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">The 5 Nadi Dosha Cancellation Rules</h2>
            <p className="mb-4">Classical texts provide several conditions that cancel or neutralize Nadi Dosha. When any of these apply, the dosha is considered absent or significantly reduced:</p>
            <div className="space-y-3">
              {cancellations.map((c, i) => (
                <div key={i} className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-4 py-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-sm">{c}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Scientific Perspective</h2>
            <p className="mb-4">The Nadi system predates modern genetics by millennia, but some researchers have noted interesting parallels. Same-Nadi partners share the same Ayurvedic constitutional type — and there is some evidence that people with similar constitutional types (particularly Pitta-Pitta) may experience heightened conflict due to similar stress responses and temperamental intensity.</p>
            <p>However, no peer-reviewed study has validated the specific Nadi-based predictions for offspring health or marital outcomes. Modern Vedic astrologers tend to treat Nadi dosha as one significant factor in a holistic analysis rather than a decisive veto.</p>
            <Callout type="tip">
              <strong>Practical approach:</strong> Check Nadi Dosha first in any Kundali match — if it exists, immediately check the 5 cancellation rules. If no cancellation applies, look at the overall chart synastry, KP compatibility, and Dasha timing before making a judgment. A low Ashtakoot score with no Nadi dosha often outperforms a high score with uncancelled Nadi dosha.
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

        <div className="mt-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-center text-white">
          <Shield className="w-10 h-10 mx-auto mb-3 opacity-80" />
          <h3 className="text-2xl font-bold mb-2">Check Nadi Dosha in Your Match</h3>
          <p className="text-orange-100 mb-6">Full Ashtakoot analysis with all dosha cancellation rules applied — free and instant.</p>
          <Link to="/calculator" className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors">
            Check Free Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Related Articles</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { to: '/blog/mangal-dosha-myths-facts', title: 'Mangal Dosha: 7 Myths vs Facts', tag: 'Doshas' },
              { to: '/blog/kundali-matching-complete-guide', title: 'Kundali Matching Complete Guide', tag: 'Kundali Matching' },
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

export default NadiDoshaPage;
