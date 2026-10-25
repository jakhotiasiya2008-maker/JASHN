/**
 * Jashn Playwright Demo Walkthrough
 * Automates the 100-second video demo walkthrough per docs/DEMO_SCRIPT.md.
 * Injects a visual cursor and click highlight, handles smooth scrolling,
 * and exercises all core product pillars with seeded demo fixtures.
 */

import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { createDemoFixture } from './fixtures/demo-data';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const IS_HEADLESS = process.env.HEADLESS === 'true';
const SLOW_MO = Number(process.env.SLOW_MO) || 250;
const SCREENSHOT_DIR = path.resolve(process.cwd(), 'docs/screenshots');

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function smoothScroll(page: Page, targetY: number, step = 40): Promise<void> {
  await page.evaluate(
    async ({ target, stepPx }) => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const effectiveTarget = Math.min(target, maxScroll);
      await new Promise<void>((resolve) => {
        let lastY = -1;
        const interval = setInterval(() => {
          const currentY = window.scrollY;
          const diff = effectiveTarget - currentY;
          if (
            Math.abs(diff) <= stepPx ||
            currentY === lastY ||
            (diff > 0 && currentY >= maxScroll) ||
            (diff < 0 && currentY <= 0)
          ) {
            window.scrollTo(0, effectiveTarget);
            clearInterval(interval);
            resolve();
          } else {
            lastY = currentY;
            window.scrollTo(0, currentY + Math.sign(diff) * stepPx);
          }
        }, 16);
      });
    },
    { target: targetY, stepPx: step }
  );
}

async function captureScene(page: Page, sceneName: string): Promise<void> {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
  const filePath = path.join(SCREENSHOT_DIR, `${sceneName}.png`);
  await page.screenshot({ path: filePath });
}

