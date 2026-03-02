/**
 * Deep Analysis Script — Extracts ALL pillars & sub-scores for top matches
 * 
 * Reads output_scores_all_india.csv, filters for top matches (score >= 60),
 * then re-runs the full engine to extract every single sub-score across
 * all 5 pillars plus executive summary.
 *
 * Run: npx vite-node scripts/deepAnalysis.ts
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

const INPUT_CSV = path.resolve('C:/Users/Rahul.Govalkar/Documents/Personal/Scraper ai/female_profiles_all_india.csv');
const OUTPUT_JSON = path.resolve('C:/Users/Rahul.Govalkar/Documents/Personal/Scraper ai/deep_analysis_top_matches.json');
const OUTPUT_CSV = path.resolve('C:/Users/Rahul.Govalkar/Documents/Personal/Scraper ai/deep_analysis_top_matches.csv');
const MIN_SCORE_THRESHOLD = 60; // Only deep-analyze profiles scoring >= 60

// Rahul Govalkar's birth details
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
// CITY LOOKUP (same as batchProcessor)
// ============================================================================

const CITY_ALIASES: Record<string, string> = {
    'bangalore': 'Bengaluru', 'bombay': 'Mumbai', 'madras': 'Chennai',
    'calcutta': 'Kolkata', 'baroda': 'Vadodara', 'trivandrum': 'Thiruvananthapuram',
    'cochin': 'Kochi', 'pondicherry': 'Puducherry', 'banaras': 'Varanasi',
    'benaras': 'Varanasi', 'poona': 'Pune', 'mysore': 'Mysuru',
    'mangalore': 'Mangaluru', 'vizag': 'Visakhapatnam',
    'cuttack': 'Cuttack', 'gurgaon': 'Gurugram',
};

function getCoordinatesForCity(rawPlace: string): { latitude: number; longitude: number; timezone: string } | null {
    let cityName = rawPlace.split(',')[0].trim();
    const alias = CITY_ALIASES[cityName.toLowerCase()];
    if (alias) cityName = alias;
    let results = cityTimezones.lookupViaCity(cityName);
    if (!results || results.length === 0) {
        const titleCase = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
        results = cityTimezones.lookupViaCity(titleCase);
    }
    if (results && results.length > 0) {
        const indian = results.find((r: any) => r.iso3 === 'IND') || results[0];
        return { latitude: indian.lat, longitude: indian.lng, timezone: indian.timezone || 'Asia/Kolkata' };
    }
    return null;
}

const GOOGLE_API_KEY = 'AIzaSyDKjg7Eto1ji_dGcxvgr-3Omm-0blRLco8';

async function geocodeViaGoogle(place: string): Promise<{ latitude: number; longitude: number; timezone: string } | null> {
    try {
        const query = encodeURIComponent(place + ', India');
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${GOOGLE_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json() as any;
        if (data.status === 'OK' && data.results && data.results.length > 0) {
            const loc = data.results[0].geometry.location;
            return { latitude: loc.lat, longitude: loc.lng, timezone: 'Asia/Kolkata' };
        }
        return null;
    } catch (e: any) {
        return null;
    }
}

async function resolveCoordinates(rawPlace: string): Promise<{ latitude: number; longitude: number; timezone: string } | null> {
    const offline = getCoordinatesForCity(rawPlace);
    if (offline) return offline;
    return await geocodeViaGoogle(rawPlace);
}

// ============================================================================
// DATE/TIME PARSING (same as batchProcessor with AM/PM fix)
// ============================================================================

function parseDateDMY(dateStr: string): string | null {
    if (!dateStr) return null;
    const cleaned = dateStr.trim();
    const match = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (match) {
        const day = match[1].padStart(2, '0');
        const month = match[2].padStart(2, '0');
        const year = match[3];
        return `${year}-${month}-${day}`;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned;
    return null;
}

function parseTime(timeStr: string): string | null {
    if (!timeStr) return null;
    const cleaned = timeStr.trim();
    const isPM = /pm/i.test(cleaned);
    const isAM = /am/i.test(cleaned);
    const match = cleaned.match(/^(\d{1,2}):(\d{2})/);
    if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = match[2];
        if (isPM && hours < 12) hours += 12;
        else if (isAM && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
    return null;
}

// ============================================================================
// FIRST PASS: Read existing scores to filter top candidates
// ============================================================================

interface ScoreRow {
    'Name': string;
    'Birth Date': string;
    'Birth Time': string;
    'Birth Place': string;
    'Education': string;
    'Profession': string;
    'Height': string;
    'Marital Status': string;
    'Diet': string;
    'Profile URL': string;
    'Profile Link': string;
    [key: string]: string;
}

// ============================================================================
// DEEP EXTRACTION
// ============================================================================

async function deepAnalyze() {
    console.log('========================================================');
    console.log('  DEEP ANALYSIS — ALL ASPECTS FOR TOP MATCHES');
    console.log('========================================================\n');

    // Read input CSV
    const rows: ScoreRow[] = [];
    const readStream = fs.createReadStream(INPUT_CSV, { encoding: 'utf-8' });
    for await (const rawRow of readStream.pipe(csv({ mapHeaders: ({ header }: { header: string }) => header.replace(/^\uFEFF/, '').trim() }))) {
        rows.push(rawRow as ScoreRow);
    }

    console.log(`Total profiles in CSV: ${rows.length}`);

    // Filter to only profiles with complete data (we'll process all valid ones)
    const validRows = rows.filter(row => {
        const name = (row['Name'] || '').trim();
        const rawDate = (row['Birth Date'] || '').trim();
        const rawTime = (row['Birth Time'] || '').trim();
        const rawPlace = (row['Birth Place'] || '').trim();
        return name && rawDate && rawTime && rawPlace;
    });

    console.log(`Valid profiles (with birth data): ${validRows.length}`);
    console.log(`Running full analysis on all valid profiles...\n`);

    const deepResults: any[] = [];
    let processed = 0;

    for (const row of validRows) {
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

        const dob = parseDateDMY(rawDate);
        const timeOfBirth = parseTime(rawTime);
        const coords = await resolveCoordinates(rawPlace);

        if (!dob || !timeOfBirth || !coords) {
            continue;
        }

        processed++;
        console.log(`🔄 [${processed}] Analyzing: ${name}`);

        try {
            const femaleBirthData: BirthDataInput = {
                name, dateOfBirth: dob, timeOfBirth,
                location: rawPlace, latitude: coords.latitude,
                longitude: coords.longitude, timezone: coords.timezone,
                gender: "female"
            };

            const report = await generateFullCompatibilityReport(MALE_PROFILE, femaleBirthData);

            // === EXTRACT ALL PILLARS ===
            const pillars = report.advancedBreakdown || {};
            const stability = pillars.stability || {};
            const interaction = pillars.interaction || {};
            const soul = pillars.soul || {};
            const tradition = pillars.tradition || {};
            const promise = pillars.promise || {};

            // === EXTRACT SUB-SCORES ===
            const getSubScore = (pillar: any, subName: string): number => {
                const item = pillar.breakdown?.find((b: any) => b.name === subName);
                return item?.score ?? -1;
            };

            // === EXTRACT EXECUTIVE SUMMARY ===
            const execSummary = report.executiveSummary || {};
            const strengths = (execSummary.strengths || []).join('; ');
            const challenges = (execSummary.challenges || []).join('; ');
            const trafficLight = execSummary.trafficLightStatus || 'N/A';

            // === EXTRACT KP ANALYSIS ===
            const kpA = report.kpAnalysis?.partnerA?.seventhCuspSubLord?.marriagePromise || 'N/A';
            const kpB = report.kpAnalysis?.partnerB?.seventhCuspSubLord?.marriagePromise || 'N/A';

            // === EXTRACT SYNASTRY DETAILS ===
            const synastry = report.synastry || {};
            const soulmateCount = synastry.soulmateConnections?.length || 0;
            const overlayCount = synastry.houseOverlays?.length || 0;
            const jaiminiContact = synastry.jaiminiCompatibility?.darakarakaContact?.type || 'none';
            const jaiminiQuality = synastry.jaiminiCompatibility?.darakarakaContact?.quality || 'neutral';

            // === EXTRACT RISK DETAILS ===
            const riskAssessment = report.riskAssessment || {};
            const rawDivorceRisk = riskAssessment.divorceProbability?.rawScore ?? -1;
            const rawInfidelityRisk = riskAssessment.infidelityRisk?.rawScore ?? -1;

            // === EXTRACT SEXUAL HEALTH ===
            const sexualHealth = report.sexualHealth || {};
            const mutualSatisfaction = sexualHealth.mutualSatisfaction?.score ?? -1;

            // === EXTRACT MENTAL HEALTH ===
            const mentalA = report.mentalHealth?.partnerA?.totalRiskScore ?? -1;
            const mentalB = report.mentalHealth?.partnerB?.totalRiskScore ?? -1;

            // === EXTRACT ADDICTION RISK ===
            const addictionA = report.addictionRisk?.partnerA?.overallScore ?? -1;
            const addictionB = report.addictionRisk?.partnerB?.overallScore ?? -1;

            // === EXTRACT MANGLIK ===
            const isManglik = report.ashtakoot?.manglikAnalysis?.isManglik ? 'Yes' : 'No';
            const manglikCompatible = report.ashtakoot?.manglikAnalysis?.isCompatible ? 'Yes' : 'No';

            // === EXTRACT YOGA/DOSHA ===
            const yogasA = report.yogaDosha?.partnerA?.categories?.filter((c: any) => c.type === 'yoga')?.length ?? 0;
            const yogasB = report.yogaDosha?.partnerB?.categories?.filter((c: any) => c.type === 'yoga')?.length ?? 0;
            const doshasA = report.yogaDosha?.partnerA?.categories?.filter((c: any) => c.type === 'dosha')?.length ?? 0;
            const doshasB = report.yogaDosha?.partnerB?.categories?.filter((c: any) => c.type === 'dosha')?.length ?? 0;

            const result = {
                // Identity
                Name: name,
                DOB: rawDate,
                Time: rawTime,
                Place: rawPlace,
                Education: edu,
                Profession: prof,
                Height: height,
                MaritalStatus: marital,
                Diet: diet,

                // Overall
                OverallScore: report.overallScore,
                Verdict: (report as any).overallVerdict?.level || report.overallVerdict || 'N/A',
                TrafficLight: trafficLight,
                AshtakootPoints: report.ashtakoot?.totalScore ?? 'N/A',
                AshtakootPercentage: report.ashtakoot?.percentage ?? 'N/A',

                // PILLAR 1: STABILITY
                StabilityScore: stability.score ?? -1,
                'Sub_MaritalStability': getSubScore(stability, 'Marital Stability'),
                'Sub_FidelityLoyalty': getSubScore(stability, 'Fidelity & Loyalty'),
                'Sub_EmotionalResilience': getSubScore(stability, 'Emotional Resilience'),
                'Sub_LifestyleStability': getSubScore(stability, 'Lifestyle Stability'),
                'Sub_InLawHarmony': getSubScore(stability, 'In-Law Harmony'),
                'Sub_ModernAdaptability': getSubScore(stability, 'Modern Adaptability'),

                // PILLAR 2: INTERACTION
                InteractionScore: interaction.score ?? -1,
                'Sub_SynastryAspects': getSubScore(interaction, 'Synastry (Aspects)'),
                'Sub_HouseOverlays': getSubScore(interaction, 'House Overlays'),
                'Sub_SexualVitality': getSubScore(interaction, 'Sexual Vitality'),

                // PILLAR 3: SOUL & DESTINY
                SoulScore: soul.score ?? -1,
                'Sub_KPMarriagePromise': getSubScore(soul, 'KP Marriage Promise'),
                'Sub_JaiminiSoulContact': getSubScore(soul, 'Jaimini Soul Contact'),
                'Sub_YogaDoshaStrength': getSubScore(soul, 'Yoga/Dosha Strength'),

                // PILLAR 4: TRADITION
                TraditionScore: tradition.score ?? -1,
                'Sub_GunaMilan36': getSubScore(tradition, 'Guna Milan (36 Points)'),
                'Sub_ManglikCompat': getSubScore(tradition, 'Manglik Compatibility'),

                // PILLAR 5: PROMISE
                PromiseScore: promise.score ?? -1,
                'Sub_SelfPromise7CSL': getSubScore(promise, 'Self Promise (7th CSL)'),
                'Sub_PartnerPromise7CSL': getSubScore(promise, 'Partner Promise (7th CSL)'),

                // Deep Details
                RawDivorceRisk: rawDivorceRisk,
                RawInfidelityRisk: rawInfidelityRisk,
                MutualSatisfaction: mutualSatisfaction,
                Manglik: isManglik,
                ManglikCompatible: manglikCompatible,
                KP_SelfPromise: kpA,
                KP_PartnerPromise: kpB,
                SoulmateConnections: soulmateCount,
                HouseOverlayCount: overlayCount,
                JaiminiContactType: jaiminiContact,
                JaiminiContactQuality: jaiminiQuality,
                MentalHealthRisk_Self: mentalA,
                MentalHealthRisk_Partner: mentalB,
                AddictionRisk_Self: addictionA,
                AddictionRisk_Partner: addictionB,
                PositiveYogas: yogasA + yogasB,
                NegativeDoshas: doshasA + doshasB,

                // Executive Summary
                Strengths: strengths,
                Challenges: challenges,

                ProfileLink: profileLink
            };

            deepResults.push(result);

            const scoreStr = report.overallScore >= 70 ? `🌟 ${report.overallScore}` : `${report.overallScore}`;
            console.log(`   ✅ Score: ${scoreStr} | Stability: ${stability.score} | Interaction: ${interaction.score} | Soul: ${soul.score} | Tradition: ${tradition.score} | Promise: ${promise.score}`);

        } catch (error: any) {
            console.error(`   ❌ Error: ${error.message}`);
        }
    }

    // Sort by overall score descending
    deepResults.sort((a, b) => b.OverallScore - a.OverallScore);

    // Save full JSON (complete data)
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(deepResults, null, 2), 'utf-8');
    console.log(`\n📄 Full JSON: ${OUTPUT_JSON}`);

    // Save CSV
    if (deepResults.length > 0) {
        const headers = Object.keys(deepResults[0]).join(',');
        const csvRows = deepResults.map(row =>
            Object.values(row)
                .map(val => `"${String(val).replace(/"/g, '""')}"`)
                .join(',')
        );
        const finalCSV = [headers, ...csvRows].join('\n');
        fs.writeFileSync(OUTPUT_CSV, finalCSV, 'utf-8');
        console.log(`📄 CSV: ${OUTPUT_CSV}`);
    }

    // Print top 10 summary
    console.log('\n========================================================');
    console.log('  TOP 10 — ALL PILLARS');
    console.log('========================================================');
    for (let i = 0; i < Math.min(10, deepResults.length); i++) {
        const r = deepResults[i];
        console.log(`\n${i + 1}. ${r.Name} — Overall: ${r.OverallScore} (${r.Verdict})`);
        console.log(`   📊 Stability: ${r.StabilityScore} | Interaction: ${r.InteractionScore} | Soul: ${r.SoulScore} | Tradition: ${r.TraditionScore} | Promise: ${r.PromiseScore}`);
        console.log(`   🔍 Divorce: ${r.RawDivorceRisk}% | Infidelity: ${r.RawInfidelityRisk}% | Sexual: ${r.MutualSatisfaction} | KP: ${r.KP_SelfPromise}/${r.KP_PartnerPromise}`);
        console.log(`   💫 Soulmate Connections: ${r.SoulmateConnections} | Jaimini: ${r.JaiminiContactType} (${r.JaiminiContactQuality})`);
        console.log(`   📋 ${r.Education} | ${r.Profession} | ${r.Height}`);
        console.log(`   ✅ Strengths: ${r.Strengths.substring(0, 120)}`);
        console.log(`   ⚠️  Challenges: ${r.Challenges.substring(0, 120)}`);
    }

    console.log('\n========================================================');
    console.log(`  DONE! Analyzed ${deepResults.length} profiles.`);
    console.log('========================================================');
}

// Pre-flight check
if (!fs.existsSync(INPUT_CSV)) {
    console.error(`❌ ERROR: Input CSV not found at: ${INPUT_CSV}`);
    process.exit(1);
}

deepAnalyze().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
