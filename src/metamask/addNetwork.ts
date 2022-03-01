import { Page } from 'puppeteer';

import { clickOnButton, openNetworkDropdown, typeOnInputField } from '../helpers';
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
  await openNetworkDropdown(page);
  await clickOnButton(page, 'Add Network');

  await typeOnInputField(page, 'Network Name', networkName);
  await typeOnInputField(page, 'New RPC URL', rpc);
  await typeOnInputField(page, 'Chain ID', String(chainId));

  if (symbol) await typeOnInputField(page, 'Currency Symbol', symbol);
  if (explorer) await typeOnInputField(page, 'Block Explorer URL', explorer);

  await clickOnButton(page, 'Save');
  await page.waitForXPath(`//*[text() = '${networkName}']`);
};
