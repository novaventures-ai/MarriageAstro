import nakshatraCompatData from '@knowledge/nakshatra_compatibility.json';
import yoniCompatData from '@knowledge/yoni_sexual_compatibility.json';
import yoniMatrixData from '@knowledge/yoni_matrix.json';
import ganaRulesData from '@knowledge/gana_rules.json';
import sexualHealthData from '@knowledge/sexual_health_rules.json';

// ============ Yoni Name Resolution ============
// All 14 JSON keys: Ashwa, Gaja, Mriga, Vanar, Sarpa, Simha, Mahisha, Vyaghra, Mushaka, Nakula, Shwaan, Marjara, Aja, Ustra, Gow
const VALID_YONI_KEYS = new Set(['Ashwa', 'Gaja', 'Mriga', 'Vanar', 'Sarpa', 'Simha', 'Mahisha', 'Vyaghra', 'Mushaka', 'Nakula', 'Shwaan', 'Marjara', 'Aja', 'Ustra', 'Gow']);

const YONI_NAME_MAP: Record<string, string> = {
    // English animal names → JSON key
    'Horse': 'Ashwa',
    'Elephant': 'Gaja',
    'Deer': 'Mriga', 'Hare': 'Mriga',
    'Monkey': 'Vanar',
    'Snake': 'Sarpa', 'Serpent': 'Sarpa', 'Serpent/Snake': 'Sarpa',
    'Lion': 'Simha', 'Lioness': 'Simha',
    'Buffalo': 'Mahisha',
    'Tiger': 'Vyaghra',
    'Rat': 'Mushaka', 'Mouse': 'Mushaka',
    'Mongoose': 'Nakula',
    'Dog': 'Shwaan',
    'Cat': 'Marjara',
    'Sheep': 'Aja', 'Goat': 'Aja', 'Sheep/Goat': 'Aja', 'Ram': 'Aja',
    'Camel': 'Ustra',
    'Cow': 'Gow', 'Bull': 'Gow',
};

export const resolveYoniKey = (yoniName: string): string => {
    // If already a valid JSON key, return directly
    if (VALID_YONI_KEYS.has(yoniName)) return yoniName;

    // Try extracting from "Key (AnimalName)" format
    const parenMatch = yoniName.match(/^(\w+)\s*\(([^)]+)\)/);
    if (parenMatch) {
        const prefix = parenMatch[1]; // e.g. "Sarpa"
        const animal = parenMatch[2]; // e.g. "Serpent"
        // Try prefix first (it's likely the JSON key)
        if (VALID_YONI_KEYS.has(prefix)) return prefix;
        // Try the animal name in map
        if (YONI_NAME_MAP[animal]) return YONI_NAME_MAP[animal];
    }

    // Fallback: try the whole string or just the name in map
    return YONI_NAME_MAP[yoniName] || yoniName;
};

