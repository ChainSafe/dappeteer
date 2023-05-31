// re-export
export { getMetaMask, getMetaMaskWindow } from "./metamask";
export {
  Dappeteer,
  DappeteerLaunchOptions,
  MetaMaskOptions,
  TransactionOptions,
  CustomAutomation,
} from "./types";
export { DappeteerBrowser } from "./browser";
export { DappeteerPage } from "./page";
export { DappeteerElementHandle } from "./element";
export {
  bootstrap,
  initSnapEnv,
  launch,
  setupMetaMask,
  setupBootstrappedMetaMask,
} from "./setup";
export { DapeteerJestConfig } from "./jest/global";

// default constants
export {
  RECOMMENDED_METAMASK_VERSION,
  DEFAULT_METAMASK_USERDATA,
  DEFAULT_FLASK_USERDATA,
} from "./constants";
