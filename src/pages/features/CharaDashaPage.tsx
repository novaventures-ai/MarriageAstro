import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';

const relatedFeatures = [
  { slug: 'marriage-timing', title: 'Marriage Timing' },
  { slug: 'kp-analysis', title: 'KP Analysis' },
  { slug: 'divisional-charts', title: 'Divisional Charts' },
];

const dashaTimeline = [
  { sign: 'Aries', symbol: '♈', years: '2015–2019', duration: 4, favorable: false, current: false, note: '' },
  { sign: 'Taurus', symbol: '♉', years: '2019–2023', duration: 4, favorable: false, current: false, note: '' },
  { sign: 'Gemini', symbol: '♊', years: '2023–2027', duration: 4, favorable: false, current: true, note: 'Current Period' },
  { sign: 'Cancer', symbol: '♋', years: '2027–2034', duration: 7, favorable: true, current: false, note: '★ Darakaraka Sign — Marriage Window' },
  { sign: 'Leo', symbol: '♌', years: '2034–2042', duration: 8, favorable: false, current: false, note: '' },
  { sign: 'Virgo', symbol: '♍', years: '2042–2048', duration: 6, favorable: true, current: false, note: '★ Upapada Lagna — 2nd Marriage Window' },
  { sign: 'Libra', symbol: '♎', years: '2048–2056', duration: 8, favorable: false, current: false, note: '' },
];

const keyTerms = [
  { term: 'Darakaraka', meaning: 'Planet with the lowest degree in your chart — represents your spouse. When its sign activates in Chara Dasha, marriage is strongly indicated.' },
  { term: 'Upapada Lagna', meaning: 'The Arudha of the 12th house — shows the quality and timing of the marriage relationship itself.' },
  { term: 'Navamsa 7th Lord', meaning: 'When the sign ruled by the Navamsa 7th lord activates, it supports formal marriage events.' },
  { term: 'Marriage Window Badge', meaning: 'Orange badge on a Dasha period means this sign activates at least one of the three marriage triggers above.' },
];

