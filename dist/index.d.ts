import * as puppeteer from 'puppeteer';
import { Page } from 'puppeteer';
import { getMetamask } from './metamask';
import { Path } from './metamaskDownloader';
export { getMetamask };
export declare type LaunchOptions = Parameters<typeof puppeteer['launch']>[0] & {
    metamaskVersion: 'v10.8.1' | 'latest' | string;
    metamaskLocation?: Path;
};
export declare type MetamaskOptions = {
    seed?: string;
    password?: string;
    showTestNets?: boolean;
    hideSeed?: boolean;
};
export declare type AddNetwork = {
    networkName: string;
    rpc: string;
    chainId: number;
    symbol?: string;
    explorer?: string;
};
export declare type Dappeteer = {
    lock: () => Promise<void>;
    unlock: (password: string) => Promise<void>;
    addNetwork: (options: AddNetwork) => Promise<void>;
    importPK: (pk: string) => Promise<void>;
    switchAccount: (accountNumber: number) => Promise<void>;
    switchNetwork: (network: string) => Promise<void>;
    confirmTransaction: (options?: TransactionOptions) => Promise<void>;
    sign: () => Promise<void>;
    approve: () => Promise<void>;
    addToken: (tokenAddress: string) => Promise<void>;
    getTokenBalance: (tokenSymbol: string) => Promise<number>;
    page: Page;
};
export declare type TransactionOptions = {
    gas?: number;
    gasLimit?: number;
};
export declare const RECOMMENDED_METAMASK_VERSION = "v10.8.1";
/**
 * Launch Puppeteer chromium instance with MetaMask plugin installed
 * */
export declare function launch(puppeteerLib: typeof puppeteer, options: LaunchOptions): Promise<puppeteer.Browser>;
export declare function setupMetamask(browser: puppeteer.Browser, options?: MetamaskOptions): Promise<Dappeteer>;
/**
 * Return MetaMask instance
 * */
export declare function getMetamaskWindow(browser: puppeteer.Browser, version?: string): Promise<Dappeteer>;
