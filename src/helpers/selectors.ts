import { DappeteerElementHandle } from "../element";
import { DappeteerPage, Serializable } from "../page";

// TODO: change text() with '.';
export const getElementByContent = (
  page: DappeteerPage,
  text: string,
  type = "*",
  options?: { timeout?: number; visible?: boolean }
): Promise<DappeteerElementHandle | null> =>
  page.waitForXPath(`//${type}[contains(text(), '${text}')]`, {
    timeout: 20000,
    visible: true,
    ...options,
  });

export const getElementByTestId = (
  page: DappeteerPage,
  testId: string,
  options: {
    visible?: boolean;
    detached?: boolean;
    hidden?: boolean;
    timeout?: number;
  } = {}
): Promise<DappeteerElementHandle | null> =>
  page.waitForSelector(`[data-testid="${testId}"]`, {
    timeout: 20000,
    visible: true,
    ...options,
  });

export const getInputByLabel = (
  page: DappeteerPage,
  text: string,
  excludeSpan = false,
  timeout = 1000
): Promise<DappeteerElementHandle> =>
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
    ].join("|"),
    { timeout, visible: true }
  );

export const getSettingsSwitch = (
  page: DappeteerPage,
  text: string
): Promise<DappeteerElementHandle | null> =>
  page.waitForXPath(
    [
      `//span[contains(.,'${text}')]/parent::div/following-sibling::div/div/div/div`,
      `//span[contains(.,'${text}')]/parent::div/following-sibling::div/div/label/div`,
    ].join("|"),
    { visible: true }
  );

export const getErrorMessage = async (
  page: DappeteerPage
): Promise<string | false> => {
  const options: Parameters<DappeteerPage["waitForSelector"]>[1] = {
    timeout: 1000,
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const errorElement: DappeteerElementHandle<Serializable> | null =
    await Promise.race([
      page.waitForSelector(`span.error`, options),
      page.waitForSelector(`.typography--color-error-1`, options),
      page.waitForSelector(`.typography--color-error-default`, options),
      page.waitForSelector(`.box--color-error-default`, options),
      page.waitForSelector(`.mm-box--color-error-default`, options),
    ]).catch(() => null);
  if (!errorElement) return false;
  return page.evaluate(
    (node) => (node as unknown as HTMLElement).textContent,
    errorElement.getSource()
  );
};

export const getButton = async (
  page: DappeteerPage,
  text: string,
  options?: {
    timeout?: number;
    visible?: boolean;
  }
): Promise<DappeteerElementHandle> => {
  return await Promise.race([
    getElementByTestId(page, text, options),
    getElementByContent(page, text, "button", options),
    getElementByContent(page, text, "span", options),
  ]);
};
