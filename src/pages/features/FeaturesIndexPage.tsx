import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { Shield, Clock, Heart, Brain, Swords, Users, Star, Flame, BookOpen, Activity, Layers, Zap, Eye, Wind, BarChart3, GitBranch, Sparkles, ArrowRight } from 'lucide-react';

const features = [
  { slug: 'divorce-risk',          icon: Shield,     color: 'red',    title: 'Divorce Risk Radar',          desc: 'Quantified 0-100 probability score across 12+ classical indicators with protective buffer deductions.' },
  { slug: 'ashtakoot-milan',       icon: Star,       color: 'amber',  title: 'Ashtakoot Milan (36-Point)',  desc: 'All 8 Kootas — Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi — with dosha detection.' },
  { slug: 'marriage-timing',       icon: Clock,      color: 'purple', title: 'Marriage Timing',             desc: '5-method convergence: Vimshottari Dasha, Jupiter-Saturn transits, KP 2-7-11, Jaimini Chara Dasha, Navamsa.' },
  { slug: 'vulnerability-timeline',icon: Eye,        color: 'orange', title: 'Vulnerability Timeline',      desc: 'Lifetime Dasha scan identifying exact years of relationship stress — no competitor offers this.' },
  { slug: 'spouse-prediction',     icon: Users,      color: 'pink',   title: 'Spouse Prediction',           desc: 'Physical traits, personality, profession, meeting circumstances — from 7th house, Darakaraka & Upapada.' },
  { slug: 'psychological-profile', icon: Brain,      color: 'indigo', title: 'Psychological Profile',       desc: 'Attachment style, love language, core fears, defense mechanisms — bridging Vedic astrology with modern psychology.' },
  { slug: 'kp-analysis',           icon: Zap,        color: 'blue',   title: 'KP Analysis',                 desc: '249-point sub-lord system, 7th Cuspal Sub Lord, 4-fold significator chain, ruling planets for precision timing.' },
  { slug: 'synastry',              icon: GitBranch,  color: 'teal',   title: 'Deep Synastry',              desc: 'Cross-chart house overlays (9 planets × 12 houses × both directions) + D9 Navamsa overlays.' },
  { slug: 'conflict-zones',        icon: Swords,     color: 'rose',   title: 'Conflict Zones',             desc: 'Specific friction areas across People, Things, Ideology, Behavior — attributed to each partner.' },
  { slug: 'sexual-compatibility',  icon: Flame,      color: 'red',    title: 'Sexual Compatibility',        desc: '14 Yoni animal types with full 14×14 compatibility matrix, drive assessment, intimacy scoring.' },
  { slug: 'mental-health',         icon: Activity,   color: 'green',  title: 'Mental Health Profile',      desc: 'Depression risk, anxiety tendency, emotional stability, stress resilience from Moon/Mercury/4th-5th house.' },
  { slug: 'remedies',              icon: Sparkles,   color: 'amber',  title: 'Personalized Remedies',      desc: 'Gemstones, Lal Kitab remedies, mantras, and lifestyle guidance tailored to your specific chart placements.' },
  { slug: 'chara-dasha',           icon: Wind,       color: 'violet', title: 'Chara Dasha (Jaimini)',      desc: 'Sign-based Jaimini dasha timeline with marriage window badges on Darakaraka and Upapada signs.' },
  { slug: 'porutham',              icon: Heart,      color: 'pink',   title: '10 Porutham (South Indian)', desc: 'Tamil/Kerala 10-factor matching: Dina, Gana, Mahendra, Stree Deergha, Yoni, Rashi, Vasya, Rajju, Vedha.' },
  { slug: 'yoga-dosha',            icon: BarChart3,  color: 'indigo', title: 'Yoga & Dosha Analysis',      desc: 'Marriage-affecting yogas and doshas detected from both charts with severity rating and remedies.' },
  { slug: 'addiction-risk',        icon: Shield,     color: 'orange', title: 'Addiction Risk',             desc: 'Alcohol/substance vulnerability, compulsive behavior indicators with protective factors from Jupiter/Saturn.' },
  { slug: 'relationship-patterns', icon: BookOpen,   color: 'blue',   title: 'Relationship Patterns',      desc: 'Pre-marital history indicators, affair context triggers, and spouse longevity assessment.' },
  { slug: 'divisional-charts',     icon: Layers,     color: 'gray',   title: 'Divisional Charts (D1-D60)', desc: '16 Vargas computed including D9 Navamsa, D7 Saptamsa, D10 Dasamsa — with cross-chart analysis.' },
];

