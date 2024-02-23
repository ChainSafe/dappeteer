import { DappeteerBrowser } from '../browser';
import { DappeteerPage } from '../page';
import { importAccount } from './setupActionsKeplr';

const MM_HOME_REGEX = 'chrome-extension://[a-z]+/register.html#';

export async function setupKeplr(browser: DappeteerBrowser): Promise<void> {
  const page = await getKeplrPage(browser);
  await page.setViewport({ width: 1920, height: 1080 });
  await importAccount(page);
}

async function getKeplrPage(
  browser: DappeteerBrowser,
  timeout: number = 10000
): Promise<DappeteerPage> {
  try {
    const pages = await browser.pages();
    const keplrPage = pages.find((page) => page.url().match(MM_HOME_REGEX));
    if (keplrPage) {
      return keplrPage;
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        browser.off('targetcreated', targetCreatedHandler);
        reject(new Error('Timeout: Keplr page not found'));
      }, timeout);

      const targetCreatedHandler = async (target: any) => {
        if (target.url().match(MM_HOME_REGEX)) {
          clearTimeout(timeoutId);
          try {
            const pages = await browser.pages();
            const keplrPage = pages.find((page) =>
              page.url().match(MM_HOME_REGEX)
            );
            if (keplrPage) {
              browser.off('targetcreated', targetCreatedHandler);
              resolve(keplrPage);
            }
          } catch (e) {
            browser.off('targetcreated', targetCreatedHandler);
            reject(e);
          }
        }
      };

      browser.on('targetcreated', targetCreatedHandler);
    });
  } catch (error) {
    throw new Error(`Failed to get Keplr page: ${error}`);
  }
}
