import http from 'http';
import path from 'path';

import { Provider, Server } from 'ganache';
import puppeteer, { Browser } from 'puppeteer';

import * as dappeteer from '../src';
import { Dappeteer } from '../src';

import { Contract, deployContract, startLocalEthereum, startTestServer } from './deploy';

export type InjectableContext = Readonly<{
  provider: Provider;
  ethereum: Server<'ethereum'>;
  testPageServer: http.Server;
  browser: Browser;
  metamask: Dappeteer;
  contract: Contract;
}>;

// TestContext will be used by all the test
export type TestContext = Mocha.Context & InjectableContext;

export const LOCAL_PREFUNDED_MNEMONIC =
  'pioneer casual canoe gorilla embrace width fiction bounce spy exhibit another dog';
export const PASSWORD = 'password1234';

export const mochaHooks = {
  async beforeAll(this: Mocha.Context): Promise<void> {
    const ethereum = await startLocalEthereum({
      wallet: {
        mnemonic: LOCAL_PREFUNDED_MNEMONIC,
        defaultBalance: 100,
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
    const contract = await deployContract(ethereum.provider);

    const context: InjectableContext = {
      ethereum: ethereum,
      provider: ethereum.provider,
      browser,
      testPageServer: server,
      metamask,
      contract,
    };

    Object.assign(this, context);
  },

  async afterAll(this: TestContext): Promise<void> {
    this.testPageServer.close();
    await this.browser.close();
    await this.ethereum.close();
  },

  async afterEach(this: TestContext): Promise<void> {
    if (this.currentTest.state === 'failed') {
      await this.metamask.page.screenshot({
        path: path.resolve(__dirname, `../${this.currentTest.fullTitle()}.png`),
        fullPage: true,
      });
    }
  },
};
