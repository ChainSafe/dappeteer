import { Page } from 'puppeteer';

import { getAccountMenuButton, getElementByContent, getInputByLabel, getSettingsSwitch } from './selectors';

export const clickOnSettingsSwitch = async (page: Page, text: string): Promise<void> => {
  const button = await getSettingsSwitch(page, text);
  await button.click();
};

export const openNetworkDropdown = async (page: Page): Promise<void> => {
  const networkSwitcher = await page.waitForSelector('.network-display');
  await networkSwitcher.click();
  await page.waitForSelector('li.dropdown-menu-item');
};

export const openProfileDropdown = async (page: Page): Promise<void> => {
  const accountSwitcher = await page.waitForSelector('.identicon');
  await accountSwitcher.click();
};

export const openAccountDropdown = async (page: Page): Promise<void> => {
  const accMenu = await getAccountMenuButton(page);
  await accMenu.click();
  await page.waitForSelector('.menu__container.account-options-menu');
};

export const clickOnElement = async (page: Page, text: string, type?: string): Promise<void> => {
  const element = await getElementByContent(page, text, type);
  await element.click();
};

export const clickOnButton = async (page: Page, text: string): Promise<void> => {
  const button = await getElementByContent(page, text, 'button');
  await button.click();
};

export const clickOnLogo = async (page: Page): Promise<void> => {
  const header = await page.waitForSelector('.app-header__logo-container');
  await header.click();
};

export const typeOnInputField = async (
  page: Page,
  label: string,
  text: string,
  clear = false,
  excludeSpan = false,
): Promise<void> => {
  const input = await getInputByLabel(page, label, excludeSpan);

  if (clear)
    await page.evaluate((node) => {
      node.value = '';
    }, input);
  await input.type(text);
};
