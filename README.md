# dAppeteer

E2E testing for dApps using Puppeteer + MetaMask

## Installation

```
$ npm install -s dappeteer
```

## Usage

```js
import puppeteer from 'puppeteer'
import dappeteer from 'dappeteer'

async function main() {
  const browser = dappeteer.launch(puppeteer)
  const metamask = await dappeteer.getMetamask(browser)
  
  // create or import an account
  // await metamask.createAccount()
  await metamask.importAccount('already turtle birth enroll since...')
  
  // you can change the network if you want
  await metamask.switchNetwork('ropsten')
  
  // go to a dapp and do something that prompts MetaMask to confirm a transaction
  const page = await browser.newPage()
  await page.goto('http://my-dapp.com')
  await page.$('#pay-with-eth').click()
  
  // 🏌
  await metamask.confirmTransaction()
}

main()
```

## API

- `dappeteer.launch(puppeteer[, launchOptions])`: returns an instance of `browser`, same as `puppeteer.launch`, but it also installs the MetaMask extension. It supports all the regular `puppeteer.launch` options as a second argument with the addition of two extra ones:

  - `metamaskPath`: Path to the MetaMask extension (by default it uses the one bundled)

  - `extensionUrl`: URL of the MetaMask extension, by default it is `chrome-extension://lplkikplmecagihcgjcjpnmndcjgkihb/popup.html` but if you use a different version you might need to change use the right extension id.

- `dappeteer.getMetaMask(browser)`: returns a promise that resolves to an object that allows you to interact with MetaMask by using the following methods:

  - `metamask.createAccount([password])`: it commands MetaMask to create a new account, it resolves when it's done. It can only be used while you haven't signed in yet, otherwise it throws. The password is optional, it defaults to `password1234`.

  - `metamask.importAccount(seed[, password])`: it commands MetaMask to import an account, you need to provide the twelve words seed, it resolves when it's done. It can only be used while you haven't signed in yet, otherwise it throws. The password is optional, it defaults to `password1234`.

  - `metamask.lock()`: signs out from MetaMask. It can only be used if you arelady signed it, otherwise it throws.

  - `metamask.unlock([password])`: it unlocks the MetaMask extension. It can only be used it you locked/signed out before, otherwise it throws. The password is optional, it defaults to `password1234`.

  - `metamask.switchNetwork(networkName)`: it changes the current selected network. `networkName` can take the following values: `"main"`, `"ropsten"`, `"rinkeby"`, `"kovan"`, `"localhost"`.

  - `metamask.confirmTransaction([{ gas, gasLimit }])`: commands MetaMask to submit a transaction. For this to work MetaMask has to be in a transaction confirmation state (basically promting the user to submit/reject a transaction). You can (optionally) pass an object with `gas` and/or `gasLimit`, buy default they are `20` and `50000` respectively.
