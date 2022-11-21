import fs from "fs";
import path from "path";
import os from "os";
import type { BrowserContext } from "playwright";
import { DappeteerBrowser } from "../browser";

import { DappeteerLaunchOptions } from "../types";
import { loadFirefoxAddon } from "./utils/loadFirefoxAddon";

export async function launchPlaywright(
  metamaskPath: string,
  options: DappeteerLaunchOptions
): Promise<DappeteerBrowser> {
  let browser: BrowserContext;
  let firefoxExtension: string;
  const tmpdir = fs.mkdtempSync(
    path.join(os.tmpdir(), "dappeteer-playwright-" + options.browser)
  );
  const playwright = await import("playwright");

  if (options.browser === "chrome") {
    browser = await playwright.chromium.launchPersistentContext(tmpdir, {
      headless: false,
      args: [
        `--disable-extensions-except=${metamaskPath}`,
        `--load-extension=${metamaskPath}`,
        ...(options.playwrightOptions?.args || []),
      ],
      ...(options.playwrightOptions ?? {}),
    });
  }
  if (options.browser === "firefox") {
    const firefoxDebugPort = 12345;
    const client = await playwright.firefox.launch({
      headless: false,
      args: [
        "-start-debugger-server",
        String(firefoxDebugPort),
        ...(options.playwrightOptions?.args || []),
      ],
      firefoxUserPrefs: {
        "devtools.debugger.remote-enabled": true,
        "devtools.debugger.prompt-connection": false,
        "xpinstall.signatures.required": false,
        "xpinstall.whitelist.required": false,
        "extensions.langpacks.signatures.required": false,
      },
      ...(options.playwrightOptions ?? {}),
    });

    browser = await client.newContext();
    await browser.newPage();
    const addon = await loadFirefoxAddon(
      firefoxDebugPort,
      "localhost",
      metamaskPath
    );
    firefoxExtension = addon.metamaskURL;
  }
  const { DPlaywrightBrowser } = await import("../playwright");
  return new DPlaywrightBrowser(
    browser,
    tmpdir,
    options.metaMaskFlask,
    firefoxExtension
  );
}
