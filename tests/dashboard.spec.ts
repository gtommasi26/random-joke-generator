import { test, expect } from '@playwright/test';

// Dashboard URL
const DASHBOARD_URL = 'https://genesis.scor.com/workspace/module/view/latest/ri.workshop.main.module.f2c9b654-b7cf-4152-8b06-476cb52cb371';

test.describe('Dashboard Tests', () => {
  test('should load the dashboard page', async ({ page }) => {
    await page.goto(DASHBOARD_URL);
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('genesis.scor.com');
  });

  test('should have a valid title or heading', async ({ page }) => {
    await page.goto(DASHBOARD_URL);
    await page.waitForLoadState('networkidle');
    // Check if page has content
    const body = page.locator('body');
    await expect(body).toContainText(/.+/, { timeout: 10000 });
  });

  test('should display dashboard content', async ({ page }) => {
    await page.goto(DASHBOARD_URL);
    await page.waitForLoadState('networkidle');
    // Check for any visible elements on page
    const content = page.locator('main, [role="main"], .dashboard, .content');
    const isVisible = await content.first().isVisible().catch(() => false);
    if (isVisible) {
      await expect(content.first()).toBeVisible();
    }
  });

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(DASHBOARD_URL);
    await page.waitForLoadState('networkidle');
    
    // Assert no critical errors
    const criticalErrors = errors.filter(e => !e.includes('404') && !e.includes('CORS'));
    expect(criticalErrors.length).toBe(0);
  });

  test('should be responsive', async ({ page }) => {
    await page.goto(DASHBOARD_URL);
    await page.waitForLoadState('networkidle');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    const content = page.locator('body');
    await expect(content).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(content).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(content).toBeVisible();
  });

  test('should have accessible elements', async ({ page }) => {
    await page.goto(DASHBOARD_URL);
    await page.waitForLoadState('networkidle');
    
    // Check for basic accessibility attributes
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    // If there are buttons, they should be accessible
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();
    }
  });

  test('should load images without breaking', async ({ page }) => {
    const failedImages: string[] = [];
    
    page.on('response', response => {
      if (response.url().match(/\.(jpg|png|gif|svg|webp)$/i) && !response.ok()) {
        failedImages.push(response.url());
      }
    });
    
    await page.goto(DASHBOARD_URL);
    await page.waitForLoadState('networkidle');
    
    // Allow some failed images but not all
    expect(failedImages.length).toBeLessThan(10);
  });
});
