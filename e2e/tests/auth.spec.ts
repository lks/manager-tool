import { test, expect } from '@playwright/test'

test.describe('Google Sign-In', () => {
  test('should display login page with Google Sign-In button', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Manager Tool/)
    await expect(page.getByText('Manager Tool')).toBeVisible()
    await expect(page.getByText('Your productivity toolbox')).toBeVisible()

    const googleButton = page.getByRole('button', { name: /Sign in with Google/i })
    await expect(googleButton).toBeVisible()

    const googleIcon = page.locator('svg')
    await expect(googleIcon).toBeVisible()
  })

  test('should redirect to Google OAuth on button click', async ({ page }) => {
    await page.goto('/')

    const googleButton = page.getByRole('button', { name: /Sign in with Google/i })
    await googleButton.click()

    await page.waitForURL((url) => url.href.includes('accounts.google.com'), {
      timeout: 10000,
    })
  })

  test('should redirect unauthenticated user to login page when accessing dashboard', async ({
    page,
  }) => {
    await page.goto('/dashboard')

    await expect(page).toHaveURL('/')
  })

  test('should display Terms of Service notice', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('By signing in, you agree to our Terms of Service')).toBeVisible()
  })
})
