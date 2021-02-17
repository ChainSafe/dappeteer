import * as assert from 'assert'

import puppeteer from 'puppeteer'

import * as dappeteer from '../src/index'

import deploy from './deploy'

function pause(seconds: number): Promise<void> {
  return new Promise(res => setTimeout(res, 1000 * seconds))
}

function getCounterNumber(contract): Promise<number> {
  return contract.methods
    .count()
    .call()
    .then(res => {
      return Number(res)
    })
}

async function clickElement(page, selector): Promise<void> {
  await page.bringToFront()
  await page.waitForSelector(selector)
  const element = await page.$(selector)
  await element.click()
}

let TestContract, Browser, Metamask, TestPage

describe('dappeteer', () => {

  before(async () => {
    TestContract = await deploy();
    Browser = await dappeteer.launch(puppeteer);
    await dappeteer.prepareMetamask(Browser, {
      // optional, else it will use a default seed
      seed: 'pioneer casual canoe gorilla embrace width fiction bounce spy exhibit another dog',
      password: 'password1234'
    });
    Metamask = await dappeteer.getMetamask(Browser);
    TestPage = await Browser.newPage();
    await TestPage.goto('localhost:8080')
  })

  it('should be deployed, contract', async () => {
    assert.ok(TestContract)
    assert.ok(TestContract.address)
    assert.ok(TestContract.options.address)
  })

  it('should running, puppeteer', async () => {
    assert.ok(Browser)
  })

  it('should open, metamask', async () => {
    assert.ok(Metamask)
  })

  it('should open, test page', async () => {
    assert.ok(TestPage)
    assert.equal(await TestPage.title(), 'Local metamask test')
  })

  it('should switch network, localhost', async () => {
    await Metamask.switchNetwork('localhost')
  })

  it('should import private key', async () => {
    await Metamask.importPK('4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b10')
  })

  it('should switch accounts', async () => {
    await Metamask.switchAccount(1)
  })

  it('should lock and unlock', async () => {
    await Metamask.lock()
    await Metamask.unlock('password1234')
  })

  it("should connect to ethereum", async () => {
    await clickElement(TestPage, ".connect-button");
    await Metamask.approve();

    // For some reason initial approve does not resolve nor fail promise
    await clickElement(TestPage, ".connect-button");
    await TestPage.waitForSelector("#connected");
  });

  it("should be able to sign", async () => {
    await clickElement(TestPage, ".sign-button");
    await Metamask.sign();

    await TestPage.waitForSelector("#signed");
  });

  describe('test contract', async () => {
    let counterBefore

    before(async () => {
      counterBefore = await getCounterNumber(TestContract)
    })

    it('should confirm transaction', async () => {
      // click increase button
      await clickElement(TestPage, '.increase-button')

      // submit tx
      await Metamask.confirmTransaction()
      await TestPage.waitForSelector("#txSent");
    })

    it('should have increased count', async () => {
      // wait half a seconds just in case
      await pause(1)

      const counterAfter = await getCounterNumber(TestContract)

      assert.equal(
        counterAfter,
        counterBefore + 1,
        `Counter does not match BEFORE: ${counterBefore} AFTER: ${counterAfter}`
      )
    })
  })

  it('should change gas values', async () => {
    // click increase button
    await clickElement(TestPage, '.increase-button')

    // submit tx
    await Promise.all([
      TestPage.waitForSelector("#txSent"),
      Metamask.confirmTransaction({
        gas: 20,
        gasLimit: 400000
      }),
    ])
  })

  after(async () => {
    // close browser
    await Browser.close()
  })
})
