import SwissEPH from "sweph-wasm";
// @ts-ignore
import initSwisseph from "sweph-wasm/wasm/swisseph";

/**
 * High-precision Swiss Ephemeris wrapper for Vedic Astrology
 * Adapted for Browser/Vite environment
 */
export class SwissEphemeris {
    private static instance: any = null;

    public static async getInstance(): Promise<any> {
        if (!SwissEphemeris.instance) {
            try {
                // Fetch WASM from public directory with retry logic
                // Note: Vite serves files in 'public' at the root path
                let wasmBinary: ArrayBuffer;
                let lastError: Error | null = null;
                if (typeof window === 'undefined') {
                    // Node.js environment
                    const fs = await import('fs');
                    const path = await import('path');
                    // In vite-node or tsx, process.cwd() is the project root
                    const originalCwd = process.cwd();
                    const wasmPath = path.resolve(originalCwd, 'public', 'swisseph.wasm');

                    if (fs.existsSync(wasmPath)) {
                        console.log(`[SwissEph] Loading WASM from disk: ${wasmPath}`);
                        const buffer = fs.readFileSync(wasmPath);
                        wasmBinary = new Uint8Array(buffer).buffer;
                    } else {
                        // try fallback to one level up if not in root
                        lastError = new Error(`WASM not found on disk at: ${wasmPath}`);
                    }
                }

                if (!wasmBinary!) {
                    // Browser environment or fallback
                    const paths = ['/swisseph.wasm', './swisseph.wasm', 'swisseph.wasm'];

                    for (const p of paths) {
                        try {
                            console.log(`[SwissEph] Trying to load WASM from: ${p}`);
                            const response = await fetch(p);
                            if (response.ok) {
                                wasmBinary = await response.arrayBuffer();
                                console.log(`[SwissEph] Successfully loaded WASM from: ${p} (${wasmBinary.byteLength} bytes)`);
                                break;
                            }
                        } catch (e: any) {
                            lastError = e;
                            console.warn(`[SwissEph] Failed to load from ${p}:`, e.message);
                        }
                    }
                }

                if (!wasmBinary!) {
                    throw lastError || new Error('Failed to load swisseph.wasm from all attempted paths or disk');
                }

                const module = await initSwisseph({
                    wasmBinary: wasmBinary,
                    // Optional: print/printErr handlers can be added here for debugging
                });

                // @ts-ignore - The constructor is public but not well-typed in the default export
                SwissEphemeris.instance = new SwissEPH(module);
                console.log("[SwissEph] Initialization successful!");
            } catch (error) {
                console.error("[SwissEph] Initialization failed:", error);
                throw error;
            }
        }
        return SwissEphemeris.instance;
    }

    /**
     * Calculate Julian Day for UTC time
     */
    static async getJulianDay(date: Date): Promise<number> {
        const swe = await this.getInstance();
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

        // In sweph-wasm: swe_julday(year, month, day, hour, gregflag)
        return swe.swe_julday(year, month, day, hour, 1); // 1 = Greg Cal
    }

    /**
     * Calculate Ayanamsa (Sidereal Offset)
     * Default: Lahiri (2)
     */
    static async getAyanamsa(jd: number): Promise<number> {
        const swe = await this.getInstance();
        // In sweph-wasm: swe_set_sid_mode(sid_mode, t0, ayan_t0)
        swe.swe_set_sid_mode(1, 0, 0); // 1 = SE_SIDM_LAHIRI
        return swe.swe_get_ayanamsa_ut(jd);
    }

    /**
     * Get Sidereal Planetary Positions
     */
    static async getPlanetPosition(jd: number, planetId: number): Promise<{
        longitude: number;
        latitude: number;
        distance: number;
        speedLong: number;
        speedLat: number;
        speedDist: number;
    }> {
        const swe = await this.getInstance();

        // Set to Sidereal Mode (Lahiri)
        swe.swe_set_sid_mode(1, 0, 0);

        // Flags: SEFLG_SIDEREAL (65536) + SEFLG_SPEED (256) + SEFLG_SWIEPH (2)
        const flags = 65536 | 256 | 2;

        // In sweph-wasm: swe_calc_ut(tjd_ut, ipl, iflag) -> [lon, lat, dist, lonSpeed, latSpeed, distSpeed]
        const result = swe.swe_calc_ut(jd, planetId, flags);

        return {
            longitude: result[0],
            latitude: result[1],
            distance: result[2],
            speedLong: result[3],
            speedLat: result[4],
            speedDist: result[5],
        };
    }

