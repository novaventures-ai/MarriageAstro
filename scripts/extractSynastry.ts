/**
 * Extract Specific Widgets — Ashwini Chandanshiv
 */
import { generateFullCompatibilityReport } from '@lib/reportGenerator';
import { BirthDataInput } from '@types';

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

const FEMALE_PROFILE: BirthDataInput = {
    name: "Ashwini Chandanshiv",
    dateOfBirth: "1998-02-22",
    timeOfBirth: "07:30",
    location: "Bhayandar, Maharashtra, India",
    latitude: 19.3012,
    longitude: 72.8512,
    timezone: "Asia/Kolkata",
    gender: "female"
};

async function main() {
    try {
        const report = await generateFullCompatibilityReport(MALE_PROFILE, FEMALE_PROFILE);

        console.log("=== SYNASTRY (PLANETARY OVERLAYS) ===");
        console.log(JSON.stringify(report.synastry, null, 2));

        console.log("\n=== MODERN INSIGHTS ENHANCED ===");
        console.log(JSON.stringify(report.modernInsightsEnhanced, null, 2));

        console.log("\n=== RELATIONSHIP PATTERN ANALYSIS ===");
        console.log(JSON.stringify(report.relationshipPatternAnalysis, null, 2));

        console.log("\n=== ADVANCED BREAKDOWN ===");
        console.log(JSON.stringify(report.advancedBreakdown, null, 2));

        console.log("\n=== CONFLICT ZONE ===");
        console.log(JSON.stringify(report.conflictZone, null, 2));

        console.log("\n=== VULNERABILITY TIMELINE ===");
        console.log(JSON.stringify(report.vulnerabilityTimeline, null, 2));

    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

main();
