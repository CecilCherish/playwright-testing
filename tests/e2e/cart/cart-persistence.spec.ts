import { test, expect } from '../../../src/fixtures/base.fixture';

test.describe('Shopping Cart - Persistence & Navigation', () => {
  test('TC_CART_POS_005 - Should persist cart state when navigating via Continue Shopping', async ({
    loggedInInventoryPage,
    cartPage,
    page,
  }) => {
    const item = 'Sauce Labs Backpack';
    await loggedInInventoryPage.addItemToCartByName(item);
    expect(await loggedInInventoryPage.header.getCartCount()).toBe(1);

    await loggedInInventoryPage.header.openCart();
    await expect(page).toHaveURL(/.*cart\.html/);
    expect(await cartPage.getItemCount()).toBe(1);

    await cartPage.continueShopping();
    await expect(page).toHaveURL(/.*inventory\.html/);

    expect(await loggedInInventoryPage.header.getCartCount()).toBe(1);
    expect(await loggedInInventoryPage.isItemInAddedState(item)).toBe(true);
  });
});

