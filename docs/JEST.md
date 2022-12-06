# dAppeteer with jest

As dAppeteer is Puppeteer with MetaMask. Using it with jest is pretty similar to `jest-puppeteer`.

## Use preset

You can use jest [preset](https://jestjs.io/docs/configuration#preset-string) provided by dappeteer without installing additional packages
```json
{
    "preset": "@chainsafe/dappeteer"
}
```
Write your test
```js
describe('Ethereum', () => {
  beforeAll(async () => {
    await page.goto('https://ethereum.org/en/');
  });

  it('should be titled "Home | ethereum.org"', async () => {
    await expect(page.title()).resolves.toMatch('Home | ethereum.org');
  });
});
```

### Configuring preset
To configure Dappeteer to use custom config values as `metamaskVersion` or own `seed` phrase you need to create file `dappeteer.config.js` that exports config object

**example of `dappeteer.config.js`**
``` js
/** @type {import('@chainsafe/dappeteer').DappeteerJestConfig} */

const config = {
    dappeteer: {
        metamaskVersion: 'v10.14.0',
    },
    metamask: {
        seed: 'already turtle birth enroll since owner keep patch skirt drift any dinner',
        password: 'password1234',
    },
};

module.exports = config;
```

## Custom example without preset

In case you need more customisable use case you can rebuild it from scratch.

First let's define our entry `jest.config.js`
```js
// jest.config.js

module.exports = {
  globalSetup: './setup.js',
  globalTeardown: './teardown.js',
  testEnvironment: './environment.js',
};
```

Then create `setup.js` with responsibility to start Puppeteer with MetaMask and `teardown.js` for clean up after tests
```js
// setup.js

const { writeFile } = require('fs').promises;
const os = require('os');
const path = require('path');

const { launch, setupMetaMask } = require('@chainsafe/dappeteer');
const mkdirp = require('mkdirp');
const puppeteer = require('puppeteer');

const { metaMaskOptions, PUPPETEER_CONFIG } = require('./jest.config');

const DIR = path.join(os.tmpdir(), 'jest_dappeteer_global_setup');

module.exports = async function () {
  const browser = await launch(puppeteer, PUPPETEER_CONFIG);
  try {
    await setupMetaMask(browser, metaMaskOptions);
    global.browser = browser;
  } catch (error) {
    console.log(error);
    throw error;
  }

  mkdirp.sync(DIR);
  await writeFile(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};
```
```js
// teardown.js

const os = require('os');
const path = require('path');
const rimraf = require('rimraf');

const DIR = path.join(os.tmpdir(), 'jest_dappeteer_global_setup');

module.exports = async function () {
  // close the browser instance
  await global.browser.close();

  // clean-up the wsEndpoint file
  rimraf.sync(DIR);
};
```

And for the end we need a custom Test Environment for dAppeteer to inject features into the tests
```js
// environment.js

const {readFile} = require('fs').promises;
const os = require('os');
const path = require('path');
const puppeteer = require('puppeteer');
const NodeEnvironment = require('jest-environment-node');
const { getMetaMaskWindow } = require('@chainsafe/dappeteer');

const DIR = path.join(os.tmpdir(), 'jest_dappeteer_global_setup');

class DappeteerEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    // get the wsEndpoint
    const wsEndpoint = await readFile(path.join(DIR, 'wsEndpoint'), 'utf8');
    if (!wsEndpoint) throw new Error('wsEndpoint not found');

    // connect to puppeteer
    const browser = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });
    this.global.browser = browser;
    this.global.metamask = await getMetaMaskWindow(browser);
  }
}

module.exports = DappeteerEnvironment;
```
