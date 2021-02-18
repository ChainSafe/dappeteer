import { Page } from 'puppeteer';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const approve = (page: Page, version?: string) => async (): Promise<void> => {
  await page.bringToFront();
  await page.reload();

  const button = await page.waitForSelector('button.button.btn-primary');
  await button.click();

  const connectButton = await page.waitForSelector('button.button.btn-primary');
  await connectButton.click();
};
