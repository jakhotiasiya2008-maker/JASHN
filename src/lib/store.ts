/**
 * Jashn Global Zustand Store
 * Manages full lifecycle state: intake, deterministic budget & timeline engines,
 * vendor tracking, theme synchronization, and versioned persistence.
 */

import { create } from 'zustand';
import {
  WeddingIntake,
  BudgetPlan,
  TimelinePlan,
  VendorItem,
  BudgetCategoryId,
  VendorStatus,
} from '../domain/types';
import { createBudgetPlan, rebalanceBudget } from '../domain/budget';
import { createTimelinePlan, toggleTaskCompletion } from '../domain/timeline';
import { createDefaultVendorChecklist } from '../domain/vendors';
import {
  ValidatedPersonalizedIdeas,
  ValidatedTradeoffExplanation,
} from '../domain/schemas';
import { loadSavedState, saveState, clearSavedState } from './storage';
import { WEDDING_VIBE_LABELS, CATEGORY_IDS } from '../domain/constants';

export type PlannerTab = 'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas' | 'planb';
export type AppTheme = 'royal-gold' | 'pastel-floral' | 'midnight-sangeet' | 'ivory-minimal';

interface PlannerState {
  // Core state
  intake: WeddingIntake | null;
  budgetPlan: BudgetPlan | null;
  timelinePlan: TimelinePlan | null;
  vendorItems: VendorItem[];
  personalizedIdeas: ValidatedPersonalizedIdeas | null;
  activeTheme: AppTheme;
  currentTab: PlannerTab;

  // What-if trade-off state
  tradeoffExplanation: ValidatedTradeoffExplanation | null;
  isAnalyzingTradeoffs: boolean;
  isGeneratingIdeas: boolean;

  // Actions
  initializeStore: () => void;
  setIntake: (intake: WeddingIntake) => void;
  updateWhatIfSliders: (newBudgetINR: number, newGuestCount: number) => void;
  updateCategoryAllocation: (categoryId: BudgetCategoryId, amountINR: number, lock: boolean) => void;
  toggleLockCategory: (categoryId: BudgetCategoryId) => void;
  toggleTimelineTask: (taskId: string) => void;
  updateVendorStatus: (
    vendorId: string,
    status: VendorStatus,
    quotedAmountINR?: number,
    bookedAmountINR?: number,
    vendorName?: string
  ) => void;
  setPersonalizedIdeas: (ideas: ValidatedPersonalizedIdeas) => void;
  setTradeoffExplanation: (tradeoff: ValidatedTradeoffExplanation | null) => void;
  setIsAnalyzingTradeoffs: (analyzing: boolean) => void;
  setIsGeneratingIdeas: (generating: boolean) => void;
  setTheme: (theme: AppTheme) => void;
  setCurrentTab: (tab: PlannerTab) => void;
  resetPlanner: () => void;
}

