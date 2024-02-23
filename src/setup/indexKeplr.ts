import { DappeteerBrowser } from '../browser';
import { DappeteerLaunchOptions } from '../types';
import { launch } from './launchKeplr';
import { setupKeplr } from './setupKeplr';

export * from './launchMetaMask';
export * from './setupKeplr';

/**
 * Launches browser and installs Keplr along with setting up initial account
 */
export const bootstrap = async ({
  ...launchOptions
}: DappeteerLaunchOptions): Promise<{
  browser: DappeteerBrowser;
}> => {
  const browser = await launch(launchOptions);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await setupKeplr(browser);

  return {
    browser,
  };
};
