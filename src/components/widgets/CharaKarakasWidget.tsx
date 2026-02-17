import React, { useState } from 'react';
import { CharaKarakas, CharaDashaAnalysis, UpapadaLagnaAnalysis, VivahSahamAnalysis } from '../../types/extendedTypes';
import { User, Briefcase, Users, Heart, GraduationCap, Baby, HeartHandshake, ArrowRight, ArrowLeft, Info, Star, Target, HelpCircle, BookOpen, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { useGeminiInsight } from '../../hooks/useGeminiInsight';
import ReactMarkdown from 'react-markdown';

interface CharaKarakasWidgetProps {
  partnerA: {
    charaKarakas: CharaKarakas;
    charaDasha: CharaDashaAnalysis;
    upapadaLagna: UpapadaLagnaAnalysis;
    vivahSaham: VivahSahamAnalysis;
  };
  partnerB: {
    charaKarakas: CharaKarakas;
    charaDasha: CharaDashaAnalysis;
    upapadaLagna: UpapadaLagnaAnalysis;
    vivahSaham: VivahSahamAnalysis;
  };
  nameA?: string;
  nameB?: string;
}

export const CharaKarakasWidget: React.FC<CharaKarakasWidgetProps> = ({
  partnerA,
  partnerB,
  nameA = 'Partner A',
  nameB
}) => {
  const [selectedPartner, setSelectedPartner] = useState<'A' | 'B'>('A');
  const activeData = selectedPartner === 'A' ? partnerA : partnerB;
  const activeName = selectedPartner === 'A' ? nameA : nameB;

  const { charaKarakas, charaDasha, upapadaLagna, vivahSaham } = activeData;
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [activeKaraka, setActiveKaraka] = useState<string | null>(null);
  const { loading, insight, error, triggerAnalysis } = useGeminiInsight();

  const karakaIcons: Record<string, React.ReactNode> = {
    atmakaraka: <User className="w-6 h-6" />,
    amatyakaraka: <Briefcase className="w-6 h-6" />,
    bhratrukaraka: <Users className="w-6 h-6" />,
    matrukaraka: <Heart className="w-6 h-6" />,
    pitrukaraka: <GraduationCap className="w-6 h-6" />,
    putrakaraka: <Baby className="w-6 h-6" />,
    darakaraka: <HeartHandshake className="w-6 h-6" />
  };

  const karakaColors: Record<string, string> = {
    atmakaraka: 'from-amber-500 to-orange-600',
    amatyakaraka: 'from-blue-500 to-indigo-600',
    bhratrukaraka: 'from-green-500 to-emerald-600',
    matrukaraka: 'from-pink-500 to-rose-600',
    pitrukaraka: 'from-purple-500 to-violet-600',
    putrakaraka: 'from-cyan-500 to-teal-600',
    darakaraka: 'from-red-500 to-pink-600'
  };

  const karakaData: Record<string, { title: string; description: string; detailDescription: string }> = {
    atmakaraka: {
      title: 'Atmakaraka (AK) - Soul Planet',
      description: 'Self, Soul, Individual Essence',
      detailDescription: 'The planet with the HIGHEST degree in your chart. This planet represents your soul\'s deepest desires and the primary lessons you must learn in this lifetime. It shows what your soul is here to experience and overcome.'
    },
    amatyakaraka: {
      title: 'Amatyakaraka (AmK) - Career Guide',
      description: 'Advisor, Career, Guidance',
      detailDescription: 'The 2nd highest degree planet. This is your career significator and shows the type of work and advisors that support your life path. It reveals your professional destiny.'
    },
    bhratrukaraka: {
      title: 'Bhratrukaraka (BK) - Sibling Planet',
      description: 'Siblings, Courage, Initiative',
      detailDescription: 'The 3rd highest degree planet. Represents your relationship with siblings, your courage, and your ability to take initiative in life.'
    },
    matrukaraka: {
      title: 'Matrukaraka (MK) - Mother Planet',
      description: 'Mother, Home, Emotional Foundation',
      detailDescription: 'The 4th highest degree planet. Signifies your mother, home environment, and emotional security. Shows your nurturing nature and domestic happiness.'
    },
    pitrukaraka: {
      title: 'Pitrukaraka (PK) - Father Planet',
      description: 'Father, Ancestors, Dharma',
      detailDescription: 'The 5th highest degree planet. Represents your father, ancestors, and spiritual dharma. Shows guidance from elders and your life path.'
    },
    putrakaraka: {
      title: 'Putrakaraka (PiK) - Children Planet',
      description: 'Children, Creativity, Legacy',
      detailDescription: 'The 6th highest degree planet. Signifies children, creativity, and your legacy. Shows your creative expression and relationship with younger ones.'
    },
    darakaraka: {
      title: 'Darakaraka (DK) - Spouse Planet',
      description: 'Spouse, Marriage Partner (Most Important for Marriage)',
      detailDescription: 'The planet with the LOWEST degree - MOST IMPORTANT for marriage. This planet directly represents your spouse and determines their characteristics and when marriage will occur.'
    }
  };

  const formatDegree = (degree: number) => {
    const deg = Math.floor(degree);
    const min = Math.floor((degree - deg) * 60);
    const sec = Math.floor(((degree - deg) * 60 - min) * 60);
    return `${deg}° ${min}' ${sec}"`;
  };

  const HelpBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 transition-colors">
      <div className="flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">{title}</h5>
          <div className="text-sm text-blue-700 dark:text-blue-300">{children}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Educational Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Jaimini Chara Karakas - {activeName}</h2>
            <p className="text-indigo-100 leading-relaxed">
              Chara Karakas are <strong>7 variable significators</strong> determined by the degrees of planets in your chart.
              Unlike fixed karakas, these change based on planetary positions and reveal your unique karmic blueprint.
              The planet with the highest degree is your soul planet (Atmakaraka), while the lowest is your spouse
              indicator (Darakaraka) - crucial for marriage timing.
            </p>
          </div>
        </div>
      </div>

      {/* AI Soul Connection Reveal */}
      <div className="bg-gradient-to-r from-indigo-900 to-violet-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-32 h-32 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                Reveal Soul Connection
              </h3>
              <p className="text-indigo-200 text-sm mt-1">
                Ask "The Mystic" to analyze the karmic link between your Self (AK) and Spouse (DK).
              </p>
            </div>
            <button
              onClick={() => triggerAnalysis('JAIMINI_ANALYSIS', {
                ak: charaKarakas.atmakaraka,
                dk: charaKarakas.darakaraka,
                connection: `AK in ${charaKarakas.atmakaraka.sign} vs DK in ${charaKarakas.darakaraka.sign}`,
                partnerName: activeName
              })}
              disabled={loading}
              className="px-5 py-2 bg-yellow-400 text-indigo-900 rounded-lg font-bold shadow-lg hover:bg-yellow-300 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {insight ? 'Reveal Again' : 'Analyze Soul Contract'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0" />
              <p className="text-sm text-white">{error}</p>
            </div>
          )}

          {insight && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20 animate-in fade-in slide-in-from-top-2 backdrop-blur-sm">
              <div className="prose prose-sm prose-invert max-w-none">
                <ReactMarkdown>{insight}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Partner Toggle - Only show if nameB is present */}
      {nameB && (
        <div className="flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center gap-1 transition-colors">
            <button
              onClick={() => setSelectedPartner('A')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedPartner === 'A' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {nameA}
            </button>
            <button
              onClick={() => setSelectedPartner('B')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedPartner === 'B' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {nameB}
            </button>
          </div>
        </div>
      )}

      {/* Chara Karakas Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
              <Star className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              {activeName}&apos;s 7 Chara Karakas
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
              Click on each card to learn what it means for your life
            </p>
          </div>
          <button
            onClick={() => setShowHelp(showHelp === 'karakas' ? null : 'karakas')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {showHelp === 'karakas' && (
          <HelpBox title="Understanding Chara Karakas">
            In Jaimini astrology, planets are ranked by their degrees (0-30° in each sign).
            <strong>Highest degree = Most important for your soul.</strong>
            <strong>Lowest degree = Most important for your spouse.</strong>
            Each karaka (significator) represents different life areas. Unlike fixed karakas used in Parashari astrology,
            these change for every person based on their birth chart.
          </HelpBox>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(charaKarakas).map(([key, karaka]) => (
            <div
              key={key}
              onClick={() => setActiveKaraka(activeKaraka === key ? null : key)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${activeKaraka === key
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                : 'border-transparent dark:border-transparent hover:border-indigo-400/30'
                } bg-gradient-to-br ${karakaColors[key]} bg-opacity-5 dark:bg-opacity-10`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${karakaColors[key]} text-white shadow-sm`}>
                  {karakaIcons[key]}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm transition-colors">{karakaData[key].title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{karakaData[key].description}</p>
                  <div className="space-y-1 mt-2">
                    <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400 transition-colors">{karaka.planet}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors">
                      {karaka.sign} · House {karaka.house}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 transition-colors">
                      Degree: {formatDegree(karaka.degree)}
                    </p>
                  </div>
                  {activeKaraka === key && (
                    <div className="mt-3 p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-inner transition-colors">
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{karakaData[key].detailDescription}</p>
                      {karaka.marriageSignificance && (
                        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800/30 transition-colors">
                          <p className="text-xs text-red-700 dark:text-red-400 font-semibold">Marriage Significance:</p>
                          <p className="text-xs text-red-600 dark:text-red-300">{karaka.marriageSignificance}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/30 transition-colors">
          <p className="text-sm text-amber-800 dark:text-amber-200 transition-colors">
            <Info className="w-4 h-4 inline mr-2 text-amber-600 dark:text-amber-400" />
            <strong>Important:</strong> Notice how the planets are ordered by degree. The highest degree planet
            (Atmakaraka) shows your soul's journey, while the lowest (Darakaraka) directly influences your marriage.
            Click on any card above to see detailed meanings.
          </p>
        </div>
      </div>

      {/* Chara Dasha Periods */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
              <ArrowRight className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Chara Dasha - {activeName}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
              Jaimini's unique timing method using zodiac signs instead of planets
            </p>
          </div>
          <button
            onClick={() => setShowHelp(showHelp === 'dasha' ? null : 'dasha')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {showHelp === 'dasha' && (
          <HelpBox title="What is Chara Dasha?">
            Unlike Vimshottari Dasha which uses planets, <strong>Chara Dasha</strong> uses the 12 zodiac signs as time periods.
            Each sign rules for a certain number of years based on complex calculations. This system is especially
            powerful for predicting <strong>marriage timing</strong> - when the Dasha (period) activates the sign containing
            your Darakaraka (spouse planet) or the 7th from it, marriage is likely.
          </HelpBox>
        )}

        {/* Current Period */}
        <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 via-white to-pink-50 dark:from-purple-900/20 dark:via-gray-800 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md transition-colors">
                {charaDasha.currentPeriod.sign.substring(0, 2)}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg transition-colors">Current Period: {charaDasha.currentPeriod.sign} ({activeName})</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                  {charaDasha.currentPeriod.durationYears} years · Movement: {charaDasha.currentPeriod.direction === 'direct' ? 'Forward (Aries→Taurus→Gemini...)' : 'Backward (Pisces→Aquarius→Capricorn...)'}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium transition-colors border border-green-200 dark:border-green-800/50">
              Active Now
            </span>
          </div>

          <div className="p-3 bg-white/60 dark:bg-gray-900/40 rounded-lg backdrop-blur-sm transition-colors">
            <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
              <strong>Sign Lord:</strong> {charaDasha.currentPeriod.lord} ·
              <strong> What this means:</strong> During this period, matters ruled by {charaDasha.currentPeriod.sign}
              and planet {charaDasha.currentPeriod.lord} become prominent in your life.
            </p>
          </div>
        </div>

        {/* Upcoming Periods */}
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 transition-colors">Future Dasha Periods - {activeName}</h4>
        <div className="space-y-3">
          {charaDasha.upcomingPeriods.slice(0, 4).map((period, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-transparent dark:border-gray-700/50 transition-colors">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold transition-colors">
                {period.sign.substring(0, 2)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">{period.sign} Period</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{period.durationYears} years · Ruled by {period.lord}</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 transition-colors">
                {period.direction === 'direct' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span className="capitalize">{period.direction}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Marriage Timing */}
        <div className="mt-6 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30 transition-colors">
          <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3 flex items-center gap-2 transition-colors">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            When Will Marriage Happen? (Chara Dasha Indicators)
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors">{charaDasha.marriageTiming.interpretation}</p>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-700/50 transition-colors shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">Darakaraka (Spouse Planet) Sign</p>
              <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400 transition-colors">{charaDasha.marriageTiming.darakarakaSign}</p>
              <p className="text-xs text-gray-600 dark:text-gray-500 mt-1 transition-colors">Marriage when this sign's Dasha runs</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-700/50 transition-colors shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">7th from Darakaraka</p>
              <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400 transition-colors">{charaDasha.marriageTiming.seventhFromDK}</p>
              <p className="text-xs text-gray-600 dark:text-gray-500 mt-1 transition-colors">Also activates marriage</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-700/50 transition-colors shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">Upapada Lagna Sign</p>
              <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400 transition-colors">{charaDasha.marriageTiming.upapadaSign}</p>
              <p className="text-xs text-gray-600 dark:text-gray-500 mt-1 transition-colors">Special marriage indicator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upapada Lagna */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
              <Star className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              Upapada Lagna (UL) - {activeName}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
              A special ascendant calculated for marriage - reveals spouse quality and multiple marriages
            </p>
          </div>
          <button
            onClick={() => setShowHelp(showHelp === 'upapada' ? null : 'upapada')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {showHelp === 'upapada' && (
          <HelpBox title="Understanding Upapada Lagna">
            <strong>Upapada Lagna (UL)</strong> is a special point calculated from your 12th house (house of loss/liberation).
            It's crucial for marriage analysis. The sign where UL falls shows your spouse's background.
            <strong>UL2</strong> (8th from UL) indicates potential for second marriage or major relationship transformation.
            <strong>UL3</strong> (8th from UL2) shows third marriage possibilities. Dual signs (Gemini, Virgo, Sagittarius, Pisces)
            on UL with malefic planets suggest potential for multiple marriages.
          </HelpBox>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* UL1 */}
          <div className="p-5 bg-gradient-to-b from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg border border-pink-100 dark:border-pink-800/30 transition-colors">
            <div className="text-center mb-3">
              <span className="text-2xl font-bold text-pink-700 dark:text-pink-400">UL</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">First Marriage Indicator</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{upapadaLagna.ul.sign}</p>
              {upapadaLagna.ul.planets.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors">
                  Planets: {upapadaLagna.ul.planets.join(', ')}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors">{upapadaLagna.ul.interpretation}</p>
            </div>
          </div>

          {/* UL2 */}
          {upapadaLagna.ul2 && (
            <div className="p-5 bg-gradient-to-b from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30 transition-colors">
              <div className="text-center mb-3">
                <span className="text-2xl font-bold text-purple-700 dark:text-purple-400">UL2</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">8th from UL - Transformation</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{upapadaLagna.ul2.sign}</p>
                {upapadaLagna.ul2.planets.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors">
                    Planets: {upapadaLagna.ul2.planets.join(', ')}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors">{upapadaLagna.ul2.interpretation}</p>
              </div>
            </div>
          )}

          {/* UL3 */}
          {upapadaLagna.ul3 && (
            <div className="p-5 bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30 transition-colors">
              <div className="text-center mb-3">
                <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">UL3</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">8th from UL2 - Deep Patterns</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{upapadaLagna.ul3.sign}</p>
                {upapadaLagna.ul3.planets.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors">
                    Planets: {upapadaLagna.ul3.planets.join(', ')}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors">{upapadaLagna.ul3.interpretation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Calculation Method */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg transition-colors">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2 transition-colors">
            <Info className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            How is Upapada Lagna Calculated?
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1 transition-colors"><strong>Step 1:</strong> Find your 12th house</p>
              <p className="text-gray-800 dark:text-gray-100 font-semibold transition-colors">House {upapadaLagna.calculation.twelfthHouse}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1 transition-colors"><strong>Step 2:</strong> Identify the lord</p>
              <p className="text-gray-800 dark:text-gray-100 font-semibold transition-colors">{upapadaLagna.calculation.twelfthLord}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1 transition-colors"><strong>Step 3:</strong> See where lord is placed</p>
              <p className="text-gray-800 dark:text-gray-100 font-semibold transition-colors">House {upapadaLagna.calculation.lordPlacement}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1 transition-colors"><strong>Step 4:</strong> Count houses</p>
              <p className="text-gray-800 dark:text-gray-100 font-semibold transition-colors">{upapadaLagna.calculation.housesCounted} houses</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 transition-colors">
            The Upapada is calculated by counting from the 12th house to its lord, then counting the same distance forward.
          </p>
        </div>

        {upapadaLagna.multipleMarriageIndication && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/30 transition-colors">
            <p className="text-amber-800 dark:text-amber-200 transition-colors">
              <strong>Multiple Marriage Indicator:</strong> Dual signs on UL with malefic influence suggest potential for
              relationship transformations or multiple marriages. This is not negative - it simply means your relationship
              path may involve significant evolution or multiple committed partnerships.
            </p>
          </div>
        )}

        <p className="mt-4 text-gray-700 dark:text-gray-300 transition-colors">{upapadaLagna.interpretation}</p>
      </div>

      {/* Vivah Saham */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-3 transition-colors">
              <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
              Vivah Saham - {activeName}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
              A precise mathematical point in your chart that activates during marriage periods
            </p>
          </div>
          <button
            onClick={() => setShowHelp(showHelp === 'saham' ? null : 'saham')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {showHelp === 'saham' && (
          <HelpBox title="What is Vivah Saham?">
            <strong>Vivah Saham</strong> is a sensitive point calculated using a specific formula:
            <strong>Venus Longitude - Sun Longitude + Ascendant Longitude.</strong>
            This point becomes activated by planetary transits or dasha periods when marriage is about to occur.
            It's like a "marriage alarm" in your chart that rings at the right time!
          </HelpBox>
        )}

        <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-100 dark:border-red-800/30 transition-colors">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-20 h-20 bg-red-600 dark:bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200 dark:shadow-none transition-colors">
              <Heart className="w-10 h-10" />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{vivahSaham.sign}</p>
              <p className="text-lg text-gray-600 dark:text-gray-400 transition-colors">at {formatDegree(vivahSaham.degree)}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors">Precise Longitude</p>
            <p className="text-xl font-mono text-red-700 dark:text-red-400 transition-colors">{vivahSaham.longitude.toFixed(4)}°</p>
          </div>

          <div className="p-4 bg-white dark:bg-gray-900/50 rounded-lg border border-red-100 dark:border-red-800/20 mb-4 shadow-inner transition-colors">
            <p className="text-gray-700 dark:text-gray-300 transition-colors">{vivahSaham.interpretation}</p>
          </div>

          {vivahSaham.activationPeriods.length > 0 && (
            <div>
              <h4 className="font-semibold text-red-800 dark:text-red-300 mb-3 transition-colors">When Does It Activate?</h4>
              <div className="flex flex-wrap gap-2">
                {vivahSaham.activationPeriods.map((period, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 shadow-sm transition-colors">
                    {period}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors border border-transparent dark:border-blue-800/30">
          <p className="text-sm text-blue-800 dark:text-blue-200 transition-colors">
            <Info className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
            <strong>How to Use:</strong> When Jupiter or other benefic planets transit over this exact degree
            ({vivahSaham.longitude.toFixed(1)}°) or aspect it strongly, and if your Dasha also supports marriage,
            that's when marriage is most likely to occur!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharaKarakasWidget;
