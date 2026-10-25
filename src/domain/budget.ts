/**
 * Jashn Budget Engine (Pure Functions)
 * Computes deterministic wedding budget allocations using tiered presets,
 * multi-variable weights, and the largest-remainder (Hare-Niemeyer) rounding method.
 * Guarantees that allocations sum EXACTLY to total budget INR with zero floating point drift.
 */

import {
  BASE_CATEGORY_WEIGHTS,
  BUDGET_CONSTANTS,
  CATEGORY_IDS,
  CATEGORY_LABELS,
  BudgetCategoryId,
  CityTier,
  UserPriority,
  WeddingFunction,
} from './constants';
import { BudgetPlan, CategoryAllocation, WeddingIntake } from './types';

/**
 * Computes category weights adjusted by guest count, city tier, functions, and priorities.
 */
export function computeAdjustedWeights(
  guestCount: number,
  cityTier: CityTier,
  selectedFunctions: WeddingFunction[],
  priorities: UserPriority[]
): Record<BudgetCategoryId, number> {
  const weights: Record<BudgetCategoryId, number> = { ...BASE_CATEGORY_WEIGHTS };

  // 1. Guest count adjustments
  if (guestCount >= 400) {
    weights.venue += 2;
    weights.catering += 3;
    weights.decor = Math.max(5, weights.decor - 2);
    weights.photography = Math.max(5, weights.photography - 2);
    weights.music_entertainment = Math.max(2, weights.music_entertainment - 1);
  } else if (guestCount < 150) {
    weights.venue = Math.max(15, weights.venue - 3);
    weights.catering = Math.max(18, weights.catering - 3);
    weights.decor += 2;
    weights.photography += 2;
    weights.attire += 2;
  }

  // 2. City tier adjustments
  if (cityTier === 'destination') {
    weights.travel_stay += 8;
    weights.venue += 2;
    weights.catering = Math.max(18, weights.catering - 4);
    weights.decor = Math.max(8, weights.decor - 3);
    weights.invitations = Math.max(1, weights.invitations - 1);
    weights.rituals = Math.max(1, weights.rituals - 1);
    weights.music_entertainment = Math.max(2, weights.music_entertainment - 1);
  } else if (cityTier === 'tier_1') {
    weights.venue += 3;
    weights.travel_stay += 2;
    weights.catering = Math.max(20, weights.catering - 2);
    weights.decor = Math.max(8, weights.decor - 2);
    weights.music_entertainment = Math.max(2, weights.music_entertainment - 1);
  } else if (cityTier === 'tier_3') {
    weights.venue = Math.max(16, weights.venue - 3);
    weights.catering += 2;
    weights.decor += 1;
  }

  // 3. Multi-function adjustments
  const functionCount = selectedFunctions.length;
  if (functionCount >= 4) {
    weights.music_entertainment += 2;
    weights.decor += 2;
    weights.attire += 1;
    weights.catering += 1;
    weights.venue = Math.max(16, weights.venue - 3);
    weights.travel_stay = Math.max(2, weights.travel_stay - 2);
    weights.contingency = Math.max(9, weights.contingency - 1);
  } else if (functionCount <= 2) {
    weights.music_entertainment = Math.max(2, weights.music_entertainment - 1);
    weights.decor = Math.max(8, weights.decor - 2);
    weights.contingency += 3;
  }

  // 4. User priorities adjustments
  for (const priority of priorities) {
    switch (priority) {
      case 'grand_venue':
        weights.venue += 5;
        break;
      case 'culinary_feast':
        weights.catering += 5;
        break;
      case 'dream_decor':
        weights.decor += 4;
        break;
      case 'cinematic_photography':
        weights.photography += 3;
        break;
      case 'couture_fashion':
        weights.attire += 3;
        break;
      case 'rocking_sangeet':
        weights.music_entertainment += 3;
        break;
    }
  }

  // Ensure all weights are strictly positive
  for (const cat of CATEGORY_IDS) {
    weights[cat] = Math.max(1, weights[cat]);
  }

  return weights;
}

/**
 * Largest-Remainder (Hare-Niemeyer) distribution algorithm.
 * Guarantees exact integer sum equality with no floating point errors.
 */
