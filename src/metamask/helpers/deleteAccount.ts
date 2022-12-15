import { Page } from 'puppeteer';

import { clickOnButton, clickOnElement, openAccountDropdown } from '../../helpers';
import { switchAccount } from '../switchAccount';

export const deleteAccount = (page: Page, version?: string) => async (accountNumber: number): Promise<void> => {
  await page.bringToFront();

  if (accountNumber === 1) throw new SyntaxError('Account 1 cannot be deleted');
  await switchAccount(page, version)(accountNumber);

  await openAccountDropdown(page);
  await clickOnElement(page, 'Remove account');
  await clickOnButton(page, 'Remove');
};
