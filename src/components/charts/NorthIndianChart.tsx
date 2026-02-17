
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import {
    getDMS
} from '../../utils/chartUtils';
import { PlanetaryPosition } from '@types';

interface NorthIndianChartProps {
    planets: PlanetaryPosition[];
    ascendantSignIndex: number;
    chartLabel: string;
}

export function NorthIndianChart({
    planets,
    ascendantSignIndex,
    chartLabel
}: NorthIndianChartProps) {
    const getSignForHouse = (house: number) => {
        return (ascendantSignIndex + house - 1) % 12;
    };

    const getPlanetsInHouse = (house: number) => {
        return planets.filter(p => p.house === house);
    };

    // Traditional Planet Coloring Override
    const TRADITIONAL_PLANET_COLORS: Record<string, string> = {
        "Sun": "text-orange-600 dark:text-orange-400",
        "Moon": "text-blue-400 dark:text-blue-300",
        "Mars": "text-red-600 dark:text-red-400",
        "Mercury": "text-teal-600 dark:text-teal-400",
        "Jupiter": "text-amber-700 dark:text-amber-400",
        "Venus": "text-blue-500 dark:text-blue-300",
        "Saturn": "text-indigo-900 dark:text-indigo-400",
        "Rahu": "text-gray-700 dark:text-gray-400",
        "Ketu": "text-gray-700 dark:text-gray-400"
    };

    // Precise Centroid Coordinates for 12 Houses (400x400 SVG)
    const HOUSE_COORDS = [
        { id: 1, x: 200, y: 85, type: 'diamond' },     // Top (Lagna)
        { id: 2, x: 100, y: 35, type: 'triangle' },    // Top-Left (Upper)
        { id: 3, x: 35, y: 100, type: 'triangle' },    // Left-Top (Lower Left Quad)
        { id: 4, x: 100, y: 200, type: 'diamond' },    // Left (Sukh)
        { id: 5, x: 35, y: 300, type: 'triangle' },    // Left-Bottom
        { id: 6, x: 100, y: 365, type: 'triangle' },   // Bottom-Left
        { id: 7, x: 200, y: 315, type: 'diamond' },    // Bottom (Kalatra)
        { id: 8, x: 300, y: 365, type: 'triangle' },   // Bottom-Right
        { id: 9, x: 365, y: 300, type: 'triangle' },   // Right-Bottom
        { id: 10, x: 300, y: 200, type: 'diamond' },   // Right (Karma)
        { id: 11, x: 365, y: 100, type: 'triangle' },  // Right-Top
        { id: 12, x: 300, y: 35, type: 'triangle' }    // Top-Right
    ];

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-xl font-serif text-red-900 mb-2 font-bold">
                {chartLabel}
            </h3>

            <div className="aspect-square w-full max-w-md mx-auto bg-orange-50/50 border-4 border-red-900 p-1 relative">
                <div className="w-full h-full border border-red-900 relative">
                    <svg viewBox="0 0 400 400" className="w-full h-full absolute inset-0">
                        {/* Outer diamond */}
                        <polygon
                            points="200,0 400,200 200,400 0,200"
                            fill="none"
                            stroke="#8B0000"
                            strokeWidth="1.5"
                        />
                        {/* Inner lines creating houses (Diagonals only) */}
                        <line x1="0" y1="0" x2="400" y2="400" stroke="#8B0000" strokeWidth="1.5" />
                        <line x1="400" y1="0" x2="0" y2="400" stroke="#8B0000" strokeWidth="1.5" />

                        {/* Center Om Symbol */}
                        <text x="200" y="200" textAnchor="middle" dominantBaseline="middle"
                            className="fill-red-500 dark:fill-red-400 opacity-20 text-6xl font-serif select-none pointer-events-none transition-colors">
                            ॐ
                        </text>

                        {/* Render Houses via SVG ForeignObject */}
                        {HOUSE_COORDS.map((coord) => {
                            const house = coord.id;
                            const signIndex = getSignForHouse(house);
                            const signNumber = signIndex + 1;
                            const planetsInHouse = getPlanetsInHouse(house);

                            const size = coord.type === 'diamond' ? 140 : 100;
                            const x = coord.x - size / 2;
                            const y = coord.y - size / 2;

                            let numPosClass = "absolute text-[10px] sm:text-xs font-bold text-red-900/70";

                            if (coord.type === 'diamond') {
                                if (house === 1) numPosClass = "absolute bottom-1 right-1/2 font-bold translate-x-1/2";
                                else if (house === 4) numPosClass += " right-1 top-1/2 -translate-y-1/2";
                                else if (house === 7) numPosClass += " top-1 left-1/2 -translate-x-1/2";
                                else if (house === 10) numPosClass += " left-1 top-1/2 -translate-y-1/2";
                            } else {
                                if (house === 2) numPosClass += " bottom-1 left-1/2 -translate-x-1/2";
                                if (house === 3) numPosClass += " right-1 top-1/2 -translate-y-1/2";
                                if (house === 5) numPosClass += " right-1 top-1/2 -translate-y-1/2";
                                if (house === 6) numPosClass += " top-1 left-1/2 -translate-x-1/2";
                                if (house === 8) numPosClass += " top-1 left-1/2 -translate-x-1/2";
                                if (house === 9) numPosClass += " left-1 top-1/2 -translate-y-1/2";
                                if (house === 11) numPosClass += " left-1 top-1/2 -translate-y-1/2";
                                if (house === 12) numPosClass += " bottom-1 left-1/2 -translate-x-1/2";
                            }

                            return (
                                <foreignObject key={house} x={x} y={y} width={size} height={size} className="overflow-visible pointer-events-none">
                                    <div className="w-full h-full flex flex-col items-center justify-center text-center pointer-events-auto relative font-serif">
                                        <span className={numPosClass}>
                                            {signNumber}
                                        </span>
                                        <div className="flex flex-wrap gap-0.5 justify-center z-10 scale-90 sm:scale-100 origin-center">
                                            {planetsInHouse.map((planet) => {
                                                const { deg, min, sec } = getDMS(planet.signDegree);
                                                return (
                                                    <Tooltip key={planet.planet}>
                                                        <TooltipTrigger>
                                                            <span className={`text-xs sm:text-sm font-bold leading-none ${TRADITIONAL_PLANET_COLORS[planet.planet] || 'text-gray-800 dark:text-gray-200'}`}>
                                                                {planet.planet.substring(0, 2)}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="dark:bg-gray-900 dark:border-gray-700">
                                                            <p className="font-semibold text-gray-900 dark:text-gray-100">{planet.planet}</p>
                                                            <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
                                                                <p>{deg}&deg; {min}' {sec}" in {planet.sign}</p>
                                                                <p>{planet.nakshatra} ({planet.nakshatraPada})</p>
                                                                {planet.isRetrograde && <p className="text-red-500 dark:text-red-400">Retrograde</p>}
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </foreignObject>
                            );
                        })}
                    </svg>
                </div>
            </div>
        </div>
    );
}
