import puppeteer from 'puppeteer';

import { launch, setupMetaMask } from '../index';

import { getDappeteerConfig } from './config';

export default async function (): Promise<void> {
  const { dappeteer, metaMask } = await getDappeteerConfig();

  const browser = await launch(puppeteer, dappeteer);
  try {
    await setupMetaMask(browser, metaMask);
    global.browser = browser;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw error;
  }
  process.env.PUPPETEER_WS_ENDPOINT = browser.wsEndpoint();
}
