import { readdir } from 'fs/promises';
import path from 'path';

import { expect, use as chaiUse } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import puppeteer from 'puppeteer';

import { Dappeteer, RECOMMENDED_METAMASK_VERSION } from '../src';
import { clickOnLogo, openProfileDropdown } from '../src/helpers';
import * as dappeteer from '../src/index';

import deploy from './deploy';

chaiUse(chaiAsPromised);

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

let testContract, browser, metamask: Dappeteer, testPage;

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

  describe('test addNetwork method', async () => {
    after(async () => {
      await metamask.switchNetwork('local');
      await metamask.helpers.deleteNetwork('Binance Smart Chain');
      await pause(0.5);
      await metamask.helpers.deleteNetwork('Optimistic Ethereum Testnet Kovan');
      await pause(0.5);
      await metamask.helpers.deleteNetwork('KCC Testnet');
      await pause(0.5);
    });

    it('should add network with required params and symbol and explorer', async () => {
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
      expect(selectedNetwork).to.be.equal('Binance Smart Chain');
    });

    it('should fail to add already added network', async () => {
      await expect(
        metamask.addNetwork({
          networkName: 'Binance Smart Chain',
          rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
          chainId: 97,
          symbol: 'BNB',
          explorer: 'https://testnet.bscscan.com',
        }),
      ).to.be.rejectedWith(SyntaxError);

      await clickOnLogo(metamask.page);
    });

    it('should fail to add network with wrong chain ID', async () => {
      await expect(
        metamask.addNetwork({
          networkName: 'Optimistic Ethereum Testnet Kovan',
          rpc: 'https://kovan.optimism.io/',
          chainId: 420,
          explorer: 'https://kovan-optimistic.etherscan.io',
        }),
      ).to.be.rejectedWith(SyntaxError);

      await clickOnLogo(metamask.page);
    });

    it('should add network with explorer', async () => {
      await metamask.addNetwork({
        networkName: 'Optimistic Ethereum Testnet Kovan',
        rpc: 'https://kovan.optimism.io/',
        chainId: 69,
        explorer: 'https://kovan-optimistic.etherscan.io',
      });

      const selectedNetwork = await metamask.page.evaluate(
        () => (document.querySelector('.network-display > span:nth-child(2)') as HTMLSpanElement).innerHTML,
      );
      expect(selectedNetwork).to.be.equal('Optimistic Ethereum Testnet Kovan');
    });

    it('should add network with symbol', async () => {
      await metamask.addNetwork({
        networkName: 'KCC Testnet',
        rpc: 'https://rpc-testnet.kcc.network',
        chainId: 322,
        symbol: 'fejk',
      });

      const selectedNetwork = await metamask.page.evaluate(
        () => (document.querySelector('.network-display > span:nth-child(2)') as HTMLSpanElement).innerHTML,
      );
      expect(selectedNetwork).to.be.equal('KCC Testnet');
    });
  });

  it('should switch network, localhost', async () => {
    await metamask.switchNetwork('localhost');

    const selectedNetwork = await metamask.page.evaluate(
      () => (document.querySelector('.network-display > span:nth-child(2)') as HTMLSpanElement).innerHTML,
    );
    expect(selectedNetwork).to.be.equal('Localhost 8545');
  });

  describe('test importPK method', async () => {
    afterEach(async () => {
      await clickOnLogo(metamask.page);
    });

    after(async () => {
      await metamask.helpers.deleteAccount(2);
      await pause(0.5);
    });

    it('should import private key', async () => {
      const countAccounts = async (): Promise<number> => {
        await openProfileDropdown(metamask.page);
        const container = await metamask.page.$('.account-menu__accounts');
        const count = (await container.$$('.account-menu__account')).length;
        await openProfileDropdown(metamask.page);
        return count;
      };

      const beforeImport = await countAccounts();
      await metamask.importPK('4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b10');
      const afterImport = await countAccounts();

      expect(beforeImport + 1).to.be.equal(afterImport);
    });

    it('should throw error on duplicated private key', async () => {
      await expect(
        metamask.importPK('4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b10'),
      ).to.be.rejectedWith(SyntaxError);
    });

    it('should throw error on wrong key', async () => {
      await expect(
        metamask.importPK('4f3edf983ac636a65a$@!ce7c78d9aa706d3b113bce9c46f30d7d21715b23b10'),
      ).to.be.rejectedWith(SyntaxError);
    });

    it('should throw error on to short key', async () => {
      await expect(
        metamask.importPK('4f3edf983ac636a65ace7c78d9aa706d3b113bce9c46f30d7d21715b23b10'),
      ).to.be.rejectedWith(SyntaxError);
    });
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
