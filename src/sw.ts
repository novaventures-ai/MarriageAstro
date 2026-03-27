/**
 * Custom Service Worker — MarriageAstro
 *
 * Compiled by vite-plugin-pwa (injectManifest strategy).
 * Handles:
 *   1. Workbox precaching of all Vite build assets
 *   2. Web Push notifications
 *   3. Notification click → open/focus correct URL
 */

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare let self: ServiceWorkerGlobalScope;

// Take control immediately on update
clientsClaim();

// Remove stale caches from previous SW versions
cleanupOutdatedCaches();

// Precache all Vite build assets (manifest injected by vite-plugin-pwa)
precacheAndRoute(self.__WB_MANIFEST);

// ─── Push Notifications ────────────────────────────────────────────────────

self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json() as {
    title?: string;
    body?: string;
    url?: string;
    icon?: string;
  };

  event.waitUntil(
    self.registration.showNotification(data.title ?? 'AstroMarriage', {
      body: data.body ?? '',
      icon: data.icon ?? '/icon.svg',
      badge: '/icon.svg',
      tag: 'astromarriage-notification',
      renotify: true,
      data: { url: data.url ?? '/' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl: string = (event.notification.data as { url: string }).url ?? '/';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        return self.clients.openWindow(targetUrl);
      })
  );
});
