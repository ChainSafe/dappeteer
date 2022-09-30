import { Page } from 'puppeteer';

import { clickOnButton, clickOnElement, clickOnLogo, getInputByLabel, typeOnInputField } from '../helpers';
import { AddToken } from '../index';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addToken = (page: Page, version?: string) => async ({
  tokenAddress,
  symbol,
  decimals = 0,
}: AddToken): Promise<void> => {
  await page.bringToFront();

  await clickOnElement(page, 'Import tokens');
  await typeOnInputField(page, 'Token contract address', tokenAddress);

  // wait to metamask pull token data
  // TODO: handle case when contract is not containing symbol
  const symbolInput = await getInputByLabel(page, 'Token symbol');
  await page.waitForFunction((node) => !!node.value, {}, symbolInput);

  if (symbol) {
    await clickOnElement(page, 'Edit');
    await typeOnInputField(page, 'Token symbol', symbol, true);
  }

  const decimalsInput = await getInputByLabel(page, 'Token decimal');
  const isDisabled = await page.evaluate((node) => node.disabled, decimalsInput);
  if (!isDisabled) await decimalsInput.type(String(decimals));

  await clickOnButton(page, 'Add custom token');
  await clickOnButton(page, 'Import tokens');
  await clickOnLogo(page);
};
