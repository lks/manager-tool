import { test, expect } from '@playwright/test'

test.describe('Google Sign-In Authentication', () => {
  test.describe('Feature: Google Sign-In', () => {
    test('Scenario: Display login page with Google Sign-In button', async ({ page }) => {
      // Given I am on the login page
      await page.goto('/')

      // Then I should see the title "Manager Tool"
      await expect(page).toHaveTitle(/Manager Tool/)

      // And I should see "Your productivity toolbox"
      await expect(page.getByText('Your productivity toolbox')).toBeVisible()

      // And I should see the "Sign in with Google" button
      await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible()
    })

    test('Scenario: Redirect to Google OAuth when clicking sign-in button', async ({ page }) => {
      // Given I am on the login page
      await page.goto('/')

      // When I click the "Sign in with Google" button
      await page.getByRole('button', { name: 'Sign in with Google' }).click()

      // Then I should be redirected to Google OAuth
      await page.waitForURL((url) => url.href.includes('accounts.google.com'), {
        timeout: 10000,
      })
    })

    test('Scenario: Redirect unauthenticated user to login when accessing dashboard', async ({
      page,
    }) => {
      // Given I am not authenticated (fresh context)
      await page.goto('/')

      // When I navigate to the dashboard page
      await page.goto('/dashboard')

      // Then I should be redirected to the login page
      await expect(page).toHaveURL('/')
    })

    test('Scenario: Display Terms of Service notice', async ({ page }) => {
      // Given I am on the login page
      await page.goto('/')

      // Then I should see "By signing in, you agree to our Terms of Service"
      await expect(
        page.getByText('By signing in, you agree to our Terms of Service')
      ).toBeVisible()
    })
  })
})
