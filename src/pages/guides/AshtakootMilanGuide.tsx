/**
 * Ashtakoot Milan Deep Guide
 * Static content page for GEO — targets "what is ashtakoot milan" AI queries
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';

export const AshtakootMilanGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
      <SEOHead
        title="Ashtakoot Milan — Complete Guide to 36-Point Kundali Matching"
        description="Complete guide to Ashtakoot Milan (Gun Milan) for marriage compatibility. Learn about all 8 Kootas — Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi — scoring rules, dosha cancellations, and what each koota means for your marriage."
        path="/guides/ashtakoot-milan"
      />

      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <Link to="/calculator" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Try Free Matching <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:underline">Home</Link> &gt; <Link to="/how-it-works" className="hover:underline">How It Works</Link> &gt; <span className="text-gray-800 dark:text-gray-200">Ashtakoot Milan</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
          Ashtakoot Milan: The Complete Guide to Vedic Kundali Matching
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
          Ashtakoot Milan (literally "eight-group comparison") is the cornerstone of Vedic marriage compatibility. It systematically evaluates <strong>8 dimensions</strong> of a couple's compatibility by comparing the Moon's Nakshatra (lunar mansion) and Rashi (zodiac sign) in both birth charts, scoring a maximum of <strong>36 points</strong>.
        </p>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5 mb-10">
          <p className="text-sm text-indigo-800 dark:text-indigo-300">
            <strong>Source:</strong> The Ashtakoot system is described in <em>Muhurta Chintamani</em> by Daivagna Rama and further elaborated in <em>Brihat Parashara Hora Shastra</em>. It is the most widely used marriage matching system in North Indian Vedic astrology.
          </p>
        </div>

        {/* Koota 1: Varna */}
        <section className="mb-10" id="varna">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">1. Varna Koota — Spiritual Compatibility (1 Point)</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            Varna classifies the Moon sign into four spiritual temperaments: <strong>Brahmin</strong> (Cancer, Scorpio, Pisces — water signs), <strong>Kshatriya</strong> (Aries, Leo, Sagittarius — fire signs), <strong>Vaishya</strong> (Taurus, Virgo, Capricorn — earth signs), and <strong>Shudra</strong> (Gemini, Libra, Aquarius — air signs).
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            <strong>Scoring rule:</strong> The groom's Varna should be equal to or higher than the bride's. The hierarchy is Brahmin &gt; Kshatriya &gt; Vaishya &gt; Shudra. If the condition is met, 1 point is awarded.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>What it means:</strong> Varna measures ego compatibility and work ethic. A matched Varna suggests similar value systems and spiritual outlook, reducing friction in daily life decisions.
          </p>
        </section>

        {/* Koota 2: Vashya */}
        <section className="mb-10" id="vashya">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">2. Vashya Koota — Mutual Attraction & Dominance (2 Points)</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            Vashya classifies signs into 5 groups: <strong>Dwipad</strong> (human — Gemini, Virgo, Libra, first half Sagittarius, Aquarius), <strong>Chatushpad</strong> (quadruped — Aries, Taurus, second half Sagittarius, first half Capricorn), <strong>Jalachar</strong> (aquatic — Cancer, second half Capricorn, Pisces), <strong>Vanchar</strong> (wild — Leo), and <strong>Keet</strong> (insect — Scorpio).
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Scoring:</strong> Same group = 2 points, one controls the other = 1 point, food relationship = 0.5 points, no connection = 0 points. This koota determines who will have more influence in the relationship and whether both partners feel naturally attracted and magnetically drawn to each other.
          </p>
        </section>

        {/* Koota 3: Tara */}
        <section className="mb-10" id="tara">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">3. Tara Koota — Destiny & Health (3 Points)</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            Tara is calculated by counting the Nakshatra of one partner from the other's Nakshatra and dividing by 9. The remainder determines the Tara group: <strong>Janma</strong> (1), <strong>Sampat</strong> (2), <strong>Vipat</strong> (3), <strong>Kshema</strong> (4), <strong>Pratyari</strong> (5), <strong>Sadhaka</strong> (6), <strong>Vadha</strong> (7), <strong>Mitra</strong> (8), <strong>Ati-Mitra</strong> (0/9).
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Scoring:</strong> Remainders 1, 2, 4, 6, 8, 9 are auspicious (3 points if both partners have auspicious Taras). Remainders 3, 5, 7 are inauspicious. This measures the couple's destiny trajectory — will their life paths support or hinder each other's health and fortune after marriage?
          </p>
        </section>

        {/* Koota 4: Yoni */}
        <section className="mb-10" id="yoni">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">4. Yoni Koota — Sexual & Physical Compatibility (4 Points)</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            Each Nakshatra is assigned one of <strong>14 animal yonis</strong>: Horse (Ashwa), Elephant (Gaja), Sheep (Mesha), Serpent (Sarpa), Dog (Shwan), Cat (Marjar), Rat (Mushak), Cow (Gau), Buffalo (Mahish), Tiger (Vyaghra), Deer (Mriga), Monkey (Vanar), Lion (Simha), and Mongoose (Nakul).
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            <strong>Scoring:</strong> Same yoni = 4 points, friendly yonis = 3, neutral = 2, enemy = 1, sworn enemies = 0. The 14x14 yoni compatibility matrix is used for scoring.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>What it measures:</strong> Yoni is the most important indicator of <strong>sexual compatibility, intimacy drive, and physical chemistry</strong>. Each animal yoni has specific characteristics regarding sexual drive, duration, and needs. Matching yonis indicates natural physical harmony between partners.
          </p>
        </section>

        {/* Koota 5: Graha Maitri */}
        <section className="mb-10" id="graha-maitri">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">5. Graha Maitri Koota — Mental Compatibility (5 Points)</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            Graha Maitri compares the <strong>lords of the Moon signs</strong> of both partners. The planetary friendship table (Naisargika Maitri) determines compatibility: Sun-Moon, Sun-Mars, Sun-Jupiter are natural friends; Saturn-Sun, Saturn-Mars are natural enemies.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Scoring:</strong> Both lords are friends = 5 points, one friend one neutral = 4, both neutral = 3, one friend one enemy = 1, both enemies = 0. This measures <strong>intellectual wavelength</strong> — how well the couple communicates, understands each other's thinking, and maintains mental connection over years.
          </p>
        </section>

        {/* Koota 6: Gana */}
        <section className="mb-10" id="gana">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">6. Gana Koota — Temperament Match (6 Points)</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            Nakshatras are classified into three temperaments: <strong>Deva</strong> (divine — gentle, spiritual, compromising), <strong>Manushya</strong> (human — balanced, practical, adaptive), and <strong>Rakshasa</strong> (demonic — independent, assertive, unconventional). The term "Rakshasa" doesn't mean evil — it indicates a strong, self-willed personality.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Scoring:</strong> Same Gana = 6, Deva-Manushya = 5, Manushya-Rakshasa = 3, Deva-Rakshasa = 0. <strong>Cancellation:</strong> If both partners have the same Nakshatra lord, or if the Nadi koota scores maximum, Gana dosha is reduced. This is crucial — a Deva-Rakshasa mismatch can create daily friction even if other kootas score well.
          </p>
        </section>

        {/* Koota 7: Bhakoot */}
        <section className="mb-10" id="bhakoot">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">7. Bhakoot Koota — Love, Wealth & Health (7 Points)</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            Bhakoot examines the <strong>distance between Moon signs</strong> of the couple. Certain combinations are considered inauspicious: <strong>2/12</strong> (financial strain), <strong>6/8</strong> (health issues and separation), and <strong>5/9</strong> (problems with children).
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            <strong>Scoring:</strong> No dosha = 7 points, any dosha = 0. However, <strong>important cancellation rules</strong> exist: if the lords of both Moon signs are the same planet, are mutual friends, or one is exalted in the other's sign, the Bhakoot dosha is cancelled and full 7 points are awarded.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            With 7 out of 36 points, Bhakoot is the <strong>second most weighted koota</strong>. A Bhakoot dosha without cancellation can significantly lower the overall score and should be carefully evaluated.
          </p>
        </section>

        {/* Koota 8: Nadi */}
        <section className="mb-10" id="nadi">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">8. Nadi Koota — Genetic & Health Compatibility (8 Points)</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            Nadi is the <strong>most heavily weighted koota at 8 points</strong>. Each Nakshatra belongs to one of three Nadis: <strong>Aadi</strong> (Vata — wind), <strong>Madhya</strong> (Pitta — bile), or <strong>Antya</strong> (Kapha — phlegm). Same Nadi = 0 points (Nadi Dosha), different Nadi = 8 points.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            <strong>Why it matters:</strong> Nadi Dosha (same Nadi) is believed to indicate genetic incompatibility affecting progeny health. It is the most feared dosha in Kundali matching.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Cancellation rules (critical):</strong> Nadi Dosha is cancelled if: (1) same Rashi but different Nakshatra, (2) same Nakshatra but different Rashi, (3) Rashi lords are the same planet (e.g., Aries and Scorpio, both ruled by Mars), (4) exception Nakshatras (Revati, Shravana, Mrigashira) which naturally neutralize, (5) different Nadis in Navamsa (D9) chart. Our engine checks all 5+ cancellation methods automatically.
          </p>
        </section>

        {/* Score Interpretation */}
        <section className="mb-10 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700" id="interpretation">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Score Interpretation Guide</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="text-left px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-600">Score Range</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-600">Rating</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-600">Interpretation</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b dark:border-gray-700"><td className="px-4 py-3 font-medium">0–17</td><td className="px-4 py-3 text-red-600 dark:text-red-400 font-medium">Not Recommended</td><td className="px-4 py-3">Significant incompatibilities exist. Marriage is generally not advised unless other chart factors are exceptionally strong.</td></tr>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"><td className="px-4 py-3 font-medium">18–24</td><td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-medium">Acceptable</td><td className="px-4 py-3">Average compatibility. Marriage can work with effort. Check for major doshas (Nadi, Bhakoot, Gana) and their cancellations.</td></tr>
                <tr className="border-b dark:border-gray-700"><td className="px-4 py-3 font-medium">25–30</td><td className="px-4 py-3 text-green-600 dark:text-green-400 font-medium">Good</td><td className="px-4 py-3">Strong compatibility across most dimensions. Minor issues can be addressed with awareness and remedies.</td></tr>
                <tr><td className="px-4 py-3 font-medium">31–36</td><td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-medium">Excellent</td><td className="px-4 py-3">Exceptional match. Strong harmony in temperament, physical chemistry, mental connection, and destiny alignment.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Important Note */}
        <section className="mb-10 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
          <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2">Important: Score Alone Is Not Enough</h3>
          <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
            A high Ashtakoot score is necessary but not sufficient. Two charts can score 30/36 yet have severe Mangal Dosha, afflicted 7th house, or a devastating Nadi Dosha that was not cancelled. Conversely, a score of 20 with no doshas and strong synastry aspects can indicate a very successful marriage. Always analyze the full chart — not just the number.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Check Your Compatibility Score</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Get your complete Ashtakoot Milan analysis with dosha cancellation — 100% free.</p>
          <Link to="/calculator" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-full hover:shadow-lg transition-all">
            Start Kundali Matching <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </article>

      <footer className="py-6 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2025 Astro Marriage by NovaVentures AI. Content based on classical Vedic astrology texts.</p>
        </div>
      </footer>
    </div>
  );
};

export default AshtakootMilanGuide;
