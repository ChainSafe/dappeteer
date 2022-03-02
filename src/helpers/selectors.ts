import { ElementHandle, Page } from 'puppeteer';

export const getElementByContent = (page: Page, text: string, type = '*'): Promise<ElementHandle | null> =>
  page.waitForXPath(`//${type}[contains(text(), '${text}')]`);

export const getInputByLabel = (page: Page, text: string): Promise<ElementHandle | null> =>
  page.waitForXPath(
    [
      `//label[contains(.,'${text}')]/following-sibling::textarea`,
      `//label[contains(.,'${text}')]/following-sibling::*//input`,
      `//h6[contains(.,'${text}')]/parent::node()/parent::node()/following-sibling::input`,
      `//h6[contains(.,'${text}')]/parent::node()/parent::node()/following-sibling::*//input`,
      `//span[contains(.,'${text}')]/parent::node()/parent::node()/following-sibling::*//input`,
      `//span[contains(.,'${text}')]/following-sibling::*//input`,
    ].join('|'),
  );

export const getSettingsSwitch = async (page: Page, text: string): Promise<ElementHandle | null> =>
  await page.waitForXPath(`//span[contains(text(),'${text}')]/parent::div/following-sibling::div/div/div/div`);