// ============ Per-Yoni Detailed Descriptions ============
const YONI_PROFILES: Record<string, { driveLevel: string; staminaLevel: string; sessionLevel: string; drive: string; stamina: string; session: string; element: string }> = {
    'Ashwa': {
        driveLevel: 'Very High', staminaLevel: 'Exceptional', sessionLevel: 'Extended',
        drive: 'Very strong sexual drive with high libido. Hard to satisfy — initiates with caress, touches and kisses. Dominant and expects long intimate play.',
        stamina: 'Exceptional endurance capable of sustained, longer sexual sessions without fatigue.',
        session: 'Prefers extended sessions with elaborate foreplay. Initiates with sensual buildup before intense engagement.',
        element: '💨 Air — Light, stimulating and mentally engaged. Brings variety, communication and playful experimentation to intimacy.'
    },
    'Gaja': {
        driveLevel: 'Conservative', staminaLevel: 'High (Slow Start)', sessionLevel: 'Slow-Building',
        drive: 'Conservative nature — considers intimacy as a moral act of pure love or procreation. Takes long to get aroused but deeply satisfying once there.',
        stamina: 'High sustained endurance once aroused. Can give pleasure for extended periods after initial warm-up.',
        session: 'Slow-building sessions requiring healthy foreplay before penetration. Needs time and emotional connection to reach full engagement.',
        element: '🌍💨 Earth & Air — Grounded sensuality blended with mental openness. Values both physical comfort and intellectual connection.'
    },
    'Mriga': {
        driveLevel: 'Adaptive', staminaLevel: 'Flexible', sessionLevel: 'Partner-Led',
        drive: 'Most accommodating sexual nature — faithful and giving. Neither obsesses about nor complains about intimate performance.',
        stamina: 'Adaptive stamina that adjusts to partner\'s needs. Ready at all seasons, mornings and evenings alike.',
        session: 'Flexible session style — can be brief or extended based on partner\'s desires. Makes married life blissful and joyful.',
        element: '✨ Spirit — Transcendent and deeply soulful. Intimacy becomes a sacred act of union beyond the physical.'
    },
    'Vanar': {
        driveLevel: 'Demanding', staminaLevel: 'High (Conditional)', sessionLevel: 'Attention-Heavy',
        drive: 'Dominant and demanding — needs lots of attention, hugging, cuddling, pampering and pleading. Rewards with ecstatic experiences when satisfied.',
        stamina: 'High energy bursts requiring gifts, favours and praises to sustain. Performance peaks with adequate pampering.',
        session: 'Attention-intensive sessions that demand foreplay, affection and verbal appreciation throughout. Very rewarding when needs are met.',
        element: '🔥✨ Fire & Spirit — A rare fusion of physical intensity and transcendent connection. Deeply transformative experiences.'
    },
    'Sarpa': {
        driveLevel: 'Reserved (Deep)', staminaLevel: '1-3 Hours', sessionLevel: 'Slow-to-Intense',
        drive: 'Reserved, modest and shy — does not try to attract attention. Faithful partner requiring foreplay, hugging, cuddling and close contact.',
        stamina: 'Remarkable once aroused — duration ranges from 1 hour to 2-3 hours. Prefers specific positions for easy climax.',
        session: 'Builds slowly through closeness and body contact. Once fully aroused, reveals surprising depth and extended duration.',
        element: '🔥💨 Fire & Air — Dynamic combination of passionate intensity and communicative agility. Both physically fiery and mentally stimulating.'
    },
    'Simha': {
        driveLevel: 'Powerful', staminaLevel: 'Strong', sessionLevel: 'Commanding',
        drive: 'Powerful, energetic and majestic — strong and assertive in expressing intimate needs. Commanding presence in the bedroom.',
        stamina: 'Strong sexual energy with sustained power. Majestic endurance that maintains intensity throughout.',
        session: 'Commanding, intense sessions led with confidence. Assertive in pace-setting and expects matching energy from partner.',
        element: '🔥 Fire — Pure passion, intensity and transformation. Powerful surges of desire that are explosive and all-consuming.'
    },
    'Mahisha': {
        driveLevel: 'Slow & Deep', staminaLevel: 'Very High', sessionLevel: 'Gradual Build',
        drive: 'Slow, steady and deeply sensual — takes time to build momentum but achieves remarkable depth. Heavy, grounded sexual energy.',
        stamina: 'Very high endurance once momentum builds. Solid and reliable — can sustain intimacy for extended periods.',
        session: 'Gradually intensifying sessions. Starts slow and steady, building to powerful, deeply satisfying climaxes.',
        element: '🌍 Earth — Grounded, physical and tactile. Steady, reliable presence that values touch, comfort and sustained connection.'
    },
    'Vyaghra': {
        driveLevel: 'Fierce', staminaLevel: 'Burst-Intensity', sessionLevel: 'Explosive Waves',
        drive: 'Fierce, intense and highly energetic — passionate but potentially erratic. Sharp, focused energy with unpredictable surges.',
        stamina: 'High-intensity bursts with sharp, focused energy. Explosive peaks followed by recovery before the next surge.',
        session: 'Variable and exciting — alternates between explosive intensity and recovery. Requires variety and constant stimulation.',
        element: '🔥 Fire — Raw, transformative passion. High-energy encounters that are spontaneous, creative and all-consuming.'
    },
    'Mushaka': {
        driveLevel: 'Playful', staminaLevel: 'Quick-Burst', sessionLevel: 'Short & Frequent',
        drive: 'Quick, playful and highly curious — light and active sexual energy focused on novelty and experimentation.',
        stamina: 'Quick arousal and release followed by rapid recovery. Suited for short but frequent intimate encounters.',
        session: 'Short, playful sessions with high frequency. Prefers variety and experimentation over marathon encounters.',
        element: '🌍 Earth — Physical and practical. Combines earthy sensuality with curious experimentation and playful energy.'
    },
    'Nakula': {
        driveLevel: 'Very Active', staminaLevel: 'High-Reactive', sessionLevel: 'Fast-Paced',
        drive: 'Extremely active, responsive and agile — Fast-paced sexual rhythm with very high energy levels. Attentive to every stimulus.',
        stamina: 'Lightning-fast reflexes with sustained high energy. Exceptional responsiveness that maintains intensity throughout.',
        session: 'Fast-paced, highly reactive sessions where every touch produces amplified response. Intense and deeply stimulating.',
        element: '🌍 Earth — Grounded yet electric. Combines physical presence with exceptional sensitivity and responsiveness.'
    },
    'Shwaan': {
        driveLevel: 'Enthusiastic', staminaLevel: 'High-Warm', sessionLevel: 'Eager & Loyal',
        drive: 'Enthusiastic, loyal and deeply friendly — always ready and willing with genuine emotional warmth behind every touch.',
        stamina: 'High energy and responsiveness. Playful endurance with a warm, eager quality that sustains throughout.',
        session: 'Warm, enthusiastic sessions with deep loyalty. Highly responsive to partner\'s cues with playful, energetic engagement.',
        element: '🔥 Fire — Passionate warmth and eager energy. Combines physical enthusiasm with genuine emotional connection.'
    },
    'Marjara': {
        driveLevel: 'Graceful', staminaLevel: 'Rhythmic', sessionLevel: 'Trust-Building',
        drive: 'Independent, graceful and sensual — needs rhythm, comfort and trust. Takes time to fully open but reveals elegant intimacy.',
        stamina: 'Rhythmic, sustained energy. Maintains a steady, graceful flow without rushing. Measured pacing.',
        session: 'Clean, aesthetic sessions with rhythmic flow. Builds trust gradually before revealing full depth of sensuality.',
        element: '💧 Water — Emotional depth, fluidity and nurturing. Creates emotionally rich, intuitive intimate connection.'
    },
    'Aja': {
        driveLevel: 'Steady', staminaLevel: 'Persistent', sessionLevel: 'Straightforward',
        drive: 'Simple, persistent and earthy — honest intimacy without pretense. Steady energy with genuine, grounded connection.',
        stamina: 'Persistent endurance with consistent energy. No dramatic peaks or valleys — reliable and sustained performance.',
        session: 'Straightforward, honest sessions with steady rhythm. No complexity — just genuine physical connection with earthy depth.',
        element: '🌍 Earth — Deeply grounded and tactile. Values simple physical connection, comfort and sustained, steady presence.'
    },
    'Ustra': {
        driveLevel: 'Enduring', staminaLevel: 'Marathon', sessionLevel: 'Very Extended',
        drive: 'High endurance with resilient energy — steady and capable of extending intimacy well beyond typical duration.',
        stamina: 'Incredible stamina — a marathon partner. Capable of long periods of uninterrupted intimacy without fatigue.',
        session: 'Very extended sessions with unchanging, steady rhythm. Resilient and adaptive — sustains any pace the partner sets.',
        element: '💨 Air — Mentally stimulating with variety. Brings lightness and adaptability to sustained intimate encounters.'
    },
    'Gow': {
        driveLevel: 'Gentle', staminaLevel: 'Patient', sessionLevel: 'Nurturing',
        drive: 'Nurturing, gentle and extremely patient — the most soft and loving intimate energy. Every touch is cherished.',
        stamina: 'Patient, sustained gentleness. Can maintain soft, loving intimacy for extended periods without urgency.',
        session: 'Deeply gentle, slow sessions focused on emotional warmth. Creates a safe, nurturing space where vulnerability is welcomed.',
        element: '🌍 Earth — Grounded, nurturing presence. Deeply physical but with overwhelming gentleness and protective warmth.'
    }
};

