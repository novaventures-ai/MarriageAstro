/**
 * Admin Configuration
 * Hardcoded admin emails that always get full access (astrologer tier).
 * These accounts can also grant/revoke premium to any user via /admin.
 */

export const ADMIN_EMAILS = [
  'novaventures.contact@gmail.com',
  'rahul.govalkar.1807@gmail.com',
  'viewer@marriageastro.com'
];

export const isAdminEmail = (email: string): boolean =>
  ADMIN_EMAILS.includes(email.toLowerCase().trim());
