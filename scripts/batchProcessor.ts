/**
 * Batch Compatibility Score Calculator
 * 
 * Reads female profiles from a CSV, calculates compatibility against a fixed male profile,
 * and outputs the results to a new CSV. NO database interaction — purely in-memory computation.
 * 
 * Run: npx vite-node scripts/batchProcessor.ts
 */
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { generateFullCompatibilityReport } from '@lib/reportGenerator';
import { BirthDataInput } from '@types';
import cityTimezones from 'city-timezones';

// ============================================================================
// CONFIGURATION
// ============================================================================
const INPUT_CSV = path.resolve('C:/Users/Rahul.Govalkar/Documents/Personal/Scraper ai/female_profiles_new_filter.csv');
const OUTPUT_CSV = path.resolve('C:/Users/Rahul.Govalkar/Documents/Personal/Scraper ai/output_scores_new_filter.csv');

// Rahul Govalkar's birth details (from screenshot)
const MALE_PROFILE: BirthDataInput = {
    name: "Rahul Govalkar",
    dateOfBirth: "1995-09-28",
    timeOfBirth: "00:50",
    location: "Mumbai, Maharashtra, India",
    latitude: 18.9582,
    longitude: 72.8321,
    timezone: "Asia/Kolkata",
    gender: "male"
};

// ============================================================================
// CITY LOOKUP (Offline + Fuzzy)
// ============================================================================

// Common Indian city name mappings (old names → new names / alternate spellings)
const CITY_ALIASES: Record<string, string> = {
    'bangalore': 'Bengaluru',
    'bombay': 'Mumbai',
    'madras': 'Chennai',
    'calcutta': 'Kolkata',
    'baroda': 'Vadodara',
    'trivandrum': 'Thiruvananthapuram',
    'pondicherry': 'Puducherry',
    'benares': 'Varanasi',
    'cochin': 'Kochi',
    'poona': 'Pune',
    'mysore': 'Mysuru',
    'mangalore': 'Mangaluru',
    'vizag': 'Visakhapatnam',
    'cuttack': 'Cuttack',
    'gurgaon': 'Gurugram',
};

function getCoordinatesForCity(rawPlace: string): { latitude: number; longitude: number; timezone: string } | null {
    // Clean up: take the first part (city name), strip state/country
    let cityName = rawPlace.split(',')[0].trim();

    // Check alias map
    const alias = CITY_ALIASES[cityName.toLowerCase()];
    if (alias) cityName = alias;

    // Try exact lookup
    let results = cityTimezones.lookupViaCity(cityName);

    // If no result, try title-casing
    if (!results || results.length === 0) {
        const titleCase = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
        results = cityTimezones.lookupViaCity(titleCase);
    }

    if (results && results.length > 0) {
        // Prefer Indian results if multiple matches
        const indian = results.find((r: any) => r.iso3 === 'IND') || results[0];
        return {
            latitude: indian.lat,
            longitude: indian.lng,
            timezone: indian.timezone || 'Asia/Kolkata'
        };
    }

    return null;
}

// Google Geocoding API fallback for cities not found offline
const GOOGLE_API_KEY = 'AIzaSyDKjg7Eto1ji_dGcxvgr-3Omm-0blRLco8';

async function geocodeViaGoogle(place: string): Promise<{ latitude: number; longitude: number; timezone: string } | null> {
    try {
        const query = encodeURIComponent(place + ', India');
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${GOOGLE_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json() as any;

        if (data.status === 'OK' && data.results && data.results.length > 0) {
            const loc = data.results[0].geometry.location;
            return {
                latitude: loc.lat,
                longitude: loc.lng,
                timezone: 'Asia/Kolkata' // All Indian cities
            };
        }
        return null;
    } catch (e: any) {
        console.warn(`    Google Geocoding API error for "${place}":`, e.message);
        return null;
    }
}

// Combined: try offline first, then Google API
async function resolveCoordinates(rawPlace: string): Promise<{ latitude: number; longitude: number; timezone: string } | null> {
    // Step 1: Try offline DB (instant, free)
    const offline = getCoordinatesForCity(rawPlace);
    if (offline) return offline;

    // Step 2: Fallback to Google Geocoding API
    console.log(`    📡 City not in offline DB, trying Google API for: "${rawPlace}"`);
    const google = await geocodeViaGoogle(rawPlace);
    if (google) {
        console.log(`    ✅ Google API resolved: ${rawPlace} → (${google.latitude.toFixed(4)}, ${google.longitude.toFixed(4)})`);
    }
    return google;
}

// ============================================================================
// DATE PARSING (DD/MM/YYYY → YYYY-MM-DD)
// ============================================================================

function parseDateDMY(dateStr: string): string | null {
    if (!dateStr) return null;
    const cleaned = dateStr.trim();

    // Try DD/MM/YYYY or DD-MM-YYYY
    const match = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (match) {
        const day = match[1].padStart(2, '0');
        const month = match[2].padStart(2, '0');
        const year = match[3];
        return `${year}-${month}-${day}`;
    }

    // Already YYYY-MM-DD?
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
        return cleaned;
    }

    return null;
}

