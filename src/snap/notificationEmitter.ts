import { EventEmitter } from "events";
import { DappeteerPage } from "../page";
import { clickOnElement, openProfileDropdown } from "../helpers";
import { NotificationItem, NotificationList } from "./types";

export const notificationEmitter = async (
  page: DappeteerPage
): Promise<{ emitter: EventEmitter; notifications: NotificationList }> => {
  const notifications: NotificationList = [];
  const emitter: EventEmitter = new EventEmitter();

  emitter.on("newNotification", (notification: NotificationItem) => {
    notifications.push(notification);
  });

  await page.bringToFront();
  await openProfileDropdown(page);
  await clickOnElement(page, "Notifications");

  const newPage = await page.browser().newPage();
  await newPage.goto(page.url());

  await newPage.waitForSelector(".notifications__container");
  await newPage.exposeFunction(
    "emitNotification",
    (notification: NotificationItem) => {
      emitter.emit("newNotification", notification);
    }
  );
  await newPage.evaluate(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          const element = mutation.addedNodes[0] as HTMLElement;
          window.emitNotification({ message: element.innerText });
          observer.disconnect();
        }
      }
    });
    observer.observe(document.querySelector(".notifications__container"), {
      childList: true,
    });
  });

  return { emitter, notifications };
};
