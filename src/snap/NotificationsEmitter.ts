import { StrictEventEmitter } from "strict-event-emitter";
import { DappeteerPage } from "../page";
import * as dappeteer from "../../src";
import { clickOnElement, profileDropdownClick } from "../helpers";
import { NotificationItem, NotificationList } from "./types";

interface EventsMap {
  notification: (notification: NotificationItem) => void;
}

class NotificationsEmitter extends StrictEventEmitter<EventsMap> {
  private notificationsTab: DappeteerPage;
  private readonly page: DappeteerPage;

  constructor(
    protected metamask: dappeteer.Dappeteer,
    private notificationTimeout: number = 30000
  ) {
    super();
    this.page = metamask.page;
  }

  private async exposeEmitNotificationToWindow(): Promise<void> {
    await this.notificationsTab.exposeFunction(
      "emitNotification",
      (notification: NotificationItem) => {
        this.emit("notification", notification);
      }
    );
  }

  private async openNotificationPage(): Promise<void> {
    await this.page.bringToFront();
    await profileDropdownClick(this.page);
    await clickOnElement(this.page, "Notifications");

    const newPage = await this.page.browser().newPage();
    await newPage.goto(this.page.url());

    await newPage.waitForSelector(".notifications__container", {
      timeout: this.notificationTimeout,
    });
    this.notificationsTab = newPage;
  }

  private async observeNotificationsMutation(): Promise<void> {
    await this.notificationsTab.evaluate(() => {
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
  }

  public async setup(): Promise<void> {
    await this.openNotificationPage();
    await this.exposeEmitNotificationToWindow();
    await this.observeNotificationsMutation();
  }

  public async cleanup(): Promise<void> {
    this.removeAllListeners("notification");
    await this.notificationsTab.close();
  }

  public async waitForNotification(): Promise<NotificationList> {
    return (await NotificationsEmitter.once(
      this,
      "notification"
    )) as NotificationList;
  }

  public async getAllNotifications(): Promise<NotificationList> {
    return await this.metamask.snaps.getAllNotifications();
  }
}

export default NotificationsEmitter;
