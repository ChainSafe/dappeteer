import type { Config } from '@jest/types';
import puppeteer, { Product } from 'puppeteer';

export default {
  globalSetup: `@chainsafe/dappeteer/dist/jest/setup.js`,
  globalTeardown: `@chainsafe/dappeteer/dist/jest/teardown.js`,
  testEnvironment: `@chainsafe/dappeteer/dist/jest//DappeteerEnvironment.js`,
} as Config.InitialOptions;

export const PUPPETEER_DEFAULT_CONFIG: puppeteer.LaunchOptions = {
  product: (process.env.PUPPETEER_PRODUCT ?? 'chrome') as Product,
  args: ['--disable-web-security'] as string[],
};
