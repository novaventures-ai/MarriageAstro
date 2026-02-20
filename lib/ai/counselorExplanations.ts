/**
 * Enhanced AI Counselor Explanations
 * Provides detailed, opinionated analysis like a real astrologer/counselor
 */

import { Chart } from '@types';
import { MatchInsight } from './matchInsight';

export interface CounselorExplanation {
    // The "Why"
    whyThisMatch: string;

    // Comparison with others
    comparisonWithOthers: MatchComparison[];

    // AI Counselor Opinion
    counselorOpinion: string;

    // Why it should work
    successFactors: SuccessFactor[];

    // What others lack
    otherMatchesShortcomings: Shortcoming[];

    // Practical advice
    practicalAdvice: string[];

    // Long-term outlook
    longTermOutlook: string;

    // Compatibility narrative
    compatibilityStory: string;
}

export interface MatchComparison {
    partnerName: string;
    score: number;
    thisMatchAdvantage: string;
    keyDifference: string;
    recommendation: string;
}

export interface SuccessFactor {
    factor: string;
    explanation: string;
    astrologicalBasis: string;
    impact: 'critical' | 'major' | 'moderate';
}

export interface Shortcoming {
    partnerName: string;
    lackingFactor: string;
    impact: string;
    severity: 'dealbreaker' | 'concerning' | 'manageable';
}

/**
 * Generate detailed AI Counselor explanation
 */
export function generateCounselorExplanation(
    selfChart: Chart,
    partnerChart: Chart,
    partnerName: string,
    insight: MatchInsight,
    allMatches: MatchInsight[],
    rankingFactors: any[]
): CounselorExplanation {

    // Get self Moon sign
    const selfMoon = selfChart.planetaryPositions.find(p => p.planet === 'Moon');
    const partnerMoon = partnerChart.planetaryPositions.find(p => p.planet === 'Moon');

    // Get self Venus sign
    const selfVenus = selfChart.planetaryPositions.find(p => p.planet === 'Venus');
    const partnerVenus = partnerChart.planetaryPositions.find(p => p.planet === 'Venus');

    // Get self Mars sign
    const selfMars = selfChart.planetaryPositions.find(p => p.planet === 'Mars');
    const partnerMars = partnerChart.planetaryPositions.find(p => p.planet === 'Mars');

    // Generate comparison with other matches
    const comparisonWithOthers: MatchComparison[] = allMatches
        .filter(m => m.partnerId !== insight.partnerId)
        .map(otherMatch => {
            const scoreDiff = insight.score - otherMatch.score;
            let advantage = '';
            let keyDiff = '';

            if (scoreDiff >= 15) {
                advantage = `Significantly stronger compatibility (${scoreDiff} points higher)`;
                keyDiff = 'Overall harmony and alignment';
            } else if (scoreDiff >= 8) {
                advantage = `Clearly better match (${scoreDiff} points higher)`;
                keyDiff = 'Better emotional and mental connection';
            } else if (scoreDiff > 0) {
                advantage = `Slightly better compatibility (${scoreDiff} points higher)`;
                keyDiff = 'More favorable planetary positions';
            } else {
                advantage = 'Comparable compatibility';
                keyDiff = 'Different strengths and challenges';
            }

            return {
                partnerName: otherMatch.partnerName,
                score: otherMatch.score,
                thisMatchAdvantage: advantage,
                keyDifference: keyDiff,
                recommendation: scoreDiff > 10
                    ? `Strongly prefer ${partnerName} over ${otherMatch.partnerName}`
                    : scoreDiff > 5
                        ? `${partnerName} is a better choice than ${otherMatch.partnerName}`
                        : `Both have potential, but ${partnerName} has edge`
            };
        });

    // Generate "Why This Match"
    const whyThisMatch = generateWhyThisMatch(
        partnerName,
        insight,
        selfMoon,
        partnerMoon,
        selfVenus,
        partnerVenus,
        comparisonWithOthers
    );

    // Generate Counselor Opinion
    const counselorOpinion = generateCounselorOpinion(
        partnerName,
        insight,
        comparisonWithOthers,
        rankingFactors
    );

    // Generate Success Factors
    const successFactors = generateSuccessFactors(
        partnerName,
        insight,
        selfMoon,
        partnerMoon,
        selfVenus,
        partnerVenus,
        selfMars,
        partnerMars
    );

    // Generate what others lack
    const otherMatchesShortcomings = generateShortcomings(
        allMatches.filter(m => m.partnerId !== insight.partnerId),
        insight
    );

    // Generate practical advice
    const practicalAdvice = generatePracticalAdvice(insight, comparisonWithOthers);

    // Generate long-term outlook
    const longTermOutlook = generateLongTermOutlook(
        partnerName,
        insight,
        successFactors
    );

    // Generate compatibility story
    const compatibilityStory = generateCompatibilityStory(
        partnerName,
        selfChart,
        partnerChart,
        insight,
        successFactors
    );

    return {
        whyThisMatch,
        comparisonWithOthers,
        counselorOpinion,
        successFactors,
        otherMatchesShortcomings,
        practicalAdvice,
        longTermOutlook,
        compatibilityStory
    };
}

