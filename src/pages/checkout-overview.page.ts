import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/header.component';
import { parsePrice } from '../utils/test-helpers';

export class CheckoutOverviewPage extends BasePage {
  readonly header: HeaderComponent;
  readonly cartItems: Locator;
  readonly paymentInfoValue: Locator;
  readonly shippingInfoValue: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.cartItems = page.locator('.cart_item');
    this.paymentInfoValue = page.locator('[data-test="payment-info-value"]');
    this.shippingInfoValue = page.locator('[data-test="shipping-info-value"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async getItemPrices(): Promise<number[]> {
    const prices = await this.page.locator('[data-test="inventory-item-price"]').allInnerTexts();
    return prices.map(parsePrice);
  }

  async getSubtotal(): Promise<number> {
    const text = await this.subtotalLabel.innerText();
    return parsePrice(text);
  }

  async getTax(): Promise<number> {
    const text = await this.taxLabel.innerText();
    return parsePrice(text);
  }

  async getTotal(): Promise<number> {
    const text = await this.totalLabel.innerText();
    return parsePrice(text);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}

