import path from "path";

import * as dappeteer from "../src";

import {
  InjectableContext,
  LOCAL_PREFUNDED_MNEMONIC,
  PASSWORD,
  TestContext,
} from "./constant";
import { deployContract, startLocalEthereum } from "./deploy";

export const mochaHooks = {
  async beforeAll(this: Mocha.Context): Promise<void> {
    this.timeout(100000);
    const ethereum = await startLocalEthereum({
      wallet: {
        mnemonic: LOCAL_PREFUNDED_MNEMONIC,
        defaultBalance: 100,
      },
    });

    const { browser, metaMask, metaMaskPage } = await dappeteer.bootstrap({
      // optional, else it will use a default seed
      seed: LOCAL_PREFUNDED_MNEMONIC,
      password: PASSWORD,
      automation:
        (process.env.AUTOMATION as "puppeteer" | "playwright") ?? "puppeteer",
      browser: "chrome",
      metaMaskVersion:
        process.env.METAMASK_VERSION || dappeteer.RECOMMENDED_METAMASK_VERSION,
      playwrightOptions: {
        headless: true,
      },
      puppeteerOptions: {
        headless: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const contract = await deployContract(ethereum.provider);

    const context: InjectableContext = {
      ethereum: ethereum,
      provider: ethereum.provider,
      browser,
      metaMask,
      metaMaskPage,
      flask: false,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      contract,
    };

    Object.assign(this, context);
  },

  async afterAll(this: TestContext): Promise<void> {
    await this.browser.close();
    await this.ethereum.close();
  },

  async afterEach(this: TestContext): Promise<void> {
    if (this.currentTest.state === "failed") {
      await this.metaMaskPage.screenshot(
        path.resolve(
          __dirname,
          `../${
            process.env.AUTOMATION ?? "puppeteer"
          }_${this.currentTest.fullTitle()}.png`
        )
      );
    }
  },
};
