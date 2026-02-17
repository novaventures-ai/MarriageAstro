# Required Knowledge Bases for Development

To build the Vedic Astrology Marriage & Relationship App, we need to structure several "Knowledge Bases" (KB). These are the rules, data tables, and interpretive texts that the application logic will query.

## 1. Reused Assets (From Existing Codebase)
*We can leverage the existing `jyotish-career-main` calculation engine for these:*
*   **Divisional Charts:** D1 (Rashi), D9 (Navamsa), D7 (Saptamsa) calculations are ready.
*   **Vimshottari Dasha:** Detailed timing logic is already implemented.
*   **Planetary Positions:** Accurate longitudes and house placements are available.
*   **Basic Yogas:** Standard yoga detection logic can be reused.

## 2. NEW Knowledge Bases to Develop (The "Missing Logic")
*These systems require new data structures and interpretive rules.*

### 2.1 Jaimini System (New Development)
*   **Chara Karaka Definitions:**
    *   Logic to identify AK (Atmakaraka), AmK, BK, MK, PK, GK, DK based on degrees.
*   **Chara Dasha Tables:**
    *   **Sign Rulerships:** Scorpio (Mars/Ketu) and Aquarius (Saturn/Rahu) dual lordship rules.
    *   **Dasha Sequence:** Logic for direct/reverse movement based on sign (Aries/Taurus/Gemini etc.).
*   **Interpretive Rules:**
    *   "DK in 7th House" -> Meaning.
    *   "AK influencing DK" -> Meaning.
    *   "Upapada Lagna (UL) Lord in 6/8/12" -> Impact on marriage stability.

### 2.2 Lal Kitab (New Development)
*   **Planetary Nature Table:**
    *   Rules to determine if a planet is Benefic/Malefic based on House placement (e.g., Sun in 10th is excellent, Sun in 7th is malefic).
*   **Remedy Database:**
    *   **Red Flags:** 7th House specific warnings (e.g., Mercury in 12th).
    *   **Remedies:** Specific physical actions for each planetary affliction.
    *   *Ex:* "Mars in 4th (Mangal Vad)" -> "Keep a square piece of silver."

### 2.3 Nadi Astrology (New Development)
*   **Nakshatra Rules:**
    *   **Nadi Dosha:** Vata/Pitta/Kapha classification for all 27 Nakshatras.
    *   **Cancellation Logic:** Same Rashi Lord interactions (e.g., Moon in Aries vs. Scorpio).
*   **Navamsa Linkages:**
    *   Rules to check if D1 planet connects to D9 dispositor.
*   **Special Nadi Yogas:**
    *   "Exchange of Signs (Parivartana) between 1st/7th Lords."

### 2.4 Sexual Health & Satisfaction Rules (Advanced)
*   **Dysfunction Indicators:**
    *   Rules for **PME:** Venus-Mars/Venus-Ketu aspects.
    *   Rules for **ED:** Weak Sun, Saturn-Sun conjunctions.
    *   Rules for **Frigidity:** Saturn-Venus aspects, 8th House Ketu.
*   **Satisfaction Matrix:**
    *   **Element Compatibility:** Fire/Air/Water/Earth interaction scores.
    *   **Libido Strength:** Scoring based on Mars and 8th House strength.

### 2.5 KP Astrology & Advanced Varga (New Development)
*   **KP Tables:**
    *   **1-249 Sub Lord Table:** Exact degrees for all sub-lords (Critical for calculation).
    *   **Significator Rules:** Logic for 4-fold signification scoring.
    *   **House Groupings:**
        *   Marriage: 2, 7, 11 (Primary), 5, 9 (Secondary).
        *   Denial: 1, 6, 10.
        *   Scandal: 5, 8, 12.
*   **Shodashvarga Database:**
    *   **Deity Meanings:** Interpretations for D60 Deities (e.g., "Komala" - Tender, "Kura" - Cruel).
    *   **Weighting Factors:** Mathematical weights for 16 charts.

## 3. Classical Calculation Tables (Ashtakoot)
*   **Yoni Matrix:** 14x14 grid matching animal types (e.g., Tiger vs. Cow = 0).
*   **Gana Rules:** Deva vs. Rakshasa scoring and cancellation conditions.
*   **Bhakoot Rules:** 2/12, 5/9, 6/8 positions and their exceptions.

## 4. Interpretive Content (The "Voice" of the App)
*   **Modern Planets:** Uranus/Neptune/Pluto interpretations (Custom IP).
*   **Relationship with In-Laws:** 2nd/10th house analysis text.
*   **Modern Challenges:** Digital age issues, mental health markers.

## Summary of Work Ahead
1.  **Code the Jaimini/Lal Kitab/Nadi Logic:** These are the priority "New" engines.
2.  **Create Data Tables:** JSON files for Yoni, Gana, and Sexual Health Rules.
3.  **Write the Text:** Author the interpretive strings for the new systems.
