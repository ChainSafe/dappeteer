import { Page } from "puppeteer";
import { clickOnButton } from "../helpers";

export const acceptDialog = (page: Page) => async (): Promise<void> => {
  await clickOnButton(page, "Approve");
};
