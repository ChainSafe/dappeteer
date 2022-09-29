import { Page } from 'puppeteer';

export function pause(seconds: number): Promise<void> {
  return new Promise((res) => setTimeout(res, 1000 * seconds));
}

export async function clickElement(page: Page, selector: string): Promise<void> {
  await page.bringToFront();
  await page.waitForSelector(selector, { timeout: 15000 });
  const element = await page.$(selector);
  await element.click();
}
