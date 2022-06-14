import puppeteer, { Browser, Page } from 'puppeteer';

import { Dappeteer, MetamaskOptions, OfficialOptions } from '../types';

import { launch } from './launch';
import { setupMetamask } from './setupMetamask';

export * from './launch';
export * from './setupMetamask';

export const bootstrap = async (
  puppeteerLib: typeof puppeteer,
  { seed, password, showTestNets, ...launchOptions }: OfficialOptions & MetamaskOptions,
): Promise<[Dappeteer, Page, Browser]> => {
  const browser = await launch(puppeteerLib, launchOptions);
  const dappeteer = await setupMetamask(browser, { seed, password, showTestNets });
  const pages = await browser.pages();

  return [dappeteer, pages[0], browser];
};
