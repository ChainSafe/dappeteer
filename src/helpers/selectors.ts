import { ElementHandle, Page } from 'puppeteer';

// TODO: change text() with '.';
export const getElementByContent = (page: Page, text: string, type = '*'): Promise<ElementHandle | null> =>
  page.waitForXPath(`//${type}[contains(text(), '${text}')]`);

export const getInputByLabel = (page: Page, text: string, excludeSpan = false): Promise<ElementHandle | null> =>
  page.waitForXPath(
    [
      `//label[contains(.,'${text}')]/following-sibling::textarea`,
      `//label[contains(.,'${text}')]/following-sibling::*//input`,
      `//h6[contains(.,'${text}')]/parent::node()/parent::node()/following-sibling::input`,
      `//h6[contains(.,'${text}')]/parent::node()/parent::node()/following-sibling::*//input`,
      ...(!excludeSpan
        ? [
            `//span[contains(.,'${text}')]/parent::node()/parent::node()/following-sibling::*//input`,
            `//span[contains(.,'${text}')]/following-sibling::*//input`,
          ]
        : []),
    ].join('|'),
  );

export const getSettingsSwitch = (page: Page, text: string): Promise<ElementHandle | null> =>
  page.waitForXPath(
    [
      `//span[contains(.,'${text}')]/parent::div/following-sibling::div/div/div/div`,
      `//span[contains(.,'${text}')]/parent::div/following-sibling::div/div/label/div`,
    ].join('|'),
  );

export const getErrorMessage = async (page: Page): Promise<string | false> => {
  const options: Parameters<Page['waitForSelector']>[1] = { timeout: 1000 };

  const errorElement = await Promise.race([
    page.waitForSelector(`span.error`, options),
    page.waitForSelector(`.typography--color-error-1`, options),
    page.waitForSelector(`.typography--color-error-default`, options),
  ]).catch(() => null);
  if (!errorElement) return false;
  return page.evaluate((node) => node.textContent, errorElement);
};

export const getAccountMenuButton = (page: Page): Promise<ElementHandle | null> =>
  page.waitForXPath(`//button[contains(@title,'Account Options')]`);
