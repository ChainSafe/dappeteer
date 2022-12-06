import { expect } from "chai";

import web3 from "web3";
import { Dappeteer } from "../src";
import { DappeteerPage } from "../src/page";

import { ACCOUNT_ADDRESS, EXAMPLE_WEBSITE, TestContext } from "./constant";
import { ContractInfo } from "./contract/contractInfo";
import { Contract } from "./deploy";
import { requestAccounts, sendTx } from "./testPageFunctions";

describe("contract interactions", function () {
  let contract: Contract;
  let testPage: DappeteerPage;
  let metamask: Dappeteer;

  before(async function (this: TestContext) {
    testPage = await this.browser.newPage();
    await testPage.goto(EXAMPLE_WEBSITE, { waitUntil: "networkidle" });
    metamask = this.metaMask;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    contract = this.contract;
    try {
      const connectionPromise = testPage.evaluate(requestAccounts);
      await metamask.approve();
      await connectionPromise;
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
    const web3Instance = new web3();
    const counterContract = new web3Instance.eth.Contract(ContractInfo.abi);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const contractData = counterContract.methods
      .increase()
      .encodeABI() as string;

    const txToSend = {
      from: ACCOUNT_ADDRESS,
      to: ContractInfo.address,
      data: contractData,
    };

    const increasePromise = testPage.evaluate(sendTx, {
      tx: txToSend,
    });

    const counterBefore = await getCounterNumber(contract);
    await metamask.confirmTransaction();

    const tx = await increasePromise;
    expect(tx).to.not.be.undefined;

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
