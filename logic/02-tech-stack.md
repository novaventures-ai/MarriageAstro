# 02. Technical Methodology & Stack Architecture

## 1. Core Principles
*   **Privacy First:** All astrological calculations run *locally* on the client-side/edge using optimized algorithms. No user birth data is sent to third-party astrology APIs.
*   **Simplicity:** The app uses a modern, lightweight stack to ensure speed and maintainability.
*   **Scalability:** Built on serverless infrastructure to handle spikes in traffic without manual scaling.

## 2. Technology Stack

### 2.1 Frontend (The Interface)
*   **Framework:** **React 18** (via Vite) for a responsive, high-performance SPA.
*   **Language:** **TypeScript** for type safety and robust code.
*   **State Management:** **Redux Toolkit** (or Context API) for managing complex chart state (User A, User B, Composite).
*   **Styling:** **Tailwind CSS** for rapid, utility-first styling with a custom "Mystic/Cosmic" theme.
*   **Routing:** **React Router v6**.
*   **Visualization:** **D3.js** or **SVG** for rendering North/South Indian charts dynamically.

### 2.2 Backend & Database (The Brain & Memory)
*   **Platform:** **Supabase** (BaaS - Backend as a Service). Provides:
    *   **Database:** **PostgreSQL** for relational data (Users, Saved Charts, Reports).
    *   **Auth:** **Supabase Auth** (email, social login) for secure user management.
    *   **Storage:** For saving generated PDF reports or user profile images.
    *   **Realtime:** (Optional) If we implement live consultations later.
*   **API/Edge Functions:** **Supabase Edge Functions** (Deno/Node) for:
    *   Generating secure tokens.
    *   Handling payment webhooks (Stripe/Razorpay).
    *   Running heavier, non-client logic (e.g., generating PDF reports).

### 2.3 Astrological Calculation Engine (The Core)
*   **Library:** Custom TypeScript port of **Swiss Ephemeris** (or `swisseph-wasm`) for 100% accurate planetary longitudes.
*   **Custom Modules:**
    *   `kp_calc.ts` (KP System logic).
    *   `varga_calc.ts` (Shodashvarga logic).
    *   `compatibility.ts` (Ashtakoot & Matching logic).
*   **Execution:** Runs primarily in the **Browser** (Client-side) to ensure zero latency and privacy.

### 2.4 Deployment & CI/CD
*   **Hosting:** **Vercel** or **Netlify** for frontend hosting (optimized for Vite/React).
*   **Repository:** **GitHub** for version control.
*   **CI/CD:** GitHub Actions for automated testing and deployment.

## 3. Security Architecture
*   **Row Level Security (RLS):** Enabled on all Supabase tables. Users can *only* access their own charts.
*   **Data Minimization:** We only store birth data if the user explicitly saves a profile. Unsaved calculations are ephemeral.
*   **Encryption:** All data in transit (SSL) and at rest (Postgres encryption).
