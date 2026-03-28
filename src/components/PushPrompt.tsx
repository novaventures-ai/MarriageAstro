/**
 * PushPrompt — Non-intrusive Web Push opt-in banner
 *
 * Show this after a user generates a report. It:
 *  - Only appears if push is supported and user hasn't subscribed/dismissed
 *  - Has a clear dismiss path (stored in localStorage)
 *  - Calls usePushNotification.subscribe() on CTA click
 */

import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { usePushNotification } from '../hooks/usePushNotification';

const DISMISSED_KEY = 'am_push_dismissed';

export const PushPrompt: React.FC = () => {
  const { isSupported, isSubscribed, isLoading, subscribe } = usePushNotification();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (
      isSupported &&
      !isSubscribed &&
      localStorage.getItem(DISMISSED_KEY) !== 'true'
    ) {
      // Slight delay so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, [isSupported, isSubscribed]);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
  };

  const handleSubscribe = async () => {
    const ok = await subscribe();
    if (ok) setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm mx-auto px-4 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-indigo-100 dark:border-indigo-900 p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Get weekly compatibility updates
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            We'll notify you of new insights — no spam.
          </p>
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="mt-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 px-3 py-1.5 rounded-lg transition-colors"
          >
            {isLoading ? 'Setting up…' : 'Allow notifications'}
          </button>
        </div>
        <button
          onClick={dismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
