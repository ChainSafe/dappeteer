import { Page } from 'puppeteer';

import { clickOnButton, clickOnLogo, getElementByContent, openNetworkDropdown } from '../../helpers';

export const deleteNetwork = (page: Page, version?: string) => async (name: string): Promise<void> => {
  await page.bringToFront();

  await openNetworkDropdown(page);
  const network = await getElementByContent(page, name);
  await network.hover();

  const deleteButton = await page.waitForXPath(`//*[contains(text(), '${name}')]/following-sibling::i`);
  await deleteButton.click();

  await clickOnButton(page, 'Delete');
  await clickOnLogo(page);
};
