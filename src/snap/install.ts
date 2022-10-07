import { Page } from "puppeteer";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { version } from "solc";
import {
  clickOnButton,
  clickOnElement,
  clickOnLogo,
  clickOnSettingsSwitch,
  openProfileDropdown,
} from "../helpers";
import { flaskOnly } from "./utils";

declare let window: { ethereum: MetaMaskInpageProvider };

export type InstallStep = (page: Page) => Promise<void>;

export async function installSnap(
  page: Page,
  snapId: string,
  opts: {
    hasPermissions: boolean;
    hasKeyPermissions: boolean;
    customSteps?: InstallStep[];
    version?: string;
  }
): Promise<void> {
  flaskOnly(page);
  //need to open page to access window.ethereum
  const installPage = await page.browser().newPage();
  await installPage.goto("https://google.com");
  await installPage.evaluate(
    (opts: { snapId: string; version?: string }) => {
      void window.ethereum.request({
        method: "wallet_enable",
        params: [
          {
            [`wallet_snap_${opts.snapId}`]: {
              version: opts.version ?? "latest",
            },
          },
        ],
      });
    },
    { snapId, version: opts.version }
  );
  await installPage.close({ runBeforeUnload: true });
  await page.bringToFront();
  await page.reload();
  await clickOnButton(page, "Connect");
  if (opts.hasPermissions) {
    await clickOnButton(page, "Approve & install");
    if (opts.hasKeyPermissions) {
      const checkbox = await page.waitForSelector(".checkbox-label", {
        visible: true,
      });
      await checkbox.click();
      await clickOnButton(page, "Confirm");
    }
  } else {
    await clickOnButton(page, "Install");
  }
  for (const step of opts.customSteps ?? []) {
    await step(page);
  }
  if (!(await isSnapInstalled(page, snapId))) {
    throw new Error("Failed to install snap " + snapId);
  }
}

export async function isSnapInstalled(
  page: Page,
  snapId: string
): Promise<boolean> {
  await page.bringToFront();
  await openProfileDropdown(page);

  await clickOnElement(page, "Settings");
  await clickOnElement(page, "Snaps");
  let found = false;
  try {
    await page.waitForXPath(`//*[contains(text(), '${snapId}')]`, {
      timeout: 5000,
    });
    found = true;
  } catch (e) {
    found = false;
  }
  await clickOnLogo(page);
  return found;
}
