/**
 * Feature Demo Data
 * Hardcoded realistic mock data for feature explanation pages.
 * Ananya Sharma (female, Pune, 1997-03-15) × Vikram Deshmukh (male, Mumbai, 1995-08-22)
 */

import type {
  AshtakootResult,
  RiskAssessment,
  TimingAnalysis,
  VulnerabilityTimeline,
  SpousePrediction,
  PsychologicalProfile,
  ConflictZone,
} from '../types';

export const DEMO_NAME_A = 'Ananya';
export const DEMO_NAME_B = 'Vikram';

// ─── Ashtakoot ───────────────────────────────────────────────────────────────
export const demoAshtakoot: AshtakootResult = {
  totalScore: 29,
  maxScore: 36,
  percentage: 80.6,
  parameters: {
    varna:       { name: 'Varna',       boyValue: 'Brahmin',   girlValue: 'Kshatriya', pointsObtained: 1, maxPoints: 1,  interpretation: 'Compatible — groom\'s Varna is equal to or higher.' },
    vashya:      { name: 'Vashya',      boyValue: 'Human',     girlValue: 'Human',     pointsObtained: 2, maxPoints: 2,  interpretation: 'Excellent mutual attraction and influence.' },
    tara:        { name: 'Tara',        boyValue: 'Sampat',    girlValue: 'Kshema',    pointsObtained: 3, maxPoints: 3,  interpretation: 'Highly auspicious — mutual wellbeing indicated.' },
    yoni:        { name: 'Yoni',        boyValue: 'Horse',     girlValue: 'Elephant',  pointsObtained: 2, maxPoints: 4,  interpretation: 'Moderate sexual compatibility — friendly but not identical Yoni.' },
    grahaMaitri: { name: 'Graha Maitri',boyValue: 'Jupiter',   girlValue: 'Venus',     pointsObtained: 4, maxPoints: 5,  interpretation: 'Strong mental compatibility — Jupiter and Venus are friends.' },
    gana:        { name: 'Gana',        boyValue: 'Manushya',  girlValue: 'Deva',      pointsObtained: 5, maxPoints: 6,  interpretation: 'Good compatibility — Deva-Manushya is acceptable.' },
    bhakoot:     { name: 'Bhakoot',     boyValue: 'Virgo',     girlValue: 'Pisces',    pointsObtained: 7, maxPoints: 7,  interpretation: 'Full marks — 7/7 relationship; highly auspicious.' },
    nadi:        { name: 'Nadi',        boyValue: 'Pitta',     girlValue: 'Vata',      pointsObtained: 8, maxPoints: 8,  interpretation: 'Perfect — different Nadis, no Nadi Dosha.' },
  },
  exceptions: ['Bhakoot exception: Virgo-Pisces is a 7/7 pair which scores full points.'],
  doshas: { nadiDosha: false, bhakootDosha: false, ganaDosha: false },
  manglikAnalysis: {
    partnerA: { isManglik: true,  score: 2, isCancelled: true,  cancellationReasons: ['Mars in own sign Scorpio neutralises the dosha'] },
    partnerB: { isManglik: false, score: 0, isCancelled: false, cancellationReasons: [] },
    compatibility: 'Ananya\'s Mangal Dosha is cancelled. No compatibility concern.',
  },
};

