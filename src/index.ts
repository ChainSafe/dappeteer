// re-export
export { getMetaMask, getMetaMaskWindow } from "./metamask";
export * from "./types";
export * from "./browser";
export * from "./page";
export * from "./element";
export * from "./setup";
export { DapeteerJestConfig } from "./jest/global";

// default constants
export const RECOMMENDED_METAMASK_VERSION = "v10.23.0";
