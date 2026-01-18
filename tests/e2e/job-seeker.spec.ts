import { test, expect } from '@playwright/test';

test.describe('Job Seeker Registration', () => {

    test('should navigate from main register page to job seeker registration', async ({ page }) => {
        await page.goto('/register');

        // Click the link to job seeker registration
        await page.getByRole('link', { name: 'Looking for a job? Register as a Job Seeker' }).click();

        // validat URL
        await expect(page).toHaveURL(/\/register\/job-seeker/);

        // Validate Page Title (CardTitle renders h3)
        await expect(page.getByRole('heading', { level: 3 })).toContainText('Job Seeker Sign Up');
    });

    test('should complete registration flow (mocked backend)', async ({ page }) => {
        // Mock the API response to avoid DB requirement
        await page.route('/api/auth/register/job-seeker', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    user: { id: 'test-id', email: 'test@example.com' }
                })
            });
        });

        await page.goto('/register/job-seeker');

        // Step 1: Personal Info
        await page.getByLabel('First Name').fill('John');
        await page.getByLabel('Surname').fill('Doe');

        // Select 'Permanent'
        await page.getByLabel('First Name').click(); // defocus previous
        await page.locator('label[for="perm"]').click(); // Interact with the visible label
        await expect(page.locator('#perm')).toBeChecked();

        await page.getByRole('button', { name: 'Next' }).click();

        // Step 2: Employment Details (Permanent)
        // Wait for animation and visibility
        await expect(page.getByLabel('Company Name')).toBeVisible({ timeout: 5000 });
        await page.getByLabel('Company Name').fill('Tech Corp');

        await page.getByRole('button', { name: 'Next' }).click();

        // Step 3: Account Info
        await page.getByLabel('Email Address').fill('jobseeker@example.com');
        await page.getByLabel('Username').fill('johndoe');
        await page.getByLabel('Password').fill('Password123!');

        // Submit
        await page.getByRole('button', { name: 'Complete Sign Up' }).click();

        // Expect success: redirected to login with query param
        await expect(page).toHaveURL(/\/login\?registered=true/);
    });

});
