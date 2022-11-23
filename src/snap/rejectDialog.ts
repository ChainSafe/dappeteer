import { clickOnButton, retry } from "../helpers";
import { DappeteerPage } from "../page";

export const rejectDialog =
  (page: DappeteerPage) => async (): Promise<void> => {
    await retry(async () => {
      await page.bringToFront();
      await page.reload();
      await clickOnButton(page, "Reject", { timeout: 100 });
    }, 5);
  };
