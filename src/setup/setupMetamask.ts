import { Browser, Page } from 'puppeteer';

import { getMetamask } from '../metamask';
import { Dappeteer, MetamaskOptions } from '../types';

import { confirmWelcomeScreen, importAccount, showTestNets } from './setupActions';

/**
 * Setup MetaMask with base account
 * */
type Step<Options> = (page: Page, options?: Options) => void;
const defaultMetamaskSteps: Step<MetamaskOptions>[] = [confirmWelcomeScreen, importAccount, showTestNets];

export async function setupMetamask<Options = MetamaskOptions>(
  browser: Browser,
  options?: Options,
  steps: Step<Options>[] = defaultMetamaskSteps,
): Promise<Dappeteer> {
  const page = await closeHomeScreen(browser);
  await closeNotificationPage(browser);

  // goes through the installation steps required by metamask
  for (const step of steps) {
    await step(page, options);
  }

  return getMetamask(page);
}

async function closeNotificationPage(browser: Browser): Promise<void> {
  browser.on('targetcreated', async (target) => {
    if (target.url().match('chrome-extension://[a-z]+/notification.html')) {
      try {
        const page = await target.page();
        await page.close();
      } catch {
        return;
      }
    }
  });
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
