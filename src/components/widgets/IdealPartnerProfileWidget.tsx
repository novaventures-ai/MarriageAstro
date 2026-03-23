import React, { useState } from 'react';
import { SelfAnalysisReport } from '../../types/selfAnalysis';
import {
  Heart, User, Briefcase, Compass, Star, MapPin, Sparkles,
  ChevronDown, ChevronUp, Gem, Eye, MessageCircle, Home
} from 'lucide-react';

interface IdealPartnerProfileWidgetProps {
  report: SelfAnalysisReport;
}

export const IdealPartnerProfileWidget: React.FC<IdealPartnerProfileWidgetProps> = ({ report }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('personality');

  const spouse = report.spousePrediction;
  const detailedProfile = report.spouseDetailedProfile;
  const chart = report.chart;
  const planets = chart?.planetaryPositions || [];

  // Derive ideal partner traits from 7th house, Venus, and spouse prediction
  const venus = planets.find((p: any) => p.planet === 'Venus');
  const seventhLord = planets.find((p: any) => {
    const h7 = chart?.houses?.find((h: any) => h.houseNumber === 7);
    return h7 && p.planet === (h7 as any).lord;
  });

  // Build personality traits from spouse prediction
  const personalityTraits: string[] = [];
  if (spouse?.seventhHouse?.spouseTraits) {
    if (Array.isArray(spouse.seventhHouse.spouseTraits)) {
      personalityTraits.push(...spouse.seventhHouse.spouseTraits.map((c: string) => c));
    }
  }
  if (detailedProfile?.personality?.keyTraits) {
    personalityTraits.push(...detailedProfile.personality.keyTraits);
  }
  const uniqueTraits = [...new Set(personalityTraits)].slice(0, 8);

  // Physical appearance from detailed profile
  const appearance = detailedProfile?.physicalAppearance;

  // Career from detailed profile or spouse prediction
  const career = detailedProfile?.career;
  const profession = spouse?.profession?.field || career?.field || '';

  // Meeting info
  const meeting = detailedProfile?.meetingCircumstances;
  const direction = meeting?.direction || spouse?.meetingPrediction?.direction?.primary || '';

  // Relationship dynamic
  const dynamic = detailedProfile?.relationshipDynamic;

  // Values from personality
  const values = detailedProfile?.personality?.valuesAndPriorities || [];

  const sections = [
    {
      key: 'personality',
      icon: <Star className="w-5 h-5" />,
      title: 'Personality & Traits',
      gradient: 'from-pink-500 to-rose-500',
      content: () => (
        <div className="space-y-4">
          {uniqueTraits.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {uniqueTraits.map((trait, i) => (
                <span key={i} className="px-3 py-1.5 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-full text-sm border border-pink-200 dark:border-pink-800/50 font-medium">
                  {trait}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Detailed personality traits require AI analysis — use the Spouse Profile AI button</p>
          )}
          {detailedProfile?.personality?.communicationStyle && (
            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-800/50">
              <p className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase">Communication Style</p>
              <p className="text-violet-800 dark:text-violet-200 text-sm mt-1">{detailedProfile.personality.communicationStyle}</p>
            </div>
          )}
          {detailedProfile?.personality?.emotionalNature && (
            <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-3 border border-rose-200 dark:border-rose-800/50">
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase">Emotional Nature</p>
              <p className="text-rose-800 dark:text-rose-200 text-sm mt-1">{detailedProfile.personality.emotionalNature}</p>
            </div>
          )}
          {values.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">Their Values</p>
              <div className="space-y-1">
                {values.map((v: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Heart className="w-3 h-3 text-pink-500 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'appearance',
      icon: <Eye className="w-5 h-5" />,
      title: 'Physical Appearance',
      gradient: 'from-amber-500 to-orange-500',
      content: () => {
        const vedicAppearance = spouse?.seventhHouse?.spouseAppearance || '';
        
        // Try to match against structured physique data first, fallback to prose string
        const isHeightAligned = appearance?.height && (
          (spouse?.physique?.height && spouse.physique.height === appearance.height) ||
          vedicAppearance.toLowerCase().includes(appearance.height.toLowerCase())
        );
        
        const isBuildAligned = appearance?.build && (
          (spouse?.physique?.build && spouse.physique.build === appearance.build) ||
          vedicAppearance.toLowerCase().includes(appearance.build.toLowerCase())
        );
        
        const isComplexionAligned = appearance?.complexion && (
          (spouse?.physique?.complexion && spouse.physique.complexion.toLowerCase() === appearance.complexion.toLowerCase()) ||
          vedicAppearance.toLowerCase().includes(appearance.complexion.toLowerCase())
        );

        // Calculate Alignment %
        const totalChecked = [appearance?.height, appearance?.build, appearance?.complexion].filter(Boolean).length;
        const matches = [isHeightAligned, isBuildAligned, isComplexionAligned].filter(Boolean).length;
        const alignmentPct = totalChecked > 0 ? Math.round((matches / totalChecked) * 100) : 100;
        const isCleanMatch = alignmentPct === 100;

        return (
          <div className="space-y-4">
            {/* Vedic Alignment Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-all ${isCleanMatch ? 'bg-green-500/10 border-green-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
              <Sparkles className={`w-4 h-4 ${isCleanMatch ? 'text-green-500' : 'text-amber-500'}`} />
              <span className={`text-xs font-semibold ${isCleanMatch ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                Astrologically Grounded: {alignmentPct}% Alignment with Vedic Logic
              </span>
            </div>

            {appearance ? (
              <div className="grid grid-cols-2 gap-3">
                {appearance.height && (
                  <div className={`rounded-lg p-3 border transition-all ${isHeightAligned ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50' : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50'}`}>
                    <div className="flex justify-between items-start">
                      <p className={`text-[10px] uppercase font-bold ${isHeightAligned ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>Height</p>
                      {isHeightAligned && <Star className="w-3 h-3 text-green-500 fill-green-500" />}
                    </div>
                    <p className={`font-bold capitalize ${isHeightAligned ? 'text-green-800 dark:text-green-100' : 'text-amber-800 dark:text-amber-200'}`}>{appearance.height}</p>
                  </div>
                )}
                {appearance.build && (
                  <div className={`rounded-lg p-3 border transition-all ${isBuildAligned ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50' : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50'}`}>
                    <div className="flex justify-between items-start">
                      <p className={`text-[10px] uppercase font-bold ${isBuildAligned ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>Build</p>
                      {isBuildAligned && <Star className="w-3 h-3 text-green-500 fill-green-500" />}
                    </div>
                    <p className={`font-bold capitalize ${isBuildAligned ? 'text-green-800 dark:text-green-100' : 'text-amber-800 dark:text-amber-200'}`}>{appearance.build}</p>
                  </div>
                )}
                {appearance.complexion && (
                  <div className={`rounded-lg p-3 border transition-all ${isComplexionAligned ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50' : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50'}`}>
                    <div className="flex justify-between items-start">
                      <p className={`text-[10px] uppercase font-bold ${isComplexionAligned ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>Complexion</p>
                      {isComplexionAligned && <Star className="w-3 h-3 text-green-500 fill-green-500" />}
                    </div>
                    <p className={`font-bold ${isComplexionAligned ? 'text-green-800 dark:text-green-100' : 'text-amber-800 dark:text-amber-200'}`}>{appearance.complexion}</p>
                  </div>
                )}
                {appearance.styleOfDressing && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800/50">
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-bold">Dress Style</p>
                    <p className="text-amber-800 dark:text-amber-200 font-medium">{appearance.styleOfDressing}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">Appearance details available via AI Spouse Profile analysis</p>
              </div>
            )}
            {appearance?.distinguishingFeatures && appearance.distinguishingFeatures.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Unique identifiers</p>
                <div className="flex flex-wrap gap-2">
                  {appearance.distinguishingFeatures.map((f: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded text-sm border border-orange-200 dark:border-orange-800/50 font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {appearance?.firstImpression && (
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800/50">
                <p className="text-xs text-orange-600 dark:text-orange-400 uppercase font-bold">First Impression</p>
                <p className="text-orange-800 dark:text-orange-200 text-sm mt-1 leading-relaxed">{appearance.firstImpression}</p>
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'career',
      icon: <Briefcase className="w-5 h-5" />,
      title: 'Career & Status',
      gradient: 'from-blue-500 to-indigo-500',
      content: () => (
        <div className="space-y-3">
          {(profession || career) ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(profession || career?.field) && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800/50">
                  <p className="text-xs text-blue-600 dark:text-blue-400 uppercase">Field</p>
                  <p className="text-blue-800 dark:text-blue-200 font-medium">{profession || career?.field}</p>
                </div>
              )}
              {career?.archetype && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800/50">
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 uppercase">Archetype</p>
                  <p className="text-indigo-800 dark:text-indigo-200 font-medium">{career.archetype}</p>
                </div>
              )}
              {career?.incomeLevel && (
                <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3 border border-sky-200 dark:border-sky-800/50">
                  <p className="text-xs text-sky-600 dark:text-sky-400 uppercase">Income Level</p>
                  <p className="text-sky-800 dark:text-sky-200 font-medium capitalize">{career.incomeLevel.replace('_', ' ')}</p>
                </div>
              )}
              {career?.ambitionLevel && (
                <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800/50">
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 uppercase">Ambition</p>
                  <p className="text-cyan-800 dark:text-cyan-200 font-medium capitalize">{career.ambitionLevel}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {venus ? `Venus in ${venus.sign} suggests partner from ${['Taurus', 'Libra'].includes(venus.sign) ? 'creative/luxury' : ['Capricorn', 'Virgo'].includes(venus.sign) ? 'practical/corporate' : 'diverse'} fields` : 'Career details available via AI analysis'}
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'meeting',
      icon: <MapPin className="w-5 h-5" />,
      title: 'How & Where You Meet',
      gradient: 'from-emerald-500 to-teal-500',
      content: () => (
        <div className="space-y-3">
          {meeting ? (
            <div className="space-y-3">
              {meeting.how && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800/50">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 uppercase">How</p>
                  <p className="text-emerald-800 dark:text-emerald-200 font-medium">{meeting.how}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {meeting.direction && (
                  <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 border border-teal-200 dark:border-teal-800/50">
                    <p className="text-xs text-teal-600 dark:text-teal-400 uppercase">Direction</p>
                    <p className="text-teal-800 dark:text-teal-200 font-medium capitalize">{meeting.direction}</p>
                  </div>
                )}
                {meeting.location && (
                  <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 border border-teal-200 dark:border-teal-800/50">
                    <p className="text-xs text-teal-600 dark:text-teal-400 uppercase">Location Type</p>
                    <p className="text-teal-800 dark:text-teal-200 font-medium">{meeting.location}</p>
                  </div>
                )}
              </div>
              {meeting.firstInteractionVibe && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800/50">
                  <p className="text-xs text-green-600 dark:text-green-400 uppercase">First Interaction Vibe</p>
                  <p className="text-green-800 dark:text-green-200 text-sm mt-1">{meeting.firstInteractionVibe}</p>
                </div>
              )}
            </div>
          ) : direction ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800/50">
              <p className="text-emerald-800 dark:text-emerald-200">
                Partner likely from the <span className="font-bold capitalize">{direction}</span> direction
              </p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">Meeting details available via AI Spouse Profile analysis</p>
          )}
        </div>
      )
    },
    {
      key: 'dynamic',
      icon: <Heart className="w-5 h-5" />,
      title: 'Relationship Dynamic',
      gradient: 'from-fuchsia-500 to-purple-500',
      content: () => (
        <div className="space-y-3">
          {dynamic ? (
            <>
              {dynamic.whoPursues && (
                <div className="bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-lg p-3 border border-fuchsia-200 dark:border-fuchsia-800/50">
                  <p className="text-xs text-fuchsia-600 dark:text-fuchsia-400 uppercase">Who Pursues</p>
                  <p className="text-fuchsia-800 dark:text-fuchsia-200 font-medium capitalize">{dynamic.whoPursues === 'you' ? 'You initiate' : dynamic.whoPursues === 'them' ? 'They initiate' : 'Mutual attraction'}</p>
                </div>
              )}
              {dynamic.courtshipStyle && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800/50">
                  <p className="text-xs text-purple-600 dark:text-purple-400 uppercase">Courtship Style</p>
                  <p className="text-purple-800 dark:text-purple-200 text-sm mt-1">{dynamic.courtshipStyle}</p>
                </div>
              )}
              {dynamic.whatAttractsThem && dynamic.whatAttractsThem.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">What Attracts Them to You</p>
                  <div className="flex flex-wrap gap-2">
                    {dynamic.whatAttractsThem.map((attr: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded text-sm border border-pink-200 dark:border-pink-800/50">
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">Relationship dynamic details available via AI analysis</p>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-900 via-rose-900 to-fuchsia-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Gem className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <Sparkles className="w-10 h-10 text-pink-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Ideal Partner Profile</h2>
              <p className="text-pink-200/80">Your chart reveals who you're meant to be with</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {sections.map(section => (
          <div key={section.key} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${section.gradient} text-white`}>
                  {section.icon}
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{section.title}</h3>
              </div>
              {expandedSection === section.key ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {expandedSection === section.key && (
              <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                {section.content()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
