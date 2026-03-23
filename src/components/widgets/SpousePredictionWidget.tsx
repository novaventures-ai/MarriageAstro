import React from 'react';
import { SpousePrediction, Chart } from '../../types';
import { ExtendedSpousePrediction } from '../../types/extendedTypes';
import { User, Crown, Heart, Sparkles, Star, Clock, Info, Smile, Award, Briefcase, Footprints, Music, Shirt, Eye, EyeOff, RefreshCw, AlertCircle, Compass, MapPin, Users, Navigation, Users2, Globe, Zap, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { useGeminiInsight } from '../../hooks/useGeminiInsight';
import ReactMarkdown from 'react-markdown';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface SpousePredictionWidgetProps {
  prediction?: SpousePrediction;
  partnerPrediction?: SpousePrediction;
  gender: 'male' | 'female' | 'other';
  partnerGender?: 'male' | 'female' | 'other';
  inLawAnalysis?: any;
  partnerInLawAnalysis?: any;
  userName?: string;
  partnerName?: string;
}

// Knowledge Base: Detailed 7th House Planet Interpretations
const seventhHousePlanetInterpretations: Record<string, { qualities: string[]; nature: string; appearance: string; bestMatch: string }> = {
  Sun: {
    qualities: ["Authoritative", "Proud", "Regal aura", "Princess-like", "Leadership qualities", "Dominant but caring"],
    nature: "Dominant and authoritative spouse who takes charge. They have a royal bearing and expect respect. Very protective but can be egoistic.",
    appearance: "Average height, athletic build, wheatish complexion, strong presence, commanding eyes",
    bestMatch: "Needs a partner who respects their authority and doesn't challenge their dominance"
  },
  Moon: {
    qualities: ["Emotional", "Caring", "Attached", "Beautiful", "Nurturing", "Mood-dependent"],
    nature: "Emotionally nurturing spouse who is deeply attached. Their mood affects the relationship quality. Very caring and motherly/fatherly.",
    appearance: "Average height, average build, fair complexion, soft features, expressive eyes",
    bestMatch: "Needs a partner who understands their emotional needs and provides stability"
  },
  Mars: {
    qualities: ["Athletic", "Strong", "Assertive", "Energetic", "Passionate", "Quick-tempered"],
    nature: "Active and energetic spouse with strong physical presence. Passionate but can be argumentative. Very protective and courageous.",
    appearance: "Tall, athletic build, reddish complexion, sharp features, energetic gait",
    bestMatch: "Needs a partner who can match their energy and doesn't mind occasional conflicts"
  },
  Mercury: {
    qualities: ["Young looking", "Fair", "Intelligent", "Communicative", "Youthful", "Witty"],
    nature: "Intellectual and communicative spouse who stays young at heart. Very adaptable and humorous. May lack emotional depth at times.",
    appearance: "Average height, slim build, fair complexion, youthful appearance, expressive face",
    bestMatch: "Needs a partner who values communication and intellectual stimulation"
  },
  Jupiter: {
    qualities: ["Pious", "Devoted", "Chubby cheeks", "Big-hearted", "Spiritual", "Traditional"],
    nature: "Spiritual and traditional spouse who values dharma. Very generous and wise. Can be overweight or have a large presence.",
    appearance: "Tall, heavy build, fair complexion, large frame, dignified bearing",
    bestMatch: "Needs a partner who shares traditional values and respects wisdom"
  },
  Venus: {
    qualities: ["Beautiful", "Charming", "Appealing feminine/masculine looks", "Romantic", "Artistic", "Luxury-loving"],
    nature: "Romantic and aesthetically inclined spouse who loves beauty and comfort. Very charming and attractive. Can be indulgent.",
    appearance: "Average height, average build, fair complexion, beautiful features, attractive eyes",
    bestMatch: "Needs a partner who appreciates romance and provides a comfortable lifestyle"
  },
  Saturn: {
    qualities: ["Mature looks", "Older appearance", "Dignified", "Serious", "Responsible", "Hardworking"],
    nature: "Serious and mature spouse who values responsibility. May be older or appear older. Very loyal but can be emotionally reserved.",
    appearance: "Average height, slim build, wheatish complexion, mature appearance, serious expression",
    bestMatch: "Needs a patient partner who values stability and long-term commitment"
  },
  Rahu: {
    qualities: ["Exotic", "Unconventional", "Foreign connection", "Mysterious", "Unique", "Unpredictable"],
    nature: "Unconventional spouse with foreign or unique background. Mysterious and unpredictable. May have unusual habits or appearance.",
    appearance: "Unconventional features, exotic look, may have foreign physical traits, unique style, striking appearance",
    bestMatch: "Needs an open-minded partner who accepts unconventional traits"
  },
  Ketu: {
    qualities: ["Spiritual", "Detached", "Unusual", "Mystical", "Simple", "Non-materialistic"],
    nature: "Spiritual and detached spouse who is non-materialistic. May have unusual spiritual practices. Can be distant emotionally.",
    appearance: "Simple appearance, piercing eyes, lean or thin body, spiritual aura, minimal style",
    bestMatch: "Needs a partner who respects their spiritual path and gives them space"
  },
  Neptune: {
    qualities: ["Spiritual", "Idealistic", "Compassionate", "Artistic", "Dreamy", "Confusing"],
    nature: "Highly spiritual and compassionate spouse. Can be overly idealistic or prone to illusions in relationships. Deep emotional connection.",
    appearance: "Soft, dreamy eyes, mystical aura, gentle features, may have a glamorous or elusive look",
    bestMatch: "Needs a partner who provides grounding while respecting their spiritual sensitivity"
  },
  Uranus: {
    qualities: ["Unconventional", "Independent", "Brilliant", "Erratic", "Exciting", "Freedom-loving"],
    nature: "Unpredictable and exciting spouse who values freedom above all. Relationship may be unconventional or start/end suddenly.",
    appearance: "Unique style, electric presence, bright eyes, may have unusual physical traits or fashion sense",
    bestMatch: "Needs a partner who gives them space and enjoys intellectual stimulation"
  },
  Pluto: {
    qualities: ["Intense", "Transformative", "Deep", "Power-oriented", "Passionate", "Possessive"],
    nature: "Intensely emotional and transformative spouse. Relationship brings deep psychological changes. Can be possessive or controlling but deeply loyal.",
    appearance: "Piercing gaze, brooding intensity, magnetic presence, strong sexual appeal, resilient physique",
    bestMatch: "Needs a partner who can handle intensity and is willing to grow psychologically"
  }
};

// Knowledge Base: Navamsa 7th House Planet Influences on Appearance
const navamsaPlanetAppearance: Record<string, { breastType: string[]; lingamType: string[]; beautyIndicators: string[]; size: string; attractiveness: string }> = {
  Sun: {
    breastType: ["Athletic", "Firm"],
    lingamType: ["Full", "Strong"],
    beautyIndicators: ["Radiant skin", "Commanding presence", "Royal bearing", "Strong bone structure"],
    size: "Average to Athletic",
    attractiveness: "High - commanding and regal"
  },
  Moon: {
    breastType: ["Tear Drop", "Bell", "Side Set", "Relaxed"],
    lingamType: ["Soft", "Average", "Sensitive"],
    beautyIndicators: ["Variable beauty", "Soft features", "Expressive eyes", "Attached to partner"],
    size: "Average",
    attractiveness: "Variable - peaks and valleys"
  },
  Mars: {
    breastType: ["Athletic", "Firm", "Toned"],
    lingamType: ["Long", "Muscular", "Vibrant"],
    beautyIndicators: ["Athletic body", "Hard/toned physique", "Energetic appearance", "Sharp features"],
    size: "Tall and Athletic",
    attractiveness: "Medium to High - fit and active"
  },
  Mercury: {
    breastType: ["Combination of types", "Proportionate"],
    lingamType: ["Youthful", "Medium", "Agile"],
    beautyIndicators: ["Youthful appearance", "Fair skin", "Intelligent eyes", "Graceful movements"],
    size: "Average and Slim",
    attractiveness: "Medium - youthful charm"
  },
  Jupiter: {
    breastType: ["Bell", "Teardrop", "Round"],
    lingamType: ["Thick", "Large", "Healthy"],
    beautyIndicators: ["Chubby cheeks", "Big-hearted appearance", "Pious looks", "Dignified bearing"],
    size: "Tall and Strong",
    attractiveness: "High if well placed - benevolent beauty"
  },
  Venus: {
    breastType: ["Round", "Tear Drop", "Perfectly proportioned"],
    lingamType: ["Beautiful", "Sensitive", "Symmetric"],
    beautyIndicators: ["Perfect symmetry", "Beautiful features", "Charming smile", "Graceful posture"],
    size: "Average to Tall",
    attractiveness: "Very High - classic beauty"
  },
  Saturn: {
    breastType: ["Slender", "Relaxed", "Lean"],
    lingamType: ["Lean", "Long", "Mature"],
    beautyIndicators: ["Mature looks", "Dignified appearance", "Older but elegant", "Serious charm"],
    size: "Average and Slim",
    attractiveness: "Mature charm - elegance over youth"
  },
  Rahu: {
    breastType: ["Teardrop", "Bell", "Asymmetric", "East West"],
    lingamType: ["Unconventional", "Foreign-type", "Striking"],
    beautyIndicators: ["Abnormally striking", "Unusual features", "Exotic appearance", "Foreign look"],
    size: "Variable - unusual proportions",
    attractiveness: "Unconventional - exotic appeal"
  },
  Ketu: {
    breastType: ["Relaxed", "Athletic", "Long and lean"],
    lingamType: ["Detached appearance", "Minimal", "Hidden"],
    beautyIndicators: ["Simple appearance", "Spiritual aura", "Piercing eyes", "Minimal style"],
    size: "Small",
    attractiveness: "Low if malefic - spiritual over physical"
  },
  Neptune: {
    breastType: ["Soft", "Round", "Undefined"],
    lingamType: ["Dreamy", "Flowing", "Undefined"],
    beautyIndicators: ["Dreamy eyes", "Mystical look", "Changing appearance", "Elusive beauty"],
    size: "Variable",
    attractiveness: "High - ethereal beauty"
  },
  Uranus: {
    breastType: ["Variable", "Unique shape"],
    lingamType: ["Electric", "Unique", "Sudden"],
    beautyIndicators: ["Unique style", "Electric eyes", "Unconventional beauty", "Striking features"],
    size: "Athletic/Lean",
    attractiveness: "High - magnetic appeal"
  },
  Pluto: {
    breastType: ["Firm", "Voluptuous"],
    lingamType: ["Intense", "Magnetic", "Powerful"],
    beautyIndicators: ["Intense gaze", "Dark features", "Mysterious aura", "Magnetic appeal"],
    size: "Compact/Strong",
    attractiveness: "Very High - sultry intensity"
  }
};

// Knowledge Base: Varna System
const varnaSystem: Record<string, { signs: string[]; element: string; temperament: string; strengths: string[]; weaknesses: string[]; idealMatch: string[] }> = {
  Brahmin: {
    signs: ["Cancer", "Scorpio", "Pisces"],
    element: "Water",
    temperament: "Visionary, understands cause-effect",
    strengths: ["Insightful", "Spiritual", "Intuitive", "Wise"],
    weaknesses: ["Impulsive about emotions", "Can be escapist"],
    idealMatch: ["Brahmin", "Shudra"]
  },
  Kshatriya: {
    signs: ["Aries", "Leo", "Sagittarius"],
    element: "Fire",
    temperament: "Bold, honest, valorous, protective",
    strengths: ["Courageous", "Defender", "Action-oriented", "Honest"],
    weaknesses: ["Quick to anger", "Can be domineering"],
    idealMatch: ["Kshatriya", "Vaishya"]
  },
  Vaishya: {
    signs: ["Taurus", "Virgo", "Capricorn"],
    element: "Earth",
    temperament: "Evaluates efficiency, enterprising",
    strengths: ["Practical", "Business-minded", "Efficient", "Reliable"],
    weaknesses: ["May overlook ethics for profit", "Materialistic"],
    idealMatch: ["Vaishya", "Kshatriya"]
  },
  Shudra: {
    signs: ["Gemini", "Libra", "Aquarius"],
    element: "Air",
    temperament: "Follower mindset, dedicated to social values",
    strengths: ["Supportive", "Adaptable", "Service-oriented", "Social"],
    weaknesses: ["Follows without questioning", "Can be indecisive"],
    idealMatch: ["Shudra", "Brahmin"]
  }
};

// Knowledge Base: Vashya Groups
const vashyaGroups: Record<string, { signs: string[]; meaning: string; controls: string[]; controlledBy: string[] }> = {
  Dwipad: {
    signs: ["Gemini", "Virgo", "Libra", "Sagittarius", "Aquarius"],
    meaning: "Two legged or Human",
    controls: ["All except Leo"],
    controlledBy: ["Vanchar (Leo)"]
  },
  Chatushpad: {
    signs: ["Aries", "Taurus", "Capricorn"],
    meaning: "Four legged or Quadrupeds",
    controls: ["Jalachar"],
    controlledBy: ["Dwipad"]
  },
  Jalachar: {
    signs: ["Cancer", "Pisces"],
    meaning: "Water creatures",
    controls: [],
    controlledBy: ["Dwipad", "Chatushpad", "Vanchar", "Keet"]
  },
  Vanchar: {
    signs: ["Leo"],
    meaning: "Wild animal",
    controls: ["All except Jalachar"],
    controlledBy: []
  },
  Keet: {
    signs: ["Scorpio"],
    meaning: "Insect",
    controls: ["All except Leo and Dwipad"],
    controlledBy: []
  }
};

// Get Varna from sign
const getVarnaFromSign = (sign: string): string => {
  for (const [varna, data] of Object.entries(varnaSystem)) {
    if (data.signs.includes(sign)) return varna;
  }
  return "Unknown";
};

// Get Vashya from sign
const getVashyaFromSign = (sign: string): string => {
  for (const [vashya, data] of Object.entries(vashyaGroups)) {
    if (data.signs.includes(sign)) return vashya;
  }
  return "Unknown";
};

export const SpousePredictionWidget: React.FC<SpousePredictionWidgetProps> = ({
  prediction,
  partnerPrediction,
  gender: _gender,
  partnerGender,
  inLawAnalysis,
  partnerInLawAnalysis,
  userName,
  partnerName
}) => {
  const [activeProfile, setActiveProfile] = React.useState<'primary' | 'partner'>('primary');
  const [showSensitive, setShowSensitive] = React.useState(false);
  const { loading, insight, error, triggerAnalysis } = useGeminiInsight();

  // Compute effective gender based on active profile toggle
  const effectiveGender = activeProfile === 'partner' && partnerGender ? partnerGender : _gender;

  const currentInLawAnalysis = activeProfile === 'primary' ? inLawAnalysis : partnerInLawAnalysis;
  const currentPrediction = activeProfile === 'primary' ? prediction : partnerPrediction;

  const activePrediction = currentPrediction || prediction || partnerPrediction;

  if (!activePrediction || !activePrediction.seventhHouse) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center transition-colors">
        <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4 transition-colors" />
        <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100 transition-colors">Spouse Analysis</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md transition-colors">Spouse prediction details are currently being calculated or are unavailable for this profile.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          Refresh Report
        </button>
      </div>
    );
  }

  const { seventhHouse, darakaraka, navamsaSeventh, upapadaLagna, predictions, profileName, physique, profession, advancedAnalysis } = activePrediction;

  // Get varna and vashya for 7th house
  const seventhHouseVarna = getVarnaFromSign(seventhHouse.sign);
  const seventhHouseVashya = getVashyaFromSign(seventhHouse.sign);
  const varnaData = varnaSystem[seventhHouseVarna];
  const vashyaData = vashyaGroups[seventhHouseVashya];

  const getPlanetIcon = (planet: string) => {
    switch (planet) {
      case 'Sun':
        return <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Su</div>;
      case 'Moon':
        return <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-xs font-bold">Mo</div>;
      case 'Mars':
        return <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Ma</div>;
      case 'Mercury':
        return <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Me</div>;
      case 'Jupiter':
        return <div className="w-8 h-8 bg-yellow-700 rounded-full flex items-center justify-center text-white text-xs font-bold">Ju</div>;
      case 'Venus':
        return <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Ve</div>;
      case 'Saturn':
        return <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">Sa</div>;
      default:
        return <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{planet?.charAt(0)}</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-2xl shadow-lg p-8 text-white transition-colors overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Crown className="w-32 h-32 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Crown className="w-8 h-8" />
              {profileName}'s Spouse Characteristics
            </h2>
            <p className="opacity-90">
              Based on 7th house, Darakaraka, and Navamsa analysis
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {prediction && partnerPrediction && (
              <div className="flex bg-white/20 dark:bg-black/20 p-1 rounded-xl backdrop-blur-sm self-start md:self-center transition-colors">
                <button
                  onClick={() => setActiveProfile('primary')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeProfile === 'primary'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-white hover:bg-white/10'
                    } `}
                >
                  {userName || prediction.profileName || 'Your'}
                </button>
                <button
                  onClick={() => setActiveProfile('partner')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeProfile === 'partner'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-white hover:bg-white/10'
                    } `}
                >
                  {partnerName || partnerPrediction.profileName || 'Partner'}
                </button>
              </div>
            )}

            <button
              onClick={() => setShowSensitive(!showSensitive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${showSensitive
                ? 'bg-red-500 text-white shadow-inner'
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                } `}
              title={showSensitive ? 'Hide Sensitive Anatomical Details' : 'Show Sensitive Anatomical Details'}
            >
              {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showSensitive ? 'Sensitive: ON' : 'Show Detail'}
            </button>
          </div>
        </div>
      </div>

      {/* AI Spouse Visualization */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Heart className="w-32 h-32 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                Visualize Future Spouse
              </h3>
              <p className="text-pink-100 text-sm mt-1">
                Let "The Matchmaker" AI synthesize 7th House, Lord, and Darakaraka into a vivid profile.
              </p>
            </div>
            <button
              onClick={() => triggerAnalysis('SPOUSE_PROFILE', {
                seventhSign: seventhHouse.sign,
                seventhLord: `${seventhHouse.lord} in 7th House`, // Simplified context
                darakaraka: `${darakaraka.planet} in ${darakaraka.sign} `,
                venus: 'Venus data not available in context' // Fallback
              })}
              disabled={loading}
              className="px-5 py-2 bg-white text-pink-600 rounded-lg font-bold shadow-lg hover:bg-pink-50 transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {insight ? 'Visualize Again' : 'Create AI Profile'}
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

      {/* Main Prediction Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Seventh House Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-pink-500 dark:text-pink-400" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors">7th House Analysis</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg transition-colors">
              <span className="text-sm text-pink-600 dark:text-pink-400 font-medium transition-colors">Sign:</span>
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors">{seventhHouse.sign}</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors">
              <span className="text-sm text-purple-600 dark:text-purple-400 font-medium transition-colors">Lord:</span>
              {getPlanetIcon(seventhHouse.lord)}
              <span className="font-semibold text-gray-800 dark:text-gray-100 transition-colors">{seventhHouse.lord}</span>
            </div>

            {seventhHouse.planets.length > 0 && (
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg transition-colors">
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium block mb-2 transition-colors">Planets in 7th:</span>
                <div className="flex flex-wrap gap-2">
                  {seventhHouse.planets.map((planet, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      {getPlanetIcon(planet)}
                      <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">{planet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Varna & Vashya Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30 transition-colors">
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium block mb-1 transition-colors">Element</span>
                <span className="text-lg font-bold text-amber-800 dark:text-amber-200 transition-colors">{seventhHouse.element || varnaData.element}</span>
                <span className="text-xs text-amber-600 dark:text-amber-400 block mt-1 transition-colors">Dominant Quality</span>
              </div>
              <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-100 dark:border-teal-800/30 transition-colors">
                <span className="text-xs text-teal-600 dark:text-teal-400 font-medium block mb-1 transition-colors">Varna (Class)</span>
                <span className="text-lg font-bold text-teal-800 dark:text-teal-200 transition-colors">{seventhHouseVarna}</span>
                <span className="text-xs text-teal-600 dark:text-teal-400 block mt-1 transition-colors">{varnaData.temperament.split(',')[0]}</span>
              </div>
            </div>

            {/* 7th Lord Analysis (D1 & D9) */}
            {seventhHouse.seventhLordDetails && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors flex items-center gap-2">
                  <Crown className="w-4 h-4 text-purple-500" />
                  7th Lord {seventhHouse.lord} Analysis
                </h4>
                <div className="space-y-2">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/10 rounded border border-purple-100 dark:border-purple-800/30">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 block">Rashi (D1) Placement</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{seventhHouse.seventhLordDetails.d1.description}</span>
                  </div>
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/10 rounded border border-indigo-100 dark:border-indigo-800/30">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block">Navamsa (D9) Placement</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{seventhHouse.seventhLordDetails.d9.description}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 transition-colors">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors">Spouse Nature</h4>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">{seventhHouse.spouseNature}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors">Physical Appearance</h4>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">{seventhHouse.spouseAppearance}</p>
            </div>
          </div>
        </div>

        {/* Darakaraka Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Darakaraka (Soul Significator)</h3>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex flex-col items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl transition-colors">
              {getPlanetIcon(darakaraka.planet)}
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-2 transition-colors">{darakaraka.planet}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Darakaraka</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg transition-colors">
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Position:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 transition-colors">{darakaraka.sign} (House {darakaraka.house})</span>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 transition-colors">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors">Characteristics</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-3 transition-colors">{darakaraka.spouseCharacteristics}</p>

              {seventhHousePlanetInterpretations[darakaraka.planet] && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-800/30 mt-3 transition-colors">
                  <p className="text-sm text-gray-800 dark:text-gray-200 mb-2 transition-colors">
                    <strong>Soulmate Nature:</strong> {seventhHousePlanetInterpretations[darakaraka.planet].nature}
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 transition-colors">
                    <strong>Physical Traits:</strong> {seventhHousePlanetInterpretations[darakaraka.planet].appearance}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Traits Grid */}
      {seventhHouse.spouseTraits.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
            <Sparkles className="w-6 h-6 text-purple-500 dark:text-purple-400" />
            Key Spouse Traits
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {seventhHouse.spouseTraits.map((trait, idx) => (
              <div key={idx} className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full transition-colors"></div>
                <span className="text-gray-800 dark:text-gray-200 transition-colors">{trait}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spouse Physical Attributes Section */}
      {physique && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
            <User className="w-6 h-6 text-pink-500 dark:text-pink-400" />
            Spouse Physical Attributes
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                Calculated based on the 7th House sign, its Lord, and planets in the 7th house in both Rashi (D1) and Navamsa (D9) charts, as per standard Vedic Astrological principles (BPHS).
              </TooltipContent>
            </Tooltip>
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg transition-colors">
                <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Height</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize transition-colors">{physique.height}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg transition-colors">
                <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Build</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize transition-colors">{physique.build}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg transition-colors">
                <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Complexion</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 transition-colors">{physique.complexion}</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Notable Features</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {physique.notableFeatures.map((feature: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300 transition-colors">
                    {feature}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded text-center border border-gray-100 dark:border-gray-700 transition-colors">
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">Eye Color</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors">{physique.eyeColor}</span>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded text-center border border-gray-100 dark:border-gray-700 transition-colors">
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">Hair Type</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors">{physique.hairType}</span>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded text-center border border-gray-100 dark:border-gray-700 transition-colors">
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">Face Shape</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors">{physique.faceShape}</span>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-900/50 rounded text-center border border-gray-100 dark:border-gray-700 transition-colors">
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">Skin Texture</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors">{physique.skinTexture}</span>
                </div>
              </div>

              {/* Enhanced Attributes */}
              {(physique.gait || physique.voice || physique.fashionStyle || physique.breastInfo) && (
                <div className="md:col-span-2 pt-4 border-t border-pink-100 dark:border-pink-900/30 mt-4 transition-colors">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {physique.gait && (
                      <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/10 rounded-lg transition-colors">
                        <Footprints className="w-4 h-4 text-pink-500 dark:text-pink-400 mx-auto mb-1 transition-colors" />
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">Walking Style</span>
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200 transition-colors">{physique.gait}</span>
                      </div>
                    )}
                    {physique.voice && (
                      <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/10 rounded-lg transition-colors">
                        <Music className="w-4 h-4 text-pink-500 dark:text-pink-400 mx-auto mb-1 transition-colors" />
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">Voice Quality</span>
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200 transition-colors">{physique.voice}</span>
                      </div>
                    )}
                    {physique.fashionStyle && (
                      <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/10 rounded-lg transition-colors">
                        <Shirt className="w-4 h-4 text-pink-500 dark:text-pink-400 mx-auto mb-1 transition-colors" />
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">Fashion Sense</span>
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200 transition-colors">{physique.fashionStyle}</span>
                      </div>
                    )}
                    {physique.breastInfo && showSensitive && (
                      <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/10 rounded-lg border border-pink-100 dark:border-pink-800/30 transition-colors">
                        <Sparkles className="w-4 h-4 text-pink-500 dark:text-pink-400 mx-auto mb-1 transition-colors" />
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1 transition-colors">Anatomical Detail</span>
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200 transition-colors">{physique.breastInfo}</span>
                      </div>
                    )}
                    {physique.breastInfo && !showSensitive && (
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 transition-colors">
                        <EyeOff className="w-4 h-4 text-gray-400 dark:text-gray-500 mx-auto mb-1 transition-colors" />
                        <span className="block text-xs text-gray-400 dark:text-gray-500 transition-colors">Hidden Detail</span>
                        <button
                          onClick={() => setShowSensitive(true)}
                          className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
                        >
                          Reveal
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spouse Profession Section */}
      {profession && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
            <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Spouse Career & Profession
          </h3>
          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 transition-colors">{profession.field}</h4>
                <span className="inline-block px-3 py-1 mt-2 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs font-bold rounded-full uppercase tracking-wide transition-colors">
                  {profession.careerNature}
                </span>
              </div>
              <div className="flex -space-x-2">
                {profession.relatedPlanets.map((p: any, i: number) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-md relative z-10 transition-colors" title={p}>
                    {getPlanetIcon(p)}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/60 dark:bg-black/20 p-4 rounded-lg backdrop-blur-sm transition-colors">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed transition-colors">
                {profession.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Analysis Section */}
      {advancedAnalysis && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Advanced Insights (Deep Analysis)
          </h3>

          <div className="space-y-4">
            {/* Gender Specific */}
            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800/30 transition-colors">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2 transition-colors">
                <User className="w-4 h-4" />
                Gender Perspective
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed transition-colors">{advancedAnalysis.genderAnalysis}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* UP & D9 */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30 transition-colors">
                <h5 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2 text-sm flex items-center gap-2 transition-colors">
                  <Heart className="w-4 h-4" />
                  Upapada Lagna (Family Origin)
                </h5>
                <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed transition-colors">{advancedAnalysis.complexRules.upapada}</p>
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/30 transition-colors">
                <h5 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2 text-sm flex items-center gap-2 transition-colors">
                  <Star className="w-4 h-4" />
                  Navamsa (D9) Inner Reality
                </h5>
                <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed transition-colors">{advancedAnalysis.complexRules.navamsa7th}</p>
              </div>
            </div>

            {/* DK D9 */}
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/30 transition-colors">
              <h5 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 text-sm flex items-center gap-2 transition-colors">
                <Sparkles className="w-4 h-4" />
                Darakaraka Soul Connection
              </h5>
              <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed transition-colors">{advancedAnalysis.complexRules.darakarakaD9}</p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed 7th House Planet Interpretations */}
      {seventhHouse.planets.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
            <Star className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            Planet Influences on Spouse
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors">
            Planets in the 7th house significantly influence your spouse's personality, behavior, and relationship dynamics.
          </p>

          <div className="space-y-4">
            {seventhHouse.planets.map((planet, idx) => {
              const interpretation = seventhHousePlanetInterpretations[planet];
              if (!interpretation) return null;

              return (
                <div key={idx} className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-100 dark:border-amber-800/30 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    {getPlanetIcon(planet)}
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 transition-colors">{planet} in 7th House</h4>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 transition-colors">Key Qualities</h5>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {interpretation.qualities.map((quality, qIdx) => (
                          <span key={qIdx} className="px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 transition-colors">
                            {quality}
                          </span>
                        ))}
                      </div>
                      <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-1 transition-colors">Nature</h5>
                      <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">{interpretation.nature}</p>
                    </div>

                    <div>
                      <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 transition-colors">Physical Appearance</h5>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 transition-colors">{interpretation.appearance}</p>
                      <div className="p-3 bg-amber-100/50 dark:bg-amber-900/30 rounded-lg transition-colors">
                        <h5 className="font-semibold text-amber-800 dark:text-amber-200 text-sm mb-1 transition-colors">Compatibility Tip</h5>
                        <p className="text-xs text-amber-900 dark:text-amber-300 transition-colors">{interpretation.bestMatch}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Varna System Details */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
          <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Varna System - Spiritual Compatibility
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors">
          Varna represents spiritual temperament and life approach. The 7th house sign of <strong>{seventhHouse.sign}</strong> indicates a <strong>{seventhHouseVarna}</strong> varna spouse.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl transition-colors">
            <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2 transition-colors">
              <span className="text-2xl">{seventhHouseVarna}</span>
              <span className="text-sm font-normal text-purple-600 dark:text-purple-400">({varnaData.element} Element)</span>
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 transition-colors"><strong>Temperament:</strong> {varnaData.temperament}</p>

            <div className="mb-3">
              <h5 className="font-semibold text-purple-700 dark:text-purple-300 text-sm mb-1 transition-colors">Strengths</h5>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 transition-colors">
                {varnaData.strengths.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-purple-700 dark:text-purple-300 text-sm mb-1 transition-colors">Challenges</h5>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 transition-colors">
                {varnaData.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-amber-500">!</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl transition-colors">
            <h4 className="font-bold text-indigo-800 dark:text-indigo-200 mb-3 transition-colors">Ideal Varna Matches</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 transition-colors">
              For optimal spiritual compatibility, {seventhHouseVarna} varna matches best with:
            </p>
            <div className="flex flex-wrap gap-2">
              {varnaData.idealMatch.map((match, i) => (
                <span key={i} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 transition-colors">
                  {match}
                </span>
              ))}
            </div>
            <div className="mt-4 p-3 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-lg transition-colors">
              <p className="text-xs text-indigo-800 dark:text-indigo-300 transition-colors">
                <Info className="w-3 h-3 inline mr-1" />
                Traditional matching favors the groom having equal or higher varna than the bride for harmonious dynamics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vashya Groups */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
          <User className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          Vashya - Mental Compatibility
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors">
          Vashya indicates mental nature and approach to relationships. {seventhHouse.sign} ({seventhHouseVashya}) shows how your spouse thinks and relates.
        </p>

        <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl mb-4 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xl font-bold text-teal-800 dark:text-teal-200 transition-colors">{seventhHouseVashya}</h4>
            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50 transition-colors">
              {vashyaData.meaning}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-teal-700 dark:text-teal-300 text-sm mb-2 transition-colors">Controls</h5>
              <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
                {vashyaData.controls.length > 0
                  ? vashyaData.controls.join(", ")
                  : "Controlled by others"
                }
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-teal-700 dark:text-teal-300 text-sm mb-2 transition-colors">Controlled By</h5>
              <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
                {vashyaData.controlledBy.length > 0
                  ? vashyaData.controlledBy.join(", ")
                  : "Controls others"
                }
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-teal-100/30 dark:bg-teal-900/10 rounded-lg transition-colors">
          <p className="text-sm text-teal-800 dark:text-teal-200 transition-colors">
            <strong>Mental Dynamic:</strong> This indicates {vashyaData.meaning.toLowerCase()} energy.
            {seventhHouseVashya === "Dwipad" && " Your spouse values intellectual connection and human relationships."}
            {seventhHouseVashya === "Chatushpad" && " Your spouse is practical, grounded, and values stability."}
            {seventhHouseVashya === "Jalachar" && " Your spouse is emotional, intuitive, and flows with circumstances."}
            {seventhHouseVashya === "Vanchar" && " Your spouse is independent, proud, and needs respect."}
            {seventhHouseVashya === "Keet" && " Your spouse is intense, transformative, and penetrates beneath the surface."}
          </p>
        </div>
      </div>

      {/* In-Law Analysis Section */}
      {currentInLawAnalysis && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 transition-colors">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
            <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            Family & In-Law Dynamics ({activeProfile === 'primary' ? 'Your In-Laws' : "Partner's In-Laws"})
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg transition-colors">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium transition-colors">Family Harmony (2nd House)</span>
                <span className={`px-2 py-1 rounded text-xs font-bold transition-colors ${currentInLawAnalysis.secondHouseScore > 50 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'} `}>
                  {currentInLawAnalysis.secondHouseScore > 50 ? 'Harmonious' : 'Challenging'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium transition-colors">Career-Family Balance (10th House)</span>
                <span className={`px-2 py-1 rounded text-xs font-bold transition-colors ${currentInLawAnalysis.tenthHouseScore > 50 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'} `}>
                  {currentInLawAnalysis.tenthHouseScore > 50 ? 'Good' : 'Needs Balance'}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl transition-colors">
              <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Overall Verdict</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 transition-colors">
                {currentInLawAnalysis.interpretation}
              </p>
              {currentInLawAnalysis.recommendations && currentInLawAnalysis.recommendations.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-700 dark:text-gray-200 text-xs mb-1 uppercase tracking-wider transition-colors">Recommendations</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 transition-colors">
                    {currentInLawAnalysis.recommendations.map((rec: string, idx: number) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navamsa Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
          <User className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
          Navamsa (D9) Marriage Quality
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl transition-colors">
            <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium block mb-1 transition-colors">7th House Sign</span>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{navamsaSeventh.sign}</span>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-colors">
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium block mb-1 transition-colors">Marriage Quality</span>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{navamsaSeventh.marriageQuality}</span>
          </div>

          <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl transition-colors">
            <span className="text-sm text-teal-600 dark:text-teal-400 font-medium block mb-1 transition-colors">Upapada Lagna</span>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors">{upapadaLagna.sign}</span>
          </div>
        </div>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-800/30 transition-colors">
            <h5 className="font-semibold text-indigo-800 dark:text-indigo-200 text-sm mb-1 transition-colors">Navamsa 7th Interpretation</h5>
            <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
              {navamsaSeventh.sign} here suggests a {navamsaSeventh.sign === 'Aries' || navamsaSeventh.sign === 'Scorpio' ? 'passionate and intense' :
                navamsaSeventh.sign === 'Taurus' || navamsaSeventh.sign === 'Libra' ? 'harmonious and romantic' :
                  navamsaSeventh.sign === 'Gemini' || navamsaSeventh.sign === 'Virgo' ? 'intellectual (friend-like)' :
                    navamsaSeventh.sign === 'Cancer' ? 'nurturing and emotional' :
                      navamsaSeventh.sign === 'Leo' ? 'proud and loyal' :
                        navamsaSeventh.sign === 'Sagittarius' || navamsaSeventh.sign === 'Pisces' ? 'spiritual and wise' :
                          'stable and responsible'} undertone to the marriage.
            </p>
          </div>
          <div className="p-3 bg-teal-50/50 dark:bg-teal-900/10 rounded-lg border border-teal-100 dark:border-teal-800/30 transition-colors">
            <h5 className="font-semibold text-teal-800 dark:text-teal-200 text-sm mb-1 transition-colors">Upapada Lagna (UL)</h5>
            <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
              The UL in {upapadaLagna.sign} indicates the implementation of marriage. Your spouse is likely to come from a background or possess qualities associated with {upapadaLagna.sign}.
            </p>
          </div>
        </div>

        {navamsaSeventh.planets.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl transition-colors">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium block mb-2 transition-colors">Planets in D9 7th House:</span>
            <div className="flex flex-wrap gap-2">
              {navamsaSeventh.planets.map((planet, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm transition-colors">
                  {getPlanetIcon(planet)}
                  <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">{planet}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navamsa Planet Appearance Influences */}
      {(() => {
        const d9Planets = navamsaSeventh.planets.length > 0
          ? navamsaSeventh.planets
          : (seventhHouse.lord ? [seventhHouse.lord] : []);
        const hasD9Planets = navamsaSeventh.planets.length > 0;

        return d9Planets.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
              <Sparkles className="w-6 h-6 text-pink-500 dark:text-pink-400" />
              Physical Appearance Indicators (D9)
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors">
              {hasD9Planets
                ? 'Planets in the Navamsa 7th house provide detailed insights into spouse\'s physical characteristics and attractiveness.'
                : `No planets in D9 7th house. Showing appearance indicators based on the 7th Lord (${seventhHouse.lord}).`}
            </p>

            <div className="space-y-4">
              {d9Planets.map((planet, idx) => {
                const appearance = navamsaPlanetAppearance[planet];
                if (!appearance) return null;

                return (
                  <div key={idx} className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 rounded-xl border border-pink-100 dark:border-pink-800/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      {getPlanetIcon(planet)}
                      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 transition-colors">
                        {hasD9Planets ? `${planet} in D9 7th House` : `${planet} (7th Lord Influence)`}
                      </h4>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-pink-800 dark:text-pink-200 mb-2 transition-colors">
                          {effectiveGender === 'male' ? 'Spouse Anatomical Traits (Female)' : 'Spouse Anatomical Traits (Male)'}
                        </h5>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(effectiveGender === 'male' ? appearance.breastType : appearance.lingamType).map((type, tIdx) => (
                            <span key={tIdx} className={`px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/50 transition-colors ${!showSensitive ? 'blur-[3px] select-none opacity-50' : ''}`}>
                              {showSensitive ? type : 'Hidden Detail'}
                            </span>
                          ))}
                        </div>
                        {effectiveGender === 'male' ? (
                          <p className="text-xs text-pink-600 dark:text-pink-400 italic mb-2 transition-colors">Breast types influenced by {planet}</p>
                        ) : (
                          <p className="text-xs text-pink-600 dark:text-pink-400 italic mb-2 transition-colors">Penis/Lingam types influenced by {planet}</p>
                        )}
                        {!showSensitive && (
                          <button
                            onClick={() => setShowSensitive(true)}
                            className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline mb-2 block transition-colors"
                          >
                            Reveal Anatomical Indicators
                          </button>
                        )}
                        <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors"><strong>Predicted Size:</strong> {appearance.size}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-pink-800 dark:text-pink-200 mb-2 transition-colors">Beauty Characteristics</h5>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-3 transition-colors">
                          {appearance.beautyIndicators.map((indicator, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="text-pink-400">•</span> {indicator}
                            </li>
                          ))}
                        </ul>
                        <div className="p-2 bg-pink-100/50 dark:bg-pink-900/30 rounded-lg transition-colors">
                          <p className="text-xs text-pink-800 dark:text-pink-200 transition-colors"><strong>Attractiveness:</strong> {appearance.attractiveness}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;
      })()}

      {/* How Will You Meet Your Spouse? */}
      {activePrediction?.meetingPrediction && (() => {
        const mp = activePrediction.meetingPrediction!;
        const dirConfColor = mp.direction.confidence === 'high' ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' : mp.direction.confidence === 'medium' ? 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30' : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
        const distLevels = ['very_near', 'near', 'nearby', 'hometown', 'same_region', 'moderate', 'familiar', 'unpredictable', 'far', 'career_linked', 'social_network', 'very_far'];
        const distIndex = distLevels.indexOf(mp.distance.level);
        const distPercent = Math.round(((distIndex + 1) / distLevels.length) * 100);
        const mtColor = mp.marriageType.type === 'love' ? 'from-pink-500 to-rose-500' : mp.marriageType.type === 'arranged' ? 'from-amber-500 to-orange-500' : 'from-purple-500 to-indigo-500';
        const mtIcon = mp.marriageType.type === 'love' ? '💕' : mp.marriageType.type === 'arranged' ? '🤝' : '✨';

        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors border border-indigo-100 dark:border-indigo-800/30">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2 transition-colors">
              <Compass className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              How Will You Meet Your Spouse?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 transition-colors">
              Multi-system analysis using D1, D9, KP & Jaimini to predict direction, distance, and meeting circumstances.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Direction Card */}
              <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10 rounded-xl border border-sky-100 dark:border-sky-800/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sky-800 dark:text-sky-200 flex items-center gap-2 transition-colors">
                    <Navigation className="w-5 h-5" />
                    Spouse Direction
                  </h4>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${dirConfColor} transition-colors`}>{mp.direction.confidence.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full border-2 border-sky-200 dark:border-sky-700 flex items-center justify-center bg-white dark:bg-gray-900 transition-colors flex-shrink-0">
                    <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-sky-600 dark:text-sky-400">N</span>
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-sky-600 dark:text-sky-400">S</span>
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-sky-600 dark:text-sky-400">W</span>
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-sky-600 dark:text-sky-400">E</span>
                    <span className="text-lg font-black text-sky-700 dark:text-sky-300">{mp.direction.primary.slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-sky-700 dark:text-sky-300 transition-colors">{mp.direction.primary}</p>
                    {mp.direction.secondary && <p className="text-xs text-gray-500 dark:text-gray-400">Secondary: {mp.direction.secondary}</p>}
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{mp.direction.sources.length} sources analyzed</p>
                  </div>
                </div>
                {mp.direction.sources.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {mp.direction.sources.slice(0, 4).map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]">
                        <span className="text-sky-400">→</span>
                        <span className="text-gray-600 dark:text-gray-400">{s.system}:</span>
                        <span className="font-medium text-sky-700 dark:text-sky-300">{s.direction}</span>
                        <span className="text-gray-400 dark:text-gray-500">({s.basis})</span>
                      </div>
                    ))}
                    {mp.direction.sources.length > 4 && <p className="text-[10px] text-gray-400">+{mp.direction.sources.length - 4} more sources</p>}
                  </div>
                )}
              </div>

              {/* Distance Card */}
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/30 transition-colors">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2 mb-3 transition-colors">
                  <MapPin className="w-5 h-5" />
                  Spouse Distance
                </h4>
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 transition-colors">{mp.distance.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors">{mp.distance.description}</p>
                {/* Distance gauge */}
                <div className="mb-2">
                  <div className="flex justify-between text-[9px] text-gray-400 dark:text-gray-500 mb-1">
                    <span>Same Locality</span>
                    <span>Foreign Land</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500" style={{ width: `${distPercent}%` }} />
                  </div>
                </div>
                {mp.distance.foreignIndicators.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1 mb-1"><Globe className="w-3 h-3" /> Foreign Indicators</p>
                    {mp.distance.foreignIndicators.map((fi, i) => (
                      <div key={i} className="text-[11px] text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span className="font-medium">{fi.name}</span>
                        <span className="text-gray-400">—</span>
                        <span>{fi.interpretation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {/* Meeting Medium */}
              <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 rounded-xl border border-violet-100 dark:border-violet-800/30 transition-colors">
                <h4 className="font-bold text-violet-800 dark:text-violet-200 flex items-center gap-2 mb-3 transition-colors text-sm">
                  <Users2 className="w-5 h-5" />
                  Meeting Medium
                </h4>
                <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-1 transition-colors">{mp.meetingMedium.through}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{mp.meetingMedium.primary}</p>
                <div className="p-2 bg-white/60 dark:bg-gray-900/40 rounded-lg transition-colors">
                  <p className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 mb-1">🌐 Modern Context</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{mp.meetingMedium.modernInterpretation}</p>
                </div>
                {mp.meetingMedium.alternatives.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {mp.meetingMedium.alternatives.slice(0, 3).map((alt, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full transition-colors">{alt}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Circumstances */}
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-100 dark:border-amber-800/30 transition-colors">
                <h4 className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-2 mb-3 transition-colors text-sm">
                  <Sparkles className="w-5 h-5" />
                  Meeting Circumstances
                </h4>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1 transition-colors">{mp.circumstances.setting}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-2">Atmosphere: {mp.circumstances.atmosphere}</p>
                <div className="space-y-1">
                  {mp.circumstances.examples.map((ex, i) => (
                    <div key={i} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <ArrowRight className="w-3 h-3 text-amber-400" /> {ex}
                    </div>
                  ))}
                </div>
                {mp.circumstances.nakshatraFlavor && (
                  <div className="mt-2 p-2 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg">
                    <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">⭐ Nakshatra Energy: {mp.circumstances.nakshatraEnergy}</p>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">{mp.circumstances.nakshatraFlavor}</p>
                  </div>
                )}
              </div>

              {/* Marriage Type */}
              <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/10 dark:to-pink-900/10 rounded-xl border border-rose-100 dark:border-rose-800/30 transition-colors">
                <h4 className="font-bold text-rose-800 dark:text-rose-200 flex items-center gap-2 mb-3 transition-colors text-sm">
                  <Heart className="w-5 h-5" />
                  Marriage Type
                </h4>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-bold bg-gradient-to-r ${mtColor} mb-2`}>
                  <span>{mtIcon}</span>
                  <span>{mp.marriageType.type === 'love' ? 'Love Marriage' : mp.marriageType.type === 'arranged' ? 'Arranged Marriage' : 'Mixed / Hybrid'}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 transition-colors">{mp.marriageType.description}</p>
                <div className="space-y-1">
                  {mp.marriageType.yogas.filter(y => y.present).map((y, i) => (
                    <div key={i} className="flex items-start gap-1 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{y.name}</span>
                    </div>
                  ))}
                  {mp.marriageType.yogas.filter(y => !y.present).slice(0, 2).map((y, i) => (
                    <div key={i} className="flex items-start gap-1 text-[11px]">
                      <XCircle className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-400 dark:text-gray-500">{y.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Spouse Attraction */}
            {mp.spouseAttraction && (
              <div className="p-4 bg-gradient-to-r from-pink-50 via-fuchsia-50 to-purple-50 dark:from-pink-900/10 dark:via-fuchsia-900/10 dark:to-purple-900/10 rounded-xl border border-pink-100 dark:border-pink-800/30 transition-colors">
                <h4 className="font-bold text-pink-800 dark:text-pink-200 flex items-center gap-2 mb-3 transition-colors text-sm">
                  <Star className="w-5 h-5" />
                  What Attracts Your {effectiveGender === 'female' ? 'Husband' : 'Wife'} To You?
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{mp.spouseAttraction.genderSpecific}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                  {mp.spouseAttraction.qualities.map((q, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-900/40 rounded-lg transition-colors">
                      <span className="text-sm">{q.icon}</span>
                      <div>
                        <p className="text-[11px] font-semibold text-pink-700 dark:text-pink-300">{q.trait}</p>
                        <p className="text-[9px] text-gray-400 dark:text-gray-500">{q.source}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                    <span className="text-gray-500 dark:text-gray-400">Physical: <span className="text-gray-700 dark:text-gray-300 font-medium">{mp.spouseAttraction.physicalAttraction}</span></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span className="text-gray-500 dark:text-gray-400">Emotional: <span className="text-gray-700 dark:text-gray-300 font-medium">{mp.spouseAttraction.emotionalAttraction}</span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Marriage Happiness Score */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl shadow-lg p-6 border border-green-100 dark:border-green-800/30 transition-colors overflow-hidden">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
          <Smile className="w-6 h-6 text-green-600 dark:text-green-400" />
          Marriage Happiness Indicators
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2 transition-colors">
              <Award className="w-5 h-5" />
              Positive Indicators Present
            </h4>
            <ul className="space-y-2">
              {seventhHouse.planets.some(p => ["Jupiter", "Venus", "Moon", "Mercury"].includes(p)) && (
                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="text-green-500">✓</span>
                  <span>Benefic planets in 7th house indicate harmonious marriage</span>
                </li>
              )}
              {seventhHouse.planets.length === 0 && (
                <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 transition-colors">
                  <span className="text-green-500">✓</span>
                  <span>Unoccupied 7th house allows natural expression of sign qualities</span>
                </li>
              )}
              <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 transition-colors">
                <span className="text-green-500">✓</span>
                <span>7th Lord {seventhHouse.lord} placement indicates relationship foundation</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 transition-colors">
                <span className="text-green-500">✓</span>
                <span>Darakaraka {darakaraka.planet} reveals soulmate connection</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 transition-colors">
                <span className="text-green-500">✓</span>
                <span>Navamsa 7th in {navamsaSeventh.sign} shows {navamsaSeventh.marriageQuality.toLowerCase()} potential</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 transition-colors">
                <span className="text-green-500">✓</span>
                <span>{seventhHouseVarna} varna brings {varnaData.temperament.toLowerCase().split(',')[0]} energy</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-white dark:bg-gray-900/50 rounded-xl transition-colors">
            <h4 className="font-bold text-green-800 dark:text-green-300 mb-3 transition-colors">Success Factors</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">7th House Strength</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i <= (seventhHouse.planets.length > 0 ? 4 : 3) ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">Darakaraka Quality</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i <= (["Jupiter", "Venus", "Moon"].includes(darakaraka.planet) ? 5 : 3) ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">Navamsa Support</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i <= (navamsaSeventh.marriageQuality.toLowerCase().includes('good') || navamsaSeventh.marriageQuality.toLowerCase().includes('excellent') ? 4 : 3) ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors">Varna Harmony</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i <= 3 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-100/50 dark:bg-green-900/30 rounded-lg transition-colors">
          <p className="text-sm text-green-800 dark:text-green-200 transition-colors">
            <strong>💡 Tip:</strong> Marriage happiness comes from understanding and accepting your spouse's {seventhHouseVarna.toLowerCase()} nature
            and {vashyaData.meaning.toLowerCase()} temperament. The planets indicate tendencies, but conscious effort creates lasting happiness.
          </p>
        </div>
      </div>

      {/* Predictions List */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl shadow-lg p-6 transition-colors overflow-hidden">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
          <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Marriage Predictions
        </h3>
        <ul className="space-y-3">
          {predictions.map((prediction, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900/50 rounded-xl shadow-sm transition-colors">
              <div className="w-6 h-6 bg-purple-500 dark:bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 transition-colors">
                {idx + 1}
              </div>
              <span className="text-gray-700 dark:text-gray-300 transition-colors">{prediction}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg transition-colors">
        <p className="text-sm text-blue-700 dark:text-blue-300 transition-colors">
          <strong>Note:</strong> These predictions are based on Vedic astrological principles.
          The 7th house, Darakaraka, and Navamsa chart provide insights into spouse characteristics
          and marriage quality. However, individual free will and choices also play a significant
          role in shaping relationships.
        </p>
      </div>
    </div >
  );
};

export default SpousePredictionWidget;