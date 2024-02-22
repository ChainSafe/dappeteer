import * as dappeteer from '../src/setup/indexKeplr';
import { TestContext } from './constant';

export const mochaHooks = {
  async beforeAll(this: Mocha.Context): Promise<void> {
    this.timeout(100000);
    const { browser } = await dappeteer.bootstrap({
      automation:
        (process.env.AUTOMATION as 'puppeteer' | 'playwright') ?? 'puppeteer',
        metaMaskVersion:
        process.env.METAMASK_VERSION || "v11",
    });
    this.browser = browser;
  },

  async afterAll(this: TestContext): Promise<void> {
    await this.browser.close();
  },
};
