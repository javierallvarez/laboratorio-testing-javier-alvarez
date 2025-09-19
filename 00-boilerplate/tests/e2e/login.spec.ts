import { test, expect } from '@playwright/test';
import { TEST_CREDENTIALS, TEST_URLS } from '../config/test-credentials';

test.describe('Login Scene E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URLS.LOGIN);
    await page.waitForLoadState('networkidle');
  });


  test('should display login form with required fields', async ({ page }) => {
    console.log('Asegurar que título, campos y botón del formulario aparezcan');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByTestId('login-user-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit-button')).toBeVisible();
    console.log('Test ok!');
  });


  test('should login successfully with valid credentials', async ({ page }) => {
    console.log('Logearse con credenciales (variables de entorno)');
    await page.getByTestId('login-user-input').locator('input').fill(TEST_CREDENTIALS.VALID.user);
    await page.getByTestId('login-password-input').locator('input').fill(TEST_CREDENTIALS.VALID.password);

    await page.getByTestId('login-submit-button').click();

    await page.waitForURL(`**${TEST_URLS.SUBMODULE_LIST}`, { timeout: 10000 });
    await expect(page).toHaveURL(new RegExp(`.*${TEST_URLS.SUBMODULE_LIST}`));
    console.log('Test ok!');
  });


  test('should show error message for invalid credentials', async ({ page }) => {
    console.log(' Escribir credenciales inválidas y debería aparecer un mensaje de error');
    await page.getByTestId('login-user-input').locator('input').fill(TEST_CREDENTIALS.INVALID.user);
    await page.getByTestId('login-password-input').locator('input').fill(TEST_CREDENTIALS.INVALID.password);

    await page.getByTestId('login-submit-button').click();

    await expect(page.getByText('Usuario y/o password no válidos')).toBeVisible({ timeout: 10000 });
    console.log('Test ok!');
  });


  test('should respect character limits in input fields', async ({ page }) => {
    console.log('Limite de 20 caracteres debe limitar');
    const longText = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    await page.getByTestId('login-user-input').locator('input').fill(longText);

    const userValue = await page.getByTestId('login-user-input').locator('input').inputValue();
    expect(userValue.length).toBeLessThanOrEqual(20);

    await page.getByTestId('login-user-input').locator('input').clear();
    await page.getByTestId('login-password-input').locator('input').fill(longText);

    const passwordValue = await page.getByTestId('login-password-input').locator('input').inputValue();
    expect(passwordValue.length).toBeLessThanOrEqual(20);
    console.log(`Campo contraseña limitado a ${passwordValue.length} caracteres`);
    console.log('Test ok!');
  });
});
