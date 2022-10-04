import path from "path";

import { existsSync } from "node:fs";
import { cwd } from "node:process";

import { RECOMMENDED_METAMASK_VERSION } from "../index";
import { LaunchOptions } from "../types";

import { DappateerJestConfig } from "./global";

export const DAPPETEER_DEFAULT_CONFIG: LaunchOptions = {
  metaMaskVersion: RECOMMENDED_METAMASK_VERSION,
};

export async function getDappeteerConfig(): Promise<DappateerJestConfig> {
  const configPath = "dappeteer.config.js";
  const filePath = path.resolve(cwd(), configPath);

  if (!existsSync(filePath))
    return {
      dappeteer: DAPPETEER_DEFAULT_CONFIG,
      metaMask: {},
    };

  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
  const config = await require(filePath);

  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    dappeteer: {
      ...DAPPETEER_DEFAULT_CONFIG,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...config.dappeteer,
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    metaMask: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...config.metaMask,
    },
  };
}
