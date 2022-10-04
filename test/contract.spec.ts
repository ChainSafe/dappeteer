import { expect } from "chai";
import { Page } from "puppeteer";

import { Dappeteer } from "../src";

import { Contract } from "./deploy";
import { TestContext } from "./global";
import { clickElement, pause } from "./utils/utils";

describe("contract interactions", function () {
  let contract: Contract;
  let testPage: Page;
  let metamask: Dappeteer;

  before(async function (this: TestContext) {
    testPage = await this.browser.newPage();
    await testPage.goto("http://localhost:8080/", { waitUntil: "load" });
    metamask = this.metamask;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    contract = this.contract;
    try {
      await clickElement(testPage, ".connect-button");
      await metamask.approve();
    } catch (e) {
      //ignored
    }
    await metamask.switchAccount(1);
    await metamask.switchNetwork("local");
  });

  after(async function (this: TestContext) {
    await testPage.close();
  });

  it("should have increased count", async () => {
    await pause(1);
    const counterBefore = await getCounterNumber(contract);
    // click increase button
    await clickElement(testPage, ".increase-button");
    await pause(1);
    // submit tx
    await metamask.confirmTransaction();
    await testPage.waitForSelector("#txSent");
    await pause(1);

    const counterAfter = await getCounterNumber(contract);

    expect(counterAfter).to.be.equal(counterBefore + 1);
  });
});

function getCounterNumber(contract): Promise<number> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  return contract.methods
    .count()
    .call()
    .then((res) => {
      return Number(res);
    });
}
