# Astro Marriage - Vedic Astrology Compatibility App

A comprehensive, full-stack Vedic Astrology application focused on relationship compatibility. The app calculates detailed synastry, Ashtakoot Milan (36 points), Dasha timing, and incorporates Modern Planetary influences (Uranus, Neptune, Pluto).

## Features

### Core Astrology Engine
- **Precision Calculations**: Planetary positions using Swiss Ephemeris algorithms
- **Complete Planetary Set**: Sun through Pluto including outer planets
- **Divisional Charts**: D1 (Rashi), D9 (Navamsa), D7 (Saptamsa), D60 (Shashtiamsa)
- **Multiple Dasha Systems**: Vimshottari, Chara (Jaimini), and KP Dasha

### Advanced Systems
- **KP Astrology (Stellar Astrology)**: Cuspal Sub Lords, Significators, Ruling Planets
- **Jaimini System**: Chara Karakas (AK-DK), Upapada Lagna, Vivah Saham, Chara Dasha
- **Shodashvarga Analysis**: All 16 divisional charts with weighted scoring

### Compatibility Analysis
- **Ashtakoot Milan**: Full 36-point calculation with Nadi/Bhakoot/Gana cancellation rules
- **Navamsa Matching**: V.P. Goel's 4-step method
- **Detailed Synastry**: Soulmate (Jupiter-Moon), Karmic (Saturn), Sexual (Mars-Venus)
- **In-Law Analysis**: 2nd/10th house assessment with D9 confirmation

### Sexual Health Assessment
- **Male Health**: PME and ED risk indicators
- **Female Health**: Frigidity and physical pain risk assessment
- **Mutual Satisfaction**: Element balance and compatibility scoring

### Risk Assessment
- **Divorce Probability**: Based on 111-case research (99% correlation with 7th/2nd house afflictions)
- **Infidelity Warning System**: 5-8-12 house connection analysis
- **Multiple Marriage Indicators**: Dual signs on 7th cusp, UL sequences

### Modern Insights
- **Outer Planets**: Uranus, Neptune, Pluto interpretations
- **Digital Age Issues**: Communication patterns, social media effects
- **Mental Health Markers**: Anxiety, depression, narcissism indicators

### Timing & Remedies
- **Marriage Windows**: Dasha + Transit confluence analysis
- **Lal Kitab Remedies**: Simple, practical solutions
- **Gemstone Recommendations**: Based on functional benefics

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router v6** for navigation
- **Lucide React** for icons
- **Recharts** for data visualization

### Backend Logic
- **TypeScript** calculation engine
- **Modular Architecture**:
  - `coreCalculations.ts` - Planetary positions, houses, aspects
  - `vargaCalculations.ts` - Divisional charts (D9, D7, D60)
  - `dashaCalculations.ts` - Vimshottari and Chara Dasha
  - `kpCalculations.ts` - KP Astrology system
  - `jaiminiCalculations.ts` - Jaimini special points
  - `compatibilityCalculations.ts` - Ashtakoot, Navamsa matching
  - `sexualHealthCalculations.ts` - PME/ED/Frigidity analysis
  - `riskCalculations.ts` - Divorce/Infidelity assessment
  - `reportGenerator.ts` - Complete report orchestration

### Data Layer
- **JSON Knowledge Base**:
  - `yoni_matrix.json` - 14x14 sexual compatibility
  - `gana_rules.json` - Deva/Manushya/Rakshasa with cancellations
  - `lal_kitab_remedies.json` - Planet-House-Remedy mappings
  - `modern_planets_text.json` - U/N/P interpretations
  - `synastry_rules.json` - Soulmate/Karmic aspect rules
  - `risk_rules.json` - Divorce/Infidelity configurations
  - `modern_challenges.json` - Digital age & mental health
  - `chara_dasha_rules.json` - Jaimini timing system
  - `sexual_health_rules.json` - PME/ED/Frigidity indicators
  - `kp_sub_lords.json` - 1-249 Sub Lord divisions
  - `varga_weights.json` - Shodashvarga weighting scheme

## Project Structure

