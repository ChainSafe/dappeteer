import { DappeteerBrowser } from "../browser";
import { DappeteerLaunchOptions } from "../types";

export async function launchPuppeteer(
  metamaskPath: string,
  userDataDir: string,
  options: DappeteerLaunchOptions
): Promise<DappeteerBrowser> {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const puppeteer = (await import("puppeteer-extra")).default;
  // eslint-disable-next-line import/no-extraneous-dependencies
  const StealthPlugin = (await import("puppeteer-extra-plugin-stealth"))
    .default;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, import/no-extraneous-dependencies
  const ReCaptchaPlugin = (await import("puppeteer-extra-plugin-recaptcha"))
    .default;
  puppeteer.use(StealthPlugin());
  console.log(
    "2captcha token is",
    options?.puppeteerOptions?.pluginConfig?.["2captchaToken"]
  );
  puppeteer.use(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
    ReCaptchaPlugin({
      provider: {
        id: "2captcha",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        token:
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          options?.puppeteerOptions?.pluginConfig?.["2captchaToken"] ?? "xxx", // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
      },
      throwOnError: true,
      visualFeedback: true, // coloriz
    })
  );
  const pBrowser = await puppeteer.launch({
    ...(options.puppeteerOptions ?? {}),
    headless: options.headless,
    userDataDir,
    args: [
      "--accept-lang=en",
      "--window-size=1920,1080",
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`,
      ...(options.puppeteerOptions?.args || []),
      ...(options.headless ? ["--headless=new"] : []),
    ],
  });
  const { DPuppeteerBrowser } = await import("../puppeteer");
  return new DPuppeteerBrowser(pBrowser, userDataDir, options.metaMaskFlask);
}