export interface FullYoniData {
    name: string;
    gender: string;
    element: string;
    description: string;
    driveLevel: string;
    staminaLevel: string;
    sessionLevel: string;
    driveDesc: string;
    staminaDesc: string;
    sessionDesc: string;
    elementDesc: string;
    characteristics: string[];
    compatibilityNotes: string;
    bestMatches: string[];
    worstMatches: string[];
    anatomy: Record<string, string | undefined>;
}

export const getFullYoniData = (yoniName: string): FullYoniData | null => {
    const key = resolveYoniKey(yoniName);
    const yoniInfo = (yoniCompatData as any).yoni_system.yonis[key];
    if (!yoniInfo) return null;

    const profile = YONI_PROFILES[key] || { driveLevel: 'Moderate', staminaLevel: 'Moderate', sessionLevel: 'Balanced', drive: yoniInfo.sexual_nature?.description || '', stamina: 'Standard endurance.', session: 'Balanced approach.', element: yoniInfo.element || 'Earth' };

    return {
        name: yoniInfo.name,
        gender: yoniInfo.gender,
        element: yoniInfo.element || 'Earth',
        description: yoniInfo.sexual_nature?.description || '',
        driveLevel: profile.driveLevel,
        staminaLevel: profile.staminaLevel,
        sessionLevel: profile.sessionLevel,
        driveDesc: profile.drive,
        staminaDesc: profile.stamina,
        sessionDesc: profile.session,
        elementDesc: profile.element,
        characteristics: yoniInfo.sexual_nature?.characteristics || [],
        compatibilityNotes: yoniInfo.compatibility_notes || '',
        bestMatches: yoniInfo.best_matches || [],
        worstMatches: yoniInfo.worst_matches || [],
        anatomy: {
            opening: yoniInfo.sexual_nature?.yoni_features?.opening,
            passage: yoniInfo.sexual_nature?.yoni_features?.passage,
            base: yoniInfo.sexual_nature?.yoni_features?.base,
            foreskin: yoniInfo.sexual_nature?.lingam_features?.foreskin,
            girth: yoniInfo.sexual_nature?.lingam_features?.girth,
            glans: yoniInfo.sexual_nature?.lingam_features?.glans,
        }
    };
};

