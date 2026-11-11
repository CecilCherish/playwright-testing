import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/header.component';
import { parsePrice } from '../utils/test-helpers';

export class ProductDetailPage extends BasePage {
  readonly header: HeaderComponent;
  readonly backButton: Locator;
  readonly productName: Locator;
  readonly productDesc: Locator;
  readonly productPrice: Locator;
  readonly actionButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.backButton = page.locator('[data-test="back-to-products"]');
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.productDesc = page.locator('[data-test="inventory-item-desc"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.actionButton = page.locator('.inventory_details_desc_container button');
  }

  async getDetails(): Promise<{ name: string; desc: string; price: number }> {
    const name = await this.productName.innerText();
    const desc = await this.productDesc.innerText();
    const priceText = await this.productPrice.innerText();
    return { name, desc, price: parsePrice(priceText) };
  }

  async addToCart(): Promise<void> {
    await this.actionButton.click();
  }

  async removeFromCart(): Promise<void> {
    await this.actionButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.backButton.click();
  }
}

