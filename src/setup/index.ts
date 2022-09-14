import puppeteer, { Browser, Page } from 'puppeteer';

import { Dappeteer, MetaMaskOptions, OfficialOptions } from '../types';

import { launch } from './launch';
import { setupMetaMask } from './setupMetaMask';

export * from './launch';
export * from './setupMetaMask';

export const bootstrap = async (
  puppeteerLib: typeof puppeteer,
  { seed, password, showTestNets, ...launchOptions }: OfficialOptions & MetaMaskOptions,
): Promise<[Dappeteer, Page, Browser]> => {
  const browser = await launch(puppeteerLib, launchOptions);
  const dappeteer = await setupMetaMask(browser, { seed, password, showTestNets });
  const pages = await browser.pages();

  return [dappeteer, pages[0], browser];
};
