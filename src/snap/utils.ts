import { Page } from "puppeteer";
import { DappeteerBrowser } from "../setup";

export function flaskOnly(page: Page): void {
  if ((page.browser() as DappeteerBrowser).flask == null) {
    throw new Error(
      "This method is only available when running Metamask Flask"
    );
  }
}
