import { DappeteerPage } from "../../page";
import { retry, waitForOverlay } from "../../helpers";

export const typeDialog =
  (page: DappeteerPage) =>
  async (value: string): Promise<void> => {
    await retry(async () => {
      await page.bringToFront();
      await page.reload();
      await waitForOverlay(page);
      const input = await page.$(".snap-prompt");
      await input.type(value);
    }, 5);
  };
