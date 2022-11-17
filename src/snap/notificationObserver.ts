import { DappeteerPage } from "../page";
import { clickOnElement, openProfileDropdown } from "../helpers";
import { NotificationList } from "./types";

export const notificationObserver =
  (page: DappeteerPage) =>
  async (): Promise<{
    notifications: NotificationList;
    waitForNotification: () => Promise<any>;
  }> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    const notifications: NotificationList = [];

    await page.exposeFunction("getItem", (message: string) => {
      notifications.push({ message });
    });

    async function waitForNotification(): Promise<any> {
      await page.evaluate(async () => {
        return new Promise((resolve) => {
          const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
              if (mutation.addedNodes.length) {
                const element = mutation.addedNodes[0] as HTMLElement;
                window.getItem(element.innerText);
                resolve(element.innerText);
                observer.disconnect();
              }
            }
          });
          observer.observe(
            document.querySelector(".notifications__container"),
            {
              attributes: false,
              childList: true,
            }
          );
        });
      }, notifications);
    }

    await page.bringToFront();
    await openProfileDropdown(page);
    await clickOnElement(page, "Notifications");

    return { notifications, waitForNotification };
  };
