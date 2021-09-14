import puppeteer, { Product } from 'puppeteer';

import { launch, setupMetamask } from '../index';

import { DappateerConfig } from './global';

export const PUPPETEER_DEFAULT_CONFIG: puppeteer.LaunchOptions = {
  product: (process.env.PUPPETEER_PRODUCT ?? 'chrome') as Product,
  args: ['--disable-web-security'] as string[],
};

export default async function (jestConfig: DappateerConfig = {}): Promise<void> {
  const browser = await launch(puppeteer, jestConfig.puppeteer || PUPPETEER_DEFAULT_CONFIG);
  try {
    await setupMetamask(browser, jestConfig.metamask);
    global.browser = browser;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
  process.env.PUPPETEER_WS_ENDPOINT = browser.wsEndpoint();
}
