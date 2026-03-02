import { config } from 'dotenv';
config();
import { calculateChart } from '../lib/coreCalculations';
import { predictSpouseCharacteristics } from '../lib/spouseCalculations';
import { calculateExtendedSpousePrediction } from '../lib/extendedCalculations';

async function calculate() {
    // 1. Sheetal
    const sheetalChart = await calculateChart(
        new Date('1997-11-12T08:25:00'),
        19.0596, // Mumbai Suburban approx
        72.8295,
        'Asia/Kolkata',
        'female'
    );
    const sheetalSpouseBasic = predictSpouseCharacteristics(sheetalChart);
    const sheetalSpouseExtended = calculateExtendedSpousePrediction(sheetalChart);

    // 2. Ashwini
    // Assuming 7:30 AM based on "7:30" format
    const ashwiniChart = await calculateChart(
        new Date('1998-02-22T07:30:00'),
        19.2952, // Bhayandar
        72.8496,
        'Asia/Kolkata',
        'female'
    );
    const ashwiniSpouseBasic = predictSpouseCharacteristics(ashwiniChart);
    const ashwiniSpouseExtended = calculateExtendedSpousePrediction(ashwiniChart);

    console.log("=== SHEETAL'S PREDICTED SPOUSE ===");
    console.log("Traits:", JSON.stringify(sheetalSpouseExtended.seventhHouse?.spouseTraits, null, 2));
    console.log("Physique:", JSON.stringify(sheetalSpouseBasic.physique, null, 2));
    console.log("Nature:", JSON.stringify(sheetalSpouseBasic.nature, null, 2));
    console.log("Profession:", JSON.stringify(sheetalSpouseBasic.profession?.indicators, null, 2));
    console.log("Key Predictions:", JSON.stringify(sheetalSpouseBasic.predictions, null, 2));

    console.log("\n=== ASHWINI'S PREDICTED SPOUSE ===");
    console.log("Traits:", JSON.stringify(ashwiniSpouseExtended.seventhHouse?.spouseTraits, null, 2));
    console.log("Physique:", JSON.stringify(ashwiniSpouseBasic.physique, null, 2));
    console.log("Nature:", JSON.stringify(ashwiniSpouseBasic.nature, null, 2));
    console.log("Profession:", JSON.stringify(ashwiniSpouseBasic.profession?.indicators, null, 2));
    console.log("Key Predictions:", JSON.stringify(ashwiniSpouseBasic.predictions, null, 2));
}

calculate().catch(err => console.error(err));
