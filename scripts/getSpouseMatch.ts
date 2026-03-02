import { config } from 'dotenv';
config();
import { generateChartFromBirthData } from '../lib/reportGenerator';
import { calculateSpousePrediction } from '../lib/spouseCalculations';
import { calculateExtendedSpousePrediction } from '../lib/extendedCalculations';

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
    latitude: 19.2403, // Kalyan
    longitude: 73.1305,
    timezone: 'Asia/Kolkata',
};

const ashwiniData = {
    name: 'Ashwini',
    gender: 'female',
    dateOfBirth: '1998-02-22',
    timeOfBirth: '07:30',
    location: 'Bhayandar',
    latitude: 19.2952, // Bhayandar
    longitude: 72.8496,
    timezone: 'Asia/Kolkata',
};

async function calculate() {
    console.log("=== CALCULATING RAHUL'S TRAITS ===");
    // @ts-ignore
    const rahulChart = await generateChartFromBirthData(rahulData);
    console.log("Ascendant:", rahulChart.ascendant);
    const moon = rahulChart.planetaryPositions.find((p: any) => p.planet === 'Moon');
    console.log("Moon Sign:", moon?.sign);
    console.log("Nakshatra:", moon?.nakshatra);

    // @ts-ignore
    const sheetalChart = await generateChartFromBirthData(sheetalData);
    const sheetalSpouseBasic = calculateSpousePrediction(sheetalChart);
    const sheetalSpouseExtended = calculateExtendedSpousePrediction(sheetalChart);

    // @ts-ignore
    const ashwiniChart = await generateChartFromBirthData(ashwiniData);
    const ashwiniSpouseBasic = calculateSpousePrediction(ashwiniChart);
    const ashwiniSpouseExtended = calculateExtendedSpousePrediction(ashwiniChart);

    console.log("\n=== SHEETAL'S PREDICTED SPOUSE ===");
    console.log("Traits:", sheetalSpouseExtended.seventhHouse?.spouseTraits);
    console.log("Physique:", JSON.stringify(sheetalSpouseBasic.physique));
    console.log("Nature:", JSON.stringify(sheetalSpouseBasic.nature));
    console.log("Profession:", JSON.stringify(sheetalSpouseBasic.profession?.indicators));
    console.log("Directions:", JSON.stringify(sheetalSpouseBasic.meetingPrediction?.direction));

    console.log("\n=== ASHWINI'S PREDICTED SPOUSE ===");
    console.log("Traits:", ashwiniSpouseExtended.seventhHouse?.spouseTraits);
    console.log("Physique:", JSON.stringify(ashwiniSpouseBasic.physique));
    console.log("Nature:", JSON.stringify(ashwiniSpouseBasic.nature));
    console.log("Profession:", JSON.stringify(ashwiniSpouseBasic.profession?.indicators));
    console.log("Directions:", JSON.stringify(ashwiniSpouseBasic.meetingPrediction?.direction));
}

calculate().catch(err => console.error(err));
