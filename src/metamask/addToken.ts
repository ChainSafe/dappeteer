import { Page } from "puppeteer";

import {
  clickOnButton,
  clickOnElement,
  clickOnLogo,
  getElementByContent,
  typeOnInputField,
} from "../helpers";
import { AddToken } from "../index";

export const addToken =
  (page: Page) =>
  async ({ tokenAddress, symbol, decimals = 0 }: AddToken): Promise<void> => {
    await page.bringToFront();
    await clickOnButton(page, "Assets");
    await page.waitForSelector(".asset-list-item__token-button");
    await clickOnElement(page, "import tokens");
    await clickOnButton(page, "Custom token");

    await typeOnInputField(page, "Token decimal", String(decimals), true);
    await typeOnInputField(page, "Token contract address", tokenAddress);
    await page.waitForTimeout(333);
    await typeOnInputField(page, "Token symbol", symbol, true);

    await clickOnButton(page, "Add custom token");
    await clickOnButton(page, "Import tokens");

    await getElementByContent(page, symbol);
    await clickOnLogo(page);
  };