// ─── Risk Assessment ──────────────────────────────────────────────────────────
export const demoRiskAssessment: RiskAssessment = {
  divorceProbability: {
    score: 22, rawScore: 28, level: 'low',
    indicators: [
      { text: 'Jupiter in 7th house adds protective influence', profileName: DEMO_NAME_A },
      { text: 'Saturn aspects 7th lord from 10th — mild tension around responsibilities', profileName: DEMO_NAME_B },
    ],
    mitigation: ['Strong Bhakoot score reduces structural risk', 'Jupiter transit over 7th house in 2027 is protective'],
    partnerA: { score: 18, rawScore: 22, level: 'low', indicators: [{ text: 'Venus in friendly sign in 7th house', profileName: DEMO_NAME_A }] },
    partnerB: { score: 26, rawScore: 32, level: 'medium', indicators: [{ text: 'Saturn aspects natal Venus from 4th', profileName: DEMO_NAME_B }] },
  },
  infidelityRisk: {
    score: 15, rawScore: 19, level: 'low',
    indicators: [{ text: 'Venus-Jupiter conjunction strengthens fidelity', profileName: DEMO_NAME_A }],
    warning: [],
    partnerA: { score: 12, rawScore: 15, level: 'low', indicators: [{ text: 'Strong 7th lord placement reduces risk', profileName: DEMO_NAME_A }] },
    partnerB: { score: 18, rawScore: 23, level: 'low', indicators: [{ text: 'Rahu in 5th — adventurous but stabilised by Saturn', profileName: DEMO_NAME_B }] },
  },
  multipleMarriageIndicators: [],
  manglikAnalysis: {
    partnerA: { isManglik: true,  score: 2, isCancelled: true,  cancellationReasons: ['Mars in own sign'] },
    partnerB: { isManglik: false, score: 0, isCancelled: false, cancellationReasons: [] },
    compatibility: 'Cancelled. No concern.',
  },
  detectedYogas: [
    { name: 'Kalatra Yoga', severity: 'mild', description: 'Mild marital tension from 7th lord in 6th from itself in D9', profileName: DEMO_NAME_B },
  ],
  protectiveFactors: [
    { text: 'Jupiter in 7th house provides strong marital protection', strength: 'strong', profileName: DEMO_NAME_A },
    { text: 'Venus unafflicted in friendly sign', strength: 'moderate', profileName: DEMO_NAME_B },
  ],
  spouseLongevity: {
    score: 78, level: 'stable',
    indicators: [{ text: 'Jupiter-Moon conjunction supports spouse wellbeing', profileName: DEMO_NAME_A }],
    description: 'Stable longevity indicators for both partners.',
    partnerA: { score: 80, level: 'stable', indicators: [], description: 'Strong 8th house lord placement.' },
    partnerB: { score: 75, level: 'stable', indicators: [], description: 'Sun unafflicted in 8th house.' },
  },
};

// ─── Timing Analysis ──────────────────────────────────────────────────────────
export const demoTiming: TimingAnalysis = {
  favorablePeriods: [
    { startDate: new Date('2026-04-01'), endDate: new Date('2027-02-28'), description: 'Venus-Jupiter Antardasha — peak marriage window. Jupiter transiting 7th house from Moon.', confidence: 92 },
    { startDate: new Date('2028-06-01'), endDate: new Date('2029-03-31'), description: 'Sun-Venus sub-period with Jupiter aspecting natal Venus. Secondary window.', confidence: 74 },
  ],
  vulnerablePeriods: [
    { startDate: new Date('2030-01-01'), endDate: new Date('2030-09-30'), description: 'Saturn Sade Sati begins — increased pressure on relationship', riskLevel: 'moderate', profileName: DEMO_NAME_A },
  ],
  partnerA: { name: DEMO_NAME_A, currentDasha: 'Venus Mahadasha — Venus Antardasha', favourability: 'positive', analysis: 'Venus ruling the 7th house is now in its own Mahadasha. This is the strongest possible dasha for marriage activation. The sub-period of Venus-Venus (2026-2027) is the prime window.' },
  partnerB: { name: DEMO_NAME_B, currentDasha: 'Jupiter Mahadasha — Mercury Antardasha', favourability: 'positive', analysis: 'Jupiter is the 7th lord in Vikram\'s chart. Running Jupiter Mahadasha activates the marriage house directly. The coming Jupiter-Venus sub-period in 2026 is highly auspicious.' },
  timeline: {
    partnerA: [
      { date: new Date('2026-06-01'), status: 'harmonious', description: 'Venus-Venus period peaks — strongest marriage trigger' },
      { date: new Date('2027-06-01'), status: 'harmonious', description: 'Venus-Sun period with Jupiter transit support' },
      { date: new Date('2029-01-01'), status: 'caution', description: 'Venus-Rahu — requires awareness, not necessarily problematic' },
    ],
    partnerB: [
      { date: new Date('2026-04-01'), status: 'harmonious', description: 'Jupiter-Venus sub-period begins — excellent for marriage' },
      { date: new Date('2027-08-01'), status: 'harmonious', description: 'Jupiter-Sun period with transit support' },
      { date: new Date('2028-12-01'), status: 'caution', description: 'Jupiter-Saturn — responsibilities increase' },
    ],
  },
  transitNotes: [
    'Jupiter transits Ananya\'s 7th house (from Moon) April 2026 — May 2027: highest marriage probability window.',
    'Saturn transits 5th house from both Moons simultaneously in 2026 — supports commitment and seriousness.',
  ],
};

