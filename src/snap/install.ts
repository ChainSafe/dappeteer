import fs from "fs";
import http from "http";
import { MetaMaskInpageProvider } from "@metamask/providers";
import {
  clickOnButton,
  clickOnElement,
  clickOnLogo,
  profileDropdownClick,
} from "../helpers";
import { DappeteerPage } from "../page";
import { startSnapServer, toUrl } from "./install-utils";
import { flaskOnly } from "./utils";
import { InstallSnapResult } from "./types";

declare let window: { ethereum: MetaMaskInpageProvider };

export type InstallStep = (page: DappeteerPage) => Promise<void>;

export type InstallSnapOptions = {
  hasPermissions: boolean;
  hasKeyPermissions: boolean;
  customSteps?: InstallStep[];
  version?: string;
  installationSnapUrl?: string;
};

export const installSnap =
  (page: DappeteerPage) =>
  async (
    snapIdOrLocation: string,
    opts: InstallSnapOptions
  ): Promise<string> => {
    flaskOnly(page);
    //need to open page to access window.ethereum
    const installPage = await page.browser().newPage();
    await installPage.goto(opts.installationSnapUrl ?? "https://google.com");
    let snapServer: http.Server | undefined;
    if (fs.existsSync(snapIdOrLocation)) {
      //snap dist location
      snapServer = await startSnapServer(snapIdOrLocation);
      snapIdOrLocation = `local:${toUrl(snapServer.address())}`;
    }
    const installAction = installPage.evaluate(
      (opts: { snapId: string; version?: string }) =>
        window.ethereum.request<InstallSnapResult>({
          method: "wallet_enable",
          params: [
            {
              [`wallet_snap_${opts.snapId}`]: {
                version: opts.version ?? "latest",
              },
            },
          ],
        }),
      { snapId: snapIdOrLocation, version: opts.version }
    );

    await page.bringToFront();
    await page.reload();
    await clickOnButton(page, "Connect");
    if (opts.hasPermissions) {
      await clickOnButton(page, "Approve & install");
      if (opts.hasKeyPermissions) {
        await page.waitForSelector(".checkbox-label", {
          visible: true,
        });
        for await (const checkbox of await page.$$(".checkbox-label")) {
          await checkbox.click();
        }
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
    if (!(snapIdOrLocation in result.snaps)) {
      throw new Error("Failed to install snap");
    }
    snapServer.close();
    return snapIdOrLocation;
  };

export async function isSnapInstalled(
  page: DappeteerPage,
  snapId: string
): Promise<boolean> {
  await page.bringToFront();
  await profileDropdownClick(page);

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
