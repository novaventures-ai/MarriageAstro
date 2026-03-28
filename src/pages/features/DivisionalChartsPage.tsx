import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';

const relatedFeatures = [
  { slug: 'kp-analysis', title: 'KP Analysis' },
  { slug: 'marriage-timing', title: 'Marriage Timing' },
  { slug: 'chara-dasha', title: 'Chara Dasha' },
];

const divisionalCharts = [
  { d: 'D1', name: 'Birth Chart', area: 'Overall Life', star: false, color: 'bg-gray-100 dark:bg-gray-700', badge: '' },
  { d: 'D2', name: 'Hora', area: 'Wealth', star: false, color: 'bg-yellow-50 dark:bg-yellow-900/20', badge: '' },
  { d: 'D3', name: 'Drekkana', area: 'Siblings & Courage', star: false, color: 'bg-blue-50 dark:bg-blue-900/20', badge: '' },
  { d: 'D4', name: 'Chaturthamsa', area: 'Property & Fortune', star: false, color: 'bg-green-50 dark:bg-green-900/20', badge: '' },
  { d: 'D7', name: 'Saptamsa', area: 'Children & Progeny', star: false, color: 'bg-pink-50 dark:bg-pink-900/20', badge: '' },
  { d: 'D9', name: 'Navamsa', area: 'Marriage & Soul', star: true, color: 'bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30', badge: 'Most Important' },
  { d: 'D10', name: 'Dasamsa', area: 'Career & Profession', star: false, color: 'bg-indigo-50 dark:bg-indigo-900/20', badge: '' },
  { d: 'D12', name: 'Dvadasamsa', area: 'Parents', star: false, color: 'bg-rose-50 dark:bg-rose-900/20', badge: '' },
  { d: 'D16', name: 'Shodasamsa', area: 'Vehicles & Comforts', star: false, color: 'bg-cyan-50 dark:bg-cyan-900/20', badge: '' },
  { d: 'D20', name: 'Vimsamsa', area: 'Spiritual Practice', star: false, color: 'bg-amber-50 dark:bg-amber-900/20', badge: '' },
  { d: 'D24', name: 'Chaturvimsamsa', area: 'Education & Learning', star: false, color: 'bg-lime-50 dark:bg-lime-900/20', badge: '' },
  { d: 'D27', name: 'Bhamsa', area: 'Vitality & Strength', star: false, color: 'bg-orange-50 dark:bg-orange-900/20', badge: '' },
  { d: 'D30', name: 'Trimsamsa', area: 'Misfortune & Evils', star: false, color: 'bg-red-50 dark:bg-red-900/20', badge: '' },
  { d: 'D40', name: 'Khavedamsa', area: 'Auspicious & Inauspicious', star: false, color: 'bg-teal-50 dark:bg-teal-900/20', badge: '' },
  { d: 'D45', name: 'Akshavedamsa', area: 'General Indications', star: false, color: 'bg-sky-50 dark:bg-sky-900/20', badge: '' },
  { d: 'D60', name: 'Shastiamsa', area: 'Karma & Past Life', star: false, color: 'bg-purple-50 dark:bg-purple-900/20', badge: '' },
];

const navamsaExplainer = [
  { label: 'Vargottama Planet', value: 'Venus', note: 'Venus is in same sign in D1 and D9 — greatly strengthened, brings exceptional marriage blessings.' },
  { label: 'D9 7th Lord', value: 'Mercury in Gemini', note: 'Mercury rules the 7th in D9 — spouse will be communicative, intellectually vibrant, and multi-talented.' },
  { label: 'D9 Lagna', value: 'Scorpio Navamsa', note: 'Scorpio Navamsa Lagna: intense, transformative marriage. The relationship deepens profoundly over time.' },
  { label: 'D9 Overall Strength', value: 'Strong', note: 'Even if D1 shows some challenges, a strong D9 indicates the soul-level quality of marriage is excellent.' },
];

