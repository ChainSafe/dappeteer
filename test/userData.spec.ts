import fs from "fs";
import { expect } from "chai";
import {
  DEFAULT_FLASK_USERDATA,
  DEFAULT_METAMASK_USERDATA,
  launch,
  setupBootstrappedMetaMask,
  setupMetaMask,
} from "../src";
import { getTemporaryUserDataDir } from "../src/setup/utils/getTemporaryUserDataDir";
import {
  LOCAL_PREFUNDED_MNEMONIC,
  PASSWORD,
  SHORT_ACCOUNT_ADDRESS,
  TestContext,
} from "./constant";
import { isUserDataTest, pause } from "./utils/utils";

describe("userData", function () {
  this.timeout(120000);

  const automation =
    (process.env.AUTOMATION as "puppeteer" | "playwright") ?? "puppeteer";
  const metaMaskOptions = {
    seed: LOCAL_PREFUNDED_MNEMONIC,
    password: PASSWORD,
  };

  beforeEach(function (this: TestContext) {
    if (!isUserDataTest()) {
      this.skip();
    }
  });

  function isEmpty(dir: string): boolean {
    return fs.readdirSync(dir).length === 0;
  }

  describe("MetaMask", function () {
    let userDataDir: string;
    before(function () {
      userDataDir = getTemporaryUserDataDir();
    });

    after(function () {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    });

    it("should successfully store user data", async function (this: TestContext) {
      const browser = await launch({ automation });
      await setupMetaMask(browser, metaMaskOptions);

      // give some pause to store state into files
      await pause(5);

      const isSuccess = browser.storeUserData(userDataDir);
      await browser.close();

      expect(isSuccess).to.be.true;
      expect(isEmpty(userDataDir)).to.be.false;
    });

    it("should successfully launch from custom user folder", async function (this: TestContext) {
      const browser = await launch({
        automation,
        userDataDir,
      });
      const metaMask = await setupBootstrappedMetaMask(
        browser,
        metaMaskOptions.password
      );

      const shortAddress = await metaMask.page.evaluate(() =>
        document
          .querySelector(`[data-testid="address-copy-button-text"]`)
          .innerHTML.substring(0, 12)
      );
      await browser.close();

      expect(shortAddress).to.be.eq(SHORT_ACCOUNT_ADDRESS);
    });
  });

  describe("Flask", function () {
    let userDataDir: string;
    before(function () {
      userDataDir = getTemporaryUserDataDir();
    });

    after(function () {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    });

    it("should successfully store user data", async function (this: TestContext) {
      const browser = await launch({
        automation,
        metaMaskFlask: true,
      });
      await setupMetaMask(browser, metaMaskOptions);

      // give some pause to store state into files
      await pause(5);

      const isSuccess = browser.storeUserData(userDataDir);
      await browser.close();

      expect(isSuccess).to.be.true;
      expect(isEmpty(userDataDir)).to.be.false;
    });

    it("should successfully launch from custom user folder", async function (this: TestContext) {
      const browser = await launch({
        automation,
        metaMaskFlask: true,
        userDataDir,
      });
      const metaMask = await setupBootstrappedMetaMask(
        browser,
        metaMaskOptions.password
      );

      const shortAddress = await metaMask.page.evaluate(() =>
        document
          .querySelector(`[data-testid="address-copy-button-text"]`)
          .innerHTML.substring(0, 12)
      );
      await browser.close();

      expect(shortAddress).to.be.eq(SHORT_ACCOUNT_ADDRESS);
    });
  });

  describe("Predefined", function () {
    it("should successfully launch project's default MetaMask", async function (this: TestContext) {
      const browser = await launch({
        automation,
        metaMaskFlask: false,
        userDataDir: DEFAULT_METAMASK_USERDATA,
      });

      const metaMask = await setupBootstrappedMetaMask(
        browser,
        metaMaskOptions.password
      );

      const shortAddress = await metaMask.page.evaluate(() =>
        document
          .querySelector(`[data-testid="address-copy-button-text"]`)
          .innerHTML.substring(0, 12)
      );
      await browser.close();

      expect(shortAddress).to.be.eq(SHORT_ACCOUNT_ADDRESS);
    });

    it("should successfully launch project's default Flask", async function (this: TestContext) {
      const browser = await launch({
        automation,
        metaMaskFlask: true,
        userDataDir: DEFAULT_FLASK_USERDATA,
      });

      const metaMask = await setupBootstrappedMetaMask(
        browser,
        metaMaskOptions.password
      );

      const shortAddress = await metaMask.page.evaluate(() =>
        document
          .querySelector(`[data-testid="address-copy-button-text"]`)
          .innerHTML.substring(0, 12)
      );
      await browser.close();

      expect(shortAddress).to.be.eq(SHORT_ACCOUNT_ADDRESS);
    });
  });
});
