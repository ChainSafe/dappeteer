import { EventEmitter } from "events";
import { clickOnElement, openProfileDropdown } from "../helpers";
import { DappeteerPage } from "../page";

export const notificationEmitter =
  (page: DappeteerPage) => async (): Promise<EventEmitter> => {
    const prevLength = 0;
    const currentLength = 0;
    const emitter = new EventEmitter();

    await page.bringToFront();
    await openProfileDropdown(page);
    await clickOnElement(page, "Notifications");

    await Promise.race([
      page.waitForFunction(
        (emitter) => {
          const messages = document.querySelectorAll(
            ".notifications__item__details__message"
          );

          if (messages.length !== 0) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            emitter.emit("newNotification");
          }
        },
        {},
        emitter
      ),
      new Promise((r) => setTimeout(r, 1000)),
    ]);

    if (prevLength === currentLength) {
      emitter.emit("newNotification");
    }

    return emitter;
  };
