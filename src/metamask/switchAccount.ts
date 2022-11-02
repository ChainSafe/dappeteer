import { clickOnElement, openProfileDropdown } from "../helpers";
import { DappeteerPage } from "../page";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const switchAccount =
  (page: DappeteerPage) =>
  async (accountNumber: number): Promise<void> => {
    await page.bringToFront();
    await openProfileDropdown(page);

    // TODO: use different approach? maybe change param to account name
    await clickOnElement(page, `Account ${accountNumber}`);
  };
