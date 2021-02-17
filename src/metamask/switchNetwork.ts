import { Page } from "puppeteer";

export const switchNetwork = (page: Page, version?: string) => async (network = 'main') => {
  await page.bringToFront();
  const networkSwitcher = await page.waitForSelector('.network-display');
  await networkSwitcher.click();
  await page.waitForSelector('li.dropdown-menu-item');
  const networkIndex = await page.evaluate(network => {
    const elements = document.querySelectorAll('li.dropdown-menu-item');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if ((element as HTMLLIElement).innerText.toLowerCase().includes(network.toLowerCase())) {
        return i;
      }
    }
    return 0;
  }, network);
  const networkButton = (await page.$$('li.dropdown-menu-item'))[networkIndex];
  await networkButton.click();
};
