import { DappeteerElementHandle } from "../element";
import { DappeteerPage } from "../page";

export function flaskOnly(page: DappeteerPage): void {
  if (!page.browser().isMetaMaskFlask()) {
    throw new Error(
      "This method is only available when running MetaMask Flask"
    );
  }
}

export function isMetaMaskErrorObject(e: unknown): boolean {
  if (e == undefined) return false;
  if (!(e instanceof Object)) return false;
  if (!("code" in e)) return false;
  if (!("message" in e)) return false;
  if (!("data" in e)) return false;
  if (!("originalError" in e["data"])) return false;
  return true;
}

export function isElementVisible(
  page: DappeteerPage,
  selector: string,
  timeout = 1000
): Promise<boolean> {
  return new Promise((resolve) => {
    page
      .waitForSelector(selector, { visible: true, timeout })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
  });
}

function getWaitingPromise(
  page: DappeteerPage,
  selectorOrXpath: string,
  timeout: number
): Promise<DappeteerElementHandle<unknown, HTMLElement>> {
  if (selectorOrXpath.startsWith("//")) {
    return page.waitForXPath(selectorOrXpath, { timeout });
  } else {
    return page.waitForSelector(selectorOrXpath, { timeout });
  }
}

interface IsFirstElementAppearsFirstParams {
  selectorOrXpath1: string;
  selectorOrXpath2: string;
  timeout?: number;
  page: DappeteerPage;
}

export async function isFirstElementAppearsFirst({
  selectorOrXpath1,
  selectorOrXpath2,
  page,
  timeout = 4000,
}: IsFirstElementAppearsFirstParams): Promise<boolean> {
  const promise1 = getWaitingPromise(page, selectorOrXpath1, timeout).then(
    () => true
  );
  const promise2 = getWaitingPromise(page, selectorOrXpath2, timeout).then(
    () => false
  );

  return await Promise.race([promise1, promise2]);
}
