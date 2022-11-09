import { DappeteerBrowser } from "../browser";
import { DappeteerPage } from "../page";
import { Dappeteer, DappeteerLaunchOptions, MetaMaskOptions } from "../types";
import { launch } from "./launch";
import { setupMetaMask } from "./setupMetaMask";

export * from "./launch";
export * from "./setupMetaMask";

export const bootstrap = async ({
  seed,
  password,
  showTestNets,
  ...launchOptions
}: DappeteerLaunchOptions & MetaMaskOptions): Promise<{
  dappeteer: Dappeteer;
  browser: DappeteerBrowser;
  page: DappeteerPage;
}> => {
  const browser = await launch(launchOptions);
  const dappeteer = await setupMetaMask(browser, {
    seed,
    password,
    showTestNets,
  });
  const pages = await browser.pages();

  return {
    dappeteer,
    browser,
    page: pages[0],
  };
};
