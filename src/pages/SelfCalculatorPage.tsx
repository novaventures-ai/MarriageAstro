/**
 * Self Calculator Page
 * Page for entering single person's birth data with Google Maps autocomplete
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { ArrowLeft, Loader2, Sparkles, User } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import PlaceAutocomplete from '../components/PlaceAutocomplete';
import { Logo } from '../components/ui/Logo';
import { SEOHead } from '../components/SEOHead';

// Birth data form component with Google Maps autocomplete
const BirthDataForm: React.FC<{
  onSubmit: (data: any) => void;
  isLoading: boolean;
}> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as 'male' | 'female' | 'other',
    dateOfBirth: '',
    timeOfBirth: '',
    location: '',
    latitude: 0,
    longitude: 0,
    timezone: ''
  });

  const handlePlaceSelect = (place: {
    name: string;
    latitude: number;
    longitude: number;
    formattedAddress: string;
    timezone?: string;
  }) => {
    setFormData({
      ...formData,
      location: place.formattedAddress,
      latitude: place.latitude,
      longitude: place.longitude,
      // Try to guess timezone based on longitude if not provided
      timezone: place.timezone || guessTimezone(place.longitude)
    });
  };

  const guessTimezone = (longitude: number): string => {
    // Rough timezone estimation based on longitude
    if (longitude >= 68 && longitude <= 90) return 'Asia/Kolkata';
    if (longitude >= -125 && longitude <= -115) return 'America/Los_Angeles';
    if (longitude >= -105 && longitude <= -95) return 'America/Denver';
    if (longitude >= -95 && longitude <= -85) return 'America/Chicago';
    if (longitude >= -85 && longitude <= -70) return 'America/New_York';
    if (longitude >= -10 && longitude <= 0) return 'Europe/London';
    if (longitude >= 0 && longitude <= 15) return 'Europe/Paris';
    if (longitude >= 55 && longitude <= 60) return 'Asia/Dubai';
    if (longitude >= 103 && longitude <= 105) return 'Asia/Singapore';
    if (longitude >= 150 && longitude <= 155) return 'Australia/Sydney';
    return '';
  };

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    if (!formData.name.trim() || formData.name.trim().length > 100) {
      errors.push('Name must be between 1 and 100 characters.');
    }
    if (formData.latitude < -90 || formData.latitude > 90) {
      errors.push('Latitude must be between -90 and 90.');
    }
    if (formData.longitude < -180 || formData.longitude > 180) {
      errors.push('Longitude must be between -180 and 180.');
    }
    if (!formData.dateOfBirth) {
      errors.push('Date of birth is required.');
    }
    if (!formData.timeOfBirth) {
      errors.push('Time of birth is required.');
    }
    if (!formData.timezone) {
      errors.push('Timezone is required.');
    }
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    onSubmit({
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationErrors.length > 0 && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          {validationErrors.map((err, i) => (
            <p key={i} className="text-red-700 dark:text-red-400 text-sm">{err}</p>
          ))}
        </div>
      )}
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter your full name"
          maxLength={100}
          required
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Gender
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['male', 'female', 'other'].map((gender) => (
            <button
              key={gender}
              type="button"
              onClick={() => setFormData({ ...formData, gender: gender as any })}
              className={`py-3 px-4 rounded-lg border capitalize transition-all ${formData.gender === gender
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-400'
                }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date of Birth
        </label>
        <input
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      {/* Time of Birth */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Time of Birth
        </label>
        <input
          type="time"
          value={formData.timeOfBirth}
          onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          If unsure, use 12:00 PM (noon) as approximate
        </p>
      </div>

      {/* Birth Location with Google Maps Autocomplete */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Birth Location
        </label>
        <PlaceAutocomplete
          value={formData.location}
          onPlaceSelect={handlePlaceSelect}
          placeholder="Enter your birth city"
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Start typing to search for your city
        </p>
      </div>

      {/* Coordinates - Auto-filled from Google Maps */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            min="-90"
            max="90"
            value={formData.latitude || ''}
            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Auto-filled from location"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            min="-180"
            max="180"
            value={formData.longitude || ''}
            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Auto-filled from location"
            required
          />
        </div>
      </div>

      {/* Timezone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Timezone
        </label>
        <select
          value={formData.timezone}
          onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="">Select timezone</option>
          <option value="Asia/Kolkata">India (IST)</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="Europe/London">London (GMT)</option>
          <option value="Europe/Paris">Paris (CET)</option>
          <option value="Asia/Dubai">Dubai (GST)</option>
          <option value="Asia/Singapore">Singapore (SGT)</option>
          <option value="Australia/Sydney">Sydney (AEST)</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating Analysis...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate My Marriage Analysis
          </>
        )}
      </button>
    </form>
  );
};

export const SelfCalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    setSelfBirthData,
    generateSelfReport,
    isGeneratingReport,
    generationError,
    selfReport
  } = useUserProfileStore();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    setSubmitError(null);
    try {
      // Convert date back to string format expected by the calculation engine
      // Set birth data (this also generates chart)
      await setSelfBirthData(data);

      // Generate full report
      await generateSelfReport();

      // Navigate to report page
      navigate('/self-report');
    } catch (error: any) {
      console.error('Failed to generate report:', error instanceof Error ? error.message : 'Unknown error');
      setSubmitError(error.message || 'Failed to generate report. Please check your birth data and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SEOHead
        title="Marriage Analysis - Enter Birth Details"
        description="Enter your birth details to get a complete Vedic astrology marriage analysis. Marriage timing prediction, spouse characteristics, Mangal Dosha check & personalized remedies."
        path="/self-calculator"
      />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-1 group transition-transform"
            >
              <Logo size="sm" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Self Analysis
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Discover your marriage potential
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Logo size="xl" showText={false} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Your Cosmic Marriage Profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Enter your birth details to unlock insights about your marriage timing,
            spouse characteristics, and relationship potential.
          </p>
        </div>

        {/* Error Display */}
        {generationError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400 text-sm">
              {generationError}
            </p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          <BirthDataForm
            onSubmit={handleSubmit}
            isLoading={isGeneratingReport}
          />
        </div>

        {/* Features Preview */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon="💍"
            title="Marriage Timing"
            description="Know when you're most likely to get married"
          />
          <FeatureCard
            icon="👤"
            title="Spouse Profile"
            description="Discover characteristics of your future partner"
          />
          <FeatureCard
            icon="✨"
            title="Personal Remedies"
            description="Get personalized solutions for any challenges"
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({
  icon,
  title,
  description
}) => (
  <div className="text-center p-4">
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

export default SelfCalculatorPage;
