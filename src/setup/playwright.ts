import fs from "fs";
import path from "path";
import os from "os";
import type { BrowserContext } from "playwright";
import { DappeteerBrowser } from "../browser";

import { DappeteerLaunchOptions } from "../types";

export async function launchPlaywright(
  metamaskPath: string,
  options: DappeteerLaunchOptions
): Promise<DappeteerBrowser> {
  let browser: BrowserContext;
  const tmpdir = fs.mkdtempSync(
    path.join(os.tmpdir(), "dappeteer-playwright-")
  );
  if (options.browser === "chrome") {
    browser = await (
      await import("playwright")
    ).chromium.launchPersistentContext(tmpdir, {
      ...(options.playwrightOptions ?? {}),
      headless: options.headless,
      args: [
        "--accept-lang=en",
        `--disable-extensions-except=${metamaskPath}`,
        `--load-extension=${metamaskPath}`,
        ...(options.playwrightOptions?.args || []),
        ...(options.headless ? ["--headless=new"] : []),
      ],
    });
  }
  const { DPlaywrightBrowser } = await import("../playwright");
  return new DPlaywrightBrowser(browser, tmpdir, options.metaMaskFlask);
}
