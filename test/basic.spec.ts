import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import * as dappeteer from "../src";
import { clickOnLogo, profileDropdownClick } from "../src/helpers";
import { DappeteerPage } from "../src";
import {
  ACCOUNT_ADDRESS,
  EXAMPLE_WEBSITE,
  EXPECTED_LONG_TYPED_DATA_SIGNATURE,
  EXPECTED_MESSAGE_SIGNATURE,
  EXPECTED_SHORT_TYPED_DATA_SIGNATURE,
  MESSAGE_TO_SIGN,
  PASSWORD,
  TestContext,
} from "./constant";
import {
  addNetwork,
  addToken,
  requestAccounts,
  sign,
  signLongTypedData,
  signShortTypedData,
} from "./testPageFunctions";
import { isUserDataTest } from "./utils/utils";

use(chaiAsPromised);

describe("basic interactions", function () {
  let metaMask: dappeteer.Dappeteer;
  let testPage: DappeteerPage;
  let metaMaskPage: DappeteerPage;

  before(async function (this: TestContext) {
    if (isUserDataTest()) {
      this.skip();
    }

    testPage = await this.browser.newPage();
    await testPage.goto(EXAMPLE_WEBSITE, {
      waitUntil: "networkidle",
    });
    metaMask = this.metaMask;
    metaMaskPage = this.metaMaskPage;
    try {
      const connectionPromise = testPage.evaluate(requestAccounts);
      await metaMask.approve();
      await connectionPromise;
    } catch (e) {
      //ignored
    }
  });

  after(async function () {
    if (testPage) await testPage.close();
  });

  it("should be able to sign", async () => {
    const sigPromise = testPage.evaluate(sign, {
      address: ACCOUNT_ADDRESS,
      message: MESSAGE_TO_SIGN,
    });

    await metaMask.sign();
    const sig = await sigPromise;
    expect(sig).to.be.equal(EXPECTED_MESSAGE_SIGNATURE);
  });

  it("should be able to sign long typed data", async () => {
    const sigPromise = testPage.evaluate(signLongTypedData, {
      address: ACCOUNT_ADDRESS,
    });
    await metaMask.signTypedData();

    const sig = await sigPromise;
    expect(sig).to.be.equal(EXPECTED_LONG_TYPED_DATA_SIGNATURE);
  });

  it("should be able to sign short typed data", async () => {
    const sigPromise = testPage.evaluate(signShortTypedData, {
      address: ACCOUNT_ADDRESS,
    });
    await metaMask.signTypedData();

    const sig = await sigPromise;
    expect(sig).to.be.equal(EXPECTED_SHORT_TYPED_DATA_SIGNATURE);
  });

  it("should return 0 token balance when token not found", async () => {
    const tokenBalance: number = await metaMask.helpers.getTokenBalance(
      "FARTBUCKS"
    );
    expect(tokenBalance).to.be.equal(0);
  });

  it("should not add token", async () => {
    const addTokenPromise = testPage.evaluate(addToken);
    await metaMask.rejectAddToken();
    const res = await addTokenPromise;
    expect(res).to.equal(false);
  });

  it("should add token", async () => {
    const addTokenPromise = testPage.evaluate(addToken);
    await metaMask.acceptAddToken();
    const res = await addTokenPromise;
    expect(res).to.equal(true);
  });

  it("should not add network", async function (this: TestContext) {
    const addNetworkPromise = testPage.evaluate(addNetwork);
    await metaMask.rejectAddNetwork();
    const res = await addNetworkPromise;
    expect(res).to.equal(false);
  });

  it("should add network and switch", async function (this: TestContext) {
    const addNetworkPromise = testPage.evaluate(addNetwork);
    await metaMask.acceptAddNetwork();
    const res = await addNetworkPromise;
    expect(res).to.equal(true);
  });

  it("should switch network", async () => {
    await metaMask.switchNetwork("localhost");

    const selectedNetwork = await metaMaskPage.evaluate(() => {
      const pickerNetwork: HTMLElement =
        document.querySelector(".mm-picker-network");
      return pickerNetwork.innerText;
    });

    expect(selectedNetwork).to.contain("Localhost 8545");
  });

  it("should return eth balance", async () => {
    await metaMask.switchNetwork("localhost");
    const tokenBalance: number = await metaMask.helpers.getTokenBalance("ETH");
    expect(tokenBalance).to.be.greaterThan(0);
    await metaMask.switchNetwork("mainnet");
  });

  it("should import private key", async () => {
    const countAccounts = async (): Promise<number> => {
      await profileDropdownClick(metaMaskPage);
      const container = await metaMaskPage.$(
        ".multichain-account-menu-popover__list"
      );
      const count = (await container.$$(".multichain-account-list-item"))
        .length;

      await profileDropdownClick(metaMaskPage);
      return count;
    };

    const beforeImport = await countAccounts();
    await metaMask.importPK(
      "4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b10"
    );
    const afterImport = await countAccounts();

    expect(beforeImport + 1).to.be.equal(afterImport);
    await metaMask.helpers.deleteAccount(2);
  });

  it("should throw error on wrong key", async () => {
    await expect(
      metaMask.importPK(
        "4f3edf983ac636a65a$@!ce7c78d9aa706d3b113bce9c46f30d7d21715b23b10"
      )
    ).to.be.rejectedWith(SyntaxError);
  });

  it("should lock and unlock", async () => {
    await metaMask.lock();
    const pageTitle = await metaMaskPage.waitForSelector(".unlock-page__title");
    expect(pageTitle).to.not.be.undefined;

    await metaMask.unlock(PASSWORD);
    const accountSwitcher = await metaMaskPage.waitForSelector(
      `[data-testid="account-menu-icon"]`,
      {
        visible: true,
      }
    );
    expect(accountSwitcher).to.not.be.undefined;
  });

  it("should create an account and switch back to the default", async () => {
    await metaMask.createAccount("Account 2");
    await metaMask.switchAccount(1);

    await profileDropdownClick(metaMaskPage);
    await metaMaskPage.waitForSelector(
      ".multichain-account-list-item__selected-indicator",
      { visible: true }
    );
    const firstAccountSelected = await metaMaskPage.evaluate(() => {
      return !!document.querySelector(
        ".multichain-account-menu-popover__list .multichain-account-list-item:nth-child(1) .multichain-account-list-item__selected-indicator"
      );
    });
    const secondAccountSelected = await metaMaskPage.evaluate(() => {
      return !!document.querySelector(
        ".multichain-account-menu-popover__list .multichain-account-list-item:nth-child(2) .multichain-account-list-item__selected-indicator"
      );
    });
    expect(
      (await metaMaskPage.$$(".multichain-account-list-item")).length
    ).to.eq(2);
    expect(firstAccountSelected).to.be.true;
    expect(secondAccountSelected).to.be.false;
    await clickOnLogo(metaMaskPage);
  });
});
