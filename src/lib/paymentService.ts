/**
 * Payment Service
 * Client-side helpers for checkout flow.
 * Currently mock — swap with Razorpay when ready.
 *
 * Razorpay swap checklist:
 * 1. Add <script src="https://checkout.razorpay.com/v1/checkout.js"></script> to index.html
 * 2. Replace initiateCheckout() with real Razorpay.open() call
 * 3. Replace verifyPayment() with real server-side verification
 */

import { UnlockableSection } from '../types';

interface CheckoutOptions {
  userId: string;
  planType: 'section_unlock' | 'premium_monthly' | 'astrologer_monthly';
  sectionToUnlock?: UnlockableSection;
}

interface CheckoutResult {
  success: boolean;
  orderId?: string;
  mock: boolean;
  message: string;
}

/**
 * Initiate a checkout session.
 * Currently returns a mock — will open Razorpay modal when live.
 */
export async function initiateCheckout(options: CheckoutOptions): Promise<CheckoutResult> {
  try {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout');
    }

    const data = await response.json();

    // TODO: When Razorpay is live, open the checkout modal:
    // const razorpay = new (window as any).Razorpay({
    //   key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    //   amount: data.amount,
    //   currency: data.currency,
    //   name: 'Astro Marriage',
    //   description: `${options.planType} - ${options.sectionToUnlock || 'Full Access'}`,
    //   order_id: data.orderId,
    //   handler: (response: any) => verifyPayment(response),
    //   prefill: { email: '' },
    //   theme: { color: '#F59E0B' },
    // });
    // razorpay.open();

    return {
      success: true,
      orderId: data.orderId,
      mock: data.mock || false,
      message: data.message || 'Checkout session created',
    };
  } catch (error: any) {
    console.error('Checkout error:', error);
    return {
      success: false,
      mock: true,
      message: error.message || 'Failed to initiate checkout',
    };
  }
}

/**
 * Verify a completed payment.
 * Currently a no-op mock.
 */
export async function verifyPayment(_razorpayResponse: any): Promise<boolean> {
  // TODO: Send razorpay_payment_id, razorpay_order_id, razorpay_signature
  // to a server endpoint for verification
  console.log('Payment verification (mock):', _razorpayResponse);
  return false; // Will return true when Razorpay is integrated
}
