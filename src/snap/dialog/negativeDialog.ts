import { clickOnButton, retry, waitForOverlay } from "../../helpers";
import { DappeteerPage } from "../../page";

export const negativeDialog =
  (page: DappeteerPage) => async (): Promise<void> => {
    await retry(async () => {
      await page.bringToFront();
      await page.reload();
      await waitForOverlay(page);
      await Promise.race([
        clickOnButton(page, "Reject", { timeout: 1000 }),
        clickOnButton(page, "Cancel", { timeout: 1000 }),
      ]);
    }, 5);
  };
