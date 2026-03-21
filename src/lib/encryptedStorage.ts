/**
 * Encrypted localStorage adapter for Zustand stores
 * Uses Web Crypto API (SubtleCrypto) for AES-GCM encryption
 * Falls back to plain localStorage if crypto is unavailable
 */

const ENCRYPTION_KEY_NAME = 'astro-marriage-ek';
const ALGORITHM = 'AES-GCM';

async function getOrCreateKey(): Promise<CryptoKey | null> {
  try {
    if (!window.crypto?.subtle) return null;

    // Check for existing key in sessionStorage (ephemeral)
    const stored = sessionStorage.getItem(ENCRYPTION_KEY_NAME);
    if (stored) {
      const raw = Uint8Array.from(atob(stored), c => c.charCodeAt(0));
      return await window.crypto.subtle.importKey('raw', raw, ALGORITHM, true, ['encrypt', 'decrypt']);
    }

    // Generate new key
    const key = await window.crypto.subtle.generateKey(
      { name: ALGORITHM, length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // Store in sessionStorage (cleared on tab close)
    const exported = await window.crypto.subtle.exportKey('raw', key);
    const b64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
    sessionStorage.setItem(ENCRYPTION_KEY_NAME, b64);

    return key;
  } catch {
    return null;
  }
}

async function encrypt(data: string): Promise<string> {
  const key = await getOrCreateKey();
  if (!key) return data; // Fallback to plaintext

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(data);
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoded
  );

  // Combine IV + ciphertext and base64 encode
  const combined = new Uint8Array(iv.length + new Uint8Array(ciphertext).length);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return 'enc:' + btoa(String.fromCharCode(...combined));
}

async function decrypt(data: string): Promise<string> {
  if (!data.startsWith('enc:')) return data; // Plain text fallback

  const key = await getOrCreateKey();
  if (!key) return data;

  try {
    const combined = Uint8Array.from(atob(data.slice(4)), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    // If decryption fails (key changed), return empty to trigger re-init
    return '{}';
  }
}

/**
 * Creates an encrypted storage adapter compatible with Zustand's persist middleware
 */
export function createEncryptedStorage() {
  return {
    getItem: async (name: string): Promise<string | null> => {
      const value = localStorage.getItem(name);
      if (!value) return null;
      return await decrypt(value);
    },

    setItem: async (name: string, value: string): Promise<void> => {
      const encrypted = await encrypt(value);
      localStorage.setItem(name, encrypted);
    },

    removeItem: (name: string): void => {
      localStorage.removeItem(name);
    },
  };
}
