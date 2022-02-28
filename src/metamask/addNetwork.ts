import { Page } from 'puppeteer';

import { AddNetwork } from '../index';
import { getElementByContent, getInputByLabel, openNetworkDropdown } from '../utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addNetwork = (page: Page, version?: string) => async ({
  networkName,
  rpc,
  chainId,
  symbol,
  explorer,
}: AddNetwork): Promise<void> => {
  await page.bringToFront();
  await openNetworkDropdown(page);

  const networkButton = await getElementByContent(page, 'Add Network');
  await networkButton.click();

  const networkNameInput = await getInputByLabel(page, 'Network Name');
  await networkNameInput.type(networkName);

  const rpcInput = await getInputByLabel(page, 'New RPC URL');
  await rpcInput.type(rpc);

  const chainIdInput = await getInputByLabel(page, 'Chain ID');
  await chainIdInput.type(String(chainId));

  if (symbol) {
    const symbolInput = await getInputByLabel(page, 'Currency Symbol');
    await symbolInput.type(symbol);
  }
  if (explorer) {
    const explorerInput = await getInputByLabel(page, 'Block Explorer URL');
    await explorerInput.type(explorer);
  }

  const saveButton = await getElementByContent(page, 'Save');
  await saveButton.click();
  await page.waitForXPath(`//*[text() = '${networkName}']`);
};
