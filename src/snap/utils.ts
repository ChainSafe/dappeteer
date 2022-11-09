import { DappeteerPage } from "../page";

export function flaskOnly(page: DappeteerPage): void {
  if (!page.browser().isMetaMaskFlask()) {
    throw new Error(
      "This method is only available when running Metamask Flask"
    );
  }
}
