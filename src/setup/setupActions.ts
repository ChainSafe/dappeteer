import {
  clickOnButton,
  clickOnElement,
  clickOnLogo,
  clickOnNavigationButton,
  clickOnSettingsSwitch,
  openNetworkDropdown,
  typeOnInputField,
  waitForOverlay,
} from "../helpers";
import { DappeteerPage } from "../page";
import { MetaMaskOptions } from "../types";

export async function showTestNets(metaMaskPage: DappeteerPage): Promise<void> {
  await openNetworkDropdown(metaMaskPage);

  await clickOnElement(metaMaskPage, "Show/hide");
  await clickOnSettingsSwitch(metaMaskPage, "Show test networks");
  await clickOnLogo(metaMaskPage);
}

export async function acceptTheRisks(
  metaMaskPage: DappeteerPage
): Promise<void> {
  await clickOnButton(metaMaskPage, "I accept the risks");
}

export async function confirmWelcomeScreen(
  metaMaskPage: DappeteerPage
): Promise<void> {
  await clickOnButton(metaMaskPage, "Get started");
}

export async function declineAnalytics(
  metaMaskPage: DappeteerPage
): Promise<void> {
  await clickOnButton(metaMaskPage, "No thanks");
}

export async function importAccount(
  metaMaskPage: DappeteerPage,
  {
    seed = "already turtle birth enroll since owner keep patch skirt drift any dinner",
    password = "password1234",
  }: MetaMaskOptions
): Promise<void> {
  await clickOnButton(metaMaskPage, "Import an existing wallet");
  await clickOnButton(metaMaskPage, "I agree");

  for (const [index, seedPart] of seed.split(" ").entries())
    await typeOnInputField(metaMaskPage, `${index + 1}.`, seedPart);
  await clickOnButton(metaMaskPage, "Confirm Secret");

  await typeOnInputField(metaMaskPage, "New password", password);
  await typeOnInputField(metaMaskPage, "Confirm password", password);

  // onboarding/create-password URL
  await clickOnButton(metaMaskPage, "create-password-terms", {
    findByTestId: true,
  });
  await clickOnNavigationButton(metaMaskPage, "create-password-import");
  await waitForOverlay(metaMaskPage);

  // onboarding/completion URL
  await clickOnNavigationButton(metaMaskPage, "onboarding-complete-done");

  // onboarding/pin-extension tab 1 URL
  await clickOnButton(metaMaskPage, "pin-extension-next", {
    findByTestId: true,
  });

  // onboarding/pin-extension tab 2 URL
  await clickOnNavigationButton(metaMaskPage, "pin-extension-done");
}

export const closePopup = async (page: DappeteerPage): Promise<void> => {
  /* For some reason popup deletes close button and then create new one (react stuff)
   * hacky solution can be found here => https://github.com/puppeteer/puppeteer/issues/3496 */
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.$eval(".popover-header__button", (node) => node.click());
};

export const closePortfolioTooltip = async (
  page: DappeteerPage
): Promise<void> => {
  const closeButton = await page.waitForSelector(
    `div.home__subheader-link--tooltip-content-header > button`,
    {
      timeout: 20000,
    }
  );
  await closeButton.click();
  await page.waitForTimeout(333);
};

export const closeWhatsNewModal = async (
  page: DappeteerPage
): Promise<void> => {
  await page.reload();
  await clickOnLogo(page);
  await page.waitForTimeout(333);
};

export const closeNewModal = async (page: DappeteerPage): Promise<void> => {
  const closeButton = await page.$(
    ".home__subheader-link--tooltip-content-header-button"
  );
  await closeButton.click();
};
