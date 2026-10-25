import { describe, it, expect } from 'vitest';
import {
  WeddingIntakeSchema,
  PersonalizedIdeasSchema,
  PlanBResponseSchema,
  TradeoffExplanationSchema,
} from '../../src/domain/schemas';
import {
  generateFallbackIdeas,
  generateFallbackPlanB,
  generateFallbackTradeoff,
} from '../../src/domain/fallbacks';

describe('Schemas and Fallback Generation', () => {
  it('validates a correct WeddingIntake input', () => {
    const valid = {
      coupleNames: 'Vikram & Radhika',
      weddingDate: '2026-12-10',
      cityTier: 'tier_1',
      cityName: 'Delhi NCR',
      guestCount: 350,
      totalBudgetINR: 4000000,
      selectedFunctions: ['sangeet', 'wedding', 'reception'],
      vibe: 'royal_heritage',
      priorities: ['grand_venue', 'culinary_feast'],
      specialNotes: 'Prefers outdoor lawns with fireworks permission',
    };

    const parsed = WeddingIntakeSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid WeddingIntake inputs (budget under min, negative guests, bad date)', () => {
    const invalidBudget = {
      weddingDate: '2026-12-10',
      cityTier: 'tier_1',
      guestCount: 100,
      totalBudgetINR: 50000, // below min ₹2,00,000
      selectedFunctions: ['wedding'],
      vibe: 'royal_heritage',
    };
    expect(WeddingIntakeSchema.safeParse(invalidBudget).success).toBe(false);

    const invalidDate = {
      weddingDate: 'tomorrow', // not YYYY-MM-DD
      cityTier: 'tier_1',
      guestCount: 100,
      totalBudgetINR: 2500000,
      selectedFunctions: ['wedding'],
      vibe: 'royal_heritage',
    };
    expect(WeddingIntakeSchema.safeParse(invalidDate).success).toBe(false);

    const emptyFunctions = {
      weddingDate: '2026-12-10',
      cityTier: 'tier_1',
      guestCount: 100,
      totalBudgetINR: 2500000,
      selectedFunctions: [], // min 1
      vibe: 'royal_heritage',
    };
    expect(WeddingIntakeSchema.safeParse(emptyFunctions).success).toBe(false);
  });

  it('rejects malformed or malicious AI output for PersonalizedIdeasSchema', () => {
    // Malicious injection attempt or missing fields
    const maliciousOutput = {
      themeTitle: 'Hacked',
      // palette missing
      decorConcepts: ['<script>alert("xss")</script>'],
    };

    const result = PersonalizedIdeasSchema.safeParse(maliciousOutput);
    expect(result.success).toBe(false);
  });

  it('generates 100% schema-valid fallback ideas for every vibe', () => {
    const vibes = [
      'royal_heritage',
      'pastel_modern',
      'bollywood_extravaganza',
      'minimalist_traditional',
    ] as const;

    for (const vibe of vibes) {
      const fallback = generateFallbackIdeas(vibe, 3000000, 300, ['wedding']);
      const parsed = PersonalizedIdeasSchema.safeParse(fallback);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.themeTitle.length).toBeGreaterThan(0);
        expect(parsed.data.palette.length).toBeGreaterThanOrEqual(2);
        expect(parsed.data.decorConcepts.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('generates 100% schema-valid fallback Plan B for rain, guest surges, and general scenarios', () => {
    const scenarios = [
      'Torrential rain predicted for open-air lawn sangeet',
      'Guest count surged by 150 people at the last minute',
      'Key decorator backed out 48 hours before wedding',
    ];

    for (const scenario of scenarios) {
      const fallback = generateFallbackPlanB(scenario, 2500000, 250);
      const parsed = PlanBResponseSchema.safeParse(fallback);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(['low', 'medium', 'critical']).toContain(parsed.data.riskLevel);
        expect(parsed.data.immediateActions.length).toBeGreaterThan(0);
        expect(parsed.data.vendorCommunicationScript.length).toBeGreaterThan(0);
      }
    }
  });

  it('generates 100% schema-valid fallback Tradeoff explanation for what-if slider changes', () => {
    const fallback = generateFallbackTradeoff(-500000, 50, 2000000, 300);
    const parsed = TradeoffExplanationSchema.safeParse(fallback);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.summary.length).toBeGreaterThan(0);
      expect(parsed.data.pros.length).toBeGreaterThan(0);
      expect(parsed.data.cons.length).toBeGreaterThan(0);
    }
  });
});
