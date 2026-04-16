import { expect, test } from '@playwright/test'

test('homepage loads and shows backend data', async ({ page }) => {
	await page.goto('/')

	await expect(
		page.getByRole('heading', {
			name: 'Welcome to The Tredyffrin Aerial Images Collection',
		}),
	).toBeVisible()

	await expect(page.getByTestId('backend-status')).toHaveText(
		/Backend status:\s*OK/,
	)
})
