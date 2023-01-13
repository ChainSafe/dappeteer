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
  metaMask: Dappeteer;
  browser: DappeteerBrowser;
  metaMaskPage: DappeteerPage;
}> => {
  const browser = await launch({
    headless: true,
    playwrightOptions: {
      args: ["--accept-lang=en"],
    },
    puppeteerOptions: {
      args: ["--accept-lang=en"],
    },
    ...launchOptions,
  });
  const metaMask = await setupMetaMask(browser, {
    seed,
    password,
    showTestNets,
  });

  return {
    metaMask,
    browser,
    metaMaskPage: metaMask.page,
  };
};

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
    headless: true,
    playwrightOptions: {
      args: ["--accept-lang=en"],
    },
    puppeteerOptions: {
      args: ["--accept-lang=en"],
    },
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
