import * as puppeteer from 'puppeteer'
import * as assert from 'assert'

import * as dappeteer from '../src/index'
import deploy from './deploy'

function pause(seconds: number): Promise<void> {
  return new Promise(res => setTimeout(res, 1000 * seconds))
}

function getCounterNumber(contract) {
  return contract.methods
    .count()
    .call()
    .then(res => {
      return Number(res)
    })
}

async function clickElement(page, selector) {
  await page.bringToFront()
  await page.waitForSelector(selector)
  const element = await page.$(selector)
  await element.click()
}

let testContract, browser, metamask, testPage

before(async () => {
  testContract = await deploy()
  browser = await dappeteer.launch(puppeteer)
  metamask = await dappeteer.getMetamask(browser, {
    // optional, else it will use a default seed
    seed: 'pioneer casual canoe gorilla embrace width fiction bounce spy exhibit another dog'
  })
  testPage = await browser.newPage()
  await testPage.goto('localhost:8080')
})

describe('dappeteer', () => {
  it('should be deployed, contract', async () => {
    assert.ok(testContract)
    assert.ok(testContract.options.address)
  })

  it('should running, puppeteer', async () => {
    assert.ok(browser)
  })

  it('should open, metamask', async () => {
    assert.ok(metamask)
  })

  it('should open, test page', async () => {
    assert.ok(testPage)
    assert.equal(await testPage.title(), 'Local metamask test')
  })

  it('should switch network, localhost', async () => {
    await metamask.switchNetwork('localhost')
  })

  describe('test contract', async () => {
    let counterBefore

    before(async () => {
      counterBefore = await getCounterNumber(testContract)
    })

    it('should confirm transaction', async () => {
      // click increase button
      await clickElement(testPage, '.increase-button')

      // submit tx
      await metamask.confirmTransaction()
    })

    it('should have increased count', async () => {
      // wait half a seconds just in case
      await pause(0.5)

      const counterAfter = await getCounterNumber(testContract)

      assert.equal(
        counterAfter,
        counterBefore + 1,
        `Counter does not match BEFORE: ${counterBefore} AFTER: ${counterAfter}`
      )
    })
  })

  it('should change gas values', async () => {
    // click increase button
    await clickElement(testPage, '.increase-button')

    // submit tx
    await metamask.confirmTransaction({
      gas: 20,
      gasLimit: 400000
    })
  })

  after(async () => {
    // close browser
    await browser.close()
  })
})
