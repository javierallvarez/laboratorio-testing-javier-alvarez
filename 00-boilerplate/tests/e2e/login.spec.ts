import { test, expect } from '@playwright/test';
import { TEST_CREDENTIALS, TEST_URLS } from '../config/test-credentials';

test.describe('Login Scene E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_URLS.LOGIN);
    await page.waitForLoadState('networkidle');
  });


  // Comprobamos que el formulario de login aparezca
  test('should display login form with required fields', async ({ page }) => {
    console.log('Asegurar que título, campos y botón del formulario aparezcan');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByTestId('login-user-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit-button')).toBeVisible();
    console.log('Test ok!');
  });


  // Comprobamos el login con usuario y pass correctos
  test('should login successfully with valid credentials', async ({ page }) => {
    console.log('Logearse con credenciales (variables de entorno)');
    await page.getByTestId('login-user-input').locator('input').fill(TEST_CREDENTIALS.VALID.user);
    await page.getByTestId('login-password-input').locator('input').fill(TEST_CREDENTIALS.VALID.password);

    await page.getByTestId('login-submit-button').click();

    console.log('Esperando redirección a la página de submodules');
    await page.waitForURL(`**${TEST_URLS.SUBMODULE_LIST}`, { timeout: 10000 });
    await expect(page).toHaveURL(new RegExp(`.*${TEST_URLS.SUBMODULE_LIST}`));
    console.log('Login exitoso - redirección completada');
  });


  // Comprobamos el login con usuario y pass incorrectos
  test('should show error message for invalid credentials', async ({ page }) => {
    console.log('Probando login con credenciales inválidas');
    await page.getByTestId('login-user-input').locator('input').fill(TEST_CREDENTIALS.INVALID.user);
    await page.getByTestId('login-password-input').locator('input').fill(TEST_CREDENTIALS.INVALID.password);

    await page.getByTestId('login-submit-button').click();

    console.log('Esperando mensaje de error por credenciales inválidas');
    await expect(page.getByText('Usuario y/o password no válidos')).toBeVisible({ timeout: 10000 });
    console.log('Mensaje de error mostrado correctamente');
  });


  // Añadí tope de 20 caracteres en los campos de usuario y contraseña, ver si limita correctamente
  test('should respect character limits in input fields', async ({ page }) => {
    console.log('Verificando límite de caracteres en campos de entrada');
    const longText = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    await page.getByTestId('login-user-input').locator('input').fill(longText);

    const userValue = await page.getByTestId('login-user-input').locator('input').inputValue();
    expect(userValue.length).toBeLessThanOrEqual(20);
    console.log(`Campo usuario limitado a ${userValue.length} caracteres`);

    await page.getByTestId('login-user-input').locator('input').clear();
    await page.getByTestId('login-password-input').locator('input').fill(longText);

    const passwordValue = await page.getByTestId('login-password-input').locator('input').inputValue();
    expect(passwordValue.length).toBeLessThanOrEqual(20);
    console.log(`Campo contraseña limitado a ${passwordValue.length} caracteres`);
    console.log('Límites de caracteres verificados correctamente');
  });
});
