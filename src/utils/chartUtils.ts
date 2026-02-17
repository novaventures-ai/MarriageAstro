
export const ZODIAC_SYMBOLS: Record<string, string> = {
    "Aries": "♈", "Taurus": "♉", "Gemini": "♊", "Cancer": "♋",
    "Leo": "♌", "Virgo": "♍", "Libra": "♎", "Scorpio": "♏",
    "Sagittarius": "♐", "Capricorn": "♑", "Aquarius": "♒", "Pisces": "♓"
};

export const ZODIAC_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export const PLANET_ABBREVIATIONS: Record<string, string> = {
    "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
    "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa", "Rahu": "Ra", "Ketu": "Ke"
};

export const PLANET_COLORS: Record<string, string> = {
    Sun: "text-amber-500",
    Moon: "text-slate-400",
    Mars: "text-red-500",
    Mercury: "text-emerald-500",
    Jupiter: "text-yellow-500",
    Venus: "text-pink-400",
    Saturn: "text-indigo-500",
    Rahu: "text-slate-600",
    Ketu: "text-orange-500"
};


export const formatDMS = (deg: number, min: number, sec?: number) => {
    return `${deg}\u00B0 ${min.toString().padStart(2, '0')}' ${(sec || 0).toString().padStart(2, '0')}"`;
};

export const getDMS = (decimalList: number) => {
    const deg = Math.floor(decimalList);
    const minDec = (decimalList - deg) * 60;
    const min = Math.floor(minDec);
    const sec = Math.round((minDec - min) * 60);
    return { deg, min, sec };
};


// South Indian chart layout (fixed signs)
export const SOUTH_INDIAN_LAYOUT = [
    [11, 0, 1, 2],   // Pisces, Aries, Taurus, Gemini
    [10, -1, -1, 3], // Aquarius, (center), (center), Cancer
    [9, -1, -1, 4],  // Capricorn, (center), (center), Leo
    [8, 7, 6, 5]     // Sagittarius, Scorpio, Libra, Virgo
];

// North Indian chart layout (fixed houses)
export const NORTH_INDIAN_HOUSES = [
    { row: 0, col: 1, house: 12 },
    { row: 0, col: 2, house: 1 },
    { row: 0, col: 3, house: 2 },
    { row: 1, col: 3, house: 3 },
    { row: 2, col: 3, house: 4 },
    { row: 3, col: 3, house: 5 },
    { row: 3, col: 2, house: 6 },
    { row: 3, col: 1, house: 7 },
    { row: 3, col: 0, house: 8 },
    { row: 2, col: 0, house: 9 },
    { row: 1, col: 0, house: 10 },
    { row: 0, col: 0, house: 11 },
];
