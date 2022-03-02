import { Config } from '@jest/types';
import { Browser, Page } from 'puppeteer';

import { Dappeteer, LaunchOptions, MetamaskOptions } from '..';

declare global {
  namespace NodeJS {
    interface Global {
      page: Page;
      browser: Browser;
      metamask: Dappeteer;
    }
  }
}

export type DappateerConfig = Config.InitialOptions &
  Partial<{
    dappeteer: LaunchOptions;
    metamask: MetamaskOptions;
  }>;
