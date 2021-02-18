import { Page } from 'puppeteer';

import { GetSingedIn, SetSignedIn } from './index';

export const lock = (
  page: Page,
  setSignedIn: SetSignedIn,
  getSingedIn: GetSingedIn,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  version?: string,
) => async (): Promise<void> => {
  if (!(await getSingedIn())) {
    throw new Error("You can't sign out because you haven't signed in yet");
  }
  await page.bringToFront();
  const accountSwitcher = await page.waitForSelector('.identicon');
  await accountSwitcher.click();
  const lockButton = await page.waitForSelector('.account-menu__lock-button');
  await lockButton.click();
  await setSignedIn(false);
};
