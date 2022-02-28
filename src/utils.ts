import { ElementHandle, Page } from 'puppeteer';

export const isNewerVersion = (current: string, comparingWith: string): boolean => {
  if (current === comparingWith) return false;

  const currentFragments = current.replace(/[^\d.-]/g, '').split('.');
  const comparingWithFragments = comparingWith.replace(/[^\d.-]/g, '').split('.');

  const length =
    currentFragments.length > comparingWithFragments.length ? currentFragments.length : comparingWithFragments.length;
  for (let i = 0; i < length; i++) {
    if ((Number(currentFragments[i]) || 0) === (Number(comparingWithFragments[i]) || 0)) continue;
    return (Number(comparingWithFragments[i]) || 0) > (Number(currentFragments[i]) || 0);
  }
  return true;
};

export const getElementByContent = (page: Page, text: string, type = '*'): Promise<ElementHandle | null> =>
  page.waitForXPath(`//${type}[contains(text(), '${text}')]`);

export const getInputByLabel = (page: Page, text: string): Promise<ElementHandle | null> =>
  page.waitForXPath(
    [
      `//label[contains(text(),'${text}')]/following-sibling::textarea`,
      `//label[contains(text(),'${text}')]/following-sibling::*//input`,
      `//h6[contains(text(),'${text}')]/parent::node()/parent::node()/following-sibling::input`,
      `//h6[contains(text(),'${text}')]/parent::node()/parent::node()/following-sibling::*//input`,
      `//span[contains(text(),'${text}')]/parent::node()/parent::node()/following-sibling::*//input`,
      `//span[contains(text(),'${text}')]/following-sibling::*//input`,
    ].join('|'),
  );

export const clickOnSettingsSwitch = async (page: Page, text: string): Promise<void> => {
  const button = await page.waitForXPath(
    `//span[contains(text(),'${text}')]/parent::div/following-sibling::div/div/div/div`,
  );
  await button.click();
};

export const openNetworkDropdown = async (page: Page): Promise<void> => {
  const networkSwitcher = await page.waitForSelector('.network-display');
  await networkSwitcher.click();
  await page.waitForSelector('li.dropdown-menu-item');
};
