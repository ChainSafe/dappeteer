import { Browser, BrowserContext, Page } from 'puppeteer';

import { getMetaMask } from '../metamask';
import { Dappeteer, MetaMaskOptions } from '../types';

import {
  closePortfolioTooltip,
  closeWhatsNewModal,
  confirmWelcomeScreen,
  declineAnalytics,
  importAccount,
  showTestNets,
} from './setupActions';

/**
 * Setup MetaMask with base account
 * */
type Step<Options> = (page: Page, options?: Options) => void;
const defaultMetaMaskSteps: Step<MetaMaskOptions>[] = [
  confirmWelcomeScreen,
  declineAnalytics,
  importAccount,
  showTestNets,
  closePortfolioTooltip,
  closeWhatsNewModal,
  closeWhatsNewModal,
];

export async function setupMetaMask<Options = MetaMaskOptions>(
  browser: Browser | BrowserContext,
  options?: Options,
  steps: Step<Options>[] = defaultMetaMaskSteps,
): Promise<Dappeteer> {
  const page = await getMetamaskPage(browser);
  page.setViewport({ height: 1200, width: 800 });
  // goes through the installation steps required by MetaMask
  for (const step of steps) {
    await step(page, options);
  }

  return getMetaMask(page);
}

async function getMetamaskPage(browser: Browser | BrowserContext): Promise<Page> {
  const pages = await browser.pages();
  for (const page of pages) {
    if (page.url().match('chrome-extension://[a-z]+/home.html')) {
      return page;
    }
  }
  return new Promise((resolve, reject) => {
    browser.on('targetcreated', async (target) => {
      if (target.url().match('chrome-extension://[a-z]+/home.html')) {
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
