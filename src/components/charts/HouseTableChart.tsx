
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import {
    ZODIAC_SIGNS,
    ZODIAC_SYMBOLS,
    PLANET_COLORS,
    getDMS
} from '../../utils/chartUtils';
import { PlanetaryPosition } from '@types';

interface HouseTableChartProps {
    planets: PlanetaryPosition[];
    ascendantSignIndex: number;
    chartLabel: string;
}

export function HouseTableChart({
    planets,
    ascendantSignIndex,
    //   chartLabel
}: HouseTableChartProps) {
    // Create house data
    const houses = Array.from({ length: 12 }, (_, i) => {
        const houseNumber = i + 1;
        const signIndex = (ascendantSignIndex + i) % 12;
        const signName = ZODIAC_SIGNS[signIndex];
        const housePlanets = planets.filter(p => p.house === houseNumber);

        return {
            house: houseNumber,
            sign: signName,
            signSymbol: ZODIAC_SYMBOLS[signName],
            planets: housePlanets
        };
    });

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">House</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Sign</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Planets</th>
                        </tr>
                    </thead>
                    <tbody>
                        {houses.map((house) => (
                            <tr key={house.house} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 last:border-0 transition-colors">
                                <td className="py-2 px-4 font-medium text-gray-900 dark:text-gray-100">
                                    {house.house === 1 ? "1st (Ascendant)" : `${house.house}${house.house === 2 ? 'nd' : house.house === 3 ? 'rd' : 'th'} `}
                                </td>
                                <td className="py-2 px-4">
                                    <span className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                        <span className="text-lg">{house.signSymbol}</span>
                                        <span>{house.sign}</span>
                                    </span>
                                </td>
                                <td className="py-2 px-4">
                                    {house.planets.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {house.planets.map((planet) => {
                                                const { deg, min, sec } = getDMS(planet.signDegree);
                                                return (
                                                    <Tooltip key={planet.planet}>
                                                        <TooltipTrigger>
                                                            <span className={`font-semibold cursor-help ${PLANET_COLORS[planet.planet] || 'text-gray-800 dark:text-gray-200'} ${planet.isRetrograde ? 'underline decoration-dotted' : ''}`}>
                                                                {planet.planet}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="dark:bg-gray-900 dark:border-gray-700">
                                                            <p className="font-semibold text-gray-100">{planet.planet}</p>
                                                            <div className="text-xs space-y-1 text-gray-300">
                                                                <p>{deg}&deg; {min}' {sec}" in {planet.sign}</p>
                                                                <p>{planet.nakshatra} ({planet.nakshatraPada})</p>
                                                                {planet.isRetrograde && <p className="text-orange-400">Retrograde</p>}
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 dark:text-gray-500 text-xs">Empty</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
