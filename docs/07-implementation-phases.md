# Implementation Plan: Vedic Astrology Marriage & Relationship App

## 1. Goal Description
Build a premium, full-stack Vedic Astrology application focused on relationship compatibility. The app will calculate detailed synastry, Ashtakoot Milan, Dasha timing, and Modern Planetary influences (Uranus, Neptune, Pluto).

**Key Documents:**
-   [01. Features List](file:///c:/Users/Rahul.Govalkar/Documents/Personal/Astro_Marriage/logic/01-features.md)
-   [02. Tech Stack](file:///c:/Users/Rahul.Govalkar/Documents/Personal/Astro_Marriage/logic/02-tech-stack.md)
-   [03. Database Schema](file:///c:/Users/Rahul.Govalkar/Documents/Personal/Astro_Marriage/logic/03-database-schema.md)
-   [04. API Design](file:///c:/Users/Rahul.Govalkar/Documents/Personal/Astro_Marriage/logic/04-api-design.md)
-   [05. Logic & Architecture](file:///c:/Users/Rahul.Govalkar/Documents/Personal/Astro_Marriage/logic/05-astrology-logic.md)
-   [06. UI/UX Design](file:///c:/Users/Rahul.Govalkar/Documents/Personal/Astro_Marriage/logic/06-ui-design.md)
-   [08. Knowledge Base Requirements](file:///c:/Users/Rahul.Govalkar/Documents/Personal/Astro_Marriage/logic/08-knowledge-base.md)

## 2. User Review Required
> [!IMPORTANT]
> **Data Generation:** Phase 1 involves creating extensive JSON data files. We must ensure these files capture the *nuance* of the features (e.g., specific rules for "Soulmate" aspects vs. just general friendship).

## 3. Implementation Phases

### Phase 1: Knowledge Base & Data Layer (The Foundation)
*Goal: Create the "brain" of the application.*
1.  **Generate JSON Data Files:**
    -   `knowledge/yoni_matrix.json` (14x14 scoring).
    -   `knowledge/gana_rules.json` (Cancellation logic).
    -   `knowledge/lal_kitab_remedies.json` (Planet-House-Remedy map).
    -   `knowledge/modern_planets_text.json` (Interpretations for U/N/P).
    -   `knowledge/synastry_rules.json` (Defining Soulmate/Karmic aspects).
    -   `knowledge/risk_rules.json` (Defining Divorce/Infidelity configurations).
    -   `knowledge/modern_challenges.json` (Mapping planetary combos to Digital/Mental health issues).
    -   `knowledge/chara_dasha_rules.json` (Jaimini Sign Aspects and Dasha Order).
    -   **NEW:** `knowledge/sexual_health_rules.json` (Defining PME/ED/Frigidity indicators).
    -   **NEW:** `knowledge/kp_sub_lords.json` (1-249 Sub Lord degrees).
    -   **NEW:** `knowledge/varga_weights.json` (Shodashvarga weighting scheme).
2.  **Define TypeScript Types:**
    -   Create interfaces for `Chart`, `CompatibilityReport`, `PlanetaryPosition`, `DashaPeriod`.
    -   **NEW:** Interfaces for `KPSignificator`, `VargaStrength`.

### Phase 2: Core Calculation Engine (The Backend)
*Goal: Implement the astrological logic.*
1.  **Port Existing Logic:** Copy `server/astro/calculations.ts` (Planets, Houses, Varga, Dashas).
2.  **Implement KP Astrology Engine (`kp_calc.ts`):**
    -   **Cuspal Sub Lord (CSL):** Calculate exact CSL for all 12 cusps.
    -   **Significators:** 4-fold logic (Planet/Star/Lord/Occupant).
    -   **Ruling Planets:** Real-time calculation based on location/time.
    -   **Promise Logic:** Check 7th CSL against 2-7-11 rules.
3.  **Implement Advanced Varga Engine (`varga_calc.ts`):**
    -   **Shodashvarga Calculation:** Compute all 16 divisional charts.
    -   **Weighted Scoring:** Apply `varga_weights.json` to planetary strength.
    -   **Deity Analysis:** Identify deities for D60.
4.  **Implement Jaimini & Special Points (`jaimini.ts`):**
    -   **Chara Karakas:** AK-DK calculation logic.
    -   **Chara Dasha:** Full sign-based dasha system (crucial for marriage timing).
    -   **Vivah Saham:** Calculation of this sensitive point for marriage.
    -   **Upapada Lagna (UL):** Calculation logic including UL2 and UL3.
5.  **Implement Compatibility Logic (`compatibility.ts`):**
    -   **Ashtakoot:** Full 36-point calculation with Nadi/Bhakoot cancellation.
    -   **Navamsa Match:** V.P. Goel's 4-step method.
    -   **In-Law Analysis:** 2nd/10th house checks + D9 confirmation.
    -   **Synastry Engine:** Implement logic for Jupiter-Moon (Soulmate) and Saturn (Karmic).
    -   **Sexual Compatibility Engine:**
        -   **Mars-Venus Interaction:** Check for Conjunction/Trine vs Square/Opposition.
        -   **8th House Overlay:** Check planets falling in partner's 8th house.
        -   **Vibe Matching:** Analyze Element Balance (Fire/Water/Air/Earth) for sexual temperament.
        -   **Dysfunction Screening:** Check against `sexual_health_rules.json` for PME, ED, or Frigidity risks.
4.  **Implement Risk & Challenges Engine (`analyzer.ts`):**
    -   **Divorce/Infidelity Scanner:** Check for 6/8/12 afflictions and specific "Separative" planets.
    -   **Modern Challenges:** Logic to flag Mercury-Neptune (Miscommunication) or Uranus-7th (Freedom needs).
5.  **Implement Timing Engine (`timing.ts`):**
    -   **Marriage Windows:** Algorithm to find overlapping Dasha periods + Jupiter/Saturn transits.

### Phase 3: Scaffolding & UI Migration (The Frontend)
*Goal: Create the visual application.*
1.  **Clone & Clean:** Duplicate `jyotish-career-main`, remove Career widgets.
2.  **State Management:** Update Redux/Context to handle **Two Charts** (Self + Partner).
3.  **UI Updates:**
    -   Update Landing Page text/images.
    -   **My Chart:** Add Jaimini table (AK/DK), Upapada Lagna, and Vivah Saham display.
4.  **Widget Development (The "Features"):**
    -   **Report Structure:** Implement "Executive Summary" vs "Deep Dive" toggle.
    -   **Compatibility Overview:** Overall Score, Traffic Light status.
    -   **Ashtakoot Detail:** Table with 8 parameters.
    -   **Risk Radar:** Visualizing Divorce/Infidelity probabilities.
    -   **In-Laws Analysis:** Dedicated card for family integration.
    -   **Synastry Breakdown:** Cards for Soulmate, Karmic, and Sexual connections.
        -   **Sexual Health Card:** Specific section for Health/Dynamics warnings (PME/ED alerts).
    -   **Modern Insights:** Cards for Digital/Career/Mental health challenges.
    -   **Timing Timeline:** Visual graph of favorable marriage windows.
    -   **Remedies:** Personalized Lal Kitab and Gemstone recommendations.

### Phase 4: Integration & Testing
1.  **Connect Backend to Frontend:** Ensure the API returns the full `CompatibilityReport`.
2.  **Verification:**
    -   **Unit Test:** Verify "Mangal Dosha" logic.
    -   **Unit Test:** Verify "Nadi Cancellation" logic.
    -   **Unit Test:** Verify "PME/ED Risk" correctly flags Venus-Ketu/Conjunction.
    -   **Manual:** Check a known "Soulmate" couple to see if the engine flags them correctly.
