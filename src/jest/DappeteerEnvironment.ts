import NodeEnvironment from 'jest-environment-node';
import puppeteer from 'puppeteer';

import { getMetamaskWindow } from '../index';

class DappeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup(): Promise<void> {
    await super.setup();

    // get the wsEndpoint
    const wsEndpoint = process.env.PUPPETEER_WS_ENDPOINT;
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found');
    }

    // connect to puppeteer
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });
    this.global.browser = browser;
    this.global.metamask = await getMetamaskWindow(browser);
    this.global.page = await browser.newPage();
  }
}

module.exports = DappeteerEnvironment;
