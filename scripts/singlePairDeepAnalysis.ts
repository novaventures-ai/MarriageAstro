/**
 * Single-Pair Deep Compatibility Analysis — Rahul × Ashwini
 * Runs the FULL MarriageAstro engine and dumps every widget-level detail.
 * 
 * Run: npx vite-node scripts/singlePairDeepAnalysis.ts
 */
import fs from 'fs';
import path from 'path';
import { generateFullCompatibilityReport } from '@lib/reportGenerator';
import { BirthDataInput } from '@types';

const OUTPUT_JSON = path.resolve('scripts/rahul_ashwini_deep_analysis.json');

const rahulData: BirthDataInput = {
    name: 'Rahul',
    gender: 'male',
    dateOfBirth: '1995-09-28',
    timeOfBirth: '00:50',
    location: 'Mumbai',
    latitude: 19.0760,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata'
};

const ashwiniData: BirthDataInput = {
    name: 'Ashwini',
    gender: 'female',
    dateOfBirth: '1998-02-22',
    timeOfBirth: '07:30',
    location: 'Bhayandar',
    latitude: 19.2952,
    longitude: 72.8496,
    timezone: 'Asia/Kolkata'
};

async function runDeepAnalysis() {
    console.log('='.repeat(70));
    console.log('  DEEP COMPATIBILITY ANALYSIS — RAHUL × ASHWINI');
    console.log('='.repeat(70) + '\n');

    const report: any = await generateFullCompatibilityReport(rahulData, ashwiniData);

    // SAVE FULL JSON FIRST
    const serialized = JSON.stringify(report, (key, value) => {
        if (value instanceof Date) return value.toISOString();
        return value;
    }, 2);
    fs.writeFileSync(OUTPUT_JSON, serialized, 'utf-8');
    console.log(`Full JSON saved to: ${OUTPUT_JSON}`);

    // Print summary
    console.log(`OVERALL SCORE: ${report.overallScore}`);
    console.log(`VERDICT: ${report.overallVerdict?.level || report.overallVerdict}`);

    const pillars = report.advancedBreakdown || {};
    console.log(`Stability: ${pillars.stability?.score}, Interaction: ${pillars.interaction?.score}, Soul: ${pillars.soul?.score}, Tradition: ${pillars.tradition?.score}, Promise: ${pillars.promise?.score}`);
    console.log(`Ashtakoot: ${report.ashtakoot?.totalScore}/36 (${report.ashtakoot?.percentage}%)`);

    console.log('DONE');


    console.log('\n' + '='.repeat(70));
    console.log('  ANALYSIS COMPLETE');
    console.log('='.repeat(70));
}

runDeepAnalysis();