const colorMap: Record<string, { bg: string; text: string; border: string; hover: string }> = {
  red:    { bg: 'bg-red-50 dark:bg-red-900/20',     text: 'text-red-600 dark:text-red-400',     border: 'border-red-200 dark:border-red-800',     hover: 'hover:border-red-400 dark:hover:border-red-500' },
  amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', hover: 'hover:border-amber-400 dark:hover:border-amber-500' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20',text: 'text-purple-600 dark:text-purple-400',border: 'border-purple-200 dark:border-purple-800',hover: 'hover:border-purple-400 dark:hover:border-purple-500' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20',text: 'text-orange-600 dark:text-orange-400',border: 'border-orange-200 dark:border-orange-800',hover: 'hover:border-orange-400 dark:hover:border-orange-500' },
  pink:   { bg: 'bg-pink-50 dark:bg-pink-900/20',   text: 'text-pink-600 dark:text-pink-400',   border: 'border-pink-200 dark:border-pink-800',   hover: 'hover:border-pink-400 dark:hover:border-pink-500' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20',text: 'text-indigo-600 dark:text-indigo-400',border: 'border-indigo-200 dark:border-indigo-800',hover: 'hover:border-indigo-400 dark:hover:border-indigo-500' },
  blue:   { bg: 'bg-blue-50 dark:bg-blue-900/20',   text: 'text-blue-600 dark:text-blue-400',   border: 'border-blue-200 dark:border-blue-800',   hover: 'hover:border-blue-400 dark:hover:border-blue-500' },
  teal:   { bg: 'bg-teal-50 dark:bg-teal-900/20',   text: 'text-teal-600 dark:text-teal-400',   border: 'border-teal-200 dark:border-teal-800',   hover: 'hover:border-teal-400 dark:hover:border-teal-500' },
  rose:   { bg: 'bg-rose-50 dark:bg-rose-900/20',   text: 'text-rose-600 dark:text-rose-400',   border: 'border-rose-200 dark:border-rose-800',   hover: 'hover:border-rose-400 dark:hover:border-rose-500' },
  green:  { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800', hover: 'hover:border-green-400 dark:hover:border-green-500' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-900/20',text: 'text-violet-600 dark:text-violet-400',border: 'border-violet-200 dark:border-violet-800',hover: 'hover:border-violet-400 dark:hover:border-violet-500' },
  gray:   { bg: 'bg-gray-50 dark:bg-gray-800',      text: 'text-gray-600 dark:text-gray-400',   border: 'border-gray-200 dark:border-gray-700',   hover: 'hover:border-gray-400 dark:hover:border-gray-500' },
};

export const FeaturesIndexPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SEOHead
      title="Vedic Astrology Analysis Features Explained | Astro Marriage"
      description="Explore all 19 analysis modules in Astro Marriage — from Divorce Risk Radar to Vulnerability Timeline. Each feature explained with live demo, significance, and how to read the output."
      path="/features"
    />

    {/* Hero */}
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" /> 19 Analysis Modules
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">Explore Our Analysis Features</h1>
        <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-8">
          Every widget explained — what it is, why it matters, how to read it, and a live demo with real sample data.
        </p>
        <Link to="/calculator" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
          Try All Features Free <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>

    {/* Grid */}
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map(f => {
          const c = colorMap[f.color] || colorMap.gray;
          return (
            <Link
              key={f.slug}
              to={`/features/${f.slug}`}
              className={`group flex flex-col bg-white dark:bg-gray-800 rounded-2xl border-2 ${c.border} ${c.hover} transition-all duration-200 p-6 hover:shadow-lg`}
            >
              <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center mb-4`}>
                <f.icon className={`w-6 h-6 ${c.text}`} />
              </div>
              <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{f.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-grow">{f.desc}</p>
              <div className={`mt-4 text-sm font-medium ${c.text} flex items-center gap-1`}>
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>

    {/* CTA */}
    <div className="max-w-3xl mx-auto px-4 pb-16 text-center">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">See All 19 Features in Your Report</h3>
        <p className="text-indigo-100 mb-6">Free, instant, private — all calculations run in your browser.</p>
        <Link to="/calculator" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
          Start Free Analysis <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </div>
);

export default FeaturesIndexPage;
