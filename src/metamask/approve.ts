import { Page } from 'puppeteer';

import { getElementByContent } from '../utils';

// TODO: thing about renaming this method?
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const approve = (page: Page, version?: string) => async (): Promise<void> => {
  await page.bringToFront();
  await page.reload();

  // TODO: step 1 of connect chose account to connect?

  const button = await getElementByContent(page, 'Next');
  await button.click();

  const connectButton = await getElementByContent(page, 'Connect', 'button');
  await connectButton.click();
};
