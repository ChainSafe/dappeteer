import {
  clickOnButton,
  clickOnElement,
  getErrorMessage,
  openProfileDropdown,
  typeOnInputField,
} from "../helpers";
import { DappeteerPage } from "../page";

export const importPk =
  (page: DappeteerPage) =>
  async (privateKey: string): Promise<void> => {
    await page.bringToFront();
    await openProfileDropdown(page);

    await clickOnElement(page, "Import account");
    await typeOnInputField(page, "your private key", privateKey);
    await clickOnButton(page, "Import");

    const errorMessage = await getErrorMessage(page);
    if (errorMessage) throw new SyntaxError(errorMessage);
  };
