import { Page } from "puppeteer";
import { clickOnButton } from "../helpers";

export const acceptDialog = (page: Page) => async (): Promise<void> => {
  await page.bringToFront();
  await page.reload();
  await clickOnButton(page, "Approve");
};
