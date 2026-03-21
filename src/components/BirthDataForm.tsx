import React, { useState } from 'react';
import { BirthDataInput } from '@types';
import PlaceAutocomplete from './PlaceAutocomplete';

interface BirthDataFormProps {
  onSubmit: (data: BirthDataInput) => void;
  defaultValues?: Partial<BirthDataInput>;
}

export const BirthDataForm: React.FC<BirthDataFormProps> = ({
  onSubmit,
  defaultValues
}) => {
  const [formData, setFormData] = useState<BirthDataInput>({
    name: defaultValues?.name || '',
    gender: defaultValues?.gender || 'male',
    dateOfBirth: defaultValues?.dateOfBirth || '',
    timeOfBirth: defaultValues?.timeOfBirth || '',
    location: defaultValues?.location || '',
    latitude: defaultValues?.latitude || 0,
    longitude: defaultValues?.longitude || 0,
    timezone: defaultValues?.timezone || 'Asia/Kolkata',
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateForm = (): string[] => {
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
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: BirthDataInput) => ({
      ...prev,
      [name]: name === 'latitude' || name === 'longitude' ? parseFloat(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {validationErrors.length > 0 && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          {validationErrors.map((err, i) => (
            <p key={i} className="text-red-700 dark:text-red-400 text-sm">{err}</p>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Name */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2 transition-colors">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-colors text-sm sm:text-base"
            placeholder="Enter name"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2 transition-colors">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-colors text-sm sm:text-base"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2 transition-colors">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth instanceof Date ? formData.dateOfBirth.toISOString().split('T')[0] : formData.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-colors text-sm sm:text-base [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>

        {/* Time of Birth */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2 transition-colors">
            Time of Birth
          </label>
          <input
            type="time"
            name="timeOfBirth"
            value={formData.timeOfBirth}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-colors text-sm sm:text-base [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2 transition-colors">
          Birth Location (City)
        </label>
        <PlaceAutocomplete
          value={formData.location}
          onPlaceSelect={(place) => {
            setFormData((prev: BirthDataInput) => ({
              ...prev,
              location: place.formattedAddress,
              latitude: place.latitude,
              longitude: place.longitude,
            }));
          }}
          placeholder="e.g., Mumbai, India"
        />
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2 transition-colors">
            Latitude
          </label>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            step="0.0001"
            min="-90"
            max="90"
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-colors text-sm sm:text-base"
            placeholder="e.g., 19.0760"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2 transition-colors">
            Longitude
          </label>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            step="0.0001"
            min="-180"
            max="180"
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-colors text-sm sm:text-base"
            placeholder="e.g., 72.8777"
          />
        </div>
      </div>

      {/* Timezone */}
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2 transition-colors">
          Timezone
        </label>
        <select
          name="timezone"
          value={formData.timezone}
          onChange={handleChange}
          required
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition-colors text-sm sm:text-base"
        >
          <option value="Asia/Kolkata">India (IST)</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="Europe/London">London (GMT)</option>
          <option value="Europe/Paris">Paris (CET)</option>
          <option value="Asia/Tokyo">Tokyo (JST)</option>
          <option value="Australia/Sydney">Sydney (AEST)</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all text-sm sm:text-base min-touch"
      >
        Continue
      </button>
    </form>
  );
};

export default BirthDataForm;
