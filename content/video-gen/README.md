# Gemini Omni Flash — hook clips and animated stills

Generative video via the official `google-genai` SDK. Unlike the NotebookLM
pipeline, this is a **documented Google API with API-key auth**, so it *could*
technically run server-side. The reason it does not is cost.

---

## Check Flow first — you already pay for this

A Google AI Pro subscription and a Gemini API key are **separate billing
rails**. The subscription does not come with API credits; API calls bill
pay-as-you-go through AI Studio / Cloud Billing regardless of what you pay
monthly for the consumer plan.

But the subscription *does* include video generation — just through a different
door:

| | Google Flow (AI Pro) | This API |
|---|---|---|
| Cost | 1,000 credits/mo included | ~₹9/s, no free tier |
| Veo 3.1 Lite | 10 credits — **~100 clips/mo** | n/a |
| Veo 3.1 Fast | 20 credits — ~50 clips/mo | n/a |
| Veo 3.1 Quality | 100 credits — ~10 clips/mo | n/a |
| Interface | Web UI, manual | CLI, scriptable, batchable |

At 4 reels a week needing roughly 3 clips each, that is **48 generations a
month against a ~100-generation allowance**. Flow covers the whole content
calendar at zero marginal cost.

**So use Flow.** Come back here only when you have exhausted the monthly
credits, or when you specifically need generation scripted into a batch — Flow
has no CLI and cannot be automated.

Confirm your actual balance in Flow rather than trusting the table above; the
subscriptions page describes Pro's Veo 3.1 Lite access as a "limited trial",
which may mean the allowance differs from the reported credit maths.

---

## Use the 1.1 model, not the one the skill targets

The published skill targets `gemini-omni-flash-preview`. Reporting on the
pricing pages says that model is being retired on **30 September 2026** — about
two weeks out — with migration to **Gemini Omni 1.1 Flash**
(`gemini-omni-1.1-flash-preview`) at identical pricing.

Confirm the current model ID against Google's own model page before you build
anything on it; the retirement date above comes from third-party pricing
coverage, not from Google directly. Either way, do not pin the older preview.

---

## Cost, honestly

Billed at **$17.50 per 1M video output tokens**, which works out per second of
output:

| Resolution | Per second | 5s clip | 10s clip (the cap) |
|---|---|---|---|
| 360p (draft) | ~$0.034 | ~$0.17 (₹15) | ~$0.34 (₹30) |
| 720p | ~$0.101 | ~$0.51 (₹45) | ~$1.01 (₹89) |
| 1080p | ~$0.152 | ~$0.76 (₹67) | ~$1.52 (₹134) |
| 4K | ~$0.304 | ~$1.52 (₹134) | ~$3.04 (₹268) |

Rupee figures at roughly ₹88/$. **There is no free tier** — billing starts on
the first token, including every failed take.

### Why full reels are not worth it

The reel bank scripts run 32–38 seconds. The model caps at **10 seconds per
generation**, so one reel is 4 clips stitched:

- 4 × 10s at 720p = **~$4.00 (₹355)** on a first-take-perfect run
- Realistically 2–3 takes per clip = **₹700–1,000 per reel**
- At 4 reels/week = **₹12,000–17,000/month**

Against ₹49 module unlocks, that is several hundred conversions a month just to
cover video generation. And stitched 10-second clips drift in style and
character between cuts, so you would be paying that to get something visibly
inconsistent.

### Where it is worth it

**Hook clips — 3 seconds, 720p, ~₹27 each.** The first three seconds decide
whether a reel is watched. A striking generated opener in front of you-on-camera
is the one place generated video earns its cost.

**Animating branded stills — image-to-video.** `api/og-image.tsx` already
renders share cards. Feeding one in as a first frame and getting 4 seconds of
motion out costs ~₹36 and produces something unmistakably yours, not generic
AI footage.

**Draft at 360p first.** At ~₹3/second, test the prompt for pennies and only
re-run the keeper at 720p. This is the habit that keeps the bill sane.

---

## Setup

```bash
pip install -U 'google-genai>=2.10.0'     # Python 3.10+
# ffmpeg and ffprobe must be on PATH
export GEMINI_API_KEY=...                 # same key as api/ai.ts uses
```

Note the SDK mismatch with the app: the repo uses the JS
`@google/generative-ai`, this needs the Python `google-genai`. That is another
reason it lives here rather than in `lib/`.

### Regional limit

Uploading video *for editing* is unavailable in the EEA, Switzerland, the UK
and some US states. India is not on that list, and text-to-video and
image-to-video are unaffected regardless.

---

## Running it

```bash
# Draft a hook cheaply
./hook.py --draft --seconds 3 "Slow push in on a brass Kundali chart on dark paper, \
  a single house lighting up amber. No text, no faces. 3 seconds."

# Re-run the keeper at 720p
./hook.py "…same prompt…"

# Animate a rendered share card
./hook.py --image ./card.png --seconds 4 "Gentle parallax, dust motes drifting, 4 seconds."
```

`hook.py` prints the estimated cost and waits for confirmation before spending.
