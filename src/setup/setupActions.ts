import {
  clickOnButton,
  clickOnElement,
  clickOnLogo,
  clickOnNavigationButton,
  clickOnSettingsSwitch,
  openNetworkDropdown,
  openSettingsScreen,
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

export async function enableEthSign(
  metaMaskPage: DappeteerPage
): Promise<void> {
  await openSettingsScreen(metaMaskPage, "Advanced");
  await clickOnSettingsSwitch(metaMaskPage, "Toggle eth_sign requests");
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
  await clickOnButton(metaMaskPage, "onboarding-import-wallet");
  await clickOnButton(metaMaskPage, "metametrics-i-agree");

  for (const [index, seedPart] of seed.split(" ").entries())
    await typeOnInputField(metaMaskPage, `${index + 1}.`, seedPart);
  await clickOnButton(metaMaskPage, "Confirm Secret");

  await typeOnInputField(metaMaskPage, "New password", password);
  await typeOnInputField(metaMaskPage, "Confirm password", password);

  // onboarding/create-password URL
  await clickOnButton(metaMaskPage, "create-password-terms");
  await clickOnNavigationButton(metaMaskPage, "create-password-import");
  await waitForOverlay(metaMaskPage);

  // onboarding/completion URL
  await clickOnNavigationButton(metaMaskPage, "onboarding-complete-done");

  // onboarding/pin-extension tab 1 URL
  await clickOnButton(metaMaskPage, "pin-extension-next");

  // onboarding/pin-extension tab 2 URL
  await clickOnNavigationButton(metaMaskPage, "pin-extension-done");
}

export const closePopup = async (page: DappeteerPage): Promise<void> => {
  /* For some reason popup deletes close button and then create new one (react stuff)
   * hacky solution can be found here => https://github.com/puppeteer/puppeteer/issues/3496 */
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.$eval(".popover-header__button", (node) => node.click());
};

export const closeWhatsNewModal = async (
  page: DappeteerPage
): Promise<void> => {
  await clickOnButton(page, "popover-close");
};
