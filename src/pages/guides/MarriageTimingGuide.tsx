/**
 * Marriage Timing Guide
 * Static content page for GEO — targets "when will I get married astrology" AI queries
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';

export const MarriageTimingGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
      <SEOHead
        title="Marriage Timing Prediction in Vedic Astrology — Dasha, Transit & KP Methods"
        description="Learn how Vedic astrology predicts marriage timing using Vimshottari Dasha, Jupiter-Saturn transits, KP sub-lords, Jaimini Chara Dasha, and Navamsa analysis. Understand marriage windows and when you are likely to get married."
        path="/guides/marriage-timing"
      />

      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <Link to="/self-calculator" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Check My Timing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:underline">Home</Link> &gt; <Link to="/how-it-works" className="hover:underline">How It Works</Link> &gt; <span className="text-gray-800 dark:text-gray-200">Marriage Timing</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
          How Vedic Astrology Predicts Marriage Timing
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
          "When will I get married?" is the most asked question in Vedic astrology. The answer lies in the convergence of <strong>Dasha periods</strong>, <strong>planetary transits</strong>, and <strong>divisional chart activations</strong>. Here's exactly how astrologers — and Astro Marriage — determine your marriage timing windows.
        </p>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5 mb-10">
          <p className="text-sm text-indigo-800 dark:text-indigo-300">
            <strong>Source:</strong> Marriage timing principles are drawn from <em>Brihat Parashara Hora Shastra</em> (Chapter 20, Marriage), <em>Uttara Kalamrita</em> by Kalidasa, and <em>Krishnamurti Paddhati Reader</em> (Vol. III — Marriage) by Prof. K.S. Krishnamurti.
          </p>
        </div>

        {/* Section 1: Key Houses */}
        <section className="mb-12" id="key-houses">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            The Marriage Houses: 2nd, 7th, and 11th
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            In Vedic astrology, three houses are primarily responsible for marriage:
          </p>
          <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-4">
            <li><strong>7th House:</strong> The primary house of marriage, partnership, and spouse. The 7th lord's condition, aspects, and Dasha are the single most important factor in marriage timing.</li>
            <li><strong>2nd House:</strong> The house of family and kutumb (household). Marriage creates a new family unit, so 2nd house activation often accompanies marriage.</li>
            <li><strong>11th House:</strong> The house of fulfillment of desires and gains. Marriage is one of life's major fulfilled desires, and the 11th lord's involvement confirms timing.</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Key significators:</strong> Venus (natural significator of marriage for males), Jupiter (for females), and the 7th lord from the Ascendant, Moon, and Venus.
          </p>
        </section>

        {/* Section 2: Vimshottari Dasha */}
        <section className="mb-12" id="vimshottari-dasha">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Method 1: Vimshottari Dasha System
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            The Vimshottari Dasha is a <strong>120-year planetary period cycle</strong> based on the Moon's Nakshatra at birth. Each planet rules a specific period (Sun: 6 years, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17, Ketu: 7, Venus: 20). Within each Mahadasha, sub-periods (Antardasha) create precise timing windows.
          </p>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Marriage-Triggering Dashas</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li><strong>Venus Mahadasha or Antardasha:</strong> Venus rules love, attraction, and marriage. Its period is the most common marriage trigger.</li>
            <li><strong>7th Lord Mahadasha/Antardasha:</strong> When the ruler of your 7th house runs its period, marriage becomes highly probable.</li>
            <li><strong>Jupiter Dasha (for women):</strong> Jupiter as the natural significator of husband makes its period favorable for women's marriage.</li>
            <li><strong>Rahu-Venus or Rahu-Jupiter:</strong> Rahu amplifies the energy of its co-period planet, often bringing sudden marriage opportunities.</li>
            <li><strong>Planets in or aspecting the 7th house:</strong> Their Dasha/Antardasha activates the marriage promise.</li>
          </ul>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Example:</strong> If your 7th lord is Jupiter and you're running Jupiter Mahadasha → Venus Antardasha (Jupiter-Venus period), and Jupiter is also aspecting your Navamsa 7th house, this creates a very strong marriage window — especially if transit Jupiter is simultaneously passing over your natal Venus.
            </p>
          </div>
        </section>

        {/* Section 3: Transits */}
        <section className="mb-12" id="transits">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Method 2: Jupiter and Saturn Transits
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Dashas indicate <strong>when</strong> the possibility opens; transits determine <strong>when it actually materializes</strong>. The two slow-moving planets — Jupiter (12-year cycle) and Saturn (29.5-year cycle) — are the primary transit triggers:
          </p>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Jupiter Transit (Guru Gochar)</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li>Jupiter transiting over natal Venus — activates love and marriage</li>
            <li>Jupiter transiting the 7th house — opens partnership opportunities</li>
            <li>Jupiter transiting over the 7th lord — empowers the marriage significator</li>
            <li>Jupiter aspecting the 7th house from the 1st, 5th, or 9th house</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Saturn Transit (Shani Gochar)</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li>Saturn transiting the 7th house — commitment and formalization of relationships</li>
            <li>Saturn aspecting the 7th house (3rd, 7th, 10th aspect) — creates responsibility toward partnership</li>
            <li>Saturn's transit over Upapada Lagna — activates the marriage indicator in Jaimini system</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Key principle:</strong> When Jupiter's blessing (opportunity) and Saturn's structure (commitment) both touch marriage houses simultaneously during a favorable Dasha, marriage is almost certain.
          </p>
        </section>

        {/* Section 4: KP Method */}
        <section className="mb-12" id="kp-method">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Method 3: KP Astrology — Sub-Lord Precision
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Prof. Krishnamurti's system provides the most precise timing by using the <strong>Sub-Lord of the 7th cusp</strong>:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300 mb-4">
            <li><strong>Step 1 — Is marriage promised?</strong> Check if the 7th Cuspal Sub Lord (CSL) signifies houses 2, 7, or 11. If yes, marriage is in the chart.</li>
            <li><strong>Step 2 — When?</strong> Find the Dasha-Bhukti-Antara sequence where all three running planets are significators of houses 2, 7, and 11.</li>
            <li><strong>Step 3 — Confirm with Ruling Planets:</strong> At the moment of analysis, the Day Lord, Moon's Sign Lord, Moon's Star Lord, Moon's Sub Lord, and Ascendant's Star Lord form the Ruling Planets. The event will happen when Dasha planets match these Ruling Planets.</li>
          </ol>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            KP's 249-point sub-lord division can narrow timing to <strong>specific months</strong>, far more precise than Parashari Dasha alone.
          </p>
        </section>

        {/* Section 5: Jaimini */}
        <section className="mb-12" id="jaimini-timing">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Method 4: Jaimini Chara Dasha
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            The Jaimini system uses <strong>sign-based Dashas</strong> (Chara Dasha) instead of planet-based ones. Marriage timing involves:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li><strong>Darakaraka (DK) sign:</strong> When the sign containing your DK (planet with lowest degree) runs its Dasha or sub-Dasha</li>
            <li><strong>Upapada Lagna (UL) sign:</strong> When the sign of your UL or signs aspecting it are activated</li>
            <li><strong>7th from Karakamsha:</strong> The 7th sign from Atmakaraka's Navamsa placement</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Jaimini provides an <strong>independent cross-check</strong>. When both Vimshottari and Chara Dasha point to the same period, confidence in the timing increases significantly.
          </p>
        </section>

        {/* Section 6: Navamsa */}
        <section className="mb-12" id="navamsa">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Method 5: Navamsa (D9) Confirmation
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            The Navamsa chart (D9) is called the "chart of marriage" — no marriage prediction is complete without it:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li>The 7th lord of D1 should be well-placed in D9 for marriage to materialize</li>
            <li>Venus in D9 should not be combust, debilitated, or in the 6th/8th/12th house</li>
            <li>The Navamsa Ascendant lord's Dasha can trigger marriage</li>
            <li>Planets that are Vargottama (same sign in D1 and D9) gain extra strength for marriage timing</li>
          </ul>
        </section>

        {/* Section 7: Convergence */}
        <section className="mb-10 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700" id="convergence">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            The Convergence Method (What Astro Marriage Uses)
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Rather than relying on any single method, Astro Marriage identifies periods where <strong>3 or more systems agree</strong>:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li>Favorable Vimshottari Dasha/Antardasha running (2-7-11 significators)</li>
            <li>Jupiter transiting a marriage house or significator</li>
            <li>Saturn aspecting or transiting marriage houses</li>
            <li>Chara Dasha activating DK or UL sign</li>
            <li>D9 chart supporting the timing</li>
          </ol>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            When multiple methods converge on the same 6–12 month window, it is flagged as a <strong>"high-probability marriage window"</strong> in your report. This multi-system approach provides significantly higher accuracy than any single technique.
          </p>
        </section>

        {/* Delays */}
        <section className="mb-10" id="delays">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Common Causes of Marriage Delays
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Saturn aspecting the 7th house:</strong> Delays marriage until Saturn's lesson is learned (maturity, responsibility)</li>
            <li><strong>Mangal Dosha:</strong> Mars in 1st, 4th, 7th, 8th, or 12th house can delay until late 20s–30s</li>
            <li><strong>Rahu/Ketu on the 1-7 axis:</strong> Creates confusion in partner selection, multiple relationships before settling</li>
            <li><strong>Weak Venus or 7th lord:</strong> Combustion, debilitation, or retrograde of marriage significators</li>
            <li><strong>Running Ketu or Saturn Mahadasha:</strong> These periods often delay or create obstacles to marriage</li>
          </ul>
        </section>

        {/* CTA */}
        <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Find Your Marriage Window</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Get your personalized marriage timing prediction using all 5 methods — completely free.</p>
          <Link to="/self-calculator" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-lg transition-all">
            Predict My Marriage Timing <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </article>

      <footer className="py-6 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2025 Astro Marriage by NovaVentures AI. Based on classical Vedic astrology texts.</p>
        </div>
      </footer>
    </div>
  );
};

export default MarriageTimingGuide;
