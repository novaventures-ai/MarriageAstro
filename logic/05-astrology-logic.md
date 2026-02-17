# Vedic Astrology Marriage & Relationship Compatibility App: Comprehensive Logic & Architecture

## 1. Executive Summary & Core Objectives

### 1.1 App Purpose and Vision
This application integrates six classical Vedic astrological systems with modern planetary interpretations (Uranus, Neptune, Pluto) to create a multi-dimensional relationship assessment platform. It moves beyond standard 36-point Guna Milan to offer psychological, sexual, karmic, and timing analysis.

**Target Users:** Prospective couples, matchmaking services, practicing astrologers.
**Unique Value:** Identifying strengths/vulnerabilities, precise timing, and remedial protocols.

### 1.2 Target Systems Integration Architecture
| System | Core Contribution | Unique Value Proposition |
| :--- | :--- | :--- |
| **Parashari** | House-based analysis, Ashtakoot Milan | Cultural standard, foundational compatibility |
| **Jaimini** | Chara Karakas, Upapada Lagna, Chara Dasha | Personalized significators, precise timing |
| **Nadi** | Karmic patterns, devotion vs. obsession | Past-life dynamics, constitutional compatibility |
| **KP** | Cuspal Sub Lord, Ruling Planets | Exceptional event timing precision |
| **Lal Kitab** | Red flags, accessible remedies | Actionable diagnostics, simple interventions |
| **Modern Planets** | Uranus, Neptune, Pluto | Modern relationship challenge identification |

**Weighted Scoring Algorithm:**
- Ashtakoot Milan: 30%
- Navamsa Matching: 20%
- Synastry Aspects: 20%
- Dosha Analysis: 15%
- Timing Compatibility: 10%
- Sexual Compatibility: 5%

---

## 2. Core Astrological Frameworks: Classical Foundations

### 2.1 Parashari System: Marriage House Analysis

#### 2.1.1 Seven Primary Marriage Houses
1.  **7th House (Kalatra Sthana):** Primary indicator. Analyze sign, planets, aspects, and lord strength. Affliction (esp. by 6/8/12 lords) is a major predictor of separation.
2.  **2nd House (Kutumba Bhava):** Family harmony and wealth. Affliction here disrupts post-marital family life. 2nd/7th lord relationship is critical.
3.  **8th House (Ayur Bhava):** Longevity of spouse, intimacy, shared resources. Malefics here indicate crisis/secrets; aspect of 8th lord to 7th is critical.
4.  **12th House:** Bed comforts, losses. Malefics suggest dissatisfaction or unconventional needs.
5.  **5th House:** Romance and progeny. Connection to 7th indicates love marriage.
6.  **11th House:** Gains from marriage.
7.  **1st House:** Self in relationship.

#### 2.1.2 Natural Karakas
-   **Venus (Men):** Love, wife. Check dignity (exalted Pisces vs debil Virgo), combustion, 6/8/12 placement.
-   **Jupiter (Women):** Husband, wisdom. Strength mitigates other afflictions.
-   **Mars:** Passion, Mangal Dosha.
-   **Mercury:** Communication.
-   **Saturn:** Delay, stability.
-   **Rahu/Ketu:** Obsession/Detachment.

#### 2.1.3 Ashtakoot Milan System (36 Points)
1.  **Varna (1):** Spiritual compatibility.
2.  **Vashya (2):** Mutual attraction/control.
3.  **Tara (3):** Destiny/Health.
4.  **Yoni (4):** Sexual compatibility (14 animal types).
5.  **Graha Maitri (5):** Psychological friendship (Moon lords).
6.  **Gana (6):** Temperament (Deva, Manushya, Rakshasa). **Dosha:** Rakshasa with Deva/Manushya needs cancellation.
7.  **Bhakoot (7):** Emotional/Financial flow (Relative Moon positions). **Dosha:** 6/8, 2/12, 5/9 relationships.
8.  **Nadi (8):** Genetic/Health (Vata, Pitta, Kapha). **Dosha:** Same Nadi is critical (0 points).
    *   **Nadi Cancellation:** Same rashi different nakshatra; same nakshatra different charan; same rashi lords; exception nakshatras (Revati, Shravana, Mrigashira).

