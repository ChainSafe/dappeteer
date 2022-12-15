import { clickOnButton, retry, waitForOverlay } from "../helpers";
import { DappeteerPage } from "../page";

export const rejectDialog =
  (page: DappeteerPage) => async (): Promise<void> => {
    await retry(async () => {
      await page.bringToFront();
      await page.reload();
      await waitForOverlay(page);
      await clickOnButton(page, "Reject", { timeout: 1000 });
    }, 5);
  };
