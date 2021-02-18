import { Page } from 'puppeteer';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const addNetwork = (page: Page, version?: string) => async (url: string): Promise<void> => {
  await page.bringToFront();
  const networkSwitcher = await page.waitForSelector('.network-indicator');
  await networkSwitcher.click();
  await page.waitForSelector('li.dropdown-menu-item');
  const networkIndex = await page.evaluate((network) => {
    const elements = document.querySelectorAll('li.dropdown-menu-item');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if ((element as HTMLLIElement).innerText.toLowerCase().includes(network.toLowerCase())) {
        return i;
      }
    }
    return elements.length - 1;
  }, 'Custom RPC');
  const networkButton = (await page.$$('li.dropdown-menu-item'))[networkIndex];
  await networkButton.click();
  const newRPCInput = await page.waitForSelector('input#new-rpc');
  await newRPCInput.type(url);
  const saveButton = await page.waitForSelector('button.settings-tab__rpc-save-button');
  await saveButton.click();
  const prevButton = await page.waitForSelector('img.app-header__metafox-logo');
  await prevButton.click();
};
