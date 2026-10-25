/**
 * Vercel Serverless Function: /api/planb
 * Generates structured contingency recovery plans for Indian wedding crisis scenarios.
 */

import { z } from 'zod';
import { PlanBResponseSchema } from '../src/domain/schemas';
import { generateFallbackPlanB } from '../src/domain/fallbacks';
import {
  ApiRequest,
  ApiResponse,
  callGeminiJson,
  getClientIp,
  rateLimiter,
  sanitizeAndDelimitData,
} from './_utils';

const RequestSchema = z.object({
  scenario: z.string().trim().min(3).max(300),
  budgetINR: z.number().positive().max(100_000_000),
  guestCount: z.number().positive().max(5000),
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

  const { scenario, budgetINR, guestCount } = parseResult.data;

  // Delimit user input data safely
  const safeData = sanitizeAndDelimitData({
    scenario,
    budgetINR,
    guestCount,
  });

  const prompt = `A user planning an Indian wedding faces the following emergency situation:
${safeData}

Generate an actionable, calm, and structured recovery protocol.
Return JSON with this exact schema:
{
  "scenario": "string (echo the problem)",
  "riskLevel": "low" | "medium" | "critical",
  "immediateActions": ["string", "string", ...],
  "next24Hours": ["string", "string", ...],
  "budgetImpactEstimate": "string with INR estimate",
  "vendorCommunicationScript": "string with ready-to-send SMS/email"
}`;

  const result = await callGeminiJson(
    prompt,
    PlanBResponseSchema,
    () => generateFallbackPlanB(scenario, budgetINR, guestCount)
  );

  res.status(200).json(result);
}
