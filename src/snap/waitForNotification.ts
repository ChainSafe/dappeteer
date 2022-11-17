import { DappeteerPage } from "../page";

export function waitForNotification(page: DappeteerPage) {
  return async function (): Promise<any> {
    await page.evaluate(async () => {
      return new Promise((resolve) => {
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
      });
    });
  };
}
