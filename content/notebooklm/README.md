# NotebookLM content pipeline

A runbook for producing MarriageAstro marketing assets with
[`notebooklm-mcp-cli`](https://github.com/jacob-bd/gemini-notebook-mcp-cli).

**This is a workstation tool, not an app feature.** It runs on your machine
against your own Google account. Nothing here ships to users, imports into
`src/`, or deploys to Vercel — see "Why this is not an app integration" below.

---

## Why this is not an app integration

The tool authenticates by extracting Google cookies from a logged-in browser
and calling NotebookLM's undocumented internal APIs. That has four consequences
that rule out putting it in the product:

| Constraint | Consequence |
|---|---|
| Auth is your personal Google cookies | Can't run server-side; every user would need their own NotebookLM account |
| Cookies expire every 2–4 weeks | A production dependency that breaks itself on a timer |
| Undocumented internal APIs | Google can change them without notice, with no deprecation window |
| Metered compute, ~5h rolling window + weekly cap | Cannot serve per-request user traffic |

So it lives here, outside the build, as a content tool.

### Use a separate Google account

The cookie extraction and internal-API use are outside Google's documented
terms. Run this under a **dedicated content Google account** — not the account
that holds the Play Console listing, the Vercel login, or the Supabase owner
seat. If Google ever actions the account, the blast radius should be a
NotebookLM workspace, not the business.

---

## Setup (on your machine, once)

```bash
# 1. Install
uv tool install notebooklm-mcp-cli

# 2. Log in — opens an isolated browser profile; sign in with the CONTENT account
nlm login --profile marriageastro

# 3. Verify
nlm doctor
nlm usage            # shows remaining quota and reset time

# 4. Optional: expose it to Claude Code as an MCP server
nlm setup add claude-code
```

Re-run `nlm login` when auth expires (every 2–4 weeks).

---

## Build the notebook

The `sources/` directory holds five pillar documents, one per content pillar in
the reel bank. They are written as plain explanatory prose because that is what
NotebookLM grounds well on.

```bash
# Create the notebook
nlm notebook create "MarriageAstro Content" --profile marriageastro
# → note the notebook ID it prints; export it for the commands below
export NB=<notebook-id>

# Add all five pillars
for f in content/notebooklm/sources/*.md; do
  nlm source add "$NB" --file "$f" --title "$(basename "$f" .md)" --wait \
    --profile marriageastro
done

nlm source list "$NB" --profile marriageastro
```

### What NOT to upload

Do not add `knowledge/*.json` as sources. Those files are the scoring engine —
the yoni matrix, the KP sub-lord tables, the risk rule weights. They are the
part of this product a competitor cannot rebuild from the UI, and uploading
them puts them in a third-party system for no content benefit. The pillar
documents in `sources/` deliberately explain the astrology without exposing the
rules that score it.

---

## Generating assets

Verified flags as of the current release (`nlm video create --help`,
`nlm infographic create --help`):

**Instagram carousels — the highest-value output.**

```bash
nlm infographic create "$NB" \
  --orientation portrait \
  --style editorial \
  --detail concise \
  --focus "Mangal Dosha: what it actually means and what it does not" \
  --profile marriageastro -y
```

`--orientation portrait` is 4:5, which is the Instagram feed's native ratio.
Styles worth testing: `editorial`, `sketch_note`, `bento_grid`. Avoid `kawaii`
and `clay` — they undercut the subject.

**Reels / Shorts.**

```bash
nlm video create "$NB" \
  --format short \
  --focus "Hook: 'Manglik matching is the most misunderstood rule in Kundali milan.' Vertical. Hindi-English mix. Calm, authoritative, not mystical. End on: link in bio to check your own chart." \
  --language hi \
  --profile marriageastro -y
```

For `--format short` and `cinematic`, `--focus` is the *entire* steering prompt —
visual style, audience and narrative all go in that one string. The
`--style-prompt` flag is silently remapped to `--focus` for these two formats,
so put everything in `--focus` and ignore `--style-prompt`.

**YouTube long-form.**

```bash
nlm video create "$NB" --format explainer --style heritage \
  --focus "Why 36-point matching misses what actually breaks marriages" \
  --profile marriageastro -y
```

`explainer` and `brief` accept the named `--style` values; `heritage` and
`whiteboard` both suit this subject. `--format brief` is the shorter cut.

**Download whatever you generated.**

```bash
nlm download all "$NB" --profile marriageastro
```

Then run `./content/notebooklm/generate.sh` for a full week's batch in one go.

---

## Honest expectations

**Carousels: genuinely good.** Portrait infographics grounded on real source
text are competitive with what a designer produces, at minutes per asset
instead of hours. This is where the tool pays for itself.

**Long-form YouTube: good enough.** A narrated explainer over generated visuals
is the normal format for this niche on YouTube, and watch-time there tolerates
AI narration.

**Reels: treat as drafts, not deliverables.** NotebookLM shorts are
AI-narrated slideshows. Instagram's ranking and its audience both discount that
format, and astrology in particular converts on a human face and voice — trust
is the product. Use `--format short` to test which *hooks* earn taps, cheaply,
then reshoot the winners yourself. Do not build the Instagram channel on
generated video.

**Quota is the real limit.** Studio generation is metered against a rolling
~5-hour window with a weekly cap. Batch deliberately; check `nlm usage` before
planning a session.

---

## Weekly loop

1. `nlm usage` — confirm quota.
2. Generate 3 portrait infographics (the week's carousels) and 1 explainer.
3. Generate 4 `--format short` drafts across different hooks.
4. Post carousels as-is. Reshoot the two best-performing short hooks on camera.
5. Track link taps, not views. A hook with 8k views and 600 taps beats one with
   200k views and 40 taps.
