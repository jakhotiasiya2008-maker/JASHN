/**
 * Vercel Serverless Function: /api/tradeoff
 * Explains tradeoffs when user manipulates what-if budget and guest count sliders.
 */

import { z } from 'zod';
import { TradeoffExplanationSchema } from '../src/domain/schemas';
import { generateFallbackTradeoff } from '../src/domain/fallbacks';
import {
  ApiRequest,
  ApiResponse,
  callGeminiJson,
  getClientIp,
  rateLimiter,
  sanitizeAndDelimitData,
} from './_utils';

const RequestSchema = z.object({
  budgetDelta: z.number().int(),
  guestDelta: z.number().int(),
  newBudgetINR: z.number().positive().max(100_000_000),
  newGuestCount: z.number().positive().max(5000),
});

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method && req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    return;
  }

  // Rate Limiting
  const ip = getClientIp(req);
  if (!rateLimiter.isAllowed(ip)) {
    res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
    return;
  }

  // Input Validation
  const parseResult = RequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      error: 'Invalid request payload',
      details: parseResult.error.flatten().fieldErrors,
    });
    return;
  }

  const { budgetDelta, guestDelta, newBudgetINR, newGuestCount } = parseResult.data;

  // Delimit user input data safely
  const safeData = sanitizeAndDelimitData({
    budgetDelta,
    guestDelta,
    newBudgetINR,
    newGuestCount,
  });

  const prompt = `A user shifted their Indian wedding what-if sliders:
${safeData}

Explain the strategic tradeoffs clearly.
Return JSON with this exact schema:
{
  "summary": "concise 1-2 sentence overview",
  "pros": ["bullet", "bullet", ...],
  "cons": ["bullet", "bullet", ...],
  "recommendations": ["bullet", "bullet", ...]
}`;

  const result = await callGeminiJson(
    prompt,
    TradeoffExplanationSchema,
    () => generateFallbackTradeoff(budgetDelta, guestDelta, newBudgetINR, newGuestCount)
  );

  res.status(200).json(result);
}
