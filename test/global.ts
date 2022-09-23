import http from 'http';

import { Provider, Server } from 'ganache';
import { HookFunction } from 'mocha';
import puppeteer, { Browser } from 'puppeteer';

import * as dappeteer from '../src';
import { Dappeteer } from '../src';

import { startLocalEthereum, startTestServer } from './deploy';

export type InjectableContext = Readonly<{
  provider: Provider;
  ethereum: Server<'ethereum'>;
  testPageServer: http.Server;
  browser: Browser;
  metamask: Dappeteer;
}>;

// TestContext will be used by all the test
export type TestContext = Mocha.Context & InjectableContext;

export const LOCAL_PREFUNDED_MNEMONIC =
  'pioneer casual canoe gorilla embrace width fiction bounce spy exhibit another dog';
export const PASSWORD = 'password1234';

export const mochaHooks = (): { beforeAll: HookFunction; afterAll: HookFunction } => {
  return {
    async beforeAll(this: Mocha.Context) {
      const ethereum = await startLocalEthereum({
        wallet: {
          mnemonic: LOCAL_PREFUNDED_MNEMONIC,
          defaultBalance: 10,
        },
      });
      const browser = await dappeteer.launch(puppeteer, {
        metaMaskVersion: process.env.METAMASK_VERSION || dappeteer.RECOMMENDED_METAMASK_VERSION,
      });
      const server = await startTestServer();
      const metamask = await dappeteer.setupMetaMask(browser, {
        // optional, else it will use a default seed
        seed: LOCAL_PREFUNDED_MNEMONIC,
        password: PASSWORD,
      });
      const context: InjectableContext = {
        ethereum: ethereum,
        provider: ethereum.provider,
        browser,
        testPageServer: server,
        metamask,
      };

      Object.assign(this, context);
    },

    async afterAll(this: TestContext) {
      this.testPageServer.close();
      await this.browser.close();
      await this.ethereum.close();
    },
  };
};
