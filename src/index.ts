// re-export
export { getMetaMask, getMetaMaskWindow } from "./metamask";
export {
  Dappeteer,
  DappeteerLaunchOptions,
  MetaMaskOptions,
  TransactionOptions,
} from "./types";
export { DappeteerBrowser } from "./browser";
export { DappeteerPage } from "./page";
export { DappeteerElementHandle } from "./element";
export { bootstrap, initSnapEnv, launch, setupMetaMask } from "./setup";
export { DapeteerJestConfig } from "./jest/global";

// default constants
export const RECOMMENDED_METAMASK_VERSION = "v10.23.0";
