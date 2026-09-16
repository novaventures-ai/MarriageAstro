#!/usr/bin/env python3
"""
Generate a short hook clip or animate a still with Gemini Omni Flash.

Prints the estimated cost and asks before spending, because there is no free
tier and every failed take bills. Draft at 360p, promote keepers to 720p.

    ./hook.py --draft "Slow push in on a brass Kundali chart, 3 seconds."
    ./hook.py --seconds 4 "…"
    ./hook.py --image card.png --seconds 4 "Gentle parallax, dust motes."

Needs: pip install -U 'google-genai>=2.10.0'  (Python 3.10+), GEMINI_API_KEY.
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

# $17.50 per 1M video output tokens; 5,792 tokens per second of 720p.
# Confirm against Google's current pricing page before a large batch.
USD_PER_SECOND = {"360p": 0.034, "720p": 0.101, "1080p": 0.152, "4k": 0.304}
INR_PER_USD = 88.0
MAX_SECONDS = 10  # hard model limit

# Pin deliberately: the older `gemini-omni-flash-preview` is being retired.
MODEL = os.environ.get("OMNI_MODEL", "gemini-omni-1.1-flash-preview")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("prompt", help="What the clip should show.")
    p.add_argument("--draft", action="store_true",
                   help="Render at 360p — roughly a third the cost. Do this first.")
    p.add_argument("--resolution", default="720p", choices=sorted(USD_PER_SECOND),
                   help="Ignored when --draft is set. Default: 720p.")
    p.add_argument("--seconds", type=float, default=3.0,
                   help=f"Clip length, max {MAX_SECONDS}. Default: 3.")
    p.add_argument("--image", type=Path,
                   help="Still to animate as the first frame (image-to-video).")
    p.add_argument("--out", type=Path, default=Path("out.mp4"), help="Output path.")
    p.add_argument("-y", "--yes", action="store_true", help="Skip the cost prompt.")
    return p.parse_args()


def main() -> int:
    args = parse_args()

    if not 0 < args.seconds <= MAX_SECONDS:
        sys.exit(f"--seconds must be between 0 and {MAX_SECONDS} (model limit).")
    if args.image and not args.image.is_file():
        sys.exit(f"No such image: {args.image}")
    if not os.environ.get("GEMINI_API_KEY"):
        sys.exit("GEMINI_API_KEY is not set.")

    resolution = "360p" if args.draft else args.resolution
    usd = USD_PER_SECOND[resolution] * args.seconds

    print(f"model      {MODEL}")
    print(f"mode       {'image-to-video' if args.image else 'text-to-video'}")
    print(f"output     {args.seconds:g}s at {resolution} -> {args.out}")
    print(f"estimate   ${usd:.2f}  (about Rs {usd * INR_PER_USD:.0f})")
    if not args.draft:
        draft = USD_PER_SECOND["360p"] * args.seconds
        print(f"           a 360p draft would be ${draft:.2f} "
              f"(Rs {draft * INR_PER_USD:.0f}) — use --draft to test the prompt")
    print("           a failed take bills the same; there is no free tier")

    if not args.yes and input("\nGenerate? [y/N] ").strip().lower() not in ("y", "yes"):
        print("Nothing generated.")
        return 0

    try:
        from google import genai
    except ImportError:
        sys.exit("google-genai is not installed. "
                 "Run: pip install -U 'google-genai>=2.10.0'")

    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    contents: list = [args.prompt]
    if args.image:
        contents.insert(0, client.files.upload(file=str(args.image)))

    result = client.models.generate_videos(
        model=MODEL,
        contents=contents,
        config={"duration_seconds": args.seconds, "resolution": resolution},
    )

    args.out.write_bytes(result.generated_videos[0].video.video_bytes)
    print(f"\nWrote {args.out} ({args.out.stat().st_size / 1e6:.1f} MB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