function generateWhyThisMatch(
    partnerName: string,
    insight: MatchInsight,
    selfMoon: any,
    partnerMoon: any,
    selfVenus: any,
    partnerVenus: any,
    comparisons: MatchComparison[]
): string {
    let reasons: string[] = [];

    // Start with a strong, intuitive opening
    reasons.push(`**${partnerName} emerged as your most compatible destiny partner** after analyzing multiple energetic layers. This connection stands out not just in numbers, but in how your lives naturally weave together.`);

    // Emotional connection - Intuitive wording
    if (insight.strengths.includes('Emotional Harmony')) {
        reasons.push(`**Soul-Level Resonance**: Your Moon signs (${selfMoon?.sign} and ${partnerMoon?.sign}) indicate a rare emotional sync. You won't just communicate; you'll "feel" each other's moods intuitively. This creates a safe sanctuary where words aren't always needed for understanding.`);
    }

    // Mental connection
    if (insight.strengths.includes('Mental Friendship')) {
        reasons.push(`**Intellectual Kinship**: Your thinking patterns aren't just similar—they're complementary. You'll find that conversations flow with a "best friend" ease, making life's major decisions feel like a shared adventure rather than a negotiation.`);
    }

    // Overall score context - Professional tone
    if (insight.score >= 80) {
        reasons.push(`**Exceptional Cosmic Alignment**: A ${insight.score}% match is a significant indicator of long-term success. The planetary aspects suggest a relationship built on mutual growth, deep trust, and shared spiritual evolution.`);
    } else if (insight.score >= 65) {
        reasons.push(`**Strong Foundation**: At ${insight.score}%, this is a robust and reliable match. The universe provides a very solid base; with conscious care, this can blossom into a life-long supportive partnership.`);
    }

    // Comparison context - intuitive wording
    if (comparisons.length > 0) {
        const bestComparison = comparisons[0];
        reasons.push(`**A Clearer Choice**: Compared to ${bestComparison.partnerName}, your connection with ${partnerName} offers **${bestComparison.thisMatchAdvantage.toLowerCase()}**. The energetic friction is lower here, allowing for a more graceful journey together.`);
    }

    return reasons.join('\n\n');
}

function generateCounselorOpinion(
    partnerName: string,
    insight: MatchInsight,
    comparisons: MatchComparison[],
    rankingFactors: any[]
): string {
    const opinions: string[] = [];

    // Professional astrologer tone
    opinions.push(`### Professional Astrological Assessment`);

    if (insight.score >= 80) {
        opinions.push(`As an analyst, I find this match exceptionally rare. **${partnerName} represents a "Soul Contract" alignment**—it is a connection that feels pre-destined. The planetary harmony is so pronounced that you will likely find even your growth-pains are productive rather than destructive.`);
    } else if (insight.score >= 65) {
        opinions.push(`My professional assessment is very positive. **${partnerName} provides one of the healthiest astrological structures I have seen for your profile.** While no match is perfect, the strengths here significantly outweigh the challenges. I recommend proceeding with full heart and confidence.`);
    } else {
        opinions.push(`This match with **${partnerName} is your most strategic path forward** among current options. While the ${insight.score}% score indicates some areas for conscious work, the core pillars are workable. Success here will depend on "Astrological Awareness"—using these insights to navigate rough patches early.`);
    }

    // Add specific observations
    const topFactors = rankingFactors
        .filter(f => f.impact === 'high' && f.score >= 70)
        .slice(0, 2);

    if (topFactors.length > 0) {
        opinions.push(`#### Key Pillars of Support:`);
        topFactors.forEach(factor => {
            opinions.push(`* **${factor.name}**: ${factor.description}. This acts as a stabilizer for the entire relationship.`);
        });
    }

    // Add advice
    if (insight.challenges.length > 0) {
        opinions.push(`#### Conscious Awareness Needed:`);
        opinions.push(`Observe how you both handle: **${insight.challenges.join(', ')}**. These are your growth catalysts. By addressing these early with total transparency, you effectively "neutralize" the risk patterns.`);
    }

    return opinions.join('\n\n');
}

