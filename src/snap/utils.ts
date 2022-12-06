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
