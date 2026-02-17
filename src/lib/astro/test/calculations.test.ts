import { describe, expect, it, beforeAll, vi } from "vitest";
import {
    generateBirthChart,
    generateFullChartData,
    ZODIAC_SIGNS,
    NAKSHATRAS
} from "../calculations";
import fs from "node:fs";
import path from "node:path";

// Mock fetch for WASM loading in test environment
beforeAll(() => {
    global.fetch = vi.fn().mockImplementation(async (url) => {
        if (typeof url === 'string' && url.endsWith('swisseph.wasm')) {
            const wasmPath = path.resolve(__dirname, '../../../../public/swisseph.wasm');
            const buffer = fs.readFileSync(wasmPath);
            return {
                ok: true,
                arrayBuffer: async () => buffer.buffer
            } as Response;
        }
        return new Response(null, { status: 404 });
    });
});

describe("Astrological Calculations", () => {
    // Test birth data
    const testBirthData = {
        date: "1990-05-15",
        time: "10:30",
        latitude: 28.6139,
        longitude: 77.2090,
        timezone: 5.5
    };

    describe("generateBirthChart", () => {
        it("should generate a valid D1 chart with all planets", async () => {
            const chart = await generateBirthChart(testBirthData);

            expect(chart).toBeDefined();
            expect(chart.planets).toBeDefined();
            expect(chart.planets.length).toBeGreaterThanOrEqual(9); // 9 Vedic planets

            // Check that all main planets are present
            const planetNames = chart.planets.map(p => p.planet);
            expect(planetNames).toContain("Sun");
            expect(planetNames).toContain("Moon");
            expect(planetNames).toContain("Mars");
            expect(planetNames).toContain("Mercury");
            expect(planetNames).toContain("Jupiter");
            expect(planetNames).toContain("Venus");
            expect(planetNames).toContain("Saturn");
            expect(planetNames).toContain("Rahu");
            expect(planetNames).toContain("Ketu");
        });

        it("should calculate valid zodiac signs for planets", async () => {
            const chart = await generateBirthChart(testBirthData);

            chart.planets.forEach(planet => {
                expect(ZODIAC_SIGNS).toContain(planet.sign);
                expect(planet.house).toBeGreaterThanOrEqual(1);
                expect(planet.house).toBeLessThanOrEqual(12);
            });
        });

        it("should calculate valid nakshatra for Moon", async () => {
            const chart = await generateBirthChart(testBirthData);
            const moon = chart.planets.find(p => p.planet === "Moon");

            expect(moon).toBeDefined();
            expect(moon?.nakshatra).toBeDefined();
            expect(NAKSHATRAS).toContain(moon?.nakshatra);
        });

        it("should include Ascendant information", async () => {
            const chart = await generateBirthChart(testBirthData);

            expect(chart.ascendant).toBeDefined();
            expect(ZODIAC_SIGNS).toContain(chart.ascendant.sign);
            expect(chart.ascendant.degree).toBeGreaterThanOrEqual(0);
            expect(chart.ascendant.degree).toBeLessThan(30);
        });
    });

    describe("generateFullChartData", () => {
        it("should generate all divisional charts", async () => {
            const fullData = await generateFullChartData(testBirthData);

            expect(fullData).toBeDefined();
            expect(fullData.d1).toBeDefined();
            expect(fullData.d2).toBeDefined();
            expect(fullData.d9).toBeDefined();
            expect(fullData.d10).toBeDefined();
            expect(fullData.d24).toBeDefined();
        });

        it("should include Dasha information", async () => {
            const fullData = await generateFullChartData(testBirthData);

            expect(fullData.dashas).toBeDefined();
            expect(fullData.currentDasha).toBeDefined();
        });

        it("should detect yogas", async () => {
            const fullData = await generateFullChartData(testBirthData);

            expect(fullData.yogas).toBeDefined();
            expect(Array.isArray(fullData.yogas)).toBe(true);
        });

        it("should have valid D9 Navamsa chart", async () => {
            const fullData = await generateFullChartData(testBirthData);

            expect(fullData.d9).toBeDefined();
            // @ts-ignore
            expect(fullData.d9.planets).toBeDefined();
            // @ts-ignore
            expect(fullData.d9.planets.length).toBeGreaterThanOrEqual(9);
        });

        it("should have valid D10 Dasamsa chart for career", async () => {
            const fullData = await generateFullChartData(testBirthData);

            expect(fullData.d10).toBeDefined();
            // @ts-ignore
            expect(fullData.d10.planets).toBeDefined();
            // @ts-ignore
            expect(fullData.d10.planets.length).toBeGreaterThanOrEqual(9);
        });
    });
});
