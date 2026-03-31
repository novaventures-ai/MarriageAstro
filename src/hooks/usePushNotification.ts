/**
 * usePushNotification — Web Push subscription hook
 *
 * Manages the full lifecycle of a Web Push subscription:
 *  1. Checks browser support
 *  2. Requests notification permission
 *  3. Creates PushSubscription using VAPID public key
 *  4. Persists subscription in localStorage for re-use
 *  5. Exposes subscribe / unsubscribe actions
 *
 * Required env var (Vite):
 *   VITE_VAPID_PUBLIC_KEY  — the base64 public key from `npx web-push generate-vapid-keys`
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'am_push_subscribed';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotification() {
  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

  const isSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    Boolean(vapidPublicKey);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSubscribed(localStorage.getItem(STORAGE_KEY) === 'true');
  }, []);

  const subscribe = async (): Promise<boolean> => {
    if (!isSupported || !vapidPublicKey) return false;
    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return false;

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as unknown as ArrayBuffer,
      });

      // Persist subscription object for later server-side use
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem('am_push_sub', JSON.stringify(sub.toJSON()));

      // Save subscription to Supabase for server-side push
      supabase.auth.getSession().then(({ data: { session } }) => {
        supabase.from('push_subscriptions').upsert({
          user_id: session?.user?.id ?? null,
          subscription: sub.toJSON(),
          endpoint: sub.endpoint,
          created_at: new Date().toISOString(),
        }, { onConflict: 'endpoint' }).then(() => {/* silent */});
      });

      setIsSubscribed(true);
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async (): Promise<void> => {
    if (!isSupported) return;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('am_push_sub');
      setIsSubscribed(false);
    }
  };

  return { isSupported, isSubscribed, isLoading, subscribe, unsubscribe };
}
