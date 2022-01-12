import { Page } from 'puppeteer';

import { AddNetwork } from '../index';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addNetwork = (page: Page, version?: string) => async ({
  networkName,
  rpc,
  chainId,
  symbol,
  explorer,
}: AddNetwork): Promise<void> => {
  await page.bringToFront();
  const networkSwitcher = await page.waitForSelector('.network-display');
  await networkSwitcher.click();
  await page.waitForSelector('li.dropdown-menu-item');

  const networkButton = await page.waitForSelector('.menu-droppo > button');
  await networkButton.click();

  const networkNameInput = await page.waitForSelector(
    '.networks-tab__add-network-form-body > div:nth-child(1) > label > input',
  );
  await networkNameInput.type(networkName);

  const rpcInput = await page.waitForSelector(
    '.networks-tab__add-network-form-body > div:nth-child(2) > label > input',
  );
  await rpcInput.type(rpc);

  const chainIdInput = await page.waitForSelector(
    '.networks-tab__add-network-form-body > div:nth-child(3) > label > input',
  );
  await chainIdInput.type(String(chainId));

  if (symbol) {
    const symbolInput = await page.waitForSelector(
      '.networks-tab__add-network-form-body > div:nth-child(4) > label > input',
    );
    await symbolInput.type(symbol);
  }
  if (explorer) {
    const explorerInput = await page.waitForSelector(
      '.networks-tab__add-network-form-body > div:nth-child(5) > label > input',
    );
    await explorerInput.type(explorer);
  }

  const saveButton = await page.waitForSelector(
    '.networks-tab__add-network-form-footer > button.button.btn--rounded.btn-primary',
  );
  await saveButton.click();
  await page.waitForXPath(`//*[text() = '${networkName}']`);
};
