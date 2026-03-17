# Features of the Vedic Astrology Marriage & Relationship App

This document outlines the planned features based on the comprehensive Logic Architecture.

## 1. Core Astrology Engine (Foundation)
*   **Precision Calculations:** High-accuracy planetary positions using Swiss Ephemeris algorithms.
*   **Complete Planetary Set:** Calculates Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu AND **Uranus, Neptune, Pluto**.
*   **Divisional Charts:** Generates D1 (Rashi), D9 (Navamsa), and D7 (Saptamsa) charts.
*   **Special Points:** Calculates Upapada Lagna (UL), Vivah Saham, and Chara Karakas (AK-DK).
*   **Dasha Systems:**
    *   **Vimshottari Dasha:** Up to Level 3 (Pratyantardasha) for precise timing.
    *   **Chara Dasha:** Jaimini sign-based timing system.
    *   **KP Dasha:** Vimsottari Dasha adapted for KP system.

## 2. Advanced Systems Integration (New)
*   **KP Astrology Engine (Stellar Astrology):**
    *   **Cuspal Sub Lords (CSL):** Precision analysis of 7th CSL for marriage promise and quality.
    *   **Ruling Planets (RP):** Real-time ruling planets for moment-of-judgment queries and birth time rectification.
    *   **Significators (Karakas):** Planet significations based on Star Lord and Sub Lord hierarchy (Planet < Star < Sub).
    *   **4-Step Theory:** Application of KP 4-Step theory for event fruition.
*   **Integrated Divisional Chart (Varga) Analysis:**
    *   **Shodashvarga Weighted Analysis:** Beyond just D1/D9, looking at the full spectrum.
    *   **Varga Vimshamsha:** Strength of planets across 16 divisional charts.
    *   **D1 + D9 + D7 + D60 Synthesis:**
        *   D1 (Root): Physical connection.
        *   D9 (Fruit): Inner/Spiritual compatibility.
        *   D7 (Progeny): Lineage and creative bind.
        *   D60 (Past Life): Deep karmic debts.
    *   **Varga Deities:** Analysis of deities in higher vargas for subtle influences.

## 3. Compatibility Analysis (The "Heart" of the App)
*   **Ashtakoot Milan (36 Points):**
    *   Computes Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot, Nadi.
    *   **Smart Exception Handling:** Automatically applies cancellation rules for Nadi, Bhakoot, and Gana Doshas.
*   **Navamsa Matching (V.P. Goel Method):**
    *   Evaluates internal/soul-level compatibility.
    *   Checks Mutual Respect, Marital Happiness, Family Relations, and Suitability.
*   **Relationship with In-Laws:**
    *   **In-Law Harmony:** Analyzes the 2nd House (Kutumba) and 10th House (Karma/Spouse's Family) for integration ease.
    *   **Navamsa Check:** Specifically evaluates the D9 2nd Lord for family happiness potential.
*   **Detailed Synastry:**
    *   Identifies Soulmate connections (Jupiter-Moon).
    *   Analyzes Karmic bonds (Saturn contacts).
    *   Evaluates Sexual Chemistry (Mars-Venus interactions).

## 3. Sexual Health & Satisfaction (Advanced Feature)
*   **Mutual Satisfaction Engine:**
    *   **Vibe Matching:** Analyzes Element Balance (Fire/Water/Air/Earth) for sexual temperament.
    *   **Libido Match:** Compares 8th House/Lord strength to see if drives are compatible.
*   **Male Sexual Health Indicators:**
    *   **Vitality Check:** Analyzes Sun/Mars strength for stamina.
    *   **Dysfunction Screening:** Flags potential issues like PME (Quick Release) or ED based on specific planetary afflictions (e.g., Venus-Ketu, Weak Sun).
*   **Female Sexual Health Indicators:**
    *   **Comfort & Desire:** Analyzes Moon/Venus/Saturn for emotional safety vs frigidity indicators.
    *   **Physical Harmony:** Checks 8th House for indicators of pain or gynecological stress.

## 4. Modern Relationship Integration (Unique Feature)
*   **Modern Planet Analysis:**
    *   **Uranus:** Identifies need for freedom, sudden changes, and unconventional relationship styles.
    *   **Neptune:** Detects "rose-colored glasses," spiritual connections, or potential for deception/illusion.
    *   **Pluto:** Highlights power dynamics, control issues, and transformative/intense bonding.
*   **Modern Challenges Detection:**
    *   **Digital Age Issues:** Miscommunication due to technology.
    *   **Lifestyle Stress:** Career vs. Relationship conflicts.
    *   **Mental Health:** Anxiety or emotional distance markers.

## 5. Advanced Risk Assessment
*   **Divorce Probability:**
    *   Scans for 7th/8th/2nd house afflictions.
    *   Checks specifically for "separative" planets in critical zones.
*   **Infidelity Warning System:**
    *   Analyzes 5-8-12 house connections.
    *   Flags high-risk planetary combinations (e.g., Rahu-Venus in 12th).
*   **Multiple Marriage Indicators:**
    *   Evaluates dual signs on 7th cusp and Upapada Lagna sequences.

## 6. Timing & Prediction
*   **Marriage Timing:**
    *   Identifies favorable windows using Dasha + Transit confluence.
    *   Checks Jupiter/Saturn double transits.
*   **Event Prediction:**
    *   Predicts periods of high romance, conflict, or transformation.

## 7. Remedial Measures
*   **Personalized Remedies:**
    *   **Lal Kitab:** Simple, practical remedies (e.g., throwing items in water).
    *   **Gemstones:** Recommendations based on functional benefic planets.
    *   **Modern Adjustments:** Psychological and behavioral advice for modern planetary challenges.

## 8. User Experience
*   **Two-Tier Reporting:**
    *   **Executive Summary:** Simple "Green/Yellow/Red" indicators and key takeaways.
    *   **Deep Dive:** Full astrological technical breakdown for enthusiasts/astrologers.
*   **Data Privacy:** All calculations run **locally** on the user's device/server (no third-party API dependency for logic).
