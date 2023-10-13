import { StrictEventEmitter } from "strict-event-emitter";
import { DappeteerPage } from "../page";
import { accountOptionsDropdownClick, clickOnElement } from "../helpers";
import { NotificationItem, NotificationList } from "./types";

interface EventsMap {
  notification: (notification: NotificationItem) => void;
}

class NotificationsEmitter extends StrictEventEmitter<EventsMap> {
  private notificationsTab: DappeteerPage;

  constructor(
    private page: DappeteerPage,
    private notificationTimeout: number = 30000
  ) {
    super();
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
    const newPage = await this.page.browser().newPage();
    await newPage.goto(this.page.url());

    await accountOptionsDropdownClick(newPage);
    await clickOnElement(newPage, "Notifications");

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
}

export default NotificationsEmitter;
