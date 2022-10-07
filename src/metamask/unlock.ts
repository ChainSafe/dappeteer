import { Page } from "puppeteer";

import { clickOnButton, typeOnInputField } from "../helpers";

import { GetSingedIn, SetSignedIn } from ".";

export const unlock =
  (page: Page, setSignedIn: SetSignedIn, getSingedIn: GetSingedIn) =>
  async (password = "password1234"): Promise<void> => {
    if (await getSingedIn()) {
      throw new Error("You can't sign in because you are already signed in");
    }
    await page.bringToFront();

    await typeOnInputField(page, "Password", password);
    await clickOnButton(page, "Unlock");

    await setSignedIn(true);
  };
