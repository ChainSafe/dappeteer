const path = require('path')

const timeout = seconds =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000))

module.exports = {
  launch: async (puppeteer, options = {}) => {
    const { args, ...rest } = options

    const METAMASK_VERSION = options.metamaskVersion || '4.7.4'
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
  getMetamask: async (browser, options = {}) => {
    // close annoying popup
    browser.on('targetcreated', async target => {
      if (target.url() === 'https://metamask.io/#how-it-works') {
        try {
          const page = await target.page()
          await page.close()
        } catch (e) {}
        return
      }
    })

    const EXTENSION_ID =
      options.extensionId || 'nkbihfbeogaeaoehlefnkodbefgpgknn'
    const EXTENSION_URL =
      options.extensionUrl || `chrome-extension://${EXTENSION_ID}/popup.html`

    const metamaskPage = await browser.newPage()
    await metamaskPage.goto(EXTENSION_URL)
    await acceptTerms(metamaskPage)

    let signedIn = false

    return {
      createAccount: async (password = 'password1234') => {
        if (signedIn) {
          throw new Error(
            "You can't create a new account because you have already signed in to MetaMask"
          )
        }
        await metamaskPage.bringToFront()
        const passwordBox = await metamaskPage.$('#password-box')
        await passwordBox.type(password)
        const passwordConfirm = await metamaskPage.$('#password-box-confirm')
        await passwordConfirm.type(password)
        const createButton = await metamaskPage.$('button')
        await createButton.click()
        await metamaskPage.waitFor(
          () =>
            document
              .querySelector('button.primary')
              .innerHTML.indexOf("I've copied it somewhere safe") != -1
        )
        const acknowledgeButton = (await metamaskPage.$$('button.primary'))[0]
        await acknowledgeButton.click()
        await waitForUnlockedScreen(metamaskPage)
        signedIn = true
      },

      importAccount: async (seed, password = 'password1234') => {
        if (signedIn) {
          throw new Error(
            "You can't import a new account because you have already signed in to MetaMask"
          )
        }
        await metamaskPage.bringToFront()
        const importButton = await metamaskPage.$('p.pointer')
        await importButton.click()
        const textarea = await metamaskPage.$('textarea')
        await textarea.type(seed)
        const passwordBox = await metamaskPage.$('#password-box')
        await passwordBox.type(password)
        const passwordConfirm = await metamaskPage.$('#password-box-confirm')
        await passwordConfirm.type(password)
        const acceptButton = (await metamaskPage.$$('button'))[1]
        await acceptButton.click()
        signedIn = true
        await waitForUnlockedScreen(metamaskPage)
      },

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

      switchNetwork: async (network = 'main') => {
        await metamaskPage.bringToFront()
        const networkSwitcher = await metamaskPage.$('.network-indicator')
        await networkSwitcher.click()
        await timeout(0.5)
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

      confirmTransaction: async (options = {}) => {
        await metamaskPage.bringToFront()
        if (!signedIn) {
          throw new Error("You haven't signed in yet")
        }
        await metamaskPage.reload()
        await waitForConfirmationPromt(metamaskPage)
        await waitForGasEstimation(metamaskPage)

        const inputs = await metamaskPage.$$('input[type="number"].hex-input')

        const gasLimit = options.gasLimit || 100000
        const gas = options.gas || 20

        await metamaskPage.evaluate(
          () =>
            (document.querySelectorAll(
              'input[type="number"].hex-input'
            )[0].value =
              '')
        )
        await inputs[0].type(gasLimit.toString())

        await metamaskPage.evaluate(
          () =>
            (document.querySelectorAll(
              'input[type="number"].hex-input'
            )[1].value =
              '')
        )
        await inputs[1].type(gas.toString())

        await metamaskPage.waitFor(
          () => !document.querySelector('input[type="submit"].confirm').disabled
        )
        const confirmButton = await metamaskPage.$(
          'input[type="submit"].confirm'
        )
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

async function acceptTerms(metamaskPage) {
  await waitForEthereum(metamaskPage)
  const acceptButton = await metamaskPage.$('button')
  await acceptButton.click()
  await metamaskPage.waitForSelector('div.markdown')
  const termsOfUse = await metamaskPage.$('div.markdown')
  await metamaskPage.evaluate(termsOfUse => {
    termsOfUse.scrollTo(0, termsOfUse.scrollHeight)
    return termsOfUse.scrollHeight
  }, termsOfUse)
  await metamaskPage.waitFor(
    () => document.querySelector('button:disabled') == null
  )
  const acceptButton2 = await metamaskPage.$('button')
  await acceptButton2.click()
  await waitForSignInScreen(metamaskPage)
}

async function waitForUnlockedScreen(metamaskPage) {
  await metamaskPage.waitForSelector('.identicon-wrapper')
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

async function waitForGasEstimation(metamaskPage) {
  await Promise.race([waitUntilStartEstimatingGas(metamaskPage), timeout(1)])
  await Promise.race([waitUntilGasEstimated(metamaskPage), timeout(10)])
}

async function waitUntilStartEstimatingGas(metamaskPage) {
  await metamaskPage.waitFor(() => {
    return !!document.querySelector('img[src="images/loading.svg"]')
  })
}

async function waitUntilGasEstimated(metamaskPage) {
  await metamaskPage.waitFor(() => {
    return document.querySelector('img[src="images/loading.svg"]') == null
  })
}