export function distributeIntegerBudget(
  totalToDistribute: number,
  items: Array<{ id: BudgetCategoryId; weight: number }>
): Record<BudgetCategoryId, number> {
  const result: Partial<Record<BudgetCategoryId, number>> = {};
  if (items.length === 0 || totalToDistribute <= 0) {
    for (const item of items) {
      result[item.id] = 0;
    }
    return result as Record<BudgetCategoryId, number>;
  }

  const totalWeight = items.reduce((acc, curr) => acc + curr.weight, 0);
  if (totalWeight <= 0) {
    // Equal distribution if all weights are zero
    const baseShare = Math.floor(totalToDistribute / items.length);
    let rem = totalToDistribute - baseShare * items.length;
    for (const item of items) {
      result[item.id] = baseShare + (rem > 0 ? 1 : 0);
      if (rem > 0) rem--;
    }
    return result as Record<BudgetCategoryId, number>;
  }

  // Step 1: Compute exact quota and integer floor
  const quotaMap: Array<{ id: BudgetCategoryId; floor: number; remainder: number; index: number }> = [];
  let sumFloors = 0;

  items.forEach((item, index) => {
    const exactQuota = (item.weight / totalWeight) * totalToDistribute;
    const floor = Math.floor(exactQuota);
    const remainder = exactQuota - floor;
    sumFloors += floor;
    quotaMap.push({ id: item.id, floor, remainder, index });
  });

  // Step 2: Remainder units to distribute
  let remainderToDistribute = totalToDistribute - sumFloors;

  // Step 3: Sort descending by remainder, breaking ties deterministically by index
  quotaMap.sort((a, b) => {
    if (b.remainder !== a.remainder) {
      return b.remainder - a.remainder;
    }
    return a.index - b.index;
  });

  // Step 4: Allocate +1 unit to largest remainders until exact sum is met
  for (const item of quotaMap) {
    const extra = remainderToDistribute > 0 ? 1 : 0;
    result[item.id] = item.floor + extra;
    if (remainderToDistribute > 0) {
      remainderToDistribute--;
    }
  }

  return result as Record<BudgetCategoryId, number>;
}

/**
 * Creates a brand new BudgetPlan from intake parameters.
 */
export function createBudgetPlan(intake: WeddingIntake): BudgetPlan {
  const guestCount = Math.max(
    BUDGET_CONSTANTS.MIN_GUEST_COUNT,
    Math.min(BUDGET_CONSTANTS.MAX_GUEST_COUNT, Math.round(intake.guestCount))
  );
  const totalBudgetINR = Math.max(
    BUDGET_CONSTANTS.MIN_BUDGET_INR,
    Math.round(intake.totalBudgetINR)
  );

  const weights = computeAdjustedWeights(
    guestCount,
    intake.cityTier,
    intake.selectedFunctions,
    intake.priorities
  );

  const items = CATEGORY_IDS.map((id) => ({ id, weight: weights[id] }));
  const distributed = distributeIntegerBudget(totalBudgetINR, items);

  const allocations: Partial<Record<BudgetCategoryId, CategoryAllocation>> = {};
  let allocatedSumINR = 0;

  for (const id of CATEGORY_IDS) {
    const allocated = distributed[id];
    allocatedSumINR += allocated;
    const percentage = Number(((allocated / totalBudgetINR) * 100).toFixed(2));
    allocations[id] = {
      categoryId: id,
      label: CATEGORY_LABELS[id],
      allocatedAmountINR: allocated,
      percentage,
      isLocked: false,
      notes: getCategoryGuidanceNote(id, allocated, guestCount),
    };
  }

  return {
    totalBudgetINR,
    guestCount,
    perGuestCostINR: Math.round(totalBudgetINR / guestCount),
    allocations: allocations as Record<BudgetCategoryId, CategoryAllocation>,
    contingencyINR: distributed.contingency,
    allocatedSumINR,
    remainingINR: totalBudgetINR - allocatedSumINR, // Exactly 0
  };
}

/**
 * Rebalances budget when total budget changes or when a category is modified / locked.
 * Respects locked category amounts and dynamically redistributes remaining pool
 * across all unlocked categories via Hare-Niemeyer method.
 */
