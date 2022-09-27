import {writeFileSync} from "fs";
import path from "path";

import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Page } from 'puppeteer';

import * as dappeteer from '../src';
import { clickOnButton, clickOnLogo, openProfileDropdown } from '../src/helpers';

import { PASSWORD, TestContext } from './global';
import { clickElement } from './utils/utils';

use(chaiAsPromised);

describe('basic interactions', async function () {
  let metamask: dappeteer.Dappeteer;
  let testPage: Page;

  before(async function (this: TestContext) {
    testPage = await this.browser.newPage();
    await testPage.goto('http://localhost:8080/', { waitUntil: 'load' });
    metamask = this.metamask;
    try {
      await clickElement(testPage, '.connect-button');
      await metamask.approve();
    } catch (e) {
      //ignored
    }
  });

  after(async function () {
    await testPage.close();
  });

  it('should be able to sign', async () => {
    writeFileSync(
      path.resolve(__dirname, `../test_page.png`),
      await testPage.screenshot({ encoding: 'binary', fullPage: true }),
    );
    await clickElement(testPage, '.sign_button');
    await metamask.sign();

    await testPage.waitForSelector('#signed');
  });

  it('should switch network', async () => {
    await metamask.switchNetwork('localhost');

    const selectedNetwork = await metamask.page.evaluate(
      () => (document.querySelector('.network-display > span:nth-child(2)') as HTMLSpanElement).innerHTML,
    );
    expect(selectedNetwork).to.be.equal('Localhost 8545');
  });

  it('should return eth balance', async () => {
    await metamask.switchNetwork('localhost');
    const tokenBalance: number = await metamask.helpers.getTokenBalance('ETH');
    expect(tokenBalance).to.be.greaterThan(0);
  });

  it('should return 0 token balance when token not found', async () => {
    const tokenBalance: number = await metamask.helpers.getTokenBalance('FARTBUCKS');
    expect(tokenBalance).to.be.equal(0);
  });

  // TODO: cover more cases
  it('should add token', async () => {
    await metamask.switchNetwork('kovan');
    await metamask.addToken({
      tokenAddress: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
      symbol: 'KAKI',
    });
    await metamask.switchNetwork('local');
  });

  it('should add network with required params', async () => {
    await metamask.addNetwork({
      networkName: 'Binance Smart Chain',
      rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      chainId: 97,
      symbol: 'BNB',
    });

    const selectedNetwork = await metamask.page.evaluate(
      () => (document.querySelector('.network-display > span:nth-child(2)') as HTMLSpanElement).innerHTML,
    );
    expect(selectedNetwork).to.be.equal('Binance Smart Chain');
    await metamask.switchNetwork('local');
  });

  it('should fail to add network with wrong chain ID', async () => {
    await expect(
      metamask.addNetwork({
        networkName: 'Optimistic Ethereum Testnet Kovan',
        rpc: 'https://kovan.optimism.io/',
        chainId: 420,
        symbol: 'KUR',
      }),
    ).to.be.rejectedWith(SyntaxError);

    await clickOnLogo(metamask.page);
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
    await metamask.helpers.deleteAccount(2);
  });

  it('should throw error on wrong key', async () => {
    await expect(
      metamask.importPK('4f3edf983ac636a65a$@!ce7c78d9aa706d3b113bce9c46f30d7d21715b23b10'),
    ).to.be.rejectedWith(SyntaxError);
  });

  it('should lock and unlock', async () => {
    await metamask.lock();
    await metamask.unlock(PASSWORD);
  });
});
