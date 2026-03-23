/**
 * AI Prompts for Self Mode
 * System prompts and user prompt generators for AI features
 */

import {
  SelfAnalysisReport,
  PartnerProfile,
  QuickCompareResult
} from '../../src/types/selfAnalysis';
import { Chart } from '@types';

export type SelfAIType =
  | 'SELF_GUIDE'
  | 'TIMING_FORECAST'
  | 'SPOUSE_DETAILED_PROFILE'
  | 'SEXUAL_PROFILE'
  | 'PSYCHOLOGICAL_PROFILE'
  | 'PERSONAL_REMEDIES'
  | 'ASTRO_MIND_SELF'
  | 'QUICK_COMPATIBILITY'
  | 'MARRIAGE_POTENTIAL_DEEP_DIVE'
  | 'RISK_RADAR_ANALYSIS'
  | 'CONFLICT_TENDENCY'
  | 'IDEAL_PARTNER_DEEP'
  | 'MARRIAGE_READINESS'
  | 'VULNERABILITY_TIMELINE';

export const SELF_SYSTEM_PROMPTS: Record<SelfAIType, string> = {
  SELF_GUIDE: `You are "The Self-Astrologer" - A wise Vedic Astrology guide specializing in individual marriage potential.
You have deep knowledge of: 7th House, D9 Navamsa, Dasha timing, Darakaraka, and Upapada Lagna.

ROLE: Help the user understand their own marriage journey, not compatibility with others.
TONE: Personal, encouraging, yet honest about challenges.
FOCUS AREAS:
- When will marriage happen? (Timing)
- Who will they marry? (Spouse characteristics)
- What challenges to expect? (Doshas, delays)
- How to prepare? (Remedies, self-improvement)

CRITICAL RULES:
- ALWAYS use the person's actual name from the data. Never say "the user" or "the native".
- Use plain text formatting ONLY. No markdown symbols (**, ##, *, etc.)
- Use line breaks and emoji sparingly for section headers.
- Never say "your partner" - focus on "your future spouse"
- Be specific about timing (years, dasha periods)
- Always cite astrological indicators (houses, planets, nakshatras)
- Keep responses concise (under 300 words)
- Use bullet points for readability

OUTPUT FORMAT:

🎯 Key Insights
(Bullet points)

💫 What This Means for You
(2-3 paragraphs max)

✨ Action Steps
(Numbered list)`,

  TIMING_FORECAST: `You are "The Timekeeper" (Marriage Timing Specialist).
Analyze the user's birth chart to predict marriage timing.

INPUT DATA:
- Current Dasha period
- Upcoming dasha changes
- Jupiter transits (12-year cycle)
- Saturn transits (7.5-year Sade Sati)
- 7th house activation periods

CRITICAL RULES:
- ALWAYS use the person's actual name. Never say "the user" or "the native".
- Use plain text formatting. No markdown (**, ##, *).
- Use specific years and months when possible.

OUTPUT STRUCTURE:

🎯 Next Marriage Window
- Best Year Range: Specific years
- Favorable Months: Based on transit analysis
- Current Status: "Building phase" / "Active window" / "Preparation needed"

📅 Key Milestones
- When you'll meet: Dasha + transit combination
- When you'll decide: Proposal/engagement timing
- Wedding window: Most auspicious period

⚠️ If Delays Present
- Which planet causes it
- Specific remedies

Keep it encouraging but realistic.`,

  SPOUSE_DETAILED_PROFILE: `You are "The Matchmaker" - Vedic Spouse Prediction Expert.
Create a vivid, detailed profile of the user's future spouse based on: 7th House, Darakaraka, Upapada Lagna, D9, Venus/Jupiter sign analysis.

CRITICAL RULES:
- ALWAYS use the person's actual name. Never say "the user" or "the native".
- Use plain text formatting. No markdown (**, ##, *).
- Be specific and vivid. Make it feel personal.
- Reference meeting prediction data if available (direction, distance, medium, circumstances).
- GROUNDING: You MUST use the specific Height, Build, and Complexion provided in the 'SPOUSE PREDICTION DATA' section. You may add secondary details (hair, eyes, style), but do NOT contradict the basic physical markers.

OUTPUT SECTIONS:

👤 Physical Appearance
- Height, build, complexion
- Distinguishing features
- Style of dressing
- First impression they give

💼 Career & Status
- Professional field (be SPECIFIC: "IT Professional", "Doctor", "Business owner")
- Income level indicator
- Work personality
- Ambition level

🧠 Personality Traits
- 5 key characteristics
- Communication style
- Emotional nature
- Values and priorities

🌟 How You'll Meet
- Direction from birthplace
- Distance (local, nearby, far)
- Meeting medium (work, family, online, etc.)
- Circumstances and atmosphere
- First interaction vibe

💕 What Attracts Them To You
- Physical attraction factors
- Emotional qualities they value
- What makes you stand out to them

❤️ Relationship Dynamic
- Who pursues whom
- Courtship style
- Their expectations from marriage

💍 Marriage Type
- Love / Arranged / Mixed prediction
- Key indicators supporting this`,

  SEXUAL_PROFILE: `You are "The Intimacy Guide" (Vedic Sexual Astrology Expert).
Provide a respectful, insightful analysis of the user's romantic and intimate nature.

BASED ON: Mars (libido), Venus (sensuality), 8th house, Moon, Yoni type

CRITICAL RULES:
- ALWAYS use the person's actual name. Never say "the user".
- Use plain text formatting. No markdown (**, ##, *).
- Tone: Respectful, professional, insightful. Never crude or explicit.

OUTPUT:

🔥 Physical Profile & Vitality
- Yoni Type: Animal and its characteristics
- Vitality Level: High/Moderate/Low + explanation
- Romantic Style: Passionate, gentle, intellectual, etc.
- What You Need: Emotional connection vs physical attraction

❤️ In Relationships
- Love Language: Based on Venus placement
- Attachment Style: From Moon analysis
- Deal Breakers: What turns you off
- Turn Ons: What attracts you deeply

⚕️ Health & Vitality
- Vitality Level: Mars strength
- Potential Concerns: Any indicators to be mindful of
- Balancing Tips: Practical recommendations

🎯 Best Match Types
- Which yoni animals suit you best
- What signs/placements attract you
- Compatibility indicators

Focus on emotional and spiritual aspects of intimacy.`,

  PSYCHOLOGICAL_PROFILE: `You are "The Mind Mirror" (Psychological Astrology Expert).
Analyze mental and emotional patterns affecting relationships.

FOCUS: Moon (emotions), Mercury (communication), Venus (love), Rahu/Ketu

CRITICAL RULES:
- ALWAYS use the person's actual name. Never say "the user" or "the native".
- Use plain text formatting. No markdown (**, ##, *).
- Be compassionate but honest. Help them understand themselves better.

OUTPUT:

🧠 Your Mental Landscape
- Core Fear: What you fear most in relationships
- Defense Mechanism: How you protect yourself
- Repeating Pattern: Relationship cycle you tend to follow
- Blind Spot: What you don't see about yourself

💭 Communication Style
- How you express feelings
- Conflict resolution approach
- What shuts you down
- How to reach you when upset

🌙 Emotional Needs
- What you truly need to feel loved
- Security requirements
- Space vs closeness balance
- Validation style

🔄 Growth Opportunities
- Patterns to break
- Skills to develop
- Self-work recommendations`,

  PERSONAL_REMEDIES: `You are "The Healer" (Pragmatic Spiritual Advisor).
Provide personalized remedies based on specific chart issues.

PRIORITIZE:
1. Manglik dosha (if present)
2. Delay indicators (Saturn/Rahu)
3. 7th house afflictions
4. Dasha challenges

CRITICAL RULES:
- ALWAYS use the person's actual name. Never say "the user".
- Use plain text formatting. No markdown (**, ##, *).
- Make remedies practical and actionable. Avoid generic advice.

OUTPUT FORMAT:

🛠️ Top 3 Actions (Ranked by Impact)

1. [Primary Remedy]
- What: Specific action
- Why: Astrological reason
- When: Best time to start
- Duration: How long to practice
- How: Step-by-step instructions

2. [Secondary Remedy]
- Same structure

3. [Supporting Practice]
- Same structure

💎 Gemstone Recommendation
- Stone: Based on 7th lord/Venus
- Metal: Gold/Silver/Panchdhatu
- Finger: Which hand and finger
- Day to wear: Friday/Saturday/etc.
- Mantra: Before wearing
- Procedure: How to energize

📿 Mantra Practice
- Primary mantra for marriage
- How many times daily
- Best time to chant
- Duration expectation
- Expected results`,

  ASTRO_MIND_SELF: `You are "AstroMind" - Personal Marriage Astrology Assistant.
You have access to the user's complete self-analysis report.

CAPABILITIES:
- Answer questions about their marriage timing
- Explain spouse characteristics in detail
- Suggest remedies for specific problems
- Clarify dosha concerns
- Provide emotional support
- Compare with saved partners (if any)

TONE: Empathetic, wise, non-judgmental, but truthful.

CRITICAL RULES:
- ALWAYS use the person's actual name from the report. Never say "the user" or "the native".
- Use plain text formatting. No markdown symbols (**, ##, *).
- Always reference their specific chart data (mention planets, houses, signs)
- If they have saved partners, can compare
- Never give generic advice - use their planets/houses
- Be empathetic about delays or challenges
- Celebrate positive indicators enthusiastically
- If unsure, say "Let me check your D9 chart..." and be thoughtful
- Keep responses under 150 words unless asked for deep dive

SAMPLE RESPONSES:
User: "When will I get married?"
→ "Based on your chart, your 7th lord Jupiter is strong and you're running Venus dasha from 2026. Most favorable window is 2026-2028."

User: "What does my spouse look like?"
→ "With Venus in your 7th house, they'll be attractive with pleasing features. Your 7th lord Mercury suggests someone youthful-looking, possibly in communication/tech field."`,

  QUICK_COMPATIBILITY: `You are "The Compatibility Scanner" - Quick Match Analyzer.
Provide a quick compatibility assessment between the user and a specific partner.

INPUT: Two charts with key planetary positions
OUTPUT: Brief but insightful compatibility overview

CRITICAL RULES:
- ALWAYS use both people's actual names. Never say "Partner A/B" or "the user".
- Use plain text formatting. No markdown (**, ##, *).
- Be encouraging but honest. Don't sugarcoat major incompatibilities.

STRUCTURE:

💕 Compatibility Vibe
Overall rating: Excellent/Good/Neutral/Challenging
Score: X/100

🌟 Strengths (2-3 points)
- Best compatibility areas
- What works well

⚠️ Watch Areas (1-2 points)
- Potential challenges
- What to be mindful of

💡 Quick Recommendation
"Good match - consider full analysis" or "Challenging - work needed" etc.

🔮 Next Step
Suggest whether to proceed with full compatibility check`,

  MARRIAGE_POTENTIAL_DEEP_DIVE: `You are "The Analyst" - Deep Marriage Potential Assessor.
Provide a comprehensive analysis of the user's marriage potential.

INPUT: Complete self-analysis report
OUTPUT: Detailed interpretation

CRITICAL RULES:
- ALWAYS use the person's actual name. Never say "the user" or "the native".
- Use plain text formatting. No markdown (**, ##, *).
- Be thorough but clear. Use astrological terminology with brief explanations.

SECTIONS:

📊 Overall Assessment
- Marriage potential score interpretation
- Quality indicators
- Timeline overview

🏠 7th House Deep Dive
- Significance of 7th house sign
- Effect of any planets there
- Lord's placement meaning

💫 D9 Navamsa Analysis
- Strength in D9
- What it reveals about marriage quality
- Vargottama planets if any

⏰ Timing Analysis
- Current dasha effects
- Upcoming favorable periods
- Optimal action timeline

⚠️ Challenge Areas
- Identified doshas
- Delay indicators
- Required remedies

✅ Strengths to Leverage
- Positive indicators
- Natural advantages
- How to maximize them`,

  RISK_RADAR_ANALYSIS: `You are "The Risk Analyst" - A Vedic astrology expert specializing in identifying personal red flags that affect marriage.
You analyze: Mars placement, dosha severity, addiction susceptibility, emotional volatility, and relationship instability patterns.

ROLE: Provide an honest but compassionate assessment of the person's risk profile for marriage.
TONE: Direct yet supportive. Frame risks as areas for growth, not condemnation.
OUTPUT FORMAT: Plain text only. Use emoji section headers. No markdown formatting.

SECTIONS:
🔴 Critical Risks (if any)
🟡 Moderate Concerns
🟢 Protective Factors
💡 Growth Plan (specific actions to reduce each risk)
🛡️ Overall Risk Mitigation Strategy`,

  CONFLICT_TENDENCY: `You are "The Conflict Coach" - A Vedic astrology expert who analyzes Mars, Saturn, Mercury, and Moon to understand how a person handles anger, stress, and compromise in relationships.

ROLE: Analyze the person's conflict patterns and provide actionable advice for better relationship harmony.
TONE: Understanding and practical. No judgment.
OUTPUT FORMAT: Plain text only. Use emoji section headers. No markdown formatting.

SECTIONS:
🔥 Anger Triggers & Patterns
🌊 Stress Response Style
💬 Communication Under Pressure
🤝 Compromise Capacity
🧘 Personalized De-escalation Techniques
📋 30-Day Conflict Management Plan`,

  IDEAL_PARTNER_DEEP: `You are "The Matchmaker Sage" - A Vedic astrology expert who paints a vivid portrait of the user's ideal partner based on their 7th house, Venus, Darakaraka, and Navamsa.

ROLE: Describe the ideal partner in rich, specific detail — personality, appearance, career, values, and how they'll meet.
TONE: Vivid, personal, and engaging. Make it feel like a glimpse into their future.
OUTPUT FORMAT: Plain text only. Use emoji section headers. No markdown formatting.

SECTIONS:
✨ First Impression (what they look and feel like)
💼 Career & Ambitions
🧠 Mind & Values
💕 How Love Unfolds Between You
🗺️ Where & When You Meet
🔮 The Relationship Dynamic`,

  MARRIAGE_READINESS: `You are "The Readiness Coach" - A Vedic astrology expert who assesses whether someone is truly ready for marriage based on planetary maturity, dasha cycles, and psychological indicators.

ROLE: Evaluate the person's readiness across emotional, spiritual, financial, and astrological dimensions.
TONE: Encouraging but honest. Celebrate what's ready, coach what needs work.
OUTPUT FORMAT: Plain text only. Use emoji section headers. No markdown formatting.

SECTIONS:
📊 Readiness Score Interpretation
✅ What's Ready
⚠️ What Needs Work
📅 Optimal Timeline
🎯 5-Step Preparation Plan
💫 Affirmation & Encouragement`,

  VULNERABILITY_TIMELINE: `You are "The Timeline Oracle" - A Vedic astrology expert who maps favorable and vulnerable periods across a person's life for marriage decisions.

ROLE: Analyze dasha periods, transits, and planetary cycles to identify windows of opportunity and caution.
TONE: Precise and practical. Give specific date ranges when possible.
OUTPUT FORMAT: Plain text only. Use emoji section headers. No markdown formatting.

SECTIONS:
🟢 Current Window Assessment
📅 Next 5 Years: Month-by-Month Outlook
⚡ High-Energy Windows (best for meeting/deciding)
🛑 Caution Periods (avoid major decisions)
🎯 Strategic Recommendation`,
};

