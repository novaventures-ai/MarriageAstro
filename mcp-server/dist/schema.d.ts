/**
 * Shared Zod schemas for MCP tool inputs
 */
import { z } from 'zod';
export declare const BIRTH_DATA_SCHEMA: {
    name: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodEnum<{
        male: "male";
        female: "female";
        other: "other";
    }>>;
    date: z.ZodString;
    time: z.ZodOptional<z.ZodString>;
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    timezone: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
};
export declare const PAIR_SCHEMA: {
    person_a_name: z.ZodOptional<z.ZodString>;
    person_a_gender: z.ZodOptional<z.ZodEnum<{
        male: "male";
        female: "female";
        other: "other";
    }>>;
    person_a_date: z.ZodString;
    person_a_time: z.ZodOptional<z.ZodString>;
    person_a_latitude: z.ZodNumber;
    person_a_longitude: z.ZodNumber;
    person_a_timezone: z.ZodOptional<z.ZodString>;
    person_a_location: z.ZodOptional<z.ZodString>;
    person_b_name: z.ZodOptional<z.ZodString>;
    person_b_gender: z.ZodOptional<z.ZodEnum<{
        male: "male";
        female: "female";
        other: "other";
    }>>;
    person_b_date: z.ZodOptional<z.ZodString>;
    person_b_time: z.ZodOptional<z.ZodString>;
    person_b_latitude: z.ZodOptional<z.ZodNumber>;
    person_b_longitude: z.ZodOptional<z.ZodNumber>;
    person_b_timezone: z.ZodOptional<z.ZodString>;
    person_b_location: z.ZodOptional<z.ZodString>;
};
export declare function birthDataToPayload(args: Record<string, unknown>): Record<string, unknown>;
export declare function pairToPayload(args: Record<string, unknown>): Record<string, unknown>;
//# sourceMappingURL=schema.d.ts.map