import {
  keplrMnemonic,
  keplrPassowrd,
  keplrWalletName,
} from '../../test/constant';
import { getElementByContent } from '../helpers';
import { DappeteerPage } from '../page';

export async function importAccount(keplrPage: DappeteerPage): Promise<void> {
  let importWalletButton = await getElementByContent(
    keplrPage,
    'Import an existing wallet'
  );
  await importWalletButton.click();

  let recoveryPhraseButton = await getElementByContent(
    keplrPage,
    'Use recovery phrase or private key'
  );
  await recoveryPhraseButton.click();

  let mnemonicButton = await getElementByContent(keplrPage, '24 words');
  await mnemonicButton.click();

  const passwordFields = await keplrPage.$$('input[type="password"]');
  const words = keplrMnemonic.split(' ');

  let index = 0;
  for (const field of passwordFields) {
    await field.type(words[index]);
    index += 1;
  }

  const importButton = await keplrPage.waitForSelector(
    'div.sc-bczRLJ.gclPdw button.sc-bZkfAO.jGdbNJ'
  );
  await importButton.click();

  const walletNameField = await keplrPage.waitForSelector(
    'input[placeholder="e.g. Trading, NFT Vault, Investment"].sc-iAvgwm.kEpgcC'
  );
  await walletNameField.click();
  await walletNameField.type(keplrWalletName);

  const passwordFieldSelector =
    'input[name="password"][placeholder="At least 8 characters in length"].sc-iAvgwm.kEpgcC';
  const confirmPasswordSelector =
    'input[name="confirmPassword"][placeholder="At least 8 characters in length"].sc-iAvgwm.kEpgcC';

  const passwordField = await keplrPage.$(passwordFieldSelector);
  await passwordField.type(keplrPassowrd);

  const confirmPasswordField = await keplrPage.$(confirmPasswordSelector);
  await confirmPasswordField.type(keplrPassowrd);

  let nextButton = await getElementByContent(keplrPage, 'Next');
  await nextButton.click();
  await new Promise((resolve) => setTimeout(resolve, 5000));

  await keplrPage.evaluate(() => {
    function containsText(element: Element, text: string): boolean {
      if (element.textContent && element.textContent.includes(text)) {
        return true;
      }

      for (let i = 0; i < element.children.length; i++) {
        if (containsText(element.children[i], text)) {
          return true;
        }
      }
      return false;
    }

    const divs = document.querySelectorAll('div.sc-bczRLJ.eOeinv');
    const divArray = Array.from(divs);

    let targetDiv: Element | undefined;

    for (let div of divArray) {
      if (containsText(div, 'Agoric')) {
        targetDiv = div;
        break;
      }
    }

    if (targetDiv) {
      const checkboxes = targetDiv.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox: Element) => {
        (checkbox as HTMLInputElement).click();
      });
    }
  });

  let saveButton = await getElementByContent(keplrPage, 'Save');
  await saveButton.click();

  let finsihButton = await getElementByContent(keplrPage, 'Finish');
  await finsihButton.click();

  await new Promise((resolve) => setTimeout(resolve, 5000));
}
