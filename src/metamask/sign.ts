import { clickOnButton, clickOnLittleDownArrowIfNeeded } from "../helpers";

import { DappeteerPage } from "../page";
import { GetSingedIn } from ".";

export const sign =
  (page: DappeteerPage, getSingedIn: GetSingedIn) =>
  async (): Promise<void> => {
    await page.bringToFront();
    if (!(await getSingedIn())) {
      throw new Error("You haven't signed in yet");
    }

    await page.waitForTimeout(500);
    await page.reload();

    await clickOnButton(page, "Sign");
  };

export const signTypedData =
  (page: DappeteerPage, getSingedIn: GetSingedIn) =>
  async (): Promise<void> => {
    await page.bringToFront();
    if (!(await getSingedIn())) {
      throw new Error("You haven't signed in yet");
    }
    await page.reload();
    await page.waitForTimeout(300);
    await clickOnLittleDownArrowIfNeeded(page);
    await page.waitForTimeout(300);
    await clickOnButton(page, "Sign");
  };
