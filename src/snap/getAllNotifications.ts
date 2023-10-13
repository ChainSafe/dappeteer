import { accountOptionsDropdownClick, clickOnElement } from "../helpers";
import { DappeteerPage } from "../page";
import { NotificationList } from "./types";

export const getAllNotifications =
  (page: DappeteerPage) => async (): Promise<NotificationList> => {
    await page.bringToFront();
    await accountOptionsDropdownClick(page);
    await clickOnElement(page, "Notifications");
    await page.waitForSelector(".notifications__item__details__message");
    return await page.$$eval(
      ".notifications__item__details__message",
      (elements) =>
        elements.map((element) => ({ message: element.textContent }))
    );
  };
