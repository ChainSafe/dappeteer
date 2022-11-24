import { DappeteerPage } from "../page";
import { NotificationItem } from "./types";

export async function waitForNotification(
  page: DappeteerPage
): Promise<NotificationItem> {
  await page.waitForSelector(".notifications__container");

  const notification = await page.evaluate(
    () =>
      new Promise<NotificationItem>((resolve) => {
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
              const element = mutation.addedNodes[0] as HTMLElement;
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

  return notification;
}