// ─── Vulnerability Timeline ───────────────────────────────────────────────────
export const demoVulnerabilityTimeline: VulnerabilityTimeline = {
  partnerAName: DEMO_NAME_A,
  partnerBName: DEMO_NAME_B,
  windows: [
    {
      startDate: new Date('2030-02-01'),
      endDate: new Date('2031-08-31'),
      partnerAAge: 33, partnerBAge: 35,
      riskType: 'divorce', riskLevel: 'moderate', partnerSource: 'partnerB',
      description: 'Saturn Sade Sati begins for Ananya while Vikram runs Rahu Antardasha. Increased pressure and communication friction.',
      astrologicalTriggers: ['Saturn entering Ananya\'s Moon sign', 'Rahu activating 7th house from Vikram\'s Moon'],
      remedy: 'Strengthen Saturn: blue sapphire consultation, Saturday fasts, visit Shani temples.',
    },
    {
      startDate: new Date('2034-06-01'),
      endDate: new Date('2035-04-30'),
      partnerAAge: 37, partnerBAge: 39,
      riskType: 'both', riskLevel: 'high', partnerSource: 'partnerA',
      description: 'Ananya\'s Rahu Mahadasha begins. Rahu over natal Venus creates restlessness and desire for change in relationships.',
      astrologicalTriggers: ['Rahu Mahadasha start', 'Rahu transiting 5th house', 'Jupiter\'s protection wanes'],
      isCrucial: true,
      remedy: 'Rahu remedies: Durga Saptashati recitation, hessonite garnet consultation, couple counselling advised.',
    },
  ],
  summaryConclusion: {
    primeDivorceRisk: { year: 2034, partnerAAge: 37, partnerBAge: 39, intensity: 'high' },
  },
};

// ─── Spouse Prediction ────────────────────────────────────────────────────────
export const demoSpousePrediction: SpousePrediction = {
  profileName: DEMO_NAME_A,
  seventhHouse: {
    sign: 'Virgo', lord: 'Mercury', planets: ['Jupiter'],
    spouseNature: 'Analytical, detail-oriented, caring and service-minded. The spouse will be intellectually stimulating with a practical approach to life.',
    spouseAppearance: 'Medium height, well-proportioned, with an alert, intelligent look. Likely to have a slim to medium build.',
    spouseTraits: ['Intelligent and analytical', 'Health-conscious', 'Helpful and service-oriented', 'Methodical in approach', 'Good communication skills'],
    element: 'Earth',
  },
  darakaraka: {
    planet: 'Venus', sign: 'Libra', house: 7,
    spouseCharacteristics: 'Venus as Darakaraka indicates a charming, artistic, and socially graceful spouse who values beauty, harmony, and partnerships. The spouse will be romantically inclined and aesthetically refined.',
  },
  navamsaSeventh: {
    sign: 'Sagittarius', planets: [],
    marriageQuality: 'The D9 7th house in Sagittarius suggests a philosophical, optimistic partner who supports personal growth and higher learning. Marriage brings wisdom and expansion.',
  },
  upapadaLagna: {
    sign: 'Taurus', planets: ['Venus'],
    timing: 'Upapada in Taurus with Venus indicates a stable, comfortable marriage with strong material security. Marriage timing aligns with Venus Mahadasha or Jupiter transit over UL.',
  },
  predictions: [
    'Spouse likely to be from a good family background with strong values',
    'Meeting probable through professional or educational connections',
    'Spouse will have interest in arts, health, or service professions',
    'Marriage will bring material stability and intellectual companionship',
    'Spouse may be slightly younger or the same age',
  ],
  physique: {
    height: 'average', build: 'slim',
    complexion: 'Fair to wheatish', eyeColor: 'Dark brown', hairType: 'Straight to wavy',
    notableFeatures: ['Well-shaped nose', 'Expressive eyes', 'Graceful walk'],
    appearance: ['Neat and well-groomed', 'Modest yet attractive'],
    gait: 'Measured and purposeful', voice: 'Clear and pleasant', fashionStyle: 'Elegant and practical',
    faceShape: 'Oval', skinTexture: 'Smooth',
  },
  profession: {
    field: 'Healthcare, Technology, or Finance',
    description: 'Mercury ruling the 7th suggests analytical professions. Jupiter\'s presence adds teaching, law, or advisory roles.',
    relatedPlanets: ['Mercury', 'Jupiter'],
    careerNature: 'Service',
  },
  meetingPrediction: {
    direction: { primary: 'North', secondary: 'East', confidence: 'medium', sources: [{ system: 'KP', direction: 'North', basis: 'Mercury in northern signs' }] },
    distance: { level: 'same_region', label: 'Same city or region', description: 'Spouse likely from the same city or a nearby city within the same state.', foreignIndicators: [], confidence: 'medium' },
    meetingMedium: { primary: 'Professional or educational setting', alternatives: ['Social gathering', 'Mutual friends', 'Online platform'], through: 'Work or study connections', modernInterpretation: 'LinkedIn, professional events, or workplace.' },
    circumstances: { setting: 'Formal or semi-formal environment', atmosphere: 'Intellectual and purposeful', examples: ['Conference or seminar', 'Workplace project', 'Alumni event'] },
    marriageType: { type: 'mixed', confidence: 'medium', yogas: [{ name: 'Kalatra Yoga', present: true, description: 'Indicates both love and family approval' }], description: 'A blend of personal choice and family involvement is indicated.' },
  },
};

