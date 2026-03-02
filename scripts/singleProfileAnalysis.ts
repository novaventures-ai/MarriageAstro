/**
 * Single Profile Deep Analysis — Ashwini Chandanshiv
 * Runs the full compatibility report and dumps ALL widget data.
 * 
 * Run: npx vite-node scripts/singleProfileAnalysis.ts
 */
import { generateFullCompatibilityReport } from '@lib/reportGenerator';
import { BirthDataInput } from '@types';

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

// Ashwini Chandanshiv's birth details
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
    console.log("=".repeat(80));
    console.log("  DEEP ANALYSIS: Ashwini Chandanshiv × Rahul Govalkar");
    console.log("=".repeat(80));

    try {
        const report = await generateFullCompatibilityReport(MALE_PROFILE, FEMALE_PROFILE);

        // Dump everything
        console.log("\n📊 OVERALL SCORE:", report.overallScore);
        console.log("🎯 VERDICT:", report.verdict);
        console.log("📐 ASHTAKOOT POINTS:", report.ashtakoot?.totalPoints, "/36");

        // Pillar Scores
        console.log("\n" + "=".repeat(60));
        console.log("  5-PILLAR BREAKDOWN");
        console.log("=".repeat(60));
        if (report.pillarScores) {
            for (const [key, val] of Object.entries(report.pillarScores)) {
                console.log(`  ${key}: ${JSON.stringify(val)}`);
            }
        }

        // Ashtakoot Details
        console.log("\n" + "=".repeat(60));
        console.log("  ASHTAKOOT (GUNA MILAN) DETAILS");
        console.log("=".repeat(60));
        if (report.ashtakoot) {
            console.log(JSON.stringify(report.ashtakoot, null, 2));
        }

        // Manglik
        console.log("\n" + "=".repeat(60));
        console.log("  MANGLIK STATUS");
        console.log("=".repeat(60));
        if (report.manglikAnalysis) {
            console.log(JSON.stringify(report.manglikAnalysis, null, 2));
        }

        // Conflict Zones
        console.log("\n" + "=".repeat(60));
        console.log("  CONFLICT ZONES");
        console.log("=".repeat(60));
        if (report.conflictZones) {
            console.log(`  Total: ${report.conflictZones.length}`);
            for (const cz of report.conflictZones) {
                console.log(`  - ${cz.category} [${cz.severity}]: ${cz.description}`);
            }
        }

        // Relationship Behaviors
        console.log("\n" + "=".repeat(60));
        console.log("  RELATIONSHIP BEHAVIORS");
        console.log("=".repeat(60));
        if (report.relationshipBehaviors) {
            console.log(JSON.stringify(report.relationshipBehaviors, null, 2));
        }

        // Addiction Analysis
        console.log("\n" + "=".repeat(60));
        console.log("  ADDICTION ANALYSIS");
        console.log("=".repeat(60));
        if (report.addictionAnalysis) {
            console.log(JSON.stringify(report.addictionAnalysis, null, 2));
        }

        // Mental Health
        console.log("\n" + "=".repeat(60));
        console.log("  MENTAL HEALTH");
        console.log("=".repeat(60));
        if (report.mentalHealthAnalysis) {
            console.log(JSON.stringify(report.mentalHealthAnalysis, null, 2));
        }

        // Sexual Compatibility
        console.log("\n" + "=".repeat(60));
        console.log("  SEXUAL COMPATIBILITY");
        console.log("=".repeat(60));
        if (report.sexualCompatibility) {
            console.log(JSON.stringify(report.sexualCompatibility, null, 2));
        }

        // In-Law Harmony
        console.log("\n" + "=".repeat(60));
        console.log("  IN-LAW HARMONY");
        console.log("=".repeat(60));
        if (report.inLawHarmony) {
            console.log(JSON.stringify(report.inLawHarmony, null, 2));
        }

        // Modern Challenges
        console.log("\n" + "=".repeat(60));
        console.log("  MODERN CHALLENGES");
        console.log("=".repeat(60));
        if (report.modernChallenges) {
            console.log(JSON.stringify(report.modernChallenges, null, 2));
        }

        // Risk Details (Divorce, Infidelity, Spouse Longevity)
        console.log("\n" + "=".repeat(60));
        console.log("  RISK DETAILS");
        console.log("=".repeat(60));
        if (report.riskDetails) {
            console.log(JSON.stringify(report.riskDetails, null, 2));
        }

        // Yoga & Doshas
        console.log("\n" + "=".repeat(60));
        console.log("  YOGA & DOSHAS");
        console.log("=".repeat(60));
        if (report.yogaDoshaAnalysis) {
            console.log(JSON.stringify(report.yogaDoshaAnalysis, null, 2));
        }

        // Psychological Profile
        console.log("\n" + "=".repeat(60));
        console.log("  PSYCHOLOGICAL PROFILE");
        console.log("=".repeat(60));
        if (report.psychologicalProfile) {
            console.log(JSON.stringify(report.psychologicalProfile, null, 2));
        }

        // KP Analysis
        console.log("\n" + "=".repeat(60));
        console.log("  KP (KRISHNAMURTHY) ANALYSIS");
        console.log("=".repeat(60));
        if (report.kpAnalysis) {
            console.log(JSON.stringify(report.kpAnalysis, null, 2));
        }

        // Jaimini Analysis
        console.log("\n" + "=".repeat(60));
        console.log("  JAIMINI ANALYSIS");
        console.log("=".repeat(60));
        if (report.jaiminiAnalysis) {
            console.log(JSON.stringify(report.jaiminiAnalysis, null, 2));
        }

        // Spouse Prediction
        console.log("\n" + "=".repeat(60));
        console.log("  SPOUSE PREDICTION");
        console.log("=".repeat(60));
        if (report.spousePrediction) {
            console.log(JSON.stringify(report.spousePrediction, null, 2));
        }

        // Divisional Charts
        console.log("\n" + "=".repeat(60));
        console.log("  DIVISIONAL CHART ANALYSIS");
        console.log("=".repeat(60));
        if (report.divisionalChartAnalysis) {
            console.log(JSON.stringify(report.divisionalChartAnalysis, null, 2));
        }

        // Soulmate Analysis
        console.log("\n" + "=".repeat(60));
        console.log("  SOULMATE CONNECTIONS");
        console.log("=".repeat(60));
        if (report.soulmateAnalysis) {
            console.log(JSON.stringify(report.soulmateAnalysis, null, 2));
        }

        // Dump entire report keys for anything missed
        console.log("\n" + "=".repeat(60));
        console.log("  ALL REPORT KEYS");
        console.log("=".repeat(60));
        for (const key of Object.keys(report)) {
            const val = (report as any)[key];
            const type = Array.isArray(val) ? `array[${val.length}]` : typeof val;
            console.log(`  ${key}: ${type}`);
        }

    } catch (e: any) {
        console.error("Error:", e.message);
        console.error(e.stack);
    }
}

main();
