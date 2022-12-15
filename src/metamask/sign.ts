import { Page } from 'puppeteer';

import { clickOnButton } from '../helpers';

import { GetSingedIn } from '.';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const sign = (page: Page, getSingedIn: GetSingedIn, version?: string) => async (): Promise<void> => {
  await page.bringToFront();
  if (!(await getSingedIn())) {
    throw new Error("You haven't signed in yet");
  }
  await page.reload();

  await clickOnButton(page, 'Sign');
};
