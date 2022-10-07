import { Page } from "puppeteer";

import { TransactionOptions } from "..";
import { clickOnButton, typeOnInputField } from "../helpers";

import { GetSingedIn } from "./index";

const MIN_GAS = 21000;

export const confirmTransaction =
  (page: Page, getSingedIn: GetSingedIn) =>
  async (options?: TransactionOptions): Promise<void> => {
    await page.bringToFront();
    if (!(await getSingedIn())) {
      throw new Error("You haven't signed in yet");
    }
    await page.waitForTimeout(500);
    await page.reload();

    if (options) {
      await clickOnButton(page, "Edit");
      await clickOnButton(page, "Edit suggested gas fee");
      //non EIP1559 networks don't have priority fee. TODO: run separate Ganache with older hardfork to test this
      let priority = false;
      if (options.priority) {
        priority = await typeOnInputField(
          page,
          "Max priority fee",
          String(options.priority),
          true,
          true,
          true
        );
      }
      if (options.gasLimit && options.gasLimit >= MIN_GAS)
        await typeOnInputField(
          page,
          "Gas Limit",
          String(options.gasLimit),
          true
        );
      if (options.gas && options.gasLimit >= MIN_GAS)
        await typeOnInputField(
          page,
          priority ? "Max fee" : "Gas Limit",
          String(options.gasLimit),
          true
        );

      await clickOnButton(page, "Save");
    }
    await clickOnButton(page, "Confirm");
  };
