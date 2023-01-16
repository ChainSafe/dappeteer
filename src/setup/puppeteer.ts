import { DappeteerBrowser } from "../browser";
import { DappeteerLaunchOptions } from "../types";

export async function launchPuppeteer(
  metamaskPath: string,
  options: DappeteerLaunchOptions
): Promise<DappeteerBrowser> {
  const pBrowser = await (
    await import("puppeteer")
  ).default.launch({
    ...(options.puppeteerOptions ?? {}),
    headless: options.headless,
    args: [
      "--accept-lang=en",
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`,
      ...(options.puppeteerOptions?.args || []),
      ...(options.headless ? ["--headless=chrome"] : []),
    ],
  });
  const { DPuppeteerBrowser } = await import("../puppeteer");
  return new DPuppeteerBrowser(pBrowser, options.metaMaskFlask);
}
