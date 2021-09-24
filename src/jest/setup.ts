import puppeteer from 'puppeteer';

import { launch, LaunchOptions, setupMetamask } from '../index';

import { DappateerConfig } from './global';

export const DAPPETEER_DEFAULT_CONFIG: LaunchOptions = { metamaskVersion: 'latest' };

export default async function (jestConfig: DappateerConfig = { dappeteer: DAPPETEER_DEFAULT_CONFIG }): Promise<void> {
  const browser = await launch(puppeteer, jestConfig.dappeteer || DAPPETEER_DEFAULT_CONFIG);
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
