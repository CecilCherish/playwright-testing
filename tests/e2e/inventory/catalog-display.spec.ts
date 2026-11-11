import { test, expect } from '../../../src/fixtures/base.fixture';

test.describe('Inventory - Catalog Display & PDP', () => {
  test('TC_INV_POS_001 - Should display all 6 products with names, descriptions, images and prices', async ({
    loggedInInventoryPage,
  }) => {
    const count = await loggedInInventoryPage.getItemCount();
    expect(count).toBe(6);

    const names = await loggedInInventoryPage.getProductNames();
    expect(names.length).toBe(6);
    expect(names).toContain('Sauce Labs Backpack');
    expect(names).toContain('Sauce Labs Bike Light');
    expect(names).toContain('Sauce Labs Fleece Jacket');

    const prices = await loggedInInventoryPage.getProductPrices();
    expect(prices.length).toBe(6);
    prices.forEach((price) => {
      expect(price).toBeGreaterThan(0);
    });
  });

  test('TC_INV_POS_006 - Should navigate to product detail page (PDP) and back to inventory', async ({
    loggedInInventoryPage,
    productDetailPage,
    page,
  }) => {
    const targetProduct = 'Sauce Labs Backpack';
    await loggedInInventoryPage.openProductDetailByName(targetProduct);

    await expect(page).toHaveURL(/.*inventory-item\.html\?id=\d+/);
    const details = await productDetailPage.getDetails();
    expect(details.name).toBe(targetProduct);
    expect(details.price).toBe(29.99);
    expect(details.desc.length).toBeGreaterThan(10);

    await productDetailPage.backToProducts();
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(loggedInInventoryPage.pageTitle).toHaveText('Products');
  });
});

