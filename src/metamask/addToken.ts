import { clickOnButton } from "../helpers";
import { DappeteerPage } from "../page";

export const acceptAddToken =
  (page: DappeteerPage) => async (): Promise<void> => {
    await page.bringToFront();
    await page.reload();
    await clickOnButton(page, "Add token");
  };

export const rejectAddToken =
  (page: DappeteerPage) => async (): Promise<void> => {
    await page.bringToFront();
    await page.reload();
    await clickOnButton(page, "Cancel");
  };
