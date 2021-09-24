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
  const browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.1.1' });
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

- All methods can be found on [API page](docs/API.md)  
- Instructions to setup [dAppeteer with Jest](docs/JEST.md)  
- Mocha example can be found [inside test folder](./test)
