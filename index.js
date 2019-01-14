const path = require('path')

const timeout = seconds =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000))

module.exports = {
  launch: async (puppeteer, options = {}) => {
    const {
      args,
      ...rest
    } = options

    const METAMASK_VERSION = options.metamaskVersion || '5.3.0'
    const METAMASK_PATH =
      options.metamaskPath ||
      path.join(__dirname, `metamask/${METAMASK_VERSION}`)

    return puppeteer.launch({
      headless: false,
      args: [
        `--disable-extensions-except=${METAMASK_PATH}`,
        `--load-extension=${METAMASK_PATH}`,
        ...(args || [])
      ],
      ...rest
    })
  },
  getMetamask: async (browser, options = {
    seed: undefined,
    password: undefined,
    extensionId: undefined,
    extensionUrl: undefined
  }) => {
    const metamaskPage = await closeHomeScreen(browser);

    // const metamaskPage = await getMetamaskPage(browser, options.extensionId, options.extensionUrl)

    await confirmWelcomeScreen(metamaskPage);

    await importAccount(
      metamaskPage,
      options.seed || 'already turtle birth enroll since owner keep patch skirt drift any dinner',
      options.password || 'password1234'
    );

    await acceptTermsOfUse(metamaskPage);

    let signedIn = true

    closeNotificationPage(browser);

    return {
      lock: async () => {
        if (!signedIn) {
          throw new Error(
            "You can't sign out because you haven't signed in yet"
          )
        }
        await metamaskPage.bringToFront()
        const hamburger = await metamaskPage.$('.sandwich-expando')
        await hamburger.click()
        await timeout(0.5)
        const signoutButton = (await metamaskPage.$$(
          '.menu-droppo .dropdown-menu-item'
        ))[1]
        await signoutButton.click()
        await waitForSignInScreen(metamaskPage)
      },

      unlock: async (password = 'password1234') => {
        await metamaskPage.bringToFront()
        const passwordBox = await metamaskPage.$('#password-box')
        await passwordBox.type(password)
        const createButton = await metamaskPage.$('button')
        await createButton.click()
        await waitForUnlockedScreen(metamaskPage)
      },

      addNetwork: async (url) => {
        await metamaskPage.bringToFront()
        const networkSwitcher = await metamaskPage.$('.network-indicator')
        await networkSwitcher.click()
        await timeout(0.1)
        const networkIndex = await metamaskPage.evaluate(network => {
          const elements = document.querySelectorAll('li.dropdown-menu-item')
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
            if (
              element.innerText.toLowerCase().includes(network.toLowerCase())
            ) {
              return i
            }
          }
          return elements.length - 1
        }, 'Custom RPC')
        const networkButton = (await metamaskPage.$$('li.dropdown-menu-item'))[
          networkIndex
        ]
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

      importPK: async (pk) => {
        await metamaskPage.bringToFront()
        const accountSwitcher = await metamaskPage.$('.accounts-selector')
        await accountSwitcher.click()
        await timeout(0.5)
        const addAccount = await metamaskPage.$('.menu-droppo .dropdown-menu-item:last-child')
        await addAccount.click()
        await timeout(0.5)
        const PKInput = await metamaskPage.$('input#private-key-box')
        await PKInput.type(pk)
        const importButton = await metamaskPage.$('input#private-key-box+button')
        await importButton.click()
        await timeout(0.5)
        await waitForEthereum(metamaskPage)
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
            if (
              element.innerText.toLowerCase().includes(network.toLowerCase())
            ) {
              return i
            }
          }
          return 0
        }, network)
        const networkButton = (await metamaskPage.$$('li.dropdown-menu-item'))[
          networkIndex
        ]
        await networkButton.click()
        await waitForEthereum(metamaskPage)
      },

      confirmTransaction: async (options) => {
        await metamaskPage.bringToFront()
        if (!signedIn) {
          throw new Error("You haven't signed in yet")
        }
        await metamaskPage.reload()
        
        if (options) {
          // FIX: custom gas and limit
        }

        const confirmButtonSelector = 'button.button.btn-confirm.btn--large.page-container__footer-button'
        await metamaskPage.waitFor(confirmButtonSelector)
        const confirmButton = await metamaskPage.$(confirmButtonSelector)
        await confirmButton.click()
        await waitForUnlockedScreen(metamaskPage)
      },

      sign: async (options = {}) => {
        await metamaskPage.bringToFront()
        if (!signedIn) {
          throw new Error("You haven't signed in yet")
        }
        await metamaskPage.reload()
        await waitForConfirmationPromt(metamaskPage)

        const data = await metamaskPage.$$('.flex-row.flex-space-around');

        const buttons = await data[0].$$('button');

        await buttons[1].click()

        await waitForUnlockedScreen(metamaskPage);

      }
    }
  }
}

async function closeHomeScreen(browser) {
  return new Promise((resolve, reject) => {
    browser.on('targetcreated', async target => {
      if (target.url() === 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html') {
        try {
          const page = await target.page()
          resolve(page);
        } catch (e) {
          reject(e);
        }
      }
    })
  })
}

async function closeNotificationPage(browser) {
  browser.on('targetcreated', async target => {
    if (target.url() === 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/notification.html') {
      try {
        const page = await target.page()
        await page.close();
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

async function confirmWelcomeScreen(metamaskPage) {
  await metamaskPage.waitFor('.welcome-screen button');
  const continueButton = await metamaskPage.$('.welcome-screen button');
  await continueButton.click();
}

async function importAccount(metamaskPage, seed, password) {
  await metamaskPage.waitFor('.first-time-flow a');
  const importLink = await metamaskPage.$('.first-time-flow a');
  await importLink.click();

  await metamaskPage.waitFor('.import-account textarea');
  const seedPhraseInput = await metamaskPage.$('.import-account textarea');
  await seedPhraseInput.type(seed);

  await metamaskPage.waitFor('#password');
  const passwordInput = await metamaskPage.$('#password');
  await passwordInput.type(password);

  await metamaskPage.waitFor('#confirm-password');
  const passwordConfirmInput = await metamaskPage.$('#confirm-password');
  await passwordConfirmInput.type(password);

  await metamaskPage.waitFor('.import-account button');
  const restoreButton = await metamaskPage.$('.import-account button');
  await restoreButton.click();
}

async function acceptTermsOfUse(metamaskPage) {
  for (let i = 0; i < 3; i++) {
    await waitForOneTermOfUse(metamaskPage);
  }
}

async function waitForOneTermOfUse(metamaskPage) {
  await metamaskPage.waitFor('.tou .tou__body');
  const termsOfUse = await metamaskPage.$('.tou .tou__body');
  await metamaskPage.evaluate(termsOfUse => {
    termsOfUse.scrollTo(0, termsOfUse.scrollHeight);
    return termsOfUse.scrollHeight;
  }, termsOfUse)

  await metamaskPage.waitFor(
    () => document.querySelector('.tou button:disabled') == null
  )
  const touButton = await metamaskPage.$('.tou button');
  await touButton.click();
}

async function waitForUnlockedScreen(metamaskPage) {
  await metamaskPage.waitForSelector('.main-container-wrapper')
}

async function waitForSignInScreen(metamaskPage) {
  await metamaskPage.waitForSelector('#metamask-mascot-container')
}

async function waitForConfirmationPromt(metamaskPage) {
  return metamaskPage.waitForSelector('.page-subtitle')
}

async function waitForEthereum(metamaskPage) {
  await Promise.race([
    waitUntilStartConnectingToEthereum(metamaskPage),
    timeout(1)
  ])
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