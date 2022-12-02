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
  const { metaMask, browser } = await dappeteer.bootstrap();

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
  const { metaMask, browser } = await dappeteer.bootstrap({ metaMaskFlask: true });

  // build your local snap
  const builtSnapDir = await buildSnap()

  // create a new page and visit your dapp
  const dappPage = browser.newPage();
  await dappPage.goto('http://my-dapp.com');

  // install your snap
  const snapId = await metaMask.snaps.installSnap(builtSnapDir, {
    hasPermissions: false,
    hasKeyPermissions: false,
  });

  // do something in your dapp that invokes a method in your snap
  // you could alternatively call metaMask.snaps.invokeSnap(dappPage, snapId, "my-method")
  const invokeSnapButton = await dappPage.$('#invoke-snap');
  await addTokenButton.click();

  // instruct MetaMask to accept this request
  await metaMask.snaps.acceptDialog();

  // get the notification emitter and the promise that will receive the notifications
  const emitter = await metaMask.snaps.getNotificationEmitter();
  const notificationPromise = emitter.waitForNotification();

  // do something that prompts you snap to emit notifications
  const emitNotificationButton = await dappPage.$('#emit-notification');
  await emitNotificationButton.click();

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