function generateSuccessFactors(
    partnerName: string,
    insight: MatchInsight,
    selfMoon: any,
    partnerMoon: any,
    selfVenus: any,
    partnerVenus: any,
    selfMars: any,
    partnerMars: any
): SuccessFactor[] {
    const factors: SuccessFactor[] = [];

    // Emotional foundation
    factors.push({
        factor: 'Instinctive Empathy',
        explanation: `Your Moon signs create a direct psychic-emotional link. You will often know what the other needs before they ask.`,
        astrologicalBasis: `Moon Resonance: ${selfMoon?.sign} (You) / ${partnerMoon?.sign} (${partnerName})`,
        impact: 'critical'
    });

    // Love expression
    if (selfVenus && partnerVenus) {
        factors.push({
            factor: 'Aligned Love Languages',
            explanation: `Venus placements suggest you "speak" the same affection code. You will feel appreciated and cherished in exactly the way you prefer.`,
            astrologicalBasis: `Venus Alignment in ${selfVenus?.sign} & ${partnerVenus?.sign}`,
            impact: 'major'
        });
    }

    // Traditional compatibility
    factors.push({
        factor: 'Vedic Foundational Strength',
        explanation: `A traditional score of **${insight.rawScore}/36 Gunas** provides a robust cultural and dharmic foundation for this union.`,
        astrologicalBasis: 'Ashtakoot Milan (Vedic 8-point check)',
        impact: 'critical'
    });

    // Physical/Passion
    if (selfMars && partnerMars) {
        factors.push({
            factor: 'Compatible Vitality',
            explanation: `Your energy levels and passion drives move at a similar pace, reducing friction in daily active life.`,
            astrologicalBasis: `Mars Synergy in ${selfMars?.sign} & ${partnerMars?.sign}`,
            impact: 'moderate'
        });
    }

    return factors;
}

function generateShortcomings(
    otherMatches: MatchInsight[],
    bestMatch: MatchInsight
): Shortcoming[] {
    const shortcomings: Shortcoming[] = [];

    otherMatches.forEach(match => {
        const diff = bestMatch.score - match.score;

        if (diff >= 15) {
            shortcomings.push({
                partnerName: match.partnerName,
                lackingFactor: 'Core Energetic Harmony',
                impact: `Significant "effort-gap" (${diff} points lower compatibility)`,
                severity: 'concerning'
            });
        }

        if (match.challenges.includes('Nadi Dosha') && !bestMatch.challenges.includes('Nadi Dosha')) {
            shortcomings.push({
                partnerName: match.partnerName,
                lackingFactor: 'Biological/Dharmic Health',
                impact: 'Traditional risk to lineage and progeny health',
                severity: 'dealbreaker'
            });
        }

        if (match.challenges.includes('Manglik Mismatch') && !bestMatch.challenges.includes('Manglik Mismatch')) {
            shortcomings.push({
                partnerName: match.partnerName,
                lackingFactor: 'Temperament Balance',
                impact: 'Frequent energetic clashes and heated arguments',
                severity: 'concerning'
            });
        }
    });

    return shortcomings;
}

