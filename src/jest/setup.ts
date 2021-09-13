import puppeteer from 'puppeteer';

import { launch, setupMetamask } from '../index';

import { DappateerConfig } from './global';
import { PUPPETEER_DEFAULT_CONFIG } from './jest-preset';

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