**Interpretation:**
-   < 18: Poor/Below Average
-   18-24: Average
-   25-32: Very Good
-   33-36: Excellent

### 2.2 Jaimini System: Variable Significators

#### 2.2.1 Chara Karakas (7 Planets)
-   **Atmakaraka (AK):** Highest degree.
-   **Darakaraka (DK):** Lowest degree -> Spouse Significator.

#### 2.2.2 Darakaraka (DK) Analysis
-   **DK Planet** indicates spouse nature (e.g., Sun=Authoritative, Moon=Nurturing).
-   **DK House:** Kendra (strong), Trikona (fortunate), Dusthana (challenging).

#### 2.2.3 Upapada Lagna (UL)
-   **Calculation:** 12th house -> Lord of 12th -> Count houses from 12th to Lord -> Count same distance forward.
-   **Sequence:** UL (1st marriage), UL2 (8th from UL, 2nd marriage), UL3 (3rd).
-   **Analysis:** UL Sign = Spouse family; Planets in UL = Specific influences; UL Lord = Stability.

#### 2.2.4 Chara Dasha Timing
-   Activation of signs containing DK, 7th from DK, UL, 7th from UL, or Venus usually brings marriage.

### 2.3 Integrated Divisional Chart (Varga) Analysis
-   **Principle:** A planet must be strong in the "Root" (D1) and the "Fruit" (D9) to give full results. We extend this to a **Weighted Varga Score**.
-   **Shodashvarga Scheme (16 Charts):**
    -   **D1 (Rashi):** Physical Body/General Destiny (Weight: 3.0).
    -   **D9 (Navamsa):** Marriage/Inner Strength (Weight: 2.5).
    -   **D7 (Saptamsa):** Progeny/Creative Legacy (Weight: 1.5).
    -   **D60 (Shasthamsa):** Past Life Karma (Weight: 2.0).
    -   *Other Vargas (D2, D3, D4, etc.) given lower weight (0.5 each).*
-   **Varga Deity Analysis:** Planets in higher vargas (D60) ruled by benefic deities (e.g., Maheshwara vs. Gulika) modify the final output.
-   **Cross-Varga Conjunctions:** If a planet is conjunct the same planet in D1, D9, and D60, it creates a "Varga Linkage" or "Bhavottama" effect.

### 2.4 Nadi System (Basic)
-   **Nadi Nodes:** Ketu-7th (Devotion/Detachment), Rahu-7th (Obsession/Instability).

### 2.5 Lal Kitab
-   **Red Flags:** Mercury in Prishtodaya signs (Aries, Taurus, Cancer, Sag, Cap), Mars 7th from Moon/Sun ("Polluted Mind").
-   **Remedies:** Simple, practical items (e.g., throwing cooling items in water for Mars, feeding cows/dogs).

### 2.6 KP Astrology (Advanced Stellar System)
-   **Core Principle:** Planet gives result of its Star Lord; Quality is decided by Sub Lord.
-   **Cuspal Sub Lord (CSL) Logic:**
    -   **7th Cuse Sub Lord:** The decisive factor for marriage promise.
        -   If 7th CSL signifies 2, 7, 11 -> **Marriage Promised.**
        -   If 7th CSL signifies 1, 6, 10 -> **Marriage Denied/Separation.**
        -   If 7th CSL signifies 5, 8, 12 -> **Scandal/Dishonor.**
-   **Significators (4-Fold Heirarchy):**
    1.  Planet in Star of Occupant.
    2.  Occupant of House.
    3.  Planet in Star of Lord.
    4.  Lord of House.
-   **Ruling Planets (RP):**
    -   Used for birth time rectification and answering "When?" questions.
    -   Set: Day Lord, Moon Sign Lord, Moon Star Lord, Lagna Sign Lord, Lagna Star Lord.


---

## 3. Modern Astrology Integration (Outer Planets)
**Activation:** Conjunctions within 2° of active dasha lords, natal planets, or sensitive points (Lagna, 7th cusp).

### 3.1 Uranus (Change/Innovation)
-   **House Impacts:**
    -   7th: Unpredictable partnerships, need for freedom.
    -   5th: Unconventional romance.
