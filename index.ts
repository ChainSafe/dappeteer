import * as path from 'path'
import * as puppeteer from 'Puppeteer'

const timeout = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000))

export type LaunchOptions = puppeteer.LaunchOptions & {
  metamaskVersion?: string
  metamaskPath?: string
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
  confirmTransaction: (options: TransactionOptions) => Promise<void>
  sign: () => Promise<void>
  approve: () => Promise<void>
}

export type TransactionOptions = {
  gas: number
  gasLimit: number
}

export async function launch(puppeteer, options: LaunchOptions = {}): Promise<puppeteer.Browser> {
  const { args, ...rest } = options

  const { metamaskVersion, metamaskPath } = options
  const METAMASK_VERSION = metamaskVersion || '5.3.0'
  const METAMASK_PATH = metamaskPath || path.resolve(__dirname, `metamask/${METAMASK_VERSION}`)

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

  await acceptTermsOfUse(metamaskPage)

  let signedIn = true

  closeNotificationPage(browser)

  return {
    lock: async () => {
      if (!signedIn) {
        throw new Error("You can't sign out because you haven't signed in yet")
      }
      await metamaskPage.bringToFront()
      const accountSwitcher = await metamaskPage.$('.identicon')
      await accountSwitcher.click()
      await timeout(0.1)
      const signoutButton = await metamaskPage.$('.account-menu__logout-button')
      await signoutButton.click()
      await waitForSignInScreen(metamaskPage)
      signedIn = false
    },

    unlock: async (password = 'password1234') => {
      if (signedIn) {
        throw new Error("You can't sign in because you are already signed in")
      }
      await metamaskPage.bringToFront()
      const passwordBox = await metamaskPage.$('#password')
      await passwordBox.type(password)
      const login = await metamaskPage.$('.unlock-page button')
      await login.click()
      await waitForUnlockedScreen(metamaskPage)
      signedIn = true
    },

    addNetwork: async url => {
      await metamaskPage.bringToFront()
      const networkSwitcher = await metamaskPage.$('.network-indicator')
      await networkSwitcher.click()
      await timeout(0.1)
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
      await timeout(0.1)
      const newRPCInput = await metamaskPage.$('input#new-rpc')
      await newRPCInput.type(url)
      const saveButton = await metamaskPage.$('button.settings-tab__rpc-save-button')
      await saveButton.click()
      await timeout(0.5)
      const prevButton = await metamaskPage.$('img.app-header__metafox-logo')
      await prevButton.click()
      await waitForUnlockedScreen(metamaskPage)
    },

    importPK: async pk => {
      await metamaskPage.bringToFront()
      const accountSwitcher = await metamaskPage.$('.identicon')
      await accountSwitcher.click()
      await timeout(0.1)
      const addAccount = await metamaskPage.$('.account-menu > div:nth-child(7)')
      await addAccount.click()
      await timeout(0.1)
      const PKInput = await metamaskPage.$('input#private-key-box')
      await PKInput.type(pk)
      const importButton = await metamaskPage.$('button.btn-primary')
      await importButton.click()
      await timeout(0.1)
      await waitForUnlockedScreen(metamaskPage)
    },

    switchAccount: async accountNumber => {
      await metamaskPage.bringToFront()
      const accountSwitcher = await metamaskPage.$('.identicon')
      await accountSwitcher.click()
      await timeout(0.1)
      const account = await metamaskPage.$(
        `.account-menu__accounts > div:nth-child(${accountNumber})`
      )
      await account.click()
      await timeout(0.1)
      await waitForUnlockedScreen(metamaskPage)
    },

    switchNetwork: async (network = 'main') => {
      await metamaskPage.bringToFront()
      await metamaskPage.waitFor('.network-indicator')
      const networkSwitcher = await metamaskPage.$('.network-indicator')
      await networkSwitcher.click()
      await timeout(0.1)
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
      await waitForEthereum(metamaskPage)
    },

    confirmTransaction: async options => {
      await metamaskPage.bringToFront()
      if (!signedIn) {
        throw new Error("You haven't signed in yet")
      }
      await metamaskPage.reload()

      if (options) {
        const editButtonSelector = 'div.confirm-detail-row__header-text--edit'
        await metamaskPage.waitFor(editButtonSelector)
        const editButton = await metamaskPage.$(editButtonSelector)
        await editButton.click()
        await timeout(0.1)

        const tabSelector = 'li.page-container__tab:nth-child(2)'
        await metamaskPage.waitFor(tabSelector)
        const tab = await metamaskPage.$(tabSelector)
        await tab.click()
        await timeout(0.1)

        if (options.gas) {
          const gasSelector = 'div.advanced-tab__gas-edit-row:nth-child(1) input'
          await metamaskPage.waitFor(gasSelector)
          const gas = await metamaskPage.$(gasSelector)

          await metamaskPage.evaluate(
            () =>
              ((document.querySelectorAll(
                'div.advanced-tab__gas-edit-row:nth-child(1) input'
              )[0] as HTMLInputElement).value = '')
          )
          await gas.type(options.gas.toString())
        }

        if (options.gasLimit) {
          const gasLimitSelector = 'div.advanced-tab__gas-edit-row:nth-child(2) input'
          await metamaskPage.waitFor(gasLimitSelector)
          const gasLimit = await metamaskPage.$(gasLimitSelector)

          await metamaskPage.evaluate(
            () =>
              ((document.querySelectorAll(
                'div.advanced-tab__gas-edit-row:nth-child(2) input'
              )[0] as HTMLInputElement).value = '')
          )
          await gasLimit.type(options.gasLimit.toString())
        }
        await timeout(0.1)

        const saveSelector =
          '#app-content > div > span > div.modal > div > div > div > div.page-container__bottom > div.page-container__footer > header > button'
        await metamaskPage.waitFor(saveSelector)
        const saveButton = await metamaskPage.$(saveSelector)
        await saveButton.click()
        await timeout(0.1)
      }

      const confirmButtonSelector =
        'button.button.btn-confirm.btn--large.page-container__footer-button'
      await metamaskPage.waitFor(confirmButtonSelector)
      const confirmButton = await metamaskPage.$(confirmButtonSelector)
      await confirmButton.click()
      await waitForUnlockedScreen(metamaskPage)
    },

    sign: async () => {
      await metamaskPage.bringToFront()
      if (!signedIn) {
        throw new Error("You haven't signed in yet")
      }
      await metamaskPage.reload()

      const confirmButtonSelector = '.request-signature__footer button.btn-primary'

      await metamaskPage.waitFor(confirmButtonSelector)

      const button = await metamaskPage.$(confirmButtonSelector)
      await button.click()

      await waitForUnlockedScreen(metamaskPage)
    },

    approve: async () => {
      await metamaskPage.bringToFront()

      const confirmButtonSelector =
        'button.button.btn-confirm.btn--large.page-container__footer-button'

      await metamaskPage.waitFor(confirmButtonSelector)

      const button = await metamaskPage.$(confirmButtonSelector)
      await button.click()

      await waitForUnlockedScreen(metamaskPage)
    }
  }
}

