# Content production

Two tools, two jobs. Neither ships in the app — both run on your machine
against your own accounts.

| Tool | Directory | Good for | Marginal cost |
|---|---|---|---|
| `notebooklm-mcp-cli` | [`notebooklm/`](./notebooklm) | Instagram carousels, YouTube explainers, hook testing | ₹0 — subscription quota |
| Gemini Omni 1.1 Flash | [`video-gen/`](./video-gen) | 3–8s hook clips, animating branded stills | ~₹9/s at 720p, metered |

## Which one to reach for

**Carousels and long-form → NotebookLM.** It is grounded on real source
documents, it is already paid for, and portrait infographics are the single
highest-converting asset for this niche.

**The first three seconds of a reel → Omni Flash.** A generated hook clip is
worth paying for because the hook is what earns the stop-scroll. The rest of
the reel is not worth paying for — see the cost math in
[`video-gen/README.md`](./video-gen/README.md).

**Neither makes a finished reel.** Astrology converts on a human face. Both
tools produce material that goes *around* you on camera, not instead of you.

## What does not belong in either

`knowledge/*.json` — the yoni matrix, KP sub-lord tables, risk weights. That
is the scoring engine, and it is the part of this product that cannot be
rebuilt from the UI. Content-level explanations of the same astrology live in
[`notebooklm/sources/`](./notebooklm/sources).
