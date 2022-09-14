import puppeteer from 'puppeteer';

import { launch, setupMetamask } from '../index';

import { getDappeteerConfig } from './config';

export default async function (): Promise<void> {
  const { dappeteer, metamask } = await getDappeteerConfig();

  const browser = await launch(puppeteer, dappeteer);
  try {
    await setupMetamask(browser, metamask);
    global.browser = browser;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
  process.env.PUPPETEER_WS_ENDPOINT = browser.wsEndpoint();
}
