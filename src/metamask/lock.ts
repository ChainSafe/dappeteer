import { clickOnButton, openProfileDropdown } from "../helpers";
import { DappeteerPage } from "../page";

import { GetSingedIn, SetSignedIn } from "./index";

export const lock =
  (page: DappeteerPage, setSignedIn: SetSignedIn, getSingedIn: GetSingedIn) =>
  async (): Promise<void> => {
    if (!(await getSingedIn())) {
      throw new Error("You can't sign out because you haven't signed in yet");
    }
    await page.bringToFront();

    await openProfileDropdown(page);
    await clickOnButton(page, "Lock");

    await setSignedIn(false);
  };
