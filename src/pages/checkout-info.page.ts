import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from './components/header.component';

export class CheckoutInfoPage extends BasePage {
  readonly header: HeaderComponent;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillInformation(firstName?: string, lastName?: string, postalCode?: string): Promise<void> {
    if (firstName !== undefined && firstName !== '') {
      await this.firstNameInput.fill(firstName);
    } else if (firstName === '') {
      await this.firstNameInput.clear();
    }

    if (lastName !== undefined && lastName !== '') {
      await this.lastNameInput.fill(lastName);
    } else if (lastName === '') {
      await this.lastNameInput.clear();
    }

    if (postalCode !== undefined && postalCode !== '') {
      await this.postalCodeInput.fill(postalCode);
    } else if (postalCode === '') {
      await this.postalCodeInput.clear();
    }
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return this.errorMessage.innerText();
  }
}

