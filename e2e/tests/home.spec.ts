import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.locator('h1')).toContainText('Manager Tool')
    await expect(page.locator('main')).toBeVisible()
  })
  
  test('should have correct title', async ({ page }) => {
    await page.goto('/')
    
    await expect(page).toHaveTitle(/Manager Tool/)
  })
})

test.describe('API Health', () => {
  test('should return ok status', async ({ request }) => {
    const response = await request.get('http://localhost:3001/health')
    
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    expect(data.status).toBe('ok')
  })
})

test.describe('API Root', () => {
  test('should return API info', async ({ request }) => {
    const response = await request.get('http://localhost:3001/')
    
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    expect(data.message).toBe('Manager Tool API')
    expect(data.version).toBe('1.0.0')
  })
})
