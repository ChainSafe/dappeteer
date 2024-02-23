import fs from 'fs';
import { DappeteerBrowser } from '../browser';
import { DappeteerLaunchOptions } from '../types';
import { launchPuppeteer } from './puppeteer';
import { getTemporaryUserDataDir } from './utils/getTemporaryUserDataDir';
import downloader from './utils/keplrDownloader';

/**
 * Launch Puppeteer chromium instance with Keplr plugin installed
 * */
export async function launch(
  options: DappeteerLaunchOptions = {}
): Promise<DappeteerBrowser> {
  if (options.headless === undefined) {
    options.headless = false;
  }
  let keplrPath: string;

  keplrPath = await downloader();

  const userDataDir = getTemporaryUserDataDir();

  try {
    return await launchPuppeteer(keplrPath, userDataDir, options);
  } catch (error) {
    fs.rmSync(userDataDir, { recursive: true, force: true });
    throw new Error('Failed to launch puppeteer');
  }
}
