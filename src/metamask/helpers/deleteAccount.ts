import {
  clickOnButton,
  clickOnElement,
  openAccountDropdown,
} from "../../helpers";
import { DappeteerPage } from "../../page";
import { switchAccount } from "../switchAccount";

export const deleteAccount =
  (page: DappeteerPage) =>
  async (accountNumber: number): Promise<void> => {
    await page.bringToFront();

    if (accountNumber === 1)
      throw new SyntaxError("Account 1 cannot be deleted");
    await switchAccount(page)(accountNumber);

    await openAccountDropdown(page);
    await clickOnElement(page, "Remove account");
    await clickOnButton(page, "Remove");
    await page.reload();
  };
