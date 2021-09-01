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
  const networkIndex = await page.evaluate((network) => {
    const elements = document.querySelectorAll('li.dropdown-menu-item');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if ((element as HTMLLIElement).innerText.toLowerCase().includes(network.toLowerCase())) {
        return i;
      }
    }
    return elements.length - 1;
  }, 'Custom RPC');
  const networkButton = (await page.$$('li.dropdown-menu-item'))[networkIndex];
  await networkButton.click();

  const networkNameInput = await page.waitForSelector('input#network-name');
  await networkNameInput.type(networkName);

  const rpcInput = await page.waitForSelector('input#rpc-url');
  await rpcInput.type(rpc);

  const chainIdInput = await page.waitForSelector('input#chainId');
  await chainIdInput.type(String(chainId));

  if (symbol) {
    const symbolInput = await page.waitForSelector('input#network-ticker');
    await symbolInput.type(symbol);
  }
  if (explorer) {
    const explorerInput = await page.waitForSelector('input#block-explorer-url');
    await explorerInput.type(explorer);
  }

  const saveButton = await page.waitForSelector('.network-form__footer > button.button.btn-secondary');
  await saveButton.click();

  await page.waitForSelector('button.button.btn-danger');
  const logo = await page.waitForSelector('.app-header__logo-container.app-header__logo-container--clickable');
  await logo.click();

  await page.waitForXPath(`//*[text() = '${networkName}']`);
};
