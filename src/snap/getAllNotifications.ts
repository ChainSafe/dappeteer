import { Page } from "puppeteer";
import { clickOnElement, openProfileDropdown } from "../helpers";
import { NotificationList } from "./types";

export const getAllNotifications =
  (page: Page) => async (): Promise<NotificationList> => {
    await page.bringToFront();
    await openProfileDropdown(page);
    await clickOnElement(page, "Notifications");
    await page.waitForTimeout(300);
    const notificationList: NotificationList = await page.$$eval(
      ".notifications__item__details__message",
      (elements) =>
        elements.map((element) => ({ message: element.textContent }))
    );
    const backButton = await page.waitForSelector(
      ".notifications__header__title-container__back-button"
    );

    await backButton.click();
    return notificationList;
  };
