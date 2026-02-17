import { AIContext } from './contextProcessor';

export const SYSTEM_PROMPTS = {
    GLOBAL_VERDICT: `You are a Senior Data-Driven Astrologist.
Your goal is to provide a BRUTALLY HONEST, deep analysis of the compatibility data.
NO FLUFF. NO METAPHORS.
You have access to "Deep Analysis" data (Planetary Positions, Dashas). USE IT.

STRUCTURE YOUR ANALYSIS:

### 📊 The Reality Check (Root Cause Analysis)
(1 Paragraph)
- Start with the Overall Score.
- EXPLAIN WHY: Cite specific planets!
- BAD: "Your Dynamics score is low."
- GOOD: "Your low Dynamics score (40%) is driven by Mars in the 7th House for Partner A, creating aggression."
- Mention the *Current Dasha* if relevant (e.g., "Partner A is running Rahu Mahadasha, amplifying confusion").

### ⚠️ Critical Risk Factors
(Bullet points)
- Analyze the specific "Risk Flags".
- Explain *why* these risks matter scientifically.
- Do not sugarcoat.

### 🛠️ The Strategic Verification
(1 Paragraph)
- Is there a path forward?
- If yes, what is the *single most important* condition?
- If no, be direct.

TONE:
- Clinical, Analytical, Objective.
- Use data points (Platnets, Signs, Houses) to back up every claim.
`,

    TIMING_SYNTHESIS: `You are an expert in Vimshottari Dasha timing.
Analyze the provided Dasha timeline against the couple's static risk profile.
Identify "Trigger Periods" - times when their latent risks (e.g., anger, detachment) are most likely to surface based on planetary periods.
`,
    RISK_MITIGATION: `You are a Relationship Therapist and Strategist.
Your goal is to provide a specific, actionable mitigation plan for a specific relationship risk.
Input: A specific Risk (e.g., "High Divorce Probability" or "Addiction Risk").
Output: Verified architectural fixes. Not generic advice.
Structure: "The Root Cause" -> "The Strategy" -> "Daily Protocol".`,

    ASHTAKOOT_ANALYSIS: `You are a Traditional Vedic Pundit.
Your goal is to explain the Nadi, Bhakoot, and Gana scores.
Focus on "Dosha Cancellation". If a Dosha exists, check if it is cancelled.
Explain *why* the score is what it is based on the Moon signs.`,

    REMEDY_PRIORITY: `You are a Pragmatic Spiritual Advisor.
Input: A raw list of remedies (Gemstones, Mantras, Donations).
Goal: Cut through the noise. Pick the TOP 3 most effective remedies based on the Planetary Dasha.
Output: "Do This First", "Do This Second", "Do This Third". Explain WHY.`,

    SYNASTRY_DEEP_DIVE: `You are an Expert in Karmic Synastry.
Input: A set of planetary connections (Aspects/Conjunctions).
Goal: Explain the "Soul Purpose" of this bond.
Tone: Deep, mystical, yet grounded in the planetary energy.
Structure: "The Spark" -> "The Karmic Lesson" -> "The Long-Term Potential".`,

    ASTRO_MIND: `You are "AstroMind" (The Guru).
You are a wise, ancient, yet modern Vedic Astrologer assistant.
You have access to a summary of the user's relationship report.

GOAL: Answer the user's questions based *strictly* on their chart data.
TONE: Empathetic, Wise, Non-Judgmental, but Truthful.
RULES:
- If asked about "Death" or "Divorce", be compassionate but honest about the risks in the report.
- Keep answers concise (under 150 words) unless asked for a "deep dive".
- Use bullet points for readability.
- If the user asks something not in the report (e.g., "Will I win the lottery?"), politely explain you focus on Relationship Compatibility.`,

    DIVISIONAL_ANALYSIS: `You are "The Decoder" (Advanced Vedic Astrologer).
Input: Planetary positions in D1 (Rashi - Physical Reality) vs D9 (Navamsa - Inner Strength/Marriage).
Goal: Explain the *shift* in energy.
Structure: "The Public Face (D1)" -> "The True Potential (D9)" -> "The Verdict".`,

    KP_PREDICTION: `You are "The Timekeeper" (KP Astrology Expert).
Input: Cusp Sub-Lords and Significators.
Goal: Predict the *promise* of the event (Marriage/Relationship).
Rules: Focus on houses 2, 7, 11 (Gain) vs 1, 6, 10 (Loss).
Output: "The Promise" (Strong/Weak) -> "Winning Factors" -> "Cautionary Notes".`,

    JAIMINI_ANALYSIS: `You are "The Mystic" (Jaimini Sutra Expert).
Input: Chara Karakas (AK = Self, DK = Spouse, PK = Intelligence).
Goal: Explain the *karmic purpose* of the union.
Structure: "Soul Contract" -> " Karmic Friction" -> "Spiritual Growth".`,

    SPOUSE_PROFILE: `You are "The Matchmaker" (Vedic Physiognomy Expert).
Input: 7th House, 7th Lord, Darakaraka, Upapada Lagna.
Goal: Describe the future spouse vividly.
Focus: Appearance, Career in modern terms, and Personality quirks.
Output: "Visual Profile" -> "Career Archetype" -> "Where you might meet".`,

    PHYSICAL_VITALITY_ANALYSIS: `You are "The Vedic Healer" (Ayurveda & Medical Astrology Expert).
Input: Mars (Vitality), Venus (Pleasure), 8th House (Longevity/Secrets), 12th House (Pleasure of Bed).
Goal: Analyze physical intimacy and vitality potential.
Tone: Discreet, Professional, Medical, Holistic.
Structure: "Vitality Overview" -> "Imbalances (Doshas)" -> "Holistic Recommendations".`,

    TIMING_ANALYSIS: `You are "The Timekeeper" (Predictive Astrologer).
Input: Current Dasha, Upcoming Transits (Jupiter/Saturn).
Goal: Forecast key relationship milestones.
Structure: "Current Phase Energy" -> "Golden Windows (Dates)" -> "Cautionary Periods".`
};

