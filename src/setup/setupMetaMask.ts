import { Browser, Page } from 'puppeteer';

import { getMetaMask } from '../metamask';
import { Dappeteer, MetaMaskOptions } from '../types';

import { closePopup, confirmWelcomeScreen, importAccount, showTestNets } from './setupActions';

/**
 * Setup MetaMask with base account
 * */
type Step<Options> = (page: Page, options?: Options) => void;
const defaultMetaMaskSteps: Step<MetaMaskOptions>[] = [confirmWelcomeScreen, importAccount, closePopup, showTestNets];

export async function setupMetaMask<Options = MetaMaskOptions>(
  browser: Browser,
  options?: Options,
  steps: Step<Options>[] = defaultMetaMaskSteps,
): Promise<Dappeteer> {
  const page = await closeHomeScreen(browser);

  // goes through the installation steps required by MetaMask
  for (const step of steps) {
    await step(page, options);
  }

  return getMetaMask(page);
}

async function closeHomeScreen(browser: Browser): Promise<Page> {
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
