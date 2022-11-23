import { clickOnButton, retry, waitForOverlay } from "../helpers";
import { DappeteerPage } from "../page";

export const acceptAddNetwork =
  (page: DappeteerPage) =>
  async (shouldSwitch = false): Promise<void> => {
    await retry(async () => {
      await page.bringToFront();
      await page.reload();
      await waitForOverlay(page);

      await clickOnButton(page, "Approve", { timeout: 500 });
    }, 5);
    if (shouldSwitch) {
      await clickOnButton(page, "Switch network");
    } else {
      await clickOnButton(page, "Cancel");
    }
  };

export const rejectAddNetwork =
  (page: DappeteerPage) => async (): Promise<void> => {
    await retry(async () => {
      await page.bringToFront();
      await page.reload();
      await waitForOverlay(page);

      await clickOnButton(page, "Cancel", { timeout: 500 });
    }, 5);
  };
