import { clickOnButton } from "../helpers";
import { DappeteerPage } from "../page";

export const acceptDialog =
  (page: DappeteerPage) => async (): Promise<void> => {
    await page.bringToFront();
    await page.reload();
    await clickOnButton(page, "Approve");
  };
