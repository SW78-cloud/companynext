import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
    test('should load successfully', async ({ page }) => {
        await page.goto('/');

        // Check for main heading
        await expect(page.getByRole('heading', { name: /Transparent Company Insights/i })).toBeVisible();

        // Check for search bar
        await expect(page.getByPlaceholder(/Search companies/i)).toBeVisible();

        // Check for CTA buttons
        await expect(page.getByRole('link', { name: /Browse Companies/i })).toBeVisible();
    });

    test('should navigate to search page', async ({ page }) => {
        await page.goto('/');

        // Click on Browse Companies button
        await page.getByRole('link', { name: /Browse Companies/i }).click();

        // Should navigate to search page
        await expect(page).toHaveURL(/\/search/);
    });

    test('should perform search from header', async ({ page }) => {
        await page.goto('/');

        // Fill search input
        const searchInput = page.getByPlaceholder(/Search companies/i).first();
        await searchInput.fill('Acme');

        // Submit search
        await searchInput.press('Enter');

        // Should navigate to search results
        await expect(page).toHaveURL(/\/search\?q=Acme/);
    });
});
