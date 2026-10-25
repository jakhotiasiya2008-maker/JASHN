import { describe, it, expect } from 'vitest';
import {
  createTimelinePlan,
  findCriticalPath,
  BASE_WEDDING_TASKS,
  toggleTaskCompletion,
  getDaysDifference,
} from '../../src/domain/timeline';

describe('Timeline Engine - Pure Domain Logic', () => {
  const mockCurrentDate = new Date('2026-06-01');

  it('calculates days remaining and backwards schedule correctly', () => {
    const weddingDate = '2026-12-01'; // 183 days away
    const plan = createTimelinePlan(
      weddingDate,
      ['haldi', 'mehendi', 'sangeet', 'wedding', 'reception'],
      mockCurrentDate
    );

    expect(plan.daysRemaining).toBe(183);
    expect(plan.isCompressedMode).toBe(false);
    expect(plan.tasks.length).toBeGreaterThan(0);

    // Tasks must be sorted in chronological order of due date ascending
    for (let i = 0; i < plan.tasks.length - 1; i++) {
      const current = new Date(plan.tasks[i]!.dueDate).getTime();
      const next = new Date(plan.tasks[i + 1]!.dueDate).getTime();
      expect(current).toBeLessThanOrEqual(next);
    }
  });

  it('identifies critical path accurately through task dependencies', () => {
    const criticalPath = findCriticalPath(BASE_WEDDING_TASKS);
    expect(criticalPath.length).toBeGreaterThan(0);
    // Budget finalize is the root requirement for venue booking
    expect(criticalPath).toContain('budget_finalize');
    expect(criticalPath).toContain('venue_book');
  });

  it('triggers compressed mode and risk warning when wedding date is close (<90 days)', () => {
    const closeWeddingDate = '2026-07-15'; // 44 days away from 2026-06-01
    const plan = createTimelinePlan(closeWeddingDate, ['wedding'], mockCurrentDate);

    expect(plan.isCompressedMode).toBe(true);
    expect(plan.daysRemaining).toBe(44);
    expect(plan.riskWarnings.length).toBeGreaterThan(0);
    expect(plan.riskWarnings[0]!.level).toBe('high');
    expect(plan.riskWarnings[0]!.fixAction).toBeDefined();
  });

  it('detects overdue, at-risk, and on-track task statuses accurately', () => {
    // Current date is June 15, wedding date is June 20 (5 days away)
    const testCurrentDate = new Date('2026-06-15');
    const weddingDate = '2026-06-20';
    const plan = createTimelinePlan(weddingDate, ['wedding'], testCurrentDate);

    const overdueTasks = plan.tasks.filter((t) => t.status === 'overdue');
    expect(overdueTasks.length).toBeGreaterThan(0);
    expect(plan.summary.overdue).toBe(overdueTasks.length);
    expect(plan.summary.total).toBe(plan.tasks.length);
  });

  it('allows completing tasks and updates summary counters', () => {
    const weddingDate = '2026-12-01';
    const plan = createTimelinePlan(weddingDate, ['wedding'], mockCurrentDate);

    const firstTask = plan.tasks[0]!;
    expect(firstTask.completed).toBe(false);

    const updatedPlan = toggleTaskCompletion(plan, firstTask.id, ['wedding'], mockCurrentDate);
    const toggledTask = updatedPlan.tasks.find((t) => t.id === firstTask.id);

    expect(toggledTask?.completed).toBe(true);
    expect(toggledTask?.status).toBe('completed');
    expect(updatedPlan.summary.completed).toBe(1);

    // Toggle back
    const untoggledPlan = toggleTaskCompletion(
      updatedPlan,
      firstTask.id,
      ['wedding'],
      mockCurrentDate
    );
    expect(untoggledPlan.summary.completed).toBe(0);
  });

  it('correctly calculates day differences', () => {
    const d1 = new Date('2026-06-10');
    const d2 = new Date('2026-06-01');
    expect(getDaysDifference(d1, d2)).toBe(9);
  });
});
