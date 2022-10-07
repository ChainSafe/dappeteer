import { Page } from "puppeteer";

import { clickOnButton } from "../helpers";

import { GetSingedIn } from ".";

export const sign =
  (page: Page, getSingedIn: GetSingedIn) => async (): Promise<void> => {
    await page.bringToFront();
    if (!(await getSingedIn())) {
      throw new Error("You haven't signed in yet");
    }

    await page.waitForTimeout(500);
    await page.reload();

    await clickOnButton(page, "Sign");
  };
