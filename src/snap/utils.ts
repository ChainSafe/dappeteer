import { DappeteerPage } from "../page";

export function flaskOnly(page: DappeteerPage): void {
  if (!page.browser().isMetaMaskFlask()) {
    throw new Error(
      "This method is only available when running Metamask Flask"
    );
  }
}

export function isMetamaskErrorObject(e: unknown): boolean {
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
  timeout = 2000
): Promise<boolean> {
  return new Promise((resolve) => {
    page
      .waitForSelector(selector, { visible: true, timeout })
      .then(() => {
        resolve(true);
        console.log("yes", selector);
      })
      .catch(() => {
        resolve(false);
        console.log("nope", selector);
      });
  });
}
