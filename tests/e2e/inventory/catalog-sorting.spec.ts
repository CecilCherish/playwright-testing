import { test, expect } from '../../../src/fixtures/base.fixture';
import { isSortedAscending, isSortedDescending } from '../../../src/utils/test-helpers';

test.describe('Inventory - Catalog Sorting', () => {
  test('TC_INV_POS_002 - Should sort products by Name A to Z', async ({
    loggedInInventoryPage,
  }) => {
    await loggedInInventoryPage.sortBy('az');
    const names = await loggedInInventoryPage.getProductNames();
    expect(names[0]).toBe('Sauce Labs Backpack');
    expect(isSortedAscending(names)).toBe(true);
  });

  test('TC_INV_POS_003 - Should sort products by Name Z to A', async ({
    loggedInInventoryPage,
  }) => {
    await loggedInInventoryPage.sortBy('za');
    const names = await loggedInInventoryPage.getProductNames();
    expect(names[0]).toBe('Test.allTheThings() T-Shirt (Red)');
    expect(isSortedDescending(names)).toBe(true);
  });

  test('TC_INV_POS_004 - Should sort products by Price Low to High', async ({
    loggedInInventoryPage,
  }) => {
    await loggedInInventoryPage.sortBy('lohi');
    const prices = await loggedInInventoryPage.getProductPrices();
    expect(prices[0]).toBe(7.99);
    expect(isSortedAscending(prices)).toBe(true);
  });

  test('TC_INV_POS_005 - Should sort products by Price High to Low', async ({
    loggedInInventoryPage,
  }) => {
    await loggedInInventoryPage.sortBy('hilo');
    const prices = await loggedInInventoryPage.getProductPrices();
    expect(prices[0]).toBe(49.99);
    expect(isSortedDescending(prices)).toBe(true);
  });
});

