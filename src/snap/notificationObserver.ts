import { DappeteerPage } from "../page";
import { clickOnElement, openProfileDropdown } from "../helpers";
import { NotificationList } from "./types";

export const notificationObserver =
  (page: DappeteerPage) => async (): Promise<NotificationList> => {
    const notifications: NotificationList = [];

    await page.bringToFront();
    await openProfileDropdown(page);
    await clickOnElement(page, "Notifications");

    await page.exposeFunction("getItem", (message: string) => {
      notifications.push({ message });
    });

    await page.evaluate(() => {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length) {
            const element = mutation.addedNodes[0] as HTMLElement;
            window.getItem(element.innerText);
          }
        }
      });
      observer.observe(document.querySelector(".notifications__container"), {
        attributes: false,
        childList: true,
      });
    });

    return notifications;
  };
