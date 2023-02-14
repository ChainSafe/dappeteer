import path from "path";

import { existsSync } from "node:fs";
import { cwd } from "node:process";

import { DappeteerLaunchOptions, RECOMMENDED_METAMASK_VERSION } from "../index";

import { DapeteerJestConfig } from "./global";

export const DAPPETEER_DEFAULT_CONFIG: DappeteerLaunchOptions = {
  metaMaskVersion: RECOMMENDED_METAMASK_VERSION,
};

export async function getDappeteerConfig(): Promise<DapeteerJestConfig> {
  const configPath = "dappeteer.config.js";
  const filePath = path.resolve(cwd(), configPath);

  if (!existsSync(filePath))
    return {
      dappeteer: DAPPETEER_DEFAULT_CONFIG,
      metaMask: {},
    };

  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
  const config: Partial<DapeteerJestConfig> = await require(filePath);

  return {
    dappeteer: {
      ...DAPPETEER_DEFAULT_CONFIG,
      ...config.dappeteer,
    },
    metaMask: {
      ...config.metaMask,
    },
  };
}
