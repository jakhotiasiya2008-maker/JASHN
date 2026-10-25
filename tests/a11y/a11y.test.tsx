import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import App from '../../src/App';
import { LandingPage } from '../../src/features/landing/LandingPage';
import { IntakeWizard } from '../../src/features/wizard/IntakeWizard';
import { Dashboard } from '../../src/features/dashboard/Dashboard';
import { usePlannerStore } from '../../src/lib/store';
import { createBudgetPlan } from '../../src/domain/budget';
import { createTimelinePlan } from '../../src/domain/timeline';
import { createDefaultVendorChecklist } from '../../src/domain/vendors';

describe('WCAG 2.2 AA Accessibility Audits (Axe Core)', () => {
  it('verifies Landing Page has no axe accessibility violations', async () => {
    const { container } = render(<LandingPage onStartWizard={() => {}} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it('verifies Intake Wizard Step 1 has no axe accessibility violations', async () => {
    const { container } = render(<IntakeWizard />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it('verifies Dashboard has no axe accessibility violations', async () => {
    // Populate store with valid mock plan
    const mockIntake = {
      coupleNames: 'Dev & Meera',
      weddingDate: '2026-12-15',
      cityTier: 'tier_1' as const,
      guestCount: 300,
      totalBudgetINR: 3000000,
      selectedFunctions: ['wedding' as const, 'sangeet' as const],
      vibe: 'royal_heritage' as const,
      priorities: ['grand_venue' as const],
    };

    usePlannerStore.setState({
      intake: mockIntake,
      budgetPlan: createBudgetPlan(mockIntake),
      timelinePlan: createTimelinePlan(mockIntake.weddingDate, mockIntake.selectedFunctions),
      vendorItems: createDefaultVendorChecklist(),
      currentTab: 'overview',
    });

    const { container } = render(<Dashboard />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it('verifies SkipLink is present in full App shell targeting #main-content', () => {
    const { container } = render(<App />);
    const skipLink = container.querySelector('.skip-link');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('verifies semantic landmarks exist (header, main, footer)', () => {
    const { container } = render(<App />);
    expect(container.querySelector('header[role="banner"]')).toBeInTheDocument();
    expect(container.querySelector('footer[role="contentinfo"]')).toBeInTheDocument();
  });
});
