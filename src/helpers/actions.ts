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
      timeout: 4000,
    });
  }
};

export const profileDropdownClick = async (
  page: DappeteerPage,
  expectToClose = false
): Promise<void> => {
  const accountSwitcher = await page.waitForSelector(".account-menu__icon", {
    visible: true,
  });
  await page.waitForTimeout(500);
  await accountSwitcher.click();
  await page.waitForSelector(".account-menu__accounts", {
    hidden: expectToClose,
  });
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

/**
 *
 * @param page
 */
export const clickOnLittleDownArrowIfNeeded = async (
  page: DappeteerPage
): Promise<void> => {
  // wait for the signature page and content to be loaded
  await page.waitForSelector('[data-testid="signature-cancel-button"]', {
    visible: true,
  });

  // Metamask requires users to read all the data
  // and scroll until the bottom of the message
  // before enabling the "Sign" button
  const isSignButtonDisabled = await page.$eval(
    '[data-testid="signature-sign-button"]',
    (button: HTMLButtonElement) => {
      return button.disabled;
    }
  );

  if (isSignButtonDisabled) {
    const littleArrowDown = await page.waitForSelector(
      ".signature-request-message__scroll-button",
      {
        visible: true,
      }
    );

    await littleArrowDown.click();
  }
};
