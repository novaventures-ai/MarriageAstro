/**
 * Shared Zod schemas for MCP tool inputs
 */
import { z } from 'zod';

const personSchema = {
  name: z.string().optional().describe("Person's name"),
  gender: z.enum(['male', 'female', 'other']).optional().describe("Gender (male/female/other)"),
  date: z.string().describe("Date of birth in YYYY-MM-DD format"),
  time: z.string().optional().describe("Time of birth in HH:MM format (24h, defaults to 12:00)"),
  latitude: z.number().describe("Birth place latitude (e.g. 19.076 for Mumbai)"),
  longitude: z.number().describe("Birth place longitude (e.g. 72.877 for Mumbai)"),
  timezone: z.string().optional().describe("Timezone name (e.g. 'Asia/Kolkata', defaults to UTC)"),
  location: z.string().optional().describe("Birth place name (e.g. 'Mumbai, India')"),
};

export const BIRTH_DATA_SCHEMA = personSchema;

export const PAIR_SCHEMA = {
  person_a_name: z.string().optional(),
  person_a_gender: z.enum(['male', 'female', 'other']).optional(),
  person_a_date: z.string().describe("Person A date of birth YYYY-MM-DD"),
  person_a_time: z.string().optional().describe("Person A time HH:MM"),
  person_a_latitude: z.number().describe("Person A birth latitude"),
  person_a_longitude: z.number().describe("Person A birth longitude"),
  person_a_timezone: z.string().optional(),
  person_a_location: z.string().optional(),

  person_b_name: z.string().optional(),
  person_b_gender: z.enum(['male', 'female', 'other']).optional(),
  person_b_date: z.string().optional().describe("Person B date of birth YYYY-MM-DD (omit for single-person analysis)"),
  person_b_time: z.string().optional(),
  person_b_latitude: z.number().optional(),
  person_b_longitude: z.number().optional(),
  person_b_timezone: z.string().optional(),
  person_b_location: z.string().optional(),
};

export function birthDataToPayload(args: Record<string, unknown>): Record<string, unknown> {
  return {
    name: args.name,
    gender: args.gender,
    date: args.date,
    time: args.time,
    latitude: args.latitude,
    longitude: args.longitude,
    timezone: args.timezone,
    location: args.location,
  };
}

export function pairToPayload(args: Record<string, unknown>): Record<string, unknown> {
  return args;
}
