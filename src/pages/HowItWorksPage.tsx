/**
 * How It Works Page
 * Static content page explaining methodology — optimized for GEO (Generative Engine Optimization)
 * AI search engines cite explanatory content with structured facts and methodology
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

import { AISummaryBox } from '../components/ui/AISummaryBox';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
      <SEOHead
        title="How Vedic Kundali Matching Works — Methodology & Calculations"
        description="Learn how Astro Marriage calculates Vedic marriage compatibility using Ashtakoot Milan (36-point scoring), Swiss Ephemeris planetary positions, KP Astrology, Jaimini Chara Karakas, and Dasha-based marriage timing prediction."
        path="/how-it-works"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link to="/self-calculator" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Try Free Analysis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
          How Vedic Kundali Matching Works
        </h1>

        <AISummaryBox
          title="Methodology Overview"
          definition="Astro Marriage uses a multi-layered Vedic engine that cross-validates marriage compatibility using four distinct systems: Parashari (Ashtakoot), KP Astrology, Jaimini, and division-level synastry."
          points={[
            "JPL DE431 Swiss Ephemeris accuracy",
            "KP Sub-lord timing precision",
            "Jaimini Darakaraka spouse profiling",
            "16 divisional charts supported"
          ]}
        />

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
          Astro Marriage uses a multi-system approach combining <strong>Parashari</strong>, <strong>KP Astrology</strong>, and <strong>Jaimini</strong> methodologies to provide the most comprehensive Vedic marriage compatibility analysis available online — completely free.
        </p>

        {/* Methodology authored by */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5 mb-10">
          <p className="text-sm text-indigo-800 dark:text-indigo-300">
            <strong>Methodology basis:</strong> Calculations follow principles from <em>Brihat Parashara Hora Shastra</em> (BPHS), <em>Jataka Parijata</em>, <em>Muhurta Chintamani</em>, and Prof. K.S. Krishnamurti's KP system. Planetary positions computed via Swiss Ephemeris (JPL DE431 accuracy).
          </p>
        </div>

        {/* Section 1: Ashtakoot Milan */}
        <section className="mb-12" id="ashtakoot-milan">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            1. Ashtakoot Milan — 36-Point Compatibility Scoring
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Ashtakoot Milan (also called Gun Milan or Ashta Koota) is the traditional Vedic method that evaluates <strong>8 parameters (Kootas)</strong> between two birth charts, scoring a maximum of <strong>36 points</strong>. A score of 18+ is acceptable, 24+ is good, and 30+ is excellent for marriage.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="text-left px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700">Koota</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700">Points</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700">What It Measures</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b dark:border-gray-700"><td className="px-4 py-3 font-medium">Varna</td><td className="px-4 py-3 text-center">1</td><td className="px-4 py-3">Spiritual & ego compatibility — work ethic and values alignment</td></tr>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"><td className="px-4 py-3 font-medium">Vashya</td><td className="px-4 py-3 text-center">2</td><td className="px-4 py-3">Mutual attraction and dominance — who influences whom in the relationship</td></tr>
                <tr className="border-b dark:border-gray-700"><td className="px-4 py-3 font-medium">Tara</td><td className="px-4 py-3 text-center">3</td><td className="px-4 py-3">Destiny compatibility — health and well-being of the couple after marriage</td></tr>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"><td className="px-4 py-3 font-medium">Yoni</td><td className="px-4 py-3 text-center">4</td><td className="px-4 py-3">Sexual and physical compatibility — intimacy, temperament, and biological harmony</td></tr>
                <tr className="border-b dark:border-gray-700"><td className="px-4 py-3 font-medium">Graha Maitri</td><td className="px-4 py-3 text-center">5</td><td className="px-4 py-3">Mental compatibility — friendship, intellectual connection, and communication</td></tr>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"><td className="px-4 py-3 font-medium">Gana</td><td className="px-4 py-3 text-center">6</td><td className="px-4 py-3">Temperament match — Deva (divine), Manushya (human), or Rakshasa (independent)</td></tr>
                <tr className="border-b dark:border-gray-700"><td className="px-4 py-3 font-medium">Bhakoot</td><td className="px-4 py-3 text-center">7</td><td className="px-4 py-3">Emotional compatibility — love, prosperity, family happiness, and longevity</td></tr>
                <tr><td className="px-4 py-3 font-medium">Nadi</td><td className="px-4 py-3 text-center">8</td><td className="px-4 py-3">Genetic and health compatibility — progeny health and physiological harmony</td></tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Our engine also applies <strong>dosha cancellation rules</strong>: Nadi Dosha cancellation (same Rashi but different Nakshatra), Bhakoot Dosha exceptions (mutual sign lords), and Gana Dosha mitigations — reducing false negatives by up to 40% compared to basic calculators.
          </p>
        </section>

        {/* Section 2: Planetary Calculations */}
        <section className="mb-12" id="planetary-calculations">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            2. Planetary Calculations — Swiss Ephemeris Precision
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Astro Marriage computes exact positions of all <strong>9 Vedic planets (Navagraha)</strong> — Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu — using the <strong>Swiss Ephemeris</strong> library compiled to WebAssembly. This provides JPL DE431-grade accuracy (arc-second precision) for any date from 5400 BC to 5400 AD.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            From these positions, we derive the <strong>Nakshatra</strong> (lunar mansion, 1 of 27), <strong>Pada</strong> (quarter), <strong>Rashi</strong> (zodiac sign), and house placements using the <strong>Placidus house system</strong>. All calculations run client-side in your browser for maximum privacy — no birth data is sent to any server.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Key fact:</strong> We analyze 9 planets across 12 houses, all 27 Nakshatras (108 Padas), and generate Rashi (D1), Navamsa (D9), and other divisional charts — all computed in under 500ms on modern devices.
            </p>
          </div>
        </section>

        {/* Section 3: KP Astrology */}
        <section className="mb-12" id="kp-astrology">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            3. KP Astrology — Krishnamurti Paddhati
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Beyond Parashari, we use <strong>Prof. K.S. Krishnamurti's sub-lord system (KP)</strong> for precise marriage timing. The KP method divides each Nakshatra into 9 unequal sub-divisions (sub-lords), creating a <strong>249-point zodiac map</strong> that dramatically increases timing precision.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li><strong>7th Cuspal Sub Lord (CSL):</strong> The sub-lord of the 7th house cusp determines whether marriage is promised in the chart</li>
            <li><strong>2-7-11 Rule:</strong> If the 7th CSL signifies houses 2, 7, and 11, marriage is strongly indicated</li>
            <li><strong>Ruling Planets:</strong> Real-time calculation to narrow down exact timing windows</li>
            <li><strong>4-fold Significators:</strong> Planet → Star lord → Sub lord → Sign lord analysis chain</li>
          </ul>
        </section>

        {/* Section 4: Jaimini System */}
        <section className="mb-12" id="jaimini-system">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            4. Jaimini System — Spouse Prediction
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            The <strong>Jaimini system</strong> uses degree-based planet ranking (<strong>Chara Karakas</strong>) rather than fixed significations. This is especially powerful for marriage analysis:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li><strong>Darakaraka (DK):</strong> The planet with the lowest degree becomes the significator of your spouse — its sign, Nakshatra, and Navamsa placement describe your partner's nature</li>
            <li><strong>Upapada Lagna (UL):</strong> Calculated from the 12th house lord's placement in Navamsa — reveals marriage stability and the kind of family you marry into</li>
            <li><strong>Chara Dasha:</strong> Jaimini's sign-based Dasha system pinpoints marriage timing with a different lens than Vimshottari</li>
            <li><strong>Vivah Saham:</strong> A mathematically derived sensitive point that activates during marriage-triggering transits</li>
          </ul>
        </section>

        {/* Section 5: Marriage Timing */}
        <section className="mb-12" id="marriage-timing">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            5. Marriage Timing — Multi-System Convergence
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Rather than relying on a single system, we identify <strong>"marriage windows"</strong> where multiple timing methods converge:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li><strong>Vimshottari Dasha:</strong> Venus, 7th lord, or Upapada lord Mahadasha/Antardasha active</li>
            <li><strong>Jupiter Transit:</strong> Jupiter transiting over natal Venus, 7th house, or 7th lord</li>
            <li><strong>Saturn Transit:</strong> Saturn aspecting or transiting marriage-significant houses</li>
            <li><strong>Chara Dasha:</strong> Signs containing or aspecting Darakaraka are running</li>
            <li><strong>Navamsa Confirmation:</strong> D9 chart supports the timing indicated by D1</li>
          </ol>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            When 3 or more of these indicators align, we flag it as a <strong>high-probability marriage window</strong>. This multi-system convergence approach is far more reliable than single-method predictions.
          </p>
        </section>

        {/* Section 6: Beyond Compatibility Score */}
        <section className="mb-12" id="advanced-analysis">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            6. Beyond the Score — Advanced Analysis
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            A high Ashtakoot score alone doesn't guarantee a happy marriage. Astro Marriage goes further with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Mangal Dosha Analysis:</strong> Mars placement in 1st, 4th, 7th, 8th, or 12th house with 15+ cancellation rules applied</li>
            <li><strong>Synastry (Cross-Chart):</strong> Jupiter-Moon aspects (soulmate indicators), Saturn connections (karmic bonds), Venus-Mars interplay (attraction)</li>
            <li><strong>Risk Assessment:</strong> 6th/8th/12th house afflictions, separative planet analysis for divorce/infidelity risk factors</li>
            <li><strong>Navamsa Matching:</strong> D9 chart comparison following V.P. Goel's 4-step method for deep compatibility</li>
            <li><strong>Personalized Remedies:</strong> Gemstone recommendations, Lal Kitab remedies, and mantra guidance based on specific planetary afflictions</li>
          </ul>
        </section>

        {/* Classical References */}
        <section className="mb-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700" id="references">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Classical References & Sources
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li><em>Brihat Parashara Hora Shastra</em> — Maharishi Parashara (foundation of Parashari astrology)</li>
            <li><em>Jataka Parijata</em> — Vaidyanatha Dikshita (marriage compatibility principles)</li>
            <li><em>Muhurta Chintamani</em> — Daivagna Rama (electional astrology for marriage timing)</li>
            <li><em>Krishnamurti Paddhati Reader</em> — Prof. K.S. Krishnamurti (KP sub-lord system)</li>
            <li><em>Jaimini Sutras</em> — Maharishi Jaimini (Chara Karakas, Upapada Lagna)</li>
            <li><em>Lal Kitab</em> — Pt. Roop Chand Joshi (remedial measures)</li>
            <li><strong>Swiss Ephemeris</strong> — Astrodienst AG (JPL DE431 planetary computation)</li>
          </ul>
        </section>

        {/* CTA */}
        <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ready to Try?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">All features are completely free — no sign-up required for basic analysis.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/self-calculator" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-lg transition-all">
              Analyze My Chart <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/calculator" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-full border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
              Check Compatibility <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2025 Astro Marriage by NovaVentures AI. Vedic astrology for the modern seeker.</p>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorksPage;
