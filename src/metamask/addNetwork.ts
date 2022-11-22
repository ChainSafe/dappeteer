import { clickOnButton } from "../helpers";
import { DappeteerPage } from "../page";

export const acceptAddNetwork =
  (page: DappeteerPage) =>
  async (shouldSwitch = false): Promise<void> => {
    await page.bringToFront();
    await page.reload();
    await clickOnButton(page, "Approve");
    if (shouldSwitch) {
      await clickOnButton(page, "Switch network");
    } else {
      await clickOnButton(page, "Cancel");
    }
  };

export const rejectAddNetwork =
  (page: DappeteerPage) => async (): Promise<void> => {
    await page.bringToFront();
    await page.reload();
    await clickOnButton(page, "Cancel");
  };
