import { Browser, Page } from 'puppeteer';

import { Dappeteer, LaunchOptions, MetamaskOptions } from '..';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      page: Page;
      browser: Browser;
      metamask: Dappeteer;
    }
  }
}

export type DappateerJestConfig = Partial<{
  dappeteer: LaunchOptions;
  metamask: MetamaskOptions;
}>;
