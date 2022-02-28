import { Page } from 'puppeteer';

import { TransactionOptions } from '..';
import { getElementByContent, getInputByLabel } from '../utils';

import { GetSingedIn } from './index';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const confirmTransaction = (page: Page, getSingedIn: GetSingedIn, version?: string) => async (
  options?: TransactionOptions,
): Promise<void> => {
  await page.bringToFront();
  if (!(await getSingedIn())) {
    throw new Error("You haven't signed in yet");
  }
  await page.waitForTimeout(500);
  await page.reload();

  if (options) {
    const edit = await getElementByContent(page, 'Edit');
    await edit.click();

    const processEdit = await getElementByContent(page, 'Edit suggested gas fee');
    await processEdit.click();

    if (options.gas) {
      const gas = await getInputByLabel(page, 'Gas price');
      await gas.click({ clickCount: 3 });
      await gas.type(options.gas.toString());
    }

    if (options.gasLimit) {
      const gasLimit = await getInputByLabel(page, 'Gas Limit');
      await gasLimit.click({ clickCount: 3 });
      await gasLimit.type(options.gasLimit.toString());
    }

    const save = await getElementByContent(page, 'Save');
    await save.click();
  }

  const confirmButton = await getElementByContent(page, 'Confirm');
  await confirmButton.click();
};
