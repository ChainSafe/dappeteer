import { Page } from 'puppeteer';

export const addToken = (page: Page) => async (tokenAddress: string): Promise<void> => {
  await page.bringToFront();

  const addTokenButton = await page.waitForSelector(
    '.box.import-token-link.box--flex-direction-row.box--text-align-center > a',
  );
  await addTokenButton.click();

  const addressInput = await page.waitForSelector('#custom-address');
  await addressInput.type(tokenAddress);

  await page.waitForTimeout(4000);

  const nextButton = await page.waitForSelector(`button[data-testid='page-container-footer-next']:not([disabled])`);
  await nextButton.click();

  const footerButtons = await page.$$('footer > button');
  await footerButtons[1].click();
};
