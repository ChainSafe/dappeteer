import {
  clickOnButton,
  clickOnElement,
  clickOnLogo,
  clickOnSettingsSwitch,
  getElementByTestId,
  openNetworkDropdown,
  typeOnInputField,
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
  await clickOnButton(metaMaskPage, "Import wallet");

  for (const [index, seedPart] of seed.split(" ").entries())
    await typeOnInputField(metaMaskPage, `${index + 1}.`, seedPart);

  await typeOnInputField(metaMaskPage, "New password", password);
  await typeOnInputField(metaMaskPage, "Confirm password", password);

  // select checkbox "I have read and agree to the"
  const acceptTerms = await metaMaskPage.waitForSelector(
    ".create-new-vault__terms-label"
  );
  await acceptTerms.click();

  await clickOnButton(metaMaskPage, "Import");
  await clickOnButton(metaMaskPage, "All done");
}

export async function importAccount1(
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

  // select checkbox "I have read and agree to the"
  const acceptTerms = await getElementByTestId(
    metaMaskPage,
    "create-password-terms"
  );
  await acceptTerms.click();

  const importWalletButton = await getElementByTestId(
    metaMaskPage,
    "create-password-import"
  );

  await Promise.all([
    metaMaskPage.waitForNavigation(),
    importWalletButton.click(),
  ]);

  await metaMaskPage.waitForSelector(".creation-successful", {
    visible: true,
  });

  const doneButton = await getElementByTestId(
    metaMaskPage,
    "onboarding-complete-done"
  );

  await Promise.all([metaMaskPage.waitForNavigation(), doneButton.click()]);

  await metaMaskPage.waitForSelector(".onboarding-pin-extension", {
    visible: true,
  });

  const nextButton = await getElementByTestId(
    metaMaskPage,
    "pin-extension-next"
  );
  await nextButton.click();

  const extensionDoneButton = await getElementByTestId(
    metaMaskPage,
    "pin-extension-done"
  );

  await extensionDoneButton.click();
  await metaMaskPage.waitForTimeout(1000000);
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