function generatePracticalAdvice(
    insight: MatchInsight,
    comparisons: MatchComparison[]
): string[] {
    const advice: string[] = [];

    advice.push(`### Path to a Thriving Relationship`);

    if (insight.score >= 75) {
        advice.push(`1. **Move with Certainty**: With a ${insight.score}% cosmic green-light, this match is a rare opportunity. Don't let minor daily irritations distract you from the grand alignment.`);
        advice.push(`2. **Prioritize Transparency**: Because your minds are in sync, any lack of honesty will be "felt" immediately. Keep the air clear.`);
        advice.push(`3. **Shared Spiritual Growth**: You are both meant to evolve. Engage in shared interests or meditation to amplify your bond.`);
    } else {
        advice.push(`1. **Constructive Commitment**: At ${insight.score}%, success is a choice. You have all the tools, but you must use them consciously.`);
        advice.push(`2. **Bridge the Gaps**: Use your **${insight.strengths.slice(0, 2).join(' and ')}** as a fallback whenever other areas feel strained.`);
        advice.push(`3. **Early Mitigation**: Don't ignore **${insight.challenges.join(' or ')}**. Addressing these now ensures they don't become ingrained habits.`);
    }

    if (comparisons.length > 0) {
        advice.push(`4. **Strategic Choice**: Based on the data, **${comparisons[0].recommendation}**. Your highest probability for peace lies here.`);
    }

    return advice;
}

function generateLongTermOutlook(
    partnerName: string,
    insight: MatchInsight,
    successFactors: SuccessFactor[]
): string {
    const outlooks: string[] = [];

    outlooks.push(`### Long-Term Potential`);

    if (insight.score >= 80) {
        outlooks.push(`The future with **${partnerName}** is luminous. Astrological indicators point to:`);
        outlooks.push(`* **Synchronized Evolution**: You won't outgrow each other; you'll grow together.`);
        outlooks.push(`* **Legacy of Peace**: This match supports a peaceful and stable home environment.`);
        outlooks.push(`* **High Resilience**: You will bounce back from life's external stresses with ease.`);
    } else if (insight.score >= 65) {
        outlooks.push(`The outlook for your union with **${partnerName}** is grounded and positive:`);
        outlooks.push(`* **Productive Partnership**: You will work very well as a team in worldly matters.`);
        outlooks.push(`* **Earned Harmony**: Your connection will get richer and deeper as the years go by.`);
        outlooks.push(`* **Sustainable Connection**: This match has the durability for a lifetime commitment.`);
    } else {
        outlooks.push(`The long-term path with **${partnerName}** requires "Active Custodianship":`);
        outlooks.push(`* **Mutual Effort**: Success is highly dependent on both partners' willingness to adapt.`);
        outlooks.push(`* **Growth Through Challenge**: This union is a powerful teacher for both of you.`);
        outlooks.push(`* **Consciously Created Stability**: You can build a great life, but it won't be on "autopilot".`);
    }

    return outlooks.join('\n\n');
}

function generateCompatibilityStory(
    partnerName: string,
    selfChart: Chart,
    partnerChart: Chart,
    insight: MatchInsight,
    successFactors: SuccessFactor[]
): string {
    const story: string[] = [];

    story.push(`### The Cosmic Narrative: You & ${partnerName}`);

    story.push(`When your energetic paths crossed, the universe began a new chapter. This isn't just a meeting; it is an **alignment of destinies** that have been seeking this specific frequency.`);

    if (insight.strengths.includes('Emotional Harmony')) {
        story.push(`Your emotional lives are like two rivers flowing into the same sea. There is a "coming home" feeling when you are together—a profound safety that allows your truest selves to emerge without fear of judgment.`);
    }

    story.push(`#### The Road Ahead`);

    if (insight.score >= 75) {
        story.push(`This is a story of **Ascension**. Together, you will reach higher and experience more than you ever could apart. The stars see a sanctuary where both partners feel nourished, inspired, and fundamentally understood.`);
    } else {
        story.push(`This is a story of **Discovery**. You will each be a mirror for the other, reflecting both strengths and areas for growth. It is a journey of deep learning and eventual, hard-won harmony.`);
    }

    story.push(`\n> **The Final Word**: Trust the stars, but remember that you hold the pen. With a **${insight.score}% foundation**, you have a magnificent start. The masterpiece you build from here is yours to create.`);

    return story.join('\n\n');
}

export default generateCounselorExplanation;
