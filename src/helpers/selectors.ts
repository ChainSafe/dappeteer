import { ElementHandle, Page } from 'puppeteer';

// TODO: change text() with '.';
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

export const getSettingsSwitch = (page: Page, text: string): Promise<ElementHandle | null> =>
  page.waitForXPath(`//span[contains(.,'${text}')]/parent::div/following-sibling::div/div/div/div`);

export const getErrorMessage = async (page: Page): Promise<string | false> => {
  const errorElement = await page.waitForSelector(`span.error`, { timeout: 1000 }).catch(() => null);
  if (!errorElement) return false;
  return page.evaluate((node) => node.textContent, errorElement);
};

export const getAccountMenuButton = (page: Page): Promise<ElementHandle | null> =>
  page.waitForXPath(`//button[contains(@title,'Account Options')]`);
