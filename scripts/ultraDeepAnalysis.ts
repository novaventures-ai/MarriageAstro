/**
 * Ultra-Deep Widget-Level Analysis — Top 10 Only
 * Extracts EVERY widget-level detail from the MarriageAstro engine:
 *   - Conflict Zones
 *   - Addiction Risk (categories, sexual addiction, substance etc.)
 *   - Relationship Behaviors (severity, toxicity flags)
 *   - Mental Health Impact
 *   - In-Law Harmony (detailed)
 *   - Sexual Health (libido, PME/ED/Frigidity, mutual satisfaction)
 *   - Modern Challenges (digital age, career stress, communication)
 *   - Yoga/Dosha details
 *   - Psychological Profile
 *
 * Run: npx vite-node scripts/ultraDeepAnalysis.ts
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

const INPUT_CSV = path.resolve('C:/Users/Rahul.Govalkar/Documents/Personal/Scraper ai/results/05_new_filter_25_32/01_scraped/female_profiles_new_filter.csv');
const SCORES_CSV = path.resolve('C:/Users/Rahul.Govalkar/Documents/Personal/Scraper ai/output_scores_new_filter.csv');
const OUTPUT_JSON = path.resolve('C:/Users/Rahul.Govalkar/Documents/Personal/Scraper ai/results/05_new_filter_25_32/03_ultra_deep/ultra_deep_new_filter.json');

// We'll dynamically load all 'good' verdict names from the scores CSV

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

// Same city lookup helpers
const CITY_ALIASES: Record<string, string> = {
    'bangalore': 'Bengaluru', 'bombay': 'Mumbai', 'madras': 'Chennai',
    'calcutta': 'Kolkata', 'baroda': 'Vadodara', 'trivandrum': 'Thiruvananthapuram',
    'cochin': 'Kochi', 'pondicherry': 'Puducherry', 'banaras': 'Varanasi',
    'benaras': 'Varanasi', 'poona': 'Pune', 'mysore': 'Mysuru',
    'mangalore': 'Mangaluru', 'vizag': 'Visakhapatnam',
    'cuttack': 'Cuttack', 'gurgaon': 'Gurugram',
};

function getCoordinatesForCity(rawPlace: string) {
    let cityName = rawPlace.split(',')[0].trim();
    const alias = CITY_ALIASES[cityName.toLowerCase()];
    if (alias) cityName = alias;
    let results = cityTimezones.lookupViaCity(cityName);
    if (!results || results.length === 0) {
        results = cityTimezones.lookupViaCity(cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase());
    }
    if (results && results.length > 0) {
        const indian = results.find((r: any) => r.iso3 === 'IND') || results[0];
        return { latitude: indian.lat, longitude: indian.lng, timezone: indian.timezone || 'Asia/Kolkata' };
    }
    return null;
}

const GOOGLE_API_KEY = 'AIzaSyDKjg7Eto1ji_dGcxvgr-3Omm-0blRLco8';
async function geocodeViaGoogle(place: string) {
    try {
        const query = encodeURIComponent(place + ', India');
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${GOOGLE_API_KEY}`);
        const data = await response.json() as any;
        if (data.status === 'OK' && data.results?.length > 0) {
            const loc = data.results[0].geometry.location;
            return { latitude: loc.lat, longitude: loc.lng, timezone: 'Asia/Kolkata' };
        }
        return null;
    } catch { return null; }
}

async function resolveCoordinates(rawPlace: string) {
    return getCoordinatesForCity(rawPlace) || await geocodeViaGoogle(rawPlace);
}

function parseDateDMY(dateStr: string): string | null {
    if (!dateStr) return null;
    const cleaned = dateStr.trim();
    const match = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (match) return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
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
        if (isPM && hours < 12) hours += 12;
        else if (isAM && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, '0')}:${match[2]}`;
    }
    return null;
}

// Helper to safely extract array items as strings
function safeJoin(arr: any[] | undefined | null, sep = '; '): string {
    if (!arr || !Array.isArray(arr)) return '';
    return arr.map((item: any) => {
        if (typeof item === 'string') return item;
        if (item?.description) return `${item.name || item.type || ''}: ${item.description}`;
        if (item?.name) return `${item.name} (${item.severity || item.level || item.score || ''})`;
        return JSON.stringify(item);
    }).filter(Boolean).join(sep);
}

// ============================================================================
// MAIN
// ============================================================================

async function ultraDeepAnalyze() {
    console.log('='.repeat(70));
    console.log('  ULTRA-DEEP WIDGET-LEVEL ANALYSIS — TOP 10 PROFILES');
    console.log('='.repeat(70) + '\n');

    const goodNames: Set<string> = new Set();

    // Step 2: Read input CSV
    const rows: any[] = [];
    const readStream = fs.createReadStream(INPUT_CSV, { encoding: 'utf-8' });
    for await (const rawRow of readStream.pipe(csv({ mapHeaders: ({ header }: { header: string }) => header.replace(/^\uFEFF/, '').trim() }))) {
        rows.push(rawRow);
    }

    const topRows = rows; // RUN ON EVERYTHING
    console.log(`Matched ${topRows.length} profiles in the input CSV.\n`);

    const results: any[] = [];

    for (const row of topRows) {
        const name = (row['Name'] || '').trim();
        const rawDate = (row['Birth Date'] || '').trim();
        const rawTime = (row['Birth Time'] || '').trim();
        const rawPlace = (row['Birth Place'] || '').trim();
        const edu = (row['Education'] || '').trim();
        const prof = (row['Profession'] || '').trim();
        const height = (row['Height'] || '').trim();
        const diet = (row['Diet'] || '').trim();
        const profileLink = (row['Profile Link'] || row['Profile URL'] || '').trim();

        const dob = parseDateDMY(rawDate);
        const timeOfBirth = parseTime(rawTime);
        const coords = await resolveCoordinates(rawPlace);
        if (!dob || !timeOfBirth || !coords) { console.log(`⏭️ Skipping ${name}`); continue; }

        console.log(`\n${'='.repeat(60)}`);
        console.log(`🔬 DEEP ANALYZING: ${name}`);
        console.log(`${'='.repeat(60)}`);

        try {
            const femaleBirthData: BirthDataInput = {
                name, dateOfBirth: dob, timeOfBirth,
                location: rawPlace, latitude: coords.latitude,
                longitude: coords.longitude, timezone: coords.timezone,
                gender: "female"
            };

            const report: any = await generateFullCompatibilityReport(MALE_PROFILE, femaleBirthData);

            // =====================================================
            // EXTRACT EVERY WIDGET
            // =====================================================

            // === 1. CONFLICT ZONES ===
            const conflictZone = report.conflictZone || {};
            const conflictCategories = conflictZone.categories || [];
            const conflictSummary = conflictCategories.map((c: any) => ({
                category: c.category || c.name || 'Unknown',
                severity: c.severity || c.level || 'unknown',
                description: c.description || '',
                triggers: c.triggers || c.items || [],
            }));

            // === 2. ADDICTION RISK (Partner B = Female) ===
            const addictionB = report.addictionRiskAnalysis?.partnerB || {};
            const addictionCategories = (addictionB.categories || addictionB.types || []).map((c: any) => ({
                type: c.type || c.name || c.category || 'Unknown',
                level: c.level || c.severity || c.riskLevel || 'low',
                score: c.score || c.riskScore || 0,
                description: c.description || c.interpretation || '',
            }));
            const addictionOverallScore = addictionB.overallScore || addictionB.totalScore || 0;
            const addictionOverallLevel = addictionB.overallLevel || addictionB.levels?.overall || 'low';

            // === 3. RELATIONSHIP BEHAVIORS (Partner B = Female) ===
            const relationshipB = report.relationshipPatternAnalysis?.partnerB || {};
            const relationshipPatterns = (relationshipB.patterns || []).map((p: any) => ({
                name: p.name || p.pattern || 'Unknown',
                severity: p.severity || p.level || 'low',
                description: p.description || p.interpretation || '',
                category: p.category || '',
            }));
            const relationshipOverallRisk = relationshipB.overallRiskLevel || 'low';

            // === 4. MENTAL HEALTH (Partner B = Female) ===
            const mentalB = report.mentalHealthAnalysis?.partnerB || {};
            const mentalCategories = (mentalB.categories || []).map((c: any) => ({
                name: c.name || c.condition || 'Unknown',
                riskLevel: c.riskLevel || c.severity || c.level || 'low',
                score: c.score || c.riskScore || 0,
                description: c.description || '',
            }));
            const mentalOverallWellbeing = mentalB.overallWellbeing || 'unknown';
            const mentalTotalRisk = mentalB.totalRiskScore || 0;
            const emotionalStrengths = mentalB.emotionalStrengths || [];

            // === 5. IN-LAW ANALYSIS (Detailed) ===
            const inLawA = report.inLawAnalysis || {};
            const inLawB = report.partnerInLawAnalysis || {};
            const inLawIndicatorsA = inLawA.indicators || [];
            const inLawIndicatorsB = inLawB.indicators || [];

            // === 6. SEXUAL HEALTH (Detailed) ===
            const sexH = report.sexualHealth || {};
            const femaleHealth = sexH.femaleHealth || {};
            const mutualSatisfaction = sexH.mutualSatisfaction || {};
            const libidoB = sexH.libidoB || {};
            const orientationB = sexH.orientationB || {};

            // === 7. MODERN CHALLENGES ===
            const modernCh = report.modernChallenges || {};

            // === 8. YOGA/DOSHA (Partner B = Female) ===
            const yogaDoshaB = report.yogaDoshaAnalysis?.partnerB || {};
            const yogaCategories = (yogaDoshaB.categories || []).map((c: any) => ({
                name: c.name || 'Unknown',
                type: c.type, // 'yoga' or 'dosha'
                severity: c.severity || c.level || '',
                description: c.description || '',
            }));

            // === 9. PSYCHOLOGICAL PROFILE (Partner B = Female) ===
            const psychB = report.psychologicalProfileB || {};

            // === 10. RISK ASSESSMENT (Detailed) ===
            const riskA = report.riskAssessment || {};
            const divorceIndicators = riskA.divorceProbability?.indicators || [];
            const infidelityIndicators = riskA.infidelityRisk?.indicators || [];
            const protectiveFactors = riskA.protectiveFactors || [];
            const multipleMarriage = riskA.multipleMarriageIndicators || [];

            // === COMPILE ===
            const result = {
                name,
                dob: rawDate,
                time: rawTime,
                place: rawPlace,
                education: edu,
                profession: prof,
                height,
                diet,
                overallScore: report.overallScore,
                verdict: report.overallVerdict?.level || report.overallVerdict,
                ashtakootPoints: report.ashtakoot?.totalScore,

                // PILLAR SCORES
                stabilityScore: report.advancedBreakdown?.stability?.score,
                interactionScore: report.advancedBreakdown?.interaction?.score,
                soulScore: report.advancedBreakdown?.soul?.score,
                traditionScore: report.advancedBreakdown?.tradition?.score,
                promiseScore: report.advancedBreakdown?.promise?.score,

                // CONFLICT ZONES
                conflictZones: conflictSummary,
                conflictZoneCount: conflictSummary.length,
                severeConflicts: conflictSummary.filter((c: any) => ['severe', 'critical', 'high'].includes(c.severity?.toLowerCase())),

                // ADDICTION RISK (Female)
                addictionOverallScore: addictionOverallScore,
                addictionOverallLevel: addictionOverallLevel,
                addictionCategories: addictionCategories,
                sexualAddiction: addictionCategories.find((c: any) =>
                    c.type?.toLowerCase().includes('sexual') || c.type?.toLowerCase().includes('lust')
                ) || { type: 'Sexual', level: 'none detected', score: 0 },

                // RELATIONSHIP BEHAVIORS (Female)
                relationshipOverallRisk: relationshipOverallRisk,
                relationshipPatterns: relationshipPatterns,
                criticalBehaviors: relationshipPatterns.filter((p: any) =>
                    ['severe', 'critical', 'high'].includes(p.severity?.toLowerCase())
                ),

                // MENTAL HEALTH (Female)
                mentalOverallWellbeing: mentalOverallWellbeing,
                mentalTotalRisk: mentalTotalRisk,
                mentalCategories: mentalCategories,
                emotionalStrengths: emotionalStrengths,
                criticalMentalFlags: mentalCategories.filter((c: any) =>
                    ['severe', 'critical', 'high'].includes(c.riskLevel?.toLowerCase())
                ),

                // IN-LAW HARMONY
                inLawHarmony_Self: {
                    secondHouseScore: inLawA.secondHouseScore,
                    tenthHouseScore: inLawA.tenthHouseScore,
                    indicators: inLawIndicatorsA,
                },
                inLawHarmony_Partner: {
                    secondHouseScore: inLawB.secondHouseScore,
                    tenthHouseScore: inLawB.tenthHouseScore,
                    indicators: inLawIndicatorsB,
                },

                // SEXUAL HEALTH (Female detailed)
                sexualHealth: {
                    mutualSatisfactionScore: mutualSatisfaction.score,
                    vibeMatch: mutualSatisfaction.vibeMatch,
                    elementCompat: mutualSatisfaction.elementCompatibility,
                    femaleHealth: {
                        frigidityRisk: femaleHealth.frigidityRisk,
                        physicalPainRisk: femaleHealth.physicalPainRisk,
                        indicators: femaleHealth.indicators || [],
                    },
                    libido: libidoB.level,
                    orientation: orientationB.pattern,
                },

                // MODERN CHALLENGES
                modernChallenges: {
                    digitalAge: modernCh.digitalAge || [],
                    careerStress: modernCh.careerStress || [],
                    mentalHealth: modernCh.mentalHealth || [],
                    communicationIssues: modernCh.communicationIssues || [],
                    totalChallenges: (modernCh.digitalAge?.length || 0) + (modernCh.careerStress?.length || 0) +
                        (modernCh.mentalHealth?.length || 0) + (modernCh.communicationIssues?.length || 0),
                },

                // YOGA/DOSHA (Female)
                yogaDoshaFemale: {
                    categories: yogaCategories,
                    positiveYogas: yogaCategories.filter((c: any) => c.type === 'yoga'),
                    negativeDoshas: yogaCategories.filter((c: any) => c.type === 'dosha'),
                },

                // PSYCHOLOGICAL PROFILE (Female)
                psychProfile: {
                    traits: psychB.traits || psychB.dominantTraits || [],
                    nature: psychB.nature || psychB.overallNature || '',
                    behavior: psychB.behavior || psychB.behavioralPattern || '',
                    attachmentStyle: psychB.attachmentStyle || '',
                },

                // RISK DETAILS
                riskDetails: {
                    rawDivorceRisk: riskA.divorceProbability?.rawScore,
                    rawInfidelityRisk: riskA.infidelityRisk?.rawScore,
                    divorceIndicators: divorceIndicators,
                    infidelityIndicators: infidelityIndicators,
                    protectiveFactors: protectiveFactors,
                    multipleMarriageIndicators: multipleMarriage,
                    spouseLongevity: riskA.spouseLongevity,
                },

                // KP Promise
                kpSelfPromise: report.kpAnalysis?.partnerA?.seventhCuspSubLord?.marriagePromise,
                kpPartnerPromise: report.kpAnalysis?.partnerB?.seventhCuspSubLord?.marriagePromise,

                // Synastry
                soulmateConnections: report.synastry?.soulmateConnections?.length || 0,
                jaiminiContact: report.synastry?.jaiminiCompatibility?.darakarakaContact,

                profileLink,
            };

            results.push(result);

            // Print summary
            console.log(`   📊 Score: ${result.overallScore} | Verdict: ${result.verdict}`);
            console.log(`   🏛️  Pillars: Stab=${result.stabilityScore} Int=${result.interactionScore} Soul=${result.soulScore} Trad=${result.traditionScore} Prom=${result.promiseScore}`);
            console.log(`   ⚔️  Conflict Zones: ${result.conflictZoneCount} total | Severe: ${result.severeConflicts.length}`);
            console.log(`   🎭 Relationship Behaviors: Overall Risk=${result.relationshipOverallRisk} | Critical: ${result.criticalBehaviors.length}`);
            console.log(`   🧪 Addiction: Overall=${result.addictionOverallLevel} (${result.addictionOverallScore}) | Sexual: ${result.sexualAddiction.level}`);
            console.log(`   🧠 Mental Health: ${result.mentalOverallWellbeing} (Risk: ${result.mentalTotalRisk}) | Critical: ${result.criticalMentalFlags.length}`);
            console.log(`   👨‍👩‍👧 In-Law (Self): 2H=${result.inLawHarmony_Self.secondHouseScore}, 10H=${result.inLawHarmony_Self.tenthHouseScore}`);
            console.log(`   🔥 Sexual: Satisfaction=${result.sexualHealth.mutualSatisfactionScore} | Libido=${result.sexualHealth.libido} | Frigidity=${result.sexualHealth.femaleHealth.frigidityRisk}`);
            console.log(`   🌍 Modern Challenges: ${result.modernChallenges.totalChallenges} total`);

        } catch (error: any) {
            console.error(`   ❌ Error: ${error.message}`);
        }
    }

    // Sort by overall score
    results.sort((a, b) => b.overallScore - a.overallScore);

    // Save full JSON
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`\n📄 Full results saved to: ${OUTPUT_JSON}`);

    // Print RED FLAG SUMMARY
    console.log('\n' + '='.repeat(70));
    console.log('  🚨 RED FLAG SUMMARY — DISQUALIFYING FACTORS');
    console.log('='.repeat(70));
    for (const r of results) {
        const flags: string[] = [];
        if (r.severeConflicts.length > 0) flags.push(`⚠️ ${r.severeConflicts.length} SEVERE conflict zones`);
        if (r.criticalBehaviors.length > 0) flags.push(`🚫 ${r.criticalBehaviors.length} CRITICAL relationship behaviors`);
        if (r.criticalMentalFlags.length > 0) flags.push(`🧠 ${r.criticalMentalFlags.length} CRITICAL mental health flags`);
        if ((r.sexualAddiction.score || 0) > 50) flags.push(`🔴 Sexual addiction risk: ${r.sexualAddiction.score}`);
        if (r.addictionOverallScore > 50) flags.push(`🔴 Addiction risk: ${r.addictionOverallScore}`);
        if (r.riskDetails.rawDivorceRisk > 50) flags.push(`⚠️ HIGH divorce risk: ${r.riskDetails.rawDivorceRisk}%`);

        console.log(`\n${r.name} (Score: ${r.overallScore})`);
        if (flags.length === 0) {
            console.log(`   ✅ NO RED FLAGS — Clean profile`);
        } else {
            flags.forEach(f => console.log(`   ${f}`));
        }
    }

    // Print BEST MATCH recommendation
    console.log('\n' + '='.repeat(70));
    console.log('  🏆 FINAL RECOMMENDATION');
    console.log('='.repeat(70));
    const cleanProfiles = results.filter(r =>
        r.severeConflicts.length === 0 &&
        r.criticalBehaviors.length === 0 &&
        r.criticalMentalFlags.length === 0 &&
        r.addictionOverallScore <= 50 &&
        r.riskDetails.rawDivorceRisk <= 40
    );
    if (cleanProfiles.length > 0) {
        console.log(`\n✨ ${cleanProfiles.length} profiles passed ALL safety checks.`);
        console.log(`🥇 BEST MATCH: ${cleanProfiles[0].name} (Score: ${cleanProfiles[0].overallScore})`);
    }

    console.log('\n' + '='.repeat(70));
    console.log(`  DONE! Ultra-deep analysis complete for ${results.length} profiles.`);
    console.log('='.repeat(70));
}

if (!fs.existsSync(INPUT_CSV)) {
    console.error(`❌ ERROR: Input CSV not found at: ${INPUT_CSV}`);
    process.exit(1);
}

ultraDeepAnalyze().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