// ─── Psychological Profile ────────────────────────────────────────────────────
export const demoPsychProfileA: PsychologicalProfile = {
  attachmentStyle: { type: 'secure', description: 'Comfortable with intimacy and interdependence. Forms stable, trusting bonds with partners.', moonSign: 'Cancer', fourthHouseAnalysis: 'Moon in 4th house trine Jupiter creates a secure emotional foundation and nurturing home environment.' },
  communicationStyle: { style: 'Empathetic and intuitive', mercuryPlacement: 'Mercury in Pisces — intuitive, empathetic', expressionMethod: 'Indirect, emotionally rich expression', conflictResolution: 'Avoids direct conflict; prefers emotional processing time', triggers: ['Feeling unheard', 'Emotional coldness', 'Criticism of loved ones'] },
  loveLanguage: { primary: 'Quality Time', secondary: 'Acts of Service', venusSign: 'Taurus', description: 'Venus in Taurus indicates a deep need for consistent, physical presence and practical demonstrations of care. Grand gestures matter less than daily reliability.' },
  coreFears: { primaryFear: 'Abandonment and emotional rejection', rahuInfluence: 'Rahu in 11th amplifies social anxiety and fear of exclusion', howItManifests: 'Overly accommodating behavior; difficulty asserting personal needs in relationships.' },
  defenseMechanisms: { mechanism: 'Emotional withdrawal and people-pleasing', ketuInfluence: 'Ketu in 5th creates detachment from self-expression', impactOnRelationships: 'May suppress true feelings to maintain harmony, leading to emotional distance over time.' },
  repeatingPatterns: { pattern: 'Attracting emotionally unavailable partners', fifthHouseInfluence: 'Ketu in 5th creates karmic pull toward unavailable connections', venusCycles: 'Venus in Taurus seeks security but Saturn aspect creates delays in relationship satisfaction', howToBreakIt: 'Consciously choose partners who demonstrate consistency early. Journal emotional patterns.' },
  mentalLandscape: { coreFear: 'Not being enough for the partner', defenseMechanism: 'Over-giving to prevent rejection', blindSpot: 'Difficulty recognizing own emotional needs', growthArea: 'Learning to receive care and assert personal boundaries' },
};

// ─── Conflict Zone ────────────────────────────────────────────────────────────
export const demoConflictZone: ConflictZone = {
  people: [
    { title: 'In-law Boundary Tensions', intensity: 'Medium', description: 'Vikram\'s family attachment may clash with Ananya\'s need for an independent household. Moon in 4th for Ananya creates strong home-space boundaries.', technicalBasis: '4th lord aspects 7th in both charts from different perspectives.', source: 'mutual' },
  ],
  things: [
    { title: 'Financial Planning Styles', intensity: 'Low', description: 'Ananya\'s Venus in Taurus prefers security and saving; Vikram\'s Jupiter-Rahu in the 2nd can lead to expansive spending.', technicalBasis: '2nd house lords in different mode signs.', source: 'partnerB' },
  ],
  ideology: [
    { title: 'Spiritual vs Practical Worldview', intensity: 'Low', description: 'Ananya gravitates toward intuitive and spiritual frameworks; Vikram is more pragmatic and evidence-based.', technicalBasis: 'Pisces vs Virgo axis in 7th house emphasis.', source: 'mutual' },
  ],
  behavior: [
    { title: 'Communication Pace', intensity: 'High', description: 'Ananya processes emotions internally before communicating; Vikram prefers immediate verbal resolution. This mismatch can escalate disagreements.', technicalBasis: 'Mercury in Pisces (Ananya) vs Mercury in Gemini (Vikram) — opposing processing styles.', source: 'mutual' },
  ],
  overallSeverity: 'Low',
  awarenessNote: 'Most conflict areas in this match are manageable with awareness. The single High-intensity zone (communication pace) is the primary area to address through structured communication agreements.',
};
