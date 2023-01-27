import { DappeteerBrowser } from "../browser";
import { getMetaMask } from "../metamask";
import { DappeteerPage } from "../page";
import { Dappeteer, MetaMaskOptions } from "../types";

import { clickOnButton, retry, waitForOverlay } from "../helpers";
import { STABLE_UI_METAMASK_VERSION } from "../constants";
import {
  acceptTheRisks,
  closeNewModal,
  closePortfolioTooltip,
  closeWhatsNewModal,
  confirmWelcomeScreen,
  declineAnalytics,
  importAccount,
  importAccountNewUI,
  showTestNets,
} from "./setupActions";
import { isNewerVersion } from "./utils/isNewerVersion";

/**
 * Setup MetaMask with base account
 * */
type Step<Options> = (
  page: DappeteerPage,
  options?: Options
) => void | Promise<void>;

const defaultMetaMaskSteps: Step<MetaMaskOptions>[] = [
  confirmWelcomeScreen,
  declineAnalytics,
  importAccount,
  showTestNets,
  closePortfolioTooltip,
  closeWhatsNewModal,
  closeWhatsNewModal,
];

const flaskMetaMaskSteps: Step<MetaMaskOptions>[] = [
  acceptTheRisks,
  importAccount,
  showTestNets,
  closePortfolioTooltip,
  closeWhatsNewModal,
  closeWhatsNewModal,
];

const metaMaskV24: Step<MetaMaskOptions>[] = [
  importAccountNewUI,
  closeNewModal,
  showTestNets,
];

const MM_HOME_REGEX = "chrome-extension://[a-z]+/home.html";

function getDefaultSteps(metamaskVersion: string): Step<MetaMaskOptions>[] {
  if (isNewerVersion(STABLE_UI_METAMASK_VERSION, metamaskVersion)) {
    return metaMaskV24;
  }

  return defaultMetaMaskSteps;
}

export async function setupMetaMask<Options = MetaMaskOptions>(
  browser: DappeteerBrowser,
  options?: Options,
  steps?: Step<Options>[]
): Promise<Dappeteer> {
  const page = await getMetaMaskPage(browser);
  steps = steps ?? getDefaultSteps(browser.metaMaskVersion);
  if (browser.isMetaMaskFlask()) {
    steps = flaskMetaMaskSteps;
  }
  await page.setViewport({ height: 1080, width: 1920 });
  // goes through the installation steps required by MetaMask
  for (const step of steps) {
    await step(page, options);
  }

  return getMetaMask(page);
}

export async function setupBootstrappedMetaMask(
  browser: DappeteerBrowser,
  password: string
): Promise<Dappeteer> {
  const page = await getMetaMaskPage(browser);
  const metaMask = await getMetaMask(page);

  await metaMask.page.evaluate(() => {
    (window as unknown as { signedIn: boolean }).signedIn = false;
  });
  await page.waitForTimeout(100);
  await waitForOverlay(page);
  if (browser.isMetaMaskFlask()) await waitForOverlay(page);
  await retry(() => metaMask.unlock(password), 3);

  if (browser.isMetaMaskFlask()) await clickOnButton(page, "No");

  await waitForOverlay(page);
  return metaMask;
}

async function getMetaMaskPage(
  browser: DappeteerBrowser
): Promise<DappeteerPage> {
  const pages = await browser.pages();
  for (const page of pages) {
    if (page.url().match(MM_HOME_REGEX)) {
      return page;
    }
  }
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    browser.on("targetcreated", async (target: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      if (target.url().match(MM_HOME_REGEX)) {
        try {
          const pages = await browser.pages();
          for (const page of pages) {
            if (page.url().match(MM_HOME_REGEX)) {
              resolve(page);
            }
          }
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}
