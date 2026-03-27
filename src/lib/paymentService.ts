/**
 * Payment Service
 * Client-side helpers for checkout flow.
 *
 * Razorpay modal opens when VITE_RAZORPAY_KEY_ID is set.
 * Falls back to "coming soon" toast when the key is absent (local dev / staging).
 */

import { UnlockableSection } from '../types';

interface CheckoutOptions {
  userId: string;
  planType: 'section_unlock' | 'full_report_unlock' | 'premium_monthly' | 'astrologer_monthly';
  sectionToUnlock?: UnlockableSection;
  userEmail?: string;
}

export interface CheckoutResult {
  success: boolean;
  orderId?: string;
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

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json();

    // 2. Mock mode — no Razorpay key configured
    if (data.mock || !import.meta.env.VITE_RAZORPAY_KEY_ID) {
      return {
        success: false,
        orderId: data.orderId,
        mock: true,
        message: 'Payments launching soon! Your interest has been noted.',
      };
    }

    // 3. Open Razorpay modal and wait for result
    const result = await openRazorpayModal({
      keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
      orderId: data.orderId,
      amount: data.amount,
      currency: data.currency,
      planType: options.planType,
      sectionToUnlock: options.sectionToUnlock,
      userEmail: options.userEmail,
    });

    return result;
  } catch (error: any) {
    console.error('Checkout error:', error);
    return {
      success: false,
      mock: false,
      message: error.message || 'Failed to initiate checkout',
    };
  }
}

interface RazorpayModalOptions {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  planType: string;
  sectionToUnlock?: string;
  userEmail?: string;
}

function openRazorpayModal(opts: RazorpayModalOptions): Promise<CheckoutResult> {
  return new Promise((resolve) => {
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
        // Payment captured — webhook will update the DB; verify signature client-side for UX
        const verified = await verifyPayment(response);
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

    rzp.on('payment.failed', (_response: any) => {
      resolve({
        success: false,
        orderId: opts.orderId,
        mock: false,
        message: 'Payment failed. Please try again.',
      });
    });

    rzp.open();
  });
}

/**
 * Verify a completed Razorpay payment signature via the server.
 */
export async function verifyPayment(razorpayResponse: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}): Promise<boolean> {
  try {
    const res = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(razorpayResponse),
    });
    const data = await res.json();
    return data.valid === true;
  } catch {
    // Webhook will still process and update the DB even if client-side verify fails
    return false;
  }
}
