import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/header.component';

export class CheckoutCompletePage extends BasePage {
  readonly header: HeaderComponent;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async getHeaderText(): Promise<string> {
    return this.completeHeader.innerText();
  }

  async getBodyText(): Promise<string> {
    return this.completeText.innerText();
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}

