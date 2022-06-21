# dAppeteer API

Methods provided by dAppeteer.  
For additional information read root [readme](../README.md)

- [Launch dAppeteer](#launch)
- [Setup Metamask](#setup)
- [Bootstrap dAppeteer](#bootstrap)
- [Get Metamask Window](#getMetamask)
- [dAppeteer methods](#methods)
  - [switchAccount](#switchAccount)
  - [importPK](#importPK)
  - [lock](#lock)
  - [unlock](#unlock)
  - [switchNetwork](#switchNetwork)
  - [addNetwork](#addNetwork)
  - [addToken](#addToken)
  - [confirmTransaction](#confirmTransaction)
  - [sign](#sign)
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
  metamaskVersion: 'latest' | string;
  metamaskLocation?: Path;
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
## `dappeteer.setupMetamask(browser: Browser, options: MetamaskOptions = {}, steps: Step[]): Promise<Dappeteer>`
```typescript
interface MetamaskOptions {
  seed?: string;
  password?: string;
  showTestNets?: boolean;
}
```

```typescript
type Step = (page: Page, options?: Options) => void;
```

<a name="bootstrap"><a/>
## `dappeteer.bootstrap(puppeteerLib: typeof puppeteer, options: OfficialOptions & MetamaskOptions): Promise<[Dappeteer, Page, Browser]>`
```typescript
interface OfficialOptions {
  metamaskVersion: 'latest' | string;
  metamaskLocation?: Path;
};
```
it runs `dappeteer.launch` and `dappeteer.setup` and return array with dappetter, page and browser

<a name="getMetamask"></a>
## `dappeteer.getMetamaskWindow(browser: Browser, version?: string): Promise<Dappeteer>`

<a name="methods"></a>
# dAppeteer methods
`metamask` is used as placeholder for dAppeteer returned by [`setupMetamask`](setup) or [`getMetamaskWindow`](getMetamask)


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
it changes the current selected network. `networkName` can take the following values: `"main"`, `"ropsten"`, `"rinkeby"`, `"kovan"`, `"localhost"`.

<a name="addNetwork"></a>
## `metamask.addNetwork(options: AddNetwork): Promise<void>`
```typescript
interface AddNetwork {
  networkName: string;
  rpc: string;
  chainId: number;
  symbol: string;
}
```
it adds a custom network to MetaMask.

<a name="addToken"></a>
## `metamask.addToken(tokenAddress: string): Promise<void>`
```typescript
interface AddToken {
  tokenAddress: string;
  symbol?: string;
  decimals?: number;
}
```
it adds a custom token to MetaMask.  

<a name="confirmTransaction"></a>
## `metamask.confirmTransaction(options?: TransactionOptions): Promise<void>`
```typescript
interface TransactionOptions {
  gas?: number;
  gasLimit?: number;
  priority?: number;
}
```
commands MetaMask to submit a transaction. For this to work MetaMask has to be in a transaction confirmation state (basically promting the user to submit/reject a transaction). You can (optionally) pass an object with `gas` and/or `gasLimit`, by default they are `20` and `50000` respectively.


<a name="sign"></a>
## `metamask.sign(): Promise<void>`  
commands MetaMask to sign a message. For this to work MetaMask must be in a sign confirmation state.

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
## `metamask.page` is Metamask plugin `Page`
**for advanced usages** in case you need custom features.
