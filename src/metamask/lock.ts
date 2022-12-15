import { Page } from 'puppeteer';

import { clickOnButton, openProfileDropdown } from '../helpers';

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

  await openProfileDropdown(page);
  await clickOnButton(page, 'Lock');

  await setSignedIn(false);
};
