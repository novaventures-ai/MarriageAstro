import React from 'react';
import { Code, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

export function ApiDocsPage() {
  return (
    <>
      <SEOHead 
        title="REST API Documentation — Astro Marriage" 
        description="Comprehensive documentation for the Astro Marriage REST API. Access 100+ astrological endpoints."
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 dark:from-slate-950 dark:to-violet-950/20 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/api-keys" className="inline-flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to API Keys
          </Link>
          
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                <Code className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Astro Marriage REST API</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Integrate the world's most advanced Marriage Astrology infrastructure directly into your application.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <Code className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">API Reference Coming Soon</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
              We are finalizing our interactive OpenAPI documentation. 
              In the meantime, you can interact with our endpoints via the MCP Server or the Playground. 
              If you require immediate enterprise access or the OpenAPI schema, please contact support.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
