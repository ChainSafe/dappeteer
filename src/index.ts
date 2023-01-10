// re-export
export { getMetaMask, getMetaMaskWindow } from "./metamask";
export * from "./types";
export * from "./browser";
export * from "./page";
export * from "./element";
export * from "./setup";
export { DapeteerJestConfig } from "./jest/global";

// default constants
export {
  RECOMMENDED_METAMASK_VERSION,
  DEFAULT_METAMASK_USERDATA,
  DEFAULT_FLASK_USERDATA,
} from "./constants";
