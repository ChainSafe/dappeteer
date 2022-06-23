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
  const [metamask, page] = await dappeteer.bootstrap(puppeteer, { metamaskVersion: 'v10.15.0' });

  // you can change the network if you want
  await metamask.switchNetwork('ropsten');

  // you can import a token
  await metamask.addToken('0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa');

  // go to a dapp and do something that prompts MetaMask to confirm a transaction
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
