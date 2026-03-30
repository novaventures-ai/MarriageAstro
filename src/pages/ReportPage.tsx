import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { OverviewWidget } from '../components/widgets/OverviewWidget';
import { AshtakootWidget } from '../components/widgets/AshtakootWidget';
import { RiskRadarWidget } from '../components/widgets/RiskRadarWidget';
import { SynastryWidget, ModernInsightsWidget } from '../components/widgets/SynastryWidget';
import { SexualHealthWidget } from '../components/widgets/SexualHealthWidget';
import { TimingWidget } from '../components/widgets/TimingWidget';
import { RemediesWidget } from '../components/widgets/RemediesWidget';
import { SexualCompatibilityWidget } from '../components/widgets/SexualCompatibilityWidget';
import { SpousePredictionWidget } from '../components/widgets/SpousePredictionWidget';
import { DivisionalChartWidget } from '../components/widgets/DivisionalChartWidget';
import { KPAnalysisWidget } from '../components/widgets/KPAnalysisWidget';
import { CharaKarakasWidget } from '../components/widgets/CharaKarakasWidget';
import PoruthamWidget from '../components/widgets/PoruthamWidget';
import { YogaDoshaWidget } from '../components/widgets/YogaDoshaWidget';
import { AddictionRiskWidget } from '../components/widgets/AddictionRiskWidget';
import { MentalHealthWidget } from '../components/widgets/MentalHealthWidget';
import { RelationshipPatternWidget } from '../components/widgets/RelationshipPatternWidget';
import { ConflictZoneWidget } from '../components/widgets/ConflictZoneWidget';
import { PsychologicalProfileWidget } from '../components/widgets/PsychologicalProfileWidget';
import { VulnerabilityTimelineWidget } from '../components/widgets/VulnerabilityTimelineWidget';
import { ArrowLeft, ChevronDown, Home, FileDown, Loader2 } from 'lucide-react';
import { PremiumGate } from '../components/premium/PremiumGate';
import { ShareButton } from '../components/premium/ShareButton';
import { usePremium } from '../hooks/usePremium';
import { usePdfExport } from '../hooks/usePdfExport';
import { CharaDashaWidget } from '../components/widgets/CharaDashaWidget';
import { AdvancedKPWidget } from '../components/widgets/AdvancedKPWidget';
import ChartDetailsWidget from '../components/ChartDetailsWidget';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { AuthButton } from '../components/ui/AuthButton';
import { AstroMindWidget } from '../components/chat/AstroMindWidget';
import SeventhHousePlacementWidget from '../components/widgets/SeventhHousePlacementWidget';
import { Logo } from '../components/ui/Logo';
import { SEOHead } from '../components/SEOHead';
import { CosmicNavigator, ThemeId, ThemeConfig } from '../components/widgets/CosmicNavigator';
import { reportToOgParams, reportToShareData } from '../lib/shareUtils';
import { PushPrompt } from '../components/PushPrompt';

