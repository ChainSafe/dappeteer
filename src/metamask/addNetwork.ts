import { Page } from 'puppeteer';

import { clickOnButton, getErrorMessage, openNetworkDropdown, typeOnInputField } from '../helpers';
import { AddNetwork } from '../index';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addNetwork = (page: Page, version?: string) => async ({
  networkName,
  rpc,
  chainId,
  symbol,
}: AddNetwork): Promise<void> => {
  await page.bringToFront();
  await openNetworkDropdown(page);
  await clickOnButton(page, 'Add Network');

  const responsePromise = page.waitForResponse(
    (response) => new URL(response.url()).pathname === new URL(rpc).pathname,
  );

  await typeOnInputField(page, 'Network Name', networkName);
  await typeOnInputField(page, 'New RPC URL', rpc);
  await typeOnInputField(page, 'Chain ID', String(chainId));
  await typeOnInputField(page, 'Currency Symbol', symbol);

  await responsePromise;
  await page.waitForTimeout(500);

  const errorMessage = await getErrorMessage(page);
  if (errorMessage) throw new SyntaxError(errorMessage);

  await clickOnButton(page, 'Save');

  await page.waitForXPath(`//*[text() = '${networkName}']`);
};
