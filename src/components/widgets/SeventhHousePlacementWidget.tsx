import React from 'react';
import { Chart, Planet, Sign, House, PlanetaryPosition } from '../../types';
import { getSeventhLordPlacementInterpretation } from '../../../lib/spouseCalculations';
import { ArrowRight, HeartHandshake, Skull, Crown, Sparkles, Scale, Info } from 'lucide-react';

interface SeventhHousePlacementWidgetProps {
    chart: Chart;
}

const SeventhHousePlacementWidget: React.FC<SeventhHousePlacementWidgetProps> = ({ chart }) => {
    const d1SeventhHouse = chart.houses.find((h: House) => h.houseNumber === 7);
    const d1SeventhLord = d1SeventhHouse?.lord;
    const d1SeventhLordPos = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === d1SeventhLord);
    const d1Planets = d1SeventhHouse?.planets || [];

    const d9Chart = chart.vargaCharts?.D9;
    const d9SeventhHouse = d9Chart?.houses.find((h: any) => h.houseNumber === 7);
    const d9SeventhLord = d9SeventhHouse?.lord;
    const d9SeventhLordPos = d9Chart?.planetaryPositions.find((p: any) => p.planet === d9SeventhLord);
    const d9Planets = d9SeventhHouse?.planets || [];

    const getPlacementQuality = (planetPos: any) => {
        if (!planetPos) return 'neutral';
        if (['exalted', 'own_house', 'moolatrikona'].includes(planetPos.dignity)) return 'strong';
        if (['debilitated', 'enemy'].includes(planetPos.dignity)) return 'weak';
        return 'neutral';
    };

    const d1Quality = getPlacementQuality(d1SeventhLordPos);
    const d9Quality = getPlacementQuality(d9SeventhLordPos);

    const getDetailedInterpretation = () => {
        if (!d9Chart) return "Navamsa chart not available for deep comparison.";

        const d1Sign = d1SeventhHouse?.sign || 'Unknown';
        const d9Sign = d9SeventhHouse?.sign || 'Unknown';

        let intro = `Your journey begins with ** ${d1Sign}** dynamics in the Rashi chart, suggesting a relationship style that values `;

        // D1 Sign Nuance
        const signTraits: Record<string, string> = {
            'Aries': "independence, passion, and directness",
            'Taurus': "stability, sensual comforts, and loyalty",
            'Gemini': "communication, intellectual stimulation, and variety",
            'Cancer': "emotional security, nurturing, and home life",
            'Leo': "attention, generosity, and shared creativity",
            'Virgo': "practical support, detail-orientation, and service",
            'Libra': "harmony, balance, and aesthetic connection",
            'Scorpio': "intensity, deep emotional transformation, and privacy",
            'Sagittarius': "adventure, shared philosophy, and growth",
            'Capricorn': "structure, ambition, and long-term goals",
            'Aquarius': "friendship, intellectual equality, and innovation",
            'Pisces': "spiritual connection, empathy, and dreams"
        };
        intro += `${signTraits[d1Sign] || "connection"}.`;

        let transition = "";
        if (d1Sign === d9Sign) {
            transition = `Remarkably, your Navamsa also holds ** ${d9Sign}**, indicating a Vargottama placement.This means your inner needs perfectly align with your outer experiences—what you see is what you get, and this consistency brings immense strength and stability to your union.`;
        } else {
            transition = `However, internally(in Navamsa), your soul craves ** ${signTraits[d9Sign] || d9Sign}** (${d9Sign}). This shift suggests that while you may attract ${signTraits[d1Sign]}, true long - term fulfillment comes from ${signTraits[d9Sign].split(',')[0]}.`;
        }

        let lordAnalysis = "";
        // Simple Lord Movement Logic
        if (d1SeventhLord && d9SeventhLord) {
            if (getPlacementQuality(d9SeventhLordPos) === 'strong') {
                lordAnalysis = `With your 7th Lord(${d9SeventhLord}) placed strongly in the Navamsa, your capacity to sustain a happy marriage grows stronger with time, even if challenges arise initially.`;
            } else if (getPlacementQuality(d9SeventhLordPos) === 'weak') {
                lordAnalysis = `Your 7th Lord's position in Navamsa suggests that while the relationship has potential, it will require conscious effort to maintain harmony and navigate deeper emotional currents.`;
            } else {
                lordAnalysis = `The 7th Lord's placement indicates a balanced marital karma, where mutual effort will directly equate to the happiness received.`;
            }
        }

        return `${intro} ${transition} ${lordAnalysis}`;
    };

    const getPlanetBadges = (planets: Planet[]) => {
        if (planets.length === 0) return <span className="text-gray-400 italic">None</span>;
        return (
            <div className="flex flex-wrap gap-2">
                {planets.map(p => (
                    <span key={p} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full border border-purple-200 dark:border-purple-800">
                        {p}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <Scale className="w-48 h-48" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <HeartHandshake className="w-6 h-6" />
                        7th House Deep Dive: D1 vs D9
                    </h2>
                    <p className="text-violet-100 text-sm mt-1 max-w-xl">
                        Comparing the physical manifestation of marriage (Rashi D1) with its inner soul potential (Navamsa D9).
                    </p>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                {/* Connector Line for Desktop */}
                <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
                    <ArrowRight className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                </div>

                {/* D1 Section */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <span className="font-bold text-lg">D1</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Rashi Chart (Root)</h3>
                            <p className="text-xs text-gray-500">Physical & Social Reality</p>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-gray-500">7th House Sign</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{d1SeventhHouse?.sign}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-gray-500">7th Lord</span>
                            <div className="text-right">
                                <span className="font-medium text-gray-800 dark:text-gray-200 block">{d1SeventhLord}</span>
                                <span className="text-xs text-gray-500 block">in {d1SeventhLordPos?.house}th House</span>
                            </div>
                        </div>
                        {/* D1 Impact Badge */}
                        <div className="flex justify-between items-center py-1">
                            <span className="text-gray-500 text-xs">Placement Impact</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getPlacementQuality(d1SeventhLordPos) === 'strong' ? 'bg-green-100 text-green-700' :
                                getPlacementQuality(d1SeventhLordPos) === 'weak' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                {getPlacementQuality(d1SeventhLordPos).toUpperCase()}
                            </span>
                        </div>

                        <div className="py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-gray-500 block mb-2">Planets in 7th</span>
                            {getPlanetBadges(d1Planets as Planet[])}
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-2">
                            {/* Use explicit interpretation if available, else fallback */}
                            <p className="text-blue-800 dark:text-blue-200 text-xs italic">
                                {d1SeventhLordPos && getSeventhLordPlacementInterpretation &&
                                    getSeventhLordPlacementInterpretation(d1SeventhLord as Planet, d1SeventhLordPos.house).description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* D9 Section */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
                            <span className="font-bold text-lg">D9</span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Navamsa Chart (Fruit)</h3>
                            <p className="text-xs text-gray-500">Inner Quality & Long Term</p>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-gray-500">7th House Sign</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{d9SeventhHouse?.sign || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-gray-500">7th Lord</span>
                            <div className="text-right">
                                <span className="font-medium text-gray-800 dark:text-gray-200 block">{d9SeventhLord || 'Unknown'}</span>
                                {d9SeventhLordPos && <span className="text-xs text-gray-500 block">in {d9SeventhLordPos.house}th House</span>}
                            </div>
                        </div>

                        {/* D9 Impact Badge */}
                        <div className="flex justify-between items-center py-1">
                            <span className="text-gray-500 text-xs">Placement Impact</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getPlacementQuality(d9SeventhLordPos) === 'strong' ? 'bg-green-100 text-green-700' :
                                getPlacementQuality(d9SeventhLordPos) === 'weak' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                {getPlacementQuality(d9SeventhLordPos).toUpperCase()}
                            </span>
                        </div>

                        <div className="py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-gray-500 block mb-2">Planets in 7th</span>
                            {getPlanetBadges(d9Planets as Planet[])}
                        </div>
                        <div className="bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg mt-2">
                            <p className="text-pink-800 dark:text-pink-200 text-xs italic">
                                {d9SeventhLord && d9SeventhLordPos && getSeventhLordPlacementInterpretation ?
                                    getSeventhLordPlacementInterpretation(d9SeventhLord as Planet, d9SeventhLordPos.house).description :
                                    "Navamsa data limited."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Synthesis Section */}
            <div className="bg-gray-50 dark:bg-gray-900/30 p-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm text-violet-600 dark:text-violet-400 hidden sm:block">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">The Astrological Verdict</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            {getDetailedInterpretation()}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                            <Info className="w-4 h-4" />
                            <span>D1 = Physical Body (Tree) | D9 = Inner Strength (Fruit)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeventhHousePlacementWidget;
