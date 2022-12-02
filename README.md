# dAppeteer

E2E testing for dApps using Puppeteer + MetaMask

## Installation

```
$ npm install -s @chainsafe/dappeteer
$ yarn add @chainsafe/dappeteer
```

## Usage

```js
import dappeteer from '@chainsafe/dappeteer';

async function main() {
  const { metaMask, browser } = await dappeteer.bootstrap({ metaMaskVersion: 'v10.15.0' });

  // create a new page and visit your dapp
  const dappPage = browser.newPage();
  await dappPage.goto('http://my-dapp.com');

  // you can change the network if you want
  await metaMask.switchNetwork('goerli');

  // do something in your dapp that prompts MetaMask to add a Token
  const addTokenButton = await dappPage.$('#add-token');
  await addTokenButton.click();
  // instruct MetaMask to accept this request
  await metaMask.acceptAddToken();

  // do something that prompts MetaMask to confirm a transaction
  const payButton = await dappPage.$('#pay-with-eth').click();
  await payButton.click();

  // 🏌
  await metaMask.confirmTransaction();
}

main();
```

- All methods can be found on [API page](docs/API.md)  
- Instructions to setup [dAppeteer with Jest](docs/JEST.md)  
- Mocha example can be found [inside test folder](./test)
