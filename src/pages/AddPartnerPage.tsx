/**
 * Add Partner Page
 * Page for adding a new partner for comparison with Google Maps autocomplete
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { ArrowLeft, Loader2, UserPlus, Heart } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import PlaceAutocomplete from '../components/PlaceAutocomplete';

export const AddPartnerPage: React.FC = () => {
  const navigate = useNavigate();
  const { addPartner, partners } = useUserProfileStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'female' as 'male' | 'female' | 'other',
    dateOfBirth: '',
    timeOfBirth: '',
    location: '',
    latitude: '',
    longitude: '',
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
      latitude: place.latitude.toString(),
      longitude: place.longitude.toString(),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const partnerData = {
        name: formData.name,
        gender: formData.gender,
        dateOfBirth: new Date(formData.dateOfBirth),
        timeOfBirth: formData.timeOfBirth,
        location: formData.location,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        timezone: formData.timezone
      };

      const partnerId = await addPartner(partnerData);
      
      // Navigate back to dashboard
      navigate('/');
    } catch (error) {
      console.error('Failed to add partner:', error);
      alert('Failed to add partner. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Add Partner
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Save a partner for quick compatibility checks
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Info Card */}
        <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-pink-800 dark:text-pink-200">
                Why add partners?
              </h3>
              <p className="text-sm text-pink-700 dark:text-pink-300 mt-1">
                Save potential partners to quickly check compatibility, compare charts, 
                and see detailed analysis without re-entering birth data each time.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Partner's Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter partner's name"
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
                    className={`py-3 px-4 rounded-lg border capitalize transition-all ${
                      formData.gender === gender
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-pink-400'
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500"
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                If unsure, use 12:00 PM as approximate
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
                placeholder="Enter partner's birth city"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Start typing to search for the city
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
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500"
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
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500"
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-pink-500"
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

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Add Partner
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Partners List Preview */}
        {partners.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Your Saved Partners ({partners.length})
            </h3>
            <div className="space-y-3">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                      <span className="font-bold text-pink-600">
                        {partner.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-100">
                        {partner.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {partner.gender} • {new Date(partner.dateOfBirth).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/quick-compare/${partner.id}`)}
                    className="px-4 py-2 text-sm text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-colors"
                  >
                    Compare
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AddPartnerPage;
