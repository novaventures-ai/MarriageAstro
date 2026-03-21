/**
 * Self Report Page
 * Main report page for self analysis with multiple tabs
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfileStore } from '../store/useUserProfileStore';
import {
  ArrowLeft,
  Download,
  Share2,
  Loader2,
  User,
  Heart,
  Clock,
  Sparkles,
  Brain,
  Shield,
  Zap,
  MessageCircle,
  Users,
  X,
  Map as MapIcon,
  Activity,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Logo } from '../components/ui/Logo';
import { CosmicNavigator, ThemeId, ThemeConfig } from '../components/widgets/CosmicNavigator';
import { SelfOverviewWidget } from '../components/widgets/SelfOverviewWidget';
import SpousePredictionWidget from '../components/widgets/SpousePredictionWidget';
import SeventhHousePlacementWidget from '../components/widgets/SeventhHousePlacementWidget';
import { SelfTimingWidget } from '../components/widgets/SelfTimingWidget';
import { YogaDoshaWidget } from '../components/widgets/YogaDoshaWidget';
import { MentalHealthWidget } from '../components/widgets/MentalHealthWidget';
import { DivisionalChartWidget } from '../components/widgets/DivisionalChartWidget';
import ChartDetailsWidget from '../components/ChartDetailsWidget';
import { KPAnalysisWidget } from '../components/widgets/KPAnalysisWidget';
import { CharaKarakasWidget } from '../components/widgets/CharaKarakasWidget';
import { AddictionRiskWidget } from '../components/widgets/AddictionRiskWidget';
import { RelationshipPatternWidget } from '../components/widgets/RelationshipPatternWidget';
import { SelfAstroMindWidget } from '../components/ai/SelfAstroMindWidget';
import { SelfRemediesWidget } from '../components/widgets/SelfRemediesWidget';
import { SelfSexualProfileWidget } from '../components/widgets/SelfSexualProfileWidget';
import { SelfRiskRadarWidget } from '../components/widgets/SelfRiskRadarWidget';
import { SelfVulnerabilityTimelineWidget } from '../components/widgets/SelfVulnerabilityTimelineWidget';
import { SelfPsychologicalProfileWidget } from '../components/widgets/SelfPsychologicalProfileWidget';
import { SelfConflictTendencyWidget } from '../components/widgets/SelfConflictTendencyWidget';
import { IdealPartnerProfileWidget } from '../components/widgets/IdealPartnerProfileWidget';
import { MarriageReadinessWidget } from '../components/widgets/MarriageReadinessWidget';
import { UserDashboard } from '../components/dashboard/UserDashboard';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { SEOHead } from '../components/SEOHead';

export const SelfReportPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    selfReport,
    selfChart,
    partners,
    isGeneratingReport,
    generateSelfReport,
    setSelfBirthData
  } = useUserProfileStore();

  const [activeTheme, setActiveTheme] = useState<ThemeId>('match');
  const [showChat, setShowChat] = useState(false);
  const [kpDataMissing, setKpDataMissing] = useState(false);

  // Check if KP data is missing from chart (needs regeneration after code update)
  useEffect(() => {
    if (selfChart && (!selfChart.kp || !selfChart.kp.cusps || selfChart.kp.cusps.length === 0)) {
      setKpDataMissing(true);
    } else {
      setKpDataMissing(false);
    }
  }, [selfChart]);

  // If no report, redirect to calculator
  if (!selfReport && !isGeneratingReport) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            No Report Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please generate your marriage analysis first.
          </p>
          <button
            onClick={() => navigate('/self-calculator')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Generate Analysis
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isGeneratingReport || !selfReport) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Generating Your Analysis...
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            This may take a moment as we analyze your cosmic blueprint.
          </p>
        </div>
      </div>
    );
  }

  // --- Dynamic Theme Configuration ---
  const themes: ThemeConfig[] = [
    {
      id: 'match',
      icon: '🧬',
      title: 'Core Foundations',
      question: 'Who am I essentially?',
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-600',
      widgets: [
        { id: 'overview', label: 'Overall Core Potential' },
        { id: 'readiness', label: 'Marriage Readiness' },
        { id: 'doshas', label: 'Yogas & Doshas' },
        { id: 'kp', label: 'KP Promise Analysis' },
      ],
      dynamicData: {
        badge: `${selfReport.marriagePotential?.score || 0}/100`,
        status: (selfReport.marriagePotential?.score || 0) >= 60 ? 'good' : 'warning',
        highlight: selfReport.marriagePotential?.verdict?.replace('_', ' ') || 'Analyzed'
      }
    },
    {
      id: 'spouse',
      icon: '👤',
      title: 'Spouse & Destiny',
      question: 'Who are they to me?',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-600',
      widgets: [
        { id: 'prediction', label: 'Spouse Prediction Details' },
        { id: 'ideal-partner', label: 'Ideal Partner Profile' },
        { id: '7thhouse', label: '7th House Placement' },
        { id: 'navamsa', label: 'D9 Navamsa (Marriage Chart)' },
        { id: 'chara', label: 'Jaimini Soul Connection' },
      ],
      dynamicData: {
        highlight: selfReport.spousePrediction?.meetingPrediction?.marriageType?.type
          ? `Predicted: ${selfReport.spousePrediction.meetingPrediction.marriageType.type} Marriage`
          : 'Spouse traits analyzed'
      }
    },
    {
      id: 'chemistry',
      icon: '🔥',
      title: 'Physical & Health',
      question: 'What is my vitality?',
      color: 'rose',
      gradient: 'from-rose-500 to-pink-600',
      widgets: [
        { id: 'sexual', label: 'Physical Profile' },
      ],
      dynamicData: {
        badge: 'Health Profile',
        status: 'neutral'
      }
    },
    {
      id: 'mind',
      icon: '🧠',
      title: 'Mind & Emotions',
      question: 'How do I behave?',
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
      widgets: [
        { id: 'psychology', label: 'Psychological Profile' },
        { id: 'conflict', label: 'Conflict Tendencies' },
        { id: 'patterns', label: 'Relationship Behaviors' },
        { id: 'mental', label: 'Mental Health Impact' },
        { id: 'risk-radar', label: 'Risk Radar' }
      ],
      dynamicData: {
        highlight: `Attachment: ${selfReport.psychologicalProfile?.attachmentStyle?.type || 'analyzed'}`
      }
    },
    {
      id: 'timing',
      icon: '⏰',
      title: 'Timing & Action',
      question: 'When to act & how to fix?',
      color: 'indigo',
      gradient: 'from-indigo-500 to-violet-600',
      widgets: [
        { id: 'timing', label: 'Life Timeline' },
        { id: 'vulnerability', label: 'Vulnerability Timeline' },
        { id: 'remedies', label: 'Actionable Remedies' },
      ]
    }
  ];

  const handleScrollToWidget = (widgetId: string) => {
    const el = document.getElementById(widgetId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SEOHead
        title="Your Marriage Analysis Report"
        description="Your personalized Vedic astrology marriage analysis with timing predictions, spouse characteristics, psychological profile, and actionable remedies."
        path="/self-report"
      />
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2 overflow-hidden">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => navigate('/')}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex-shrink-0">
                <Logo size="sm" className="hidden xs:block" />
              </div>
              <div className="min-w-0 overflow-hidden">
                <h1 className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                  {selfChart?.name}&apos;s Analysis
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                  Score: {selfReport.marriagePotential.score}/100 • {selfReport.marriagePotential.verdict.replace('_', ' ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => generateSelfReport()}
                disabled={isGeneratingReport}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600"
                title="Recalculate Analysis"
              >
                <RefreshCw className={`w-5 h-5 ${isGeneratingReport ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-2 rounded-lg transition-colors ${showChat
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600'
                  }`}
                title="Ask AstroMind"
              >
                <MessageCircle className="w-6 h-6" />
              </button>


              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* KP Data Missing Warning */}
        {kpDataMissing && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                  Chart Data Update Required
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                  Your chart was generated with an older version. Please regenerate to get the latest KP Astrology calculations.
                </p>
                <button
                  onClick={async () => {
                    // Clear all cached data
                    localStorage.removeItem('selfAnalysisData');
                    localStorage.removeItem('selfChart');
                    localStorage.removeItem('selfReport');

                    // Clear the store
                    useUserProfileStore.setState({
                      selfChart: null,
                      selfReport: null
                    });

                    // Navigate to calculator to force regeneration
                    navigate('/self-calculator');
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Regenerate Chart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div>
          {/* Cosmic Navigator */}
          <CosmicNavigator
            themes={themes}
            activeTheme={activeTheme}
            onSelectTheme={setActiveTheme}
            onScrollToWidget={handleScrollToWidget}
          />

          {/* Tab Content */}
          <div className="space-y-6 sm:space-y-8 pb-32">

            {/* Always visible at the top: Basic Info */}
            <div className="mb-8 pl-4 pr-4 sm:pl-0 sm:pr-0 -mx-4 sm:mx-0 overflow-x-hidden w-screen sm:w-auto">
              {selfChart && (
                <ErrorBoundary>
                  <ChartDetailsWidget
                    boyChart={selfChart}
                    girlChart={null}
                  />
                </ErrorBoundary>
              )}
            </div>

            {/* 1. FOUNDATIONS */}
            {activeTheme === 'match' && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div id="overview">
                  <ErrorBoundary>
                    <SelfOverviewWidget report={selfReport} />
                  </ErrorBoundary>
                </div>

                <div id="readiness">
                  <ErrorBoundary>
                    <MarriageReadinessWidget report={selfReport} />
                  </ErrorBoundary>
                </div>

                <div id="doshas">
                  <ErrorBoundary>
                    <YogaDoshaWidget
                      partnerA={selfReport.doshaAnalysis}
                      partnerB={selfReport.doshaAnalysis}
                      nameA={selfChart?.name || 'You'}
                      nameB=""
                    />
                  </ErrorBoundary>
                </div>

                {selfChart && (
                  <div id="kp">
                    <ErrorBoundary>
                      {selfReport.kpAnalysis ? (
                        <KPAnalysisWidget
                          partnerA={selfReport.kpAnalysis.partnerA}
                          partnerB={selfReport.kpAnalysis.partnerB || selfReport.kpAnalysis.partnerA}
                          nameA={selfReport.kpAnalysis.nameA}
                          nameB={selfReport.kpAnalysis.nameB}
                        />
                      ) : (
                        <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm transition-colors">
                          <p className="text-gray-500 transition-colors">KP Analysis data not available.</p>
                        </div>
                      )}
                    </ErrorBoundary>
                  </div>
                )}
              </div>
            )}

            {/* 2. SPOUSE & DESTINY */}
            {activeTheme === 'spouse' && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {selfReport.spousePrediction && (
                  <div id="prediction">
                    <ErrorBoundary>
                      <SpousePredictionWidget
                        prediction={selfReport.spousePrediction}
                        gender={selfChart?.gender || 'other'}
                        userName={selfChart?.name}
                      />
                    </ErrorBoundary>
                  </div>
                )}

                <div id="ideal-partner">
                  <ErrorBoundary>
                    <IdealPartnerProfileWidget report={selfReport} />
                  </ErrorBoundary>
                </div>

                {selfChart && (
                  <div id="7thhouse">
                    <ErrorBoundary>
                      <SeventhHousePlacementWidget chart={selfChart} />
                    </ErrorBoundary>
                  </div>
                )}

                {selfChart && (
                  <div id="navamsa">
                    <ErrorBoundary>
                      <DivisionalChartWidget
                        chartA={selfChart}
                        nameA={selfChart.name}
                        divisionalAnalysis={selfReport.divisionalAnalysis}
                      />
                    </ErrorBoundary>
                  </div>
                )}

                {selfChart && (
                  <div id="chara">
                    <ErrorBoundary>
                      {selfReport.jaiminiAnalysis ? (
                        <CharaKarakasWidget
                          partnerA={{
                            charaKarakas: selfReport.jaiminiAnalysis.charaKarakas,
                            charaDasha: selfReport.jaiminiAnalysis.charaDasha,
                            upapadaLagna: selfReport.jaiminiAnalysis.ul,
                            vivahSaham: selfReport.jaiminiAnalysis.vivahSaham || {
                              longitude: 0,
                              sign: 'Aries',
                              degree: 0,
                              interpretation: 'Data not available',
                              activationPeriods: []
                            }
                          }}
                          partnerB={{
                            charaKarakas: selfReport.jaiminiAnalysis.charaKarakas,
                            charaDasha: selfReport.jaiminiAnalysis.charaDasha,
                            upapadaLagna: selfReport.jaiminiAnalysis.ul,
                            vivahSaham: {
                              longitude: 0,
                              sign: 'Aries',
                              degree: 0,
                              interpretation: '',
                              activationPeriods: []
                            }
                          }}
                          nameA={selfChart?.name}
                          nameB=""
                        />
                      ) : (
                        <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-sm transition-colors">
                          <p className="text-gray-500 transition-colors">Jaimini analysis data not available.</p>
                        </div>
                      )}
                    </ErrorBoundary>
                  </div>
                )}
              </div>
            )}

            {/* 3. CHEMISTRY & PHYSICAL */}
            {activeTheme === 'chemistry' && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {selfChart && selfReport.sexualHealth && (
                  <div id="sexual">
                    <ErrorBoundary>
                      <SelfSexualProfileWidget
                        sexualHealth={selfReport.sexualHealth}
                        chart={selfChart}
                        extendedCompatibility={selfReport.extendedSexualCompatibility}
                      />
                    </ErrorBoundary>
                  </div>
                )}
              </div>
            )}

            {/* 4. MIND & EMOTIONS */}
            {activeTheme === 'mind' && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div id="psychology">
                  <ErrorBoundary>
                    <SelfPsychologicalProfileWidget report={selfReport} />
                  </ErrorBoundary>
                </div>

                <div id="conflict">
                  <ErrorBoundary>
                    <SelfConflictTendencyWidget report={selfReport} />
                  </ErrorBoundary>
                </div>

                {selfReport.relationshipPatterns && (
                  <div id="patterns">
                    <ErrorBoundary>
                      <RelationshipPatternWidget
                        patternA={selfReport.relationshipPatterns}
                        nameA={selfChart?.name || 'You'}
                      />
                    </ErrorBoundary>
                  </div>
                )}

                {selfReport.mentalHealth && (
                  <div id="mental">
                    <ErrorBoundary>
                      <MentalHealthWidget
                        mentalHealthA={selfReport.mentalHealth}
                        chartAName={selfChart?.name}
                      />
                    </ErrorBoundary>
                  </div>
                )}

                <div id="risk-radar">
                  <ErrorBoundary>
                    <SelfRiskRadarWidget report={selfReport} />
                  </ErrorBoundary>
                </div>
              </div>
            )}

            {/* 5. TIMING & ACTION */}
            {activeTheme === 'timing' && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div id="timing">
                  <ErrorBoundary>
                    <SelfTimingWidget
                      timing={selfReport.timing}
                      timingForecast={selfReport.timingForecast}
                    />
                  </ErrorBoundary>
                </div>

                <div id="vulnerability">
                  <ErrorBoundary>
                    <SelfVulnerabilityTimelineWidget report={selfReport} />
                  </ErrorBoundary>
                </div>

                {selfReport.remedies && (
                  <div id="remedies">
                    <ErrorBoundary>
                      <SelfRemediesWidget
                        remedies={selfReport.remedies}
                        doshaAnalysis={selfReport.doshaAnalysis}
                      />
                    </ErrorBoundary>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Chat Widget */}
      {
        showChat && (
          <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] shadow-2xl rounded-xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="relative">
              <button
                onClick={() => setShowChat(false)}
                className="absolute top-3 right-3 z-10 p-1 bg-black/20 text-white hover:bg-black/30 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <SelfAstroMindWidget report={selfReport} partners={partners} />
            </div>
          </div>
        )
      }
    </div >
  );
};

