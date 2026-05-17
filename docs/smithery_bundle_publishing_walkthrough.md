# 📦 Smithery.ai Local-First Bundle (.mcpb) Publishing Walkthrough

This guide details the final, zero-dependency publishing steps to list the **MarriageAstro MCP Server** on the official [Smithery.ai Directory](https://smithery.ai) using our compiled `.mcpb` desktop bundle.

---

## 💎 Why the Local-First `.mcpb` Bundle is a Game Changer
Instead of standard NPM packages that download raw files, compile at install time, and require users to have specific global Node.js/npm environments installed on their host machine, **`.mcpb` bundles** run locally inside a sandboxed environment:
* **Self-Contained & Instant:** All dependencies and assets are pre-packaged.
* **Super-Slim Production Build:** We optimized and cleaned the bundle **from 12.4 MB to just 3.34 MB** (removing TypeScript devDependencies and extra files).
* **Guaranteed Reliability:** Complete isolation from the host machine's runtime differences (e.g. Windows vs. macOS module resolution).
* **Automatic Secrets Handling:** The custom `manifest.json` automatically triggers Claude Desktop or the hosting agent to prompt the user for their `MARRIAGE_ASTRO_API_KEY` securely during one-click installation!

---

## 🚀 Step-by-Step Publishing Guide

### Step 1: Ensure Your Code is Fully Synced to GitHub
We have already verified your local codebase, built the production files, generated the valid v0.3 manifest, compiled the cleaned bundle (`marriage-astro-mcp.mcpb`), and pushed everything to the repository:
👉 [novaventures-ai/MarriageAstro GitHub Repository](https://github.com/novaventures-ai/MarriageAstro)

### Step 2: Log in to the Smithery CLI
Since `smithery` CLI is accessible globally via `npx`, execute the authentication command in your terminal:
```powershell
npx smithery auth login
```
> [!NOTE]
> This command will securely open your default web browser to authorize the Smithery CLI. Since you are already signed in to Smithery in your browser, this will authenticate your terminal instantly!

### Step 3: Publish the Cleaned Bundle File
Run the following publishing command directly inside your `mcp-server` directory:
```powershell
npx smithery mcp publish ./marriage-astro-mcp.mcpb -n novaventures-contact/marriage-astro-mcp
```

> [!IMPORTANT]
> * **`./marriage-astro-mcp.mcpb`** specifies the path to our 3.34 MB cleaned bundle.
> * **`-n novaventures-contact/marriage-astro-mcp`** is your unique qualified server namespace matching your Smithery account setup.

---

## 🛠️ How to Test Your Local Bundle Locally first (Claude Desktop)
Before publishing, if you would like to test how the compiled `.mcpb` bundle runs locally on your own machine in Claude Desktop, you can register it directly in your `claude_desktop_config.json`:

1. Open your Claude configuration file:
   `%APPDATA%\Claude\claude_desktop_config.json`
2. Add your local bundle path to the `mcpServers` list:
   ```json
   {
     "mcpServers": {
       "marriage-astro-local": {
         "command": "npx",
         "args": [
           "@anthropic-ai/mcpb",
           "run",
           "C:/Users/rahul/OneDrive/Documents/Codes/Marriage/MarriageAstro-main/MarriageAstro-main/mcp-server/marriage-astro-mcp.mcpb"
         ],
         "env": {
           "MARRIAGE_ASTRO_API_KEY": "your-free-or-premium-key-here"
         }
       }
     }
   }
   ```
3. **Restart Claude Desktop:** Claude will load the server directly from the compiled bundle. Test any tool (e.g., query a compatibility report) to verify the Swiss Ephemeris HTTP proxy runs flawlessly!

---

## 📊 Summary of Publishing Execution
| Asset File | Size | Manifest Schema | Status |
| :--- | :--- | :--- | :--- |
| `manifest.json` | 1.1 KB | v0.3 (Strictly Validated) | Pushed to GitHub |
| `marriage-astro-mcp.mcpb` | **3.34 MB** | Sandboxed Binary | Compiled, Cleaned, & Pushed |

---

> [!TIP]
> Once you run `npx smithery mcp publish`, your server page on Smithery.ai will instantly display a **"One-Click Install"** button for Claude Desktop. It is the ultimate modern distribution experience for your users!
