import { test, expect } from '../../../src/fixtures/base.fixture';
import { calculateTax } from '../../../src/utils/test-helpers';
import checkoutData from '../../../src/data/checkout-data.json';

test.describe('Checkout - Positive End-to-End Flow', () => {
  test('TC_CHK_POS_001 - Should complete entire checkout flow successfully from cart to order confirmation', async ({
    loggedInInventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    page,
  }) => {
    // 1. Add item to cart
    await loggedInInventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await loggedInInventoryPage.header.openCart();

    // 2. Cart to Checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    // 3. Step 1: Fill information
    const customer = checkoutData.validCustomer;
    await checkoutInfoPage.fillInformation(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutInfoPage.continue();

    // 4. Step 2: Overview verification
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    const subtotal = await checkoutOverviewPage.getSubtotal();
    expect(subtotal).toBe(29.99);

    // 5. Finish order
    await checkoutOverviewPage.finish();

    // 6. Step 3: Complete verification
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    const header = await checkoutCompletePage.getHeaderText();
    expect(header).toBe('Thank you for your order!');
    const body = await checkoutCompletePage.getBodyText();
    expect(body).toContain('Your order has been dispatched');

    // 7. Back home
    await checkoutCompletePage.backHome();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('TC_CHK_POS_002 - Should mathematically verify item total, tax calculation (8%), and total price', async ({
    loggedInInventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
  }) => {
    // Add 2 items: Backpack ($29.99) and Bike Light ($9.99)
    await loggedInInventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await loggedInInventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await loggedInInventoryPage.header.openCart();
    await cartPage.proceedToCheckout();

    const customer = checkoutData.validCustomer;
    await checkoutInfoPage.fillInformation(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutInfoPage.continue();

    // Check individual prices
    const itemPrices = await checkoutOverviewPage.getItemPrices();
    expect(itemPrices.length).toBe(2);
    const calculatedSum = itemPrices.reduce((sum, p) => sum + p, 0);

    const displayedSubtotal = await checkoutOverviewPage.getSubtotal();
    const displayedTax = await checkoutOverviewPage.getTax();
    const displayedTotal = await checkoutOverviewPage.getTotal();

    // Mathematical formula assertion:
    expect(displayedSubtotal).toBe(calculatedSum);
    const expectedTax = calculateTax(displayedSubtotal, 0.08);
    expect(displayedTax).toBe(expectedTax);
    expect(displayedTotal).toBe(parseFloat((displayedSubtotal + displayedTax).toFixed(2)));
  });
});

