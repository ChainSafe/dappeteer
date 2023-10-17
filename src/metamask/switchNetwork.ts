import { openNetworkDropdown } from "../helpers";
import { DappeteerPage } from "../page";

// TODO: validate - for now works fine as it is.
export const switchNetwork =
  (page: DappeteerPage) =>
  async (network: string = "mainnet"): Promise<void> => {
    await page.bringToFront();
    await openNetworkDropdown(page);

    const networkIndex = await page.evaluate((network: string) => {
      const elements = document.querySelectorAll(
        ".multichain-network-list-item__network-name"
      );
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (
          (element as HTMLLIElement).innerText
            .toLowerCase()
            .includes(network.toLowerCase())
        ) {
          return i;
        }
      }
      return 0;
    }, network);

    const networkFullName = await page.evaluate((index: number) => {
      const elements = document.querySelectorAll(
        `.multichain-network-list-item__network-name`
      );
      return (elements[index] as HTMLLIElement).innerText;
    }, networkIndex);
    const networkButton = (
      await page.$$(".multichain-network-list-item__network-name")
    )[networkIndex];
    await networkButton.click();
    await page.waitForXPath(`//*[text() = '${networkFullName}']`);
  };
