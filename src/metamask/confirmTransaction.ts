import { TransactionOptions } from "..";
import {
  clickOnButton,
  getElementByTestId,
  retry,
  typeOnInputField,
  waitForOverlay,
} from "../helpers";
import { DappeteerPage } from "../page";

import { GetSingedIn } from "./index";

export const confirmTransaction =
  (page: DappeteerPage, getSingedIn: GetSingedIn) =>
  async (options?: TransactionOptions): Promise<void> => {
    await page.bringToFront();
    if (!(await getSingedIn())) {
      throw new Error("You haven't signed in yet");
    }

    //retry till we get prompt
    await retry(async () => {
      await page.bringToFront();
      await page.reload();
      await waitForOverlay(page);
      await getElementByTestId(page, "edit-gas-fee-button", {
        timeout: 500,
      });
    }, 15);

    if (options) {
      await clickOnButton(page, "edit-gas-fee-button");
      await clickOnButton(page, "edit-gas-fee-item-custom");
      //non EIP1559 networks don't have priority fee. TODO: run separate Ganache with older hardfork to test this
      if (options.priority)
        await typeOnInputField(
          page,
          "Priority Fee", // priority-fee-input
          String(options.priority),
          true,
          true,
          true
        );
      if (options.gas)
        await typeOnInputField(
          page,
          "Max base fee", // base-fee-input
          String(options.priority),
          true,
          true,
          true
        );
      if (options.gasLimit) {
        await clickOnButton(page, "advanced-gas-fee-edit");
        await typeOnInputField(
          page,
          "Gas limit", // gas-limit-input
          String(options.priority),
          true,
          true,
          true
        );
      }

      await clickOnButton(page, "Save");
    }

    await page.waitForSelector(
      '[data-testid="page-container-footer-next"]:not([disabled])'
    );
    await clickOnButton(page, "Confirm");
  };
