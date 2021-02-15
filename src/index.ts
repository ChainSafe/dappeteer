import * as puppeteer from 'puppeteer';
import downloader from './metamaskDownloader';

const timeout = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000))

export type LaunchOptions = Parameters<typeof puppeteer["launch"]>[0] & {
  metamaskVersion?: string
}

export type MetamaskOptions = {
  seed?: string
  password?: string
  extensionId?: string
  extensionUrl?: string
}

export type Dappeteer = {
  lock: () => Promise<void>
  unlock: (password: string) => Promise<void>
  addNetwork: (url: string) => Promise<void>
  importPK: (pk: string) => Promise<void>
  switchAccount: (accountNumber: number) => Promise<void>
  switchNetwork: (network: string) => Promise<void>
  confirmTransaction: (options?: TransactionOptions) => Promise<void>
  sign: () => Promise<void>
  approve: () => Promise<void>
}

export type TransactionOptions = {
  gas: number
  gasLimit: number
}

export async function launch(puppeteer, { args, ...rest }: LaunchOptions = {}): Promise<puppeteer.Browser> {
  const METAMASK_PATH = await downloader(rest.metamaskVersion);

  return puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${METAMASK_PATH}`,
      `--load-extension=${METAMASK_PATH}`,
      ...(args || [])
    ],
    ...rest
  })
}

export async function getMetamask(
  browser: puppeteer.Browser,
  options: MetamaskOptions = {}
): Promise<Dappeteer> {
  const metamaskPage = await closeHomeScreen(browser)
  // const metamaskPage = await getMetamaskPage(browser, options.extensionId, options.extensionUrl)
  await confirmWelcomeScreen(metamaskPage)

  await importAccount(
    metamaskPage,
    options.seed || 'already turtle birth enroll since owner keep patch skirt drift any dinner',
    options.password || 'password1234'
  )

  let signedIn = true

  closeNotificationPage(browser)

  return {
    lock: async () => {
      if (!signedIn) {
        throw new Error("You can't sign out because you haven't signed in yet")
      }
      await metamaskPage.bringToFront()
      const accountSwitcher = await metamaskPage.waitForSelector('.identicon')
      await accountSwitcher.click()
      const lockButton = await metamaskPage.waitForSelector('.account-menu__lock-button')
      await lockButton.click()
      signedIn = false
    },

    unlock: async (password = 'password1234') => {
      if (signedIn) {
        throw new Error("You can't sign in because you are already signed in")
      }
      await metamaskPage.bringToFront()
      const passwordBox = await metamaskPage.waitForSelector('#password')
      await passwordBox.type(password)
      const unlockButton = await metamaskPage.waitForSelector('.unlock-page button')
      await unlockButton.click()
      signedIn = true
    },

    addNetwork: async url => {
      await metamaskPage.bringToFront()
      const networkSwitcher = await metamaskPage.waitForSelector('.network-indicator')
      await networkSwitcher.click()
      await metamaskPage.waitForSelector('li.dropdown-menu-item')
      const networkIndex = await metamaskPage.evaluate(network => {
        const elements = document.querySelectorAll('li.dropdown-menu-item')
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i]
          if ((element as HTMLLIElement).innerText.toLowerCase().includes(network.toLowerCase())) {
            return i
          }
        }
        return elements.length - 1
      }, 'Custom RPC')
      const networkButton = (await metamaskPage.$$('li.dropdown-menu-item'))[networkIndex]
      await networkButton.click()
      const newRPCInput = await metamaskPage.waitForSelector('input#new-rpc')
      await newRPCInput.type(url)
      const saveButton = await metamaskPage.waitForSelector('button.settings-tab__rpc-save-button')
      await saveButton.click()
      const prevButton = await metamaskPage.waitForSelector('img.app-header__metafox-logo')
      await prevButton.click()
    },

    importPK: async pk => {
      await metamaskPage.bringToFront()
      const accountSwitcher = await metamaskPage.waitForSelector('.identicon')
      await accountSwitcher.click()
      const addAccount = await metamaskPage.waitForSelector('.account-menu > div:nth-child(7)')
      await addAccount.click()
      const PKInput = await metamaskPage.waitForSelector('input#private-key-box')
      await PKInput.type(pk)
      const importButton = await metamaskPage.waitForSelector('button.btn-secondary')
      await importButton.click()
    },

    switchAccount: async accountNumber => {
      await metamaskPage.bringToFront()
      const accountSwitcher = await metamaskPage.waitForSelector('.identicon')
      await accountSwitcher.click()
      const account = await metamaskPage.waitForSelector(
        `.account-menu__accounts > div:nth-child(${accountNumber})`
      )
      await account.click()
    },

    switchNetwork: async (network = 'main') => {
      await metamaskPage.bringToFront()
      const networkSwitcher = await metamaskPage.waitForSelector('.network-display')
      await networkSwitcher.click()
      await metamaskPage.waitForSelector('li.dropdown-menu-item')
      const networkIndex = await metamaskPage.evaluate(network => {
        const elements = document.querySelectorAll('li.dropdown-menu-item')
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i]
          if ((element as HTMLLIElement).innerText.toLowerCase().includes(network.toLowerCase())) {
            return i
          }
        }
        return 0
      }, network)
      const networkButton = (await metamaskPage.$$('li.dropdown-menu-item'))[networkIndex]
      await networkButton.click()
    },

    confirmTransaction: async options => {
      await metamaskPage.bringToFront()
      if (!signedIn) {
        throw new Error("You haven't signed in yet")
      }
      await metamaskPage.reload()
      if (options) {
        if (options.gas) {
          const gasSelector = '.advanced-gas-inputs__gas-edit-row:nth-child(1) input'
          const gas = await metamaskPage.waitForSelector(gasSelector)

          await metamaskPage.evaluate(
            () =>
              ((document.querySelectorAll(
                '.advanced-gas-inputs__gas-edit-row:nth-child(1) input'
              )[0] as HTMLInputElement).value = '')
          )
          await gas.type(options.gas.toString())
        }

        if (options.gasLimit) {
          const gasLimitSelector = '.advanced-gas-inputs__gas-edit-row:nth-child(2) input'
          const gasLimit = await metamaskPage.waitForSelector(gasLimitSelector)

          await metamaskPage.evaluate(
            () =>
              ((document.querySelectorAll(
                '.advanced-gas-inputs__gas-edit-row:nth-child(2) input'
              )[0] as HTMLInputElement).value = '')
          )
          await gasLimit.type(options.gasLimit.toString())
        }
      }
      const confirmButton = await metamaskPage.waitForSelector('.btn-primary')
      await confirmButton.click()
    },

    sign: async () => {
      await metamaskPage.bringToFront()
      if (!signedIn) {
        throw new Error("You haven't signed in yet")
      }
      await metamaskPage.reload()

      const button = await metamaskPage.waitForSelector('.request-signature__footer__sign-button')
      await button.click()
    },

    approve: async () => {
      await metamaskPage.bringToFront()
      await metamaskPage.reload()

      const button = await metamaskPage.waitForSelector('button.button.btn-primary')
      await button.click()

      const connectButton = await metamaskPage.waitForSelector('button.button.btn-primary')
      await connectButton.click()
    }
  }
}

async function closeHomeScreen(browser: puppeteer.Browser): Promise<puppeteer.Page> {
  return new Promise((resolve, reject) => {
    browser.on('targetcreated', async target => {
      if (target.url().match("chrome-extension://[a-z]+/home.html")) {
        try {
          const page = await target.page()
          resolve(page)
        } catch (e) {
          reject(e)
        }
      }
    })
  })
}

async function closeNotificationPage(browser: puppeteer.Browser) {
  browser.on('targetcreated', async target => {
    if (target.url() === 'chrome-extension://plkiloelkgnphnmaonlbbjbiphdalblo/notification.html') {
      try {
        const page = await target.page()
        await page.close()
      } catch {}
    }
  })
}

async function getMetamaskPage(browser, extensionId, extensionUrl) {
  const EXTENSION_ID = extensionId || 'nkbihfbeogaeaoehlefnkodbefgpgknn'
  const EXTENSION_URL = extensionUrl || `chrome-extension://${EXTENSION_ID}/popup.html`

  const metamaskPage = await browser.newPage()
  await metamaskPage.goto(EXTENSION_URL)
}

