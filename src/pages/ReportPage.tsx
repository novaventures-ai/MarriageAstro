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
import { ArrowLeft, Download, Share2, Eye, EyeOff } from 'lucide-react';
import ChartDetailsWidget from '../components/ChartDetailsWidget';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { AuthButton } from '../components/ui/AuthButton';
import { AstroMindWidget } from '../components/chat/AstroMindWidget';
import SeventhHousePlacementWidget from '../components/widgets/SeventhHousePlacementWidget';
import { Logo } from '../components/ui/Logo';

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

  const tabs = [
    { id: 'charts', label: 'Chart Details' },
    { id: 'overview', label: 'Overview' },
    { id: 'ashtakoot', label: 'Ashtakoot' },
    { id: 'porutham', label: 'Porutham' },
    { id: 'sexual', label: 'Physical' },
    { id: 'spouse', label: 'Spouse' },
    { id: 'synastry', label: 'Synastry' },
    { id: 'divisional', label: 'Divisional' },
    { id: 'kp', label: 'KP Analysis' },
    { id: 'chara', label: 'Jaimini' },
    { id: 'yogas', label: 'Yogas' },
    { id: 'addiction', label: 'Addiction' },
    { id: 'mental', label: 'Mental Health' },
    { id: 'patterns', label: 'Patterns' },
    { id: 'risks', label: 'Risks' },
    { id: 'timing', label: 'Timing' },
    { id: 'remedies', label: 'Remedies' },
  ] as const;

  return (
    <div className="min-h-screen py-8 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                clearReport();
                navigate('/calculator');
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <Logo size="md" className="mr-2" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors">
                Compatibility Report
              </h1>
              <p className="text-gray-600 dark:text-gray-400 transition-colors">
                {currentReport.chartA.name} & {currentReport.chartB.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AuthButton />
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium rounded-lg whitespace-nowrap transition-all duration-300 ${activeTab === tab.id
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {activeTab === 'charts' && (
            <ChartDetailsWidget
              boyChart={currentReport.chartA}
              girlChart={currentReport.chartB}
            />
          )}

          {activeTab === 'overview' && (
            <OverviewWidget report={currentReport} viewMode={viewMode} />
          )}

          {activeTab === 'ashtakoot' && (
            <AshtakootWidget
              ashtakoot={currentReport.ashtakoot}
              viewMode={viewMode}
              nameA={currentReport.chartA.name}
              nameB={currentReport.chartB.name}
            />
          )}

          {activeTab === 'porutham' && currentReport.poruthamAnalysis && (
            <PoruthamWidget data={currentReport.poruthamAnalysis} />
          )}

          {activeTab === 'sexual' && (
            <SexualCompatibilityWidget
              sexualCompatibility={currentReport.sexualCompatibility}
              extendedSexualCompatibility={currentReport.extendedSexualCompatibility}
              partnerAName={currentReport.chartA.name}
              partnerBName={currentReport.chartB.name}
              chartA={currentReport.chartA}
              chartB={currentReport.chartB}
            />
          )}

          {activeTab === 'spouse' && (
            <div>
              <div className="space-y-8">
                <SpousePredictionWidget
                  prediction={currentReport.spousePrediction}
                  partnerPrediction={currentReport.partnerSpousePrediction}
                  gender={currentReport.chartA.gender}
                  inLawAnalysis={currentReport.inLawAnalysis}
                  partnerInLawAnalysis={currentReport.partnerInLawAnalysis}
                  userName={currentReport.chartA.name}
                  partnerName={currentReport.chartB.name}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 px-4">
                      {currentReport.chartA.name}'s 7th House
                    </h3>
                    <SeventhHousePlacementWidget chart={currentReport.chartA} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 px-4">
                      {currentReport.chartB.name}'s 7th House
                    </h3>
                    <SeventhHousePlacementWidget chart={currentReport.chartB} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'synastry' && (
            <div>
              <div className="space-y-6">
                <SynastryWidget
                  synastry={currentReport.synastry}
                  chartAName={currentReport.chartA.name}
                  chartBName={currentReport.chartB.name}
                />
                <ModernInsightsWidget
                  modernPlanets={currentReport.modernPlanets}
                  modernChallenges={currentReport.modernChallenges}
                  chartA={currentReport.chartA}
                  chartB={currentReport.chartB}
                  enhancedInsights={currentReport.modernInsightsEnhanced}
                />
              </div>
            </div>
          )}

          {activeTab === 'divisional' && (
            <DivisionalChartWidget
              divisionalAnalysis={currentReport.divisionalAnalysis}
              nameA={currentReport.chartA.name}
              nameB={currentReport.chartB.name}
              chartA={currentReport.chartA}
              chartB={currentReport.chartB}
            />
          )}

          {activeTab === 'kp' && currentReport.kpAnalysis && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">KP Astrology Analysis</h2>
                <p className="text-gray-600 dark:text-gray-400 transition-colors">Krishnamurti Paddhati (KP) System - Precision predictive astrology</p>
              </div>
              <KPAnalysisWidget
                partnerA={currentReport.kpAnalysis.partnerA}
                partnerB={currentReport.kpAnalysis.partnerB}
                nameA={currentReport.chartA.name}
                nameB={currentReport.chartB.name}
              />
            </div>
          )}

          {activeTab === 'chara' && currentReport.charaKarakas && currentReport.charaDasha && currentReport.upapadaLagna && currentReport.vivahSaham && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Jaimini Analysis</h2>
                <p className="text-gray-600 dark:text-gray-400 transition-colors">Chara Karakas, Chara Dasha, Upapada Lagna & Vivah Saham</p>
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
            </div>
          )}

          {activeTab === 'yogas' && currentReport.yogaDoshaAnalysis && (
            <YogaDoshaWidget
              partnerA={currentReport.yogaDoshaAnalysis.partnerA}
              partnerB={currentReport.yogaDoshaAnalysis.partnerB}
              nameA={currentReport.chartA.name}
              nameB={currentReport.chartB.name}
            />
          )}

          {activeTab === 'addiction' && currentReport.addictionRiskAnalysis && (
            <AddictionRiskWidget
              partnerA={currentReport.addictionRiskAnalysis.partnerA}
              partnerB={currentReport.addictionRiskAnalysis.partnerB}
              nameA={currentReport.chartA.name}
              nameB={currentReport.chartB.name}
            />
          )}

          {activeTab === 'mental' && currentReport.mentalHealthAnalysis && (
            <MentalHealthWidget
              mentalHealthA={currentReport.mentalHealthAnalysis.partnerA}
              mentalHealthB={currentReport.mentalHealthAnalysis.partnerB}
              chartAName={currentReport.chartA.name}
              chartBName={currentReport.chartB.name}
            />
          )}

          {activeTab === 'patterns' && currentReport.relationshipPatternAnalysis && (
            <RelationshipPatternWidget
              patternA={currentReport.relationshipPatternAnalysis.partnerA}
              patternB={currentReport.relationshipPatternAnalysis.partnerB}
              nameA={currentReport.chartA.name}
              nameB={currentReport.chartB.name}
            />
          )}

          {activeTab === 'risks' && (
            <div className="space-y-6">
              <RiskRadarWidget
                riskAssessment={currentReport.riskAssessment}
                partnerAName={currentReport.chartA.name}
                partnerBName={currentReport.chartB.name}
              />
              <SexualHealthWidget
                sexualHealth={currentReport.sexualHealth}
                partnerAName={currentReport.chartA.name}
                partnerBName={currentReport.chartB.name}
              />
            </div>
          )}

          {activeTab === 'timing' && (
            <TimingWidget timing={currentReport.timing} />
          )}

          {activeTab === 'remedies' && (
            <RemediesWidget
              remedies={currentReport.remedies}
              extendedRemedies={currentReport.extendedRemedies}
              doshas={currentReport.ashtakoot.doshas}
              partnerAName={currentReport.chartA.name}
              partnerBName={currentReport.chartB.name}
              dashaInfo={(() => {
                const getDasha = (dashas: any[]) => dashas.find(d => d.isCurrent)?.planet || 'Unknown';
                return `${currentReport.chartA.name}: ${getDasha(currentReport.chartA.dashas)} Dasha | ${currentReport.chartB.name}: ${getDasha(currentReport.chartB.dashas)} Dasha`;
              })()}
            />
          )}
        </div>
      </div>

      {/* AstroMind Chat Widget */}
      <AstroMindWidget report={currentReport} />
    </div>
  );
};

export default ReportPage;