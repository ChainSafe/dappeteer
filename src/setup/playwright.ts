import type { BrowserContext } from "playwright";
import { DappeteerBrowser } from "../browser";

import { DappeteerLaunchOptions } from "../types";

export async function launchPlaywright(
  metamaskPath: string,
  userDataDir: string,
  options: DappeteerLaunchOptions
): Promise<DappeteerBrowser> {
  let browser: BrowserContext;
  if (options.browser === "chrome") {
    browser = await (
      await import("playwright")
    ).chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${metamaskPath}`,
        `--load-extension=${metamaskPath}`,
        ...(options.playwrightOptions?.args || []),
      ],
      ...(options.playwrightOptions ?? {}),
    });
  }
  const { DPlaywrightBrowser } = await import("../playwright");
  return new DPlaywrightBrowser(browser, userDataDir, options.metaMaskFlask);
}