async function confirmWelcomeScreen(metamaskPage: puppeteer.Page) {
  const continueButton = await metamaskPage.waitForSelector('.welcome-page button')
  await continueButton.click()
}

async function importAccount(metamaskPage: puppeteer.Page, seed: string, password: string) {
  const importLink = await metamaskPage.waitForSelector('.first-time-flow button')
  await importLink.click()

  const metricsOptOut = await metamaskPage.waitForSelector('.metametrics-opt-in button.btn-primary')
  await metricsOptOut.click()

  const showSeedPhraseInput = await metamaskPage.waitForSelector('#ftf-chk1-label')
  await showSeedPhraseInput.click()

  const seedPhraseInput = await metamaskPage.waitForSelector('.first-time-flow textarea')
  await seedPhraseInput.type(seed)

  const passwordInput = await metamaskPage.waitForSelector('#password')
  await passwordInput.type(password)

  const passwordConfirmInput = await metamaskPage.waitForSelector('#confirm-password')
  await passwordConfirmInput.type(password)

  const acceptTerms = await metamaskPage.waitForSelector('.first-time-flow__terms')
  await acceptTerms.click()

  const restoreButton = await metamaskPage.waitForSelector('.first-time-flow button')
  await restoreButton.click()

  const doneButton = await metamaskPage.waitForSelector('.end-of-flow button')
  await doneButton.click()

  const popupButton = await metamaskPage.waitForSelector('.popover-header__button')
  await popupButton.click()
}
