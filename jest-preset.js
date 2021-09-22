module.exports = {
  globalSetup: `@chainsafe/dappeteer/dist/jest/setup.js`,
  globalTeardown: `@chainsafe/dappeteer/dist/jest/teardown.js`,
  testEnvironment: `@chainsafe/dappeteer/dist/jest//DappeteerEnvironment.js`,
};
