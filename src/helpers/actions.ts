import { DappeteerElementHandle } from "../element";
import { DappeteerPage } from "../page";
import {
  getAccountMenuButton,
  getElementByContent,
  getInputByLabel,
  getSettingsSwitch,
} from "./selectors";

export const clickOnSettingsSwitch = async (
  page: DappeteerPage,
  text: string
): Promise<void> => {
  const button = await getSettingsSwitch(page, text);
  await button.click();
};

export const openNetworkDropdown = async (
  page: DappeteerPage
): Promise<void> => {
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

export const openProfileDropdown = async (
  page: DappeteerPage
): Promise<void> => {
  const accountSwitcher = await page.waitForSelector(".identicon", {
    visible: true,
  });
  await accountSwitcher.click();
};

export const openAccountDropdown = async (
  page: DappeteerPage
): Promise<void> => {
  const accMenu = await getAccountMenuButton(page);
  await accMenu.click();
  await page.waitForSelector(".menu__container.account-options-menu", {
    visible: true,
  });
};

export const clickOnElement = async (
  page: DappeteerPage,
  text: string,
  type?: string
): Promise<void> => {
  const element = await getElementByContent(page, text, type);
  await element.click();
};

export const clickOnButton = async (
  page: DappeteerPage,
  text: string
): Promise<void> => {
  const button = await getElementByContent(page, text, "button");
  await button.click();
};

export const clickOnLogo = async (page: DappeteerPage): Promise<void> => {
  const header = await page.waitForSelector(".app-header__logo-container", {
    visible: true,
  });
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
  page: DappeteerPage,
  label: string,
  text: string,
  clear = false,
  excludeSpan = false,
  optional = false
): Promise<boolean> => {
  let input: DappeteerElementHandle;
  try {
    input = await getInputByLabel(page, label, excludeSpan, 1000);
  } catch (e) {
    if (optional) return false;
    throw e;
  }

  if (clear) {
    await input.type("");
  }
  await input.type(text);
  return true;
};
