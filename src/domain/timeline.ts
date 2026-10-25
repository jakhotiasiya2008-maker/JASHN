/**
 * Jashn Timeline Engine (Pure Functions)
 * Backwards scheduling from the wedding date with dependency resolution,
 * critical-path detection, intelligent lead-time compression, and risk warnings.
 */

import { TIMELINE_CONSTANTS, WeddingFunction } from './constants';
import { TimelinePlan, TimelineTask, TaskStatus } from './types';

export interface TaskDefinition {
  id: string;
  title: string;
  category: TimelineTask['category'];
  functionScope?: WeddingFunction;
  idealWeeksBefore: number;
  minWeeksBefore: number;
  dependencies: string[];
  description: string;
  actionTip: string;
}

export const BASE_WEDDING_TASKS: TaskDefinition[] = [
  {
    id: 'budget_finalize',
    title: 'Finalize Wedding Budget & Family Contribution',
    category: 'contingency',
    idealWeeksBefore: 36,
    minWeeksBefore: 4,
    dependencies: [],
    description: 'Lock in total contribution and category limits across families to prevent confusion.',
    actionTip: 'Hold a unified family meeting; fix a hard 10% contingency allocation.',
  },
  {
    id: 'venue_book',
    title: 'Shortlist & Book Wedding & Sangeet Venues',
    category: 'venue',
    idealWeeksBefore: 32,
    minWeeksBefore: 3,
    dependencies: ['budget_finalize'],
    description: 'Securing the primary banquet, lawn, or palace is the single biggest Indian wedding milestone.',
    actionTip: 'Check air-conditioning capacity, generator backup, and loud-music curfew hours (10 PM rule).',
  },
  {
    id: 'caterer_menu',
    title: 'Book Caterer & Finalize Multi-Cuisine Menu',
    category: 'catering',
    idealWeeksBefore: 24,
    minWeeksBefore: 3,
    dependencies: ['venue_book'],
    description: 'Arrange tasting sessions across live chaat counters, regional delicacies, and desserts.',
    actionTip: 'Lock plate pricing in writing including cutlery, mineral water, and service staff gratuity.',
  },
  {
    id: 'photo_book',
    title: 'Hire Candid Photographer & Cinematographer',
    category: 'photography',
    idealWeeksBefore: 24,
    minWeeksBefore: 2,
    dependencies: ['venue_book'],
    description: 'Top Indian wedding visual storytellers book out 6-9 months in advance for auspicious muhurat dates.',
    actionTip: 'Request raw unedited footage rights and confirm the exact number of deliverables.',
  },
  {
    id: 'decor_design',
    title: 'Approve Mandap & Floral Decor Moodboard',
    category: 'decor',
    idealWeeksBefore: 18,
    minWeeksBefore: 2,
    dependencies: ['venue_book'],
    description: 'Finalize stage lighting, entrance walkway, haldi marigold backdrop, and photo booths.',
    actionTip: 'Ask for 3D render mockups and specify seasonal local flowers to reduce imported costs.',
  },
  {
    id: 'attire_shopping',
    title: 'Bridal Lehenga & Groom Sherwani Shopping',
    category: 'attire',
    idealWeeksBefore: 16,
    minWeeksBefore: 2,
    dependencies: ['budget_finalize'],
    description: 'Custom couture embroidery, fittings, and matching jewellery take 6-10 weeks turnaround.',
    actionTip: 'Schedule the final trial at least 15 days before the event to accommodate alterations.',
  },
  {
    id: 'pandit_book',
    title: 'Book Family Pandit & Confirm Puja Samagri List',
    category: 'rituals',
    idealWeeksBefore: 14,
    minWeeksBefore: 1,
    dependencies: ['venue_book'],
    description: 'Verify Vedic ritual requirements, muhurat timings for varmala, and havan arrangements.',
    actionTip: 'Request a detailed samagri checklist in Hindi/English so items can be procured in bulk.',
  },
  {
    id: 'mehendi_artist',
    title: 'Book Bridal Mehendi Artist & Guest Team',
    category: 'attire',
    functionScope: 'mehendi',
    idealWeeksBefore: 12,
    minWeeksBefore: 1,
    dependencies: ['venue_book'],
    description: 'Lock in lead artist for bridal intricate arms/feet and 2-3 assistants for guests.',
    actionTip: 'Check henna organic stain guarantee and book bridal sitting 1 day in advance for deep color.',
  },
  {
    id: 'sangeet_dj',
    title: 'Book Sangeet DJ, Dhol Players & Choreographer',
    category: 'music_entertainment',
    functionScope: 'sangeet',
    idealWeeksBefore: 10,
    minWeeksBefore: 1,
    dependencies: ['venue_book'],
    description: 'Assemble dance track lists, practice family flash mobs, and sound console setup.',
    actionTip: 'Ensure permissions for commercial music licensing (IPRS/PPL) are clarified with venue.',
  },
  {
    id: 'invitations_send',
    title: 'Send Digital & Boxed Wedding Invitations',
    category: 'invitations',
    idealWeeksBefore: 8,
    minWeeksBefore: 1,
    dependencies: ['venue_book'],
    description: 'Distribute WhatsApp save-the-dates, RSVP forms, and traditional mithai boxes to elders.',
    actionTip: 'Follow up with a WhatsApp broadcast 3 weeks prior to lock final headcount for catering.',
  },
  {
    id: 'guest_stay',
    title: 'Block Hotel Rooms & Outstation Transport',
    category: 'travel_stay',
    idealWeeksBefore: 8,
    minWeeksBefore: 1,
    dependencies: ['venue_book'],
    description: 'Secure bulk room blocks near the venue and coordinate railway/airport pick-up cabs.',
    actionTip: 'Group guests into shared airport tempo travellers to slash logistics expenditure.',
  },
  {
    id: 'final_walkthrough',
    title: 'Final Venue Walkthrough & Vendor Coordination',
    category: 'contingency',
    idealWeeksBefore: 2,
    minWeeksBefore: 0.5,
    dependencies: [
      'venue_book',
      'caterer_menu',
      'decor_design',
      'photo_book',
      'sangeet_dj',
    ],
    description: 'Conduct on-site dry run with venue manager, decorator, DJ, and family event lead.',
    actionTip: 'Appoint 2 trusted cousins with printed vendor contact sheets to handle day-of calls.',
  },
];

