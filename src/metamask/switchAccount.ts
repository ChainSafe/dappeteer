import { Page } from "puppeteer";

export const switchAccount = (page: Page, version?: string) => async (accountNumber: number) => {
  await page.bringToFront();
  const accountSwitcher = await page.waitForSelector('.identicon');
  await accountSwitcher.click();
  const account = await page.waitForSelector(`.account-menu__accounts > div:nth-child(${accountNumber})`);
  await account.click();
};
