import { ElementHandle, Page } from "puppeteer";

import {
  getAccountMenuButton,
  getElementByContent,
  getInputByLabel,
  getSettingsSwitch,
} from "./selectors";

export const clickOnSettingsSwitch = async (
  page: Page,
  text: string
): Promise<void> => {
  const button = await getSettingsSwitch(page, text);
  await button.click();
};

export const openNetworkDropdown = async (page: Page): Promise<void> => {
  const networkSwitcher = await page.waitForSelector(".network-display", {
    visible: true,
  });
  try {
    await networkSwitcher.click();
    await page.waitForSelector(".network-dropdown-list", {
      visible: true,
      timeout: 1000,
    });
  } catch (e) {
    //retry on fail
    await networkSwitcher.click();
    await page.waitForSelector(".network-dropdown-list", {
      visible: true,
      timeout: 1000,
    });
  }
};

export const openProfileDropdown = async (page: Page): Promise<void> => {
  const accountSwitcher = await page.waitForSelector(".identicon");
  await accountSwitcher.click();
};

export const openAccountDropdown = async (page: Page): Promise<void> => {
  const accMenu = await getAccountMenuButton(page);
  await accMenu.click();
  await page.waitForSelector(".menu__container.account-options-menu");
};

export const clickOnElement = async (
  page: Page,
  text: string,
  type?: string
): Promise<void> => {
  const element = await getElementByContent(page, text, type);
  await element.click();
};

export const clickOnButton = async (
  page: Page,
  text: string
): Promise<void> => {
  const button = await getElementByContent(page, text, "button");
  await button.click();
};

export const clickOnLogo = async (page: Page): Promise<void> => {
  const header = await page.waitForSelector(".app-header__logo-container");
  await header.click();
};

/**
 *
 * @param page
 * @param label
 * @param text
 * @param clear
 * @param excludeSpan
 * @param optional
 * @returns true if found and updated, false otherwise
 */
export const typeOnInputField = async (
  page: Page,
  label: string,
  text: string,
  clear = false,
  excludeSpan = false,
  optional = false
): Promise<boolean> => {
  let input: ElementHandle<HTMLInputElement>;
  try {
    input = await getInputByLabel(page, label, excludeSpan, 1000);
  } catch (e) {
    if (optional) return false;
    throw e;
  }

  if (clear)
    await page.evaluate((node: HTMLInputElement) => {
      node.value = "";
    }, input);
  await input.type(text);
  return true;
};
