import { clickOnElement, profileDropdownClick } from "../helpers";
import { DappeteerPage } from "../page";
import { NotificationList } from "./types";

export const getAllNotifications =
  (page: DappeteerPage) => async (): Promise<NotificationList> => {
    await page.bringToFront();
    await profileDropdownClick(page);
    await clickOnElement(page, "Notifications");
    await page.waitForSelector(".notifications__item__details__message");
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
