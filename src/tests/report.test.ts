

import { describe, it, expect, vi, beforeAll } from 'vitest';
import { generateFullCompatibilityReport } from '../../lib/reportGenerator';
import { BirthDataInput } from '../../types';
import fs from 'fs';
import path from 'path';

describe('Report Generation Diagnosis', () => {
    beforeAll(() => {
        // Mock fetch for swisseph.wasm
        global.fetch = vi.fn().mockImplementation((url) => {
            if (url === '/swisseph.wasm') {
                const wasmPath = path.resolve(__dirname, '../../public/swisseph.wasm');
                const wasmBuffer = fs.readFileSync(wasmPath);
                return Promise.resolve({
                    ok: true,
                    arrayBuffer: () => Promise.resolve(wasmBuffer.buffer.slice(wasmBuffer.byteOffset, wasmBuffer.byteOffset + wasmBuffer.byteLength))
                });
            }
            return Promise.reject(new Error(`Unhandled fetch to ${url}`));
        });
    });

    it('should generate a full compatibility report without throwing', async () => {

        const birthDataA: BirthDataInput = {
            name: "Person A",
            gender: "male",
            dateOfBirth: "1990-01-01",
            timeOfBirth: "10:00:00",
            location: "Mumbai, India",
            latitude: 19.0760,
            longitude: 72.8777,
            timezone: "5.5"
        };

        const birthDataB: BirthDataInput = {
            name: "Person B",
            gender: "female",
            dateOfBirth: "1992-05-15",
            timeOfBirth: "14:30:00",
            location: "Delhi, India",
            latitude: 28.6139,
            longitude: 77.2090,
            timezone: "5.5"
        };


        console.log('Starting report generation test...');
        try {
            const report = await generateFullCompatibilityReport(birthDataA, birthDataB);
            console.log('Report generated successfully!');
            expect(report).toBeDefined();
            expect(report.chartA).toBeDefined();
            expect(report.chartB).toBeDefined();
        } catch (error) {
            console.error('Report generation FAILED during test:');
            console.error(error);
            throw error;
        }
    });
});

