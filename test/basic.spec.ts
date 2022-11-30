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
  EXPECTED_LONG_TYPED_DATA_SIGNATURE,
  EXPECTED_SHORT_TYPED_DATA_SIGNATURE,
} from "./constant";
import {
  addNetwork,
  addToken,
  requestAccounts,
  sign,
  signLongTypedData,
  signShortTypedData,
} from "./testPageFunctions";

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
    expect(sig).to.be.equal(EXPECTED_LONG_TYPED_DATA_SIGNATURE);
  });

  it("should be able to sign short typed data", async () => {
    const sigPromise = testPage.evaluate(signShortTypedData, {
      address: ACCOUNT_ADDRESS,
    });
    await metamask.signTypedData();

    const sig = await sigPromise;
    expect(sig).to.be.equal(EXPECTED_SHORT_TYPED_DATA_SIGNATURE);
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
    const addTokenPromise = testPage.evaluate(addToken);
    await metamask.rejectAddToken();
    const res = await addTokenPromise;
    expect(res).to.equal(false);
  });

  it("should add token", async () => {
    const addTokenPromise = testPage.evaluate(addToken);
    await metamask.acceptAddToken();
    const res = await addTokenPromise;
    expect(res).to.equal(true);
  });

  it("should not add network", async () => {
    const addNetworkPromise = testPage.evaluate(addNetwork);
    await metamask.rejectAddNetwork();
    const res = await addNetworkPromise;
    expect(res).to.equal(false);
  });

  it("should add network and switch", async () => {
    const addNetworkPromise = testPage.evaluate(addNetwork);
    await metamask.acceptAddNetwork();
    const res = await addNetworkPromise;
    expect(res).to.equal(true);
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
    const pageTitle = await metamask.page.waitForSelector(
      ".unlock-page__title"
    );
    expect(pageTitle).to.not.be.undefined;

    await metamask.unlock(PASSWORD);
    const accountSwitcher = await metamask.page.waitForSelector(
      ".account-menu__icon",
      {
        visible: true,
      }
    );
    expect(accountSwitcher).to.not.be.undefined;
  });
});
