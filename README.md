## Deprecation Notice

**Notice:** dAppeteer is deprecated and is no longer actively maintained. Due to ongoing changes in the MetaMask ecosystem and constraints in our resources, we have decided to discontinue development. This repository will remain available in a read-only, archived state.

**Alternatives:**
We encourage users to explore the following alternatives, which provide continued support and active development for dApp testing:
- **Synpress**: A robust testing framework with strong community support. [Explore Synpress on GitHub](https://github.com/Synthetixio/synpress).
- **Official Way to Test Snaps**: Learn the recommended methods for testing your MetaMask Snaps. [Find out how to test a snap here](https://docs.metamask.io/snaps/how-to/test-a-snap/).

We thank our community for the support and contributions over the years. For any additional questions or guidance on transitioning to new tools, please feel free to reach out.

Thank you for your understanding and collaboration.

# dAppeteer

E2E testing for dApps using Puppeteer + MetaMask

## Installation

```
$ npm install -s @chainsafe/dappeteer
```
or
```
$ yarn add @chainsafe/dappeteer
```

## Usage

```js
import dappeteer from '@chainsafe/dappeteer';

async function main() {
  const { metaMask, browser } = await dappeteer.bootstrap();

  // create a new page and visit your dapp
  const dappPage = await browser.newPage();
  await dappPage.goto('http://my-dapp.com');

  // you can change the network if you want
  await metaMask.switchNetwork('goerli');

  // do something in your dapp that prompts MetaMask to add a Token
  const addTokenButton = await dappPage.$('#add-token');
  await addTokenButton.click();
  // instruct MetaMask to accept this request
  await metaMask.acceptAddToken();

  // do something that prompts MetaMask to confirm a transaction
  const payButton = await dappPage.$('#pay-with-eth');
  await payButton.click();

  // 🏌
  await metaMask.confirmTransaction();
}

main();
```

## Usage with Snaps

```js
import dappeteer from '@chainsafe/dappeteer';
import { exec } from "child_process";

async function buildSnap(): Promise<string> {
  console.log(`Building my-snap...`);
  await new Promise((resolve, reject) => {
    exec(`cd ./my-snap && npx mm-snap build`, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });

  return "./my-snap";
}

async function main() {
  // build your local snap
  const builtSnapDir = await buildSnap()

  // setup dappateer and install your snap
  const { metaMask, snapId, browser } = await dappeteer.initSnapEnv({
    snapIdOrLocation: builtSnapDir,
  });

  // you need to have a webpage open to interact with MetaMask, you can also visit a dApp page
  const dappPage = await browser.newPage();
  await dappPage.goto('http://example.org/');

  // invoke a method from your snap that prompts users with approve/reject dialog
  await metaMask.snaps.invokeSnap(dappPage, snapId, "my-method")

  // instruct MetaMask to accept this request
  await metaMask.snaps.dialog.positive();

  // get the notification emitter and the promise that will receive the notifications
  const emitter = await metaMask.snaps.getNotificationEmitter();
  const notificationPromise = emitter.waitForNotification();

  // do something that prompts your snap to emit notifications
  await metaMask.snaps.invokeSnap(dappPage, snapId, "notify");

  // Make sure the notification promise has resolved
  await notificationPromise;

  // You can now read the snap notifications and run tests against them
  const notifications = await metaMask.snaps.getAllNotifications();
}

main();
```

- All methods can be found on [API page](docs/API.md)  
- Instructions to setup [dAppeteer with Jest](docs/JEST.md)  
- Mocha example can be found [inside test folder](./test)
