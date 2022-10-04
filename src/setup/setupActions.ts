import { Page } from 'puppeteer';

import {
  clickOnButton,
  clickOnElement,
  clickOnLogo,
  clickOnSettingsSwitch,
  openNetworkDropdown,
  typeOnInputField,
} from '../helpers';
import { MetaMaskOptions } from '../types';

export async function showTestNets(metaMaskPage: Page): Promise<void> {
  await openNetworkDropdown(metaMaskPage);

  await clickOnElement(metaMaskPage, 'Show/hide');
  await clickOnSettingsSwitch(metaMaskPage, 'Show test networks');
  await clickOnLogo(metaMaskPage);
}

export async function confirmWelcomeScreen(metaMaskPage: Page): Promise<void> {
  await clickOnButton(metaMaskPage, 'Get started');
}

export async function declineAnalytics(metaMaskPage: Page): Promise<void> {
  await clickOnButton(metaMaskPage, 'No thanks');
}

export async function importAccount(
  metaMaskPage: Page,
  {
    seed = 'already turtle birth enroll since owner keep patch skirt drift any dinner',
    password = 'password1234',
  }: MetaMaskOptions,
): Promise<void> {
  await clickOnButton(metaMaskPage, 'Import wallet');

  for (const [index, seedPart] of seed.split(' ').entries())
    await typeOnInputField(metaMaskPage, `${index + 1}.`, seedPart);

  await typeOnInputField(metaMaskPage, 'New password', password);
  await typeOnInputField(metaMaskPage, 'Confirm password', password);

  // select checkbox "I have read and agree to the"
  const acceptTerms = await metaMaskPage.waitForSelector('.create-new-vault__terms-label');
  await acceptTerms.click();

  await clickOnButton(metaMaskPage, 'Import');
  await clickOnButton(metaMaskPage, 'All done');
}

export const closePopup = async (page: Page): Promise<void> => {
  /* For some reason popup deletes close button and then create new one (react stuff)
   * hacky solution can be found here => https://github.com/puppeteer/puppeteer/issues/3496 */
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.$eval('.popover-header__button', (node: HTMLElement) => node.click());
};

export const closePortfolioTooltip = async (page: Page): Promise<void> => {
  const closeButton = await page.waitForSelector(`div.home__subheader-link--tooltip-content-header > button`, {
    timeout: 20000,
  });
  await closeButton.click();
  await page.waitForTimeout(333);
};

export const closeWhatsNewModal = async (page: Page): Promise<void> => {
  await page.reload();
  await clickOnLogo(page);
  await page.waitForTimeout(333);
};
