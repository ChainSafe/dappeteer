import puppeteer from "puppeteer";

import {
  CustomOptions,
  OfficialOptions,
  RECOMMENDED_METAMASK_VERSION,
} from "../index";
import { LaunchOptions } from "../types";

import { isNewerVersion } from "./isNewerVersion";
import downloader from "./metaMaskDownloader";

export type DappeteerBrowser = puppeteer.Browser & { flask?: boolean };

/**
 * Launch Puppeteer chromium instance with MetaMask plugin installed
 * */
export async function launch(
  puppeteerLib: typeof puppeteer,
  options: LaunchOptions
): Promise<DappeteerBrowser> {
  if (
    !options ||
    (!options.metaMaskVersion && !(options as CustomOptions).metaMaskPath)
  )
    throw new Error(
      `Please provide "metaMaskVersion" (recommended "${RECOMMENDED_METAMASK_VERSION}" or "latest" to always get latest release of MetaMask)`
    );

  const { args, ...rest } = options;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  let METAMASK_PATH: string;
  if (options.metaMaskVersion) {
    const { metaMaskVersion, metaMaskLocation } = rest as OfficialOptions;
    /* eslint-disable no-console */
    console.log(); // new line
    if (metaMaskVersion === "latest")
      console.warn(
        "\x1b[33m%s\x1b[0m",
        `It is not recommended to run MetaMask with "latest" version. Use it at your own risk or set to the recommended version "${RECOMMENDED_METAMASK_VERSION}".`
      );
    else if (isNewerVersion(RECOMMENDED_METAMASK_VERSION, metaMaskVersion))
      console.warn(
        "\x1b[33m%s\x1b[0m",
        `Seems you are running newer version of MetaMask that recommended by dappeteer team.
      Use it at your own risk or set to the recommended version "${RECOMMENDED_METAMASK_VERSION}".`
      );
    else if (isNewerVersion(metaMaskVersion, RECOMMENDED_METAMASK_VERSION))
      console.warn(
        "\x1b[33m%s\x1b[0m",
        `Seems you are running older version of MetaMask that recommended by dappeteer team.
      Use it at your own risk or set the recommended version "${RECOMMENDED_METAMASK_VERSION}".`
      );
    else
      console.log(
        `Running tests on MetaMask version ${metaMaskVersion} (flask: ${String(
          options.metaMaskFlask ?? false
        )})`
      );

    console.log(); // new line

    METAMASK_PATH = await downloader(metaMaskVersion, {
      location: metaMaskLocation,
      flask: options.metaMaskFlask,
    });
  } else {
    console.log(`Running tests on local MetaMask build`);

    METAMASK_PATH = (rest as CustomOptions).metaMaskPath;
    /* eslint-enable no-console */
  }

  const browser = await puppeteerLib.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${METAMASK_PATH}`,
      `--load-extension=${METAMASK_PATH}`,
      ...(args || []),
    ],
    ...rest,
  });

  if (options.metaMaskFlask) {
    Object.assign(browser, { flask: true });
  }
  return browser;
}
