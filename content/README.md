# Content production

Two tools, two jobs. Neither ships in the app — both run on your machine
against your own accounts.

You are on **Google AI Pro** (₹1,950/mo). That covers more of this than it
looks, so check what is already paid for before spending anything.

| Tool | Directory | Good for | Marginal cost |
|---|---|---|---|
| `notebooklm-mcp-cli` | [`notebooklm/`](./notebooklm) | Instagram carousels, YouTube explainers, hook testing | ₹0 — included in AI Pro |
| **Google Flow** (Veo 3.1 Lite) | — web UI, no CLI | Hook clips, B-roll, animating stills | ₹0 — 1,000 Flow credits/mo |
| Gemini Omni 1.1 Flash API | [`video-gen/`](./video-gen) | Same, but scriptable and batchable | ~₹9/s at 720p, metered |

## Which one to reach for

**Carousels and long-form → NotebookLM.** It is grounded on real source
documents, it is already paid for, and portrait infographics are the single
highest-converting asset for this niche.

**Hook clips and B-roll → Flow, not the API.** AI Pro includes 1,000 Flow
credits a month. Veo 3.1 Lite costs 10 credits a generation, so that is roughly
**100 clips a month already paid for**. At 4 reels a week needing ~3 clips each,
48 generations, you do not come close to the cap. Paying the Omni Flash API
~₹27 a clip for the same thing is spending twice.

Reach for [`video-gen/`](./video-gen) only when you run out of credits, or when
you want generation *scripted* — Flow is a web UI with no CLI, so it cannot be
batched.

**Neither makes a finished reel.** Astrology converts on a human face. Both
tools produce material that goes *around* you on camera, not instead of you.

## What does not belong in either

`knowledge/*.json` — the yoni matrix, KP sub-lord tables, risk weights. That
is the scoring engine, and it is the part of this product that cannot be
rebuilt from the UI. Content-level explanations of the same astrology live in
[`notebooklm/sources/`](./notebooklm/sources).


---

## Chat-driven generation

The `content` skill (`.claude/skills/content/SKILL.md`) turns a one-line ask
into a generated asset: it picks the pillar, reads its source document, drafts
the prompt in house voice, routes to the cheapest tool that can produce the
format, and runs it.

### It has to run where the auth lives

NotebookLM authenticates with Google cookies stored on **your machine**, and
Flow is a browser UI. A remote or web Claude session has neither, so it can
draft commands but cannot execute them. For end-to-end generation from chat,
run Claude Code locally in this repo:

```bash
# once, on your machine
uv tool install notebooklm-mcp-cli
nlm login --profile marriageastro        # sign in with the CONTENT account
nlm setup add claude-code                # registers the MCP server

# then, in this repo
claude
```

The skill is picked up automatically from `.claude/skills/`.

### Pin the notebook

Most commands need the notebook ID. Set it once so you are not pasting it:

```bash
echo 'export NB=<notebook-id>' >> ~/.zshrc     # or ~/.bashrc
```

`nlm notebook list --profile marriageastro` prints the IDs.

### What it looks like

> **you:** make me a carousel about why 36-point matching is misleading
>
> Reads `sources/04-beyond-36-points.md`, checks `nlm usage`, shows you the
> `--focus` string, and on your go runs `nlm infographic create` at 4:5.

> **you:** i need a hook clip for the manglik reel
>
> Drafts a Veo prompt in house voice and hands it to you for Flow, because
> Flow has no CLI — it does not quietly bill the metered API instead.

### From a web or remote session

Ask for the content anyway. You get the drafted prompts and the exact command
block to paste — the writing is the slow part, running it is one line.