// Psychology Widget Component
const PsychologyWidget: React.FC<{ profile: any }> = ({ profile }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Psychological Profile</h2>
      <p className="text-teal-100">
        Understanding your mental patterns helps create better relationships
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {/* Attachment Style */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Attachment Style
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {profile.attachmentStyle.type === 'secure' && '✅'}
              {profile.attachmentStyle.type === 'anxious' && '💝'}
              {profile.attachmentStyle.type === 'avoidant' && '🛡️'}
              {profile.attachmentStyle.type === 'fearful' && '⚡'}
            </span>
            <span className="font-medium text-gray-800 dark:text-gray-100 capitalize">
              {profile.attachmentStyle.type} Attachment
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {profile.attachmentStyle.description}
          </p>
        </div>
      </div>

      {/* Love Language */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Love Language
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💝</span>
            <span className="font-medium text-gray-800 dark:text-gray-100">
              Primary: {profile.loveLanguage.primary}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💫</span>
            <span className="text-gray-600 dark:text-gray-400">
              Secondary: {profile.loveLanguage.secondary}
            </span>
          </div>
        </div>
      </div>

      {/* Communication */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Communication Style
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          {profile.communicationStyle.style}
        </p>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Conflict resolution: </span>
            <span className="text-gray-800 dark:text-gray-200">
              {profile.communicationStyle.conflictResolution}
            </span>
          </div>
        </div>
      </div>

      {/* Core Patterns */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Core Patterns
        </h3>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Core Fear: </span>
            <span className="text-gray-800 dark:text-gray-200">
              {profile.coreFears.primaryFear}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Defense: </span>
            <span className="text-gray-800 dark:text-gray-200">
              {profile.defenseMechanisms.mechanism}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SelfReportPage;