export const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentReport,
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    clearReport
  } = useAppStore();

  const { isPremium } = usePremium();
  const { exportPdf, status: pdfStatus } = usePdfExport();
  const [showMobileTabs, setShowMobileTabs] = useState(false);
  const [activeTheme, setActiveTheme] = useState<ThemeId>('match');

  if (!currentReport) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors duration-500">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors">No Report Available</h2>
          <button
            onClick={() => navigate('/calculator')}
            className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            Go to Calculator
          </button>
        </div>
      </div>
    );
  }

  // --- 5-Question Architecture ---
  const themes: ThemeConfig[] = [
    {
      id: 'match',
      icon: '💍',
      title: 'Is This the Right Match?',
      question: 'Core compatibility & astrological promise',
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-600',
      widgets: [
        { id: 'overview', label: 'Overall Compatibility' },
        { id: 'ashtakoot', label: 'Ashtakoot Guna Milan (36 points)' },
        { id: 'porutham', label: 'South Indian Porutham' },
        { id: 'kp', label: 'KP Promise Analysis' },
        { id: 'kp-advanced', label: 'Advanced KP Significators' },
        { id: 'yogadosha', label: 'Yogas & Doshas' },
      ],
      dynamicData: {
        badge: `${currentReport.ashtakoot?.totalScore || 0}/36`,
        status: (currentReport.ashtakoot?.totalScore || 0) >= 18 ? 'good' : 'danger',
        highlight: (currentReport.ashtakoot?.totalScore || 0) >= 18 ? 'Foundational matching passed' : 'Caution: Low Ashtakoot score'
      }
    },
    {
      id: 'partner',
      icon: '🔍',
      title: 'Who Are They Really?',
      question: 'Personality, destiny & hidden character',
      premiumRequired: !isPremium,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-600',
      widgets: [
        { id: 'prediction', label: 'Spouse Prediction Details' },
        { id: '7thhouse', label: '7th House Placement' },
        { id: 'psychology', label: 'Psychological Profile' },
        { id: 'patterns', label: 'Relationship Behavior Patterns' },
        { id: 'navamsa', label: 'D9 Navamsa (Marriage Chart)' },
        { id: 'jaimini', label: 'Jaimini Soul Connection' },
      ],
      dynamicData: {
        highlight: currentReport.spousePrediction?.meetingPrediction?.marriageType?.type
          ? `Predicted: ${currentReport.spousePrediction.meetingPrediction.marriageType.type} Marriage`
          : 'Character deeply analyzed'
      }
    },
    {
      id: 'risks',
      icon: '⚠️',
      title: 'What Could Go Wrong?',
      question: 'Red flags, friction points & awareness areas',
      premiumRequired: !isPremium,
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
      widgets: [
        { id: 'radar', label: 'Complete Risk Radar' },
        { id: 'conflict', label: 'Conflict Zones' },
        { id: 'addiction', label: 'Addiction Vulnerabilities' },
        { id: 'mental', label: 'Mental & Emotional Patterns' },
        { id: 'vulnerable', label: 'Vulnerability Periods' },
      ],
      dynamicData: {
        badge: `${(currentReport.riskAssessment as any)?.overallRisk?.level || 'Unknown'} Risk`,
        status: (currentReport.riskAssessment as any)?.overallRisk?.level === 'Low'
          ? 'good'
          : ((currentReport.riskAssessment as any)?.overallRisk?.level === 'High' || (currentReport.riskAssessment as any)?.overallRisk?.level === 'Critical')
            ? 'danger' : 'warning'
      }
    },
    {
      id: 'chemistry',
      icon: '🔥',
      title: 'Are We Deeply Compatible?',
      question: 'Intimacy, attraction & deeper connection',
      premiumRequired: !isPremium,
      color: 'rose',
      gradient: 'from-rose-500 to-pink-600',
      widgets: [
        { id: 'sexual', label: 'Sexual Compatibility (Yoni)' },
        { id: 'health', label: 'Vitality & Core Health' },
        { id: 'synastry', label: 'Synastry Connections' },
        { id: 'modern', label: 'Modern Western Insights' },
      ],
      dynamicData: {
        badge: (currentReport.sexualCompatibility as any)?.animalA
          ? `${(currentReport.sexualCompatibility as any).animalA} + ${(currentReport.sexualCompatibility as any).animalB}`
          : undefined,
        status: (currentReport.sexualCompatibility as any)?.score >= 60 ? 'good' : 'warning'
      }
    },
    {
      id: 'timing',
      icon: '⏰',
      title: 'When & How to Proceed?',
      question: 'Marriage windows, Dasha timing & remedies',
      premiumRequired: !isPremium,
      color: 'indigo',
      gradient: 'from-indigo-500 to-violet-600',
      widgets: [
        { id: 'timeline', label: 'Vimshottari Dasha Timeline' },
        { id: 'charadasha', label: 'Chara Dasha (Jaimini)' },
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
    <div className="min-h-screen py-8 px-4 transition-colors duration-500">
      <SEOHead
        title={`${currentReport.chartA.name} & ${currentReport.chartB.name} — Vedic Compatibility`}
        description={`Ashtakoot Milan score ${currentReport.ashtakoot?.totalScore ?? '?'}/36. Full Vedic marriage compatibility analysis for ${currentReport.chartA.name} and ${currentReport.chartB.name}.`}
        path="/report"
        ogParams={reportToOgParams(currentReport)}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <button
                onClick={() => {
                  clearReport();
                  navigate('/calculator');
                }}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0 min-touch"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0"
                title="Go to Dashboard"
              >
                <Logo size="sm" showText={false} />
                <span className="hidden sm:inline text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Dashboard</span>
              </button>
              <div className="min-w-0 flex-1 overflow-hidden">
                <h1 className="text-sm sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors whitespace-nowrap">
                  <span className="hidden sm:inline">Compatibility Report</span>
                  <span className="sm:hidden">Report</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors truncate">
                  {currentReport.chartA.name} & {currentReport.chartB.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <ShareButton
                title={`${currentReport.chartA.name} & ${currentReport.chartB.name} Compatibility`}
                text={`Compatibility score: ${currentReport.ashtakoot?.totalScore || '?'}/36. Check yours at Astro Marriage!`}
                reportData={reportToShareData(currentReport)}
                ogParams={reportToOgParams(currentReport)}
                iconOnly
              />
              {isPremium && (
                <button
                  onClick={() => exportPdf(currentReport)}
                  disabled={pdfStatus === 'generating'}
                  title="Export PDF Report"
                  className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400 disabled:opacity-50"
                >
                  {pdfStatus === 'generating'
                    ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    : <FileDown className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                title="Go Home"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <AuthButton />
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Cosmic Navigator replacing 20 tabs */}
        <CosmicNavigator
          themes={themes}
          activeTheme={activeTheme}
          onSelectTheme={setActiveTheme}
          onScrollToWidget={handleScrollToWidget}
        />

        {/* Thematic Content Areas - Rendering based on activeTheme */}
        <div className="space-y-6 sm:space-y-8 pb-32">

          {/* Always visible at the top: Basic Info */}
          <div className="mb-8 pl-4 pr-4 sm:pl-0 sm:pr-0 -mx-4 sm:mx-0 overflow-x-hidden w-screen sm:w-auto">
            <ChartDetailsWidget
              boyChart={currentReport.chartA}
              girlChart={currentReport.chartB}
            />
          </div>

          {/* 1. FOUNDATIONS */}
          {activeTheme === 'match' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div id="overview"><OverviewWidget report={currentReport} viewMode={viewMode as any} /></div>
              <div id="ashtakoot">
                <AshtakootWidget
                  ashtakoot={currentReport.ashtakoot}
                  viewMode={viewMode as any}
                  nameA={currentReport.chartA.name}
                  nameB={currentReport.chartB.name}
                />
              </div>
              {currentReport.poruthamAnalysis && (
                <div id="porutham"><PoruthamWidget data={currentReport.poruthamAnalysis} /></div>
              )}
              {currentReport.kpAnalysis && (
                <div id="kp">
                  <KPAnalysisWidget
                    partnerA={currentReport.kpAnalysis.partnerA}
                    partnerB={currentReport.kpAnalysis.partnerB}
                    nameA={currentReport.chartA.name}
                    nameB={currentReport.chartB.name}
                  />
                </div>
              )}
              {currentReport.kpAnalysis && (
                <div id="kp-advanced">
                  <PremiumGate section="kp_detail" label="Advanced KP Significators">
                    <AdvancedKPWidget
                      partnerA={currentReport.kpAnalysis.partnerA}
                      partnerB={currentReport.kpAnalysis.partnerB}
                      nameA={currentReport.chartA.name}
                      nameB={currentReport.chartB.name}
                    />
                  </PremiumGate>
                </div>
              )}
              {currentReport.yogaDoshaAnalysis && (
                <div id="yogadosha">
                  <YogaDoshaWidget
                    partnerA={currentReport.yogaDoshaAnalysis.partnerA}
                    partnerB={currentReport.yogaDoshaAnalysis.partnerB}
                    nameA={currentReport.chartA.name}
                    nameB={currentReport.chartB.name}
                  />
                </div>
              )}
            </div>
          )}

          {/* 2. WHO ARE THEY REALLY? — personality, destiny, hidden character */}
          {activeTheme === 'partner' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div id="prediction">
                <SpousePredictionWidget
                  prediction={currentReport.spousePrediction}
                  partnerPrediction={currentReport.partnerSpousePrediction}
                  gender={currentReport.chartA.gender}
                  partnerGender={currentReport.chartB.gender}
                  inLawAnalysis={currentReport.inLawAnalysis}
                  partnerInLawAnalysis={currentReport.partnerInLawAnalysis}
                  userName={currentReport.chartA.name}
                  partnerName={currentReport.chartB.name}
                />
              </div>
              <div id="7thhouse" className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 px-2 sm:px-4">
                    {currentReport.chartA.name}&apos;s 7th House
                  </h3>
                  <SeventhHousePlacementWidget chart={currentReport.chartA} />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 px-2 sm:px-4">
                    {currentReport.chartB.name}&apos;s 7th House
                  </h3>
                  <SeventhHousePlacementWidget chart={currentReport.chartB} />
                </div>
              </div>
              <div id="psychology">
                <PremiumGate section="full_compat_report" label="Psychological Profile">
                  <PsychologicalProfileWidget report={currentReport as any} />
                </PremiumGate>
              </div>
              {currentReport.relationshipPatternAnalysis && (
                <div id="patterns">
                  <PremiumGate section="full_compat_report" label="Relationship Behavior Patterns">
                    <RelationshipPatternWidget
                      patternA={currentReport.relationshipPatternAnalysis.partnerA}
                      patternB={currentReport.relationshipPatternAnalysis.partnerB}
                      nameA={currentReport.chartA.name}
                      nameB={currentReport.chartB.name}
                    />
                  </PremiumGate>
                </div>
              )}
              <div id="navamsa">
                <PremiumGate section="divisional_advanced" label="Navamsa D9 Marriage Chart">
                  <DivisionalChartWidget
                    divisionalAnalysis={currentReport.divisionalAnalysis}
                    nameA={currentReport.chartA.name}
                    nameB={currentReport.chartB.name}
                    chartA={currentReport.chartA}
                    chartB={currentReport.chartB}
                  />
                </PremiumGate>
              </div>
              {currentReport.charaKarakas && currentReport.charaDasha && currentReport.upapadaLagna && currentReport.vivahSaham && (
                <div id="jaimini">
                  <PremiumGate section="full_compat_report" label="Jaimini Soul Connection">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 transition-colors mb-4">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Jaimini Soul Connection</h2>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-colors">Chara Karakas, Chara Dasha, Upapada Lagna & Vivah Saham</p>
                    </div>
                    <CharaKarakasWidget
                      partnerA={{
                        charaKarakas: currentReport.charaKarakas.partnerA,
                        charaDasha: currentReport.charaDasha.partnerA,
                        upapadaLagna: currentReport.upapadaLagna.partnerA,
                        vivahSaham: currentReport.vivahSaham.partnerA
                      }}
                      partnerB={{
                        charaKarakas: currentReport.charaKarakas.partnerB,
                        charaDasha: currentReport.charaDasha.partnerB,
                        upapadaLagna: currentReport.upapadaLagna.partnerB,
                        vivahSaham: currentReport.vivahSaham.partnerB
                      }}
                      nameA={currentReport.chartA.name}
                      nameB={currentReport.chartB.name}
                    />
                  </PremiumGate>
                </div>
              )}
            </div>
          )}

          {/* 3. WHAT COULD GO WRONG? — red flags, friction, awareness areas */}
          {activeTheme === 'risks' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div id="radar">
                <PremiumGate section="divorce_risk" label="Risk Analysis Details">
                  <RiskRadarWidget
                    riskAssessment={currentReport.riskAssessment}
                    partnerAName={currentReport.chartA.name}
                    partnerBName={currentReport.chartB.name}
                  />
                </PremiumGate>
              </div>
              <div id="conflict">
                <PremiumGate section="divorce_risk" label="Conflict Zone Analysis">
                  <ConflictZoneWidget report={currentReport} />
                </PremiumGate>
              </div>
              {currentReport.addictionRiskAnalysis && (
                <div id="addiction">
                  <PremiumGate section="addiction_risk" label="Addiction Risk Analysis">
                    <AddictionRiskWidget
                      partnerA={currentReport.addictionRiskAnalysis.partnerA}
                      partnerB={currentReport.addictionRiskAnalysis.partnerB}
                      nameA={currentReport.chartA.name}
                      nameB={currentReport.chartB.name}
                    />
                  </PremiumGate>
                </div>
              )}
              {currentReport.mentalHealthAnalysis && (
                <div id="mental">
                  <PremiumGate section="mental_health" label="Mental & Emotional Patterns">
                    <MentalHealthWidget
                      mentalHealthA={currentReport.mentalHealthAnalysis.partnerA}
                      mentalHealthB={currentReport.mentalHealthAnalysis.partnerB}
                      chartAName={currentReport.chartA.name}
                      chartBName={currentReport.chartB.name}
                    />
                  </PremiumGate>
                </div>
              )}
              {currentReport.vulnerabilityTimeline && (
                <div id="vulnerable">
                  <PremiumGate section="vulnerability_timeline" label="Vulnerability Periods">
                    <VulnerabilityTimelineWidget timeline={currentReport.vulnerabilityTimeline} />
                  </PremiumGate>
                </div>
              )}
            </div>
          )}

          {/* 4. ARE WE DEEPLY COMPATIBLE? — intimacy, attraction, deeper connection */}
          {activeTheme === 'chemistry' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div id="sexual">
                <PremiumGate section="sexual_detail" label="Sexual Compatibility">
                  <SexualCompatibilityWidget
                    sexualCompatibility={currentReport.sexualCompatibility}
                    extendedSexualCompatibility={currentReport.extendedSexualCompatibility}
                    partnerAName={currentReport.chartA.name}
                    partnerBName={currentReport.chartB.name}
                    chartA={currentReport.chartA}
                    chartB={currentReport.chartB}
                  />
                </PremiumGate>
              </div>
              <div id="health">
                <PremiumGate section="sexual_detail" label="Sexual Health Analysis">
                  <SexualHealthWidget
                    sexualHealth={currentReport.sexualHealth}
                    partnerAName={currentReport.chartA.name}
                    partnerBName={currentReport.chartB.name}
                  />
                </PremiumGate>
              </div>
              <div id="synastry">
                <PremiumGate section="sexual_detail" label="Synastry Connections">
                  <SynastryWidget
                    synastry={currentReport.synastry}
                    chartAName={currentReport.chartA.name}
                    chartBName={currentReport.chartB.name}
                  />
                </PremiumGate>
              </div>
              <div id="modern">
                <PremiumGate section="full_compat_report" label="Modern Western Insights">
                  <ModernInsightsWidget
                    modernPlanets={currentReport.modernPlanets!}
                    modernChallenges={currentReport.modernChallenges!}
                    chartA={currentReport.chartA}
                    chartB={currentReport.chartB}
                    enhancedInsights={currentReport.modernInsightsEnhanced}
                  />
                </PremiumGate>
              </div>
            </div>
          )}

          {/* 5. WHEN & HOW TO PROCEED? — Dasha timing & remedies */}
          {activeTheme === 'timing' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div id="timeline"><TimingWidget timing={currentReport.timing} /></div>
              {currentReport.charaDasha && (
                <div id="charadasha">
                  <PremiumGate section="kp_detail" label="Chara Dasha Timeline">
                    <CharaDashaWidget
                      partnerA={currentReport.charaDasha.partnerA}
                      partnerB={currentReport.charaDasha.partnerB}
                      nameA={currentReport.chartA.name}
                      nameB={currentReport.chartB.name}
                    />
                  </PremiumGate>
                </div>
              )}
              <div id="remedies">
                <PremiumGate section="remedies" label="Remedies & Solutions">
                  <RemediesWidget
                    remedies={currentReport.remedies}
                    extendedRemedies={currentReport.extendedRemedies!}
                    doshas={currentReport.ashtakoot.doshas}
                    partnerAName={currentReport.chartA.name}
                    partnerBName={currentReport.chartB.name}
                    dashaInfo={(() => {
                      const getDasha = (dashas: any[]) => dashas.find(d => d.isCurrent)?.planet || 'Unknown';
                      return `${currentReport.chartA.name}: ${getDasha(currentReport.chartA.dashas)} Dasha | ${currentReport.chartB.name}: ${getDasha(currentReport.chartB.dashas)} Dasha`;
                    })()}
                  />
                </PremiumGate>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AstroMind Chat Widget */}
      <AstroMindWidget report={currentReport} />

      {/* Push notification opt-in prompt — shown after report loads */}
      <PushPrompt />
    </div>
  );
};

export default ReportPage;