export function rebalanceBudget(
  currentPlan: BudgetPlan,
  updates: {
    newTotalBudgetINR?: number;
    newGuestCount?: number;
    targetCategoryChange?: {
      categoryId: BudgetCategoryId;
      amountINR: number;
      lock: boolean;
    };
    toggleLockCategory?: BudgetCategoryId;
  }
): BudgetPlan {
  const totalBudget = Math.max(
    BUDGET_CONSTANTS.MIN_BUDGET_INR,
    updates.newTotalBudgetINR !== undefined
      ? Math.round(updates.newTotalBudgetINR)
      : currentPlan.totalBudgetINR
  );

  const guestCount = Math.max(
    BUDGET_CONSTANTS.MIN_GUEST_COUNT,
    updates.newGuestCount !== undefined
      ? Math.round(updates.newGuestCount)
      : currentPlan.guestCount
  );

  // Clone current allocations
  const workingAllocations = {
    ...currentPlan.allocations,
  } as Record<BudgetCategoryId, CategoryAllocation>;

  // Toggle lock if requested
  if (updates.toggleLockCategory) {
    const target = workingAllocations[updates.toggleLockCategory];
    if (target) {
      workingAllocations[updates.toggleLockCategory] = {
        ...target,
        isLocked: !target.isLocked,
      };
    }
  }

  // Handle explicit category change
  if (updates.targetCategoryChange) {
    const { categoryId, amountINR, lock } = updates.targetCategoryChange;
    const clampedAmount = Math.max(0, Math.min(totalBudget, Math.round(amountINR)));
    const currentCat = workingAllocations[categoryId];
    if (currentCat) {
      workingAllocations[categoryId] = {
        ...currentCat,
        allocatedAmountINR: clampedAmount,
        isLocked: lock,
      };
    }
  }

  // Calculate locked pool and available unlocked budget
  let lockedSum = 0;
  const unlockedCategories: BudgetCategoryId[] = [];

  for (const id of CATEGORY_IDS) {
    const cat = workingAllocations[id];
    if (cat?.isLocked) {
      lockedSum += cat.allocatedAmountINR;
    } else {
      unlockedCategories.push(id);
    }
  }

  // Clamp if lockedSum exceeds total budget
  let availableForUnlocked = totalBudget - lockedSum;
  if (availableForUnlocked < 0) {
    // If locked sum exceeds total budget, unlock other categories or scale down proportionally
    availableForUnlocked = 0;
  }

  if (unlockedCategories.length > 0) {
    // Use original weights for unlocked items
    const items = unlockedCategories.map((id) => ({
      id,
      weight: BASE_CATEGORY_WEIGHTS[id],
    }));

    const distributed = distributeIntegerBudget(availableForUnlocked, items);
    for (const id of unlockedCategories) {
      const currentCat = workingAllocations[id];
      const dist = distributed[id];
      if (currentCat && dist !== undefined) {
        workingAllocations[id] = {
          ...currentCat,
          allocatedAmountINR: dist,
        };
      }
    }
  }

  // Recalculate percentages, notes, and final sum
  let finalSum = 0;
  for (const id of CATEGORY_IDS) {
    const alloc = workingAllocations[id];
    if (alloc) {
      finalSum += alloc.allocatedAmountINR;
      alloc.percentage = Number(((alloc.allocatedAmountINR / totalBudget) * 100).toFixed(2));
      alloc.notes = getCategoryGuidanceNote(id, alloc.allocatedAmountINR, guestCount);
    }
  }

  const contingencyAmount = workingAllocations.contingency?.allocatedAmountINR ?? 0;

  return {
    totalBudgetINR: totalBudget,
    guestCount,
    perGuestCostINR: Math.round(totalBudget / guestCount),
    allocations: workingAllocations,
    contingencyINR: contingencyAmount,
    allocatedSumINR: finalSum,
    remainingINR: totalBudget - finalSum,
  };
}

/**
 * Returns contextual Indian wedding planning guidance for a category allocation.
 */
function getCategoryGuidanceNote(
  categoryId: BudgetCategoryId,
  allocatedAmount: number,
  guestCount: number
): string {
  const perGuest = Math.round(allocatedAmount / guestCount);
  switch (categoryId) {
    case 'venue':
      return `Target ₹${allocatedAmount.toLocaleString('en-IN')} covering banquet hall / lawns & mandap staging.`;
    case 'catering':
      return `Equates to approx ₹${perGuest.toLocaleString('en-IN')}/plate across selected celebratory functions.`;
    case 'decor':
      return `Allocated for floral setup, entrance arches, LED stage, and thematic seating.`;
    case 'photography':
      return `Covers candid wedding photographer, traditional videography, and pre-wedding reel coverage.`;
    case 'attire':
      return `Budget for bridal lehenga/saree, groom sherwani, jewellery rentals, and bridal makeup.`;
    case 'music_entertainment':
      return `Includes DJ setup, Sangeet sound & lighting console, dhol players, and emcee.`;
    case 'invitations':
      return `Reserved for digital invites, wedding websites, and boxed luxury mithai/dry fruit hampers.`;
    case 'travel_stay':
      return `Reserved for outstation guest rooms, airport cabs, and bridal party shuttles.`;
    case 'rituals':
      return `Covers pandit dakshina, puja samagri, havan wood, varmalas, and coconuts.`;
    case 'contingency':
      return `Emergency buffer for guest over-count, overtime generator costs, or weather adjustments.`;
  }
}
