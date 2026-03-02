import { generateFullCompatibilityReport } from './lib/reportGenerator';
import { BirthDataInput } from './types';

const MALE_PROFILE: BirthDataInput = {
    name: "Rahul Govalkar",
    dateOfBirth: "1995-09-28",
    timeOfBirth: "00:50",
    location: "Mumbai, Maharashtra, India",
    latitude: 18.9582,
    longitude: 72.8321,
    timezone: 5.5,
    gender: "male"
};

const ektaData: BirthDataInput = {
    name: "Ekta Trivedi",
    dateOfBirth: "1998-01-15",
    timeOfBirth: "08:05",
    location: "Kanpur, Uttar Pradesh",
    latitude: 26.4499,
    longitude: 80.3319,
    timezone: 5.5,
    gender: "female"
};

async function test() {
    try {
        const report = await generateFullCompatibilityReport(MALE_PROFILE, ektaData);
        console.log("Overall Score:", report.overallScore);
        console.log("Verdict:", report.overallVerdict);
        console.log("Promise A (Self):", report.kpAnalysis?.partnerA?.seventhCuspSubLord?.marriagePromise);
        console.log("Promise B (Partner):", report.kpAnalysis?.partnerB?.seventhCuspSubLord?.marriagePromise);
        console.log("Pillars:", JSON.stringify(report.advancedBreakdown, null, 2));
    } catch (err) {
        console.error(err);
    }
}

test();
