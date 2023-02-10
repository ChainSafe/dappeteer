import { clickOnButton, retry, waitForOverlay } from "../../helpers";
import { DappeteerPage } from "../../page";

export const acceptDialog =
  (page: DappeteerPage) => async (): Promise<void> => {
    await retry(async () => {
      await page.bringToFront();
      await page.reload();
      await waitForOverlay(page);
      await Promise.race([
        clickOnButton(page, "Approve", { timeout: 1000 }),
        clickOnButton(page, "Ok", { timeout: 1000 }),
        clickOnButton(page, "Submit", { timeout: 1000 }),
      ]);
    }, 5);
  };
