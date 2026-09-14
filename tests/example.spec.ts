import { test, expect } from '@playwright/test';

test('should load the page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Joke Generator/i);
});

test('should have a button to get a joke', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const button = page.getByRole('button', { name: /get joke/i });
  await expect(button).toBeVisible();
});

test('should display a joke when button is clicked', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const button = page.getByRole('button', { name: /get joke/i });
  await button.click();
  // Wait for joke to be displayed
  const jokeDisplay = page.locator('[data-testid="joke-display"]');
  await expect(jokeDisplay).toBeVisible({ timeout: 5000 });
});
