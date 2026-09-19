# Recurring billing setup

The code path is live, but a subscription cannot be created until two Plan IDs
exist in the Razorpay dashboard and are configured as env vars. Until then
`resolveRecurringPlanId` returns null and every monthly sale falls back to a
one-time 30-day order — the current behaviour, so nothing breaks while this is
pending.

## What can and cannot auto-renew

| Customer | Currency | Renews? |
|---|---|---|
| India, India-issued card | INR | **Yes** — e-mandate, auto-debit monthly |
| International | USD | **No** — one-time, 30 days |

This is not a code limitation. An e-mandate can only be registered against a
card issued in India, with the mandate denominated in INR; issuing banks do not
support mandates in any other currency, and UPI AutoPay and e-NACH are both
India-domestic rails. For international recurring you need a second processor
with card-on-file tokenisation — Stripe, Paddle or Lemon Squeezy. The last two
act as merchant of record and handle foreign VAT/sales tax, which is worth more
than the rate difference once you have customers in several countries.

Until that exists, international monthly plans display as "$14.99 / 30 days"
and `renewalNote()` tells the customer plainly that it does not renew.

## Dashboard steps

**1. Enable Subscriptions.** Razorpay Dashboard → Subscriptions. If the product
is not enabled on the account, request activation; it is separate from the
International Payments activation you already have.

**2. Create two plans.** Subscriptions → Plans → New Plan.

| Plan | Billing | Amount | Env var for its ID |
|---|---|---|---|
| Premium Monthly | Monthly, every 1 month | ₹399 | `RAZORPAY_PLAN_PREMIUM_MONTHLY_INR` |
| Astrologer Monthly | Monthly, every 1 month | ₹1,499 | `RAZORPAY_PLAN_ASTROLOGER_MONTHLY_INR` |

Amounts must match `PRICING_INR` in `src/lib/regionService.ts`. Razorpay bills
the plan amount, not the amount the checkout was opened with, so a mismatch
charges the customer a price the UI never showed.

**3. Set the env vars** in Vercel → Project → Settings → Environment Variables,
for Production and Preview. Each value is the `plan_xxxxxxxx` ID.

**4. Subscribe the webhook to the lifecycle events.** Dashboard → Settings →
Webhooks → your `/api/payment-webhook` endpoint. Add:

- `subscription.activated`
- `subscription.charged` — **the renewal.** Without this, nothing extends
  `plan_expires_at` and every customer lapses after one cycle
- `subscription.pending` — a charge failed, Razorpay is retrying
- `subscription.halted` — retries exhausted
- `subscription.cancelled`
- `subscription.completed`
- `subscription.paused`

Keep `payment.captured` subscribed; one-time unlocks still depend on it.

## How a renewal flows

A renewal has **no browser session** — the customer is not present. The webhook
is the only thing that grants continued access, which is why
`handleSubscriptionEvent` returns 500 on failure: Razorpay retries a 500, and a
silently swallowed error means a paying customer loses access.

`nextExpiry` extends from the later of now and the current expiry. Razorpay
debits slightly before a cycle ends, so extending from `now` would shave a few
days off every month and the customer would drift backwards through the year.

Cancellation deliberately leaves `plan_expires_at` alone — the cycle was paid
for, so it runs to its end and `loadPlanTier` drops the user to free after that.

## Verifying it works

Use Razorpay **Test Mode** with test plan IDs before touching live keys.

1. Subscribe with a test card. `profiles.subscription_status` should read
   `active` and `razorpay_subscription_id` should be populated.
2. In the dashboard, trigger the next charge on the test subscription.
3. `plan_expires_at` should move forward by 30 days from its previous value,
   and a new `payment_history` row should carry the `subscription_id`.

If step 3 does nothing, the webhook is not subscribed to `subscription.charged`
— that is the failure that costs customers, and it is invisible until a renewal
is actually due.

## Signature formats

The two flows sign different strings, and the operand order is reversed:

```
order         HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id)
subscription  HMAC_SHA256(razorpay_payment_id + "|" + razorpay_subscription_id)
```

`src/tests/subscriptionBilling.test.ts` fails if these are ever swapped.
