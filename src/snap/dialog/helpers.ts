import { DappeteerPage } from "../../page";
import { waitForOverlay } from "../../helpers";

export const ensureIsInDialog = async (page: DappeteerPage): Promise<void> => {
  await page.bringToFront();
  if (
    await page
      .waitForSelector(".snap-delineator__wrapper", { timeout: 500 })
      .catch(() => false)
  )
    return;
  await page.reload();
  await waitForOverlay(page);
};
