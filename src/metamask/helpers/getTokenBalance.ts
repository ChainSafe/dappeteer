import { Page } from "puppeteer";

import { clickOnButton } from "../../helpers";

export const getTokenBalance =
  (page: Page) =>
  async (tokenSymbol: string): Promise<number> => {
    await page.bringToFront();
    await clickOnButton(page, "Assets");
    await page.waitForSelector(".asset-list-item__token-button");
    const assetListItems = await page.$$(".asset-list-item__token-button");

    for (let index = 0; index < assetListItems.length; index++) {
      const assetListItem = assetListItems[index];

      const titleAttributeValue: string = await page.evaluate(
        (item: HTMLButtonElement) => item.getAttribute("title"),
        assetListItem
      );

      if (
        titleAttributeValue.split(" ")[1].toUpperCase() ===
        tokenSymbol.toUpperCase()
      ) {
        const balance = titleAttributeValue.split(" ")[0];
        return parseFloat(balance);
      }
    }

    return 0;
  };
