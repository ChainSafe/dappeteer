import { clickOnElement, profileDropdownClick, retry } from "../helpers";
import { DappeteerPage } from "../page";

export const createAccount =
  (page: DappeteerPage) =>
  async (accountName: string): Promise<void> => {
    await retry(async () => {
      await page.bringToFront();
      await profileDropdownClick(page);
      await clickOnElement(page, "Create account");
      await page.type(".new-account-create-form__input", accountName);
      await clickOnElement(page, "Create");
    }, 5);
  };
