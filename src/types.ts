import type { LaunchOptions as PlaywrightLaunchOptions } from "playwright";
import type { launch as puppeteerLaunch } from "puppeteer";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { DappeteerPage, Serializable } from "./page";
import { Path } from "./setup/utils/metaMaskDownloader";
import { InstallStep } from "./snap/install";
import { InstallSnapResult, NotificationList } from "./snap/types";
import { RECOMMENDED_METAMASK_VERSION } from "./index";

export type DappeteerLaunchOptions = {
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

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

export type MetaMaskOptions = {
  seed?: string;
  password?: string;
  showTestNets?: boolean;
};

export type AddNetwork = {
  networkName: string;
  rpc: string;
  chainId: number;
  symbol: string;
};

export type AddToken = {
  tokenAddress: string;
  symbol?: string;
  decimals?: number;
};

export type TransactionOptions = {
  gas?: number;
  gasLimit?: number;
  priority?: number;
};

export type Dappeteer = {
  lock: () => Promise<void>;
  unlock: (password: string) => Promise<void>;
  addNetwork: (options: AddNetwork) => Promise<void>;
  addToken: (options: AddToken) => Promise<void>;
  importPK: (pk: string) => Promise<void>;
  switchAccount: (accountNumber: number) => Promise<void>;
  switchNetwork: (network: string) => Promise<void>;
  confirmTransaction: (options?: TransactionOptions) => Promise<void>;
  sign: () => Promise<void>;
  approve: () => Promise<void>;
  helpers: {
    getTokenBalance: (tokenSymbol: string) => Promise<number>;
    deleteAccount: (accountNumber: number) => Promise<void>;
    deleteNetwork: (name: string) => Promise<void>;
  };
  page: DappeteerPage;
  snaps: {
    getAllNotifications: () => Promise<NotificationList>;
    invokeSnap: <R = unknown, P extends Serializable = Serializable>(
      page: DappeteerPage,
      snapId: string,
      method: string,
      params?: P
    ) => Promise<Partial<R>>;
    installSnap: (
      page: DappeteerPage,
      snapId: string,
      opts: {
        hasPermissions: boolean;
        hasKeyPermissions: boolean;
        customSteps?: InstallStep[];
        version?: string;
      },
      installationSnapUrl?: string
    ) => Promise<InstallSnapResult>;
    acceptDialog: () => Promise<void>;
    rejectDialog: () => Promise<void>;
  };
};
