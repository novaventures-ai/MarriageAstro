import { useState } from 'react';
import {
    Map,
    Table as TableIcon,
    Activity,
    Sparkles,
    ChevronDown,
    Clock,
    Calendar,
    MapPin,
    Globe,
    Compass
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Chart, DashaPeriod } from '@types';
import { SouthIndianChart } from './charts/SouthIndianChart';
import { NorthIndianChart } from './charts/NorthIndianChart';
import { HouseTableChart } from './charts/HouseTableChart';
import { ZODIAC_SIGNS } from '../utils/chartUtils';

// Utility for merging tailwind classes
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Types ---
interface ChartDetailsWidgetProps {
    boyChart: Chart | null;
    girlChart: Chart | null;
}

type TabType = 'charts' | 'planets' | 'kp' | 'yogas' | 'dashas' | 'birth';
type ChartStyle = 'south' | 'north' | 'table';
type ChartVarga = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D7' | 'D8' | 'D9' | 'D10' | 'D12' | 'D16' | 'D20' | 'D24' | 'D27' | 'D30' | 'D40' | 'D45' | 'D60';

const VARGA_NAMES: Record<string, string> = {
    D1: 'Rashi', D2: 'Hora', D3: 'Drekkana', D4: 'Chaturthamsa',
    D5: 'Panchamsa', D7: 'Saptamsa', D8: 'Ashtamsha', D9: 'Navamsa',
    D10: 'Dasamsa', D12: 'Dwadasamsa', D16: 'Shodashamsa', D20: 'Vimsamsa',
    D24: 'Chaturvimshamsha', D27: 'Saptavimsamsa', D30: 'Trimsamsa',
    D40: 'Khavedamsa', D45: 'Akshavedamsa', D60: 'Shashtiamsa'
};

// Helper to get sign index from name
const getSignIndex = (signName: string) => ZODIAC_SIGNS.indexOf(signName);


// --- Main Widget ---

