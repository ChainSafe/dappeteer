import { Browser, Page } from 'puppeteer';

import { Dappeteer, LaunchOptions, MetaMaskOptions } from '..';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      page: Page;
      browser: Browser;
      metaMask: Dappeteer;
    }
  }
}

export type DappateerJestConfig = Partial<{
  dappeteer: LaunchOptions;
  metaMask: MetaMaskOptions;
}>;
