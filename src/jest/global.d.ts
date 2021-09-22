import { Config } from '@jest/types';
import puppeteer from 'puppeteer';

import { Dappeteer, MetamaskOptions } from '..';

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
    puppeteer: puppeteer.LaunchOptions;
    metamask: MetamaskOptions;
  }>;
