import { MetaMaskInpageProvider } from "@metamask/providers";
import type { LaunchOptions as PlaywrightLaunchOptions } from "playwright";
import type { launch as puppeteerLaunch } from "puppeteer";
import { DappeteerPage, Serializable } from "./page";
import { Path } from "./setup/utils/metaMaskDownloader";
import { InstallStep } from "./snap/install";
import { NotificationItem, NotificationList } from "./snap/types";
import NotificationsEmitter from "./snap/NotificationsEmitter";
import { DappeteerBrowser, RECOMMENDED_METAMASK_VERSION } from "./index";

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
  automation?: "puppeteer" | "playwright" | "custom";
  customAutomation?: CustomAutomation;
  headless?: boolean; // default true
  puppeteerOptions?: Parameters<typeof puppeteerLaunch>[0];
  playwrightOptions?: PlaywrightLaunchOptions;
  userDataDir?: string;
  key?: string;
};

export type CustomAutomation = (
  metamaskPath: string,
  userDataDir: string,
  options: DappeteerLaunchOptions
) => Promise<DappeteerBrowser>;

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    emitNotification: (notification: NotificationItem) => void;
  }
}

export type MetaMaskOptions = {
  seed?: string;
  password?: string;
  showTestNets?: boolean;
};

export type TransactionOptions = {
  gas?: number;
  gasLimit?: number;
  priority?: number;
};

export type Dappeteer = {
  lock: () => Promise<void>;
  unlock: (password: string) => Promise<void>;
  acceptAddNetwork: (shouldSwitch?: boolean) => Promise<void>;
  rejectAddNetwork: () => Promise<void>;
  acceptAddToken: () => Promise<void>;
  rejectAddToken: () => Promise<void>;
  importPK: (pk: string) => Promise<void>;
  switchAccount: (accountNumber: number) => Promise<void>;
  switchNetwork: (network: string) => Promise<void>;
  confirmTransaction: (options?: TransactionOptions) => Promise<void>;
  sign: () => Promise<void>;
  signTypedData: () => Promise<void>;
  approve: () => Promise<void>;
  createAccount: (accountName: string) => Promise<void>;
  helpers: {
    getTokenBalance: (tokenSymbol: string) => Promise<number>;
    deleteAccount: (accountNumber: number) => Promise<void>;
    deleteNetwork: (name: string) => Promise<void>;
  };
  page: DappeteerPage;
  snaps: {
    /**
     * Returns emitter to listen for notifications appearance in notification page
     */
    getNotificationEmitter: () => Promise<NotificationsEmitter>;
    /**
     * Returns all notifications in MetaMask notifications page
     */
    getAllNotifications: () => Promise<NotificationList>;
    /**
     * Invoke a MetaMask snap method. Function will throw if there is an error while invoking snap.
     * Use generic params to override result and parameter types.
     * @param page Browser page where injected MetaMask provider will be available.
     * For most snaps, openning example.org will suffice.
     * @param snapId id of your installed snap (result of invoking `installSnap` method)
     * @param method snap method you want to invoke
     * @param params required parameters of snap method
     */
    invokeSnap: <Result = unknown, Params extends Serializable = Serializable>(
      page: DappeteerPage,
      snapId: string,
      method: string,
      params?: Params
    ) => Promise<Partial<Result>>;
    /**
     * Installs snap. Function will throw if there is an error while installing snap.
     * @param snapIdOrLocation either pass in snapId or full path to your snap directory
     * where we can find bundled snap (you need to ensure snap is built)
     * @param opts {Object} snap method you want to invoke
     * @param installationSnapUrl url of your dapp. Defaults to example.org
     */
    installSnap: (
      snapIdOrLocation: string,
      opts?: {
        customSteps?: InstallStep[];
        version?: string;
        installationSnapUrl?: string;
      }
    ) => Promise<string>;

    dialog: {
      /**
       * Accepts snap_dialog dialog
       */
      accept: () => Promise<void>;

      /**
       * Rejects snap_dialog dialog
       */
      reject: () => Promise<void>;

      /**
       * type in snap_dialog dialog input field
       * @param value {string} value that will be typed in field
       */
      type: (value: string) => Promise<void>;
    };
  };
};
