import * as puppeteer from 'puppeteer';
import { Page } from 'puppeteer';

import { getMetamask } from './metamask';
import downloader, { Path } from './metamaskDownloader';
import { isNewerVersion } from './utils';

// re-export
export { getMetamask };

export type LaunchOptions = Parameters<typeof puppeteer['launch']>[0] & {
  metamaskVersion: 'v10.1.1' | 'latest' | string;
  metamaskLocation?: Path;
};

export type MetamaskOptions = {
  seed?: string;
  password?: string;
};

export type AddNetwork = {
  networkName: string;
  rpc: string;
  chainId: number;
  symbol?: string;
  explorer?: string;
};

export type Dappeteer = {
  lock: () => Promise<void>;
  unlock: (password: string) => Promise<void>;
  addNetwork: (options: AddNetwork) => Promise<void>;
  importPK: (pk: string) => Promise<void>;
  switchAccount: (accountNumber: number) => Promise<void>;
  switchNetwork: (network: string) => Promise<void>;
  confirmTransaction: (options?: TransactionOptions) => Promise<void>;
  sign: () => Promise<void>;
  approve: () => Promise<void>;
  page: Page;
};

export type TransactionOptions = {
  gas?: number;
  gasLimit?: number;
};

export const RECOMMENDED_METAMASK_VERSION = 'v10.1.1';

/**
 * Launch Puppeteer chromium instance with MetaMask plugin installed
 * */
export async function launch(puppeteerLib: typeof puppeteer, options: LaunchOptions): Promise<puppeteer.Browser> {
  if (!options || !options.metamaskVersion)
    throw new Error(
      `Pleas provide "metamaskVersion" (use recommended "${RECOMMENDED_METAMASK_VERSION}" or "latest" to always get latest release of MetaMask)`,
    );

  const { args, metamaskVersion, metamaskLocation, ...rest } = options;

  /* eslint-disable no-console */
  console.log(); // new line
  if (metamaskVersion === 'latest')
    console.warn(
      '\x1b[33m%s\x1b[0m',
      `It is not recommended to run metamask with "latest" version. Use it at your own risk or set to the recommended version "${RECOMMENDED_METAMASK_VERSION}".`,
    );
  else if (isNewerVersion(RECOMMENDED_METAMASK_VERSION, metamaskVersion))
    console.warn(
      '\x1b[33m%s\x1b[0m',
      `Seems you are running newer version of MetaMask that recommended by dappeteer team.
      Use it at your own risk or set to the recommended version "${RECOMMENDED_METAMASK_VERSION}".`,
    );
  else if (isNewerVersion(metamaskVersion, RECOMMENDED_METAMASK_VERSION))
    console.warn(
      '\x1b[33m%s\x1b[0m',
      `Seems you are running older version of MetaMask that recommended by dappeteer team.
      Use it at your own risk or set the recommended version "${RECOMMENDED_METAMASK_VERSION}".`,
    );
  else console.log(`Running tests on MetaMask version ${metamaskVersion}`);

  console.log(); // new line
  /* eslint-enable no-console */

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const METAMASK_PATH = await downloader(metamaskVersion, metamaskLocation);

  return puppeteerLib.launch({
    headless: false,
    args: [`--disable-extensions-except=${METAMASK_PATH}`, `--load-extension=${METAMASK_PATH}`, ...(args || [])],
    ...rest,
  });
}

/**
 * Setup MetaMask with base account
 * */
export async function setupMetamask(browser: puppeteer.Browser, options: MetamaskOptions = {}): Promise<Dappeteer> {
  const page = await closeHomeScreen(browser);
  await confirmWelcomeScreen(page);

  await importAccount(
    page,
    options.seed || 'already turtle birth enroll since owner keep patch skirt drift any dinner',
    options.password || 'password1234',
  );

  await closeNotificationPage(browser);

  return getMetamask(page);
}

/**
 * Return MetaMask instance
 * */
export async function getMetamaskWindow(browser: puppeteer.Browser, version?: string): Promise<Dappeteer> {
  const metamaskPage = await new Promise<puppeteer.Page>((resolve) => {
    browser.pages().then((pages) => {
      for (const page of pages) {
        if (page.url().includes('chrome-extension')) resolve(page);
      }
    });
  });

  return getMetamask(metamaskPage, version);
}

async function closeHomeScreen(browser: puppeteer.Browser): Promise<puppeteer.Page> {
  return new Promise((resolve, reject) => {
    browser.on('targetcreated', async (target) => {
      if (target.url().match('chrome-extension://[a-z]+/home.html')) {
        try {
          const page = await target.page();
          resolve(page);
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}

async function closeNotificationPage(browser: puppeteer.Browser): Promise<void> {
  browser.on('targetcreated', async (target) => {
    if (target.url().match('chrome-extension://[a-z]+/notification.html')) {
      try {
        const page = await target.page();
        await page.close();
      } catch {
        return;
      }
    }
  });
}

async function confirmWelcomeScreen(metamaskPage: puppeteer.Page): Promise<void> {
  const continueButton = await metamaskPage.waitForSelector('.welcome-page button');
  await continueButton.click();
}

async function importAccount(metamaskPage: puppeteer.Page, seed: string, password: string): Promise<void> {
  const importLink = await metamaskPage.waitForSelector('.first-time-flow button');
  await importLink.click();

  const metricsOptOut = await metamaskPage.waitForSelector('.metametrics-opt-in button.btn-primary');
  await metricsOptOut.click();

  const showSeedPhraseInput = await metamaskPage.waitForSelector('#ftf-chk1-label');
  await showSeedPhraseInput.click();

  const seedPhraseInput = await metamaskPage.waitForSelector('.first-time-flow textarea');
  await seedPhraseInput.type(seed);

  const passwordInput = await metamaskPage.waitForSelector('#password');
  await passwordInput.type(password);

  const passwordConfirmInput = await metamaskPage.waitForSelector('#confirm-password');
  await passwordConfirmInput.type(password);

  const acceptTerms = await metamaskPage.waitForSelector('.first-time-flow__terms');
  await acceptTerms.click();

  const restoreButton = await metamaskPage.waitForSelector('.first-time-flow button');
  await restoreButton.click();

  const doneButton = await metamaskPage.waitForSelector('.end-of-flow button');
  await doneButton.click();

  const popupButton = await metamaskPage.waitForSelector('.popover-header__button');
  await popupButton.click();
}
