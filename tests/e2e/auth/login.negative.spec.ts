import { test, expect } from '../../../src/fixtures/base.fixture';
import { TEST_USERS } from '../../../src/config/user-credentials';

test.describe('Authentication - Negative Scenarios', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC_AUTH_NEG_001 - Should display error when entering incorrect password', async ({
    loginPage,
  }) => {
    await loginPage.login(TEST_USERS.STANDARD.username, 'invalid_password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service'
    );
  });

  test('TC_AUTH_NEG_002 - Should display error when user is locked out', async ({ loginPage }) => {
    await loginPage.login(TEST_USERS.LOCKED_OUT.username, TEST_USERS.LOCKED_OUT.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('TC_AUTH_NEG_003 - Should display error when username is empty', async ({ loginPage }) => {
    await loginPage.login('', TEST_USERS.STANDARD.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
  });

  test('TC_AUTH_NEG_004 - Should display error when password is empty', async ({ loginPage }) => {
    await loginPage.login(TEST_USERS.STANDARD.username, '');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Password is required');
  });

  test('TC_AUTH_NEG_005 - Should block unauthorized direct access to /inventory.html', async ({
    page,
    loginPage,
  }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      "You can only access '/inventory.html' when you are logged in."
    );
  });
});

