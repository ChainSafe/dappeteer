import { Config } from '@jest/types';
import puppeteer from 'puppeteer';

import { Dappeteer, LaunchOptions, MetamaskOptions } from '..';

declare global {
  namespace NodeJS {
    interface Global {
      page: puppeteer.Page;
      browser: puppeteer.Browser;
      metamask: Dappeteer;
    }
  }
}

export type DappateerConfig = Config.InitialOptions &
  Partial<{
    dappeteer: LaunchOptions;
    metamask: MetamaskOptions;
  }>;
