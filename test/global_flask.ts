import path from "path";
import * as dappeteer from "../src";
import {
  InjectableContext,
  LOCAL_PREFUNDED_MNEMONIC,
  PASSWORD,
  TestContext,
} from "./constant";
import {
  deployContract,
  startLocalEthereum,
  buildSnaps,
  startTestServer,
} from "./deploy";

export const mochaHooks = {
  async beforeAll(this: Mocha.Context): Promise<void> {
    this.timeout(100000);
    const ethereum = await startLocalEthereum({
      wallet: {
        mnemonic: LOCAL_PREFUNDED_MNEMONIC,
        defaultBalance: 100,
      },
    });
    const browser = await dappeteer.launch({
      browser: "chrome",
      automation:
        (process.env.AUTOMATION as "puppeteer" | "playwright") ?? "puppeteer",
      metaMaskVersion:
        process.env.METAMASK_VERSION || dappeteer.RECOMMENDED_METAMASK_VERSION,
      metaMaskFlask: true,
    });
    const server = await startTestServer();
    const snapServers = await buildSnaps();
    const metamask = await dappeteer.setupMetaMask(browser, {
      // optional, else it will use a default seed
      seed: LOCAL_PREFUNDED_MNEMONIC,
      password: PASSWORD,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const contract = await deployContract(ethereum.provider);

    const context: InjectableContext = {
      ethereum: ethereum,
      provider: ethereum.provider,
      browser,
      testPageServer: server,
      snapServers: snapServers,
      metamask,
      flask: true,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
    if (this.currentTest.state === "failed") {
      await this.metamask.page.screenshot(
        path.resolve(
          __dirname,
          `../${
            process.env.AUTOMATION ?? "puppeteer"
          }_flask_${this.currentTest.fullTitle()}.png`
        )
      );
    }
  },
};
