/**
 * Landing Page
 * Marketing/onboarding page for new/logged-out users
 * Redirects users with existing profiles to the dashboard
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Stars, Sparkles, ArrowRight, User, ChevronRight, LayoutDashboard, ChevronDown, ChevronUp } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { AuthButton } from '../components/ui/AuthButton';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/ui/Logo';
import { SEOHead } from '../components/SEOHead';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selfChart } = useUserProfileStore();
  const { user, isLoading } = useAuth();

  const { partners } = useUserProfileStore();

  // Auto-redirect logged-in users with any profile data to dashboard
  // Skip redirect if user explicitly navigated here (e.g. "Back to Home")
  const skipRedirect = (location.state as { fromDashboard?: boolean })?.fromDashboard === true;
  useEffect(() => {
    if (!skipRedirect && !isLoading && user && (selfChart || partners.length > 0)) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, selfChart, partners, isLoading, navigate, skipRedirect]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <SEOHead
        title="Free Kundali Matching & Vedic Marriage Compatibility Online"
        description="Free online Kundali matching & marriage compatibility analysis. Ashtakoot Milan 36-point scoring, marriage timing prediction, spouse characteristics & personalized remedies."
        path="/"
      />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur-md dark:bg-black/10 transition-colors duration-500 safe-area-x">
        <Logo size="sm" className="sm:hidden" />
        <Logo size="md" className="hidden sm:block" />
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dashboard button for logged-in users who haven't been redirected */}
          {user && selfChart && (
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          )}
          <AuthButton />
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
            Unlock the secrets of your marriage timing, spouse characteristics, and relationship potential through Vedic astrology
          </p>

          {/* Mode Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12 px-2 sm:px-0">
            {/* Self Analysis Card */}
            <div
              onClick={() => navigate('/self-calculator')}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 sm:p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-500"
            >
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3">
                Self Analysis
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                Analyze your own marriage timing, discover your future spouse&apos;s characteristics, and get personalized remedies
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
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3">
                Compatibility Check
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                Compare birth charts with your partner using our comprehensive 36-point Vedic matching system
              </p>
              <button className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-full group-hover:shadow-lg transition-all text-sm sm:text-base">
                Check Compatibility
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner - citable facts for AI engines */}
      <section className="py-8 sm:py-12 px-3 sm:px-4 bg-white/30 dark:bg-black/10 border-y border-gray-200/50 dark:border-gray-700/50 safe-area-x">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">9</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Vedic Planets Analyzed</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">27</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Nakshatras Mapped</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-pink-600 dark:text-pink-400">8</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Kootas Evaluated</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">36</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Points Compatibility Score</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-white/50 dark:bg-black/20 transition-colors duration-500 safe-area-x">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-10 sm:mb-16 transition-colors duration-500">
            Comprehensive Analysis
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 sm:gap-8">
            <FeatureCard
              icon={<User className="w-6 h-6 sm:w-8 text-purple-600 dark:text-purple-400" />}
              title="Self Analysis"
              description="Discover your marriage timing, spouse prediction, and personal remedies"
            />
            <FeatureCard
              icon={<Stars className="w-6 h-6 sm:w-8 text-indigo-600 dark:text-indigo-400" />}
              title="Ashtakoot Milan"
              description="Traditional 36-point compatibility scoring with cancellation rules"
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6 sm:w-8 text-pink-500 dark:text-pink-400" />}
              title="Physical Health & Vitality"
              description="In-depth analysis of physical compatibility and vitality"
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 sm:w-8 text-amber-500 dark:text-amber-400" />}
              title="Timing Prediction"
              description="Favorable marriage windows using Dasha and transit analysis"
            />
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
              title="Create Your Profile"
              description="Enter your birth details to generate your complete Vedic birth chart"
            />
            <StepCard
              number="2"
              description="Get detailed analysis of your marriage timing, spouse characteristics, and potential challenges"
              title="Get Analysis"
            />
            <StepCard
              number="3"
              description="Follow personalized remedies and compare with partners for compatibility"
              title="Take Action"
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
              answer="Yes, Astro Marriage is completely free. You can generate your birth chart, check marriage compatibility using Ashtakoot Milan (36-point scoring), get marriage timing predictions, analyze spouse characteristics, and compare multiple partner charts — all at no cost."
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
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-3 sm:px-4 border-t border-gray-200 dark:border-gray-800 safe-area-x">
        <div className="max-w-6xl mx-auto text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          <p> 2024 Astro Marriage. Discover your cosmic destiny.</p>
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

export default LandingPage;