export const usePlannerStore = create<PlannerState>((set, get) => ({
  intake: null,
  budgetPlan: null,
  timelinePlan: null,
  vendorItems: [],
  personalizedIdeas: null,
  activeTheme: 'royal-gold',
  currentTab: 'overview',
  tradeoffExplanation: null,
  isAnalyzingTradeoffs: false,
  isGeneratingIdeas: false,

  initializeStore: () => {
    const saved = loadSavedState();
    if (saved) {
      const budget = createBudgetPlan(saved.intake);
      // apply custom allocations if any
      let finalBudget = budget;
      if (saved.customAllocations) {
        for (const [catId, amount] of Object.entries(saved.customAllocations)) {
          finalBudget = rebalanceBudget(finalBudget, {
            targetCategoryChange: {
              categoryId: catId as BudgetCategoryId,
              amountINR: amount,
              lock: saved.lockedCategoryIds.includes(catId as BudgetCategoryId),
            },
          });
        }
      }

      const timeline = createTimelinePlan(
        saved.intake.weddingDate,
        saved.intake.selectedFunctions,
        new Date(),
        saved.completedTaskIds
      );

      set({
        intake: saved.intake,
        budgetPlan: finalBudget,
        timelinePlan: timeline,
        vendorItems: saved.vendorItems.length > 0 ? (saved.vendorItems as VendorItem[]) : createDefaultVendorChecklist(),
        personalizedIdeas: saved.personalizedIdeas || null,
        activeTheme: saved.activeTheme as AppTheme,
      });

      // Update HTML theme attribute
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', saved.activeTheme);
      }
    }
  },

  setIntake: (intake: WeddingIntake) => {
    const defaultTheme = (WEDDING_VIBE_LABELS[intake.vibe as keyof typeof WEDDING_VIBE_LABELS]?.defaultTheme || 'royal-gold') as AppTheme;
    const budgetPlan = createBudgetPlan(intake);
    const timelinePlan = createTimelinePlan(intake.weddingDate, intake.selectedFunctions);
    const vendorItems = createDefaultVendorChecklist();

    set({
      intake,
      budgetPlan,
      timelinePlan,
      vendorItems,
      activeTheme: defaultTheme,
      currentTab: 'overview',
    });

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', defaultTheme);
    }

    // Persist to storage
    saveState({
      version: 1,
      updatedAt: new Date().toISOString(),
      intake,
      activeTheme: defaultTheme,
      completedTaskIds: [],
      vendorItems,
      lockedCategoryIds: [],
    });
  },

  updateWhatIfSliders: (newBudgetINR: number, newGuestCount: number) => {
    const { budgetPlan, intake, timelinePlan, vendorItems, activeTheme, personalizedIdeas } = get();
    if (!budgetPlan || !intake) return;

    const updatedBudget = rebalanceBudget(budgetPlan, {
      newTotalBudgetINR: newBudgetINR,
      newGuestCount: newGuestCount,
    });

    const updatedIntake: WeddingIntake = {
      ...intake,
      totalBudgetINR: newBudgetINR,
      guestCount: newGuestCount,
    };

    set({
      intake: updatedIntake,
      budgetPlan: updatedBudget,
    });

    // Persist
    saveState({
      version: 1,
      updatedAt: new Date().toISOString(),
      intake: updatedIntake,
      activeTheme,
      completedTaskIds: timelinePlan?.tasks.filter((t) => t.completed).map((t) => t.id) || [],
      vendorItems,
      personalizedIdeas: personalizedIdeas || undefined,
      lockedCategoryIds: CATEGORY_IDS.filter(
        (id) => Boolean(updatedBudget.allocations[id]?.isLocked)
      ),
    });
  },

  updateCategoryAllocation: (categoryId: BudgetCategoryId, amountINR: number, lock: boolean) => {
    const { budgetPlan, intake, timelinePlan, vendorItems, activeTheme, personalizedIdeas } = get();
    if (!budgetPlan || !intake) return;

    const updatedBudget = rebalanceBudget(budgetPlan, {
      targetCategoryChange: { categoryId, amountINR, lock },
    });

    set({ budgetPlan: updatedBudget });

    saveState({
      version: 1,
      updatedAt: new Date().toISOString(),
      intake,
      activeTheme,
      completedTaskIds: timelinePlan?.tasks.filter((t) => t.completed).map((t) => t.id) || [],
      vendorItems,
      personalizedIdeas: personalizedIdeas || undefined,
      lockedCategoryIds: CATEGORY_IDS.filter(
        (id) => Boolean(updatedBudget.allocations[id]?.isLocked)
      ),
    });
  },

  toggleLockCategory: (categoryId: BudgetCategoryId) => {
    const { budgetPlan } = get();
    if (!budgetPlan) return;

    const updatedBudget = rebalanceBudget(budgetPlan, {
      toggleLockCategory: categoryId,
    });

    set({ budgetPlan: updatedBudget });
  },

  toggleTimelineTask: (taskId: string) => {
    const { timelinePlan, intake, budgetPlan, vendorItems, activeTheme, personalizedIdeas } = get();
    if (!timelinePlan || !intake) return;

    const updatedTimeline = toggleTaskCompletion(
      timelinePlan,
      taskId,
      intake.selectedFunctions
    );

    set({ timelinePlan: updatedTimeline });

    saveState({
      version: 1,
      updatedAt: new Date().toISOString(),
      intake,
      activeTheme,
      completedTaskIds: updatedTimeline.tasks.filter((t) => t.completed).map((t) => t.id),
      vendorItems,
      personalizedIdeas: personalizedIdeas || undefined,
      lockedCategoryIds: budgetPlan
        ? CATEGORY_IDS.filter((id) => Boolean(budgetPlan.allocations[id]?.isLocked))
        : [],
    });
  },

  updateVendorStatus: (
    vendorId: string,
    status: VendorStatus,
    quotedAmountINR?: number,
    bookedAmountINR?: number,
    vendorName?: string
  ) => {
    const { vendorItems, intake, timelinePlan, budgetPlan, activeTheme, personalizedIdeas } = get();
    if (!intake) return;

    const nextVendors = vendorItems.map((v) => {
      if (v.id !== vendorId) return v;
      return {
        ...v,
        status,
        ...(quotedAmountINR !== undefined ? { quotedAmountINR } : {}),
        ...(bookedAmountINR !== undefined ? { bookedAmountINR } : {}),
        ...(vendorName !== undefined ? { vendorName } : {}),
      };
    });

    set({ vendorItems: nextVendors });

    saveState({
      version: 1,
      updatedAt: new Date().toISOString(),
      intake,
      activeTheme,
      completedTaskIds: timelinePlan?.tasks.filter((t) => t.completed).map((t) => t.id) || [],
      vendorItems: nextVendors,
      personalizedIdeas: personalizedIdeas || undefined,
      lockedCategoryIds: budgetPlan
        ? CATEGORY_IDS.filter((id) => Boolean(budgetPlan.allocations[id]?.isLocked))
        : [],
    });
  },

  setPersonalizedIdeas: (ideas: ValidatedPersonalizedIdeas) => {
    const { intake, timelinePlan, budgetPlan, vendorItems, activeTheme } = get();
    set({ personalizedIdeas: ideas, isGeneratingIdeas: false });

    if (intake) {
      saveState({
        version: 1,
        updatedAt: new Date().toISOString(),
        intake,
        activeTheme,
        completedTaskIds: timelinePlan?.tasks.filter((t) => t.completed).map((t) => t.id) || [],
        vendorItems,
        personalizedIdeas: ideas,
        lockedCategoryIds: budgetPlan
          ? CATEGORY_IDS.filter((id) => Boolean(budgetPlan.allocations[id]?.isLocked))
          : [],
      });
    }
  },

  setTradeoffExplanation: (tradeoff) => set({ tradeoffExplanation: tradeoff }),
  setIsAnalyzingTradeoffs: (analyzing) => set({ isAnalyzingTradeoffs: analyzing }),
  setIsGeneratingIdeas: (generating) => set({ isGeneratingIdeas: generating }),

  setTheme: (theme: AppTheme) => {
    set({ activeTheme: theme });
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  },

  setCurrentTab: (tab: PlannerTab) => set({ currentTab: tab }),

  resetPlanner: () => {
    clearSavedState();
    set({
      intake: null,
      budgetPlan: null,
      timelinePlan: null,
      vendorItems: [],
      personalizedIdeas: null,
      tradeoffExplanation: null,
      currentTab: 'overview',
      activeTheme: 'royal-gold',
    });
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', 'royal-gold');
    }
  },
}));
