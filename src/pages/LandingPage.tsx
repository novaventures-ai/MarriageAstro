/**
 * Landing Page
 * Marketing/onboarding page — always accessible to all users
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Stars, Sparkles, ArrowRight, User, ChevronRight, LayoutDashboard, ChevronDown, ChevronUp, Shield, Brain, Flame, Clock, Swords, Eye, Zap, Target, Check, X, Lock, Crown, Star, Quote, Play } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { AuthButton } from '../components/ui/AuthButton';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/ui/Logo';
import { GoogleTranslate } from '../components/ui/GoogleTranslate';
import { SEOHead } from '../components/SEOHead';
import { useUserProfileStore } from '../store/useUserProfileStore';

const WELCOME_BACK_CONFIG = {
  searcher: {
    bg: 'bg-indigo-600',
    text: 'Welcome back — your marriage timing analysis is waiting.',
    cta: 'View My Timing \u2192',
    href: '/dashboard/self-analysis',
  },
  decider: {
    bg: 'bg-rose-600',
    text: 'Welcome back — your compatibility verdict is ready.',
    cta: 'View Verdict \u2192',
    href: '/dashboard/compatibility',
  },
  navigator: {
    bg: 'bg-emerald-600',
    text: 'Welcome back — check your couple\u2019s monthly pulse.',
    cta: 'View Pulse \u2192',
    href: '/dashboard/compatibility',
  },
} as const;

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userMode } = useUserProfileStore();
  const [dismissed, setDismissed] = useState(false);

  const welcomeConfig = userMode && !dismissed ? WELCOME_BACK_CONFIG[userMode] : null;

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <SEOHead
        title="Free Kundali Matching & Vedic Marriage Compatibility Online"
        description="Free online Kundali matching & marriage compatibility analysis. Ashtakoot Milan 36-point scoring, marriage timing prediction, spouse characteristics & personalized remedies."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebApplication',
              name: 'Astro Marriage',
              url: 'https://marriage-astro.vercel.app',
              description: 'Free Vedic astrology marriage compatibility analysis. Ashtakoot Milan, KP astrology, marriage timing, and spouse predictions.',
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
              },
            },
            {
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is Kundali matching?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Kundali matching (Guna Milan) is a Vedic astrology method to assess marriage compatibility by comparing the birth charts of two individuals across 8 kootas (categories), giving a maximum score of 36 points.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What is a good Ashtakoot score for marriage?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'A score of 18 or above out of 36 is generally considered acceptable for marriage. Scores above 28 indicate an excellent match. Scores below 18 are considered inauspicious.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is Astro Marriage free to use?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! Core features including Ashtakoot Milan, marriage potential score, psychological profile, and 3 AI queries per day are completely free. Premium features like detailed risk analysis and unlimited AI chat require a subscription.',
                  },
                },
              ],
            },
          ],
        }}
      />

      {/* Welcome-back strip — shown above the hero for returning users */}
      {welcomeConfig && (
        <div className={`${welcomeConfig.bg} text-white px-4 py-2.5 flex items-center justify-between gap-4 z-40`}>
          <div className="flex items-center gap-3 flex-1 justify-center flex-wrap">
            <span className="text-sm font-medium">{welcomeConfig.text}</span>
            <button
              onClick={() => navigate(welcomeConfig.href)}
              className="text-sm font-semibold underline underline-offset-2 hover:no-underline whitespace-nowrap"
            >
              {welcomeConfig.cta}
            </button>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss welcome banner"
            className="flex-shrink-0 p-1 rounded hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur-md dark:bg-black/10 transition-colors duration-500 safe-area-x">
        <Logo size="sm" className="sm:hidden" />
        <Logo size="md" className="hidden sm:block" />
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dashboard button for logged-in users */}
          {user && (
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          )}
          <AuthButton />
          <GoogleTranslate />
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 sm:py-24 md:py-32 text-center safe-area-x">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex justify-center mb-6 sm:mb-8">
            <Logo size="lg" showText={false} className="hover:scale-105 transition-transform duration-500 sm:hidden" />
            <Logo size="xl" showText={false} className="hover:scale-105 transition-transform duration-500 hidden sm:block" />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-4 sm:mb-6 transition-all duration-500 leading-tight">
            Discover Your Cosmic Destiny
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto transition-colors duration-500 px-2 sm:px-0">
            The world&apos;s most comprehensive marriage compatibility engine — Vedic, KP, Jaimini astrology fused with modern psychology
          </p>

          {/* Mode Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mb-4 sm:mb-6 px-2 sm:px-0">
            {/* Self Analysis Card */}
            <div
              onClick={() => navigate('/self-calculator')}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 sm:p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-500"
            >
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2">
                Self Analysis
              </h2>
              <p className="text-xs font-medium text-purple-500 dark:text-purple-400 mb-2 sm:mb-3">Single or just your own chart? Start here →</p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                Discover when you&apos;re likely to get married, what your future spouse will be like, and get personalized remedies for your chart
              </p>
              <button className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full group-hover:shadow-lg transition-all text-sm sm:text-base">
                Start Your Journey
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Compatibility Check Card */}
            <div
              onClick={() => navigate('/calculator')}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 sm:p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-pink-500"
            >
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2">
                Compatibility Check
              </h2>
              <p className="text-xs font-medium text-pink-500 dark:text-pink-400 mb-2 sm:mb-3">Have a partner in mind? Compare both charts →</p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                Compare two birth charts side-by-side — emotional bond, financial harmony, conflict patterns, and life after marriage
              </p>
              <button className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-full group-hover:shadow-lg transition-all text-sm sm:text-base">
                Check Compatibility
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          {/* What's the difference? */}
          <p className="text-xs text-center text-gray-400 dark:text-gray-500 mb-6 sm:mb-8">
            Not sure which to pick? <span className="text-indigo-500 font-medium">Self Analysis</span> = just your chart &nbsp;·&nbsp; <span className="text-pink-500 font-medium">Compatibility Check</span> = two charts compared
          </p>

          {/* Try Demo CTA — prominent secondary hero action */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => navigate('/demo')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <Play className="w-5 h-5" />
              Try Demo Free — No Sign-up Needed
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400">See a full compatibility report with sample profiles in 30 seconds</p>
          </div>
        </div>
      </section>

      {/* Stats Banner - citable facts for AI engines */}
      <section className="py-8 sm:py-12 px-3 sm:px-4 bg-white/30 dark:bg-black/10 border-y border-gray-200/50 dark:border-gray-700/50 safe-area-x">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">12</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Planets Analyzed</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">27</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Nakshatras Mapped</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-pink-400">36</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Points Compatibility</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">7</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Divisional Charts</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">14</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Yoni Types Profiled</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400">5</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Astrology Systems</p>
          </div>
        </div>
      </section>

      {/* Your Cosmic Journey - Realistic Guide */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 safe-area-x">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-3 sm:mb-4">
            Your Cosmic Journey
          </h2>
          <p className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-10 sm:mb-14 max-w-2xl mx-auto">
            From birth details to cosmic clarity — here&apos;s how it works in practice
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <GuideStepCard
              step={1}
              icon={<Sparkles className="w-6 h-6" />}
              title="Choose Your Path"
              description="Start with Self Analysis to discover your marriage timing & spouse traits, or Compatibility Check to compare two charts."
              color="purple"
            />
            <GuideStepCard
              step={2}
              icon={<Clock className="w-6 h-6" />}
              title="Enter Birth Details"
              description="Just date, time & place of birth. Our Swiss Ephemeris engine calculates precise planetary positions instantly."
              color="indigo"
            />
            <GuideStepCard
              step={3}
              icon={<Eye className="w-6 h-6" />}
              title="Explore Your Report"
              description="Navigate 38+ analysis modules — compatibility scores, psychological profiles, risk radars, timing windows — all in one cosmic dashboard."
              color="pink"
            />
            <GuideStepCard
              step={4}
              icon={<Brain className="w-6 h-6" />}
              title="Ask the AI Astrologer"
              description="Chat with AI for personalized insights, follow-up questions, and remedies tailored to your unique chart."
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* Features Section - Core Modules */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-white/50 dark:bg-black/20 transition-colors duration-500 safe-area-x">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 transition-colors duration-500">
            Comprehensive Analysis
          </h2>
          <p className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-10 sm:mb-16 max-w-2xl mx-auto">
            The deepest marriage compatibility engine — combining Vedic, KP, Jaimini & modern psychology
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <FeatureCard
              icon={<User className="w-6 h-6 sm:w-8 text-purple-600 dark:text-purple-400" />}
              title="Self Analysis"
              description="Marriage timing prediction, spouse characteristics via Darakaraka, and personalized Vedic remedies"
            />
            <FeatureCard
              icon={<Stars className="w-6 h-6 sm:w-8 text-indigo-600 dark:text-indigo-400" />}
              title="Ashtakoot Milan"
              description="36-point Vedic scoring across 8 Kootas with Nadi & Bhakoot dosha cancellation rules"
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6 sm:w-8 text-pink-500 dark:text-pink-400" />}
              title="Synastry Analysis"
              description="Soulmate connections, karmic bonds, house overlays in D1 & D9, and AI soul purpose decoding"
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6 sm:w-8 text-amber-500 dark:text-amber-400" />}
              title="Marriage Timing"
              description="Vimshottari & Chara Dasha windows with Jupiter/Venus transit analysis and confidence scores"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
            <FeatureCard
              icon={<Shield className="w-6 h-6 sm:w-8 text-red-500 dark:text-red-400" />}
              title="Divorce Risk Radar"
              description="Risk scoring with Manglik analysis, modern challenges, and protective factor buffers"
            />
            <FeatureCard
              icon={<Eye className="w-6 h-6 sm:w-8 text-orange-500 dark:text-orange-400" />}
              title="Infidelity Analysis"
              description="Venus-Rahu, 5th-12th house, afflicted 7th lord indicators with KP affair formula detection"
            />
            <FeatureCard
              icon={<Flame className="w-6 h-6 sm:w-8 text-rose-500 dark:text-rose-400" />}
              title="Sexual Compatibility"
              description="14 Yoni types with drive/stamina profiling, Nakshatra lord analysis, and health assessments"
            />
            <FeatureCard
              icon={<Swords className="w-6 h-6 sm:w-8 text-slate-500 dark:text-slate-400" />}
              title="Conflict Zones"
              description="Partner-attributed conflicts across family, finance, ideology & behavior with severity mapping"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
            <FeatureCard
              icon={<Brain className="w-6 h-6 sm:w-8 text-cyan-500 dark:text-cyan-400" />}
              title="Mental Health Profiling"
              description="Depression, anxiety & personality pattern detection — Borderline, Narcissistic, Dissociative"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 sm:w-8 text-yellow-500 dark:text-yellow-400" />}
              title="KP Astrology"
              description="7th cusp sub lord analysis, 2-7-11 marriage promise rule, and significator chain mapping"
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 sm:w-8 text-violet-500 dark:text-violet-400" />}
              title="Divisional Charts"
              description="D1, D7, D9, D10, D12, D60 analysis with Vargottama, Pushkar Navamsa & Vimsopaka scoring"
            />
            <FeatureCard
              icon={<Target className="w-6 h-6 sm:w-8 text-emerald-500 dark:text-emerald-400" />}
              title="Addiction & Risk"
              description="Alcohol, substance, sexual addiction and compulsive behavior risk assessment from chart indicators"
            />
          </div>
        </div>
      </section>

      {/* Use Cases - Who Benefits */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 safe-area-x">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-3 sm:mb-4">
            Who Benefits from Cosmic Insights?
          </h2>
          <p className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-10 sm:mb-14 max-w-2xl mx-auto">
            Whether you&apos;re single, a parent, or in a relationship — the stars have something for you
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UseCaseCard
              icon={<User className="w-7 h-7 text-purple-600 dark:text-purple-400" />}
              title="Singles Exploring Timing"
              description="Discover your ideal marriage windows through Dasha analysis, learn about your future spouse through Darakaraka, and get personalized remedies to strengthen your 7th house."
              ctaText="Start Self Analysis"
              ctaPath="/self-calculator"
              color="purple"
            />
            <UseCaseCard
              icon={<Shield className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />}
              title="Parents Matching Kundalis"
              description="Go beyond basic 36-point matching. Check Mangal Dosha with cancellation rules, verify Nadi compatibility, and assess long-term risk factors like mental health and conflict patterns."
              ctaText="Check Compatibility"
              ctaPath="/calculator"
              color="indigo"
            />
            <UseCaseCard
              icon={<Heart className="w-7 h-7 text-pink-600 dark:text-pink-400" />}
              title="Couples Verifying Compatibility"
              description="Compare your charts across 100+ factors — sexual chemistry, psychological compatibility, conflict zones, and financial harmony. Get an honest cosmic assessment before you commit."
              ctaText="Compare Charts"
              ctaPath="/calculator"
              color="pink"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us - Comparison Table */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-white/50 dark:bg-black/20 safe-area-x">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-3">
            Why Choose Astro Marriage?
          </h2>
          <p className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto">
            Most apps give you a basic Ashtakoot score. We go 10x deeper.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/80">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Feature</th>
                  <th className="text-center px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">Astro Marriage</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">Others</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  ['Ashtakoot Milan (36 pts)', true, true],
                  ['KP + Jaimini + Nadi Systems', true, false],
                  ['Divorce & Infidelity Risk Analysis', true, false],
                  ['Sexual Compatibility (14 Yoni)', true, false],
                  ['Mental Health & Addiction Profiling', true, false],
                  ['AI-Powered Insights Chat', true, false],
                  ['Vulnerability Timeline', true, false],
                  ['7 Divisional Charts (D1-D60)', true, false],
                  ['Privacy: Client-Side Calculations', true, false],
                  ['Completely Free Core Features', true, false],
                ].map(([feature, us, others], i) => (
                  <tr key={i} className="bg-white dark:bg-gray-900/50">
                    <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{feature as string}</td>
                    <td className="text-center px-4 py-2.5">
                      {us ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                    </td>
                    <td className="text-center px-4 py-2.5">
                      {others ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-8 sm:py-10 px-3 sm:px-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 border-y border-indigo-100 dark:border-indigo-800/30 safe-area-x">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">100% Private</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Birth data calculated client-side. Nothing leaves your browser.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Zap className="w-8 h-8 text-amber-500 dark:text-amber-400" />
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Swiss Ephemeris Precision</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Professional-grade planetary calculations — the same engine used by leading astrology software worldwide.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Stars className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">38+ Analysis Modules</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">9 astrology systems fused with modern psychology — the deepest marriage analysis available free.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 safe-area-x">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center gap-2 mb-3 sm:mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100">
              What Our Users Say
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Free Beta — Early User Feedback
            </span>
          </div>
          <p className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-10 sm:mb-14 max-w-2xl mx-auto">
            Early users exploring their cosmic path with us
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              name="P.S."
              location="Mumbai"
              context="Matched kundalis before engagement"
              rating={5}
              quote="We had already done basic gun milan through a pandit, but the risk radar and psychological profiling here showed us conflict areas we never considered. The remedies section was genuinely helpful."
              initials="PS"
              color="purple"
            />
            <TestimonialCard
              name="A.K."
              location="Bangalore"
              context="Explored self-analysis for marriage timing"
              rating={4}
              quote="I was skeptical, but the marriage timing prediction lined up almost exactly with what two different astrologers told me independently. The AI chat feature is surprisingly good at explaining the reasoning."
              initials="AK"
              color="indigo"
            />
            <TestimonialCard
              name="M. & R."
              location="Delhi"
              context="Compared charts as a couple"
              rating={5}
              quote="The sexual compatibility and conflict zone analysis was eye-opening. Some of the patterns it identified were things we had already experienced. Much more detailed than any other free tool we tried."
              initials="MR"
              color="pink"
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-white/50 dark:bg-black/20 safe-area-x">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center gap-2 mb-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100">
              Simple, Transparent Pricing
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Free Beta — All core features free, premium launching soon
            </span>
          </div>
          <p className="text-center text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto">
            Everything you need is free today. Join the waitlist to get early access and a founding-member discount when premium launches.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900">
              <Sparkles className="w-8 h-8 text-gray-500 dark:text-gray-400 mb-3" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Free</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">₹0</p>
              <p className="text-sm text-gray-500 mb-4">forever</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Full Ashtakoot Milan (36 pts)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Marriage Potential Score</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Psychological Profile</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Basic Spouse Prediction</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> 3 AI Queries / Day</li>
              </ul>
            </div>
            {/* Premium */}
            <div className="rounded-2xl border-2 border-amber-400 dark:border-amber-500 p-6 bg-white dark:bg-gray-900 shadow-lg shadow-amber-500/10 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">Most Popular</span>
              <Crown className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Premium</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">₹399<span className="text-sm font-normal text-gray-500">/mo</span></p>
              <p className="text-sm text-gray-500 mb-4">or ₹49/section one-time</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Everything in Free</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Risk & Infidelity Details</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Sexual Compatibility Deep Dive</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Mental Health Analysis</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Unlimited AI Chat</li>
              </ul>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full mt-5 py-2.5 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors text-sm"
              >
                Join Beta Waitlist — Get 50% Off
              </button>
            </div>
            {/* Astrologer */}
            <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900">
              <Shield className="w-8 h-8 text-purple-500 dark:text-purple-400 mb-3" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Astrologer</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">₹1,499<span className="text-sm font-normal text-gray-500">/mo</span></p>
              <p className="text-sm text-gray-500 mb-4">for professionals</p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Everything in Premium</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Unlimited Profiles</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> API Access</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Client Management</li>
              </ul>
              <button
                onClick={() => navigate('/pricing')}
                className="w-full mt-5 py-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold rounded-lg text-sm"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 safe-area-x">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-10 sm:mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <StepCard
              number="1"
              title="Enter Birth Details"
              description="Provide date, time & place of birth — we calculate positions across 12 planets, 27 Nakshatras, and 7 divisional charts"
            />
            <StepCard
              number="2"
              description="Get 100+ compatibility factors analyzed — synastry, Ashtakoot Milan, sexual chemistry, risk radar, KP cusp analysis & conflict mapping"
              title="Deep Analysis"
            />
            <StepCard
              number="3"
              description="AI-powered insights, Vedic remedies, marriage timing windows, and partner comparison across every dimension"
              title="Actionable Results"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section - visible content for AI engines and SEO */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-white/50 dark:bg-black/20 safe-area-x">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8 sm:mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            <FAQItem
              question="What is Kundali matching for marriage?"
              answer="Kundali matching (also called Gun Milan or Ashtakoot Milan) is a Vedic astrology method that compares two birth charts to assess marriage compatibility. It evaluates 8 aspects (gunas) across 36 points — Varna (temperament), Vashya (dominance), Tara (destiny), Yoni (sexual compatibility), Graha Maitri (mental compatibility), Gana (nature), Bhakoot (health & wealth), and Nadi (genetic compatibility)."
            />
            <FAQItem
              question="How many points are needed for a good Kundali match?"
              answer="In Ashtakoot Milan, a score of 18 or above out of 36 is considered acceptable for marriage. Scores above 24 are considered good, and above 30 is excellent. However, the overall compatibility also depends on Mangal Dosha, Nadi Dosha cancellation rules, and planetary aspects between both charts."
            />
            <FAQItem
              question="Can astrology predict marriage timing?"
              answer="Vedic astrology uses the Vimshottari Dasha system (planetary periods) and transits of Jupiter and Saturn to predict favorable periods for marriage. The 7th house lord activation, Venus Dasha/Antardasha, and Navamsa (D9) chart analysis are key factors. Multiple favorable transits intersecting create 'marriage windows.'"
            />
            <FAQItem
              question="What is Mangal Dosha and does it affect marriage?"
              answer="Mangal Dosha (Kuja Dosha) occurs when Mars is placed in the 1st, 4th, 7th, 8th, or 12th house. It is believed to cause delays or difficulties in marriage. However, many cancellation rules exist — if both partners have Mangal Dosha, if Jupiter aspects Mars, or if Mars is in its own sign, the dosha is considered neutralized."
            />
            <FAQItem
              question="Is Astro Marriage free to use?"
              answer="Astro Marriage's core features are free forever — including Ashtakoot Milan (36-point scoring), marriage timing, spouse prediction, psychological profiling, and 3 AI queries per day. Premium unlocks detailed breakdowns for risk analysis, sexual compatibility, mental health, and unlimited AI chat starting at ₹49 per section."
            />
            <FAQItem
              question="What astrology systems does Astro Marriage use?"
              answer="Astro Marriage combines multiple Vedic systems for accuracy: Parashari (traditional), KP Astrology (Krishnamurti Paddhati), Jaimini (Chara Karakas for spouse prediction), and Bhrigu Nandi Nadi. It analyzes Rashi (D1), Navamsa (D9), and Dasamsa (D10) divisional charts using Swiss Ephemeris for precise planetary calculations."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 text-center bg-gradient-to-b from-transparent to-purple-50 dark:to-purple-900/10 safe-area-x">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 transition-colors duration-500">
            Ready to Discover Your Marriage Potential?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 transition-colors duration-500">
            Join thousands who have found clarity about their marriage journey through Vedic astrology
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/self-calculator')}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              Start Self Analysis
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => navigate('/calculator')}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-full shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              Check Compatibility
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => navigate('/demo')}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-indigo-600 dark:text-indigo-400 font-medium rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300 text-sm sm:text-base"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              Try Demo
            </button>
          </div>
        </div>
      </section>

      {/* Guides Section - internal links for GEO crawlability */}
      <section className="py-10 sm:py-16 px-3 sm:px-4 bg-white/30 dark:bg-black/10 safe-area-x">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-3">
            Learn Vedic Astrology
          </h2>
          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Explore our in-depth guides to understand the science behind every analysis
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Link to="/how-it-works" className="group p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">How It Works</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Our methodology & calculation systems</p>
            </Link>
            <Link to="/guides/ashtakoot-milan" className="group p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Ashtakoot Milan Guide</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Complete 36-point matching explained</p>
            </Link>
            <Link to="/guides/marriage-timing" className="group p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Marriage Timing</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dasha, transits & KP methods</p>
            </Link>
            <Link to="/guides/mangal-dosha" className="group p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Mangal Dosha Guide</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Meaning, cancellations & remedies</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-3 sm:px-4 border-t border-gray-200 dark:border-gray-800 bg-white/20 dark:bg-black/20 safe-area-x">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <Logo size="sm" className="mb-3" />
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                The most comprehensive Vedic marriage compatibility engine. Combining Parashari, KP, Jaimini & Nadi astrology with modern psychology.
              </p>
            </div>
            {/* Features */}
            <div>
              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-3">Features</h4>
              <ul className="space-y-1.5 text-xs">
                {[
                  { to: '/features', label: 'All Features' },
                  { to: '/features/divorce-risk', label: 'Divorce Risk Radar' },
                  { to: '/features/ashtakoot-milan', label: 'Ashtakoot Milan' },
                  { to: '/features/marriage-timing', label: 'Marriage Timing' },
                  { to: '/features/vulnerability-timeline', label: 'Vulnerability Timeline' },
                  { to: '/features/spouse-prediction', label: 'Spouse Prediction' },
                ].map(l => (
                  <li key={l.to}><Link to={l.to} className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
            {/* Guides */}
            <div>
              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-3">Guides</h4>
              <ul className="space-y-1.5 text-xs">
                {[
                  { to: '/how-it-works', label: 'How It Works' },
                  { to: '/guides/ashtakoot-milan', label: 'Ashtakoot Milan Guide' },
                  { to: '/guides/marriage-timing', label: 'Marriage Timing Guide' },
                  { to: '/guides/mangal-dosha', label: 'Mangal Dosha Guide' },
                ].map(l => (
                  <li key={l.to}><Link to={l.to} className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
            {/* Blog */}
            <div>
              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-3">Blog</h4>
              <ul className="space-y-1.5 text-xs">
                {[
                  { to: '/blog', label: 'All Articles' },
                  { to: '/blog/kundali-matching-complete-guide', label: 'Kundali Matching Guide' },
                  { to: '/blog/mangal-dosha-myths-facts', label: 'Mangal Dosha Myths' },
                  { to: '/blog/when-will-i-get-married-astrology', label: 'Marriage Timing' },
                  { to: '/blog/nadi-dosha-complete-guide', label: 'Nadi Dosha Guide' },
                ].map(l => (
                  <li key={l.to}><Link to={l.to} className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-xs">
            <p>&copy; {new Date().getFullYear()} Astro Marriage by NovaVentures AI. Discover your cosmic destiny.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-500">
    <div className="mb-3 sm:mb-4">{icon}</div>
    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2 transition-colors duration-500">{title}</h3>
    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors duration-500">{description}</p>
  </div>
);

const StepCard: React.FC<{
  number: string;
  title: string;
  description: string;
}> = ({ number, title, description }) => (
  <div className="text-center p-4 sm:p-6">
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg sm:text-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
      {number}
    </div>
    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2">{title}</h3>
    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

const FAQItem: React.FC<{
  question: string;
  answer: string;
}> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 pr-4">
          {question}
        </h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <p className="faq-answer px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
};

const GuideStepCard: React.FC<{
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}> = ({ step, icon, title, description, color }) => {
  const colorMap: Record<string, { bg: string; text: string; badge: string }> = {
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', badge: 'from-purple-500 to-purple-600' },
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400', badge: 'from-indigo-500 to-indigo-600' },
    pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400', badge: 'from-pink-500 to-pink-600' },
    amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', badge: 'from-amber-500 to-amber-600' },
  };
  const c = colorMap[color] || colorMap.purple;

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 sm:p-6">
      <div className={`absolute -top-3 -left-2 w-8 h-8 rounded-full bg-gradient-to-br ${c.badge} text-white text-sm font-bold flex items-center justify-center shadow-md`}>
        {step}
      </div>
      <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center mb-4 mt-2 ${c.text}`}>
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
};

const UseCaseCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaText: string;
  ctaPath: string;
  color: string;
}> = ({ icon, title, description, ctaText, ctaPath, color }) => {
  const colorMap: Record<string, { border: string; gradient: string }> = {
    purple: { border: 'hover:border-purple-500', gradient: 'from-purple-600 to-indigo-600' },
    indigo: { border: 'hover:border-indigo-500', gradient: 'from-indigo-600 to-blue-600' },
    pink: { border: 'hover:border-pink-500', gradient: 'from-pink-500 to-rose-600' },
  };
  const c = colorMap[color] || colorMap.purple;

  return (
    <Link
      to={ctaPath}
      className={`group flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-transparent ${c.border} transition-all duration-300 hover:shadow-xl`}
    >
      <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-grow">{description}</p>
      <span className={`inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r ${c.gradient} text-white font-semibold rounded-xl group-hover:shadow-lg transition-all text-sm`}>
        {ctaText}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </span>
    </Link>
  );
};

const TestimonialCard: React.FC<{
  name: string;
  location: string;
  context: string;
  rating: number;
  quote: string;
  initials: string;
  color: string;
}> = ({ name, location, context, rating, quote, initials, color }) => {
  const gradientMap: Record<string, string> = {
    purple: 'from-purple-500 to-indigo-600',
    indigo: 'from-indigo-500 to-blue-600',
    pink: 'from-pink-500 to-rose-600',
  };
  const gradient = gradientMap[color] || gradientMap.purple;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
          />
        ))}
      </div>

      {/* Quote */}
      <div className="relative flex-grow mb-5">
        <Quote className="w-8 h-8 text-gray-200 dark:text-gray-700 absolute -top-1 -left-1" />
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic pl-6 relative z-10">
          {quote}
        </p>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{name}, {location}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{context}</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
