/**
 * Vercel Serverless Function: /api/ideas
 * Generates personalized Indian wedding themes, decor concepts, signature menus, and entertainment ideas.
 */

import { z } from 'zod';
import {
  WeddingFunctionSchema,
  WeddingVibeSchema,
  PersonalizedIdeasSchema,
} from '../src/domain/schemas';
import { generateFallbackIdeas } from '../src/domain/fallbacks';
import {
  ApiRequest,
  ApiResponse,
  callGeminiJson,
  getClientIp,
  rateLimiter,
  sanitizeAndDelimitData,
} from './_utils';

const RequestSchema = z.object({
  vibe: WeddingVibeSchema,
  budgetINR: z.number().positive().max(100_000_000),
  guestCount: z.number().positive().max(5000),
  selectedFunctions: z.array(WeddingFunctionSchema).min(1),
});

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  // CORS & Security headers
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

  const { vibe, budgetINR, guestCount, selectedFunctions } = parseResult.data;

  // Delimit user input data safely
  const safeData = sanitizeAndDelimitData({
    vibe,
    budgetINR,
    guestCount,
    selectedFunctions,
  });

  const prompt = `Based on the following Indian wedding planning parameters:
${safeData}

Generate a comprehensive personalization guide.
Return JSON with this exact schema:
{
  "themeTitle": "string",
  "palette": ["string", "string", ...],
  "decorConcepts": ["string", "string", ...],
  "signatureMenu": ["string", "string", ...],
  "entertainmentIdeas": ["string", "string", ...],
  "budgetSavingTips": ["string", "string", ...]
}`;

  const result = await callGeminiJson(
    prompt,
    PersonalizedIdeasSchema,
    () => generateFallbackIdeas(vibe, budgetINR, guestCount, selectedFunctions)
  );

  res.status(200).json(result);
}