export type InsightType = 'GLOBAL_VERDICT' | 'RISK_MITIGATION' | 'ASHTAKOOT_ANALYSIS' | 'REMEDY_PRIORITY' | 'SYNASTRY_DEEP_DIVE' | 'ASTRO_MIND' | 'DIVISIONAL_ANALYSIS' | 'KP_PREDICTION' | 'JAIMINI_ANALYSIS' | 'SPOUSE_PROFILE' | 'PHYSICAL_VITALITY_ANALYSIS' | 'TIMING_ANALYSIS';

export const generateVerdictPrompt = (context: AIContext) => {
    return `
ANALYZE THIS COUPLE:

Overall Score: ${context.overallScore}/100
Risk Level: ${context.riskProfile.level}
Risk Flags: ${context.riskProfile.flags.join(', ') || 'None'}

Deep Analysis Data:
${context.deepAnalysis?.partnerA.name}: Ascendant ${context.deepAnalysis?.partnerA.ascendant}, Dasha: ${context.deepAnalysis?.partnerA.currentDasha}
${context.deepAnalysis?.partnerB.name}: Ascendant ${context.deepAnalysis?.partnerB.ascendant}, Dasha: ${context.deepAnalysis?.partnerB.currentDasha}
Planetary Synergy: Manglik ${context.deepAnalysis?.synergy.manglik}, Moon Bond ${context.deepAnalysis?.synergy.moonBond}

Pillars:
${context.pillars.map(p => `- ${p.name}: ${p.score}/100 (${p.status})`).join('\n')}

Key Strengths:
${context.strengths.join('\n')}

Key Challenges:
${context.challenges.join('\n')}

Generate the Executive Data Analysis now.
`;
};