    /**
     * Calculate Houses and Ascendant
     */
    static async getHouses(jd: number, lat: number, lon: number, system: string = 'W'): Promise<{
        ascendant: number;
        cusps: number[];
    }> {
        const swe = await this.getInstance();

        try {
            // Standard Swiss Ephemeris behavior: swe_houses returns Tropical unless customized, 
            // but in WASM/JS bindings, the sidereal flag often doesn't affect house cusps.
            // We manually calculate Sidereal by subtracting Ayanamsa.

            // 1. Get Ayanamsa (Sidereal Mode must be set)
            swe.swe_set_sid_mode(1, 0, 0); // Lahiri
            const ayanamsa = swe.swe_get_ayanamsa_ut(jd);

            // 2. Get Tropical Houses
            // swe_houses(tjd_ut, geolat, geolon, hsys)
            const result = swe.swe_houses(jd, lat, lon, system);

            // 3. Convert to Sidereal
            const normalize = (deg: number) => (deg % 360 + 360) % 360;
            const siderealAscendant = normalize(result.ascmc[0] - ayanamsa);

            // We don't rely on cusps from swe_houses for Whole Sign (we calculate them in calculations.ts),
            // but if we did, we would subtract ayanamsa from them too.
            const siderealCusps = Array.from(result.cusps).slice(1).map((c: any) => normalize(c - ayanamsa));

            return {
                ascendant: siderealAscendant,
                cusps: siderealCusps
            };
        } catch (error) {
            console.warn('Swiss Ephemeris house calculation failed, using fallback:', error);

            // Fallback: Calculate houses using simple algorithm
            return this.calculateHousesFallback(jd, lat, lon);
        }
    }

    /**
     * Fallback house calculation when Swiss Ephemeris fails
     * Uses a simplified Placidus approximation
     */
    private static async calculateHousesFallback(jd: number, lat: number, lon: number): Promise<{
        ascendant: number;
        cusps: number[];
    }> {
        const swe = await this.getInstance();

        // Set Lahiri ayanamsa
        swe.swe_set_sid_mode(1, 0, 0);
        const ayanamsa = swe.swe_get_ayanamsa_ut(jd);

        // Get Sun position to approximate ascendant
        // In sidereal system, we can approximate based on time
        const sunResult = swe.swe_calc_ut(jd, 0, 65536); // Sun in sidereal
        const sunLongitude = sunResult[0];

        // Rough approximation: Ascendant moves ~1 degree every 4 minutes
        // At sunrise (6 AM), ascendant ≈ sun position
        // Adjust based on time of day
        const jd2000 = 2451545.0;
        const daysSince2000 = jd - jd2000;
        const centuries = daysSince2000 / 36525;

        // Sidereal time approximation
        const gmst = 6.697374558 + 0.06570982441908 * daysSince2000 + 1.00273790935 * ((jd % 1) * 24);
        const lst = (gmst + lon / 15) % 24;

        // Calculate ascendant from LST and latitude
        const lstDegrees = lst * 15;
        const ascendant = (lstDegrees - ayanamsa + 360) % 360;

        // Generate 12 house cusps (simplified Placidus approximation)
        const cusps: number[] = [];
        for (let i = 1; i <= 12; i++) {
            // Simple equal division for fallback
            // In real Placidus, houses are unequal based on latitude
            const cuspDegree = (ascendant + (i - 1) * 30) % 360;
            cusps.push(cuspDegree);
        }

        return {
            ascendant,
            cusps
        };
    }

    /**
     * Map standard planet names to Swiss Ephemeris IDs
     */
    static getPlanetId(name: string): number {
        const mapping: Record<string, number> = {
            "Sun": 0,
            "Moon": 1,
            "Mars": 4,
            "Mercury": 2,
            "Jupiter": 5,
            "Venus": 3,
            "Saturn": 6,
            "Rahu": 10, // Mean North Node
            "Ketu": -1,
            "Uranus": 7,
            "Neptune": 8,
            "Pluto": 9
        };
        return mapping[name] ?? -1;
    }
}
