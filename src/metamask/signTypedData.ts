import { clickOnButton, clickOnLittleDownArrowIfNeeded } from "../helpers";

import { DappeteerPage } from "../page";
import { GetSingedIn } from ".";

export const signTypedData =
  (page: DappeteerPage, getSingedIn: GetSingedIn) =>
  async (): Promise<void> => {
    await page.bringToFront();
    if (!(await getSingedIn())) {
      throw new Error("You haven't signed in yet");
    }
    await page.reload();
    await clickOnLittleDownArrowIfNeeded(page);
    await clickOnButton(page, "Sign");
  };
