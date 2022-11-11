import { DappeteerBrowser } from "../browser";
import { DappeteerPage } from "../page";
import { InstallSnapOptions } from "../snap/install";
import { Dappeteer, DappeteerLaunchOptions, MetaMaskOptions } from "../types";
import { launch } from "./launch";
import { setupMetaMask } from "./setupMetaMask";

export * from "./launch";
export * from "./setupMetaMask";

export const bootstrap = async ({
  seed,
  password,
  showTestNets,
  ...launchOptions
}: DappeteerLaunchOptions & MetaMaskOptions): Promise<{
  dappeteer: Dappeteer;
  browser: DappeteerBrowser;
  page: DappeteerPage;
}> => {
  const browser = await launch(launchOptions);
  const dappeteer = await setupMetaMask(browser, {
    seed,
    password,
    showTestNets,
  });
  const pages = await browser.pages();

  return {
    dappeteer,
    browser,
    page: pages[0],
  };
};

export const initSnapEnv = async (
  opts: DappeteerLaunchOptions &
    MetaMaskOptions &
    InstallSnapOptions & { snapIdOrLocation: string }
): Promise<{
  dappeteer: Dappeteer;
  browser: DappeteerBrowser;
  page: DappeteerPage;
  snapId: string;
}> => {
  const browser = await launch({
    ...opts,
    metaMaskFlask: true,
  });
  const { snapIdOrLocation, seed, password, showTestNets } = opts;
  const dappeteer = await setupMetaMask(browser, {
    seed,
    password,
    showTestNets,
  });
  const page = dappeteer.page;

  const snapId = await dappeteer.snaps.installSnap(
    page,
    snapIdOrLocation,
    opts
  );

  return {
    dappeteer,
    browser,
    page,
    snapId,
  };
};
