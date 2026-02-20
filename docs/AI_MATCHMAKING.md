# AI Matchmaking Engine Documentation

## Overview

The AI Matchmaking Engine is a comprehensive astrological analysis system that evaluates potential partners across **15+ compatibility factors** to determine the best match. Unlike traditional scoring systems that rely solely on Ashtakoot (36 points), this AI analyzes every aspect of compatibility including:

- Traditional Vedic factors (Ashtakoot, Navamsa)
- Relationship dynamics (Synastry, emotional compatibility)
- Risk assessment (Divorce probability, infidelity indicators)
- Intimacy factors (Sexual compatibility, physical attraction)
- Timing analysis (Dasha alignment, favorable periods)
- Advanced indicators (KP Astrology, Jaimini, Divisional charts)
- Mental health compatibility
- Lifestyle and modern challenges

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 AI MATCHMAKING ENGINE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │  INPUT LAYER     │───▶│  ANALYSIS ENGINE │              │
│  │  - Self Chart    │    │  - 15+ Factors   │              │
│  │  - Partner Charts│    │  - Weighted      │              │
│  └──────────────────┘    │    Scoring       │              │
│                          └────────┬─────────┘              │
│                                   │                         │
│                                   ▼                         │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │  OUTPUT LAYER    │◀───│  EXPLANATION     │              │
│  │  - Best Match    │    │  GENERATOR       │              │
│  │  - All Scores    │    │  - Detailed      │              │
│  │  - Insights      │    │    Analysis      │              │
│  └──────────────────┘    │  - Evidence      │              │
│                          └──────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

## Factor Analysis (15 Categories)

### 1. Traditional Compatibility (25%)

#### Ashtakoot Milan (15%)
Analyzes 8 Vedic compatibility parameters:
- **Varna** (1 point): Social compatibility
- **Vashya** (2 points): Mutual attraction
- **Tara** (3 points): Destiny alignment
- **Yoni** (4 points): Physical compatibility
- **Graha Maitri** (5 points): Mental friendship
- **Gana** (6 points): Temperament match
- **Bhakoot** (7 points): Emotional harmony
- **Nadi** (8 points): Health/progeny compatibility

**Weight Distribution:**
- Total Score: 30%
- Nadi Match: 25% (most critical)
- Bhakoot Match: 20%
- Graha Maitri: 15%
- Gana Match: 10%

#### Navamsa Analysis (10%)
- D9 compatibility score
- Vargottama planets (strength indicators)
- Pushkar Navamsa placements (auspicious positions)

### 2. Relationship Dynamics (20%)

#### Synastry Analysis (12%)
Chart interaction analysis:
- **Soulmate Connections** (25%): Harmonious aspects between personal planets
- **Karmic Bonds** (20%): Saturn/Node connections
- **House Overlays** (20%): Planets activating partner's houses
- **Planetary Conjunctions** (20%): Shared sign placements
- **D9 Overlays** (15%): Navamsa chart interactions

#### Emotional Compatibility (8%)
- Moon sign harmony
- Venus-Jupiter connections
- Emotional support indicators

### 3. Risk Assessment (18%)

#### Risk Profile (12%)
- Divorce probability indicators
- Infidelity risk factors
- Manglik energy alignment
- Multiple marriage indicators

#### Dosha Analysis (6%)
- Nadi Dosha presence and cancellation
- Bhakoot Dosha impact
- Gana Dosha assessment

### 4. Intimacy Factors (12%)

#### Sexual Compatibility (8%)
- Yoni match (animal compatibility)
- Nakshatra psychological match
- Chemistry score from synastry
- Health compatibility

#### Physical Attraction (4%)
- Mars-Venus aspects
- Ascendant compatibility
- Physical indicators

### 5. Practical Factors (10%)

#### Timing (5%)
- Dasha alignment between partners
- Favorable marriage periods
- Transit support

#### In-Law Compatibility (5%)
- 2nd house analysis (family harmony)
- 10th house analysis (status/image)
- Mutual family integration potential

### 6. Advanced Indicators (8%)

#### KP Astrology (3%)
- Cusp Sub-Lord connections
- Significator harmony
- Ruling planet alignment

#### Jaimini Astrology (3%)
- Darakaraka (spouse significator) contact
- Soul link indicators
- Chara Karaka alignment

#### Divisional Charts (2%)
- D7 (progeny) analysis
- D60 (karmic destiny) assessment
- Varga strength evaluation

### 7. Mental & Lifestyle (7%)

#### Mental Health (3%)
- Stability indicators
- Stress handling compatibility
- Communication style match

#### Lifestyle (4%)
- Career alignment
- Modern challenges assessment
- Value compatibility

## Scoring Algorithm

### Weighted Scoring Formula

```typescript
Overall Score = Σ(Factor Score × Factor Weight)

Where:
- Each factor score: 0-100
- Sum of all weights = 1.0
- Result normalized to 0-100
```

### Penalty System

The AI applies intelligent penalties for doshas and risks:

| Condition | Penalty | Rationale |
|-----------|---------|-----------|
| Nadi Dosha (uncancelled) | -15% | Major health/progeny impact |
| Bhakoot Dosha (uncancelled) | -10% | Emotional disconnect risk |
| Manglik Mismatch | -10% | Energy imbalance |
| Gana Dosha (uncancelled) | -5% | Temperament challenges |
| High Divorce Risk (>60) | -20% | Stability concerns |
| High Infidelity Risk (>60) | -15% | Trust issues |

