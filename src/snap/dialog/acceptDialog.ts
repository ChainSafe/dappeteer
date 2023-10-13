import { clickOnButton, retry } from "../../helpers";
import { DappeteerPage } from "../../page";
import { ensureIsInDialog } from "./helpers";

export const acceptDialog =
  (page: DappeteerPage) => async (): Promise<void> => {
    await retry(async () => {
      await ensureIsInDialog(page);
      await Promise.race([
        clickOnButton(page, "Approve", { timeout: 1000 }),
        clickOnButton(page, "Ok", { timeout: 1000 }),
        clickOnButton(page, "OK", { timeout: 1000 }),
        clickOnButton(page, "Submit", { timeout: 1000 }),
      ]);
    }, 5);
  };
