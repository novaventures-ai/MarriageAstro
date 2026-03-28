import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { BookOpen, ChevronRight, Clock, Calendar, ArrowRight, CheckCircle, AlertCircle, Star, Heart, Sparkles } from 'lucide-react';

const TOC = [
  { id: 'what-is', label: 'What Is Kundali Matching?' },
  { id: 'eight-kootas', label: 'The 8 Kootas Explained' },
  { id: 'scoring', label: 'How Scores Are Interpreted' },
  { id: 'beyond', label: 'Beyond Ashtakoot — What Else Matters' },
  { id: 'mistakes', label: 'Common Mistakes Families Make' },
  { id: 'technology', label: 'How Technology Changed Kundali Matching' },
  { id: 'faq', label: 'Frequently Asked Questions' },
];

const Callout: React.FC<{ type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }> = ({ type = 'info', children }) => {
  const styles = {
    info: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200',
    tip: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200',
  };
  return (
    <div className={`border-l-4 rounded-r-xl px-5 py-4 my-6 text-sm leading-relaxed ${styles[type]}`}>
      {children}
    </div>
  );
};

export const KundaliMatchingGuidePage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Is 18/36 score enough to get married?',
      a: '18/36 is the traditional minimum threshold. However, astrologers consider it borderline — a score of 24+ is considered good, and 30+ is excellent. More importantly, Nadi and Bhakoot doshas should be checked even if the total score is acceptable.',
    },
    {
      q: 'Can Kundali matching predict love marriage success?',
      a: 'Kundali matching applies equally to arranged and love marriages. The birth charts don\'t change based on how the couple met. However, modern astrologers often weigh synastry (cross-chart planetary interactions) more heavily for love marriages.',
    },
    {
      q: 'What if Nadi dosha is present but the score is high?',
      a: 'Nadi dosha (same Nadi = 0 points out of 8) is considered the most serious individual dosha. Even with a high total score, uncancelled Nadi dosha traditionally raises concerns about health and progeny. Check for the 5 classical cancellation rules.',
    },
    {
      q: 'Do all Hindu communities use Ashtakoot matching?',
      a: 'Ashtakoot (8-factor matching with 36 points) is primarily used in North India. South Indian communities use the Dasha Porutham system (10 factors) instead. Both systems assess compatibility but from different angles.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEOHead
        title="Kundali Matching Complete Guide — 36-Point System Explained | Astro Marriage"
        description="Complete guide to Kundali matching: how Ashtakoot Milan works, what each of the 8 Kootas means, how scores are interpreted, and what modern astrology adds beyond the basics."
        path="/blog/kundali-matching-complete-guide"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Kundali Matching Complete Guide — The 36-Point System Explained',
          description: 'A comprehensive guide to understanding Vedic Kundali matching, the 8 Kootas, score interpretation, and modern enhancements.',
          author: { '@type': 'Organization', name: 'NovaVentures AI' },
          publisher: { '@type': 'Organization', name: 'Astro Marriage', url: 'https://marriage-astro.vercel.app' },
          datePublished: '2026-03-20',
          url: 'https://marriage-astro.vercel.app/blog/kundali-matching-complete-guide',
        }}
      />

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-700 dark:text-gray-200 truncate">Kundali Matching Complete Guide</span>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">Kundali Matching</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 leading-tight mb-4">
            Kundali Matching Complete Guide — The 36-Point System Explained
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Everything you need to know about Ashtakoot Milan: how the 8 Kootas work, what the scores actually mean, and what modern Vedic astrology adds beyond the traditional system.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> March 20, 2026</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 12 min read</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> By NovaVentures AI</span>
          </div>
        </div>

        {/* TOC */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-10">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Table of Contents</h2>
          <ol className="space-y-2">
            {TOC.map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                  <span className="text-gray-400 font-mono text-xs w-5">{i + 1}.</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Body */}
        <div className="prose-container space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed">

          <section id="what-is">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Is Kundali Matching?</h2>
            <p className="mb-4">Kundali matching — also called Gun Milan, Horoscope matching, or Ashtakoot Milan — is a Vedic astrology method used to assess the compatibility of two individuals for marriage. It works by comparing their birth charts (Kundalis) across eight specific parameters called Kootas or Gunas, producing a score out of 36 points.</p>
            <p className="mb-4">The practice is rooted in the Brihat Parashara Hora Shastra, one of the foundational texts of Vedic astrology written by Maharishi Parashara. The system was designed to ensure long-term happiness, health, and harmony in marriage — not just romantic attraction.</p>
            <p>Unlike Western sun-sign compatibility, Kundali matching uses the Moon sign (Rashi) and Nakshatra (lunar mansion) as its primary reference points. This makes it highly precise — the Moon changes sign every 2.5 days, so two people born on the same day but hours apart can have very different compatibility scores.</p>
            <Callout type="info">
              <strong>Key fact:</strong> Kundali matching only analyzes the Moon's position at birth, not the entire chart. A complete marriage compatibility analysis requires full chart synastry, KP analysis, Jaimini Darakaraka, and dasha timing — which is what tools like Astro Marriage provide.
            </Callout>
          </section>

          <section id="eight-kootas">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">The 8 Kootas Explained</h2>
            <p className="mb-6">Each Koota assesses a different dimension of compatibility. Together they cover temperament, health, sexual compatibility, emotional connection, and prosperity.</p>
            <div className="space-y-4">
              {[
                { name: '1. Varna (1 point)', desc: 'Assesses spiritual and ego compatibility. Divided into 4 castes symbolically — Brahmin, Kshatriya, Vaishya, Shudra. The groom\'s Varna should be equal to or higher than the bride\'s.' },
                { name: '2. Vashya (2 points)', desc: 'Measures the degree of mutual attraction and control between partners. Signs are categorized as Human, Quadruped, Aquatic, Feral, and Insect types.' },
                { name: '3. Tara (3 points)', desc: 'Tara (star) compatibility analyzes the health and longevity implications of the match. Calculated by counting Nakshatras from one partner\'s birth star to the other\'s and dividing by 9.' },
                { name: '4. Yoni (4 points)', desc: 'Represents sexual compatibility. Each Nakshatra is assigned one of 14 animal symbols (yoni). Same-yoni pairs score full points; hostile animals score 0.' },
                { name: '5. Graha Maitri (5 points)', desc: 'Tests mental compatibility and emotional friendship. Based on the relationship between the Moon sign lords of both partners — whether they are friends, neutral, or enemies.' },
                { name: '6. Gana (6 points)', desc: 'Assesses behavioral and temperamental compatibility. Nakshatras are categorized as Deva (divine), Manushya (human), or Rakshasa (demonic). Deva-Deva and Manushya-Manushya are ideal.' },
                { name: '7. Bhakoot (7 points)', desc: 'The most complex Koota — measures the positioning of one Moon sign relative to the other. Certain positions (6/8 or 2/12 relationships) indicate serious challenges to health and prosperity.' },
                { name: '8. Nadi (8 points)', desc: 'The highest-weighted Koota. Tests genetic and health compatibility. Three Nadis — Vata, Pitta, Kapha — represent body constitution. Same-Nadi couples score 0 and face concerns about child health.' },
              ].map(k => (
                <div key={k.name} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{k.name}</h3>
                  <p className="text-sm">{k.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="scoring">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How Scores Are Interpreted</h2>
            <p className="mb-4">The maximum possible score is 36 points. Here is the traditional interpretation scale:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {[
                { range: '0 – 17', label: 'Not Recommended', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
                { range: '18 – 23', label: 'Acceptable (Borderline)', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                { range: '24 – 29', label: 'Good Match', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                { range: '30 – 36', label: 'Excellent Match', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
              ].map(s => (
                <div key={s.range} className={`${s.bg} rounded-xl p-4 flex items-center gap-3`}>
                  <Star className={`w-5 h-5 flex-shrink-0 ${s.color}`} />
                  <div>
                    <div className={`font-bold ${s.color}`}>{s.range} points</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <Callout type="warning">
              <strong>Important:</strong> A high total score doesn't automatically make a match auspicious. Individual doshas in Nadi (8 pts) and Bhakoot (7 pts) are considered major afflictions even when the total exceeds 18. Always check these two Kootas separately.
            </Callout>
          </section>

          <section id="beyond">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Beyond Ashtakoot — What Else Matters</h2>
            <p className="mb-4">Ashtakoot Milan was designed as a quick compatibility screening tool — not a complete marriage analysis. Classical texts like the Muhurta Chintamani explicitly state that a high Ashtakoot score doesn't guarantee a happy marriage if the full charts show deep incompatibilities.</p>
            <p className="mb-4">A complete Vedic marriage analysis should include:</p>
            <ul className="space-y-3 mb-4">
              {[
                'Mangal Dosha assessment (triple-check from Lagna, Moon, and Venus)',
                'Full synastry — cross-chart house overlays for 9 planets',
                'KP 7th Cusp Sub Lord analysis for marriage promise',
                'Jaimini Darakaraka for spouse prediction',
                'Vimshottari Dasha timing for marriage windows',
                'Navamsa (D9) chart — the primary marriage chart',
                'Divorce risk indicators (7th lord, separative planets, dusthana placements)',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>This is exactly what <Link to="/calculator" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Astro Marriage</Link> provides — 19+ analysis modules that go far beyond basic Ashtakoot scoring.</p>
          </section>

          <section id="mistakes">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Common Mistakes Families Make</h2>
            <div className="space-y-4">
              {[
                { mistake: 'Rejecting a match only because the score is below 18', fix: 'A score of 16-17 with no major doshas and strong synastry can outperform a score of 26 with Nadi + Bhakoot dosha.' },
                { mistake: 'Not checking dosha cancellation rules', fix: 'Nadi dosha has 5 cancellation rules. Bhakoot dosha has 4. Many "incompatible" matches are actually fine once cancellations are applied.' },
                { mistake: 'Ignoring the Navamsa (D9) chart', fix: 'The D9 is the most important chart for marriage quality. A strong D9 can compensate for a mediocre Ashtakoot score.' },
                { mistake: 'Using only Moon sign, not Nakshatra', fix: 'Two people with the same Moon sign but different Nakshatras can have very different Yoni and Nadi scores. Always use precise Nakshatra data.' },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">{item.mistake}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300"><strong className="text-emerald-600 dark:text-emerald-400">Better approach:</strong> {item.fix}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="technology">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How Technology Has Changed Kundali Matching</h2>
            <p className="mb-4">Traditional Kundali matching required an astrologer to manually calculate Nakshatras from an ephemeris, apply Koota tables, and check dosha cancellations — a process that could take hours and was prone to calculation errors.</p>
            <p className="mb-4">Modern tools like Astro Marriage use <strong>Swiss Ephemeris</strong> (the same engine used by professional astronomers), compiled to WebAssembly and running entirely in your browser. This means arc-second precision for every planetary position — far more accurate than manual ephemeris lookups or older software.</p>
            <p className="mb-4">Beyond accuracy, technology has enabled entirely new analysis dimensions that classical texts described but astrologers couldn't practically compute: full lifetime Dasha scans for vulnerability windows, 14×14 Yoni compatibility matrices, 249-point KP sub-lord chains, and multi-partner AI ranking.</p>
            <Callout type="tip">
              <strong>Try it free:</strong> Astro Marriage runs Swiss Ephemeris calculations entirely client-side. Your birth data never leaves your browser. <Link to="/calculator" className="underline font-medium">Run your free Kundali analysis →</Link>
            </Callout>
          </section>

          <section id="faq">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">{faq.q}</span>
                    <span className="text-indigo-500 ml-4 flex-shrink-0">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-300">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <Heart className="w-10 h-10 mx-auto mb-3 opacity-80" />
          <h3 className="text-2xl font-bold mb-2">Ready to Check Your Kundali?</h3>
          <p className="text-indigo-100 mb-6">Free 36-point Ashtakoot + 19 advanced analysis modules. No signup required.</p>
          <Link to="/calculator" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
            Try Free Kundali Analysis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Related Articles</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { to: '/blog/mangal-dosha-myths-facts', title: 'Mangal Dosha: 7 Myths vs Facts', tag: 'Doshas' },
              { to: '/blog/when-will-i-get-married-astrology', title: 'When Will I Get Married? Astrology Answers', tag: 'Marriage Timing' },
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

export default KundaliMatchingGuidePage;