export const DivisionalChartsPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SEOHead
      title="16 Divisional Charts (Vargas) — Deep Chart Analysis | Astro Marriage"
      description="Beyond the D1 birth chart, Vedic astrology uses 16 divisional charts. D9 Navamsa is the most critical for marriage — a weak D1 with strong D9 can still produce a beautiful marriage."
      path="/features/divisional-charts"
    />

    {/* Breadcrumb */}
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Home</Link>
      <span>/</span>
      <Link to="/features" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Features</Link>
      <span>/</span>
      <span className="text-gray-700 dark:text-gray-200">Divisional Charts</span>
    </div>

    {/* Hero */}
    <div className="bg-gradient-to-r from-gray-600 to-slate-700 text-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Advanced Analysis
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          16 Divisional Charts (Vargas) — Deep Chart Analysis
        </h1>
        <p className="text-xl text-white/90 max-w-2xl">
          The birth chart (D1) is just the surface. Vedic astrology computes 16 divisional charts — each zooming into a specific life area. D9 Navamsa is the most important for marriage.
        </p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      {/* What Is It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Are Divisional Charts (Vargas)?</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            A divisional chart (Varga) is created by dividing each zodiac sign into smaller equal sections and reassigning each planet to a new sign based on which section it falls in. The D9 (Navamsa) divides each sign into 9 equal parts — each planet "moves" to a new sign based on which 9th it occupies in the birth chart. This creates a second complete horoscope that reveals the soul-level quality of that life area. D7 (Saptamsa) divides each sign into 7 parts to reveal the children dimension. D10 (Dasamsa) into 10 parts for career. The D60 (Shastiamsa) is the most detailed — dividing each sign into 60 parts — and shows past-life karma at the most granular level.
          </p>
          <p>
            For marriage assessment, the D9 Navamsa is essential. A Vargottama planet — one that occupies the same sign in both D1 and D9 — is dramatically strengthened, as if placed twice in its sign. The D9 7th house and its lord describe the soul-level quality of the marriage relationship itself — what the partnership is meant to become. The famous principle holds: a weak 7th house in D1 but a strong D9 marriage sector can still produce a deeply fulfilling marriage, because the D9 shows the inner, soul-level reality rather than the outer circumstances shown by D1.
          </p>
        </div>
      </section>

      {/* Why It Matters */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why It Matters</h2>
        <ul className="space-y-4">
          {[
            {
              icon: '🔬',
              heading: 'D1 alone can be misleading',
              body: 'A chart with strong D1 marriage indicators but a weak D9 may show an outwardly good-looking marriage that is inwardly hollow. D9 reveals the soul-level experience — which is what matters most in the long run.',
            },
            {
              icon: '⭐',
              heading: 'Vargottama — the double-strength planet',
              body: 'When a planet occupies the same sign in D1 and D9, it gains extraordinary strength. A Vargottama Venus produces exceptionally happy marriage energy. Identifying these planets in your chart reveals your greatest natural strengths.',
            },
            {
              icon: '🗂️',
              heading: '16 charts — one for each life dimension',
              body: 'The Shad Varga (6 key divisionals) and Sapta Varga (7) are used in practical predictive work. This feature computes all 16 and weighs them for marriage, children, career, and spiritual purpose simultaneously.',
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

      {/* 16-Chart Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">All 16 Divisional Charts</h2>
          <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600">
            📊 Chart Reference
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10">
          {divisionalCharts.map(chart => (
            <div
              key={chart.d}
              className={`relative rounded-xl border p-4 transition-all ${chart.color} ${
                chart.star ? 'border-violet-400 dark:border-violet-500 shadow-md ring-1 ring-violet-400 dark:ring-violet-500' : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              {chart.star && (
                <div className="absolute -top-2 -right-2 bg-violet-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                  ★ KEY
                </div>
              )}
              <div className={`text-xl font-black mb-1 ${chart.star ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300'}`}>
                {chart.d}
              </div>
              <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">{chart.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{chart.area}</div>
              {chart.badge && (
                <div className="mt-2 text-[9px] font-bold uppercase bg-violet-200 dark:bg-violet-800/50 text-violet-800 dark:text-violet-200 px-2 py-0.5 rounded-full inline-block">
                  {chart.badge}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* D9 Navamsa deep-dive */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl border border-violet-200 dark:border-violet-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500 text-white flex items-center justify-center font-black text-lg">D9</div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Navamsa — Marriage Deep Dive (Sample)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ananya's D9 Navamsa Chart Analysis</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {navamsaExplainer.map(item => (
              <div key={item.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-violet-100 dark:border-violet-800/40">
                <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide mb-0.5">{item.label}</div>
                <div className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">{item.value}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How To Read */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How To Read Divisional Charts</h2>
        <ol className="space-y-4">
          {[
            { step: 1, title: 'Start with D1 — the foundation', detail: 'D1 shows the outer circumstances of marriage — timing, social circumstances, practical challenges. Always read D1 first for the overall picture.' },
            { step: 2, title: 'Proceed to D9 for soul-level quality', detail: 'The D9 reveals the inner quality of the marriage relationship. Look at the D9 7th house, its lord, and the placement of Venus and Jupiter. A strong D9 marriage sector is the most important indicator of a deeply fulfilling relationship.' },
            { step: 3, title: 'Check for Vargottama planets', detail: 'Identify any planet occupying the same sign in both D1 and D9. These planets are energetically doubled — if Venus is Vargottama, marriage will be a central source of joy and growth in your life.' },
            { step: 4, title: 'Use D7 and D10 for life planning', detail: 'After the marriage-focused D9, D7 (children) and D10 (career) are most practically useful. Checking whether career and family timing windows align in D10 and D7 helps with life planning decisions.' },
          ].map(({ step, title, detail }) => (
            <li key={step} className="flex gap-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 flex items-center justify-center font-bold text-sm">
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
      <section className="bg-gradient-to-r from-gray-600 to-slate-700 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Run Your Full Divisional Chart Analysis</h2>
        <p className="text-white/85 mb-6 max-w-md mx-auto">
          Enter your birth details for all 16 Vargas with D9 Navamsa deep-dive, Vargottama identification, and cross-chart marriage analysis.
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-white text-gray-700 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
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
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              {f.title} →
            </Link>
          ))}
        </div>
      </section>

    </div>
  </div>
);

export default DivisionalChartsPage;
