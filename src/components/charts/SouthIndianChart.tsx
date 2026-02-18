import { Star } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import {
    SOUTH_INDIAN_LAYOUT,
    ZODIAC_SIGNS,
    ZODIAC_SYMBOLS,
    PLANET_COLORS,
    PLANET_ABBREVIATIONS,
    getDMS
} from '../../utils/chartUtils';
import { PlanetaryPosition } from '@types';

interface SouthIndianChartProps {
    planets: PlanetaryPosition[];
    ascendantSignIndex: number;
    chartLabel: string;
}

export function SouthIndianChart({
    planets,
    ascendantSignIndex,
    chartLabel
}: SouthIndianChartProps) {
    const getPlanetsInSign = (signIndex: number) => {
        return planets.filter(p => {
            if (typeof (p as any).signIndex === 'number') return (p as any).signIndex === signIndex;
            return ZODIAC_SIGNS.indexOf(p.sign) === signIndex;
        });
    };

    const isAscendantSign = (signIndex: number) => signIndex === ascendantSignIndex;

    return (
        <div className="w-full max-w-full overflow-hidden">
            <div className="aspect-square w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] mx-auto">
                <div className="grid grid-cols-4 gap-[1px] sm:gap-0.5 h-full bg-orange-200 dark:bg-orange-800/30 rounded-lg overflow-hidden border border-orange-300 dark:border-orange-700/50 transition-colors">
                    {SOUTH_INDIAN_LAYOUT.flat().map((signIndex, i) => {
                        if (signIndex === -1) {
                            return (
                                <div key={i} className="bg-white dark:bg-gray-800 flex items-center justify-center transition-colors">
                                    {i === 5 && (
                                        <div className="text-center px-1">
                                            <Star className="w-5 h-5 sm:w-6 sm:w-8 text-orange-500 mx-auto mb-0.5 sm:mb-1" />
                                            <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium truncate block">{chartLabel}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        const signName = ZODIAC_SIGNS[signIndex];
                        const signSymbol = ZODIAC_SYMBOLS[signName];
                        const planetsInSign = getPlanetsInSign(signIndex);
                        const isAsc = isAscendantSign(signIndex);

                        return (
                            <div
                                key={i}
                                className={`bg-white dark:bg-gray-800 p-0.5 sm:p-1 md:p-2 flex flex-col relative transition-colors hover:bg-orange-50 dark:hover:bg-orange-900/20 ${isAsc ? "ring-1 sm:ring-2 ring-orange-500 ring-inset z-10" : ""}`}
                            >
                                <div className="flex items-center justify-between mb-0.5 transition-colors">
                                    <span className="text-xs sm:text-sm md:text-lg text-gray-800 dark:text-gray-100 font-serif">{signSymbol}</span>
                                    {isAsc && <span className="text-[8px] sm:text-[10px] text-orange-600 dark:text-orange-400 font-bold bg-orange-100 dark:bg-orange-900/30 px-0.5 sm:px-1 rounded">ASC</span>}
                                </div>
                                <div className="flex-1 flex flex-wrap gap-[1px] sm:gap-0.5 content-start transition-colors">
                                    {planetsInSign.map((planet) => {
                                        const { deg, min, sec } = getDMS(planet.signDegree);
                                        return (
                                            <Tooltip key={planet.planet}>
                                                <TooltipTrigger>
                                                    <span className={`text-[8px] sm:text-[10px] md:text-xs font-bold transition-colors ${PLANET_COLORS[planet.planet] || 'text-gray-700 dark:text-gray-300'} ${planet.isRetrograde ? "underline decoration-dotted" : ""}`}>
                                                        {PLANET_ABBREVIATIONS[planet.planet] || planet.planet.substring(0, 2)}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent className="dark:bg-gray-900 dark:border-gray-700 max-w-[200px]">
                                                    <p className='font-bold text-gray-900 dark:text-gray-100'>{planet.planet}</p>
                                                    <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{deg}&deg; {min}' {sec}" in {planet.sign}</p>
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                                                        {planet.nakshatra} ({planet.nakshatraPada})
                                                        {planet.isRetrograde && " (R)"}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                                <span className="text-[6px] sm:text-[8px] md:text-[10px] text-gray-400 dark:text-gray-500 mt-auto text-right transition-colors">{signName.substring(0, 3)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default SouthIndianChart;
