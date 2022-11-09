import { Config } from "@jest/types";
import NodeEnvironment from "jest-environment-node";
import puppeteer from "puppeteer";

import { getMetaMaskWindow } from "../index";
import { DPuppeteerBrowser } from "../puppeteer";

class DappeteerEnvironment extends NodeEnvironment {
  constructor(config: Config.ProjectConfig) {
    super(config);
  }

  async setup(): Promise<void> {
    await super.setup();

    // get the wsEndpoint
    const wsEndpoint = process.env.PUPPETEER_WS_ENDPOINT;
    if (!wsEndpoint) {
      throw new Error("wsEndpoint not found");
    }

    // connect to puppeteer
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });
    this.global.browser = browser;
    this.global.metamask = await getMetaMaskWindow(
      new DPuppeteerBrowser(browser, false)
    );
    this.global.page = await browser.newPage();
  }
}

module.exports = DappeteerEnvironment;
