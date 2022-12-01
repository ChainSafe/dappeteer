# dAppeteer

E2E testing for dApps using Puppeteer + MetaMask

## Installation

```
$ npm install -s @chainsafe/dappeteer
$ yarn add @chainsafe/dappeteer
```

## Usage

```js
import D from '@chainsafe/dappeteer';

async function main() {
  const { page, dappeteer } = await D.bootstrap({ metaMaskVersion: 'v10.15.0' });

  // you can change the network if you want
  await dappeteer.switchNetwork('goerli');

  // go to a dapp and do something that prompts MetaMask to add a Token
  await page.goto('http://my-dapp.com');
  const addToken = await page.$('#add-token');

  // ✔️
  await dappeteer.acceptAddToken();

  // go to a dapp and do something that prompts MetaMask to confirm a transaction
  await page.goto('http://my-dapp.com');
  const payButton = await page.$('#pay-with-eth');
  await payButton.click();

  // 🏌
  await dappeteer.confirmTransaction();
}

main();
```

- All methods can be found on [API page](docs/API.md)  
- Instructions to setup [dAppeteer with Jest](docs/JEST.md)  
- Mocha example can be found [inside test folder](./test)
