import { Page } from "puppeteer";

export const importPk = (page: Page, version?: string) => async (privateKey: string) => {
  await page.bringToFront();
  const accountSwitcher = await page.waitForSelector('.identicon');
  await accountSwitcher.click();
  const addAccount = await page.waitForSelector('.account-menu > div:nth-child(7)');
  await addAccount.click();
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const PKInput = await page.waitForSelector('input#private-key-box');
  await PKInput.type(privateKey);
  const importButton = await page.waitForSelector('button.btn-secondary');
  await importButton.click();
};