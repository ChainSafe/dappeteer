import { expect } from "chai";

import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { Dappeteer, DappeteerPage } from "../src";

import { ACCOUNT_ADDRESS, EXAMPLE_WEBSITE, TestContext } from "./constant";
import { ContractInfo } from "./contract/contractInfo";
import { TestContract } from "./deploy";

import { requestAccounts, sendTx } from "./testPageFunctions";
import { isUserDataTest } from "./utils/utils";

describe("contract interactions", function () {
  let contract: TestContract;
  let testPage: DappeteerPage;
  let metamask: Dappeteer;

  before(async function (this: TestContext) {
    if (isUserDataTest()) {
      this.skip();
    }

    testPage = await this.browser.newPage();
    await testPage.goto(EXAMPLE_WEBSITE, { waitUntil: "networkidle" });
    metamask = this.metaMask;
    contract = this.contract;
    try {
      const connectionPromise = testPage.evaluate(requestAccounts);
      await metamask.approve();
      await connectionPromise;
    } catch (e) {
      //ignored
    }
    await metamask.switchAccount(1);
    await metamask.switchNetwork("localhost");
  });

  after(async function (this: TestContext) {
    if (testPage) await testPage.close();
  });

  it("should have increased count", async () => {
    const web3Instance = new Web3();
    const counterContract: TestContract = new Contract(
      ContractInfo.abi,
      web3Instance
    );

    const contractData = counterContract.methods.increase().encodeABI();

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

function getCounterNumber(contract: TestContract): Promise<number> {
  return contract.methods
    .count()
    .call()
    .then((res) => {
      return Number(res);
    });
}
