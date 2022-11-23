import { clickOnButton, retry } from "../helpers";
import { DappeteerPage } from "../page";

export const acceptDialog =
  (page: DappeteerPage) => async (): Promise<void> => {
    await retry(async () => {
      await page.bringToFront();
      await page.reload();
      await clickOnButton(page, "Approve", { timeout: 100 });
    }, 5);
  };
