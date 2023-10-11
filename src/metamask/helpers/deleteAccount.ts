import {
  clickOnButton,
  clickOnElement,
  profileDropdownClick,
} from "../../helpers";
import { DappeteerPage } from "../../page";

export const deleteAccount =
  (page: DappeteerPage) =>
  async (accountNumber: number): Promise<void> => {
    await page.bringToFront();

    if (accountNumber === 1)
      throw new SyntaxError("Account 1 cannot be deleted");

    await profileDropdownClick(page);

    const optionsButtons = await page.$$(
      `[data-testid="account-list-item-menu-button"]`
    );

    const targetAccountButton = optionsButtons[accountNumber - 1];

    await targetAccountButton.click();

    try {
      await clickOnElement(page, "Remove account");
      await clickOnButton(page, "Remove");
    } catch (e) {
      throw new SyntaxError("Only imported accounts can be deleted");
    }
    await page.reload();
  };