```
Astro_Marriage/
├── knowledge/                    # JSON knowledge base
│   ├── yoni_matrix.json
│   ├── gana_rules.json
│   ├── lal_kitab_remedies.json
│   ├── modern_planets_text.json
│   ├── synastry_rules.json
│   ├── risk_rules.json
│   ├── modern_challenges.json
│   ├── chara_dasha_rules.json
│   ├── sexual_health_rules.json
│   ├── kp_sub_lords.json
│   └── varga_weights.json
│
├── types/                        # TypeScript definitions
│   └── index.ts                  # All interfaces and types
│
├── lib/                          # Calculation engine
│   ├── index.ts                  # Main exports
│   ├── coreCalculations.ts       # Planets, houses, aspects
│   ├── vargaCalculations.ts      # Divisional charts
│   ├── dashaCalculations.ts      # Timing systems
│   ├── kpCalculations.ts         # KP Astrology
│   ├── jaiminiCalculations.ts    # Jaimini system
│   ├── compatibilityCalculations.ts
│   ├── sexualHealthCalculations.ts
│   ├── riskCalculations.ts
│   └── reportGenerator.ts
│
├── src/                          # Frontend application
│   ├── components/
│   │   ├── BirthDataForm.tsx
│   │   └── widgets/
│   │       ├── OverviewWidget.tsx
│   │       ├── AshtakootWidget.tsx
│   │       ├── RiskRadarWidget.tsx
│   │       ├── SynastryWidget.tsx
│   │       ├── SexualHealthWidget.tsx
│   │       ├── TimingWidget.tsx
│   │       ├── RemediesWidget.tsx
│   │       └── ModernInsightsWidget.tsx
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── CalculatorPage.tsx
│   │   └── ReportPage.tsx
│   ├── store/
│   │   └── useAppStore.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── index.html
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Astro_Marriage
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Landing Page**: Learn about the app and its features
2. **Calculator**: Enter birth details for both partners
   - Name, gender, birth date/time
   - Location with coordinates
   - Timezone selection
3. **Report**: View comprehensive analysis
   - Executive summary with traffic light status
   - Detailed Ashtakoot breakdown
   - Synastry and modern insights
   - Sexual health assessment
   - Risk analysis
   - Favorable timing windows
   - Personalized remedies

## Calculation Methodology

### Ashtakoot Milan (36 Points)
1. **Varna** (1 point) - Spiritual compatibility
2. **Vashya** (2 points) - Mutual attraction
3. **Tara** (3 points) - Destiny/Health
4. **Yoni** (4 points) - Sexual compatibility (14 animals)
5. **Graha Maitri** (5 points) - Psychological friendship
6. **Gana** (6 points) - Temperament (Deva/Manushya/Rakshasa)
7. **Bhakoot** (7 points) - Emotional/Financial flow
8. **Nadi** (8 points) - Genetic/Health compatibility

### Scoring Interpretation
- **< 18 points**: Below Average (avoid)
- **18-24 points**: Average (manageable with effort)
- **25-32 points**: Very Good (compatible)
- **33-36 points**: Excellent (highly compatible)

### Risk Assessment Matrix
- **Low Risk** (0-25): Minor afflictions, manageable
- **Medium Risk** (26-50): Notable challenges
- **High Risk** (51-75): Significant difficulties
- **Very High Risk** (76-100): Severe afflictions

## Dosha Cancellation Rules

### Nadi Dosha Cancellation
- Same Rashi but different Nakshatra
- Same Nakshatra but different Rashi lords
- Exception Nakshatras: Revati, Shravana, Mrigashira

### Bhakoot Dosha Cancellation
- Rashi lords are mutual friends
- Navamsa lords are friendly

### Gana Dosha Cancellation
- Rashi lords are friends
- Same Tara (auspicious)

## License

MIT License - feel free to use this for personal or commercial projects.

## Disclaimer

This application is for entertainment and educational purposes. Astrological predictions should not replace professional advice from qualified healthcare providers, counselors, or legal professionals.

## Acknowledgments

- Vedic astrology principles from Brihat Parasara Hora Shastra (BPHS)
- Research data from Jyotisha Journal divorce case studies
- Lal Kitab remedies based on traditional texts
- Modern planetary interpretations based on contemporary astrological research