/**
 * Google Translate Widget
 * Shows/hides the Google Translate dropdown initialized in index.html
 */

import React, { useEffect, useRef, useState } from 'react';
import { Languages } from 'lucide-react';

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
      // Move it back to body when closing (so it doesn't get unmounted)
      const gtEl = document.getElementById('google_translate_element');
      if (gtEl) {
        gtEl.style.display = 'none';
        document.body.appendChild(gtEl);
      }
    };
  }, [open]);

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
        </div>
      )}
    </div>
  );
};
