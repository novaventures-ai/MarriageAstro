/**
 * Google Translate Widget
 * Shows/hides the Google Translate dropdown initialized in index.html
 * Includes "Back to English" and dark-mode styling fixes
 */

import React, { useEffect, useRef, useState } from 'react';
import { Languages, RotateCcw } from 'lucide-react';

function restoreEnglish() {
  // Google Translate stores the language in a cookie
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname;
  // Remove the Google Translate frame bar
  const frame = document.querySelector('.skiptranslate') as HTMLElement | null;
  if (frame) frame.style.display = 'none';
  document.body.style.top = '0px';
  window.location.reload();
}

function isTranslated(): boolean {
  return document.cookie.includes('googtrans=/en/');
}

export const GoogleTranslate: React.FC = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Move the Google Translate widget into our dropdown when opened
  useEffect(() => {
    if (!open) return;
    const gtEl = document.getElementById('google_translate_element');
    if (gtEl && widgetRef.current) {
      gtEl.style.display = 'block';
      widgetRef.current.appendChild(gtEl);
    }
    return () => {
      const gtEl = document.getElementById('google_translate_element');
      if (gtEl) {
        gtEl.style.display = 'none';
        document.body.appendChild(gtEl);
      }
    };
  }, [open]);

  // Inject styles to fix Google Translate dropdown in dark mode
  useEffect(() => {
    const styleId = 'gt-dark-fix';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Fix Google Translate select dropdown styling */
      #google_translate_element select {
        background: white !important;
        color: #1a1a1a !important;
        border: 1px solid #d1d5db !important;
        border-radius: 8px !important;
        padding: 6px 10px !important;
        font-size: 14px !important;
        width: 100% !important;
        cursor: pointer !important;
        outline: none !important;
      }
      .dark #google_translate_element select {
        background: #374151 !important;
        color: #f3f4f6 !important;
        border-color: #4b5563 !important;
      }
      /* Hide Google branding inside our widget */
      #google_translate_element .goog-logo-link,
      #google_translate_element .goog-te-gadget > span {
        display: none !important;
      }
      #google_translate_element .goog-te-gadget {
        color: transparent !important;
        font-size: 0 !important;
      }
      /* Hide the Google Translate top bar - we have our own back button */
      .skiptranslate.goog-te-banner-frame {
        display: none !important;
      }
      body {
        top: 0px !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const translated = isTranslated();

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        title="Translate page"
        aria-label="Translate page"
      >
        <Languages className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[220px] z-[60]">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Translate to
          </p>
          <div ref={widgetRef} />

          {translated && (
            <button
              onClick={() => {
                setOpen(false);
                restoreEnglish();
              }}
              className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Back to English
            </button>
          )}
        </div>
      )}
    </div>
  );
};
