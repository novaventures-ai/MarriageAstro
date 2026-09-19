-- 006: stop verify-payment clobbering the webhook's payload.
--
-- verify-payment stamped {"verified_at": ...} into raw_payload. Both it and the
-- webhook upsert the same payment_history row, so whichever landed second
-- overwrote the other — and the webhook's full Razorpay entity (method, card,
-- fees, international flag, notes) was routinely discarded.
--
-- That payload is the authoritative record of the transaction, and the only
-- place acquisition context lives. It is why the first international customer's
-- origin could not be recovered.
--
-- verified_at now has its own column, and raw_payload belongs solely to the
-- webhook. verify-payment no longer sends raw_payload at all: PostgREST's
-- upsert only updates the columns present in the payload, so omitting it leaves
-- whatever the webhook wrote intact.

alter table public.payment_history
  add column if not exists verified_at timestamptz;

comment on column public.payment_history.verified_at is
  'Set by api/verify-payment when the browser-side signature check passes. '
  'Kept out of raw_payload, which belongs solely to the webhook so the full '
  'Razorpay entity is never clobbered by whichever write lands second.';

update public.payment_history
set verified_at = (raw_payload->>'verified_at')::timestamptz
where verified_at is null
  and raw_payload ? 'verified_at';