-   **Aspects:** To Venus (Sudden attraction/instability); To Mars (Erratic sexual energy).

### 3.2 Neptune (Illusion/Spirituality)
-   **House Impacts:**
    -   7th: Idealization, boundary dissolution, codependency.
    -   12th: Secret relationships, spiritual service.
-   **Aspects:** To Venus (Romantic illusion, "soulmate" longing); To Mars (Confused passion).

### 3.3 Pluto (Power/Transformation)
-   **House Impacts:**
    -   7th: Power struggles, control/submission patterns.
    -   8th: Profound sexual transformation, financial control issues.
-   **Aspects:** To Venus (Obsessive/fatal attraction); To Mars (Sexual intensity/conflict).

---

## 4. Modern Relationship Problem Identification

### 4.1 Communication & Technology
-   **Digital Challenges:** Mercury-Uranus (Erratic texting/misunderstanding), Mercury-Neptune (Passive-aggressive/ghosting).
-   **Social Media:** 11th House w/ Uranus/Neptune (Online affairs, performance for validation).

### 4.2 Intimacy & Sexual Norms (Social)
-   **Pornography/Addiction:** Neptune affliction to Venus/Mars; 12th House Neptune (Hidden habits).
-   **Modern Norms:** Uranus 5th/8th (Poly/Open relationships); Pluto 8th (BDSM/Power dynamics).

### 4.3 Career & Lifestyle
-   **Dual-Career Tension:** 10th House afflictions affecting 7th; Saturn-Uranus (Role conflicts).
-   **Financial Stress:** 8th House Pluto (Debt crises); 2nd House Uranus (Gig economy instability).

### 4.4 Mental Health
-   **Anxiety/Depression:** Moon-Neptune (Hypersensitivity); Saturn-Moon (Emotional distance).
-   **Narcissism:** Sun-Rahu w/ Pluto (Grandiose self-importance); 1st House Pluto (Control).

---

## 5. Advanced Sexual Health & Satisfaction Analysis (Detailed)

### 5.1 Mutual Satisfaction Engine (Vibes Matching)
*Determines if the sexual energies of the couple are compatible (Satisfier vs. Satisfied).*
-   **Mars-Venus Polarity:** Ideally, Male's Mars aspects Female's Venus (strong attraction).
-   **Element Balance:**
    -   Fire (Mars) demands intensity.
    -   Water (Moon/Venus) needs emotional connection.
    -   Earth (Saturn) needs physical stamina.
    -   Air (Mercury) needs mental stimulation.
    -   **Rule:** Fire scorches Water (Steam/Intensity but tiring); Air fans Fire (Passion).
-   **8th House (Intimacy) Strength:**
    -   Strong 8th Lord in D1/D9 = High Libido/Desire.
    -   Weak/Afflicted 8th Lord = Low Libido/Disinterest.

### 5.2 Male Sexual Dysfunction Indicators
*Logic to flag risks of PME and ED.*
-   **Premature Ejaculation (PME) / Quick Release:**
    -   **Venus Affliction:** Venus (Semen) aspected by Mars (Haste/Heat) or Ketu (Suddenness).
    -   **Lagnesh Weak:** Weak 1st House/Lord confidence.
    -   **Specific Yoga:** Venus in a Fire sign (Aries/Leo/Sag) aspected by Malefics.
-   **Erectile Dysfunction (ED) / Low Vitality:**
    -   **Sun Weak:** Debilitated Sun (Libra) or Sun-Saturn conjunction (Low Vitality).
    -   **7th/8th House Affliction:** Saturn or Mercury (Eunuch planets) heavily impacting 7th/8th.
    -   **Heavy Water Influence:** Excess water without fire can lead to "dampened" fire (digestive/metabolic issues affecting vitality).

### 5.3 Female Sexual Health Indicators
*Logic to flag risks of Frigidity or Pain.*
-   **Frigidity / Low Desire:**
    -   **Saturn-Venus:** Saturn aspecting Venus or Moon (Coldness, suppression of desire).
    -   **Ketu in 7th/8th:** Detachment from physical intimacy.
