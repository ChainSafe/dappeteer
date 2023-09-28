import { clickOnButton } from "../../helpers";
import { DappeteerPage, Serializable } from "../../page";

export const getTokenBalance =
  (page: DappeteerPage) =>
  async (tokenSymbol: string): Promise<number> => {
    await page.bringToFront();

    await clickOnButton(page, "Tokens");
    const assetListItems = await page.$$(
      `[data-testid="multichain-token-list-item-value"]`
    );

    for (let index = 0; index < assetListItems.length; index++) {
      const assetListItem = assetListItems[index];

      const tokenText: string = await page.evaluate(
        (assetListItem: Serializable) => {
          return (assetListItem as unknown as HTMLElement).innerText;
        },
        assetListItem.getSource() as Serializable
      );

      if (tokenText.split(" ")[1].toUpperCase() === tokenSymbol.toUpperCase()) {
        const balance = tokenText.split(" ")[0];
        return parseFloat(balance);
      }
    }

    return 0;
  };
