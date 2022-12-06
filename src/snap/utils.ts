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
