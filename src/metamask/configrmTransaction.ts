import { Page } from "puppeteer";

import { TransactionOptions } from "..";

import { GetSingedIn } from "./index";

export const confirmTransaction = (page: Page, getSingedIn: GetSingedIn, version?: string) => async (options: TransactionOptions) => {
  await page.bringToFront();
  if (!await getSingedIn()) {
    throw new Error("You haven't signed in yet");
  }
  await page.waitForTimeout(500);
  await page.reload();
  if (options) {
    if (options.gas) {
      const gasSelector = '.advanced-gas-inputs__gas-edit-row:nth-child(1) input';
      const gas = await page.waitForSelector(gasSelector);

      await page.evaluate(
        () =>
          ((document.querySelectorAll(
            '.advanced-gas-inputs__gas-edit-row:nth-child(1) input'
          )[0] as HTMLInputElement).value = '')
      );
      await gas.type(options.gas.toString());
    }

    if (options.gasLimit) {
      const gasLimitSelector = '.advanced-gas-inputs__gas-edit-row:nth-child(2) input';
      const gasLimit = await page.waitForSelector(gasLimitSelector);

      await page.evaluate(
        () =>
          ((document.querySelectorAll(
            '.advanced-gas-inputs__gas-edit-row:nth-child(2) input'
          )[0] as HTMLInputElement).value = '')
      );
      await gasLimit.type(options.gasLimit.toString());
    }
  }
  const confirmButton = await page.waitForSelector('.btn-primary');
  await confirmButton.click();
};
