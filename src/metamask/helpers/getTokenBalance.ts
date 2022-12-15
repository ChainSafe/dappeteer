import { clickOnButton } from "../../helpers";
import { DappeteerPage, Serializable } from "../../page";

export const getTokenBalance =
  (page: DappeteerPage) =>
  async (tokenSymbol: string): Promise<number> => {
    await page.bringToFront();
    await clickOnButton(page, "Assets");
    await page.waitForSelector(".asset-list-item__token-button");
    const assetListItems = await page.$$(".asset-list-item__token-button");

    for (let index = 0; index < assetListItems.length; index++) {
      const assetListItem = assetListItems[index];

      const titleAttributeValue: string = await page.evaluate(
        (item) => (item as unknown as HTMLButtonElement).getAttribute("title"),
        assetListItem.getSource() as Serializable
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
