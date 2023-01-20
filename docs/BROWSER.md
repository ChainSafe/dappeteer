# dAppeteer Browser

- [Methods](#methods)
  - [isMetaMaskFlask](#isMetaMaskFlask)
  - [pages](#pages)
  - [newPage](#newPage)
  - [getSource](#getSource)
  - [close](#close)
  - [wsEndpoint](#wsEndpoint)
  - [getUserDataDirPath](#getUserDataDirPath)
  - [storeUserData](#storeUserData)
- [Advance Usages](#advanced)
  - [Storing and lunching browser from specific state](#storeAndRun)
    - [Storing state](#storeAndRun-storing)
    - [Starting from state](#storeAndRun-start)

<a name="methods"></a>
# dAppeteer Browser methods

<a name="isMetaMaskFlask"></a>
## `browser.isMetaMaskFlask(): boolean`
returns if browser runs MetaMask flask version

<a name="pages"></a>
## `browser.pages(): Promise<DappeteerPage<Page>[]>`
returns list of open DappeteerPages

<a name="newPage"></a>
## `browser.newPage(): Promise<DappeteerPage<Page>>`
open new blank page in browser and return DappeteerPage of it

<a name="getSource"></a>
## `browser.getSource(): Browser`
returns underlying browser instance of browser runner

<a name="close"></a>
## `browser.close(): Promise<void>`
it closes browser and clears temporary data

<a name="wsEndpoint"></a>
## `browser.wsEndpoint(): string`
returns web socket address

<a name="getUserDataDirPath"></a>
## `browser.getUserDataDirPath(): string`
return path of temporary dir of browsers user data

<a name="storeUserData"></a>
## `browser.storeUserData(destination: string): boolean`
copy current user data on desired destination

<a name="advanced"></a>
# Advanced usages

<a name="storeAndRun"></a>
## Storing and lunching browser from specific state
In situations when you want to skip setup or have state to fallback.  
For an example, you can look at [`test/userData.spec.ts`](../test/userData.spec.ts)

<a name="storeAndRun-storing"></a>
### Storing state
There is few approach's storing a state.  
Best one is with help with using browser method [`browser.storeUserData`](#storeUserData).

```js
import dappeteer from "@chainsafe/dappeteer";

async function store() {
  const { metaMask, browser } = await dappeteer.bootstrap();

  const dappPage = browser.newPage();
  await dappPage.goto("https://chainsafe.io/");

  // add custom network to a MetaMask
  dappPage.evaluate(() => {
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0xa",
          chainName: "Optimism",
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH", // 2-6 characters long
            decimals: 18,
          },
          rpcUrls: ["https://mainnet.optimism.io"],
        },
      ],
    });
  });
  await metaMask.acceptAddNetwork(true);

  // add custom token to a MetaMask
  dappPage.evaluate(() => {
    window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
          symbol: "USDT",
          decimals: 18,
        },
      },
    });
  });
  await metaMask.acceptAddToken();

  // we are almost ready to store state
  // but at first we need to give a bit of time to metamask to store state
  await dappPage.waitForTimeout(1000);
  
  // now we can store on desiered location
  browser.storeUserData("./location-path");
  
  // done!
  await browser.close();
}

store();
```

<a name="storeAndRun-start"></a>
### Starting from state
For loading state from a stored configuration just need to include option `userDataDir` with path to a previously stored state. 

```js
import dappeteer from "@chainsafe/dappeteer";

async function resume() {
  const { metaMask, browser } = await dappeteer.bootstrap({
    userDataDir: "./location-path",
  });

  const dappPage = browser.newPage();
  await dappPage.goto("https://chainsafe.io/");
  
  // done!
}

resume();
```

dAppeteer provides state for default `MetaMaskOptions` to get path for it, you need to use constants `DEFAULT_METAMASK_USERDATA` and for a flask
`DEFAULT_FLASK_USERDATA`.

```js
import dappeteer from "@chainsafe/dappeteer";

async function resume() {
  const { metaMask, browser } = await dappeteer.bootstrap({
    userDataDir: dappeteer.DEFAULT_METAMASK_USERDATA,
  });

  const dappPage = browser.newPage();
  await dappPage.goto("https://chainsafe.io/");
  
  // done!
}

resume();
```