async function closeHomeScreen(browser: puppeteer.Browser): Promise<puppeteer.Page> {
  return new Promise((resolve, reject) => {
    browser.on('targetcreated', async target => {
      if (target.url() === 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html') {
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
    if (target.url() === 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/notification.html') {
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
  await metamaskPage.waitFor('.welcome-screen button')
  const continueButton = await metamaskPage.$('.welcome-screen button')
  await continueButton.click()
}

async function importAccount(metamaskPage: puppeteer.Page, seed: string, password: string) {
  await metamaskPage.waitFor('.first-time-flow a')
  const importLink = await metamaskPage.$('.first-time-flow a')
  await importLink.click()

  await metamaskPage.waitFor('.import-account textarea')
  const seedPhraseInput = await metamaskPage.$('.import-account textarea')
  await seedPhraseInput.type(seed)

  await metamaskPage.waitFor('#password')
  const passwordInput = await metamaskPage.$('#password')
  await passwordInput.type(password)

  await metamaskPage.waitFor('#confirm-password')
  const passwordConfirmInput = await metamaskPage.$('#confirm-password')
  await passwordConfirmInput.type(password)

  await metamaskPage.waitFor('.import-account button')
  const restoreButton = await metamaskPage.$('.import-account button')
  await restoreButton.click()
}

async function acceptTermsOfUse(metamaskPage: puppeteer.Page) {
  for (let i = 0; i < 3; i++) {
    await waitForOneTermOfUse(metamaskPage)
  }
}

async function waitForOneTermOfUse(metamaskPage: puppeteer.Page) {
  await metamaskPage.waitFor('.tou .tou__body')
  const termsOfUse = await metamaskPage.$('.tou .tou__body')
  await metamaskPage.evaluate(termsOfUse => {
    termsOfUse.scrollTo(0, termsOfUse.scrollHeight)
    return termsOfUse.scrollHeight
  }, termsOfUse)

  await metamaskPage.waitFor(() => document.querySelector('.tou button:disabled') == null)
  const touButton = await metamaskPage.$('.tou button')
  await touButton.click()
}

async function waitForUnlockedScreen(metamaskPage) {
  await metamaskPage.waitForSelector('.main-container-wrapper')
}

async function waitForSignInScreen(metamaskPage) {
  await metamaskPage.waitForSelector('#metamask-mascot-container')
}

async function waitForEthereum(metamaskPage) {
  await Promise.race([waitUntilStartConnectingToEthereum(metamaskPage), timeout(1)])
  return Promise.race([waitUntilConnectedToEthereum(metamaskPage), timeout(10)])
}

async function waitUntilStartConnectingToEthereum(metamaskPage) {
  await metamaskPage.waitFor(() => {
    return !!document.querySelector('img[src="images/loading.svg"]')
  })
}

async function waitUntilConnectedToEthereum(metamaskPage) {
  await metamaskPage.waitFor(() => {
    return document.querySelector('img[src="images/loading.svg"]') == null
  })
}
