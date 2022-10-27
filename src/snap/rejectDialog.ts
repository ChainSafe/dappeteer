import { Page } from "puppeteer";
import { clickOnButton } from "../helpers";

export const rejectDialog = (page: Page) => async (): Promise<void> => {
  await clickOnButton(page, "Reject");
};
