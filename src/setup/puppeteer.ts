import { Browser } from "puppeteer";
import { DappeteerBrowser } from "../browser";
import { DappeteerLaunchOptions } from "../types";
import { loadFirefoxAddon } from "./utils/loadFirefoxAddon";

export async function launchPuppeteer(
  metamaskPath: string,
  options: DappeteerLaunchOptions
): Promise<DappeteerBrowser> {
  const puppeteer = await import("puppeteer");
  let pBrowser: Browser;

  if (options.browser === "chrome")
    pBrowser = await puppeteer.default.launch({
      product: "chrome",
      headless: false,
      args: [
        `--disable-extensions-except=${metamaskPath}`,
        `--load-extension=${metamaskPath}`,
        ...(options.puppeteerOptions?.args || []),
      ],
      ...(options.puppeteerOptions ?? {}),
    });
  if (options.browser === "firefox") {
    console.warn("firefox");
    const firefoxDebugPort = 12345;
    pBrowser = await puppeteer.default.launch({
      product: "firefox",
      headless: false,
      debuggingPort: firefoxDebugPort,
      args: options.puppeteerOptions?.args || [],
      extraPrefsFirefox: {
        "devtools.debugger.remote-enabled": true,
        "devtools.debugger.prompt-connection": false,
        "xpinstall.signatures.required": false,
        "xpinstall.whitelist.required": false,
        "extensions.langpacks.signatures.required": false,
      },
      ...(options.puppeteerOptions ?? {}),
    });

    const { metamaskURL } = await loadFirefoxAddon(
      firefoxDebugPort,
      "localhost",
      metamaskPath
    );
    console.warn(metamaskURL);
  }

  const { DPuppeteerBrowser } = await import("../puppeteer");
  return new DPuppeteerBrowser(pBrowser, options.metaMaskFlask);
}
