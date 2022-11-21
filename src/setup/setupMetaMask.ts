import { DappeteerBrowser } from "../browser";
import { getMetaMask } from "../metamask";
import { DappeteerPage } from "../page";
import { Dappeteer, MetaMaskOptions } from "../types";

import {
  acceptTheRisks,
  closePortfolioTooltip,
  closeWhatsNewModal,
  confirmWelcomeScreen,
  declineAnalytics,
  importAccount,
  showTestNets,
} from "./setupActions";

/**
 * Setup MetaMask with base account
 * */
type Step<Options> = (
  page: DappeteerPage,
  options?: Options
) => void | Promise<void>;
const defaultMetaMaskSteps: Step<MetaMaskOptions>[] = [
  confirmWelcomeScreen,
  declineAnalytics,
  importAccount,
  showTestNets,
  closePortfolioTooltip,
  closeWhatsNewModal,
  closeWhatsNewModal,
];
const flaskMetaMaskSteps: Step<MetaMaskOptions>[] = [
  acceptTheRisks,
  importAccount,
  showTestNets,
  closePortfolioTooltip,
  closeWhatsNewModal,
  closeWhatsNewModal,
];

export async function setupMetaMask<Options = MetaMaskOptions>(
  browser: DappeteerBrowser,
  options?: Options,
  steps?: Step<Options>[]
): Promise<Dappeteer> {
  const page = await getMetamaskPage(browser);
  steps = steps ?? defaultMetaMaskSteps;
  if (browser.isMetaMaskFlask()) {
    steps = flaskMetaMaskSteps;
  }
  await page.setViewport({ height: 800, width: 800 });
  // goes through the installation steps required by MetaMask
  for (const step of steps) {
    await step(page, options);
  }

  return getMetaMask(page);
}

const browsersRegex = [
  "chrome-extension://[a-z]+/home.html",
  "moz-extension://[a-z0-9-]+/home.html",
].join("|");
async function getMetamaskPage(
  browser: DappeteerBrowser
): Promise<DappeteerPage> {
  const pages = await browser.pages();
  for (const page of pages) {
    console.warn(page.url());
    await new Promise(r => setTimeout(r, 3000))
    if (page.url().match(browsersRegex)) {
      return page;
    }
  }

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    browser.on("targetcreated", async (target: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      if (target.url().match(browsersRegex)) {
        try {
          const pages = await browser.pages();
          for (const page of pages) {
            if (page.url().match(browsersRegex)) {
              resolve(page);
            }
          }
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}
