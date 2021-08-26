# dAppeteer

E2E testing for dApps using Puppeteer + MetaMask

## Installation

```
$ npm install -s @chainsafe/dappeteer
$ yarn add @chainsafe/dappeteer
```

## Usage

```js
import puppeteer from 'puppeteer';
import dappeteer from '@chainsafe/dappeteer';

async function main() {
  const browser = await dappeteer.launch(puppeteer);
  const metamask = await dappeteer.setupMetamask(browser);

  // you can change the network if you want
  await metamask.switchNetwork('ropsten');

  // go to a dapp and do something that prompts MetaMask to confirm a transaction
  const page = await browser.newPage();
  await page.goto('http://my-dapp.com');
  const payButton = await page.$('#pay-with-eth');
  await payButton.click();

  // 🏌
  await metamask.confirmTransaction();
}

main();
```

## API

- `dappeteer.launch(puppeteer[, launchOptions])`: returns an instance of `browser`, same as `puppeteer.launch`, but it also installs the MetaMask extension. It supports all the regular `puppeteer.launch` options as a second argument with the addition of:

  - `metamaskVersion`: Metamask plugin version (by default it uses latest)

- `dappeteer.setupMetamask(browser[, {seed, password}])`: returns a promise that resolves to an object that allows you to interact with MetaMask by using the following methods:

  - `metamask.switchAccount(accountIndex)`: it commands MetaMask to switch to a different account, by passing the index/position of the account in the accounts list.

  - `metamask.importPK(privateKey)`: it commands MetaMask to import an private key. It can only be used while you haven't signed in yet, otherwise it throws.

  - `metamask.lock()`: signs out from MetaMask. It can only be used if you arelady signed it, otherwise it throws.

  - `metamask.unlock([password])`: it unlocks the MetaMask extension. It can only be used in you locked/signed out before, otherwise it throws. The password is optional, it defaults to `password1234`.

  - `metamask.switchNetwork(networkName)`: it changes the current selected network. `networkName` can take the following values: `"main"`, `"ropsten"`, `"rinkeby"`, `"kovan"`, `"localhost"`.

  - `metamask.addNetwork({ networkName, rpc, chainId[, symbol, explorer]})`: it adds a custom network to MetaMask.

  - `metamask.confirmTransaction([{ gas, gasLimit }])`: commands MetaMask to submit a transaction. For this to work MetaMask has to be in a transaction confirmation state (basically promting the user to submit/reject a transaction). You can (optionally) pass an object with `gas` and/or `gasLimit`, by default they are `20` and `50000` respectively.

  - `metamask.sign()`: commands MetaMask to sign a message. For this to work MetaMask must be in a sign confirmation state.
  
  - `metamask.approve()`: enables the app to connect to MetaMask account in privacy mode
