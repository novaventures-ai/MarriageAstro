---
name: content
description: Generate MarriageAstro marketing content — Instagram carousels, reel scripts and hook clips, YouTube explainers — from the five content pillars. Use when asked to make a reel, carousel, post, short, video, or content about marriage astrology, or when asked what to post. Routes each format to the cheapest tool that can produce it and drafts the prompt in house voice.
---

# MarriageAstro content pipeline

Turn a one-line idea into a generated asset. Route by format, draft in house
voice, never spend money that a subscription already covers.

## Before anything else

Read the relevant pillar document in `content/notebooklm/sources/`. Every
generated asset must be grounded in one — that is what keeps the astrology
correct and the claims defensible. Do not generate from memory.

| Pillar | File |
|---|---|
| Shaadi kab hogi — timing | `01-marriage-timing.md` |
| Mangal Dosha | `02-mangal-dosha.md` |
| Life partner kaisa hoga | `03-spouse-prediction.md` |
| Matching-se-aage | `04-beyond-36-points.md` |
| How you love | `05-how-you-love.md` |

## Routing

Pick the cheapest tool that produces the format. Never reach past a free one.

| Ask | Tool | Cost | Automatable |
|---|---|---|---|
| Carousel / infographic | `nlm infographic create` | ₹0 (AI Pro) | yes — run it |
| YouTube explainer | `nlm video create --format explainer` | ₹0 (AI Pro) | yes — run it |
| Reel draft (slideshow) | `nlm video create --format short` | ₹0 (AI Pro) | yes — run it |
| Reel hook clip (real video) | **Google Flow**, Veo 3.1 Lite | ₹0 — 10 of 1,000 credits | **no — draft the prompt, user pastes it** |
| Hook clip, scripted/batch | `content/video-gen/hook.py` | ~₹27 per 3s | yes, but only if Flow credits are gone |

Flow has no CLI. For a hook clip, write the prompt and hand it over — do not
silently fall through to the metered API instead.

`--format cinematic` is **AI Ultra only**. On this account it is unavailable;
do not offer it.

## Steps

1. **Name the pillar and read its source document.**
2. **Check quota** — `nlm usage --profile marriageastro`. If it is low, say so
   before generating rather than after.
3. **Draft the focus string** in house voice (below). Show it to the user
   before running. For `--format short` and `cinematic`, `--focus` is the
   *entire* steering prompt — visual direction, audience and narrative all go
   in that one string, and `--style` is ignored.
4. **Run it**, or hand over the Flow prompt.
5. **Collect** — `nlm download all "$NB" --profile marriageastro`.

`$NB` is the notebook ID. If it is not set, list notebooks rather than guessing.

## House voice

**Calm and authoritative, not mystical.** No crystal balls, no purple smoke, no
swirling galaxies. Warm paper, ink, brass. The visual register is a serious
reference book, not a fortune-teller's tent.

**Hindi-English mix as actually spoken in urban India** — not formal Hindi, not
pure English. `--language hi` on video.

**Open on a correction, not a promise.** The hooks that earn taps say something
the viewer believes to be true and show it is not: "Agar aap Manglik hain, ye
video dekhne se pehle kisi ko paise mat dijiye." Not "Discover your love
destiny."

**Name the mechanism.** The differentiator is showing the working — which
house, which dasha, which cancellation rule. Vagueness is what every other
astrology account already sells.

**One ask, always the same.** End on checking your own chart, link in bio. The
whole point is to compare link taps across pieces; varying the CTA destroys the
comparison.

## Guardrails

These are not style preferences. Breaking them has cost real money or real harm
before.

- **Never state or imply a relationship count**, or anything readable as one —
  no "4 or more connections", no ranges, no "few or no". The attachment reading
  describes *how* someone loves, never how much of a past they have. Tests in
  `src/tests/attachmentStyle.test.ts` enforce this in the product; the same
  rule applies to every post.
- **Never present a temperament as a purity verdict** or rank the bands by
  severity. No band is the good one.
- **Never fear-sell a remedy.** Remedies are tradition, presented as tradition.
  "Your marriage will fail unless you buy this" is selling anxiety.
- **Never upload `knowledge/*.json`** as a NotebookLM source. That is the
  scoring engine — yoni matrix, KP sub-lord tables, risk weights — and the one
  part of the product that cannot be rebuilt from the UI.
- **Do not name a marriage date.** Charts name windows. Anyone naming a date is
  guessing, and saying so is itself good content.

## Worked example

> "make me a carousel about manglik"

1. Read `content/notebooklm/sources/02-mangal-dosha.md`.
2. `nlm usage --profile marriageastro`
3. Propose, and show the user first:

```bash
nlm infographic create "$NB" \
  --orientation portrait --detail concise --style editorial \
  --focus "Mangal Dosha affects roughly one person in three, and most cases \
are cancelled. Lead with the six houses. Then the cancellation rules almost \
nobody checks: Mars dignified, Jupiter or Venus aspecting, both partners \
Manglik, the sign exemptions, age. Close on: this describes a temperament, \
not a fate." \
  --profile marriageastro -y
```

`--orientation portrait` is 4:5, Instagram's native feed ratio. Styles that
suit the subject: `editorial`, `sketch_note`, `bento_grid`. Never `kawaii` or
`clay`.

## Full reference

`content/README.md` routes between tools. `content/notebooklm/README.md` has
every verified flag and the setup steps. `content/video-gen/README.md` has the
cost maths for the metered path.
