import { Page } from 'puppeteer'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const approve = (page: Page, selectAll: boolean, version?: string) => async (): Promise<void> => {
  await page.bringToFront();
  await page.reload();

  try {
    if (selectAll) {
      const checkbox = await page.waitForSelector(".permissions-connect-choose-account__select-all > input", {
        timeout: 3000,
      });
      if (checkbox) await checkbox.click({ clickCount: 2 });
    }
  } catch (error) {
    console.log("Couldnt select all, maybe there is only one available.");
  }

  const button = await page.waitForSelector("button.button.btn-primary", { timeout: 3000 });
  if (button) await button.click();

  const connectButton = await page.waitForSelector("button.button.btn-primary", { timeout: 3000 });
  if (connectButton) await connectButton.click();
}
