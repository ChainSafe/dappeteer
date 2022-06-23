import { readdir } from 'fs/promises';
import path from 'path';

import { expect, use as chaiUse } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import puppeteer from 'puppeteer';

import { Dappeteer, RECOMMENDED_METAMASK_VERSION } from '../src';
import * as dappeteer from '../src/index';

import deploy from './deploy';
import { addNetworkTests } from './tests/addNetwork';
import { importPKTests } from './tests/importPK';
import { pause } from './utils';

chaiUse(chaiAsPromised);

function getCounterNumber(contract): Promise<number> {
  return contract.methods
    .count()
    .call()
    .then((res) => {
      return Number(res);
    });
}

async function clickElement(page, selector): Promise<void> {
  await page.bringToFront();
  await page.waitForSelector(selector);
  const element = await page.$(selector);
  await element.click();
}

export let testContract, browser, metamask: Dappeteer, testPage;

describe('dappeteer', () => {
  before(async () => {
    testContract = await deploy();
    browser = await dappeteer.launch(puppeteer, {
      metamaskVersion: process.env.METAMASK_VERSION || RECOMMENDED_METAMASK_VERSION,
    });
    metamask = await dappeteer.setupMetamask(browser, {
      // optional, else it will use a default seed
      seed: 'pioneer casual canoe gorilla embrace width fiction bounce spy exhibit another dog',
      password: 'password1234',
    });
    testPage = await browser.newPage();
    await testPage.goto('http://localhost:8080/');

    // output version
    const directory = path.resolve(__dirname, '..', 'metamask');
    const files = await readdir(directory);
    console.log(`::set-output name=version::${files.pop().replace(/_/g, '.')}`);
  });

  // validate dappateer setup
  it('should be deployed, contract', async () => {
    expect(testContract).to.be.ok;
    expect(testContract.address).to.be.ok;
    expect(testContract.options.address).to.be.ok;
  });

  it('should running, puppeteer', async () => {
    expect(browser).to.be.ok;
  });

  it('should open, metamask', async () => {
    expect(metamask).to.be.ok;
  });

  it('should open, test page', async () => {
    expect(testPage).to.be.ok;
    expect(await testPage.title()).to.be.equal('Local metamask test');
  });

  describe('test addNetwork method', addNetworkTests.bind(this));
  describe('test importPK method', importPKTests.bind(this));

  // TODO: add more cases
  it('should switch network, localhost', async () => {
    await metamask.switchNetwork('localhost');

    const selectedNetwork = await metamask.page.evaluate(
      () => (document.querySelector('.network-display > span:nth-child(2)') as HTMLSpanElement).innerHTML,
    );
    expect(selectedNetwork).to.be.equal('Localhost 8545');
  });

  describe('test switchAccount method', async () => {
    before(async () => {
      await metamask.importPK('4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b10');
    });

    after(async () => {
      await metamask.helpers.deleteAccount(2);
      await pause(0.5);
    });

    it('should switch accounts', async () => {
      await metamask.switchAccount(1);
    });
  });

  // TODO: cover more cases
  it('should add token', async () => {
    await metamask.switchNetwork('kovan');
    await metamask.addToken({
      tokenAddress: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
      symbol: 'KAKI',
    });
    await metamask.switchNetwork('localhost');
  });

  it('should lock and unlock', async () => {
    await metamask.lock();
    await metamask.unlock('password1234');
  });

  it('should connect to ethereum', async () => {
    await clickElement(testPage, '.connect-button');
    await metamask.approve();

    // For some reason initial approve does not resolve nor fail promise
    await clickElement(testPage, '.connect-button');
    await testPage.waitForSelector('#connected');
  });

  it('should be able to sign', async () => {
    await clickElement(testPage, '.sign-button');
    await metamask.sign();

    await testPage.waitForSelector('#signed');
  });

  it('should return token balance', async () => {
    const tokenBalance: number = await metamask.helpers.getTokenBalance('ETH');
    expect(tokenBalance).to.be.greaterThan(0);
  });

  it('should return 0 token balance when token not found', async () => {
    const tokenBalance: number = await metamask.helpers.getTokenBalance('FARTBUCKS');
    expect(tokenBalance).to.be.equal(0);
  });

  describe('test contract', async () => {
    let counterBefore;

    before(async () => {
      await metamask.switchNetwork('local');
      counterBefore = await getCounterNumber(testContract);
    });

    it('should confirm transaction', async () => {
      // click increase button
      await clickElement(testPage, '.increase-button');

      // submit tx
      await metamask.confirmTransaction();
      await testPage.waitForSelector('#txSent');
    });

    it('should have increased count', async () => {
      // wait half a seconds just in case
      await pause(1);

      const counterAfter = await getCounterNumber(testContract);

      expect(counterAfter).to.be.equal(counterBefore + 1);
    });
  });

  describe('test confirmTransaction method', async () => {
    it('should change gas values', async () => {
      // click increase button
      await clickElement(testPage, '.increase-fees-button');

      // submit tx
      await metamask.confirmTransaction({
        gas: 20,
        gasLimit: 400000,
      });
      await testPage.waitForSelector('#feesTxSent');
    });

    it('should change gas priority', async () => {
      await metamask.switchNetwork('goerli');

      // click increase button
      await clickElement(testPage, '.transfer-button');
      await pause(1);

      // submit tx
      await metamask.confirmTransaction({
        gas: 5,
        priority: 4,
        gasLimit: 202020,
      });

      await pause(5);
      await testPage.waitForSelector('#transferred');
    });
  });

  after(async () => {
    // close browser
    await browser.close();
  });
});
