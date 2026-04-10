/**
 * detect-region.ts — Vercel Serverless Function
 *
 * Returns the visitor's country code using Vercel's automatic
 * x-vercel-ip-country header. No external API, no cost, no latency.
 *
 * GET /api/detect-region
 * → { country: "IN", currency: "INR", isInternational: false }
 * → { country: "US", currency: "USD", isInternational: true }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel injects this header automatically on all edge/serverless requests
  const country = (req.headers['x-vercel-ip-country'] as string || 'IN').toUpperCase();
  const isInternational = country !== 'IN';

  // Cache for 1 hour — country doesn't change mid-session
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).json({
    country,
    currency: isInternational ? 'USD' : 'INR',
    isInternational,
  });
}
