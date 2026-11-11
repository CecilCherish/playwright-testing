import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/header.component';
import { SidebarComponent } from './components/sidebar.component';
import { parsePrice } from '../utils/test-helpers';

export class InventoryPage extends BasePage {
  readonly header: HeaderComponent;
  readonly sidebar: SidebarComponent;
  readonly pageTitle: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.sidebar = new SidebarComponent(page);
    this.pageTitle = page.locator('[data-test="title"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('.inventory_item');
  }

  async goto(): Promise<void> {
    await this.navigate('/inventory.html');
  }

  async getTitleText(): Promise<string> {
    return this.pageTitle.innerText();
  }

  async sortBy(optionValue: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(optionValue);
  }

  async getItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async getProductNames(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-name"]').allInnerTexts();
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.page.locator('[data-test="inventory-item-price"]').allInnerTexts();
    return priceTexts.map(parsePrice);
  }

  getItemLocatorByName(productName: string): Locator {
    return this.inventoryItems.filter({ hasText: productName });
  }

  async addItemToCartByName(productName: string): Promise<void> {
    const item = this.getItemLocatorByName(productName);
    const button = item.locator('button');
    await button.click();
  }

  async removeItemByName(productName: string): Promise<void> {
    const item = this.getItemLocatorByName(productName);
    const button = item.locator('button');
    await button.click();
  }

  async isItemInAddedState(productName: string): Promise<boolean> {
    const item = this.getItemLocatorByName(productName);
    const buttonText = await item.locator('button').innerText();
    return buttonText.trim().toLowerCase() === 'remove';
  }

  async openProductDetailByName(productName: string): Promise<void> {
    const item = this.getItemLocatorByName(productName);
    await item.locator('[data-test="inventory-item-name"]').click();
  }
}