export default function ChartDetailsWidget({ boyChart, girlChart }: ChartDetailsWidgetProps) {
    const [activeProfile, setActiveProfile] = useState<'boy' | 'girl'>('boy');
    const [activeTab, setActiveTab] = useState<TabType>('charts');
    const [chartStyle, setChartStyle] = useState<ChartStyle>('south');
    const [activeVarga, setActiveVarga] = useState<ChartVarga>('D1');
    const [expandedMahadasha, setExpandedMahadasha] = useState<number | null>(null);
    const [expandedAntardasha, setExpandedAntardasha] = useState<number | null>(null);

    const currentChart = activeProfile === 'boy' ? boyChart : girlChart;

    // Helper to get render data for charts
    const getRenderData = () => {
        if (!currentChart) return { planets: [], ascendantSignIndex: 0 };

        const vargaData = currentChart.vargaCharts[activeVarga];
        // Fallback to D1 if specific varga missing (though generator should populate safe defaults)
        const safeData = vargaData || currentChart.vargaCharts.D1;

        const ascendantSign = safeData.ascendant;
        const ascendantSignIndex = ascendantSign ? getSignIndex(ascendantSign) : 0;

        return {
            planets: safeData.planetaryPositions || [],
            ascendantSignIndex
        };
    };

    if (!boyChart && !girlChart) return null;

    // Render Data
    const { planets, ascendantSignIndex } = getRenderData();
    const kpData = currentChart?.kp;
    const yogas = currentChart?.yogas || [];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-orange-100 dark:border-orange-900/30 overflow-hidden transition-colors">
            {/* Header Toggle - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 bg-orange-50/30 dark:bg-orange-900/10 gap-3 sm:gap-4 transition-colors">
                {girlChart && (
                    <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg self-start sm:self-auto transition-colors">
                        <button
                            onClick={() => setActiveProfile('boy')}
                            className={cn("px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all",
                                activeProfile === 'boy' ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                            )}
                        >
                            Boy&apos;s Chart
                        </button>
                        <button
                            onClick={() => setActiveProfile('girl')}
                            className={cn("px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all",
                                activeProfile === 'girl' ? "bg-white dark:bg-gray-800 text-pink-600 dark:text-pink-400 shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                            )}
                        >
                            Girl&apos;s Chart
                        </button>
                    </div>
                )}

                <div className="flex gap-1 text-xs sm:text-sm bg-gray-100 p-1 rounded-lg overflow-x-auto max-w-full scrollbar-hide">
                    <button onClick={() => setActiveTab('charts')} className={cn("p-1.5 rounded flex items-center gap-1 min-touch-small", activeTab === 'charts' && "bg-white shadow")}>
                        <Map className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden md:inline">Charts</span>
                    </button>
                    <button onClick={() => setActiveTab('planets')} className={cn("p-1.5 rounded flex items-center gap-1 min-touch-small", activeTab === 'planets' && "bg-white shadow")}>
                        <TableIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden md:inline">Planets</span>
                    </button>
                    <button onClick={() => setActiveTab('kp')} className={cn("p-1.5 rounded flex items-center gap-1 min-touch-small", activeTab === 'kp' && "bg-white shadow")}>
                        <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden md:inline">KP</span>
                    </button>
                    <button onClick={() => setActiveTab('yogas')} className={cn("p-1.5 rounded flex items-center gap-1 min-touch-small", activeTab === 'yogas' && "bg-white shadow")}>
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden md:inline">Yogas</span>
                    </button>
                    <button onClick={() => setActiveTab('dashas')} className={cn("p-1.5 rounded flex items-center gap-1 min-touch-small", activeTab === 'dashas' && "bg-white shadow")}>
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden md:inline">Dashas</span>
                    </button>
                    <button onClick={() => setActiveTab('birth')} className={cn("p-1.5 rounded flex items-center gap-1 min-touch-small", activeTab === 'birth' && "bg-white shadow")}>
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden md:inline">Birth Details</span>
                    </button>
                </div>
            </div>

            <div className="p-3 sm:p-4 min-h-[300px] sm:min-h-[400px]">
                {!currentChart ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm sm:text-base">
                        Data not available
                    </div>
                ) : (
                    <>
                        {/* CHARTS VIEW */}
                        {activeTab === 'charts' && (
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex flex-wrap justify-between items-center gap-2">
                                    {/* Varga Selector */}
                                    <div className="relative group">
                                        <select
                                            value={activeVarga}
                                            onChange={(e) => setActiveVarga(e.target.value as ChartVarga)}
                                            className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-1 pl-3 pr-8 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800/30 cursor-pointer hover:border-orange-300 dark:hover:border-orange-700 transition-colors"
                                        >
                                            {Object.keys(VARGA_NAMES).map(key => (
                                                <option key={key} value={key} className="dark:bg-gray-800">{key} - {VARGA_NAMES[key]}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>

                                    <div className="flex gap-1 text-xs">
                                        <button onClick={() => setChartStyle('south')} className={cn("px-2 py-1 rounded border transition-colors", chartStyle === 'south' ? "bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800/50 text-orange-800 dark:text-orange-200" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400")}>South</button>
                                        <button onClick={() => setChartStyle('north')} className={cn("px-2 py-1 rounded border transition-colors", chartStyle === 'north' ? "bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800/50 text-orange-800 dark:text-orange-200" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400")}>North</button>
                                        <button onClick={() => setChartStyle('table')} className={cn("px-2 py-1 rounded border transition-colors", chartStyle === 'table' ? "bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800/50 text-orange-800 dark:text-orange-200" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400")}>Table</button>
                                    </div>
                                </div>

                                <div className="py-2 flex justify-center">
                                    <div className="w-full max-w-md aspect-square">
                                        {chartStyle === 'table' ? (
                                            <HouseTableChart
                                                planets={planets}
                                                ascendantSignIndex={ascendantSignIndex}
                                                chartLabel={`${activeVarga} ${VARGA_NAMES[activeVarga]} Chart`}
                                            />
                                        ) : chartStyle === 'north' ? (
                                            <NorthIndianChart
                                                planets={planets}
                                                ascendantSignIndex={ascendantSignIndex}
                                                chartLabel={`${activeVarga} ${VARGA_NAMES[activeVarga]} Chart`}
                                            />
                                        ) : (
                                            <SouthIndianChart
                                                planets={planets}
                                                ascendantSignIndex={ascendantSignIndex}
                                                chartLabel={`${activeVarga} ${VARGA_NAMES[activeVarga]} Chart`}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PLANETS TABLE */}
                        {activeTab === 'planets' && (
                            <div className="overflow-x-auto">
                                <h4 className="font-semibold text-sm mb-3 text-gray-700 dark:text-gray-300 transition-colors">Planetary Positions ({activeVarga})</h4>
                                <table className="w-full text-sm text-center">
                                    <thead className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-900 transition-colors">
                                        <tr>
                                            <th className="px-2 py-2 text-left">Planet</th>
                                            <th className="px-1 py-2 text-center">Sign</th>
                                            <th className="px-1 py-2 text-center">Deg.</th>
                                            <th className="px-1 py-2 text-center">Nakshatra</th>
                                            <th className="px-1 py-2 text-center">H</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700 transition-colors">
                                        {planets.map(p => (
                                            <tr key={p.planet} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-xs sm:text-sm">
                                                <td className="px-2 py-2 text-left font-medium whitespace-nowrap">
                                                    <span className={cn(
                                                        p.planet === "Mars" && "text-red-600 dark:text-red-400",
                                                        p.planet === "Saturn" && "text-blue-700 dark:text-blue-400",
                                                        p.planet === "Sun" && "text-orange-600 dark:text-orange-400",
                                                        p.planet === "Moon" && "text-slate-500 dark:text-slate-400",
                                                        (p.planet === "Rahu" || p.planet === "Ketu") && "text-purple-600 dark:text-purple-400"
                                                    )}>{p.planet.substring(0, 4)}</span>
                                                    {p.isRetrograde && <span className="ml-0.5 text-[8px] text-red-500 dark:text-red-400 font-bold">(R)</span>}
                                                </td>
                                                <td className="px-1 py-2 text-gray-800 dark:text-gray-200 whitespace-nowrap">{p.sign.substring(0, 3)}</td>
                                                <td className="px-1 py-2 text-gray-800 dark:text-gray-200 whitespace-nowrap">{Math.floor(p.longitude % 30)}°</td>
                                                <td className="px-1 py-2 text-[10px] text-gray-600 dark:text-gray-400 whitespace-nowrap">{p.nakshatra.substring(0, 5)}</td>
                                                <td className="px-1 py-2 text-gray-800 dark:text-gray-200">{p.house}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* KP SYSTEM */}
                        {activeTab === 'kp' && (
                            <div className="space-y-6">
                                { /* Planets KP View */}
                                <div>
                                    <h4 className="font-semibold text-sm mb-2 text-indigo-900 dark:text-indigo-300 border-b dark:border-indigo-800 pb-1 transition-colors">KP Planetary Significators</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-center border-collapse">
                                            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-colors text-[10px] sm:text-xs">
                                                <tr>
                                                    <th className="p-1.5 sm:p-2 text-left border-b dark:border-gray-800">Planet</th>
                                                    <th className="p-1.5 sm:p-2 border-b dark:border-gray-800 text-center">Star</th>
                                                    <th className="p-1.5 sm:p-2 border-b dark:border-gray-800 text-center">Sub</th>
                                                    <th className="p-1.5 sm:p-2 border-b dark:border-gray-800 text-center">Signif</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y dark:divide-gray-800 transition-colors text-[10px] sm:text-xs">
                                                {kpData?.significators.map(s => (
                                                    <tr key={s.planet} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                        <td className="p-1.5 sm:p-2 text-left font-medium border-b dark:border-gray-800 text-gray-800 dark:text-gray-200 whitespace-nowrap">{s.planet.substring(0, 4)}</td>
                                                        <td className="p-1.5 sm:p-2 border-b dark:border-gray-800 text-gray-700 dark:text-gray-300 whitespace-nowrap">{s.starLord.substring(0, 3)}</td>
                                                        <td className="p-1.5 sm:p-2 border-b dark:border-gray-800 font-medium text-indigo-700 dark:text-indigo-400 whitespace-nowrap">{s.subLord.substring(0, 3)}</td>
                                                        <td className="p-1.5 sm:p-2 border-b dark:border-gray-800 text-gray-600 dark:text-gray-400 max-w-[80px] sm:max-w-[150px] truncate" title={s.significations.join(', ')}>
                                                            {s.significations.join(', ')}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {!kpData?.significators.length && <div className="text-center text-xs text-gray-400 py-4">No KP Data Available</div>}
                                </div>

                                {/* Cusps View */}
                                <div>
                                    <h4 className="font-semibold text-sm mb-2 text-indigo-900 dark:text-indigo-300 border-b dark:border-indigo-800 pb-1 transition-colors">KP House Cusps (Placidus)</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-center border-collapse">
                                            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-colors text-[10px] sm:text-xs">
                                                <tr>
                                                    <th className="p-1.5 sm:p-2 border-b dark:border-gray-800">C</th>
                                                    <th className="p-1.5 sm:p-2 border-b dark:border-gray-800">Sign</th>
                                                    <th className="p-1.5 sm:p-2 border-b dark:border-gray-800">Deg</th>
                                                    <th className="p-1.5 sm:p-2 border-b dark:border-gray-800">SL</th>
                                                    <th className="p-1.5 sm:p-2 border-b dark:border-gray-800">StL</th>
                                                    <th className="p-1.5 sm:p-2 border-b dark:border-gray-800">SbL</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y dark:divide-gray-800 transition-colors text-[10px] sm:text-xs">
                                                {kpData?.cusps.map(cusp => {
                                                    const degreeVal = cusp.longitude % 30;
                                                    const deg = Math.floor(degreeVal);
                                                    return (
                                                        <tr key={cusp.cuspNumber} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                            <td className="p-1.5 sm:p-2 font-bold border-b dark:border-gray-800 text-gray-900 dark:text-gray-100">{cusp.cuspNumber}</td>
                                                            <td className="p-1.5 sm:p-2 border-b dark:border-gray-800 text-gray-800 dark:text-gray-200">{cusp.sign.substring(0, 3)}</td>
                                                            <td className="p-1.5 sm:p-2 border-b dark:border-gray-800 text-gray-700 dark:text-gray-300">{deg}°</td>
                                                            <td className="p-1.5 sm:p-2 border-b dark:border-gray-800 text-gray-700 dark:text-gray-300">{cusp.signLord.substring(0, 3)}</td>
                                                            <td className="p-1.5 sm:p-2 border-b dark:border-gray-800 text-gray-700 dark:text-gray-300">{cusp.starLord.substring(0, 3)}</td>
                                                            <td className="p-1.5 sm:p-2 border-b dark:border-gray-800 font-medium text-indigo-700 dark:text-indigo-400">{cusp.subLord.substring(0, 3)}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    {!kpData?.cusps.length && <div className="text-center text-xs text-gray-400 py-4">No KP Data Available</div>}
                                </div>
                            </div>
                        )}

                        {/* YOGAS TAB */}
                        {activeTab === 'yogas' && (
                            <div>
                                <h4 className="font-semibold text-sm mb-3 text-indigo-900 dark:text-indigo-300 flex items-center gap-2 transition-colors">
                                    <Sparkles className="w-4 h-4 text-orange-500" />
                                    Planetary Combinations (Yogas)
                                </h4>
                                {yogas.length > 0 ? (
                                    <div className="space-y-3">
                                        {yogas.map((yoga, idx) => (
                                            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h5 className="font-medium text-indigo-800 dark:text-indigo-300 text-sm">{yoga.name}</h5>
                                                    <span className={cn(
                                                        "text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider",
                                                        yoga.strength === 'strong' ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                                                            yoga.strength === 'medium' ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" :
                                                                "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                                    )}>{yoga.strength}</span>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 italic">"{yoga.description}"</p>
                                                <div className="text-xs text-gray-700 dark:text-gray-300">
                                                    <span className="font-semibold text-indigo-900 dark:text-indigo-400">Effects: </span>
                                                    {yoga.effects}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">
                                        No major yogas detected in this chart.
                                    </div>
                                )}
                            </div>
                        )}
                        {/* DASHAS TAB */}
                        {activeTab === 'dashas' && (
                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm mb-3 text-indigo-900 dark:text-indigo-300 flex items-center gap-2 transition-colors">
                                    <Clock className="w-4 h-4 text-orange-500" />
                                    Vimshottari Dasha Periods
                                </h4>
                                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {(currentChart.dashas || []).map((mahadasha, mIdx) => {
                                        const isMExpanded = expandedMahadasha === mIdx || (mahadasha.isCurrent && expandedMahadasha === null);
                                        return (
                                            <div key={mIdx} className={cn(
                                                "border rounded-lg overflow-hidden transition-all",
                                                mahadasha.isCurrent ? "border-orange-200 dark:border-orange-800/50 ring-1 ring-orange-100 dark:ring-orange-900/30" : "border-gray-100 dark:border-gray-800"
                                            )}>
                                                <div
                                                    className={cn(
                                                        "p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50",
                                                        mahadasha.isCurrent ? "bg-orange-50/50 dark:bg-orange-900/10" : "bg-white dark:bg-gray-800"
                                                    )}
                                                    onClick={() => setExpandedMahadasha(expandedMahadasha === mIdx ? -1 : mIdx)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={cn(
                                                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                                                            mahadasha.isCurrent ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                                        )}>
                                                            {mahadasha.planet.substring(0, 2)}
                                                        </span>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                                                {mahadasha.planet} Mahadasha
                                                                {mahadasha.isCurrent && (
                                                                    <span className="text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Current</span>
                                                                )}
                                                            </div>
                                                            <div className="text-[10px] text-gray-500 dark:text-gray-400">
                                                                {new Date(mahadasha.startDate).toLocaleDateString()} - {new Date(mahadasha.endDate).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex items-center gap-2">
                                                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300">{mahadasha.durationYears}y</div>
                                                        <ChevronDown className={cn("w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform", isMExpanded && "rotate-180")} />
                                                    </div>
                                                </div>

                                                {/* Antardashas */}
                                                {isMExpanded && mahadasha.subPeriods && (
                                                    <div className="bg-gray-50/50 dark:bg-gray-900/30 border-t border-gray-50 dark:border-gray-700 p-2 space-y-1">
                                                        {mahadasha.subPeriods.map((antardasha, aIdx) => {
                                                            const isAExpanded = expandedAntardasha === aIdx && expandedMahadasha === mIdx;
                                                            return (
                                                                <div key={aIdx} className="space-y-1">
                                                                    <div
                                                                        className={cn(
                                                                            "flex justify-between items-center p-2 rounded text-xs cursor-pointer hover:bg-white dark:hover:bg-gray-800 transition-colors",
                                                                            antardasha.isCurrent ? "bg-white dark:bg-gray-800 border border-orange-100 dark:border-orange-800/30 shadow-sm" : "text-gray-600 dark:text-gray-400"
                                                                        )}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setExpandedAntardasha(expandedAntardasha === aIdx && expandedMahadasha === mIdx ? -1 : aIdx);
                                                                            setExpandedMahadasha(mIdx);
                                                                        }}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <div className={cn("w-1.5 h-1.5 rounded-full", antardasha.isCurrent ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600")} />
                                                                            <span className={antardasha.isCurrent ? "font-bold text-gray-900 dark:text-gray-100" : ""}>{antardasha.planet} (Sub)</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                                                                {new Date(antardasha.startDate).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })}
                                                                            </span>
                                                                            <ChevronDown className={cn("w-3 h-3 text-gray-300 dark:text-gray-600", isAExpanded && "rotate-180")} />
                                                                        </div>
                                                                    </div>

                                                                    {/* Pratyantardashas */}
                                                                    {isAExpanded && antardasha.subPeriods && (
                                                                        <div className="pl-6 pr-2 py-1 border-l-2 border-orange-100 dark:border-orange-800/30 ml-2 space-y-1 mb-2 transition-colors">
                                                                            {antardasha.subPeriods.map((pratyantar: DashaPeriod, pIdx: number) => (
                                                                                <div key={pIdx} className={cn(
                                                                                    "flex justify-between items-center py-1 text-[10px]",
                                                                                    pratyantar.isCurrent ? "text-orange-600 dark:text-orange-400 font-medium" : "text-gray-500 dark:text-gray-400"
                                                                                )}>
                                                                                    <span>{pratyantar.planet} (Minor)</span>
                                                                                    <span>{new Date(pratyantar.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {/* BIRTH DATA TAB */}
                        {activeTab === 'birth' && (
                            <div className="space-y-6">
                                <h4 className="font-semibold text-sm mb-3 text-indigo-900 dark:text-indigo-300 flex items-center gap-2 transition-colors">
                                    <Map className="w-4 h-4 text-orange-500" />
                                    Birth Details
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Name</div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{currentChart.name}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Gender</div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100 capitalize">{currentChart.gender}</div>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-3 h-3 text-orange-500" />
                                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Date of Birth</div>
                                        </div>
                                        <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                            {new Date(currentChart.dateOfBirth).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock className="w-3 h-3 text-orange-500" />
                                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Time of Birth</div>
                                        </div>
                                        <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                            {currentChart.timeOfBirth}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 md:col-span-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <MapPin className="w-3 h-3 text-orange-500" />
                                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Place of Birth</div>
                                        </div>
                                        <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                            {currentChart.location}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <div>
                                                <div className="text-[10px] text-gray-500 dark:text-gray-400">Latitude</div>
                                                <div className="font-mono text-xs text-gray-700 dark:text-gray-300">{currentChart.latitude.toFixed(4)}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-500 dark:text-gray-400">Longitude</div>
                                                <div className="font-mono text-xs text-gray-700 dark:text-gray-300">{currentChart.longitude.toFixed(4)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Globe className="w-3 h-3 text-orange-500" />
                                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Timezone</div>
                                        </div>
                                        <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                            {currentChart.timezone}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Compass className="w-3 h-3 text-orange-500" />
                                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Ayanamsa</div>
                                        </div>
                                        <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                            {currentChart.ayanamsha}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
