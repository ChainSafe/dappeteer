import * as assert from 'assert';

import puppeteer from 'puppeteer';

import * as dappeteer from '../src/index';

import deploy from './deploy';

function pause(seconds: number): Promise<void> {
  return new Promise((res) => setTimeout(res, 1000 * seconds));
}

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

let testContract, browser, metamask, testPage;

describe('dappeteer', () => {
  before(async () => {
    testContract = await deploy();
    browser = await dappeteer.launch(puppeteer);
    metamask = await dappeteer.setupMetamask(browser, {
      // optional, else it will use a default seed
      seed: 'pioneer casual canoe gorilla embrace width fiction bounce spy exhibit another dog',
      password: 'password1234',
    });
    testPage = await browser.newPage();
    await testPage.goto('localhost:8080');
  });

  it('should be deployed, contract', async () => {
    assert.ok(testContract);
    assert.ok(testContract.address);
    assert.ok(testContract.options.address);
  });

  it('should running, puppeteer', async () => {
    assert.ok(browser);
  });

  it('should open, metamask', async () => {
    assert.ok(metamask);
  });

  it('should open, test page', async () => {
    assert.ok(testPage);
    assert.equal(await testPage.title(), 'Local metamask test');
  });

  it('should add network', async () => {
    await metamask.addNetwork({
      networkName: 'Binance Smart Chain',
      rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      chainId: 97,
      symbol: 'BNB',
      explorer: 'https://testnet.bscscan.com',
    });

    const selectedNetwork = await metamask.page.evaluate(
      () => (document.querySelector('.network-display > span:nth-child(2)') as HTMLSpanElement).innerHTML,
    );
    assert.equal(selectedNetwork, 'Binance Smart Chain');
  });

  it('should switch network, localhost', async () => {
    await metamask.switchNetwork('localhost');

    const selectedNetwork = await metamask.page.evaluate(
      () => (document.querySelector('.network-display > span:nth-child(2)') as HTMLSpanElement).innerHTML,
    );
    assert.equal(selectedNetwork, 'Localhost 8545');
  });

  it('should import private key', async () => {
    await metamask.importPK('4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b10');
  });

  it('should switch accounts', async () => {
    await metamask.switchAccount(1);
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

  describe('test contract', async () => {
    let counterBefore;

    before(async () => {
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

      assert.equal(
        counterAfter,
        counterBefore + 1,
        `Counter does not match BEFORE: ${counterBefore} AFTER: ${counterAfter}`,
      );
    });
  });

  it('should change gas values', async () => {
    // click increase button
    await clickElement(testPage, '.increase-button');

    // submit tx
    await Promise.all([
      testPage.waitForSelector('#txSent'),
      metamask.confirmTransaction({
        gas: 20,
        gasLimit: 400000,
      }),
    ]);
  });

  after(async () => {
    // close browser
    await browser.close();
  });
});
