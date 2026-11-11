import { test, expect } from '../../../src/fixtures/base.fixture';
import { TEST_USERS } from '../../../src/config/user-credentials';

test.describe('Authentication - Positive Scenarios', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC_AUTH_POS_001 - Should successfully login with standard user credentials', async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    await loginPage.login(TEST_USERS.STANDARD.username, TEST_USERS.STANDARD.password);

    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(inventoryPage.pageTitle).toBeVisible();
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    expect(await inventoryPage.getItemCount()).toBe(6);
  });

  test('TC_AUTH_POS_002 - Should successfully logout via sidebar menu', async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    await loginPage.login(TEST_USERS.STANDARD.username, TEST_USERS.STANDARD.password);
    await expect(page).toHaveURL(/.*inventory\.html/);

    await inventoryPage.header.openMenu();
    await inventoryPage.sidebar.logout();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});

