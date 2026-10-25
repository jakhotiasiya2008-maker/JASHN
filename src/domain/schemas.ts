/**
 * Jashn Zod Schemas
 * Strict validation for user input, AI personalization responses,
 * serverless API payloads, and versioned local storage.
 */

import { z } from 'zod';
import {
  BUDGET_CONSTANTS,
  CATEGORY_IDS,
  CITY_TIERS,
  USER_PRIORITIES,
  WEDDING_FUNCTIONS,
  WEDDING_VIBES,
} from './constants';

export const CategoryIdSchema = z.enum(CATEGORY_IDS);

export const CityTierSchema = z.enum(CITY_TIERS);

export const WeddingFunctionSchema = z.enum(WEDDING_FUNCTIONS);

export const WeddingVibeSchema = z.enum(WEDDING_VIBES);

export const UserPrioritySchema = z.enum(USER_PRIORITIES);

export const WeddingIntakeSchema = z.object({
  coupleNames: z.string().trim().max(100).optional(),
  weddingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Must be a valid YYYY-MM-DD date' }),
  cityTier: CityTierSchema,
  cityName: z.string().trim().max(80).optional(),
  guestCount: z
    .number()
    .int()
    .min(BUDGET_CONSTANTS.MIN_GUEST_COUNT, { message: `Minimum ${BUDGET_CONSTANTS.MIN_GUEST_COUNT} guests` })
    .max(BUDGET_CONSTANTS.MAX_GUEST_COUNT, { message: `Maximum ${BUDGET_CONSTANTS.MAX_GUEST_COUNT} guests` }),
  totalBudgetINR: z
    .number()
    .min(BUDGET_CONSTANTS.MIN_BUDGET_INR, { message: 'Budget must be at least ₹2,00,000' })
    .max(BUDGET_CONSTANTS.MAX_BUDGET_INR, { message: 'Budget cannot exceed ₹10,00,00,000' }),
  selectedFunctions: z
    .array(WeddingFunctionSchema)
    .min(1, { message: 'Select at least one wedding function' }),
  vibe: WeddingVibeSchema,
  priorities: z.array(UserPrioritySchema).default([]),
  specialNotes: z.string().trim().max(500).optional(),
});

export type ValidatedWeddingIntake = z.infer<typeof WeddingIntakeSchema>;

/**
 * AI Personalized Ideas Response Schema
 */
export const PersonalizedIdeasSchema = z.object({
  themeTitle: z.string().min(3).max(120),
  palette: z.array(z.string().min(2).max(40)).min(2).max(6),
  decorConcepts: z.array(z.string().min(5).max(300)).min(2).max(6),
  signatureMenu: z.array(z.string().min(5).max(300)).min(2).max(6),
  entertainmentIdeas: z.array(z.string().min(5).max(300)).min(2).max(6),
  budgetSavingTips: z.array(z.string().min(5).max(300)).min(2).max(6),
});

export type ValidatedPersonalizedIdeas = z.infer<typeof PersonalizedIdeasSchema>;

/**
 * AI Plan B Crisis Recovery Response Schema
 */
export const PlanBResponseSchema = z.object({
  scenario: z.string().min(3).max(200),
  riskLevel: z.enum(['low', 'medium', 'critical']),
  immediateActions: z.array(z.string().min(5).max(300)).min(2).max(6),
  next24Hours: z.array(z.string().min(5).max(300)).min(2).max(6),
  budgetImpactEstimate: z.string().min(5).max(200),
  vendorCommunicationScript: z.string().min(20).max(1000),
});

export type ValidatedPlanBResponse = z.infer<typeof PlanBResponseSchema>;

/**
 * AI What-If Sliders Tradeoff Explanation Response Schema
 */
export const TradeoffExplanationSchema = z.object({
  summary: z.string().min(10).max(300),
  pros: z.array(z.string().min(5).max(250)).min(1).max(4),
  cons: z.array(z.string().min(5).max(250)).min(1).max(4),
  recommendations: z.array(z.string().min(5).max(250)).min(1).max(4),
});

export type ValidatedTradeoffExplanation = z.infer<typeof TradeoffExplanationSchema>;

/**
 * Local Storage Version 1 Schema
 */
export const StorageStateV1Schema = z.object({
  version: z.literal(1),
  updatedAt: z.string(),
  intake: WeddingIntakeSchema,
  activeTheme: z.enum(['royal-gold', 'pastel-floral', 'midnight-sangeet', 'ivory-minimal']),
  completedTaskIds: z.array(z.string()),
  vendorItems: z.array(
    z.object({
      id: z.string(),
      categoryId: CategoryIdSchema,
      title: z.string(),
      vendorName: z.string().optional(),
      status: z.enum(['to_contact', 'contacted', 'quoted', 'booked']),
      quotedAmountINR: z.number().optional(),
      bookedAmountINR: z.number().optional(),
      keyQuestions: z.array(z.string()),
      redFlags: z.array(z.string()),
      negotiationTips: z.array(z.string()),
      contactInfo: z.string().optional(),
      notes: z.string().optional(),
    })
  ),
  personalizedIdeas: PersonalizedIdeasSchema.optional(),
  cachedPlanB: PlanBResponseSchema.optional(),
  lockedCategoryIds: z.array(CategoryIdSchema).default([]),
  customAllocations: z.record(CategoryIdSchema, z.number()).optional(),
});

export type ValidatedStorageStateV1 = z.infer<typeof StorageStateV1Schema>;
