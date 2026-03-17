# UI/UX & Widget Transition Strategy

This document outlines the User Interface strategy, focusing on reusing the robust `jyotish-career-main` foundation while pivoting the content entirely to Marriage & Relationship Compatibility.

## 1. Reused Core Components (The "Shell")
*We will retain the high-quality, modern React/Tailwind structure of the existing app.*

*   **Landing Page:**
    *   **Structure:** Hero Section, Features Grid, Testimonials, Footer.
    *   **Adaptation:**
        *   Change "Career Guidance" copy to "Relationship Harmony".
        *   Update imagery to reflect couples/connection rather than corporate themes.
    *   **Action:** Copy `client/src/pages/LandingPage.tsx` and swap text/images.

*   **Authentication:**
    *   **Mechanism:** Google OAuth via Supabase.
    *   **Component:** `GoogleSignInButton` (already debugged and working in the existing codebase).
    *   **Action:** Direct reuse of `AuthProvider` and Login logic.

*   **App Shell (Dashboard Layout):**
    *   **Layout:** Sidebar navigation, top header with user profile, main content area.
    *   **Action:** Reuse `AppShell.tsx` but update the Sidebar links.

*   **AI Chat Interface:**
    *   **UI:** Chat bubble, history sidebar, markdown rendering.
    *   **Logic Upgrade:**
        *   **Old:** "Career Counselor" system prompt.
        *   **New:** "Vedic Relationship Expert" system prompt.
        *   **Context:** Feed the chat the new compatibility reports instead of career maps.

## 2. "My Chart" Upgrades
*The "My Chart" section needs to be deeper for relationship analysis.*

*   **Current State:** Basic Rashi chart and planetary positions.
*   **New Additions:**
    *   **Jaimini Data:** Table showing AK, AmK... DK (Spouse Indicator).
    *   **Upapada Lagna:** Explicitly calculate and display the UL sign.
    *   **Navamsa (D9) Chart:** Visual D9 chart (crucial for marriage).
    *   **Dasha Timeline:** Expanded view to show "Marriage Timing Windows".

## 3. Widget Replacement Strategy
*We will REPLACE the specific "Career" widgets with "Relationship" widgets.*

| **Old Widget (Career)** | **New Action** | **New Widget (Relationship)** |
| :--- | :--- | :--- |
| **Career Path Recommendation** | **REPLACE** | **Compatibility Overview** (Score out of 100, Gauge Chart) |
| **Strengths & Weaknesses** | **REPLACE** | **Ashtakoot Breakdown** (Table with 8 parameters & scores) |
| **Key Periods (Career)** | **REPLACE** | **Dasha & Timing** (Timeline of favorable marriage periods) |
| **Remedies (General)** | **UPDATE** | **Relationship Remedies** (Specific Lal Kitab/Gemstone fixes) |
| *(None)* | **CREATE** | **The "Risk" Radar** (Visualizing Divorce/Infidelity probability) |
| *(None)* | **CREATE** | **Modern Planet Insights** (Cards for Uranus/Neptune/Pluto effects) |
| *(None)* | **CREATE** | **In-Laws & Family** (Assessment of family integration) |

## 4. New User Flows
1.  **Onboarding:**
    *   **Old:** User birth details.
    *   **New:** **TWO** sets of birth details (Self + Partner).
    *   **UI:** Add a "Add Partner" form or a "Matchmaking" mode toggle.

2.  **Report View:**
    *   **Executive Summary:** High-level "Traffic Light" system (Red/Yellow/Green) for quick decisions.
    *   **Detailed Analysis:** Collapsible sections for deep astrological data (Attributes, Doshas, Planetary details).

## 5. Implementation Priorities
1.  **Scaffold New App:** Clone `jyotish-career-main`.
2.  **Clean Up:** Remove `careerMapping.ts` and related widgets.
3.  **Implement Logic:** Add the new `compatibility.ts` and Jaimini logic.
4.  **Build Widgets:** Create the new React components for the Relationship dashboard.
