import { Page } from 'puppeteer';

import { getElementByContent, getInputByLabel } from '../utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const importPk = (page: Page, version?: string) => async (privateKey: string): Promise<void> => {
  await page.bringToFront();
  const accountSwitcher = await page.waitForSelector('.identicon');
  await accountSwitcher.click();

  const addAccount = await getElementByContent(page, 'Import Account');
  await addAccount.click();

  const pKInput = await getInputByLabel(page, 'Paste your private key');
  await pKInput.type(privateKey);

  const importButton = await getElementByContent(page, 'Import', 'button');
  await importButton.click();
};
