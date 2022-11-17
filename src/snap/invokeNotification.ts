import { DappeteerPage, Serializable } from "../page";
import { clickOnElement, openProfileDropdown } from "../helpers";
import { invokeSnap } from "./invokeSnap";

async function waitForNotification(page: DappeteerPage): Promise<void> {
  await page.waitForSelector(".notifications__container");
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
              const element = mutation.addedNodes[0] as HTMLElement;
              resolve(element.innerText);
              observer.disconnect();
            }
          }
        });
        observer.observe(document.querySelector(".notifications__container"), {
          attributes: false,
          childList: true,
        });
      })
  );
}

export const invokeNotification =
  (page: DappeteerPage) =>
  async <R = unknown, P extends Serializable = Serializable>(
    testPage: DappeteerPage,
    snapId: string,
    method: string,
    params?: P
  ): ReturnType<typeof window.ethereum.request<R>> => {
    await page.bringToFront();
    await openProfileDropdown(page);
    await clickOnElement(page, "Notifications");

    const newPage = await page.browser().newPage();
    await newPage.goto(page.url());

    const snapResult = await invokeSnap<R, P>(testPage, snapId, method, params);

    await waitForNotification(newPage);

    return snapResult;
  };
