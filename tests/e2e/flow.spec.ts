import { test, expect } from '@playwright/test';

test.describe('Jashn Wedding Planner - End to End Happy Path', () => {
  test('completes wizard, explores dashboard, updates sliders, and exports plan', async ({ page }) => {
    // 1. Visit landing page
    await page.goto('/');
    await expect(page).toHaveTitle(/Jashn \| AI Indian Wedding Planner/i);

    // 2. Start wizard
    const startButton = page.getByRole('button', { name: /Start Free Planning/i });
    await expect(startButton).toBeVisible();
    await startButton.click();

    // 3. Step 1: Date & Location
    await expect(page.getByText(/Step 1 of 5/i)).toBeVisible();
    await page.getByRole('button', { name: /Continue/i }).click();

    // 4. Step 2: Guests & Budget
    await expect(page.getByText(/Step 2 of 5/i)).toBeVisible();
    await page.getByRole('button', { name: /Continue/i }).click();

    // 5. Step 3: Ceremonies
    await expect(page.getByText(/Step 3 of 5/i)).toBeVisible();
    await page.getByRole('button', { name: /Continue/i }).click();

    // 6. Step 4: Vibe
    await expect(page.getByText(/Step 4 of 5/i)).toBeVisible();
    await page.getByRole('button', { name: /Continue/i }).click();

    // 7. Step 5: Notes & Final Submit
    await expect(page.getByText(/Step 5 of 5/i)).toBeVisible();
    await page.getByRole('button', { name: /Generate My Jashn Plan/i }).click();

    // 8. Verify Dashboard is rendered with overview tabs
    const overviewTab = page.getByRole('tab', { name: /Overview/i });
    await expect(overviewTab).toBeVisible();
    await expect(overviewTab).toHaveAttribute('aria-selected', 'true');

    // 9. Change What-If Budget slider
    const budgetSlider = page.locator('#overview-budget-slider');
    await expect(budgetSlider).toBeVisible();
    await budgetSlider.fill('4000000');

    // 10. Switch to Export tab
    const exportTab = page.getByRole('tab', { name: /Export & Share/i });
    await exportTab.click();
    await expect(exportTab).toHaveAttribute('aria-selected', 'true');

    // Verify .ics download and WhatsApp export options
    await expect(page.getByRole('button', { name: /Download .ics File/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Open WhatsApp/i })).toBeVisible();
  });
});
