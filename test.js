const puppeteer = require('puppeteer')
const dappeteer = require('./index')

async function main() {
  const browser = await dappeteer.launch(puppeteer)
  const metamask = await dappeteer.getMetamask(browser)

  // import MetaMask account
  await metamask.importAccount(
    'myth like bonus scare over problem client lizard pioneer submit female collect'
  )

  // switch to Ropsten
  await metamask.switchNetwork('ropsten')

  // open decentraland marketplace settings
  const marketplace = await browser.newPage()
  await marketplace.goto('https://market.decentraland.org/settings')

  // click "agree" on ToS
  await marketplace.waitForSelector('.get-started button.primary')
  const agreeButton = await marketplace.$('.get-started button.primary')
  await agreeButton.click()

  // Authorize marketplace contract
  await marketplace.waitForSelector('input[type="checkbox"]')
  const checkbox = (await marketplace.$$('input[type="checkbox"]'))[0]
  await checkbox.click()

  // submit tx
  await metamask.confirmTransaction()

  // wait for tx to start
  await marketplace.bringToFront()
  await marketplace.waitForSelector('.TxStatusText')

  // wait for tx to be mined
  await marketplace.waitFor(
    () => document.querySelector('.TxStatusText') == null,
    {
      timeout: 180000
    }
  )

  // close browser
  await browser.close()
}

main() // 🏌🏼‍
