import { config } from 'dotenv';
config();
import { generateChartFromBirthData } from '../lib/reportGenerator';
import { calculatePsychologicalProfile } from '../lib/selfReportGenerator';

const rahulData = {
    name: 'Rahul',
    gender: 'male',
    dateOfBirth: '1995-09-28',
    timeOfBirth: '00:50',
    location: 'Mumbai',
    latitude: 19.0760,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata',
};

const sheetalData = {
    name: 'Sheetal',
    gender: 'female',
    dateOfBirth: '1997-11-12',
    timeOfBirth: '08:25',
    location: 'Kalyan',
    latitude: 19.2403,
    longitude: 73.1305,
    timezone: 'Asia/Kolkata',
};

const ashwiniData = {
    name: 'Ashwini',
    gender: 'female',
    dateOfBirth: '1998-02-22',
    timeOfBirth: '07:30',
    location: 'Bhayandar',
    latitude: 19.2952,
    longitude: 72.8496,
    timezone: 'Asia/Kolkata',
};

async function calculate() {
    // @ts-ignore
    const rahulChart = await generateChartFromBirthData(rahulData);
    const rahulPsych = calculatePsychologicalProfile(rahulChart);

    // @ts-ignore
    const sheetalChart = await generateChartFromBirthData(sheetalData);
    const sheetalPsych = calculatePsychologicalProfile(sheetalChart);

    // @ts-ignore
    const ashwiniChart = await generateChartFromBirthData(ashwiniData);
    const ashwiniPsych = calculatePsychologicalProfile(ashwiniChart);

    console.log("=== RAHUL'S PSYCHE ===");
    console.log("Communication:", rahulPsych.communicationStyle.style);
    console.log("Expression:", rahulPsych.communicationStyle.expressionMethod);
    console.log("Love Language:", rahulPsych.loveLanguage.primary);

    console.log("\n=== SHEETAL'S PSYCHE ===");
    console.log("Communication:", sheetalPsych.communicationStyle.style);
    console.log("Expression:", sheetalPsych.communicationStyle.expressionMethod);
    console.log("Love Language:", sheetalPsych.loveLanguage.primary);

    console.log("\n=== ASHWINI'S PSYCHE ===");
    console.log("Communication:", ashwiniPsych.communicationStyle.style);
    console.log("Expression:", ashwiniPsych.communicationStyle.expressionMethod);
    console.log("Love Language:", ashwiniPsych.loveLanguage.primary);
}

calculate().catch(err => console.error(err));
