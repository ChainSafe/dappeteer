// re-export
export { getMetaMask, getMetaMaskWindow } from "./metamask";
export * from "./types";
export * from "./setup";
export { DapeteerJestConfig as DappateerJestConfig } from "./jest/global";

// default constants
export const RECOMMENDED_METAMASK_VERSION = "v10.20.0";
