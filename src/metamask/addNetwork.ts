import { clickOnButton } from "../helpers";
import { DappeteerPage } from "../page";

export const acceptAddNetwork =
  (page: DappeteerPage) =>
  async (shouldSwitch = false): Promise<void> => {
    await page.bringToFront();
    await page.reload();
    await page.waitForSelector(".confirmation-footer", {
      visible: true,
    });
    await clickOnButton(page, "Approve");
    if (shouldSwitch) {
      await clickOnButton(page, "Switch network");
      await page.waitForSelector(".new-network-info__wrapper", {
        visible: true,
      });
      await clickOnButton(page, "Got it");
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
