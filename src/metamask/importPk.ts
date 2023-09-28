import {
  clickOnButton,
  clickOnElement,
  getErrorMessage,
  profileDropdownClick,
  typeOnInputField,
} from "../helpers";
import { DappeteerPage } from "../page";

export const importPk =
  (page: DappeteerPage) =>
  async (privateKey: string): Promise<void> => {
    await page.bringToFront();
    await profileDropdownClick(page);

    await clickOnElement(page, "Import account");
    await typeOnInputField(
      page,
      "Enter your private key string here:",
      privateKey
    );
    await clickOnButton(page, "import-account-confirm-button");
    const errorMessage = await getErrorMessage(page);
    if (errorMessage) throw new SyntaxError(errorMessage);
  };