-   **Physical Issues (Pain/Vaginismus):**
    -   **Mars/Rahu in 8th:** Indicates inflammation, cuts, or high intensity causing pain.
    -   **8th Lord in 6th:** Connection between Intimacy (8th) and Disease/Pain (6th).

### 5.4 Relationship with In-Laws
-   (Section 5.4 remains as previously defined: D1 2nd/10th House and D9 Confirmation).

### 5.5 Risk Scenarios (Red Flags)
-   **Divorce Indicators (Research based on 111 cases):**
    -   7th/2nd Lord Affliction (99% frequency).
    -   7th/2nd Lord in Dusthana (6/8/12).
    -   Venus Affliction.
-   **Infidelity:** Rahu-Venus, Mars-Venus in 8th/12th, KP 5-8-12 formula.
-   **Multiple Marriages:** Dual signs on 7th cusp, 7th lord in 9th (3rd from 7th), UL sequence (UL -> UL2).

---

## 6. Technical Architecture & Data Models
*(Moved to [02-tech-stack.md](file:///c:/Users/Rahul.Govalkar/Documents/Personal/Astro_Marriage/logic/02-tech-stack.md) and [03-database-schema.md](file:///c:/Users/Rahul.Govalkar/Documents/Personal/Astro_Marriage/logic/03-database-schema.md))*

---

## 7. Reference & Research Citations
1.  **"A study on divorce cases with reference to 7th house"** — Jyotisha Journal, 2025 (111 cases, 99% affliction rate).
2.  **Brihat Parasara Hora Sastra (BPHS):** Foundational principles.
3.  **Medical Astrology Rules:** Dr. K.S. Charak's principles on 8th house and reproductive health.
4.  **Modern Research:** Integration of Uranus, Neptune, and Pluto in relationship dynamics.

---

## 8. Existing Codebase Analysis & Integration Strategy
**Analyzed Source:** `server/astro/calculations.ts`

### 8.1 Reusable Core Assets (High Value)
The existing codebase contains robust, locally-run calculation engines that **eliminate the need to build the astronomical foundation from scratch**:
1.  **Planetary Positions:** `calculatePlanetaryPositionsPrecision` correctly computes positions...
2.  **House Logic:** `calculateHouseCusps` implements Whole Sign houses...
3.  **Varga Charts:** `calculateVargaChart` includes logic for **D9 (Navamsa)** and D7 (Saptamsa)...
4.  **Dasha System:** `calculateDashas` provides detailed **Vimshottari Dasha**...

### 8.2 Missing Components (To Be Built)
The following compatibility-specific logic is **absent** and must be developed:
1.  **Ashtakoot Milan Engine:** No existing logic...
2.  **Synastry Logic:** No aspect comparison engine...
3.  **Risk Assessment:** No logic to scan for 5-8-12 combinations...
4.  **Modern Planet Aspects:** Logic to check aspects...
5.  **Sexual Health Engine:** Specific medical astrology rules for PME/ED/Frigidity.

### 8.3 Implementation Plan
1.  **Copy & Extend:** Copy `server/astro/*.ts` to the new project structure.
2.  **Develop `compatibility.ts`:** Create a new module using the `PlanetPosition`...
3.  **Augment `analyzer.ts`:** Extend the existing analyzer to look for the specific divorce/infidelity flags defined in this document.

---

## 9. Implementation Checklist (Updated)
1.  **Core Calculation Engine:**
    -   [ ] Accurate planetary positions (Exists in `calculations.ts`).
    -   [ ] Divisional chart calculation (Exists in `calculations.ts`).
    -   [ ] Special points: Implement UL, Vivah Saham, Upapada sequences.
2.  **Logic Modules:**
    -   [ ] **NEW:** Implement Ashtakoot with Nadi/Bhakoot cancellation rules.
    -   [ ] **NEW:** Implement KP Sub-lord calculation wrapper.
    -   [ ] **NEW:** Sexual Health Engine (PME, ED, Frigidity logic).
    -   [ ] **NEW:** Outer planet aspect calculation (orb < 2°).
3.  **Data Layer:** JSON Schema implementation.
4.  **UI/UX:** Detailed report generation with simple "Executive Summary" vs "Deep Dive" toggles.
