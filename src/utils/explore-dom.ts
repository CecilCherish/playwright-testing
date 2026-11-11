import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function runExploration() {
  console.log('🚀 Starting SauceDemo DOM & Scenario Exploration with Playwright (Headless)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  const explorationResults: Record<string, any> = {};

  try {
    // 1. Explore Login Page
    console.log('📌 [1/7] Exploring Login Page...');
    await page.goto('https://www.saucedemo.com');
    const loginTitle = await page.title();
    const hasUsernameInput = await page.locator('[data-test="username"]').isVisible();
    const hasPasswordInput = await page.locator('[data-test="password"]').isVisible();
    const hasLoginButton = await page.locator('[data-test="login-button"]').isVisible();

    // Test Negative Login: Empty fields
    await page.click('[data-test="login-button"]');
    const emptyUsernameError = await page.locator('[data-test="error"]').innerText();

    // Test Negative Login: Locked out user
    await page.fill('[data-test="username"]', 'locked_out_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    const lockedOutError = await page.locator('[data-test="error"]').innerText();

    explorationResults['login'] = {
      title: loginTitle,
      selectors: {
        username: '[data-test="username"]',
        password: '[data-test="password"]',
        loginButton: '[data-test="login-button"]',
        errorMessage: '[data-test="error"]',
      },
      verifiedErrors: {
        emptyUsername: emptyUsernameError,
        lockedOutUser: lockedOutError,
      },
      verified: hasUsernameInput && hasPasswordInput && hasLoginButton,
    };
    console.log('   ✓ Login Page verified. Locked out message:', lockedOutError);

    // 2. Perform Positive Login
    console.log('📌 [2/7] Logging in with standard_user...');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await page.waitForURL('**/inventory.html');

    // 3. Explore Inventory Page
    console.log('📌 [3/7] Exploring Inventory Page...');
    const pageHeaderTitle = await page.locator('[data-test="title"]').innerText();
    const itemsCount = await page.locator('.inventory_item').count();
    const firstItemName = await page.locator('[data-test="inventory-item-name"]').first().innerText();
    const firstItemPrice = await page.locator('[data-test="inventory-item-price"]').first().innerText();
    const sortDropdown = await page.locator('[data-test="product-sort-container"]').isVisible();
    const sortOptions = await page.locator('[data-test="product-sort-container"] option').allInnerTexts();

    explorationResults['inventory'] = {
      headerTitle: pageHeaderTitle,
      totalItems: itemsCount,
      firstProduct: { name: firstItemName, price: firstItemPrice },
      sortDropdownAvailable: sortDropdown,
      sortOptions,
      selectors: {
        pageTitle: '[data-test="title"]',
        itemContainer: '.inventory_item',
        itemName: '[data-test="inventory-item-name"]',
        itemDesc: '[data-test="inventory-item-desc"]',
        itemPrice: '[data-test="inventory-item-price"]',
        sortDropdown: '[data-test="product-sort-container"]',
        cartBadge: '[data-test="shopping-cart-badge"]',
        cartLink: '[data-test="shopping-cart-link"]',
      },
    };
    console.log(`   ✓ Inventory verified. Total products: ${itemsCount}, Sort options: ${sortOptions.join(', ')}`);

    // 4. Explore Cart Actions
    console.log('📌 [4/7] Exploring Cart Addition & Badge counter...');
    const addToCartButton = page.locator('.inventory_item').first().locator('button');
    await addToCartButton.click();
    const cartBadgeText = await page.locator('[data-test="shopping-cart-badge"]').innerText();
    const buttonAfterAddText = await addToCartButton.innerText();

    await page.click('[data-test="shopping-cart-link"]');
    await page.waitForURL('**/cart.html');
    const cartItemsCount = await page.locator('.cart_item').count();
    const cartItemName = await page.locator('[data-test="inventory-item-name"]').innerText();

    explorationResults['cart'] = {
      badgeCount: cartBadgeText,
      toggleButtonText: buttonAfterAddText,
      cartItemCount: cartItemsCount,
      cartItemName,
      selectors: {
        cartItem: '.cart_item',
        continueShoppingButton: '[data-test="continue-shopping"]',
        checkoutButton: '[data-test="checkout"]',
        removeButton: '[data-test^="remove-"]',
      },
    };
    console.log(`   ✓ Cart verified. Item added: "${cartItemName}", Badge: ${cartBadgeText}`);

    // 5. Explore Checkout Step One (Information)
    console.log('📌 [5/7] Exploring Checkout Step 1...');
    await page.click('[data-test="checkout"]');
    await page.waitForURL('**/checkout-step-one.html');

    // Test Negative Checkout Step 1: Empty First Name
    await page.click('[data-test="continue"]');
    const emptyFirstNameError = await page.locator('[data-test="error"]').innerText();

    // Fill valid info
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    await page.waitForURL('**/checkout-step-two.html');

    explorationResults['checkoutStepOne'] = {
      emptyFirstNameError,
      selectors: {
        firstNameInput: '[data-test="firstName"]',
        lastNameInput: '[data-test="lastName"]',
        postalCodeInput: '[data-test="postalCode"]',
        continueButton: '[data-test="continue"]',
        cancelButton: '[data-test="cancel"]',
        errorMessage: '[data-test="error"]',
      },
    };
    console.log('   ✓ Checkout Step 1 verified. Error on empty submit:', emptyFirstNameError);

    // 6. Explore Checkout Step Two (Overview)
    console.log('📌 [6/7] Exploring Checkout Step 2 (Overview & Price Math)...');
    const subtotalText = await page.locator('[data-test="subtotal-label"]').innerText();
    const taxText = await page.locator('[data-test="tax-label"]').innerText();
    const totalText = await page.locator('[data-test="total-label"]').innerText();

    explorationResults['checkoutStepTwo'] = {
      subtotalText,
      taxText,
      totalText,
      selectors: {
        subtotalLabel: '[data-test="subtotal-label"]',
        taxLabel: '[data-test="tax-label"]',
        totalLabel: '[data-test="total-label"]',
        finishButton: '[data-test="finish"]',
        cancelButton: '[data-test="cancel"]',
      },
    };
    console.log(`   ✓ Step 2 verified. ${subtotalText} | ${taxText} | ${totalText}`);

    // 7. Finish Checkout Step Three (Complete)
    console.log('📌 [7/7] Exploring Checkout Step 3 (Complete & Confirmation)...');
    await page.click('[data-test="finish"]');
    await page.waitForURL('**/checkout-complete.html');

    const completeHeader = await page.locator('[data-test="complete-header"]').innerText();
    const completeText = await page.locator('[data-test="complete-text"]').innerText();
    const backHomeBtn = await page.locator('[data-test="back-to-products"]').isVisible();

    explorationResults['checkoutComplete'] = {
      completeHeader,
      completeText,
      backHomeButtonVisible: backHomeBtn,
      selectors: {
        completeHeader: '[data-test="complete-header"]',
        completeText: '[data-test="complete-text"]',
        backHomeButton: '[data-test="back-to-products"]',
      },
    };
    console.log('   ✓ Step 3 Complete verified:', completeHeader);

    // Sidebar & Logout Exploration
    await page.click('[data-test="back-to-products"]');
    await page.waitForURL('**/inventory.html');
    await page.click('#react-burger-menu-btn');
    await page.waitForSelector('.bm-item-list');
    const logoutVisible = await page.locator('[data-test="logout-sidebar-link"]').isVisible();
    const resetVisible = await page.locator('[data-test="reset-sidebar-link"]').isVisible();

    explorationResults['sidebar'] = {
      menuButton: '#react-burger-menu-btn',
      logoutLink: '[data-test="logout-sidebar-link"]',
      resetLink: '[data-test="reset-sidebar-link"]',
      allItemsLink: '[data-test="inventory-sidebar-link"]',
      aboutLink: '[data-test="about-sidebar-link"]',
      verified: logoutVisible && resetVisible,
    };

    // Logout
    await page.click('[data-test="logout-sidebar-link"]');
    await page.waitForURL('https://www.saucedemo.com/');
    console.log('   ✓ Logout verified. Successfully redirected back to Login screen.');

    // Save exploration results to docs/exploration-results.json
    const outputPath = path.join(__dirname, '../../docs/exploration-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(explorationResults, null, 2), 'utf-8');
    console.log(`\n🎉 Exploration successfully completed! Findings saved to: docs/exploration-results.json`);
  } catch (error) {
    console.error('❌ Exploration failed with error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

runExploration().catch(() => process.exit(1));

