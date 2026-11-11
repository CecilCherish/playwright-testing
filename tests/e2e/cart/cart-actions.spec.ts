import { test, expect } from '../../../src/fixtures/base.fixture';

test.describe('Shopping Cart - Actions', () => {
  test('TC_CART_POS_001 - Should add a single product to cart and update badge counter', async ({
    loggedInInventoryPage,
  }) => {
    const item = 'Sauce Labs Backpack';
    await loggedInInventoryPage.addItemToCartByName(item);

    expect(await loggedInInventoryPage.header.getCartCount()).toBe(1);
    expect(await loggedInInventoryPage.isItemInAddedState(item)).toBe(true);
  });

  test('TC_CART_POS_002 - Should add multiple products to cart and reflect accurate badge count', async ({
    loggedInInventoryPage,
  }) => {
    await loggedInInventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await loggedInInventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    await loggedInInventoryPage.addItemToCartByName('Sauce Labs Bolt T-Shirt');

    expect(await loggedInInventoryPage.header.getCartCount()).toBe(3);
  });

  test('TC_CART_POS_003 - Should remove product directly from catalog and update badge', async ({
    loggedInInventoryPage,
  }) => {
    const item = 'Sauce Labs Backpack';
    await loggedInInventoryPage.addItemToCartByName(item);
    expect(await loggedInInventoryPage.header.getCartCount()).toBe(1);

    await loggedInInventoryPage.removeItemByName(item);
    expect(await loggedInInventoryPage.header.getCartCount()).toBe(0);
    expect(await loggedInInventoryPage.isItemInAddedState(item)).toBe(false);
  });

  test('TC_CART_POS_004 - Should verify items in cart page and remove item from cart list', async ({
    loggedInInventoryPage,
    cartPage,
    page,
  }) => {
    const item1 = 'Sauce Labs Backpack';
    const item2 = 'Sauce Labs Bike Light';

    await loggedInInventoryPage.addItemToCartByName(item1);
    await loggedInInventoryPage.addItemToCartByName(item2);

    await loggedInInventoryPage.header.openCart();
    await expect(page).toHaveURL(/.*cart\.html/);

    expect(await cartPage.getItemCount()).toBe(2);
    const names = await cartPage.getItemNames();
    expect(names).toContain(item1);
    expect(names).toContain(item2);

    await cartPage.removeItemByName(item1);
    expect(await cartPage.getItemCount()).toBe(1);
    expect(await cartPage.getItemNames()).not.toContain(item1);
    expect(await cartPage.header.getCartCount()).toBe(1);
  });
});

