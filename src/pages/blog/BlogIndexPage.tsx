/**
 * Blog Index Page
 * Lists all Vedic astrology & marriage blog articles at /blog
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar, Tag } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

const articles: Article[] = [
  {
    slug: 'kundali-matching-complete-guide',
    title: 'Kundali Matching: The Complete Guide to Vedic Marriage Compatibility',
    excerpt:
      'Everything you need to know about Kundali Milan — from the 8 Kootas and how they are scored, to the common mistakes families make and how modern technology has transformed the ancient practice. A definitive reference for anyone navigating an arranged marriage process.',
    category: 'Kundali Matching',
    date: 'March 20, 2026',
    readTime: '12 min',
    featured: true,
  },
  {
    slug: 'mangal-dosha-myths-facts',
    title: 'Mangal Dosha: 7 Biggest Myths Debunked (And What Actually Matters)',
    excerpt:
      'Is Mangal Dosha really as dangerous as people claim? We examine 7 widespread myths, 15+ cancellation rules, and what modern astrologers actually say about Mars affliction in marriage charts.',
    category: 'Doshas',
    date: 'March 15, 2026',
    readTime: '8 min',
  },
  {
    slug: 'when-will-i-get-married-astrology',
    title: 'When Will I Get Married? How Vedic Astrology Predicts Marriage Timing',
    excerpt:
      'Vedic astrologers use 5 interlocking methods — Vimshottari Dasha, Jupiter & Saturn transits, KP 2-7-11 rule, and Jaimini Chara Dasha — to narrow down the most probable window for marriage.',
    category: 'Marriage Timing',
    date: 'March 10, 2026',
    readTime: '10 min',
  },
  {
    slug: 'vedic-vs-western-astrology-marriage',
    title: 'Vedic vs Western Astrology for Marriage Compatibility: Key Differences',
    excerpt:
      'Sidereal vs tropical, synastry vs Ashtakoot, composite charts vs divisional charts — a clear comparison of how the two great astrological traditions approach marriage compatibility differently.',
    category: 'Astrology Basics',
    date: 'March 5, 2026',
    readTime: '9 min',
  },
  {
    slug: 'nadi-dosha-complete-guide',
    title: 'Nadi Dosha: Complete Guide to Effects, Cancellations & Remedies',
    excerpt:
      'Nadi Dosha is the most feared incompatibility in Kundali matching. Learn the three Nadis, why same-Nadi marriage is discouraged, the 8 cancellation rules that nullify it, and the remedies prescribed by classical texts.',
    category: 'Doshas',
    date: 'February 28, 2026',
    readTime: '7 min',
  },
];

const categories = ['All', 'Kundali Matching', 'Marriage Timing', 'Doshas', 'Astrology Basics'];

const categoryColors: Record<string, string> = {
  'Kundali Matching': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  'Marriage Timing': 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  Doshas: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  'Astrology Basics': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
};

export const BlogIndexPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const featuredArticle = articles.find((a) => a.featured)!;
  const remainingArticles = articles.filter((a) => !a.featured);

  const filteredRemaining =
    activeCategory === 'All'
      ? remainingArticles
      : remainingArticles.filter((a) => a.category === activeCategory);

  const showFeatured = activeCategory === 'All' || featuredArticle.category === activeCategory;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 transition-colors duration-500">
      <SEOHead
        title="Vedic Astrology & Marriage Blog | Astro Marriage"
        description="Expert articles on Kundali matching, marriage timing, Mangal Dosha, and Vedic compatibility. Learn how ancient astrology predicts modern relationships."
        path="/blog"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
          >
            ← Home
          </Link>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Free Kundali Matching <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
            Astro Marriage Blog
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
            Vedic Astrology &amp; Marriage Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Expert insights on Kundali matching, marriage timing, and Vedic compatibility — grounded in classical texts and explained in plain language.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        {showFeatured && (
          <Link
            to={`/blog/${featuredArticle.slug}`}
            className="group block mb-10 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xl transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 h-48 sm:h-64 flex items-center justify-center px-8">
              <div className="text-center">
                <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-2">
                  Featured Article
                </p>
                <p className="text-white/90 text-4xl font-bold">Kundali Matching</p>
                <p className="text-white/70 text-lg mt-1">The Complete Guide</p>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${categoryColors[featuredArticle.category]}`}
              >
                {featuredArticle.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                {featuredArticle.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {featuredArticle.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {featuredArticle.readTime} read
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold text-sm group-hover:gap-2 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Article Grid */}
        {filteredRemaining.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            {filteredRemaining.map((article) => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[article.category]}`}
                  >
                    <Tag className="w-3 h-3" /> {article.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug flex-1">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {article.readTime}
                    </span>
                  </div>
                  <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium group-hover:underline">
                    Read →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredRemaining.length === 0 && !showFeatured && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">
            No articles in this category yet. Check back soon.
          </p>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Ready to Check Your Compatibility?
          </h2>
          <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
            Get a free, complete Kundali matching report — Ashtakoot score, dosha analysis, marriage timing, and personalized insights.
          </p>
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-700 font-semibold rounded-full hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Try Free Kundali Matching <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>

      <footer className="py-6 px-4 border-t border-gray-200 dark:border-gray-800 mt-8">
        <div className="max-w-5xl mx-auto text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          <p>&copy; 2026 Astro Marriage by NovaVentures AI. Content based on classical Vedic astrology texts.</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogIndexPage;
