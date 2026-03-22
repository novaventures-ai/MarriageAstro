/**
 * Demo Mode Data
 * Pre-configured birth data for demo profiles — realistic Indian names,
 * dates, and locations for showcasing all app features.
 */

import { BirthDataInput } from '../types';

// Self profile: Demo user (female, Pune)
export const DEMO_SELF: BirthDataInput = {
  name: 'Ananya Sharma',
  gender: 'female',
  dateOfBirth: '1997-03-15',
  timeOfBirth: '06:30',
  location: 'Pune, Maharashtra, India',
  latitude: 18.5204,
  longitude: 73.8567,
  timezone: 'Asia/Kolkata',
};

// Partner profiles for compatibility matching
export const DEMO_PARTNERS: BirthDataInput[] = [
  {
    name: 'Vikram Deshmukh',
    gender: 'male',
    dateOfBirth: '1995-08-22',
    timeOfBirth: '14:15',
    location: 'Mumbai, Maharashtra, India',
    latitude: 19.076,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata',
  },
  {
    name: 'Rohan Iyer',
    gender: 'male',
    dateOfBirth: '1996-12-05',
    timeOfBirth: '09:45',
    location: 'Bangalore, Karnataka, India',
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: 'Asia/Kolkata',
  },
  {
    name: 'Aditya Kapoor',
    gender: 'male',
    dateOfBirth: '1994-04-10',
    timeOfBirth: '21:00',
    location: 'Delhi, India',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 'Asia/Kolkata',
  },
];
