# MarriageAstro Claude Custom Connector Setup Guide

This guide outlines how to easily enable your newly deployed **MarriageAstro** Model Context Protocol (MCP) server directly inside Anthropic Claude as a custom connector. This will allow Claude to dynamically run Vedic Astrology birth chart and compatibility calculations directly using your MarriageAstro engine!

***

## 🚀 Deployed Endpoint Details

Your MarriageAstro MCP server has been successfully built and deployed to production:

* **Production URL:** `https://marriage-astro.vercel.app`
* **Vercel SSE MCP Endpoint:** `https://marriage-astro.vercel.app/api/mcp`
* **Status:** 🟢 **Active & Online** (Tested & Verified via JSON-RPC)

***

## 🛠️ Step-by-Step Integration in Anthropic Claude

To enable this custom connector in your Personal Pro/Max or Team Claude account, follow these exact steps:

### 1. Open Claude Settings
1. Log in to [Claude.ai](https://claude.ai).
2. Click your **profile icon** in the bottom-left corner of the sidebar.
3. Select **Customize** (or **Settings** depending on your UI version).
4. Navigate to the **Connectors** tab on the left-side menu.

---

### 2. Add the Custom Connector
1. Under **Custom Connectors**, click the **`+ Add custom connector`** (or **`Add Connector`**) button.
2. In the configuration modal that appears, enter the following exact parameters:

| Field | Configuration Value |
| :--- | :--- |
| **Connector Name** | `MarriageAstro` *(or any preferred name)* |
| **Connector URL** | `https://marriage-astro.vercel.app/api/mcp` |

---

### 3. Add Authentication Headers
To prevent unauthorized usage of your Astrology engine, the connector validates every request. You must supply your API Key in the headers:

1. Locate the **Headers** configuration section in the modal.
2. Add a new header entry:
   * **Key (Header Name):** `X-API-Key`
   * **Value:** *[Your MarriageAstro API Key]* 
     *(Note: If you are testing locally, the mockup bypass key is `test-key`, but for production ensure you copy your secret API key from the MarriageAstro management portal at `https://marriage-astro.vercel.app/api-keys`)*

---

### 4. Authorize and Save
1. Click **Add** or **Save**.
2. Claude will send a quick discovery request to verify the server's tools definition stream. 
3. Once validated, the status indicator will turn green, showing that all **21 Premium Vedic Astrology Tools** are successfully loaded!

***

## 🌟 Available Tools inside Claude

Once enabled, Claude will automatically gain access to a powerful astrological toolbox, including:

1. **`calculate_compatibility`** — Full Ashtakoot Milan 36-point compatibility report.
2. **`analyze_dosha`** — Detailed analysis of Mangal, Nadi, Kaal Sarpa, and other doshas.
3. **`get_spouse_prediction`** — Predicts spouse appearance, profession, nature, and timing.
4. **`get_marriage_timing`** — Finds auspicious marriage windows using Vimshottari Dasha and transits.
5. **`get_divorce_risk`** — Premium Vedic assessment of 7th & 2nd house afflictions.
6. **`get_infidelity_risk`** — Advanced venusian indicators and protective aspects.
7. **`get_navamsa_matching`** — Dual-chart D9 divisional Navamsa analysis.
8. **`get_remedies`** — Personalized Lal Kitab and gemstone recommendations.
9. ...and 13 other psychological, developmental, and in-law analysis tools!

***

## 🔍 Under the Hood: What We Fixed

We successfully resolved the root cause of the initial connection errors:
1. **Hono Socket Raw Headers Bypass:** Node serverless engines on Vercel parsed request headers using standard node `rawHeaders` (read-only arrays) rather than Hono's mutated headers object. This was causing a strict SSE validation mismatch (`406 Not Acceptable`).
2. **Dynamic Raw Headers Synchronization:** We built an ultra-resilient header synchronization layer that rewrites the socket's `rawHeaders` array directly in memory on incoming Claude requests, ensuring perfect negotiation of SSE streams.
3. **Clean Stateless Instantiation:** Removed legacy global connection states to prevent multi-tenant request leakage, allowing seamless isolated concurrency.
