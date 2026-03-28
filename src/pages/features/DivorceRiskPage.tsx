import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { RiskRadarWidget } from '../../components/widgets/RiskRadarWidget';
import { demoRiskAssessment, DEMO_NAME_A, DEMO_NAME_B } from '../../lib/featureDemoData';

export const DivorceRiskPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <SEOHead
      title="Divorce Risk Radar — How It Works & What The Score Means | Astro Marriage"
      description="Astro Marriage quantifies divorce risk as a 0-100 score using 12+ classical Vedic indicators. Learn what drives the score and how to interpret low/medium/high/very_high levels."
      path="/features/divorce-risk"
    />

    {/* Breadcrumb */}
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Home</Link>
      <span>/</span>
      <Link to="/features" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Features</Link>
      <span>/</span>
      <span className="text-gray-700 dark:text-gray-200">Divorce Risk Radar</span>
    </div>

    {/* Hero */}
    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Risk Analysis
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Divorce Risk Radar
        </h1>
        <p className="text-xl text-white/90 max-w-2xl">
          A quantified 0-100 probability score built from 12+ classical Vedic indicators — the only free tool that puts a number on marital stability.
        </p>
      </div>
    </div>

    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      {/* What Is It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Is the Divorce Risk Radar?</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            The Divorce Risk Radar computes a buffered probability score from 0 to 100 by examining classical Vedic indicators of marital disruption in both partner charts. Raw risk points are accumulated from factors such as the 7th lord's placement and dignity, separative planets (Saturn or Rahu occupying the 7th house), Venus affliction by malefics, placements of planets in dusthana houses (6th, 8th, 12th) that touch marital significators, and multiple-marriage yogas like Kalatra Dosha. The raw score is then reduced by a protective buffer — strong Jupiter in the 7th, an unafflicted Venus, or high Bhakoot compatibility all act as buffers, preventing the final score from overstating real-world risk.
          </p>
          <p>
            The result is expressed both for each individual partner and as a combined couple score. No competing free tool offers this level of quantification: most platforms simply list "Mangal Dosha present / absent" without translating the full planetary picture into an actionable risk number. Scores below 20 indicate low risk, 20-44 moderate, 45-69 high, and 70+ very high.
          </p>
        </div>
      </section>

      {/* Why It Matters */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why It Matters</h2>
        <ul className="space-y-4">
          {[
            {
              heading: 'Awareness prevents problems',
              body: 'Couples who understand which specific planetary configurations are straining their chart can address those areas proactively — through remedies, counselling, or simply mutual understanding — before stress accumulates.',
            },
            {
              heading: 'Per-partner attribution',
              body: 'The widget separates Partner A and Partner B scores, showing exactly which chart carries the higher inherent risk and why. This prevents unfair blame and directs remedial effort to the correct chart.',
            },
            {
              heading: 'Mitigation is built in',
              body: 'Rather than leaving users alarmed, the radar surfaces concrete mitigation strategies — specific transits offering natural relief, gemstone and ritual remedies linked to the offending planet, and timing windows where risk is reduced.',
            },
          ].map(({ heading, body }) => (
            <li key={heading} className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="mt-1 flex-shrink-0 w-3 h-3 rounded-full bg-red-500" />
              <div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{heading}: </span>
                <span className="text-gray-700 dark:text-gray-300">{body}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Live Demo */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Live Demo</h2>
          <span className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200 dark:border-amber-700">
            <span>📊</span> Live Demo — Sample Data
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Ananya Sharma &amp; Vikram Deshmukh — fictional demo couple.
        </p>
        <div className="pointer-events-none select-none overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <RiskRadarWidget
            riskAssessment={demoRiskAssessment}
            partnerAName={DEMO_NAME_A}
            partnerBName={DEMO_NAME_B}
          />
        </div>
      </section>

      {/* How To Read It */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How To Read the Radar</h2>
        <ol className="space-y-4">
          {[
            {
              step: 1,
              title: 'Check the overall score (0-100)',
              detail: 'The headline score reflects the couple\'s combined risk after protective buffers are deducted. Green (0-19) means low risk; yellow (20-44) is moderate; orange (45-69) is high; red (70+) is very high.',
            },
            {
              step: 2,
              title: 'Compare individual partner scores',
              detail: 'Switch between Partner A and Partner B tabs to see which chart contributes more risk. A large difference between partners points to where remedial effort is most needed.',
            },
            {
              step: 3,
              title: 'Read the specific indicators',
              detail: 'Each flagged indicator is listed with the partner name and a plain-English description. These are the actual planetary configurations driving the score — not generic warnings.',
            },
            {
              step: 4,
              title: 'Review the mitigation suggestions',
              detail: 'The radar surfaces both astrological protective periods (e.g., Jupiter transit years) and practical remedies. Use these as a roadmap rather than treating the score as a fixed verdict.',
            },
          ].map(({ step, title, detail }) => (
            <li key={step} className="flex gap-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center font-bold text-sm">
                {step}
              </span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">See Your Own Divorce Risk Score</h2>
        <p className="text-white/85 mb-6 max-w-md mx-auto">
          Enter both birth details and get a personalised risk radar with per-partner breakdown and mitigation plan — completely free.
        </p>
        <Link
          to="/calculator"
          className="inline-block bg-white text-red-600 font-bold px-8 py-3 rounded-xl hover:bg-red-50 transition-colors shadow-lg"
        >
          Calculate Now
        </Link>
      </section>

    </div>
  </div>
);

export default DivorceRiskPage;
