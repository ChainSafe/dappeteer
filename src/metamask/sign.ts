import { clickOnButton } from "../helpers";

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

    // wait for MM to be back in a stable state
    await page.waitForSelector(".app-header", {
      visible: true,
    });
  };
