import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
    test('should load successfully', async ({ page }) => {
        await page.goto('/');

        // Check for main heading
        await expect(page.getByRole('heading', { name: /Know your next company/i })).toBeVisible();

        // Check for search bar
        await expect(page.getByPlaceholder(/Search companies/i)).toBeVisible();

        // Check for CTA buttons - "Browse Insights" matched from app/page.tsx
        await expect(page.getByRole('link', { name: /Browse Insights/i })).toBeVisible();
    });

    test('should redirect to login when clicking Browse Insights', async ({ page }) => {
        await page.goto('/');

        // Click on Browse Insights button
        await page.getByRole('link', { name: /Browse Insights/i }).click();

        // Should navigate to login page since search is protected
        await expect(page).toHaveURL(/\/login\?from=%2Fsearch/);
    });

    test('should perform search from header', async ({ page }) => {
        await page.goto('/');

        // Fill search input
        const searchInput = page.getByPlaceholder(/Search companies/i).first();
        await searchInput.fill('Acme');

        // Submit search
        await searchInput.press('Enter');

        // Should navigate to login page since search is protected
        await expect(page).toHaveURL(/\/login\?from=%2Fsearch/);
    });
});
