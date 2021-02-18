import { Page } from 'puppeteer';

import { GetSingedIn } from '.';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const sign = (page: Page, getSingedIn: GetSingedIn, version?: string) => async (): Promise<void> => {
  await page.bringToFront();
  if (!(await getSingedIn())) {
    throw new Error("You haven't signed in yet");
  }
  await page.reload();

  const button = await Promise.race([
    page.waitForSelector('.request-signature__footer__sign-button'),
    page.waitForSelector('.signature-request-footer button:last-child'),
  ]);
  await button.click();
};
