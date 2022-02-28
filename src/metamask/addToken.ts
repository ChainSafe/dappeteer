import { Page } from 'puppeteer';

import { AddToken } from '../index';
import { getElementByContent, getInputByLabel } from '../utils';

export const addToken = (page: Page) => async ({ tokenAddress, symbol, decimals = 0 }: AddToken): Promise<void> => {
  await page.bringToFront();

  const importTokensButton = await getElementByContent(page, 'Import tokens');
  await importTokensButton.click();

  const addressInput = await getInputByLabel(page, 'Token Contract Address');
  await addressInput.type(tokenAddress);

  // wait to metamask pull token data
  // TODO: handle case when contract is not containing symbol
  const symbolInput = await getInputByLabel(page, 'Token Symbol');
  await page.waitForFunction((node) => !!node.value, {}, symbolInput);

  if (symbol) {
    const symbolEditButton = await getElementByContent(page, 'Edit');
    await symbolEditButton.click();

    await symbolInput.click({ clickCount: 3 }); // hack to select all for override
    await symbolInput.type(symbol);
  }

  const decimalsInput = await getInputByLabel(page, 'Token Decimal');
  const isDisabled = await page.evaluate((node) => node.disabled, decimalsInput);
  if (!isDisabled) {
    await decimalsInput.type(String(decimals));
  }

  const addTokenButton = await getElementByContent(page, 'Add Custom Token');
  await addTokenButton.click();

  const nextButton = await getElementByContent(page, 'Import Tokens');
  await nextButton.click();
};
