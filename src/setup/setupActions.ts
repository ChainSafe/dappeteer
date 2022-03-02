import { Page } from 'puppeteer';

import {
  clickOnButton,
  clickOnElement,
  clickOnLogo,
  clickOnSettingsSwitch,
  closePopup,
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
    hideSeed,
  }: MetamaskOptions,
): Promise<void> {
  await clickOnButton(metamaskPage, 'Import wallet');
  await clickOnButton(metamaskPage, 'I Agree');

  if (!hideSeed) await clickOnElement(metamaskPage, 'Show Secret Recovery Phrase');

  await typeOnInputField(metamaskPage, 'Secret Recovery Phrase', seed);
  await typeOnInputField(metamaskPage, 'New password', password);
  await typeOnInputField(metamaskPage, 'Confirm password', password);

  // select checkbox "I have read and agree to the"
  const acceptTerms = await metamaskPage.waitForSelector('.first-time-flow__terms');
  await acceptTerms.click();

  await clickOnButton(metamaskPage, 'Import');
  await clickOnButton(metamaskPage, 'All Done');

  await closePopup(metamaskPage);
}
