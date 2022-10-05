import { Page } from "puppeteer";

import { openNetworkDropdown } from "../helpers";

// TODO: validate - for now works fine as it is.
export const switchNetwork =
  (page: Page) =>
  async (network: string = "main"): Promise<void> => {
    await page.bringToFront();
    await openNetworkDropdown(page);

    const networkIndex = await page.evaluate((network: string) => {
      const elements = document.querySelectorAll(".network-name-item");
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
      const elements = document.querySelectorAll(`.network-name-item`);
      return (elements[index] as HTMLLIElement).innerText;
    }, networkIndex);

    const networkButton = (await page.$$(".network-name-item"))[networkIndex];
    await networkButton.click();
    await page.waitForXPath(`//*[text() = '${networkFullName}']`);
  };
