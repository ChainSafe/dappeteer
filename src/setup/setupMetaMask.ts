import { Browser, BrowserContext, Page, Target } from "puppeteer";

import { getMetaMask } from "../metamask";
import { Dappeteer, MetaMaskOptions } from "../types";

import { DappeteerBrowser } from "./launch";
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
type Step<Options> = (page: Page, options?: Options) => void | Promise<void>;
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
  browser: Browser | BrowserContext | DappeteerBrowser,
  options?: Options,
  steps?: Step<Options>[]
): Promise<Dappeteer> {
  const page = await getMetamaskPage(browser);
  steps = steps ?? defaultMetaMaskSteps;
  if ((browser as DappeteerBrowser).flask) {
    steps = flaskMetaMaskSteps;
  }
  await page.setViewport({ height: 800, width: 800 });
  // goes through the installation steps required by MetaMask
  for (const step of steps) {
    await step(page, options);
  }

  return getMetaMask(page);
}

async function getMetamaskPage(
  browser: Browser | BrowserContext
): Promise<Page> {
  const pages = await browser.pages();
  for (const page of pages) {
    if (page.url().match("chrome-extension://[a-z]+/home.html")) {
      return page;
    }
  }
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    browser.on("targetcreated", async (target: Target) => {
      if (target.url().match("chrome-extension://[a-z]+/home.html")) {
        try {
          const page = await target.page();
          resolve(page);
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}