export async function runWalkthrough(): Promise<void> {
  const fixture = createDemoFixture();
  const startTime = Date.now();

  console.log(`\n======================================================`);
  console.log(`🎬 Launching Jashn 100s Demo Walkthrough`);
  console.log(`📍 Target URL: ${BASE_URL}`);
  console.log(`🖥️ Resolution: 1920x1080 Headed`);
  console.log(`======================================================\n`);

  const browser: Browser = await chromium.launch({
    headless: IS_HEADLESS,
    slowMo: SLOW_MO,
  });

  const context: BrowserContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  const page: Page = await context.newPage();

  // Inject visible custom pointer and click pulse overlay
  await page.addInitScript(() => {
    window.addEventListener('DOMContentLoaded', () => {
      const cursor = document.createElement('div');
      cursor.id = 'demo-cursor';
      cursor.style.position = 'fixed';
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.borderRadius = '50%';
      cursor.style.background = 'rgba(212, 175, 55, 0.85)';
      cursor.style.border = '2px solid #ffffff';
      cursor.style.boxShadow = '0 0 16px rgba(212, 175, 55, 0.95), 0 2px 8px rgba(0,0,0,0.4)';
      cursor.style.pointerEvents = 'none';
      cursor.style.zIndex = '999999';
      cursor.style.transition = 'transform 0.12s ease-out, opacity 0.2s ease';
      cursor.style.transform = 'translate(-50%, -50%)';
      cursor.style.display = 'block';
      cursor.style.left = '-100px';
      cursor.style.top = '-100px';
      document.body.appendChild(cursor);

      window.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      });

      window.addEventListener('mousedown', (e) => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.65)';
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        ripple.style.width = '48px';
        ripple.style.height = '48px';
        ripple.style.borderRadius = '50%';
        ripple.style.border = '2px solid #d4af37';
        ripple.style.background = 'rgba(212, 175, 55, 0.35)';
        ripple.style.transform = 'translate(-50%, -50%) scale(0.2)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '999998';
        ripple.style.transition = 'all 0.5s ease-out';
        document.body.appendChild(ripple);

        requestAnimationFrame(() => {
          ripple.style.transform = 'translate(-50%, -50%) scale(1.6)';
          ripple.style.opacity = '0';
        });

        setTimeout(() => ripple.remove(), 550);
      });

      window.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  });

  try {
    // -------------------------------------------------------------------------
    // Scene 1: Landing Page & Problem Presentation (0:00 - 0:10, 10s)
    // -------------------------------------------------------------------------
    console.log('[Scene 1/10] Landing Page: Luxury hero, rotating mandala, value props');
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    await sleep(2500);
    await smoothScroll(page, 450, 25);
    await sleep(2000);
    await smoothScroll(page, 0, 30);
    await sleep(1500);
    await captureScene(page, 'scene-1-landing');

    // -------------------------------------------------------------------------
    // Scene 2: 5-Step Intake Wizard (0:10 - 0:24, 14s)
    // -------------------------------------------------------------------------
    console.log('[Scene 2/10] Intake Wizard: Seeded 350 guests, Jaipur, 4 functions');
    const startBtn = page.getByRole('button', { name: /Start Free Planning/i });
    await startBtn.hover();
    await sleep(800);
    await startBtn.click();
    await sleep(1200);

    // Step 1: Date & Location
    await page.fill('#coupleNames', fixture.coupleNames);
    await page.fill('#weddingDate', fixture.weddingDate);
    // Select Tier 2
    const tier2Btn = page.getByText(/Tier 2 City/i);
    await tier2Btn.click();
    await page.fill('#cityName', fixture.cityName);
    await sleep(800);
    await page.getByRole('button', { name: /Continue/i }).click();
    await sleep(1000);

    // Step 2: Guests & Budget
    await page.fill('#guestCount', fixture.guestCount.toString());
    // Click ₹25 Lakhs preset chip
    const preset25L = page.getByRole('button', { name: /₹25 Lakhs/i });
    await preset25L.click();
    await sleep(1000);
    await page.getByRole('button', { name: /Continue/i }).click();
    await sleep(1000);

    // Step 3: Ceremonies & Functions
    // 4 functions: Mehendi, Sangeet, Wedding, Reception are selected by default
    await sleep(1000);
    await page.getByRole('button', { name: /Continue/i }).click();
    await sleep(1000);

    // Step 4: Aesthetic & Vibe (Royal Heritage)
    const royalVibe = page.getByText(/Royal Heritage & Regal Grandeur/i);
    await royalVibe.click();
    await sleep(1200);
    await page.getByRole('button', { name: /Continue/i }).click();
    await sleep(1000);

    // Step 5: Priorities & Generate
    const submitBtn = page.getByRole('button', { name: /Generate My Jashn Plan/i });
    await submitBtn.hover();
    await sleep(800);
    await submitBtn.click();
    // Watch canvas confetti burst
    await sleep(2500);
    await captureScene(page, 'scene-2-wizard-completed');

    // -------------------------------------------------------------------------
    // Scene 3: Budget Engine & What-If Sliders (0:24 - 0:36, 12s)
    // -------------------------------------------------------------------------
    console.log('[Scene 3/10] Budget Engine: SVG donut chart, Hare-Niemeyer rebalance');
    const budgetTabBtn = page.getByRole('tab', { name: /Budget Engine/i });
    await budgetTabBtn.click();
    await sleep(1500);

    // Hover around donut chart
    const donutSvg = page.locator('svg[aria-label="Wedding budget category distribution chart"]');
    if (await donutSvg.isVisible()) {
      await donutSvg.hover();
      await sleep(1200);
    }

    // Switch back to Overview to demonstrate live What-If Sliders
    const overviewTabBtn = page.getByRole('tab', { name: /Overview/i });
    await overviewTabBtn.click();
    await sleep(1000);
    await smoothScroll(page, 450, 30);

    // Adjust budget slider from ₹25L to ₹30L
    const budgetSlider = page.locator('#overview-budget-slider');
    await budgetSlider.focus();
    await budgetSlider.evaluate((el: HTMLInputElement) => {
      el.value = '3000000';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await sleep(2000); // Wait for debounced trade-off typewriter text
    await captureScene(page, 'scene-3-what-if-slider');

    // -------------------------------------------------------------------------
    // Scene 4: Timeline Roadmap & Risk Alert (0:36 - 0:48, 12s)
    // -------------------------------------------------------------------------
    console.log('[Scene 4/10] Timeline: Critical path DAG, backward schedule, risk alert');
    await smoothScroll(page, 0, 30);
    const timelineTabBtn = page.getByRole('tab', { name: /Timeline & Milestones/i });
    await timelineTabBtn.click();
    await sleep(1500);

    // Smooth scroll down roadmap
    await smoothScroll(page, 550, 20);
    await sleep(2000);

    // Toggle one milestone completion checkbox
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    if (await firstCheckbox.isVisible()) {
      await firstCheckbox.click();
      await sleep(1000);
    }
    await smoothScroll(page, 0, 25);
    await sleep(1000);
    await captureScene(page, 'scene-4-timeline');

    // -------------------------------------------------------------------------
    // Scene 5: Vendor Playbook & Negotiation Checklist (0:48 - 0:58, 10s)
    // -------------------------------------------------------------------------
    console.log('[Scene 5/10] Vendors: Progress ring, cultural questions, red flags');
    const vendorsTabBtn = page.getByRole('tab', { name: /Vendors & Checklist/i });
    await vendorsTabBtn.click();
    await sleep(1500);

    // Click on Banquet / Catering vendor
    const catererItem = page.getByText(/Wedding Master Caterer/i);
    if (await catererItem.isVisible()) {
      await catererItem.click();
      await sleep(1200);
    }
    await smoothScroll(page, 300, 20);
    await sleep(2000);
    await smoothScroll(page, 0, 25);
    await captureScene(page, 'scene-5-vendors');

    // -------------------------------------------------------------------------
    // Scene 6: Tactical Plan B Mode (0:58 - 1:08, 10s)
    // -------------------------------------------------------------------------
    console.log('[Scene 6/10] Plan B: Rain contingency recovery protocol & vendor script');
    const planBTabBtn = page.getByRole('tab', { name: /Plan B Recovery/i });
    await planBTabBtn.click();
    await sleep(1500);

    // Click rain emergency prompt chip
    const rainChip = page.getByText(/Unseasonal torrential rain/i);
    if (await rainChip.isVisible()) {
      await rainChip.click();
      await sleep(2500);
    }

    // Click copy script button to trigger toast notification
    const copyScriptBtn = page.getByRole('button', { name: /Copy Script/i });
    if (await copyScriptBtn.isVisible()) {
      await copyScriptBtn.click();
      await sleep(1500);
    }
    await captureScene(page, 'scene-6-plan-b');

    // -------------------------------------------------------------------------
    // Scene 7: AI Cultural Personalization (1:08 - 1:18, 10s)
    // -------------------------------------------------------------------------
    console.log('[Scene 7/10] Ideas: Curated royal feast menu, palette, decor concepts');
    const ideasTabBtn = page.getByRole('tab', { name: /Personalized Ideas/i });
    await ideasTabBtn.click();
    await sleep(2000);
    await smoothScroll(page, 400, 20);
    await sleep(2000);
    await smoothScroll(page, 0, 25);
    await sleep(1000);
    await captureScene(page, 'scene-7-ideas');

    // -------------------------------------------------------------------------
    // Scene 8: Switchable Luxury Themes (1:18 - 1:26, 8s)
    // -------------------------------------------------------------------------
    console.log('[Scene 8/10] Themes: Midnight Sangeet, Pastel Floral, Ivory Minimal');
    const sangeetThemeRadio = page.getByRole('radio', { name: /Midnight Sangeet/i });
    await sangeetThemeRadio.click();
    await sleep(1500);

    const pastelThemeRadio = page.getByRole('radio', { name: /Pastel Floral/i });
    await pastelThemeRadio.click();
    await sleep(1500);

    const ivoryThemeRadio = page.getByRole('radio', { name: /Ivory Minimal/i });
    await ivoryThemeRadio.click();
    await sleep(1500);

    const royalGoldRadio = page.getByRole('radio', { name: /Royal Gold/i });
    await royalGoldRadio.click();
    await sleep(1500);
    await captureScene(page, 'scene-8-theme-switch');

    // -------------------------------------------------------------------------
    // Scene 9: Accessibility & Reduced Motion (1:26 - 1:33, 7s)
    // -------------------------------------------------------------------------
    console.log('[Scene 9/10] Accessibility: Keyboard tablist navigation, data table');
    await page.keyboard.press('Tab');
    await sleep(800);

    // Switch to budget tab and toggle accessible table
    await budgetTabBtn.click();
    await sleep(1000);
    const tableToggleBtn = page.getByRole('button', { name: /Accessible Table/i });
    if (await tableToggleBtn.isVisible()) {
      await tableToggleBtn.click();
      await sleep(1800);
    }
    await captureScene(page, 'scene-9-accessibility-table');

    // -------------------------------------------------------------------------
    // Scene 10: Multi-Format Export Suite (1:33 - 1:40, 7s)
    // -------------------------------------------------------------------------
    console.log('[Scene 10/10] Export: Calendar ICS, print-friendly, WhatsApp summary');
    const exportTabBtn = page.getByRole('tab', { name: /Export & Share/i });
    await exportTabBtn.click();
    await sleep(2000);
    await captureScene(page, 'scene-10-export');

    const totalSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ Walkthrough finished cleanly in ${totalSeconds} seconds!`);
    console.log(`📸 Screenshots saved to: ${SCREENSHOT_DIR}\n`);
  } catch (error) {
    console.error('❌ Walkthrough error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Direct execution
runWalkthrough()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
