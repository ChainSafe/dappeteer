import { Page } from 'puppeteer';

import { getElementByContent } from '../utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const switchAccount = (page: Page, version?: string) => async (accountNumber: number): Promise<void> => {
  await page.bringToFront();
  const accountSwitcher = await page.waitForSelector('.identicon');
  await accountSwitcher.click();

  // TODO: use different approach? maybe change param to account name
  const account = await getElementByContent(page, `Account ${accountNumber}`);
  await account.click();
};
