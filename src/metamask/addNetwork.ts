import { Page } from 'puppeteer';

import { clickOnButton, getErrorMessage, openNetworkDropdown, typeOnInputField } from '../helpers';
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

  const rpcErrorMessage = await getErrorMessage(page);
  if (rpcErrorMessage) throw new SyntaxError(rpcErrorMessage);

  const responsePromise = page.waitForResponse(
    (response) => new URL(response.url()).pathname === new URL(rpc).pathname,
  );
  await clickOnButton(page, 'Save');
  await responsePromise;

  const chainErrorMessage = await getErrorMessage(page);
  if (chainErrorMessage) throw new SyntaxError(chainErrorMessage);

  await page.waitForXPath(`//*[text() = '${networkName}']`);
};
