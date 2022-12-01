# dAppeteer API

Methods provided by dAppeteer.  
For additional information read root [readme](../README.md)

- [Launch dAppeteer](#launch)
- [Setup MetaMask](#setup)
- [Bootstrap dAppeteer](#bootstrap)
- [Get MetaMask Window](#getMetaMask)
- [dAppeteer methods](#methods)
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

# dAppeteer setup methods

<a name="launch"></a>
## `dappeteer.launch(puppeteerLib: typeof puppeteer, options: OfficialOptions | CustomOptions): Promise<Browser>`
```typescript
interface OfficialOptions {
  metaMaskVersion: 'latest' | string;
  metaMaskLocation?: Path;
};

type Path = string | { download: string; extract: string; };
```
or
```typescript
interface CustomOptions {
  metamaskPath: string;
};
```

returns an instance of `browser` same as `puppeteer.launch`, but it also installs the MetaMask extension. [It supports all the regular `puppeteer.launch` options](https://github.com/puppeteer/puppeteer/blob/v5.5.0/docs/api.md#puppeteerlaunchoptions)

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
  dappeteer: Dappeteer;
  browser: DappeteerBrowser;
  page: DappeteerPage;
}>`
```typescript
type DappeteerLaunchOptions = {
  metaMaskVersion?:
    | typeof RECOMMENDED_METAMASK_VERSION
    | "latest"
    | "local"
    | string;
  metaMaskLocation?: Path;
  metaMaskPath?: string;
  //install flask (canary) version of metamask.
  metaMaskFlask?: boolean;
  //fallbacks to installed dependency and prefers playwright if both are installed
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
```
it runs `dappeteer.launch` and `dappeteer.setup` and returns an object with dappeteer, page and browser.

<a name="getMetaMask"></a>
## `dappeteer.getMetaMaskWindow(browser: Browser, version?: string): Promise<Dappeteer>`

<a name="methods"></a>
# dAppeteer methods
`metamask` is used as placeholder for dAppeteer returned by [`setupMetaMask`](setup) or [`getMetaMaskWindow`](getMetaMask)


<a name="switchAccount"></a>
## `metamask.switchAccount(accountNumber: number): Promise<void>`  
it commands MetaMask to switch to a different account, by passing the index/position of the account in the accounts list.

<a name="importPK"></a>
## `metamask.importPK(privateKey: string): Promise<void>`  
it commands MetaMask to import an private key. It can only be used while you haven't signed in yet, otherwise it throws.

<a name="lock"></a>
## `metamask.lock(): Promise<void>`  
signs out from MetaMask. It can only be used if you arelady signed it, otherwise it throws.

<a name="unlock"></a>
## `metamask.unlock(password: string): Promise<void>`  
it unlocks the MetaMask extension. It can only be used in you locked/signed out before, otherwise it throws. The password is optional, it defaults to `password1234`.

<a name="switchNetwork"></a>
## `metamask.switchNetwork(network: string): Promise<void>`  
it changes the current selected network. `networkName` can take the following values: `"mainnet"`, `"goerli"`, `"sepolia"`, `"ropsten"`, `"rinkeby"`, `"kovan"`, `"localhost"`.

<a name="acceptAddNetwork"></a>
## `metamask.acceptAddNetwork(shouldSwitch?: boolean): Promise<void>`

commands MetaMask to accept a Network addition. For this to work MetaMask has to be in a Network addition state (basically prompting the user to accept/reject a Network addition). You can optionnaly tell Metamask to switch to this network by passing the `true` parameter (default to `false`).

<a name="rejectAddNetwork"></a>
## `metamask.rejectAddNetwork(): Promise<void>`

commands MetaMask to reject a Network addition. For this to work MetaMask has to be in a Network addition state (basically prompting the user to accept/reject a Network addition).

<a name="acceptAddToken"></a>
## `metamask.acceptAddToken(): Promise<void>`

commands MetaMask to accept a Token addition. For this to work MetaMask has to be in a Token addition state (basically prompting the user to accept/reject a Token addition).

<a name="rejectAddToken"></a>
## `metamask.rejectAddToken(): Promise<void>`

commands MetaMask to reject a Token addition. For this to work MetaMask has to be in a Token addition state (basically prompting the user to accept/reject a Token addition).

<a name="confirmTransaction"></a>
## `metamask.confirmTransaction(options?: TransactionOptions): Promise<void>`
```typescript
interface TransactionOptions {
  gas?: number;
  gasLimit?: number;
  priority?: number;
}
```
commands MetaMask to submit a transaction. For this to work MetaMask has to be in a transaction confirmation state (basically prompting the user to submit/reject a transaction). You can (optionally) pass an object with `gas` and/or `gasLimit`, by default they are `20` and `50000` respectively.


<a name="sign"></a>
## `metamask.sign(): Promise<void>`  
commands MetaMask to sign a message. For this to work MetaMask must be in a sign confirmation state.

<a name="signTypedData"></a>
## `metamask.signTypedData(): Promise<void>`  
commands MetaMask to sign a message. For this to work MetaMask must be in a sign typed data confirmation state.

<a name="approve"></a>
## `metamask.approve(): Promise<void>`  
enables the app to connect to MetaMask account in privacy mode

<a name="helpers"></a>
## `metamask.helpers`

<a name="getTokenBalance"></a>
### `metamask.helpers.getTokenBalance(tokenSymbol: string): Promise<number>`
get balance of specific token

<a name="deleteAccount"></a>
### `metamask.helpers.deleteAccount(accountNumber: number): Promise<void>`
deletes account containing name with specified number

<a name="deleteNetwork"></a>
### `metamask.helpers.deleteNetwork(): Promise<void>`
deletes custom network from metamask

<a name="page"></a>
## `metamask.page` is MetaMask plugin `Page`
**for advanced usages** in case you need custom features.
