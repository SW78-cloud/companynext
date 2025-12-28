import { test, expect } from '@playwright/test';

test.describe('Company Detail Page', () => {
    test('should display company information', async ({ page }) => {
        // This test assumes seed data exists
        // In a real scenario, you'd create test data first

        await page.goto('/search?q=Acme');

        // Wait for search results
        await page.waitForSelector('text=Acme Corporation');

        // Click on first company
        await page.getByText('Acme Corporation').first().click();

        // Should be on company detail page
        await expect(page.getByRole('heading', { name: /Acme Corporation/i })).toBeVisible();

        // Check for metrics cards
        await expect(page.getByText(/Total Case Records/i)).toBeVisible();
        await expect(page.getByText(/User Reviews/i)).toBeVisible();
    });

    test('should switch between tabs', async ({ page }) => {
        await page.goto('/search?q=Acme');
        await page.waitForSelector('text=Acme Corporation');
        await page.getByText('Acme Corporation').first().click();

        // Click on Legal Cases tab
        await page.getByRole('tab', { name: /Legal Cases/i }).click();
        await expect(page.getByText(/Recent Legal Cases/i)).toBeVisible();

        // Click on Reviews tab
        await page.getByRole('tab', { name: /Reviews/i }).click();
        await expect(page.getByText(/User Reviews/i)).toBeVisible();
    });
});
