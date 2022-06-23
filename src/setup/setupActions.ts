import { Page } from 'puppeteer';

import {
  clickOnButton,
  clickOnElement,
  clickOnLogo,
  clickOnSettingsSwitch,
  openNetworkDropdown,
  typeOnInputField,
} from '../helpers';
import { MetamaskOptions } from '../types';

export async function showTestNets(metamaskPage: Page): Promise<void> {
  await openNetworkDropdown(metamaskPage);

  await clickOnElement(metamaskPage, 'Show/hide');
  await clickOnSettingsSwitch(metamaskPage, 'Show test networks');
  await clickOnLogo(metamaskPage);
}

export async function confirmWelcomeScreen(metamaskPage: Page): Promise<void> {
  await clickOnButton(metamaskPage, 'Get Started');
}

export async function importAccount(
  metamaskPage: Page,
  {
    seed = 'already turtle birth enroll since owner keep patch skirt drift any dinner',
    password = 'password1234',
  }: MetamaskOptions,
): Promise<void> {
  await clickOnButton(metamaskPage, 'Import wallet');
  await clickOnButton(metamaskPage, 'I Agree');

  for (const [index, seedPart] of seed.split(' ').entries())
    await typeOnInputField(metamaskPage, `${index + 1}.`, seedPart);

  await typeOnInputField(metamaskPage, 'New password', password);
  await typeOnInputField(metamaskPage, 'Confirm password', password);

  // select checkbox "I have read and agree to the"
  const acceptTerms = await metamaskPage.waitForSelector('.create-new-vault__terms-label');
  await acceptTerms.click();

  await clickOnButton(metamaskPage, 'Import');
  await clickOnButton(metamaskPage, 'All Done');
}

export const closePopup = async (page: Page): Promise<void> => {
  /* For some reason popup deletes close button and then create new one (react stuff)
   * hacky solution can be found here => https://github.com/puppeteer/puppeteer/issues/3496 */
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.$eval('.popover-header__button', (node: HTMLElement) => node.click());
};