// ============ Nakshatra Helpers ============
export const getNakshatraDetails = (nakshatra: string) => {
    return (nakshatraCompatData as any).nakshatra_compatibility[nakshatra] || null;
};

export const getNakshatraCompat = (nakshatraA: string, nakshatraB: string) => {
    const details = getNakshatraDetails(nakshatraA);
    return details?.compatibility?.[nakshatraB] || null;
};

// Dynamic top/bottom 3
export const getTopMatches = (nakshatra: string, count = 3) => {
    const details = getNakshatraDetails(nakshatra);
    if (!details?.compatibility) return [];
    return Object.entries(details.compatibility)
        .map(([k, v]: [string, any]) => ({ name: k, score: v.score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, count);
};

export const getBottomMatches = (nakshatra: string, count = 3) => {
    const details = getNakshatraDetails(nakshatra);
    if (!details?.compatibility) return [];
    return Object.entries(details.compatibility)
        .map(([k, v]: [string, any]) => ({ name: k, score: v.score }))
        .sort((a, b) => a.score - b.score)
        .slice(0, count);
};

// ============ Gana Analysis ============
export const getGanaInfo = (ganaA: string, ganaB: string) => {
    const ganaTypes = (ganaRulesData as any).gana_types;
    const rules = (ganaRulesData as any).matching_rules;
    const key = `${ganaA}-${ganaB}`;
    const match = rules[key] || { points: 3, compatibility: 'Fair' };
    return {
        ganaANature: ganaTypes[ganaA]?.nature || ganaA,
        ganaBNature: ganaTypes[ganaB]?.nature || ganaB,
        points: match.points,
        maxPoints: 6,
        compatibility: match.compatibility,
        hasDosha: match.dosha || false,
    };
};

// ============ Yoni Matrix Score ============
export const getYoniMatrixScore = (nakshatraA: string, nakshatraB: string) => {
    const mapping = (yoniMatrixData as any).nakshatra_to_yoni;
    const matrix = (yoniMatrixData as any).compatibility_matrix;
    const interp = (yoniMatrixData as any).scoring_interpretation;
    const animalA = mapping[nakshatraA];
    const animalB = mapping[nakshatraB];
    if (!animalA || !animalB) return null;
    const score = matrix[animalA]?.[animalB] ?? 2;
    return { animalA, animalB, score, maxScore: 4, interpretation: interp[String(score)] || 'Unknown' };
};

// ============ Element Compatibility ============
export const getElementCompat = (elementA: string, elementB: string) => {
    const elDescs = (sexualHealthData as any).mutual_satisfaction?.element_descriptions;
    if (!elDescs) return null;
    const baseA = elementA.split(' ')[0]; // "Fire & Air" -> "Fire"
    const baseB = elementB.split(' ')[0];
    const key1 = `${baseA}_${baseB}`;
    const key2 = `${baseB}_${baseA}`;
    return elDescs[key1] || elDescs[key2] || elDescs['Default'] || null;
};

// ============ Planetary Friendship ============
const PLANET_FRIENDS: Record<string, string[]> = {
    'Sun': ['Moon', 'Mars', 'Jupiter'],
    'Moon': ['Sun', 'Mercury'],
    'Mars': ['Sun', 'Moon', 'Jupiter'],
    'Mercury': ['Sun', 'Venus'],
    'Jupiter': ['Sun', 'Moon', 'Mars'],
    'Venus': ['Mercury', 'Saturn'],
    'Saturn': ['Mercury', 'Venus'],
    'Ketu': ['Mars', 'Jupiter'],
    'Rahu': ['Mercury', 'Venus', 'Saturn'],
};

const PLANET_ENEMIES: Record<string, string[]> = {
    'Sun': ['Venus', 'Saturn'],
    'Moon': ['Rahu', 'Ketu'],
    'Mars': ['Mercury'],
    'Mercury': ['Moon'],
    'Jupiter': ['Mercury', 'Venus'],
    'Venus': ['Sun', 'Moon'],
    'Saturn': ['Sun', 'Moon', 'Mars'],
    'Ketu': ['Rahu'],
    'Rahu': ['Sun', 'Moon', 'Ketu'],
};

export const getPlanetRelationship = (lordA: string, lordB: string): { relation: string; description: string } => {
    if (lordA === lordB) return { relation: 'Same', description: `Both ruled by ${lordA} — deep natural understanding and shared planetary vibration.` };
    const aFriendsB = PLANET_FRIENDS[lordA]?.includes(lordB);
    const bFriendsA = PLANET_FRIENDS[lordB]?.includes(lordA);
    const aEnemyB = PLANET_ENEMIES[lordA]?.includes(lordB);
    const bEnemyA = PLANET_ENEMIES[lordB]?.includes(lordA);

    if (aFriendsB && bFriendsA) return { relation: 'Mutual Friends', description: `${lordA} and ${lordB} are mutual friends — creates natural harmony and support between nakshatras.` };
    if (aFriendsB || bFriendsA) return { relation: 'One-sided Friendship', description: `${aFriendsB ? lordA : lordB} considers ${aFriendsB ? lordB : lordA} a friend, but not vice-versa. Partial harmony.` };
    if (aEnemyB && bEnemyA) return { relation: 'Mutual Enemies', description: `${lordA} and ${lordB} are mutual enemies — creates tension requiring conscious effort to harmonize.` };
    if (aEnemyB || bEnemyA) return { relation: 'One-sided Enmity', description: `${aEnemyB ? lordA : lordB} considers ${aEnemyB ? lordB : lordA} an enemy. Some friction present.` };
    return { relation: 'Neutral', description: `${lordA} and ${lordB} are neutral — neither supporting nor opposing. A blank canvas for the relationship.` };
};

// ============ Deity Descriptions ============
const DEITY_BLESSINGS: Record<string, string> = {
    'Ashwini Kumaras': 'Healing, speed, and rejuvenation — brings vitality and quick recovery to the relationship.',
    'Yama': 'Discipline, transformation, and deep intensity — brings powerful transformative energy.',
    'Agni': 'Sacred fire, purification, and warmth — ignites passion and burns away obstacles.',
    'Brahma': 'Creation, abundance, and artistic beauty — brings creative and sensual energy.',
    'Soma': 'Moon nectar, nourishment, and intoxicating pleasure — deepens emotional and sensual bonds.',
    'Rudra': 'Storm, destruction and renewal — brings intense transformation and emotional depth.',
    'Aditi': 'Infinite expansion and nurturing — brings boundless support and freedom.',
    'Brihaspati': 'Wisdom, guidance, and spiritual expansion — elevates the relationship beyond the physical.',
    'Nagas': 'Serpentine wisdom, kundalini energy — brings mystical, transformative intimate power.',
    'Pitris': 'Ancestral blessings and continuity — connects the relationship to lineage and dharma.',
    'Bhaga': 'Fortune, pleasure, and marital bliss — directly blesses intimate happiness.',
    'Aryaman': 'Friendship, honor, and noble connection — builds relationships on mutual respect.',
    'Savitar': 'Divine light and illumination — brings clarity and spiritual energy to union.',
    'Tvashtar/Vishvakarma': 'Divine architect, beauty and form — creates perfectly crafted intimate harmony.',
    'Vayu': 'Wind, freedom, and flexibility — brings adaptability and lightness to connection.',
    'Indra-Agni': 'Power combined with sacred fire — fierce protective passion and commanding intimacy.',
    'Indra': 'King of gods, power and abundance — brings commanding presence and generous passion.',
    'Mitra': 'Friendship and divine contracts — builds lasting bonds based on sacred trust.',
    'Nirrti': 'Transformation through dissolution — breaks old patterns to create deeper connection.',
    'Apas': 'Cosmic waters, purification — creates flowing, emotionally cleansing intimacy.',
    'Vishvadevas': 'All gods combined — brings comprehensive, well-rounded relationship blessings.',
    'Vishnu': 'Preservation, devotion, and sustenance — maintains and nurtures the bond over time.',
    'Vasus': 'Elemental abundance — brings material comfort and physical well-being to relationship.',
    'Varuna': 'Cosmic order and deep waters — brings profound, oceanic depth to connection.',
    'Aja Ekapada': 'Unborn one-footed — brings spiritual transcendence and mystical connection.',
    'Ahir Budhnya': 'Serpent of the deep — brings kundalini depth and hidden transformative power.',
    'Pushan': 'Nourishment, journeys, and safe passage — brings gentle guidance and spiritual growth.',
};

export const getDeityBlessing = (deity: string): string => {
    return DEITY_BLESSINGS[deity] || `${deity} brings unique divine energy and blessings to the relationship.`;
};
