import { describe, it, expect } from 'vitest';
import {
  createBudgetPlan,
  rebalanceBudget,
  distributeIntegerBudget,
  computeAdjustedWeights,
} from '../../src/domain/budget';
import {
  CATEGORY_IDS,
  CITY_TIERS,
  USER_PRIORITIES,
  WEDDING_FUNCTIONS,
  WEDDING_VIBES,
} from '../../src/domain/constants';
import { WeddingIntake } from '../../src/domain/types';

describe('Budget Engine - Pure Domain Logic', () => {
  it('distributes integer budget with EXACT sum matching total INR (Hare-Niemeyer)', () => {
    const items = [
      { id: 'venue' as const, weight: 25 },
      { id: 'catering' as const, weight: 30 },
      { id: 'decor' as const, weight: 15 },
      { id: 'photography' as const, weight: 10 },
      { id: 'contingency' as const, weight: 10 },
    ];

    const totalsToTest = [1000003, 2500000, 4999999, 10000000, 3333333, 7777777];

    for (const total of totalsToTest) {
      const distributed = distributeIntegerBudget(total, items);
      let sum = 0;
      for (const item of items) {
        sum += distributed[item.id];
        expect(distributed[item.id]).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(distributed[item.id])).toBe(true);
      }
      expect(sum).toBe(total);
    }
  });

  it('handles edge case of zero or empty budget gracefully', () => {
    const items = [{ id: 'venue' as const, weight: 10 }];
    const res = distributeIntegerBudget(0, items);
    expect(res.venue).toBe(0);
  });

  it('creates initial budget plan where sum of all categories EXACTLY equals total budget', () => {
    const intake: WeddingIntake = {
      coupleNames: 'Rohan & Ananya',
      weddingDate: '2026-11-20',
      cityTier: 'tier_1',
      guestCount: 350,
      totalBudgetINR: 3500000,
      selectedFunctions: ['haldi', 'mehendi', 'sangeet', 'wedding', 'reception'],
      vibe: 'royal_heritage',
      priorities: ['grand_venue', 'culinary_feast'],
    };

    const plan = createBudgetPlan(intake);

    expect(plan.totalBudgetINR).toBe(3500000);
    expect(plan.allocatedSumINR).toBe(3500000);
    expect(plan.remainingINR).toBe(0);
    expect(plan.contingencyINR).toBeGreaterThan(0);

    let calculatedSum = 0;
    for (const catId of CATEGORY_IDS) {
      const alloc = plan.allocations[catId]!;
      expect(alloc).toBeDefined();
      expect(alloc.allocatedAmountINR).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(alloc.allocatedAmountINR)).toBe(true);
      calculatedSum += alloc.allocatedAmountINR;
    }

    expect(calculatedSum).toBe(3500000);
  });

  it('runs randomized property tests (100 iterations) verifying sum equality, positivity, and integers', () => {
    // Deterministic pseudo-random seed for repeatable fast property testing
    let seed = 42;
    function pseudoRandom() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    }

    for (let i = 0; i < 100; i++) {
      const budget = Math.floor(pseudoRandom() * 9800000) + 200000;
      const guests = Math.floor(pseudoRandom() * 1500) + 30;
      const tierIndex = Math.floor(pseudoRandom() * CITY_TIERS.length);
      const vibeIndex = Math.floor(pseudoRandom() * WEDDING_VIBES.length);
      const tier = CITY_TIERS[tierIndex]!;
      const vibe = WEDDING_VIBES[vibeIndex]!;

      // pick random subset of functions
      const funcs = WEDDING_FUNCTIONS.filter(() => pseudoRandom() > 0.4);
      if (funcs.length === 0) funcs.push('wedding');

      // pick random priorities
      const priorities = USER_PRIORITIES.filter(() => pseudoRandom() > 0.6);

      const intake: WeddingIntake = {
        weddingDate: '2026-12-01',
        cityTier: tier,
        guestCount: guests,
        totalBudgetINR: budget,
        selectedFunctions: funcs,
        vibe: vibe,
        priorities: priorities,
      };

      const plan = createBudgetPlan(intake);

      let sum = 0;
      for (const catId of CATEGORY_IDS) {
        const amount = plan.allocations[catId]!.allocatedAmountINR;
        expect(amount).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(amount)).toBe(true);
        sum += amount;
      }

      expect(sum).toBe(plan.totalBudgetINR);
      expect(plan.allocatedSumINR).toBe(plan.totalBudgetINR);
      expect(plan.remainingINR).toBe(0);
      expect(plan.perGuestCostINR).toBe(Math.round(budget / guests));
    }
  });

  it('honors locked categories during live rebalancing without drift', () => {
    const intake: WeddingIntake = {
      weddingDate: '2026-11-20',
      cityTier: 'tier_2',
      guestCount: 250,
      totalBudgetINR: 2000000,
      selectedFunctions: ['sangeet', 'wedding'],
      vibe: 'pastel_modern',
      priorities: ['dream_decor'],
    };

    const initialPlan = createBudgetPlan(intake);

    // Lock venue to exactly ₹6,00,000
    const rebalanced = rebalanceBudget(initialPlan, {
      targetCategoryChange: {
        categoryId: 'venue',
        amountINR: 600000,
        lock: true,
      },
    });

    expect(rebalanced.allocations.venue!.allocatedAmountINR).toBe(600000);
    expect(rebalanced.allocations.venue!.isLocked).toBe(true);
    expect(rebalanced.allocatedSumINR).toBe(2000000);
    expect(rebalanced.remainingINR).toBe(0);

    // Now change total budget to ₹25,00,000 while venue is locked
    const rebalancedTotal = rebalanceBudget(rebalanced, {
      newTotalBudgetINR: 2500000,
    });

    // Venue must remain locked at ₹6,00,000
    expect(rebalancedTotal.allocations.venue!.allocatedAmountINR).toBe(600000);
    expect(rebalancedTotal.allocations.venue!.isLocked).toBe(true);
    expect(rebalancedTotal.totalBudgetINR).toBe(2500000);
    expect(rebalancedTotal.allocatedSumINR).toBe(2500000);

    // Toggle lock off on venue
    const unlockedPlan = rebalanceBudget(rebalancedTotal, {
      toggleLockCategory: 'venue',
    });
    expect(unlockedPlan.allocations.venue!.isLocked).toBe(false);
  });

  it('computes adjusted weights reflecting guest count, city tier, and priorities', () => {
    const highGuestWeights = computeAdjustedWeights(600, 'tier_1', ['wedding'], ['grand_venue']);
    const lowGuestWeights = computeAdjustedWeights(80, 'tier_3', ['wedding'], ['couture_fashion']);

    // High guest + Tier 1 + grand venue should heavily weight venue & catering
    expect(highGuestWeights.venue).toBeGreaterThan(lowGuestWeights.venue);
    expect(highGuestWeights.catering).toBeGreaterThan(lowGuestWeights.catering);
    expect(lowGuestWeights.attire).toBeGreaterThan(highGuestWeights.attire);
  });
});
