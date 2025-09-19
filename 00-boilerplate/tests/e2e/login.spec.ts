import { test, expect } from '@playwright/test';
import { TEST_CREDENTIALS, TEST_URLS } from '../config/test-credentials';

test.describe('Login Scene E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URLS.LOGIN);
    await page.waitForLoadState('networkidle');
  });

  // Asegurar que título, campos y botón del formulario aparezcan
  test('should display login form with required fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByTestId('login-user-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit-button')).toBeVisible();
  });


  // Logearse con credenciales (variables de entorno)
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.getByTestId('login-user-input').locator('input').fill(TEST_CREDENTIALS.VALID.user);
    await page.getByTestId('login-password-input').locator('input').fill(TEST_CREDENTIALS.VALID.password);

    await page.getByTestId('login-submit-button').click();

    // Tras el login, nos debería mostrar la app
    await page.waitForURL(`**${TEST_URLS.SUBMODULE_LIST}`, { timeout: 10000 });
    await expect(page).toHaveURL(new RegExp(`.*${TEST_URLS.SUBMODULE_LIST}`));
  });


  // Escribir credenciales inválidas y debería aparecer un mensaje de error
  test('should show error message for invalid credentials', async ({ page }) => {
    await page.getByTestId('login-user-input').locator('input').fill(TEST_CREDENTIALS.INVALID.user);
    await page.getByTestId('login-password-input').locator('input').fill(TEST_CREDENTIALS.INVALID.password);

    await page.getByTestId('login-submit-button').click();

    await expect(page.getByText('Usuario y/o password no válidos')).toBeVisible({ timeout: 10000 });
  });


  // Agregué un limite de 20 caracteres a los campos y deben limitar
  test('should respect character limits in input fields', async ({ page }) => {
    const longText = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    await page.getByTestId('login-user-input').locator('input').fill(longText);

    const userValue = await page.getByTestId('login-user-input').locator('input').inputValue();
    expect(userValue.length).toBeLessThanOrEqual(20);

    await page.getByTestId('login-user-input').locator('input').clear();
    await page.getByTestId('login-password-input').locator('input').fill(longText);

    const passwordValue = await page.getByTestId('login-password-input').locator('input').inputValue();
    expect(passwordValue.length).toBeLessThanOrEqual(20);
  });

});
