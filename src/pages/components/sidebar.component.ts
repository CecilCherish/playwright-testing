import { Page, Locator } from '@playwright/test';

export class SidebarComponent {
  readonly page: Page;
  readonly container: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('.bm-menu-wrap');
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
    this.closeButton = page.locator('#react-burger-cross-btn');
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async clickAllItems(): Promise<void> {
    await this.allItemsLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.resetAppStateLink.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}

