/**
 * Google Translate Widget
 * Adds a compact translate button that supports 100+ languages
 */

import React, { useEffect, useRef, useState } from 'react';
import { Languages } from 'lucide-react';

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (
          config: { pageLanguage: string; includedLanguages?: string; layout: unknown; autoDisplay: boolean },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

let scriptLoaded = false;

export const GoogleTranslate: React.FC = () => {
  const [showWidget, setShowWidget] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showWidget) return;

    const initTranslate = () => {
      if (window.google?.translate?.TranslateElement) {
        const el = document.getElementById('google_translate_element');
        if (el && !el.hasChildNodes()) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'hi,bn,ta,te,mr,gu,kn,ml,pa,ur,or,as,sa,ne,si',
              layout: (window.google.translate.TranslateElement as unknown as Record<string, Record<string, unknown>>).InlineLayout?.SIMPLE || 0,
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      }
    };

    if (!scriptLoaded) {
      window.googleTranslateElementInit = initTranslate;
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      scriptLoaded = true;
    } else {
      initTranslate();
    }
  }, [showWidget]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showWidget) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowWidget(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showWidget]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setShowWidget((v) => !v)}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        title="Translate page"
        aria-label="Translate page"
      >
        <Languages className="w-5 h-5" />
      </button>

      {showWidget && (
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] z-[60]">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Translate to
          </p>
          <div id="google_translate_element" className="notranslate" />
        </div>
      )}
    </div>
  );
};