export const CharaDashaPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SEOHead
      title="Jaimini Chara Dasha — Sign-Based Marriage Timing | Astro Marriage"
      description="Jaimini's Chara Dasha uses zodiac signs as period lords — when the Darakaraka sign or Upapada Lagna activates, marriage timing windows open. Learn how it works."
      path="/features/chara-dasha"
    />

    {/* Breadcrumb */}
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Home</Link>
      <span>/</span>
      <Link to="/features" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Features</Link>
      <span>/</span>
      <span className="text-gray-700 dark:text-gray-200">Chara Dasha</span>
    </div>

    {/* Hero */}
    <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Jaimini System
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Jaimini Chara Dasha — Sign-Based Marriage Timing
        </h1>
        <p className="text-xl text-white/90 max-w-2xl">
          Unlike Vimshottari's planet-based periods, Chara Dasha activates zodiac signs as period lords — unlocking marriage windows when the Darakaraka or Upapada sign becomes active.
        </p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      {/* What Is It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Is Jaimini Chara Dasha?</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            Chara Dasha is a timing system from Jaimini astrology — an ancient branch of Vedic astrology attributed to the sage Jaimini. While the more familiar Vimshottari Dasha assigns periods to planets (e.g., Moon Dasha = 10 years, Mars Dasha = 7 years), Chara Dasha assigns periods to zodiac signs themselves. The word "Chara" means movable or changing — each sign rules for a specific number of years determined by a complex formula involving the sign's ruler and other factors, ranging from 1 to 12 years per sign. The sequence begins from the Lagna (Ascendant sign) and moves through the twelve signs in order.
          </p>
          <p>
            For marriage timing, three triggers are most important: the Darakaraka sign (the sign containing the planet with the lowest degree — the planet that represents your future spouse), the Upapada Lagna (Arudha of the 12th house, which shows the quality of the marriage bond itself), and the sign occupied by the 7th lord of the Navamsa chart. When any of these signs becomes active as a Chara Dasha Maha Dasha or Antardasha, a marriage window opens. The app marks these with a "Marriage Window" badge and also checks if the simultaneous Vimshottari Dasha confirms the window — convergence of both systems dramatically increases reliability.
          </p>
        </div>
      </section>

      {/* Why It Matters */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why It Matters</h2>
        <ul className="space-y-4">
          {[
            {
              icon: '🪐',
              heading: 'Second independent timing system',
              body: 'Vimshottari Dasha and Chara Dasha use completely different logic — one planets, one signs. When both point to the same year, that year has the highest statistical marriage probability across traditional Indian astrology methods.',
            },
            {
              icon: '💑',
              heading: 'Spouse identification through Darakaraka',
              body: 'The planet with the lowest degree in your chart is the Darakaraka — the Atmakaraka of marriage. When its sign activates in Chara Dasha, you are most likely to meet or marry the person this planet describes in your Navamsa.',
            },
            {
              icon: '📅',
              heading: 'Long-horizon planning',
              body: 'Chara Dasha periods can run 1–12 years per sign, giving a clear long-horizon view of which years in your lifetime carry marriage potential — useful even for those currently in no rush.',
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

      {/* Visual Timeline */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sample Chara Dasha Timeline</h2>
          <span className="inline-flex items-center gap-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 text-xs font-semibold px-3 py-1 rounded-full border border-violet-200 dark:border-violet-700">
            📊 Sample Data — Ananya's Chart
          </span>
        </div>

        {/* Key terms */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {keyTerms.map(t => (
            <div key={t.term} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="font-semibold text-violet-700 dark:text-violet-300 text-sm mb-1">{t.term}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{t.meaning}</p>
            </div>
          ))}
        </div>

        {/* Timeline bars */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              <div className="col-span-2">Sign</div>
              <div className="col-span-3">Period</div>
              <div className="col-span-5">Timeline Bar</div>
              <div className="col-span-2">Status</div>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {dashaTimeline.map(period => (
              <div key={period.sign} className={`px-6 py-3 grid grid-cols-12 gap-2 items-center text-sm ${period.current ? 'bg-violet-50 dark:bg-violet-900/10' : ''}`}>
                <div className="col-span-2 flex items-center gap-1.5 font-semibold text-gray-900 dark:text-gray-100">
                  <span className="text-lg">{period.symbol}</span>
                  <span className="text-sm">{period.sign}</span>
                </div>
                <div className="col-span-3 text-xs text-gray-500 dark:text-gray-400 font-mono">{period.years}</div>
                <div className="col-span-5">
                  <div className="h-4 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        period.favorable ? 'bg-gradient-to-r from-orange-400 to-amber-400' :
                        period.current  ? 'bg-gradient-to-r from-violet-500 to-purple-400' :
                                          'bg-gray-300 dark:bg-gray-600'
                      }`}
                      style={{ width: `${Math.min(100, (period.duration / 12) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  {period.favorable ? (
                    <span className="inline-flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ★ Window
                    </span>
                  ) : period.current ? (
                    <span className="inline-flex items-center gap-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Now
                    </span>
                  ) : null}
                </div>
                {period.note && (
                  <div className="col-span-12 text-xs text-orange-600 dark:text-orange-400 font-medium -mt-1 pl-9">{period.note}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Orange bars = marriage windows where Darakaraka sign or Upapada Lagna is active.</p>
      </section>

      {/* How To Read It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How To Read the Chara Dasha Timeline</h2>
        <ol className="space-y-4">
          {[
            { step: 1, title: 'Find your current period', detail: 'The highlighted row shows the active Chara Dasha sign. This is the theme of your current chapter — not the marriage window itself unless it is also marked with a star badge.' },
            { step: 2, title: 'Look for orange "★ Window" badges', detail: 'These mark periods when the Darakaraka sign, Upapada Lagna, or 7th Navamsa lord sign becomes active. Any of these is a significant marriage trigger period.' },
            { step: 3, title: 'Check the sub-period (Antardasha)', detail: 'Within each Maha Dasha sign, each other sign also rules an Antardasha. Even if the main period is neutral, its sub-periods may activate a marriage-favorable sign.' },
            { step: 4, title: 'Cross-verify with Vimshottari', detail: 'The highest confidence marriage timing comes when both the Chara Dasha window AND Vimshottari Dasha (planet-based) both indicate the same year. Look for convergence.' },
          ].map(({ step, title, detail }) => (
            <li key={step} className="flex gap-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 flex items-center justify-center font-bold text-sm">
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
      <section className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">See Your Chara Dasha Marriage Windows</h2>
        <p className="text-white/85 mb-6 max-w-md mx-auto">
          Enter your birth details to see the full Chara Dasha timeline with marriage window badges and Vimshottari convergence check.
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-white text-violet-700 font-bold px-8 py-3 rounded-xl hover:bg-violet-50 transition-colors shadow-lg"
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
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-violet-400 dark:hover:border-violet-500 transition-colors"
            >
              {f.title} →
            </Link>
          ))}
        </div>
      </section>

    </div>
  </div>
);

export default CharaDashaPage;
