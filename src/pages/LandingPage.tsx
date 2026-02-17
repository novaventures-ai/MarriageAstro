/**
 * Landing Page
 * Updated with Self Mode and User Dashboard
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Stars, Sparkles, ArrowRight, Scale, User, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { AuthButton } from '../components/ui/AuthButton';
import { SavedReportsPanel } from '../components/ui/SavedReportsPanel';
import { UserDashboard } from '../components/dashboard/UserDashboard';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { Logo } from '../components/ui/Logo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { selfChart } = useUserProfileStore();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur-md dark:bg-black/10 transition-colors duration-500">
        <Logo size="md" />
        <div className="flex items-center gap-3">
          <AuthButton />
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-32 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <Logo size="xl" showText={false} className="hover:scale-105 transition-transform duration-500" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-6 transition-all duration-500">
            Discover Your Cosmic Destiny
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto transition-colors duration-500">
            Unlock the secrets of your marriage timing, spouse characteristics, and relationship potential through Vedic astrology
          </p>

          {/* Mode Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {/* Self Analysis Card */}
            <div
              onClick={() => navigate('/self-calculator')}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-500"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform">
                <User className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                Self Analysis
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Analyze your own marriage timing, discover your future spouse's characteristics, and get personalized remedies
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full group-hover:shadow-lg transition-all">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Compatibility Check Card */}
            <div
              onClick={() => navigate('/calculator')}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-pink-500"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                Compatibility Check
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Compare birth charts with your partner using our comprehensive 36-point Vedic matching system
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-full group-hover:shadow-lg transition-all">
                Check Compatibility
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Quick Actions for Existing Users */}
          {selfChart && (
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('/self-report')}
                className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-purple-600 dark:text-purple-400 font-semibold rounded-full shadow-md hover:shadow-lg border border-purple-200 dark:border-purple-700 transition-all"
              >
                View My Analysis
              </button>
              <button
                onClick={() => navigate('/add-partner')}
                className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-pink-600 dark:text-pink-400 font-semibold rounded-full shadow-md hover:shadow-lg border border-pink-200 dark:border-pink-700 transition-all"
              >
                Add Partner
              </button>
              <button
                onClick={() => navigate('/comparison')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 font-semibold rounded-full shadow-md hover:shadow-lg border border-indigo-200 dark:border-indigo-700 transition-all"
              >
                <Scale className="w-5 h-5" />
                Compare Partners
              </button>
            </div>
          )}
        </div>
      </section>

      {/* User Dashboard - Shows if user has profile */}
      <UserDashboard />

      {/* Saved Reports (only visible for logged-in users) */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <SavedReportsPanel />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-black/20 transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-16 transition-colors duration-500">
            Comprehensive Analysis
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<User className="w-8 h-8 text-purple-600 dark:text-purple-400" />}
              title="Self Analysis"
              description="Discover your marriage timing, spouse prediction, and personal remedies"
            />
            <FeatureCard
              icon={<Stars className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />}
              title="Ashtakoot Milan"
              description="Traditional 36-point compatibility scoring with cancellation rules"
            />
            <FeatureCard
              icon={<Heart className="w-8 h-8 text-pink-500 dark:text-pink-400" />}
              title="Physical Health & Vitality"
              description="In-depth analysis of physical compatibility and vitality"
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-amber-500 dark:text-amber-400" />}
              title="Timing Prediction"
              description="Favorable marriage windows using Dasha and transit analysis"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
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

      {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-transparent to-purple-50 dark:to-purple-900/10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-500">
            Ready to Discover Your Marriage Potential?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 transition-colors duration-500">
            Join thousands who have found clarity about their marriage journey through Vedic astrology
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/self-calculator')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Self Analysis
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/calculator')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-full shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-all duration-300"
            >
              Check Compatibility
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2024 Astro Marriage. Discover your cosmic destiny.</p>
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
  <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-500">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-500">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-500">{description}</p>
  </div>
);

const StepCard: React.FC<{
  number: string;
  title: string;
  description: string;
}> = ({ number, title, description }) => (
  <div className="text-center p-6">
    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

export default LandingPage;
