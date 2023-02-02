# dAppeteer API

Methods provided by dAppeteer.  
For additional information read root [readme](../README.md)

- [Launch dAppeteer](#launch)
- [Setup MetaMask](#setup)
- [Bootstrap dAppeteer](#bootstrap)
- [Initialize Snap Environment](#initSnapEnv)
- [Get MetaMask Window](#getMetaMask)
- [MetaMask methods](#methods)
  - [switchAccount](#switchAccount)
  - [importPK](#importPK)
  - [lock](#lock)
  - [unlock](#unlock)
  - [switchNetwork](#switchNetwork)
  - [acceptAddNetwork](#acceptAddNetwork)
  - [rejectAddNetwork](#rejectAddNetwork)
  - [acceptAddToken](#acceptAddToken)
  - [rejectAddToken](#rejectAddToken)
  - [confirmTransaction](#confirmTransaction)
  - [sign](#sign)
  - [signTypedData](#signTypedData)
  - [approve](#approve)
  - [helpers](#helpers)
    - [getTokenBalance](#getTokenBalance)
    - [deleteAccount](#deleteAccount)
    - [deleteNetwork](#deleteNetwork)
  - [page](#page)
  - [snaps methods](#snaps-methods)
    - [installSnap](#installSnap)
    - [invokeSnap](#invokeSnap)
    - [acceptDialog](#acceptDialog)
    - [rejectDialog](#rejectDialog)
    - [getNotificationEmitter](#getNotificationEmitter)
    - [getAllNotifications](#getAllNotifications)

# dAppeteer setup methods

<a name="launch"></a>
## `dappeteer.launch(options: DappeteerLaunchOptions): Promise<DappeteerBrowser>`
```typescript
type DappeteerLaunchOptions = {
  metaMaskVersion?:
          | "latest"
          | "local"
          | string;
  metaMaskLocation?: Path;
  metaMaskPath?: string;
  metaMaskFlask?: boolean;
  automation?: "puppeteer" | "playwright";
  browser: "chrome";
  puppeteerOptions?: Parameters<typeof puppeteerLaunch>[0];
  playwrightOptions?: PlaywrightLaunchOptions;
  userDataDir?: string;
  key?: string;
};
```

returns an instance of `DappeteerBrowser` for more information visit [browser page](docs/BROWSER.md)

<a name="setup"></a>
## `dappeteer.setupMetaMask(browser: Browser, options: MetaMaskOptions = {}, steps: Step[]): Promise<Dappeteer>`

```typescript
interface MetaMaskOptions {
  seed?: string;
  password?: string;
  showTestNets?: boolean;
}
```

```typescript
type Step = (page: Page, options?: Options) => void;
```

<a name="bootstrap"><a/>
## `dappeteer.bootstrap(options: DappeteerLaunchOptions & MetaMaskOptions): Promise<{
  metaMask: Dappeteer;
  browser: DappeteerBrowser;
  metaMaskPage: DappeteerPage;
}>`

```typescript
type DappeteerLaunchOptions = {
  metaMaskVersion?:
    | "latest"
    | "local"
    | string;
  metaMaskLocation?: Path;
  metaMaskPath?: string;
  metaMaskFlask?: boolean;
  automation?: "puppeteer" | "playwright";
  browser: "chrome";
  puppeteerOptions?: Omit<Parameters<typeof puppeteerLaunch>[0], "headless">;
  playwrightOptions?: Omit<PlaywrightLaunchOptions, "headless">;
  userDataDir?: string;
  key?: string;
};

type MetaMaskOptions = {
  seed?: string;
  password?: string;
  showTestNets?: boolean;
};
```

it runs `dappeteer.launch` and `dappeteer.setupMetaMask` and returns an object with metaMask, metaMaskPage and browser.

<a name="initSnapEnv"></a>
## `dappeteer.initSnapEnv( opts: DappeteerLaunchOptions & MetaMaskOptions & InstallSnapOptions & { snapIdOrLocation: string }): Promise<{ metaMask: Dappeteer; browser: DappeteerBrowser; metaMaskPage: DappeteerPage; snapId: string;}`

```typescript
type DappeteerLaunchOptions = {
  metaMaskVersion?:
    | "latest"
    | "local"
    | string;
  metaMaskLocation?: Path;
  metaMaskPath?: string;
  metaMaskFlask?: boolean;
  automation?: "puppeteer" | "playwright";
  browser: "chrome";
  puppeteerOptions?: Omit<Parameters<typeof puppeteerLaunch>[0], "headless">;
  playwrightOptions?: Omit<PlaywrightLaunchOptions, "headless">;
};

type MetaMaskOptions = {
  seed?: string;
  password?: string;
  showTestNets?: boolean;
};

type InstallSnapOptions = {
    customSteps?: InstallStep[];
    version?: string;
    installationSnapUrl?: string;
}
```

it runs `dappeteer.launch` and `dappeteer.setupMetamask` and `snaps.installSnap` and returns an object with metaMask, metaMaskPage, browser and snapId.

<a name="getMetaMask"></a>
## `dappeteer.getMetaMaskWindow(browser: Browser, version?: string): Promise<Dappeteer>`

<a name="methods"></a>
# MetaMask methods
`metaMask` is used as placeholder for dAppeteer returned by [`setupMetaMask`](setup) or [`getMetaMaskWindow`](getMetaMask)

<a name="switchAccount"></a>
## `metaMask.switchAccount(accountNumber: number): Promise<void>`  
it commands MetaMask to switch to a different account, by passing the index/position of the account in the accounts list.

<a name="importPK"></a>
## `metaMask.importPK(privateKey: string): Promise<void>`  
it commands MetaMask to import a private key. It can only be used while you haven't signed in yet, otherwise it throws.

<a name="lock"></a>
## `metaMask.lock(): Promise<void>`  
signs out from MetaMask. It can only be used if you already signed it, otherwise it throws.

<a name="unlock"></a>
## `metaMask.unlock(password: string): Promise<void>`  
it unlocks the MetaMask extension. It can only be used in you locked/signed out before, otherwise it throws. The password is optional, it defaults to `password1234`.

<a name="switchNetwork"></a>
## `metaMask.switchNetwork(network: string): Promise<void>`  
it changes the current selected network. `networkName` can take the following values: `"mainnet"`, `"goerli"`, `"sepolia"`, `"ropsten"`, `"rinkeby"`, `"kovan"`, `"localhost"`.

<a name="acceptAddNetwork"></a>
## `metaMask.acceptAddNetwork(shouldSwitch?: boolean): Promise<void>`

commands MetaMask to accept a Network addition. For this to work MetaMask has to be in a Network addition state (basically prompting the user to accept/reject a Network addition). You can optionally tell MetaMask to switch to this network by passing the `true` parameter (default to `false`).

<a name="rejectAddNetwork"></a>
## `metaMask.rejectAddNetwork(): Promise<void>`

commands MetaMask to reject a Network addition. For this to work MetaMask has to be in a Network addition state (basically prompting the user to accept/reject a Network addition).

<a name="acceptAddToken"></a>
## `metaMask.acceptAddToken(): Promise<void>`

commands MetaMask to accept a Token addition. For this to work MetaMask has to be in a Token addition state (basically prompting the user to accept/reject a Token addition).

<a name="rejectAddToken"></a>
## `metaMask.rejectAddToken(): Promise<void>`

commands MetaMask to reject a Token addition. For this to work MetaMask has to be in a Token addition state (basically prompting the user to accept/reject a Token addition).

<a name="confirmTransaction"></a>
## `metaMask.confirmTransaction(options?: TransactionOptions): Promise<void>`
```typescript
interface TransactionOptions {
  gas?: number;
  gasLimit?: number;
  priority?: number;
}
```
commands MetaMask to submit a transaction. For this to work MetaMask has to be in a transaction confirmation state (basically prompting the user to submit/reject a transaction). You can (optionally) pass an object with `gas` and/or `gasLimit`, by default they are `20` and `50000` respectively.

<a name="sign"></a>
## `metaMask.sign(): Promise<void>`  
commands MetaMask to sign a message. For this to work MetaMask must be in a sign confirmation state.

<a name="signTypedData"></a>
## `metaMask.signTypedData(): Promise<void>`  
commands MetaMask to sign a message. For this to work MetaMask must be in a sign typed data confirmation state.

<a name="approve"></a>
## `metaMask.approve(): Promise<void>`  
enables the app to connect to MetaMask account in privacy mode

<a name="helpers"></a>
# Helpers methods

<a name="getTokenBalance"></a>
## `metaMask.helpers.getTokenBalance(tokenSymbol: string): Promise<number>`
get balance of specific token

<a name="deleteAccount"></a>
## `metaMask.helpers.deleteAccount(accountNumber: number): Promise<void>`
deletes account containing name with specified number

<a name="deleteNetwork"></a>
## `metaMask.helpers.deleteNetwork(): Promise<void>`
deletes custom network from metaMask

<a name="page"></a>
## `metaMask.page` is the MetaMask plugin `Page`
**for advanced usages** in case you need custom features.

<a name="snaps_methods"></a>
# Snaps methods

<a name="installSnap"></a>
## `metaMask.snaps.installSnap: (snapIdOrLocation: string, opts?: { customSteps?: InstallStep[]; version?: string;},installationSnapUrl?: string`) => Promise<string>;
installs the snap. The `snapIdOrLocation` param is either the snapId or the full path to your snap directory.

<a name="invokeSnap"></a>
## `metaMask.snaps.invokeSnap<Result = unknown, Params extends Serializable = Serializable>(page: DappeteerPage,snapId: string,method: string,params?: Params): Promise<Partial<Result>>`
invokes a MetaMask snap method. The snapId is the id of your installed snap (result of invoking `installSnap` method). This function will throw if there is an error while invoking snap.

<a name="acceptDialog"></a>
## `metaMask.snaps.acceptDialog(): Promise<void>`
accepts a snap_confirm dialog

<a name="rejectDialog"></a>
## `metaMask.snaps.rejectDialog(): Promise<void>`
rejects snap_confirm dialog

<a name="getNotificationEmitter"></a>
## `metaMask.snaps.getNotificationEmitter(): Promise<NotificationsEmitter>`
returns emitter to listen for notifications appearance in notification page

<a name="getAllNotifications"></a>
## `metaMask.snaps.getAllNotifications(): Promise<NotificationList>`
Returns all notifications in MetaMask notifications page
