/**
 * Mangal Dosha Guide
 * Static content page for GEO — targets "mangal dosha" / "manglik" AI queries
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';

export const MangalDoshaGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
      <SEOHead
        title="Mangal Dosha (Manglik) — Meaning, Effects, Cancellation Rules & Remedies"
        description="Complete guide to Mangal Dosha (Kuja Dosha) in Vedic astrology. Learn what makes you Manglik, 15+ cancellation rules, effects on marriage, and proven remedies including Kumbh Vivah, gemstones, and mantras."
        path="/guides/mangal-dosha"
      />

      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <Link to="/self-calculator" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Check My Chart <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:underline">Home</Link> &gt; <Link to="/how-it-works" className="hover:underline">How It Works</Link> &gt; <span className="text-gray-800 dark:text-gray-200">Mangal Dosha</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
          Mangal Dosha: Complete Guide to Mars Affliction in Marriage
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
          Mangal Dosha (also called <strong>Kuja Dosha</strong>, <strong>Manglik Dosha</strong>, or <strong>Angaraka Dosha</strong>) is one of the most discussed — and most misunderstood — concepts in Vedic marriage astrology. Approximately <strong>40% of people</strong> have some form of Mangal Dosha, but the majority have it cancelled by other chart factors.
        </p>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5 mb-10">
          <p className="text-sm text-indigo-800 dark:text-indigo-300">
            <strong>Source:</strong> Mangal Dosha rules are codified in <em>Brihat Parashara Hora Shastra</em> (Chapter 81), <em>Jataka Parijata</em>, and <em>Lal Kitab</em>. Cancellation rules are compiled from multiple classical texts including <em>Phaladeepika</em> by Mantreshwara and <em>Saravali</em> by Kalyana Varma.
          </p>
        </div>

        {/* What is Mangal Dosha */}
        <section className="mb-12" id="what-is">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            What is Mangal Dosha?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Mangal Dosha occurs when <strong>Mars (Mangal/Kuja)</strong> is placed in the <strong>1st, 4th, 7th, 8th, or 12th house</strong> from the Ascendant (Lagna) in a birth chart. Some astrologers also check these placements from the Moon and Venus, making the assessment more comprehensive.
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="text-left px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700">Mars in House</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700">Area Affected</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700">Intensity</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="border-b dark:border-gray-700"><td className="px-4 py-3 font-medium">1st House</td><td className="px-4 py-3">Self, personality — Mars aspects the 7th house of marriage directly</td><td className="px-4 py-3">Medium</td></tr>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"><td className="px-4 py-3 font-medium">4th House</td><td className="px-4 py-3">Domestic happiness, home life, property — Mars aspects 7th from 4th</td><td className="px-4 py-3">Medium</td></tr>
                <tr className="border-b dark:border-gray-700"><td className="px-4 py-3 font-medium">7th House</td><td className="px-4 py-3">Marriage directly — Mars sits in the house of partnership</td><td className="px-4 py-3">High</td></tr>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"><td className="px-4 py-3 font-medium">8th House</td><td className="px-4 py-3">Longevity of marriage, in-laws, marital bond — most intense placement</td><td className="px-4 py-3">Very High</td></tr>
                <tr><td className="px-4 py-3 font-medium">12th House</td><td className="px-4 py-3">Bedroom life, expenses, losses — affects intimacy and financial harmony</td><td className="px-4 py-3">Medium-High</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Why does Mars cause dosha?</strong> Mars is a hot, aggressive, impulsive planet. In marriage-related houses, its energy can manifest as arguments, dominance issues, physical aggression, or incompatibility — unless it is balanced by benefic influences or placed in favorable signs.
          </p>
        </section>

        {/* Effects */}
        <section className="mb-12" id="effects">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Effects of Mangal Dosha on Marriage
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Delayed marriage:</strong> Finding a suitable partner takes longer, proposals may fall through</li>
            <li><strong>Temperamental clashes:</strong> Frequent arguments, ego battles, and difficulty compromising</li>
            <li><strong>Dominance issues:</strong> One partner may be excessively controlling or aggressive</li>
            <li><strong>Physical incompatibility:</strong> Mismatched energy levels, libido differences</li>
            <li><strong>Separation risk:</strong> In severe uncancelled cases, risk of divorce or prolonged separation</li>
            <li><strong>Health of spouse:</strong> Mars in the 8th can indicate health concerns for the partner</li>
          </ul>
        </section>

        {/* Cancellation Rules */}
        <section className="mb-12" id="cancellation">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Mangal Dosha Cancellation Rules (15+ Methods)
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            This is the most important section. Most basic calculators flag Mangal Dosha but don't check cancellations — leading to unnecessary fear. Astro Marriage checks <strong>all</strong> of the following cancellation rules:
          </p>

          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">House-Specific Cancellations</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li><strong>Mars in 1st house:</strong> Cancelled if in Aries, Leo, or Aquarius</li>
            <li><strong>Mars in 2nd house:</strong> Cancelled if in Gemini or Virgo</li>
            <li><strong>Mars in 4th house:</strong> Cancelled if in Aries, Scorpio, Leo, Sagittarius, or Pisces</li>
            <li><strong>Mars in 7th house:</strong> Cancelled if in Cancer, Leo, Capricorn, or Aquarius</li>
            <li><strong>Mars in 8th house:</strong> Cancelled if in Aries, Cancer, Leo, Sagittarius, or Pisces</li>
            <li><strong>Mars in 12th house:</strong> Cancelled if in Taurus or Libra</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">General Cancellation Rules</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li><strong>Mars in own sign:</strong> Mars in Aries or Scorpio — energy is channeled constructively</li>
            <li><strong>Mars exalted:</strong> Mars in Capricorn — discipline tames aggression</li>
            <li><strong>Mars in friendly sign:</strong> Mars in Sun's, Moon's, or Jupiter's signs</li>
            <li><strong>Jupiter's aspect on Mars:</strong> Jupiter's 5th, 7th, or 9th aspect on Mars neutralizes aggression</li>
            <li><strong>Mars conjunct Moon:</strong> Moon's cooling influence softens Mars</li>
            <li><strong>Mars conjunct or aspected by benefics:</strong> Venus or Mercury association reduces intensity</li>
            <li><strong>Both partners are Manglik:</strong> The most common cancellation — when both have Mars in dosha houses, the effects neutralize each other</li>
            <li><strong>Mars in Navamsa:</strong> If Mars is well-placed in D9 (own sign, exalted, or in a kendra), the dosha is significantly reduced</li>
          </ul>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
            <p className="text-sm text-green-800 dark:text-green-300">
              <strong>Key insight:</strong> After applying all cancellation rules, studies suggest that only about <strong>10-15% of "Manglik" individuals</strong> have a truly active, uncancelled Mangal Dosha. This means the vast majority of people labelled "Manglik" by basic calculators have nothing to worry about.
            </p>
          </div>
        </section>

        {/* Remedies */}
        <section className="mb-12" id="remedies">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Remedies for Mangal Dosha
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            For those with active (uncancelled) Mangal Dosha, several remedial measures are prescribed in classical texts:
          </p>

          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Ritual Remedies</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li><strong>Kumbh Vivah:</strong> A symbolic marriage to a banana tree, peepal tree, or silver/gold idol of Lord Vishnu before the actual marriage. This is considered the most effective remedy.</li>
            <li><strong>Mangal Shanti Puja:</strong> A dedicated havan (fire ceremony) to pacify Mars, typically performed on Tuesdays</li>
            <li><strong>Hanuman Chalisa:</strong> Reciting Hanuman Chalisa on Tuesdays — Lord Hanuman is the deity associated with Mars</li>
            <li><strong>Navagraha Puja:</strong> Worship of all 9 planets to balance Mars's energy</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Gemstone & Lifestyle Remedies</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li><strong>Red Coral (Moonga):</strong> Wearing a natural red coral in a gold or copper ring on the ring finger, consecrated on a Tuesday</li>
            <li><strong>Donate on Tuesdays:</strong> Donate red lentils (masoor dal), jaggery, or red cloth to the needy</li>
            <li><strong>Fasting on Tuesdays:</strong> Partial or full fast dedicated to Lord Hanuman</li>
            <li><strong>Plant a neem tree:</strong> Neem is associated with Mars — planting and nurturing it redirects Mars energy</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Lal Kitab Remedies</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Keep a square piece of silver in your wallet or purse</li>
            <li>Feed sweet chapatis to dogs on Tuesdays</li>
            <li>Float red flowers in running water on Tuesdays</li>
            <li>Apply saffron tilak on your forehead before leaving home</li>
            <li>Keep a red handkerchief with you at all times</li>
          </ul>
        </section>

        {/* Mangal Dosha from Moon and Venus */}
        <section className="mb-10" id="moon-venus">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Checking from Moon and Venus (Triple Check)
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            While the primary check is from the <strong>Ascendant (Lagna)</strong>, thorough analysis also checks Mars's position from:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li><strong>From Moon:</strong> Mars in 1st, 4th, 7th, 8th, or 12th from Moon sign — affects emotional and mental compatibility</li>
            <li><strong>From Venus:</strong> Mars in these houses from Venus — affects romantic and physical compatibility specifically</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Astro Marriage performs this <strong>triple-check</strong> (Lagna + Moon + Venus) and shows the intensity score for each. A person may have mild Mangal Dosha from Lagna but none from Moon — the combined assessment gives the true picture.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-10 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700" id="faq">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-semibold mb-1">Can a Manglik marry a non-Manglik?</p>
              <p className="text-sm leading-relaxed">Yes, if Mangal Dosha is cancelled by any of the 15+ cancellation rules, or if remedies are performed. Also, if the non-Manglik partner has Saturn in the same houses (1, 4, 7, 8, 12), it acts as a natural counterbalance.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Does Mangal Dosha expire after age 28?</p>
              <p className="text-sm leading-relaxed">This is a popular belief but not universally accepted. Some texts suggest Mars's aggressive energy matures after 28, reducing its impact. However, the dosha is present in the birth chart for life — what changes is how you handle its energy.</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Is "Double Manglik" worse than single Manglik?</p>
              <p className="text-sm leading-relaxed">"Double Manglik" (Mars in dosha houses from both Lagna and Moon) indicates stronger Mars energy, not necessarily worse outcomes. Cancellation rules still apply independently to each. If cancelled from one reference point, the severity is already halved.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Check Your Mangal Dosha Status</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Astro Marriage checks Mars from Lagna, Moon, and Venus — with all 15+ cancellation rules applied automatically.</p>
          <Link to="/self-calculator" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-lg transition-all">
            Analyze My Chart Free <ArrowRight className="w-5 h-5" />
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

export default MangalDoshaGuide;
