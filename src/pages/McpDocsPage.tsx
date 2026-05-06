import React from 'react';
import { Terminal, Copy, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

export function McpDocsPage() {
  const [copied, setCopied] = React.useState(false);

  const configStr = `{
  "mcpServers": {
    "marriage-astro": {
      "command": "npx",
      "args": ["-y", "marriage-astro-mcp"],
      "env": {
        "MARRIAGE_ASTRO_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(configStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEOHead 
        title="MCP Server Setup — Astro Marriage" 
        description="Connect your AI agents to the Astro Marriage platform using our Model Context Protocol (MCP) server."
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 dark:from-slate-950 dark:to-violet-950/20 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to="/api-keys" className="inline-flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to API Keys
          </Link>
          
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                <Terminal className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">MCP Server Setup</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Give Claude, Cursor, and other AI agents the ability to read birth charts, analyze compatibility, and predict marriage timing using the Astro Marriage calculation engine.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="font-semibold text-slate-800 dark:text-slate-200">Claude Desktop Configuration</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Add the following to your <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm">claude_desktop_config.json</code> file. Make sure to replace <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm text-violet-600 dark:text-violet-400">YOUR_API_KEY</code> with a key from your dashboard.
              </p>
              
              <div className="relative group">
                <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg overflow-x-auto text-sm font-mono border border-slate-800">
                  {configStr}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Copy configuration"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Configuration Path</h3>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                    <li><strong>Mac:</strong> <code className="text-xs">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
                    <li><strong>Windows:</strong> <code className="text-xs">%APPDATA%\Claude\claude_desktop_config.json</code></li>
                  </ul>
                </div>
                
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Note:</strong> You must have <a href="https://nodejs.org" target="_blank" rel="noreferrer" className="underline font-medium">Node.js</a> installed on your system to run the MCP server via <code className="bg-amber-100 dark:bg-amber-900/30 px-1 py-0.5 rounded">npx</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <h2 className="font-semibold text-slate-800 dark:text-slate-200">Available Tools</h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                The MCP server exposes the following capabilities directly to the AI model. 
                Availability depends on your API Key's tier.
              </p>
              
              <ul className="space-y-3">
                {[
                  { name: "get_birth_chart", desc: "Generate a full Vedic birth chart with planetary positions, houses, and dashas." },
                  { name: "calculate_compatibility", desc: "Ashtakoot Milan 36-point matching with individual guna breakdown." },
                  { name: "analyze_dosha", desc: "Identify Mangal Dosha, Nadi Dosha, and Kaal Sarpa patterns." },
                  { name: "get_divorce_risk", desc: "Advanced relationship stress points and separation indicators. (Premium)" },
                  { name: "get_spouse_prediction", desc: "Astrological indications of future partner characteristics. (Premium)" },
                ].map((tool, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
                    <div>
                      <code className="text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1 rounded">{tool.name}</code>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{tool.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-500 italic">
                  + 17 more tools... Simply ask Claude to "analyze our marriage compatibility using the astro tools".
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
