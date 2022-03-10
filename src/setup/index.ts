import puppeteer from 'puppeteer';

import { Dappeteer, MetamaskOptions, OfficialOptions } from '../types';

import { launch } from './launch';
import { setupMetamask } from './setupMetamask';

export * from './launch';
export * from './setupMetamask';

export const bootstrapDappeteer = async (
  puppeteerLib: typeof puppeteer,
  { seed, password, showTestNets, hideSeed, ...launchOptions }: OfficialOptions & MetamaskOptions,
): Promise<Dappeteer> => {
  const browser = await launch(puppeteerLib, launchOptions);
  return await setupMetamask(browser, { seed, password, showTestNets, hideSeed });
};
