import { test, expect } from '../../../src/fixtures/base.fixture';
import checkoutData from '../../../src/data/checkout-data.json';

test.describe('Checkout - Negative Scenarios & Form Validations', () => {
  test.beforeEach(async ({ loggedInInventoryPage, cartPage, page }) => {
    await loggedInInventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await loggedInInventoryPage.header.openCart();
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });

  test('TC_CHK_NEG_001 - Should display error when First Name is empty', async ({
    checkoutInfoPage,
  }) => {
    const data = checkoutData.emptyFirstName;
    await checkoutInfoPage.fillInformation(data.firstName, data.lastName, data.postalCode);
    await checkoutInfoPage.continue();

    expect(await checkoutInfoPage.getErrorMessage()).toBe(data.expectedError);
  });

  test('TC_CHK_NEG_002 - Should display error when Last Name is empty', async ({
    checkoutInfoPage,
  }) => {
    const data = checkoutData.emptyLastName;
    await checkoutInfoPage.fillInformation(data.firstName, data.lastName, data.postalCode);
    await checkoutInfoPage.continue();

    expect(await checkoutInfoPage.getErrorMessage()).toBe(data.expectedError);
  });

  test('TC_CHK_NEG_003 - Should display error when Postal Code is empty', async ({
    checkoutInfoPage,
  }) => {
    const data = checkoutData.emptyPostalCode;
    await checkoutInfoPage.fillInformation(data.firstName, data.lastName, data.postalCode);
    await checkoutInfoPage.continue();

    expect(await checkoutInfoPage.getErrorMessage()).toBe(data.expectedError);
  });

  test('TC_CHK_NEG_004 - Should cancel checkout at Step 1 and return to cart without saving', async ({
    checkoutInfoPage,
    cartPage,
    page,
  }) => {
    await checkoutInfoPage.cancel();

    await expect(page).toHaveURL(/.*cart\.html/);
    expect(await cartPage.getItemCount()).toBe(1);
  });

  test('TC_CHK_NEG_005 - Should cancel checkout at Step 2 and return to inventory', async ({
    checkoutInfoPage,
    checkoutOverviewPage,
    loggedInInventoryPage,
    page,
  }) => {
    const customer = checkoutData.validCustomer;
    await checkoutInfoPage.fillInformation(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutInfoPage.continue();

    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await checkoutOverviewPage.cancel();

    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(loggedInInventoryPage.pageTitle).toHaveText('Products');
  });
});

