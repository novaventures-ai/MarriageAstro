# 04. API Design & Logical Endpoints

## 1. Design Philosophy
Most data interactions happen directly with Supabase via the client SDK (`supabase-js`). However, complex calculation logic is encapsulated in **Logical Modules** (TypeScript functions) or **Supabase Edge Functions**.

## 2. Calculation Logic (Client-Side/Edge)

### 2.1 Core Astrology Engine (`/astro`)
*   `calculateChart(birthData)` -> returns `ChartObject` (Rashi, Navamsa, Planets).
*   `calculateDasha(birthData)` -> returns `Vimshottari/Chara Dasha Timeline`.
*   `calculateAshtakoot(chartA, chartB)` -> returns `AshtakootScore` (0-36).
*   **NEW:** `calculateKPSubLords(chart)` -> returns `KPCuspPositions`.
*   **NEW:** `calculateVargaStrength(chart)` -> returns `ShodashvargaWeightedScore`.

### 2.2 Compatibility Engine (`/compatibility`)
*   `generateReport(chartA, chartB)` -> returns `FullCompatibilityReport`:
    *   `ashtakoot`: Detailed breakdown.
    *   `synastry`: Planet-to-Planet aspects.
    *   `sexual_health`: PME/ED/Frigidity flags.
    *   `modern_issues`: Digital/Mental health markers.

### 2.3 Data Models (Interfaces)
```typescript
interface CompatibilityReport {
  id: string; // UUID
  charts: { chartA: Chart, chartB: Chart };
  score: number; // 0-36
  
  sexualAnalysis: {
    male_health: {
      pme_risk: "Low" | "Med" | "High";
      ed_risk: "Low" | "Med" | "High";
      indicators: string[]; // e.g. ["Venus-Mars conjunction"]
    };
    female_health: {
      frigidity_risk: "Low" | "Med" | "High";
      physical_pain_risk: "Low" | "Med" | "High";
      indicators: string[]; // e.g. ["Saturn-Venus Aspect"]
    };
    mutual_satisfaction: {
      score: number;
      vibe_match: string; // e.g. "High (Fire/Air)"
      description: string;
    };
  };
  
  synastry: {
    soulmate_connections: string[];
    karmic_bonds: string[];
  };
}
```

## 3. Backend Endpoints (Supabase Functions)

### 3.1 PDF Generation
*   **POST** `/functions/v1/generate-pdf`
    *   **Input:** `{ report_id: UUID }`
    *   **Logic:** Fetches report data -> Renders React PDF template -> Saves to Storage -> Returns URL.
    *   **Auth:** Required (Bearer Token).

### 3.2 Premium Unlock
*   **POST** `/functions/v1/create-checkout-session`
    *   **Input:** `{ plan: 'premium_report' }`
    *   **Output:** Stripe Checkout URL.

### 3.3 Admin
*   **POST** `/functions/v1/admin/sync-products`
    *   Syncs Stripe products to Supabase.

## 4. Realtime Channels
*   `consultations:room_id` (Future)
    *   Events: `message`, `chart_update`, `video_state`.