### Bonus System

Positive indicators receive bonuses:

| Condition | Bonus | Rationale |
|-----------|-------|-----------|
| Strong Graha Maitri (>4) | +5% | Mental harmony |
| Soulmate Connections (>3) | +8% | Natural affinity |
| Favorable Timing | +5% | Cosmic support |
| Dosha Cancellation | +10% | Overcoming challenges |

## Confidence Calculation

The AI calculates confidence based on:

```typescript
Confidence = 70 + 
  (factorsAnalyzed × 2) + 
  (clearIndicators × 2)

Max Confidence: 95%
```

Clear indicators are factors with scores ≥70 or ≤40 (not ambiguous middle scores).

## Recommendation Levels

Based on overall score and risk analysis:

| Level | Score Range | Risk Level | Description |
|-------|-------------|------------|-------------|
| **Highly Recommended** | ≥80 | No critical risks | Exceptional match |
| **Recommended** | 65-79 | ≤1 medium risk | Strong foundation |
| **Conditional** | 50-64 | ≤2 risks | Workable with effort |
| **Caution Advised** | 35-49 | Multiple risks | Significant challenges |
| **Not Recommended** | <35 | Critical risks | Major incompatibility |

## Explanation Generation

The AI generates detailed explanations across 4 tabs:

### 1. Overview
- Executive summary
- Category breakdown (6 categories)
- Compatibility signature

### 2. Strengths
- Top 3-5 strength areas
- Astrological basis
- Impact scores
- Unique advantages

### 3. Challenges
- All challenge areas
- Severity levels
- Mitigation strategies
- Risk factors

### 4. Evidence
- Astrological evidence
- Technical details
- Interpretations
- AI recommendation

## Usage Examples

### Basic Usage (Dashboard Widget)

```typescript
import { analyzeBestMatchSync } from '@lib/ai';

const bestMatch = analyzeBestMatchSync(selfChart, partners);
// Returns: { partnerId, partnerName, score, verdict, reason, strengths, challenges }
```

### Comprehensive Analysis

```typescript
import { analyzeAllPartners } from '@lib/ai';

const result = await analyzeAllPartners(selfChart, partners);
// Returns: {
//   bestMatch: AIMatchAnalysis,
//   allMatches: AIMatchAnalysis[],
//   comparisonSummary: string,
//   aiInsights: string[],
//   selectionRationale: string
// }
```

### Single Match Detailed Analysis

```typescript
import { generateComprehensiveMatchInsight } from '@lib/ai';

const { insight, fullAnalysis } = await generateComprehensiveMatchInsight(
  selfChart,
  partnerChart,
  partnerName,
  partnerId
);

// fullAnalysis contains:
// - categoryScores: Detailed breakdown
// - strengthAreas: All strengths with evidence
// - challengeAreas: All challenges with mitigations
// - explanationData: Detailed explanations
// - compatibilitySignature: 5-dimension profile
// - recommendation: AI recommendation level
// - confidence: Analysis confidence percentage
```

## Integration with UI

### CosmicMatchWidget

The widget displays:
1. **Best Match Card**: Partner name, score, verdict
2. **Strength Tags**: Green indicators
3. **Challenge Tags**: Red indicators
4. **Explain Button**: Opens detailed modal
5. **View Full Analysis Button**: Navigates to full report

### Detailed Analysis Modal

Tabs:
1. **Overview**: Summary + category scores
2. **Strengths**: Detailed strength analysis
3. **Challenges**: Issues + mitigation strategies
4. **Evidence**: Astrological proof + AI verdict

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Full analysis only on "Explain" click
2. **Caching**: Cache report generation results
3. **Async Processing**: Non-blocking UI during analysis
4. **Progressive Enhancement**: Basic scores first, details later

### Expected Performance

- Quick sync analysis: <100ms
- Full report generation: 2-5 seconds
- Comprehensive AI analysis: 3-7 seconds
- Modal rendering: <500ms

## Future Enhancements

1. **Machine Learning**: Train on successful marriage data
2. **Natural Language**: GPT-powered explanation generation
3. **Predictive Analytics**: Long-term compatibility forecasting
4. **Personalization**: Learn user preferences over time
5. **Multi-Modal**: Include voice, video analysis

## API Reference

### Main Functions

```typescript
// Analyze all partners and find best match
analyzeAllPartners(
  selfChart: Chart,
  partners: Array<{ id: string; name: string; chart: Chart }>
): Promise<AIMatchResult>

// Generate detailed insight for single partner
generateComprehensiveMatchInsight(
  selfChart: Chart,
  partnerChart: Chart,
  partnerName: string,
  partnerId: string
): Promise<{ insight: MatchInsight; fullAnalysis: AIMatchAnalysis | null }>

// Quick sync analysis (for dashboard)
analyzeBestMatchSync(
  selfChart: Chart,
  partners: Array<{ id: string; name: string; chart?: Chart }>
): MatchInsight | null

// Generate explanation data
generateDetailedExplanation(
  analysis: AIMatchAnalysis
): ExplanationData
```

### Types

See `lib/ai/matchmakingEngine.ts` for complete type definitions.

## Support

For questions or issues with the AI Matchmaking Engine:
1. Check the factor weights in `FACTOR_WEIGHTS` constant
2. Review the scoring algorithm in `calculateWeightedScore`
3. Examine penalty/bonus logic in ranking factor functions
4. Verify report generation is working properly
