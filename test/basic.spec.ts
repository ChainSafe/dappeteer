import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";

import * as dappeteer from "../src";
import { profileDropdownClick } from "../src/helpers";
import { DappeteerPage } from "../src/page";

import {
  PASSWORD,
  TestContext,
  EXPECTED_MESSAGE_SIGNATURE,
  ACCOUNT_ADDRESS,
  MESSAGE_TO_SIGN,
} from "./constant";
import { clickElement } from "./utils/utils";
import { requestAccounts, sign, signLongTypedData } from "./testPageFunctions";

use(chaiAsPromised);

describe("basic interactions", function () {
  let metamask: dappeteer.Dappeteer;
  let testPage: DappeteerPage;

  before(async function (this: TestContext) {
    testPage = await this.browser.newPage();
    await testPage.goto("http://localhost:8080/", {
      waitUntil: "networkidle",
    });
    metamask = this.metamask;
    try {
      const connectionPromise = testPage.evaluate(requestAccounts);
      await metamask.approve();
      await connectionPromise;
    } catch (e) {
      //ignored
    }
  });

  after(async function () {
    await testPage.close();
  });

  it("should be able to sign", async () => {
    const sigPromise = testPage.evaluate(sign, {
      address: ACCOUNT_ADDRESS,
      message: MESSAGE_TO_SIGN,
    });

    await metamask.sign();
    const sig = await sigPromise;
    expect(sig).to.be.equal(EXPECTED_MESSAGE_SIGNATURE);
  });

  it("should be able to sign long typed data", async () => {
    const sigPromise = testPage.evaluate(signLongTypedData, {
      address: ACCOUNT_ADDRESS,
    });
    await metamask.signTypedData();

    const sig = await sigPromise;
    expect(sig).to.be.equal(EXPECTED_MESSAGE_SIGNATURE);
  });

  it("should be able to sign short typed data", async () => {
    await clickElement(testPage, ".sign-short-typedData-button");

    await metamask.signTypedData();

    await testPage.waitForSelector("#signed-short-typedData", {
      visible: false,
    });
  });

  it("should switch network", async () => {
    await metamask.switchNetwork("localhost");

    const selectedNetwork = await metamask.page.evaluate(
      () =>
        document.querySelector(".network-display > span:nth-child(2)").innerHTML
    );
    expect(selectedNetwork).to.be.equal("Localhost 8545");
  });

  it("should return eth balance", async () => {
    await metamask.switchNetwork("localhost");
    const tokenBalance: number = await metamask.helpers.getTokenBalance("ETH");
    expect(tokenBalance).to.be.greaterThan(0);
    await metamask.switchNetwork("mainnet");
  });

  it("should return 0 token balance when token not found", async () => {
    const tokenBalance: number = await metamask.helpers.getTokenBalance(
      "FARTBUCKS"
    );
    expect(tokenBalance).to.be.equal(0);
  });

  it("should not add token", async () => {
    await clickElement(testPage, ".add-token-button");
    await metamask.rejectAddToken();
    await testPage.waitForSelector("#addTokenResultFail");
  });

  it("should add token", async () => {
    await clickElement(testPage, ".add-token-button");
    await metamask.acceptAddToken();
    await testPage.waitForSelector("#addTokenResultSuccess");
  });

  it("should not add network", async () => {
    await clickElement(testPage, ".add-network-button");
    await metamask.page.waitForTimeout(500);
    await metamask.rejectAddNetwork();
    await testPage.waitForSelector("#addNetworkResultFail");
  });

  it("should add network and switch", async () => {
    await clickElement(testPage, ".add-network-button");
    await metamask.page.waitForTimeout(1000);
    await metamask.acceptAddNetwork(true);
    await testPage.waitForSelector("#addNetworkResultSuccess");
  });

  it("should import private key", async () => {
    const countAccounts = async (): Promise<number> => {
      await profileDropdownClick(metamask.page, false);
      const container = await metamask.page.$(".account-menu__accounts");
      const count = (await container.$$(".account-menu__account")).length;
      await profileDropdownClick(metamask.page, true);
      return count;
    };

    const beforeImport = await countAccounts();
    await metamask.importPK(
      "4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b10"
    );
    const afterImport = await countAccounts();

    expect(beforeImport + 1).to.be.equal(afterImport);
    await metamask.helpers.deleteAccount(2);
  });

  it("should throw error on wrong key", async () => {
    await expect(
      metamask.importPK(
        "4f3edf983ac636a65a$@!ce7c78d9aa706d3b113bce9c46f30d7d21715b23b10"
      )
    ).to.be.rejectedWith(SyntaxError);
  });

  it("should lock and unlock", async () => {
    await metamask.lock();
    await metamask.unlock(PASSWORD);
  });
});
