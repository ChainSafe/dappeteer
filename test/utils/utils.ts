import { DappeteerPage } from "../../src";

export function pause(seconds: number): Promise<void> {
  return new Promise((res) => setTimeout(res, 1000 * seconds));
}

export async function clickElement(
  page: DappeteerPage,
  selector: string
): Promise<void> {
  await page.bringToFront();
  await page.waitForSelector(selector, { timeout: 15000 });
  const element = await page.$(selector);
  await element.click();
}

export function isUserDataTest(): boolean {
  return Boolean(process.env.USER_DATA_TEST);
}
