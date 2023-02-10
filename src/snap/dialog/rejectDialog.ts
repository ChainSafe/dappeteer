import { clickOnButton, retry } from "../../helpers";
import { DappeteerPage } from "../../page";
import { ensureIsInDialog } from "./helpers";

export const rejectDialog =
  (page: DappeteerPage) => async (): Promise<void> => {
    await retry(async () => {
      await ensureIsInDialog(page);
      await Promise.race([
        clickOnButton(page, "Reject", { timeout: 1000 }),
        clickOnButton(page, "Cancel", { timeout: 1000 }),
      ]);
    }, 5);
  };
