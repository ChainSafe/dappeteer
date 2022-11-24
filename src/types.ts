import { MetaMaskInpageProvider } from "@metamask/providers";
import type { LaunchOptions as PlaywrightLaunchOptions } from "playwright";
import type { launch as puppeteerLaunch } from "puppeteer";
import { DappeteerPage, Serializable } from "./page";
import { Path } from "./setup/utils/metaMaskDownloader";
import { InstallStep } from "./snap/install";
import { NotificationItem, NotificationList } from "./snap/types";
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
    emitNotification: (notification: NotificationItem) => void;
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
    /**
     * Returns all notifications in Metamask notifications page
     */
    waitForNotification: (page: DappeteerPage) => Promise<NotificationItem>;
    getAllNotifications: () => Promise<NotificationList>;
    /** Invoke notification snap method. The function will open a notification
    page, invoke the snap, and it will wait until notification is rendered
    in the DOM. Can be used in pair with getAllNotifications method f.e:
     await metamask.snaps.invokeNotification(page, "snapid", "method_name")
     const notifications = await metamask.snaps.getAllNotifications()
     expect(notifications[0].message).to.equal("Notification message")
    */
    invokeNotification: <Params extends Serializable = Serializable>(
      page: DappeteerPage,
      snapId: string,
      method: string,
      params?: Params
    ) => Promise<NotificationItem>;
    /**
     * Invoke Metamask snap method. Function will throw if there is an error while invoking snap.
     * Use generic params to override result and parameter types.
     * @param page Browser page where injected Metamask provider will be available.
     * For most snaps, openning google.com will suffice.
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
     * @param opts.hasPermissions Set to true if snap uses some permissions
     * @param opts.hasKeyPermissions Set to true if snap uses key permissions
     * @param installationSnapUrl url of your dapp. Defaults to google.com
     */
    installSnap: (
      snapIdOrLocation: string,
      opts: {
        hasPermissions: boolean;
        hasKeyPermissions: boolean;
        customSteps?: InstallStep[];
        version?: string;
      },
      installationSnapUrl?: string
    ) => Promise<string>;
    /**
     * Accepts snap_confirm dialog
     */
    acceptDialog: () => Promise<void>;

    /**
     * Rejects snap_confirm dialog
     */
    rejectDialog: () => Promise<void>;
  };
};
