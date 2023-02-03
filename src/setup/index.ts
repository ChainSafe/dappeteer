import { DappeteerBrowser } from "../browser";
import { DappeteerPage } from "../page";
import { InstallSnapOptions } from "../snap/install";
import { Dappeteer, DappeteerLaunchOptions, MetaMaskOptions } from "../types";
import { launch } from "./launch";
import { setupBootstrappedMetaMask, setupMetaMask } from "./setupMetaMask";

export * from "./launch";
export * from "./setupMetaMask";

/**
 * Launches browser and installs required metamask version along with setting up initial account
 */
export const bootstrap = async ({
  seed,
  password,
  showTestNets,
  ...launchOptions
}: DappeteerLaunchOptions & MetaMaskOptions): Promise<{
  metaMask: Dappeteer;
  browser: DappeteerBrowser;
  metaMaskPage: DappeteerPage;
}> => {
  const browser = await launch(launchOptions);
  const metaMask = await (launchOptions.userDataDir
    ? setupBootstrappedMetaMask(browser, password)
    : setupMetaMask(browser, {
        seed,
        password,
        showTestNets,
      }));

  return {
    metaMask,
    browser,
    metaMaskPage: metaMask.page,
  };
};

/**
 * Used to quickly bootstrap dappeteer testing environment with installed snap
 */
export const initSnapEnv = async (
  opts: DappeteerLaunchOptions &
    MetaMaskOptions &
    InstallSnapOptions & { snapIdOrLocation: string }
): Promise<{
  metaMask: Dappeteer;
  browser: DappeteerBrowser;
  metaMaskPage: DappeteerPage;
  snapId: string;
}> => {
  const browser = await launch({
    ...opts,
    metaMaskFlask: true,
  });
  const { snapIdOrLocation, seed, password, showTestNets } = opts;
  const metaMask = await setupMetaMask(browser, {
    seed,
    password,
    showTestNets,
  });
  const metaMaskPage = metaMask.page;
  const snapId = await metaMask.snaps.installSnap(snapIdOrLocation, opts);

  return {
    metaMask,
    browser,
    metaMaskPage,
    snapId,
  };
};
