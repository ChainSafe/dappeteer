import { Page } from 'puppeteer';

import { clickOnButton, clickOnLittleDownArrow } from '../helpers';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const signTypedData = (page: Page, getSingedIn: GetSingedIn, version?: string) => async (): Promise<void> => {
  await page.bringToFront();
  if (!(await getSingedIn())) {
    throw new Error("You haven't signed in yet");
  }
  await page.reload();

  await page.waitForTimeout(300);
  
  await clickOnLittleDownArrow(page);

  await page.waitForTimeout(300);

  await clickOnButton(page, 'Sign');
};
