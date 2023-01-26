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
      ...(options.playwrightOptions ?? {}),
      headless: options.headless,
      args: [
        "--accept-lang=en",
        "--window-size=1920,1080",
        `--disable-extensions-except=${metamaskPath}`,
        `--load-extension=${metamaskPath}`,
        ...(options.playwrightOptions?.args || []),
        ...(options.headless ? ["--headless=new"] : []),
      ],
    });
  }
  const { DPlaywrightBrowser } = await import("../playwright");
  return new DPlaywrightBrowser(browser, userDataDir, options.metaMaskFlask);
}