function parseTime(timeStr: string): string | null {
    if (!timeStr) return null;
    const cleaned = timeStr.trim();

    // Check for AM/PM
    const isPM = /pm/i.test(cleaned);
    const isAM = /am/i.test(cleaned);

    // Handle HH:MM or H:MM
    const match = cleaned.match(/^(\d{1,2}):(\d{2})/);
    if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = match[2];

        if (isPM && hours < 12) {
            hours += 12;
        } else if (isAM && hours === 12) {
            hours = 0;
        }

        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }

    return null;
}

// ============================================================================
// MAIN PROCESSOR
// ============================================================================

interface CsvRow {
    'Name': string;
    'Birth Date': string;
    'Birth Time': string;
    'Birth Place': string;
    'Education': string;
    'Profession': string;
    'Height': string;
    'Marital Status': string;
    'Diet': string;
    'Profile URL': string; // We'll look for Profile URL or Profile Link
    'Profile Link': string;
    [key: string]: string; // Allow BOM or extra cols
}

async function processCSV() {
    console.log('========================================================');
    console.log('  BATCH COMPATIBILITY CALCULATOR');
    console.log('========================================================');
    console.log(`Male Profile: ${MALE_PROFILE.name}`);
    console.log(`DOB: ${MALE_PROFILE.dateOfBirth} | Time: ${MALE_PROFILE.timeOfBirth}`);
    console.log(`Place: ${MALE_PROFILE.location} (${MALE_PROFILE.latitude}, ${MALE_PROFILE.longitude})`);
    console.log(`Input:  ${INPUT_CSV}`);
    console.log(`Output: ${OUTPUT_CSV}`);
    console.log('========================================================\n');

    const results: any[] = [];
    const readStream = fs.createReadStream(INPUT_CSV, { encoding: 'utf-8' });

    let rowCount = 0;
    let skippedCount = 0;
    let successCount = 0;
    let errorCount = 0;

    for await (const rawRow of readStream.pipe(csv({ mapHeaders: ({ header }: { header: string }) => header.replace(/^\uFEFF/, '').trim() }))) {
        rowCount++;
        const row = rawRow as CsvRow;

        const name = (row['Name'] || '').trim();
        const rawDate = (row['Birth Date'] || '').trim();
        const rawTime = (row['Birth Time'] || '').trim();
        const rawPlace = (row['Birth Place'] || '').trim();
        const edu = (row['Education'] || '').trim();
        const prof = (row['Profession'] || '').trim();
        const height = (row['Height'] || '').trim();
        const marital = (row['Marital Status'] || '').trim();
        const diet = (row['Diet'] || '').trim();
        const profileLink = (row['Profile Link'] || row['Profile URL'] || '').trim();

        // Default result template for this row
        const resultRow: any = {
            Name: name,
            DOB: rawDate,
            Time: rawTime,
            Place: rawPlace,
            Education: edu,
            Profession: prof,
            Height: height,
            MaritalStatus: marital,
            Diet: diet,
            OverallScore: 'N/A',
            AshtakootPoints: 'N/A',
            Manglik: 'N/A',
            DivorceRiskScore: 'N/A',
            RawDivorceRiskScore: 'N/A',
            InfidelityRiskScore: 'N/A',
            RawInfidelityRiskScore: 'N/A',
            SexualCompatibility: 'N/A',
            Verdict: 'Processing...',
            TrafficLight: 'N/A',
            ProfileLink: profileLink
        };

        // Skip rows with missing essential data
        if (!name || !rawDate || !rawTime || !rawPlace) {
            const reason = `Missing data (Date:${rawDate || '❌'} Time:${rawTime || '❌'} Place:${rawPlace || '❌'})`;
            console.log(`⏭️  [${rowCount}] Skipping "${name || 'UNNAMED'}" — ${reason}`);
            resultRow.Verdict = `Skipped: ${reason}`;
            resultRow.TrafficLight = 'SKIPPED';
            results.push(resultRow);
            skippedCount++;
            continue;
        }

        // Parse date
        const dob = parseDateDMY(rawDate);
        if (!dob) {
            const reason = `Unrecognized date: "${rawDate}"`;
            console.log(`⏭️  [${rowCount}] Skipping "${name}" — ${reason}`);
            resultRow.Verdict = `Skipped: ${reason}`;
            resultRow.TrafficLight = 'SKIPPED';
            results.push(resultRow);
            skippedCount++;
            continue;
        }

        // Parse time
        const timeOfBirth = parseTime(rawTime);
        if (!timeOfBirth) {
            const reason = `Unrecognized time: "${rawTime}"`;
            console.log(`⏭️  [${rowCount}] Skipping "${name}" — ${reason}`);
            resultRow.Verdict = `Skipped: ${reason}`;
            resultRow.TrafficLight = 'SKIPPED';
            results.push(resultRow);
            skippedCount++;
            continue;
        }

        // Lookup coordinates
        const coords = await resolveCoordinates(rawPlace);
        if (!coords) {
            const reason = `City not found: "${rawPlace}"`;
            console.log(`⏭️  [${rowCount}] Skipping "${name}" — ${reason}`);
            resultRow.Verdict = `Skipped: ${reason}`;
            resultRow.TrafficLight = 'SKIPPED';
            results.push(resultRow);
            skippedCount++;
            continue;
        }

        console.log(`🔄 [${rowCount}] Processing: ${name} | ${dob} ${timeOfBirth} | ${rawPlace} (${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)})`);

        try {
            const femaleBirthData: BirthDataInput = {
                name,
                dateOfBirth: dob,
                timeOfBirth,
                location: rawPlace,
                latitude: coords.latitude,
                longitude: coords.longitude,
                timezone: coords.timezone,
                gender: "female"
            };

            // Run full compatibility report
            const report = await generateFullCompatibilityReport(MALE_PROFILE, femaleBirthData);

            // Use the SAME overallScore that the app UI displays
            const overallScore = report.overallScore;
            const ashtakootPts = report.ashtakoot?.totalScore ?? 'N/A';
            const verdict = report.overallVerdict?.level || report.overallVerdict || 'N/A';
            const trafficLight = report.executiveSummary?.trafficLightStatus || 'N/A';

            // Advanced metrics
            const isManglik = report.ashtakoot?.manglikAnalysis?.isManglik ? 'Yes' : 'No';
            const divorceRisk = report.riskAssessment?.divorceProbability?.score ?? 'N/A';
            const rawDivorceRisk = report.riskAssessment?.divorceProbability?.rawScore ?? 'N/A';
            const infidelityRisk = report.riskAssessment?.infidelityRisk?.score ?? 'N/A';
            const rawInfidelityRisk = report.riskAssessment?.infidelityRisk?.rawScore ?? 'N/A';
            const sexualCompat = report.sexualHealth?.mutualSatisfaction?.score ?? 'N/A';

            resultRow.OverallScore = overallScore;
            resultRow.AshtakootPoints = ashtakootPts;
            resultRow.Manglik = isManglik;
            resultRow.DivorceRiskScore = divorceRisk;
            resultRow.RawDivorceRiskScore = rawDivorceRisk;
            resultRow.InfidelityRiskScore = infidelityRisk;
            resultRow.RawInfidelityRiskScore = rawInfidelityRisk;
            resultRow.SexualCompatibility = sexualCompat;
            resultRow.Verdict = verdict;
            resultRow.TrafficLight = trafficLight;
            results.push(resultRow);

            console.log(`✅ [${rowCount}] ${name} → Score: ${overallScore} | Ashtakoot: ${ashtakootPts}/36 | Verdict: ${verdict} (${trafficLight})`);
            successCount++;

        } catch (error: any) {
            console.error(`❌ [${rowCount}] Error processing ${name}:`, error.message);
            resultRow.OverallScore = 'ERROR';
            resultRow.Verdict = error.message?.substring(0, 80) || 'Unknown error';
            resultRow.TrafficLight = 'ERROR';
            results.push(resultRow);
            errorCount++;
        }
    }

    // Write Results to CSV
    if (results.length > 0) {
        const headers = Object.keys(results[0]).join(',');
        const csvRows = results.map(row =>
            Object.values(row)
                .map(val => `"${String(val).replace(/"/g, '""')}"`)
                .join(',')
        );
        const finalCSV = [headers, ...csvRows].join('\n');
        fs.writeFileSync(OUTPUT_CSV, finalCSV, 'utf-8');
    }

    console.log('\n========================================================');
    console.log('  RESULTS SUMMARY');
    console.log('========================================================');
    console.log(`Total Rows:    ${rowCount}`);
    console.log(`✅ Success:    ${successCount}`);
    console.log(`⏭️  Skipped:    ${skippedCount}`);
    console.log(`❌ Errors:     ${errorCount}`);
    console.log(`📄 Output:     ${OUTPUT_CSV}`);
    console.log('========================================================');
}

// Pre-flight check
if (!fs.existsSync(INPUT_CSV)) {
    console.error(`❌ ERROR: Input CSV not found at: ${INPUT_CSV}`);
    process.exit(1);
}

processCSV().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
