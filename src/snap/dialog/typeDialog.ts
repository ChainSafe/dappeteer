import { DappeteerPage } from "../../page";
import { retry } from "../../helpers";
import { ensureIsInDialog } from "./helpers";

export const typeDialog =
  (page: DappeteerPage) =>
  async (value: string): Promise<void> => {
    await retry(async () => {
      await ensureIsInDialog(page);
      await page.type(".snap-prompt input", value);
    }, 5);
  };
