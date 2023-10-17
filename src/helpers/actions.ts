import { DappeteerElementHandle } from "../element";
import { DappeteerPage } from "../page";
import {
  getButton,
  getElementByContent,
  getElementByTestId,
  getInputByLabel,
  getSettingsSwitch,
} from "./selectors";
import { retry } from "./utils";

export const clickOnSettingsSwitch = async (
  page: DappeteerPage,
  text: string
): Promise<void> => {
  const button = await getSettingsSwitch(page, text);
  await button.click();
};

type Section =
  | "General"
  | "Advanced"
  | "Contacts"
  | "Snaps"
  | "Security & privacy"
  | "Alerts"
  | "Networks"
  | "Experimental"
  | "About";
export const openSettingsScreen = async (
  page: DappeteerPage,
  section: Section = "General"
): Promise<void> => {
  await clickOnElement(page, "account-options-menu-button");
  await clickOnElement(page, "global-menu-settings");

  await clickOnElement(page, section);
};

export const openNetworkDropdown = async (
  page: DappeteerPage
): Promise<void> => {
  await retry(async () => {
    const networkSwitcher = await page.waitForSelector(".mm-picker-network", {
      visible: true,
    });
    await networkSwitcher.click();
  }, 3);
};

export const profileDropdownClick = async (
  page: DappeteerPage
): Promise<void> => {
  await retry(async () => {
    await clickOnButton(page, "account-menu-icon", {
      visible: true,
      timeout: 2000,
    });
  }, 3);
};

export const accountOptionsDropdownClick = async (
  page: DappeteerPage,
  expectToClose = false
): Promise<void> => {
  await retry(async () => {
    const accountOptionsButton = await page.waitForSelector(
      `[data-testid="account-options-menu-button"]`,
      {
        visible: true,
        timeout: 2000,
      }
    );
    await accountOptionsButton.click();
    await page.waitForSelector(".menu__container", {
      hidden: expectToClose,
      timeout: 2000,
    });
  }, 3);
};

export const clickOnElement = async (
  page: DappeteerPage,
  text: string,
  type?: string
): Promise<void> => {
  const element = await Promise.race([
    getElementByContent(page, text, type),
    getElementByTestId(page, text),
  ]);
  await element.click();
};

export const clickOnButton = async (
  page: DappeteerPage,
  text: string,
  options?: {
    timeout?: number;
    visible?: boolean;
  }
): Promise<void> => {
  const button = await getButton(page, text, options);
  await button.click();
};

export const clickOnNavigationButton = async (
  metaMaskPage: DappeteerPage,
  text: string
): Promise<void> => {
  const navigationButton = await getButton(metaMaskPage, text);
  await Promise.all([
    metaMaskPage.waitForNavigation(),
    navigationButton.click(),
  ]);
};

export const clickOnLogo = async (page: DappeteerPage): Promise<void> => {
  const header = await page.waitForSelector(".app-header__logo-container", {
    visible: true,
  });
  await header.click();
};

export const goToHomePage = async (page: DappeteerPage): Promise<void> => {
  return await clickOnButton(page, "app-header-logo");
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

export async function waitForOverlay(page: DappeteerPage): Promise<void> {
  await page.waitForSelectorIsGone(".loading-overlay", { timeout: 10000 });
  await page.waitForSelectorIsGone(".app-loading-spinner", { timeout: 10000 });
}

/**
 *
 * @param page
 */
export const clickOnLittleDownArrowIfNeeded = async (
  page: DappeteerPage
): Promise<void> => {
  // wait for the signature page and content to be loaded
  await page.waitForSelector('[data-testid="page-container-footer-next"]', {
    visible: true,
  });

  // MetaMask requires users to read all the data
  // and scroll until the bottom of the message
  // before enabling the "Sign" button
  const isSignButtonDisabled = await page.$eval(
    '[data-testid="page-container-footer-next"]',
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

export const evaluateElementClick = async (
  page: DappeteerPage,
  selector: string
): Promise<void> => {
  /* For some reason popup deletes close button and then create new one (react stuff)
   * hacky solution can be found here => https://github.com/puppeteer/puppeteer/issues/3496 */
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.$eval(selector, (node) => node.click());
};
