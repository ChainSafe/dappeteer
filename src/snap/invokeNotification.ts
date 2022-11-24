import { DappeteerPage, Serializable } from "../page";
import { clickOnElement, openProfileDropdown } from "../helpers";
import { invokeSnap } from "./invokeSnap";
import { NotificationItem } from "./types";

async function waitForNotification(
  page: DappeteerPage
): Promise<NotificationItem> {
  await page.waitForSelector(".notifications__container");
  return await page.evaluate(
    () =>
      new Promise<NotificationItem>((resolve) => {
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
              const element = Array.from(mutation.addedNodes)[0] as HTMLElement;
              observer.takeRecords();
              observer.disconnect();
              resolve({ message: element.innerText });
            }
          }
        });
        observer.observe(document.querySelector(".notifications__container"), {
          childList: true,
        });
      })
  );
}

export const invokeNotification =
  (page: DappeteerPage) =>
  async <R = unknown, P extends Serializable = Serializable>(
    testPage: DappeteerPage,
    snapId: string,
    method: string,
    params?: P
  ): Promise<NotificationItem> => {
    await page.bringToFront();
    await openProfileDropdown(page);
    await clickOnElement(page, "Notifications");

    const newPage = await page.browser().newPage();
    await newPage.goto(page.url());

    await invokeSnap<R, P>(testPage, snapId, method, params);

    return await waitForNotification(page);
  };
