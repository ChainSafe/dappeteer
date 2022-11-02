import { clickOnButton } from "../helpers";
import { DappeteerPage } from "../page";

export const rejectDialog =
  (page: DappeteerPage) => async (): Promise<void> => {
    await page.bringToFront();
    await page.reload();
    await clickOnButton(page, "Reject");
  };
