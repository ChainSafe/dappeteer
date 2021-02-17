import { Page } from "puppeteer";

export const approve = (page: Page, version?: string) => async () => {
  await page.bringToFront();
  await page.reload();

  const button = await page.waitForSelector('button.button.btn-primary');
  await button.click();

  const connectButton = await page.waitForSelector('button.button.btn-primary');
  await connectButton.click();
};
