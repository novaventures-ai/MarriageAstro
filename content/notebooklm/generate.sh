#!/usr/bin/env bash
#
# One week of MarriageAstro content from a prepared NotebookLM notebook.
#
#   export NB=<notebook-id>
#   ./generate.sh            # prints what it would run, spends nothing
#   ./generate.sh --run      # actually generates
#
# Studio generation is metered against a rolling ~5h window with a weekly cap,
# so the default is a dry run. Check `nlm usage` before spending a batch.

set -euo pipefail

PROFILE="${NLM_PROFILE:-marriageastro}"
DRY_RUN=1
[[ "${1:-}" == "--run" ]] && DRY_RUN=0

if [[ -z "${NB:-}" ]]; then
  echo "NB is not set. Run: export NB=<notebook-id>" >&2
  echo "List notebooks with: nlm notebook list --profile $PROFILE" >&2
  exit 1
fi

run() {
  if [[ $DRY_RUN -eq 1 ]]; then
    printf 'would run: nlm %s\n\n' "$*"
  else
    nlm "$@" --profile "$PROFILE" -y
  fi
}

echo "=== quota ==="
nlm usage --profile "$PROFILE" || echo "(could not read usage — is the profile logged in?)"
echo

# --- Carousels: three portrait infographics, the week's highest-value output ---
echo "=== carousels (portrait infographics) ==="

run infographic create "$NB" --orientation portrait --detail concise --style editorial \
  --focus "Mangal Dosha affects roughly one person in three, and most cases are cancelled. The cancellation rules nobody checks."

run infographic create "$NB" --orientation portrait --detail concise --style sketch_note \
  --focus "All 36 points of Guna Milan are calculated from the Moon nakshatra alone. What the score never looks at."

run infographic create "$NB" --orientation portrait --detail concise --style bento_grid \
  --focus "The four systems that have to agree before a marriage window is worth naming: house activation, Vimshottari dasha, Jupiter transit, and the KP 7th cusp sub-lord."

# --- Reels: drafts for hook testing, not finished deliverables ---
echo "=== reel drafts (vertical shorts) ==="
# For --format short the --focus string IS the whole steering prompt: visual
# direction, audience and narrative all go in it. --style is ignored here.

SHORT_STYLE="Vertical. Calm and authoritative, not mystical — no crystal balls, no purple smoke. Warm paper and ink palette. Hindi-English mix as spoken in urban India. End on: check your own chart, link in bio."

run video create "$NB" --format short --language hi \
  --focus "$SHORT_STYLE Hook: 'Agar aap Manglik hain, ye video dekhne se pehle kisi ko paise mat dijiye.' Then: one person in three is Manglik, and most cases cancel. Name the cancellation rules."

run video create "$NB" --format short --language hi \
  --focus "$SHORT_STYLE Hook: '36 mein se 32 aaya? Wo sirf do nakshatron ki baat hai.' Then: the score never looks at the 7th house, at Venus, or at the Navamsa."

run video create "$NB" --format short --language hi \
  --focus "$SHORT_STYLE Hook: 'Koi bhi astrologer aapko shaadi ki date nahi bata sakta.' Then: charts name windows, not dates — dasha opens it, Jupiter transit triggers it."

run video create "$NB" --format short --language hi \
  --focus "$SHORT_STYLE Hook: 'Aapka Darakaraka aapke 7th house se zyada sach bolta hai.' Then: the lowest-degree planet describes the spouse's core nature."

# --- Long-form: one YouTube explainer ---
echo "=== youtube explainer ==="

run video create "$NB" --format explainer --style heritage \
  --focus "Why 36-point matching misses what actually breaks marriages. Walk through the eight kootas, show that Bhakoot and Nadi are 42 percent of the score, then show the six things a serious reading checks instead."

echo
if [[ $DRY_RUN -eq 1 ]]; then
  echo "Dry run. Re-run with --run to generate."
else
  echo "Generation queued. Collect with:"
  echo "  nlm download all \"$NB\" --profile $PROFILE"
fi