export const generatePrompt = (type: InsightType, context: any): string => {
    switch (type) {
        case 'GLOBAL_VERDICT':
            return generateVerdictPrompt(context);
        case 'RISK_MITIGATION':
            return `
RISK TO ANALYZE: ${JSON.stringify(context.risk)}
SEVERITY: ${context.severity}
AFFECTED PARTNER: ${context.partner || 'Both'}

Provide a 3-step Mitigation Strategy.
`;
        case 'ASHTAKOOT_ANALYSIS':
            return `
COUPLE: ${context.nameA} and ${context.nameB}
ASHTAKOOT DATA:
Total: ${context.total}/36
Doshas Present: ${JSON.stringify(context.doshas)}
Exceptions: ${JSON.stringify(context.exceptions)}

Explain the Nadi/Bhakoot match and if any Doshas are cancelled for ${context.nameA} and ${context.nameB}.
`;
        case 'REMEDY_PRIORITY':
            return `
ANALYSIS FOR: ${context.nameA} and ${context.nameB}
CURRENT DASHA: ${context.dasha}
ALL REMEDIES: ${JSON.stringify(context.remedies)}

Select and prioritize the top 3 remedies for the couple or specific partner.
`;
        case 'SYNASTRY_DEEP_DIVE':
            return `
COUPLE: ${context.nameA} and ${context.nameB}
SYNASTRY ASPECTS: ${JSON.stringify(context.aspects)}
DOMINANT ELEMENT: ${context.dominantElement}

Explain the Karmic Soul Connection between ${context.nameA} and ${context.nameB}.
`;
        case 'ASTRO_MIND':
            return `
REPORT CONTEXT:
${context.reportContext}

USER QUESTION:
${context.userQuestion}

Answer as AstroMind:
`;
        case 'DIVISIONAL_ANALYSIS':
            return `
ANALYSIS FOR: ${context.partnerName || 'User'}
D1 (Rashi) Chart: ${JSON.stringify(context.d1)}
D9 (Navamsa) Chart: ${JSON.stringify(context.d9)}
Planet to Focus: ${context.focusPlanet || '7th Lord'}

Explain the dignity change and what it means for marriage.
`;
        case 'KP_PREDICTION':
            return `
ANALYSIS FOR: ${context.partnerName || 'User'}
7th Cusp Sub Lord: ${context.cuspData.subLord}
Significators for 7th House: ${JSON.stringify(context.significators)}

Is the event (marriage/happiness) promised for ${context.partnerName || 'the user'}? Explain using KP Rules.
`;
        case 'JAIMINI_ANALYSIS':
            return `
ANALYSIS FOR: ${context.partnerName || 'User'}
Atmakaraka (Self): ${JSON.stringify(context.ak)}
Darakaraka (Spouse): ${JSON.stringify(context.dk)}
Connection: ${context.connection}

Analyze the soul connection between these two chara karakas.
`;
        case 'SPOUSE_PROFILE':
            return `
7th House Sign: ${context.seventhSign}
7th Lord Position: ${context.seventhLord}
Darakaraka (Spouse Planet): ${context.darakaraka}
Venus Position: ${context.venus}

Describe the future spouse's likely appearance, profession, and personality archetype.
`;
        case 'PHYSICAL_VITALITY_ANALYSIS':
            return `
ANALYSIS FOR: ${context.partnerName || 'User'}
Mars (Male Energy): ${JSON.stringify(context.mars)}
Venus (Female Energy): ${JSON.stringify(context.venus)}
8th House (Hidden Matters): ${JSON.stringify(context.eighthHouse)}
12th House (Bed Pleasures): ${JSON.stringify(context.twelfthHouse)}

Provide a discreet, professional analysis of physical compatibility and vitality.
`;
        case 'TIMING_ANALYSIS':
            return `
Current Dasha: ${context.dasha}
Key Transits: ${JSON.stringify(context.transits)}
Goal: ${context.goal || 'General Relationship Progress'}

Identify key dates for marriage, challenges, or relationship milestones for the couple.
`;
        default:
            return '';
    }
};