/**
 * Computes difference in days between two dates.
 */
export function getDaysDifference(targetDate: Date, baseDate: Date): number {
  const diffTime = targetDate.getTime() - baseDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Formats a Date object as YYYY-MM-DD string.
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Computes critical path using longest path DAG traversal from leaf to root.
 */
export function findCriticalPath(tasks: TaskDefinition[]): string[] {
  const taskMap = new Map<string, TaskDefinition>();
  for (const t of tasks) {
    taskMap.set(t.id, t);
  }

  const memo = new Map<string, { duration: number; path: string[] }>();

  function getLongestPath(taskId: string): { duration: number; path: string[] } {
    if (memo.has(taskId)) {
      return memo.get(taskId)!;
    }
    const task = taskMap.get(taskId);
    if (!task) return { duration: 0, path: [] };

    let maxDepDuration = 0;
    let bestDepPath: string[] = [];

    for (const depId of task.dependencies) {
      const depResult = getLongestPath(depId);
      if (depResult.duration > maxDepDuration) {
        maxDepDuration = depResult.duration;
        bestDepPath = depResult.path;
      }
    }

    const currentResult = {
      duration: maxDepDuration + task.idealWeeksBefore,
      path: [...bestDepPath, taskId],
    };

    memo.set(taskId, currentResult);
    return currentResult;
  }

  let longestPath: string[] = [];
  let maxDuration = -1;

  for (const t of tasks) {
    const res = getLongestPath(t.id);
    if (res.duration > maxDuration) {
      maxDuration = res.duration;
      longestPath = res.path;
    }
  }

  return longestPath;
}

/**
 * Generates the deterministic timeline plan based on wedding date and selected functions.
 */
export function createTimelinePlan(
  weddingDateStr: string,
  selectedFunctions: WeddingFunction[],
  currentDate: Date = new Date(),
  completedTaskIds: string[] = []
): TimelinePlan {
  const weddingDate = new Date(weddingDateStr);
  const daysRemaining = Math.max(0, getDaysDifference(weddingDate, currentDate));
  const availableWeeks = Math.max(1, Math.floor(daysRemaining / 7));
  const isCompressedMode = daysRemaining < TIMELINE_CONSTANTS.COMPRESSED_THRESHOLD_DAYS;

  // Filter tasks relevant to selected functions
  const relevantTaskDefs = BASE_WEDDING_TASKS.filter((task) => {
    if (!task.functionScope) return true;
    return selectedFunctions.includes(task.functionScope);
  });

  const criticalPathIds = findCriticalPath(relevantTaskDefs);
  const criticalPathSet = new Set(criticalPathIds);
  const completedSet = new Set(completedTaskIds);

  const riskWarnings: TimelinePlan['riskWarnings'] = [];

  // If wedding is within 45 days, raise high-level warning
  if (daysRemaining < TIMELINE_CONSTANTS.CRITICAL_THRESHOLD_DAYS) {
    riskWarnings.push({
      id: 'urgent_timeline',
      level: 'high',
      message: `Wedding is in only ${daysRemaining} days! Standard 6-month vendor lead times are impossible.`,
      fixAction:
        'Activate Express Mode: Book single-venue multi-function banquets that provide turnkey decor and in-house catering.',
    });
  } else if (isCompressedMode) {
    riskWarnings.push({
      id: 'compressed_timeline',
      level: 'medium',
      message: `Planning window is ${daysRemaining} days (under 3 months). Schedules have been compressed.`,
      fixAction:
        'Fast-track venue and bridal couture trials within the next 7 days to eliminate production delays.',
    });
  }

  // Calculate task due dates and statuses
  const tasks: TimelineTask[] = relevantTaskDefs.map((def) => {
    const isCompleted = completedSet.has(def.id);

    // Calculate weeks before wedding
    let weeksBefore = def.idealWeeksBefore;
    if (isCompressedMode) {
      // Proportional compression respecting minimum lead times
      const ratio = Math.min(1, availableWeeks / 36);
      weeksBefore = Math.max(def.minWeeksBefore, Math.round(def.idealWeeksBefore * ratio));
    }

    // Due date = weddingDate - (weeksBefore * 7 days)
    const dueDate = new Date(weddingDate);
    dueDate.setDate(dueDate.getDate() - Math.round(weeksBefore * 7));

    // Determine status
    let status: TaskStatus = 'ok';
    if (isCompleted) {
      status = 'completed';
    } else {
      const daysUntilDue = getDaysDifference(dueDate, currentDate);
      if (daysUntilDue < 0) {
        status = 'overdue';
      } else if (daysUntilDue <= TIMELINE_CONSTANTS.AT_RISK_BUFFER_DAYS) {
        status = 'at_risk';
      } else {
        status = 'ok';
      }
    }

    return {
      id: def.id,
      title: def.title,
      category: def.category,
      functionScope: def.functionScope,
      idealWeeksBefore: def.idealWeeksBefore,
      compressedWeeksBefore: weeksBefore,
      dueDate: formatDateISO(dueDate),
      dependencies: def.dependencies,
      isCriticalPath: criticalPathSet.has(def.id),
      status,
      completed: isCompleted,
      description: def.description,
      actionTip: def.actionTip,
    };
  });

  // Sort tasks chronologically by due date ascending
  tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Count summary
  let completedCount = 0;
  let overdueCount = 0;
  let atRiskCount = 0;
  let onTrackCount = 0;

  for (const t of tasks) {
    if (t.completed) completedCount++;
    else if (t.status === 'overdue') overdueCount++;
    else if (t.status === 'at_risk') atRiskCount++;
    else onTrackCount++;
  }

  return {
    weddingDate: weddingDateStr,
    daysRemaining,
    isCompressedMode,
    tasks,
    criticalPathTaskIds: criticalPathIds,
    summary: {
      total: tasks.length,
      completed: completedCount,
      overdue: overdueCount,
      atRisk: atRiskCount,
      onTrack: onTrackCount,
    },
    riskWarnings,
  };
}

/**
 * Toggles a task completion state and returns updated plan.
 */
export function toggleTaskCompletion(
  plan: TimelinePlan,
  taskId: string,
  selectedFunctions: WeddingFunction[],
  currentDate: Date = new Date()
): TimelinePlan {
  const currentCompleted = plan.tasks.filter((t) => t.completed).map((t) => t.id);
  const exists = currentCompleted.includes(taskId);
  const nextCompleted = exists
    ? currentCompleted.filter((id) => id !== taskId)
    : [...currentCompleted, taskId];

  return createTimelinePlan(plan.weddingDate, selectedFunctions, currentDate, nextCompleted);
}