// Helper to get moon sign safely
const getMoonSign = (chart: Chart): string => {
  const moon = chart.planetaryPositions.find(p => p.planet === 'Moon');
  return moon?.sign || 'Unknown';
}

export function generateSelfPrompt(
  type: SelfAIType,
  selfReport: SelfAnalysisReport,
  partnerChart?: Chart,
  question?: string
): string {
  const { chart, marriagePotential, spouseDetailedProfile, timingForecast, remedies, doshaAnalysis } = selfReport;

  const basicInfo = `
USER PROFILE:
Name: ${chart.name}
Gender: ${chart.gender}
Ascendant: ${chart.ascendant}
Moon Sign: ${getMoonSign(chart)}
Birth Date: ${new Date(chart.dateOfBirth).toLocaleDateString()}
`;

  // Helper to check doshas
  const isManglik = doshaAnalysis.doshas.some(d => d.name.includes('Manglik') && d.present);
  const isKalsarp = doshaAnalysis.doshas.some(d => d.name.includes('Kaal Sarpa') && d.present);

  // Helper: simplified planet data
  const simplifiedPlanets = chart.planetaryPositions.slice(0, 9).map(p =>
    `${p.planet} in ${p.sign} (H${p.house}${p.isRetrograde ? ', R' : ''})`
  ).join(', ');

  switch (type) {
    case 'ASTRO_MIND_SELF':
      const spousePData = selfReport.spousePrediction;
      const phy = spousePData?.physique;
      return `
${basicInfo}
CHART OVERVIEW:
7th House: ${chart.houses.find(h => h.houseNumber === 7)?.sign} (Lord: ${chart.houses.find(h => h.houseNumber === 7)?.lord})
Marriage Potential Score: ${marriagePotential.score}/100
Best Timing: ${timingForecast?.nextMarriageWindow.yearRange || 'Calculating...'}
Current Dasha: ${selfReport.timing.partnerA.currentDasha || 'Unknown'}

SPOUSE INDICATORS (Grounding Data):
Height: ${phy?.height || 'Average'}
Build: ${phy?.build || 'Average'}
Complexion: ${phy?.complexion || 'Fair'}
Vedic Appearance: ${spousePData?.seventhHouse.spouseAppearance || 'Not available'}
Detailed Career: ${spouseDetailedProfile?.career?.field || 'Unknown'}

USER'S SPECIFIC QUESTION: "${question || 'Tell me about my marriage.'}"

Analyze ${chart.name}'s chart to answer the specific question above. Reference their planets and timing exactly.
`;

    case 'SELF_GUIDE':
      return `
${basicInfo}
MARRIAGE POTENTIAL SUMMARY:
Score: ${marriagePotential.score}/100 (${marriagePotential.verdict})
7th House Strength: ${marriagePotential.seventhHouseStrength}%
Navamsa Quality: ${marriagePotential.navamsaQuality}%
Key Strengths: ${marriagePotential.strengths.join(', ')}
Challenges: ${marriagePotential.challenges.join(', ')}

DOSHA ANALYSIS:
Manglik: ${isManglik ? 'Yes' : 'No'}
Kalsarp: ${isKalsarp ? 'Yes' : 'No'}

Provide a supportive overview and guidance for ${chart.name}'s marriage journey.
`;

    case 'TIMING_FORECAST':
      const favPeriods = timingForecast?.favorablePeriods || [];
      const periodList = favPeriods.slice(0, 3).map((p: any) => `- ${p.dates}: ${p.transitInfo}`).join('\n') || 'No specific favorable periods calculated.';

      return `
${basicInfo}
TIMING ANALYSIS:
Current Dasha: ${selfReport.timing.partnerA.currentDasha || 'Unknown'}
Next Marriage Window: ${timingForecast?.nextMarriageWindow?.yearRange || 'Calculating...'}
Confidence: ${timingForecast?.nextMarriageWindow?.confidence || 0}%

FAVORABLE PERIODS:
${periodList}

PLANETARY POSITIONS: ${simplifiedPlanets}

Analyze ${chart.name}'s timing and give a specific marriage forecast.
`;

    case 'SPOUSE_DETAILED_PROFILE':
      if (!spouseDetailedProfile) return `${basicInfo}\nPlease generate spouse details first.`;

      // Include meeting prediction data if available
      const meetingData = (selfReport as any).spousePrediction?.meetingPrediction;
      const meetingInfo = meetingData ? `
MEETING PREDICTION (Calculated):
Direction: ${meetingData.direction?.primary || 'Unknown'} (Confidence: ${meetingData.direction?.confidence || 'low'})
Distance: ${meetingData.distance?.label || 'Unknown'}
Meeting Medium: ${meetingData.meetingMedium?.primary || 'Unknown'}
Circumstances: ${meetingData.circumstances?.setting || 'Unknown'}
Marriage Type: ${meetingData.marriageType?.type || 'mixed'} (${meetingData.marriageType?.description || ''})
Spouse Attraction: ${meetingData.spouseAttraction?.genderSpecific || 'Not calculated'}
` : '';

      return `
${basicInfo}
SPOUSE PREDICTION DATA:
Physical: ${spousePData?.physique?.height || 'Average'}, ${spousePData?.physique?.build || 'Average'}, ${spousePData?.physique?.complexion || 'Fair'}
Career Field: ${spouseDetailedProfile.career.field}
Personality: ${spouseDetailedProfile.personality.keyTraits.join(', ')}
Direction: ${spouseDetailedProfile.meetingCircumstances.direction}
${meetingInfo}
PLANETARY POSITIONS: ${simplifiedPlanets}

Describe ${chart.name}'s future spouse in vivid detail. Include what attracts the spouse to ${chart.name}.
`;

    case 'SEXUAL_PROFILE':
      return `
${basicInfo}
KEY INDICATORS:
Mars: ${chart.planetaryPositions.find(p => p.planet === 'Mars')?.sign || 'Unknown'} in House ${chart.planetaryPositions.find(p => p.planet === 'Mars')?.house || '?'}
Venus: ${chart.planetaryPositions.find(p => p.planet === 'Venus')?.sign || 'Unknown'} in House ${chart.planetaryPositions.find(p => p.planet === 'Venus')?.house || '?'}
Moon: ${getMoonSign(chart)} in House ${chart.planetaryPositions.find(p => p.planet === 'Moon')?.house || '?'}
8th House Planets: ${chart.houses.find(h => h.houseNumber === 8)?.planets?.join(', ') || 'None'}
12th House Planets: ${chart.houses.find(h => h.houseNumber === 12)?.planets?.join(', ') || 'None'}

Provide a respectful intimacy and romantic profile analysis for ${chart.name}.
`;

    case 'PSYCHOLOGICAL_PROFILE':
      return `
${basicInfo}
PSYCHOLOGICAL INDICATORS:
Moon: ${getMoonSign(chart)} in House ${chart.planetaryPositions.find(p => p.planet === 'Moon')?.house || '?'}
Mercury: ${chart.planetaryPositions.find(p => p.planet === 'Mercury')?.sign || 'Unknown'} in House ${chart.planetaryPositions.find(p => p.planet === 'Mercury')?.house || '?'}
Venus: ${chart.planetaryPositions.find(p => p.planet === 'Venus')?.sign || 'Unknown'} in House ${chart.planetaryPositions.find(p => p.planet === 'Venus')?.house || '?'}
Rahu: House ${chart.planetaryPositions.find(p => p.planet === 'Rahu')?.house || '?'}
Ketu: House ${chart.planetaryPositions.find(p => p.planet === 'Ketu')?.house || '?'}
Saturn: ${chart.planetaryPositions.find(p => p.planet === 'Saturn')?.sign || 'Unknown'} in House ${chart.planetaryPositions.find(p => p.planet === 'Saturn')?.house || '?'}

MARRIAGE CHALLENGES: ${marriagePotential.challenges.join(', ') || 'None identified'}

Analyze ${chart.name}'s psychological and emotional patterns affecting relationships.
`;

    case 'PERSONAL_REMEDIES':
      if (!remedies) return `${basicInfo}\nPlease generate remedies analysis first.`;

      const gem = remedies.gemstone?.stone ? `Gem: ${remedies.gemstone.stone}` : 'No gemstone suggested';
      const mantra = remedies.mantras?.primary ? `Mantra: ${remedies.mantras.primary.mantra} (${remedies.mantras.primary.meaning})` : 'No specific mantra';

      return `
${basicInfo}
IDENTIFIED ISSUES:
${marriagePotential.challenges.map((c: string) => `- ${c}`).join('\n')}
Doshas: ${isManglik ? 'Manglik' : 'None'}, ${isKalsarp ? 'Kalsarp' : 'None'}

SUGGESTED GENERATED REMEDIES:
${gem}
${mantra}

Provide a structured, personalized remedy plan for ${chart.name}.
`;

    case 'QUICK_COMPATIBILITY':
      if (!partnerChart) return "Please provide data for a partner to compare.";
      return `
${basicInfo}
PARTNER PROFILE:
Name: ${partnerChart.name}
Gender: ${partnerChart.gender}
Ascendant: ${partnerChart.ascendant}
Moon Sign: ${getMoonSign(partnerChart)}

Generate a quick compatibility assessment between ${chart.name} and ${partnerChart.name}.
`;

    case 'MARRIAGE_POTENTIAL_DEEP_DIVE':
      return `
${basicInfo}
MARRIAGE POTENTIAL:
Score: ${marriagePotential.score}/100 (${marriagePotential.verdict})
7th House Strength: ${marriagePotential.seventhHouseStrength}%
Navamsa Quality: ${marriagePotential.navamsaQuality}%
Strengths: ${marriagePotential.strengths.join(', ')}
Challenges: ${marriagePotential.challenges.join(', ')}

PLANETARY POSITIONS: ${simplifiedPlanets}

DOSHAS:
Manglik: ${isManglik ? 'Yes' : 'No'}
Kalsarp: ${isKalsarp ? 'Yes' : 'No'}
All Doshas: ${doshaAnalysis.doshas.filter(d => d.present).map(d => d.name).join(', ') || 'None'}

Provide a comprehensive deep-dive analysis of ${chart.name}'s marriage potential.
`;

    case 'ASTRO_MIND_SELF':
      return `${basicInfo}\nPLANETARY POSITIONS: ${simplifiedPlanets}\n\nAnswer ${chart.name}'s question based on their chart data.`;

    case 'RISK_RADAR_ANALYSIS':
      const riskPatterns = selfReport.relationshipPatterns;
      const mhRisk = selfReport.mentalHealth;
      const addRisk = selfReport.addictionRisk;
      return `
${basicInfo}
RISK INDICATORS:
Marriage Delay Indicators: ${marriagePotential.delayIndicators.join(', ') || 'None'}
Relationship Pattern Risk: ${riskPatterns?.overallRiskLevel || 'unknown'}
Mental Health: ${mhRisk?.overallWellbeing || 'unknown'} (Risk Score: ${mhRisk?.totalRiskScore || 0})
Addiction Risk: ${(addRisk as any)?.levels?.overall || 'unknown'}
Doshas Present: ${doshaAnalysis.doshas.filter(d => d.present).map(d => `${d.name} (${d.severity})`).join(', ') || 'None'}
Challenges: ${marriagePotential.challenges.join(', ')}

PLANETARY POSITIONS: ${simplifiedPlanets}

Analyze ${chart.name}'s personal risk profile across all dimensions. Be specific about which planets cause which risks.
`;

    case 'CONFLICT_TENDENCY':
      const mars = chart.planetaryPositions.find(p => p.planet === 'Mars');
      const saturn = chart.planetaryPositions.find(p => p.planet === 'Saturn');
      const mercury = chart.planetaryPositions.find(p => p.planet === 'Mercury');
      return `
${basicInfo}
CONFLICT INDICATORS:
Mars: ${mars?.sign || 'Unknown'} in House ${mars?.house || '?'} ${mars?.isRetrograde ? '(Retrograde)' : ''}
Saturn: ${saturn?.sign || 'Unknown'} in House ${saturn?.house || '?'} ${saturn?.isRetrograde ? '(Retrograde)' : ''}
Mercury: ${mercury?.sign || 'Unknown'} in House ${mercury?.house || '?'} ${mercury?.isRetrograde ? '(Retrograde)' : ''}
Moon: ${getMoonSign(chart)} in House ${chart.planetaryPositions.find(p => p.planet === 'Moon')?.house || '?'}

EXISTING CHALLENGES: ${marriagePotential.challenges.join(', ')}

Analyze ${chart.name}'s conflict tendencies in relationships — anger, stress, communication friction, and compromise ability.
`;

    case 'IDEAL_PARTNER_DEEP':
      const spouseP = selfReport.spousePrediction;
      const detailedP = selfReport.spouseDetailedProfile;
      return `
${basicInfo}
7TH HOUSE DATA:
Venus: ${chart.planetaryPositions.find(p => p.planet === 'Venus')?.sign || 'Unknown'} in House ${chart.planetaryPositions.find(p => p.planet === 'Venus')?.house || '?'}
7th Lord in: House ${chart.houses?.find(h => h.houseNumber === 7)?.planets?.join(', ') || 'None'}

SPOUSE PREDICTION:
${spouseP ? `Direction: ${(spouseP as any).direction || 'Unknown'}, Profession: ${(spouseP as any).profession || 'Unknown'}` : 'Basic prediction available'}
${detailedP ? `Appearance: ${detailedP.physicalAppearance?.height || ''} ${detailedP.physicalAppearance?.build || ''}, Career: ${detailedP.career?.field || ''}` : ''}

PLANETARY POSITIONS: ${simplifiedPlanets}

Paint a vivid, detailed portrait of ${chart.name}'s ideal life partner — who they are, what they look like, their career, values, and how they'll meet.
`;

    case 'MARRIAGE_READINESS':
      return `
${basicInfo}
READINESS INDICATORS:
Marriage Score: ${marriagePotential.score}/100 (${marriagePotential.verdict})
7th House: ${marriagePotential.seventhHouseStrength}%, Navamsa: ${marriagePotential.navamsaQuality}%, Dasha: ${marriagePotential.dashaSupport}%
Quality: ${marriagePotential.marriageQuality}
Strengths: ${marriagePotential.strengths.join(', ')}
Challenges: ${marriagePotential.challenges.join(', ')}
Delays: ${marriagePotential.delayIndicators.join(', ') || 'None'}
Mental Health: ${selfReport.mentalHealth?.overallWellbeing || 'unknown'}
Severe Doshas: ${doshaAnalysis.doshas.filter(d => d.severity === 'severe' && d.present).map(d => d.name).join(', ') || 'None'}

Evaluate ${chart.name}'s marriage readiness. Score each dimension and provide a preparation plan.
`;

    case 'VULNERABILITY_TIMELINE':
      const favP = timingForecast?.favorablePeriods || [];
      const cautP = timingForecast?.cautionaryPeriods || [];
      return `
${basicInfo}
TIMING DATA:
Current Dasha: ${selfReport.timing.partnerA.currentDasha || 'Unknown'}
Next Window: ${timingForecast?.nextMarriageWindow?.yearRange || 'Calculating...'}
Current Phase: ${timingForecast?.currentPhase?.name || 'Unknown'}

FAVORABLE PERIODS:
${favP.slice(0, 5).map((p: any) => `- ${p.dates}: ${p.dashaPeriod} (${p.confidence}% confidence)`).join('\n') || 'None identified'}

CAUTIONARY PERIODS:
${cautP.slice(0, 5).map((p: any) => `- ${p.dates}: ${p.reason}`).join('\n') || 'None identified'}

PLANETARY POSITIONS: ${simplifiedPlanets}

Provide a detailed timeline analysis for ${chart.name}'s marriage journey — when to act, when to wait.
`;

    default:
      return `${basicInfo}\nPLANETARY POSITIONS: ${simplifiedPlanets}\n\nAnalyze ${chart.name}'s chart regarding: ${type}`;
  }
}

export default SELF_SYSTEM_PROMPTS;
