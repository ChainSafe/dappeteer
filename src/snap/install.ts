import { MetaMaskInpageProvider } from "@metamask/providers";
import {
  clickOnButton,
  clickOnElement,
  clickOnLogo,
  openProfileDropdown,
} from "../helpers";
import { DappeteerPage } from "../page";
import { flaskOnly } from "./utils";
import { InstallSnapResult } from "./types";

declare let window: { ethereum: MetaMaskInpageProvider };

export type InstallStep = (page: DappeteerPage) => Promise<void>;

export async function installSnap(
  page: DappeteerPage,
  snapId: string,
  opts: {
    hasPermissions: boolean;
    hasKeyPermissions: boolean;
    customSteps?: InstallStep[];
    version?: string;
  },
  installationSnapUrl: string = "https://google.com"
): Promise<InstallSnapResult> {
  flaskOnly(page);
  //need to open page to access window.ethereum
  const installPage = await page.browser().newPage();
  await installPage.goto(installationSnapUrl);
  const installAction = installPage.evaluate(
    (opts: { snapId: string; version?: string }) =>
      window.ethereum.request<{ snaps: { [snapId: string]: {} } }>({
        method: "wallet_enable",
        params: [
          {
            [`wallet_snap_${opts.snapId}`]: {
              version: opts.version ?? "latest",
            },
          },
        ],
      }),
    { snapId, version: opts.version }
  );

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

  const result = await installAction;
  await installPage.close({ runBeforeUnload: true });
  if (!(snapId in result.snaps)) {
    throw new Error("Failed to install snap");
  }

  return result as InstallSnapResult;
}

export async function isSnapInstalled(
  page: DappeteerPage,
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
