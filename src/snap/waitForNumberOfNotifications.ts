import { DappeteerPage } from "../page";

export const waitForAmountOfNotifications =
  (page: DappeteerPage) =>
  async (amount: number): Promise<void> => {
    await page.waitForFunction(
      `document.querySelectorAll('.notifications__item').length === ${amount}`
    );
  };
