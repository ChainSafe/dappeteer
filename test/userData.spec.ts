import fs from "fs";
import { expect } from "chai";
import { launch, setupBootstrappedMetaMask, setupMetaMask } from "../src";
import { getTemporaryUserDataDir } from "../src/setup/utils/getTemporaryUserDataDir";
import {
  LOCAL_PREFUNDED_MNEMONIC,
  PASSWORD,
  SHORT_ACCOUNT_ADDRESS,
  TestContext,
} from "./constant";

describe("userData", function () {
  this.timeout(50000);

  const automation =
    (process.env.AUTOMATION as "puppeteer" | "playwright") ?? "puppeteer";
  const metaMaskOptions = {
    seed: LOCAL_PREFUNDED_MNEMONIC,
    password: PASSWORD,
  };

  beforeEach(function (this: TestContext) {
    if (Boolean(process.env.USER_DATA_TEST) === false) {
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
      const browser = await launch({ automation, browser: "chrome" });
      await setupMetaMask(browser, metaMaskOptions);

      browser.storeUserData(userDataDir);
      await browser.close();

      expect(isEmpty(userDataDir)).to.be.false;
    });

    it("should successfully launch from custom user folder", async function (this: TestContext) {
      const browser = await launch({
        automation,
        browser: "chrome",
        userDataDir,
      });
      const metaMask = await setupBootstrappedMetaMask(
        browser,
        metaMaskOptions.password
      );

      const shortAddress = await metaMask.page.evaluate(() =>
        document
          .querySelector(".selected-account__address")
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
        browser: "chrome",
        metaMaskFlask: true,
      });
      await setupMetaMask(browser, metaMaskOptions);

      browser.storeUserData(userDataDir);
      await browser.close();

      expect(isEmpty(userDataDir)).to.be.false;
    });

    it("should successfully launch from custom user folder", async function (this: TestContext) {
      const browser = await launch({
        automation,
        browser: "chrome",
        metaMaskFlask: true,
        userDataDir,
      });
      const metaMask = await setupBootstrappedMetaMask(
        browser,
        metaMaskOptions.password
      );

      const shortAddress = await metaMask.page.evaluate(() =>
        document
          .querySelector(".selected-account__address")
          .innerHTML.substring(0, 12)
      );
      await browser.close();

      expect(shortAddress).to.be.eq(SHORT_ACCOUNT_ADDRESS);
    });
  });
});
