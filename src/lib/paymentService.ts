/**
 * Payment Service
 * Client-side helpers for checkout flow.
 *
 * Razorpay modal opens when VITE_RAZORPAY_KEY_ID is set.
 * Falls back to "coming soon" toast when the key is absent (local dev / staging).
 */

import { UnlockableSection } from '../types';

export interface CheckoutOptions {
  userId: string;
  planType: 'premium_monthly' | 'astrologer_monthly' | 'section_unlock' | 'full_report_unlock' | 'test_order';
  sectionToUnlock?: string;
  reportKey?: string;
  userEmail?: string;
}

export interface RazorpayModalOptions {
  keyId: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  planType: string;
  sectionToUnlock?: string;
  reportKey?: string;
  userEmail?: string;
}

export interface CheckoutResult {
  success: boolean;
  orderId?: string;
  keyId?: string; // Server provided key
  mock: boolean;
  message: string;
}

/**
 * Initiate a checkout session.
 * Opens the Razorpay modal when the key is configured; otherwise returns mock.
 * Resolves when the user completes OR dismisses payment.
 */
export async function initiateCheckout(options: CheckoutOptions): Promise<CheckoutResult> {
  try {
    // 1. Create order server-side
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (response.status === 404) {
      throw new Error('Payment API endpoint not found. Please redeploy the application.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create checkout session. Please try again.');
    }

    const data = await response.json();

    // 2. Mock mode — no Razorpay key configured or explicitly mock
    if (data.mock) {
      return {
        success: false,
        orderId: data.orderId,
        mock: true,
        message: data.message || 'Payments launching soon! Your interest has been noted.',
      };
    }

    // 3. Open Razorpay modal and wait for result
    try {
      const result = await openRazorpayModal({
        keyId: data.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        orderId: data.orderId,
        userId: options.userId,
        amount: data.amount,
        currency: data.currency,
        planType: options.planType,
        sectionToUnlock: options.sectionToUnlock,
        reportKey: options.reportKey,
        userEmail: options.userEmail,
      });

      return result;
    } catch (modalError: any) {
      console.error('Modal error:', modalError);
      return {
        success: false,
        mock: false,
        message: modalError.message || 'Failed to open payment gateway. Please disable ad-blockers and try again.',
      };
    }
  } catch (error: any) {
    console.error('Checkout error:', error);
    return {
      success: false,
      mock: false,
      message: error.message || 'Failed to initiate checkout',
    };
  }
}

function openRazorpayModal(opts: RazorpayModalOptions): Promise<CheckoutResult> {
  return new Promise((resolve, reject) => {
    try {
      // Safety check for window.Razorpay
      if (typeof window.Razorpay === 'undefined') {
        return reject(new Error('Razorpay SDK not loaded. Please check your internet connection or disable ad-blockers.'));
      }

      const description = opts.sectionToUnlock
        ? `Unlock: ${opts.sectionToUnlock.replace(/_/g, ' ')}`
        : opts.planType.replace(/_/g, ' ');

      const rzp = new window.Razorpay({
        key: opts.keyId,
        amount: opts.amount,
        currency: opts.currency,
        name: 'Astro Marriage',
        description,
        order_id: opts.orderId,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          // Payment captured — verify signature and fulfill synchronously for immediate UX
          const verified = await verifyPayment(response, {
            userId: opts.userId,
            planType: opts.planType,
            sectionToUnlock: opts.sectionToUnlock,
            reportKey: opts.reportKey,
            amount: opts.amount
          });
          resolve({
            success: verified,
            orderId: opts.orderId,
            mock: false,
            message: verified ? 'Payment successful! Your content is being unlocked.' : 'Payment completed but verification pending.',
          });
        },
        prefill: {
          email: opts.userEmail || '',
        },
        notes: {
          userId: opts.userId,
          planType: opts.planType,
          sectionToUnlock: opts.sectionToUnlock || '',
          reportKey: opts.reportKey || '',
        },
        theme: { color: '#F59E0B' },
        modal: {
          ondismiss: () => {
            resolve({
              success: false,
              orderId: opts.orderId,
              mock: false,
              message: 'Payment cancelled.',
            });
          },
        },
      });

      rzp.on('payment.failed', (response: any) => {
        console.error('Razorpay payment failed:', response.error);
        resolve({
          success: false,
          orderId: opts.orderId,
          mock: false,
          message: `Payment failed: ${response.error.description || 'Unknown error'}`,
        });
      });

      rzp.open();
    } catch (err) {
      console.error('Error in openRazorpayModal constructor:', err);
      reject(err);
    }
  });
}

/**
 * Verify a completed Razorpay payment signature via the server.
 */
export async function verifyPayment(
  razorpayResponse: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  },
  metadata?: {
    userId: string;
    planType: string;
    sectionToUnlock?: string;
    reportKey?: string;
    amount?: number;
  }
): Promise<boolean> {
  try {
    const res = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...razorpayResponse,
        ...metadata,
      }),
    });
    const data = await res.json();
    return data.valid === true;
  } catch {
    // Webhook will still process and update the DB even if client-side verify fails
    return false;
  }
}
